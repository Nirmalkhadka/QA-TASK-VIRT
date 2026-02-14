// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  

  timeout: 60 * 1000,
  

  fullyParallel: false,
  
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  //out of parallel tests on CI
  workers: process.env.CI ? 1 : 1,
  
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Shared settings
  use: {
    // Base URL
    baseURL: 'https://authorized-partner.vercel.app/',
    
    // Collect trace when retrying
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'on',
    
    // Video recording 
    video: 'on',
    
    // Maximum time each action
    actionTimeout: 15000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Configure for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: 500, // Slow down by 500ms to see what's happening
        },
      },
    },

    // Uncomment to test on Firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // Test against mobile viewports

    // Test against mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Folder for test results such as screenshots, videos etc.
  outputDir: 'test-results/',
});
