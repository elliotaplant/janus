const controls = document.getElementById('controls');
const controlButton = document.getElementById('control-btn');
let mediaRecorder;
const recordedChunks = [];

controlButton.addEventListener('click', async () => {
  try {
    if (mediaRecorder) {
      mediaRecorder.stop();
    } else {
      await startRecording();
    }
  } catch (err) {
    console.error('Error capturing screen and audio:', err);
  }
});

async function startRecording() {
  try {
    controls.classList.add('recording');
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
    mediaRecorder = null;
    controls.classList.remove('recording');
    // alert the user of an error
  }
}

function handleDataAvailable(e) {
  recordedChunks.push(e.data);
}

async function handleStop() {
  try {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm; codecs=vp8',
    });

    const buffer = await blob.arrayBuffer();
    const format = await window.electronAPI.askForFormat(); // Ask for format

    const extension = format === 'mp4' ? '.mp4' : '.webm';
    const filePath = await window.electronAPI.showSaveDialog(extension); // Pass the chosen extension

    if (filePath) {
      await window.electronAPI.saveVideoFile(buffer, filePath, format);
    }
  } catch (error) {
    console.error('Error saving video:', err);
    // alert the user of an error
  }
  mediaRecorder = null;
  controls.classList.remove('recording');
}

document.addEventListener('DOMContentLoaded', () => {
  const cameraFeed = document.getElementById('cameraFeed');

  // Directly pass the video element to the preload script to handle the stream
  window.electronAPI.handleStream(cameraFeed);
});
