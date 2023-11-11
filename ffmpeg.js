const os = require('os');
const path = require('path');

function getFFmpegPath() {
  const platform = os.platform();
  switch (platform) {
    case 'win32':
      return path.join(__dirname, 'ffmpeg-binaries/win/ffmpeg.exe');
    case 'darwin':
      return path.join(__dirname, 'ffmpeg-binaries/mac/ffmpeg');
    case 'linux':
      return path.join(__dirname, 'ffmpeg-binaries/linux/ffmpeg');
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

const ffmpegPath = getFFmpegPath();
