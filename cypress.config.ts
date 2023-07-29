import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  video: false,
  viewportHeight: 900,
  viewportWidth: 1200,

  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    },
  },
});
