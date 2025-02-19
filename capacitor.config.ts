import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    Filesystem: {
      directory: 'Documents'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true
    },
    AdMob: {
      appId: 'ca-app-pub-5162875721816233~7320072617', // ID dell'app AdMob (test)
    },
  },
  appId: 'hip_hop_beats_instrumental.dev127586.app689033',
  appName: 'Hip Hop Instrumental Beats',
  webDir: 'www'
};

export default config;
