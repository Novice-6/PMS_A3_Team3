import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.scu.team3.inventory',
  appName: 'PMS-A3-Inventory',
  webDir: 'www', // 🌟 确保这里和你项目里的文件夹名字一致
  server: {
    androidScheme: 'https', // 🌟 强制使用 https 协议
    cleartext: true
  }
};

export default config;