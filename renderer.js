const startCaptureButton = document.getElementById('startCapture');
const stopCaptureButton = document.getElementById('stopCapture');
let mediaRecorder;
const recordedChunks = [];

startCaptureButton.addEventListener('click', async () => {
  try {
    const screenSourceId = await window.electronAPI.getDesktopAndAudioStream();

    const screenStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenSourceId,
        },
      },
    });

    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const combinedStream = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...audioStream.getAudioTracks(),
    ]);

    mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp8' });
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.start();
  } catch (err) {
    console.error('Error capturing screen and audio:', err);
  }
});

stopCaptureButton.addEventListener('click', () => {
  mediaRecorder.stop();
});

function handleDataAvailable(e) {
  recordedChunks.push(e.data);
}

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp8',
  });

  const buffer = await blob.arrayBuffer();
  const format = await window.electronAPI.askForFormat(); // Ask for format

  const filePath = await window.electronAPI.showSaveDialog();

  if (filePath) {
    await window.electronAPI.saveVideoFile(buffer, filePath);
  }
}
