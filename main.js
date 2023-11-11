const { app, BrowserWindow, ipcMain, desktopCapturer, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // This needs to be true
      enableRemoteModule: false, // Recommended to disable the remote module for security
    },
  });

  win.loadFile('index.html');
}

function createCameraWindow() {
  const cameraWindow = new BrowserWindow({
    width: 160,
    height: 160,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  cameraWindow.loadFile('camera.html');

  // Remove the window from memory when closed
  cameraWindow.on('closed', () => {
    cameraWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  createCameraWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('GET_DESKTOP_AND_AUDIO_STREAM', async () => {
  try {
    const inputSources = await desktopCapturer.getSources({ types: ['screen'] });
    const screenSourceId = inputSources[0].id; // Using the first screen source

    return screenSourceId;
  } catch (error) {
    console.error('Error in desktopCapturer:', error);
    throw error;
  }
});

ipcMain.handle('SHOW_SAVE_DIALOG', async (event, extension) => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `capture-${Date.now()}${extension}`,
    filters: [{ name: 'Videos', extensions: [extension] }],
  });

  return filePath;
});

ipcMain.handle('SAVE_VIDEO_FILE', async (event, buffer, filePath, format) => {
  try {
    if (format === 'mp4') {
      // First save as WebM
      const webmPath = filePath.replace('.mp4', '.webm');
      await fs.promises.writeFile(webmPath, Buffer.from(buffer));

      // Convert to MP4
      await convertWebMToMP4(webmPath, filePath);

      // Optionally, delete the original WebM file
      await fs.promises.unlink(webmPath);
    } else {
      // Save as WebM
      await fs.promises.writeFile(filePath, Buffer.from(buffer));
    }

    console.log('Video saved successfully!');
  } catch (error) {
    console.error('Failed to save or convert video:', error);
  }
});

ipcMain.handle('ASK_FOR_FORMAT', async () => {
  const options = {
    type: 'question',
    buttons: ['WebM', 'MP4'],
    title: 'Select Format',
    message: 'Which file format would you like to save the video in?',
  };

  const { response } = await dialog.showMessageBox(options);
  return response === 1 ? 'mp4' : 'webm';
});

function convertWebMToMP4(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i',
      inputPath,
      '-vcodec',
      'libx264',
      '-acodec',
      'aac',
      outputPath,
    ]);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}
