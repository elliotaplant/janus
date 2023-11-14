# Janus

Janus is a simple screen camera, screen, and microphone audio recorder with no time limits and no cloud storage.
Outputs .WebM or .mp4 files.
An install once and use forever alternative to Loom.
No cloud, no subscription, no time limits.

## Description

Janus lets you record your screen, microphone audio, and camera simultaneously. Like Loom, you can use it to record visual demos with ease. Unlike loom, there's no limit on your recording times and the output of the recording is a file you can share however you like.

Janus is an Electron-based desktop application designed to offer streamlined screen recording functionalities with integrated camera feed. Its user-friendly interface and efficient recording process make it ideal for creating tutorials, presentations, or any screen-related content.

Unlike Loom, Janus does not require a paid subscription, and it outputs is files on your computer.

## Features

- **Screen Recording**: Capture your desktop screen with ease.
- **Camera Feed Integration**: Displays camera feed in a circular overlay, enhancing the recording experience.
- **Customizable Controls**: Simple and intuitive user interface with customizable recording controls.
- **Video Format Options**: Choose between WebM and MP4 formats for your recordings.
- **Efficient File Saving**: Save recordings directly to your desired location with an easy-to-use dialog.

## Installation

To set up Janus on your system, clone the repository and use `npm` to install dependencies.

## Developing

Use `npm run start` to develop the application

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

You'll also need a signing certificate and environment variables for:

```
APPLE_ID
APPLE_PASSWORD
APPLE_TEAM_ID
CERTIFICATE_NAME
```

Use `npm run make` to create a `.zip` file with the Janus app
