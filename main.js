const { app, BrowserWindow, ipcMain, desktopCapturer } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false, // Set to false to use ipcRenderer in preload script
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

ipcMain.handle('REQUEST_DESKTOP_CAPTURE', async (event, sourceId) => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });

  // You could filter or let the user select a source here
  for (const source of sources) {
    if (source.name === 'Entire Screen') {
      return source.id;
    }
  }
});
