import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nairaura.app',
  appName: 'NairaAura',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
