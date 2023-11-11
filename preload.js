const { contextBridge, desktopCapturer, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  handleStream: (videoElement) => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((error) => {
        console.error('Stream error:', error);
      });
  },

  getDesktopAndAudioStream: () => ipcRenderer.invoke('GET_DESKTOP_AND_AUDIO_STREAM'),
  saveVideoFile: (buffer, filePath, format) =>
    ipcRenderer.invoke('SAVE_VIDEO_FILE', buffer, filePath, format),
  askForFormat: () => ipcRenderer.invoke('ASK_FOR_FORMAT'),

  showSaveDialog: async () => {
    return ipcRenderer.invoke('SHOW_SAVE_DIALOG');
  },
});
