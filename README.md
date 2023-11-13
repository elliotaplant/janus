# Janus

Janus is a simple screen camera, screen, and microphone audio recorder with no time limits and no cloud storage.
Outputs .WebM or .mp4 files.
An install once and use forever alternative to Loom.
No cloud, no subscription, no time limits.

## Description

Janus lets you record your screen, microphone audio, and camera simultaneously. Like Loom, you can use it to record visual demos with ease. Unlike loom, there's no limit on your recording times and the output of the recording is a file you can share however you like.

## Packaging

You'll need to create an `ffmpeg-binaries` directory with this structure:

```
ffmpeg-binaries
├── linux
│   └── ffmpeg
├── darwin
│   └── ffmpeg
└── win
    └── ffmpeg.exe
```
