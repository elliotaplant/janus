const { contextBridge } = require('electron');

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
});
