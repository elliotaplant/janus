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

  getScreenStream: async () => {
    const inputSources = await desktopCapturer.getSources({
      types: ['window', 'screen'],
    });

    try {
      const screenStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: inputSources[0].id,
          },
        },
      });
      return screenStream;
    } catch (error) {
      console.error('Error getting screen stream', error);
      throw error;
    }
  },

  getAudioStream: async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return audioStream;
    } catch (error) {
      console.error('Error getting audio stream', error);
      throw error;
    }
  },
});

contextBridge.exposeInMainWorld('desktopCapturer', {
  getDesktopStream: async () => {
    const sourceId = await ipcRenderer.invoke('REQUEST_DESKTOP_CAPTURE');
    return navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
        },
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
        },
      },
    });
  },
});
