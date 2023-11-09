const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
