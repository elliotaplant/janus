document.addEventListener('DOMContentLoaded', () => {
  const cameraFeed = document.getElementById('cameraFeed');

  // Directly pass the video element to the preload script to handle the stream
  window.electronAPI.handleStream(cameraFeed);
});
