import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'electron') {
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-software-rasterizer');
        }
        return launchOptions;
      });
    },
    baseUrl: 'http://localhost:4000/',
    specPattern: [
      'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
      'path/to/your/specs/**/*.spec.js'
    ]
  }
});
