const { app, BrowserWindow, ipcMain, desktopCapturer, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

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

ipcMain.handle('SHOW_SAVE_DIALOG', async () => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `capture-${Date.now()}.webm`,
    filters: [{ name: 'Videos', extensions: ['webm'] }],
  });

  return filePath;
});

ipcMain.handle('SAVE_VIDEO_FILE', async (event, buffer, filePath) => {
  try {
    await fs.promises.writeFile(filePath, Buffer.from(buffer));
    console.log('Video saved successfully!');
  } catch (error) {
    console.error('Failed to save video:', error);
  }
});
