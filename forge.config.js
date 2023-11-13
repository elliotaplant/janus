module.exports = {
  packagerConfig: {
    name: 'Janus',
    asar: true,
    icon: './icons/janus_icon', // no file extension required
    extraResource: ['./ffmpeg-binaries/darwin'], // TODO: import win and linux versions
    appBundleId: 'com.elliotplant.janus',
    osxSign: {
      identity: process.env.CERTIFICATE_NAME,
    },

    hardenedRuntime: true,
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
