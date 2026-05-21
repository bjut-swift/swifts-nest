import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'zk1sui',
  e2e: {
    baseUrl: 'https://www.bjutswift.cn',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}',
    retries: {
      runMode: 2,
    },
  },
});
