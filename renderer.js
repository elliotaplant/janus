// In renderer.js or cameraRenderer.js
let mediaRecorder;
const recordedChunks = [];

const startRecording = async () => {
  console.log('starting recording');
  const screenStream = await window.electronAPI.getScreenStream();
  const audioStream = await window.electronAPI.getAudioStream();
  const combinedStream = new MediaStream([
    ...screenStream.getVideoTracks(),
    ...audioStream.getAudioTracks(),
  ]);

  mediaRecorder = new MediaRecorder(combinedStream);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
  mediaRecorder.start();
};

const stopRecording = () => {
  mediaRecorder.stop();
};

const handleDataAvailable = (event) => {
  console.log('data-available');
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    console.log(`Received ${event.data.size} bytes of data.`);
  }
};

const handleStop = async () => {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp8',
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { dialog } = require('electron').remote;
  const { writeFile } = require('fs');

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`,
  });

  if (filePath) {
    writeFile(filePath, buffer, () => console.log('video saved successfully!'));
  }
};

// Further in renderer.js or cameraRenderer.js
document.getElementById('startRecording').addEventListener('click', startRecording);
document.getElementById('stopRecording').addEventListener('click', stopRecording);
