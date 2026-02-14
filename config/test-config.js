// Test configuration settings

module.exports = {
    // Base URL
    baseURL: 'https://authorized-partner.vercel.app/',
    
    // Timeouts
    timeouts: {
      navigation: 30000,
      action: 10000,
      element: 5000,
    },
    
    // Browser settings
    browser: {
      headless: false, // Set to true for CI/CD
      slowMo: 100, // Slow down by 100ms for visibility
    },
    
    // Screenshot settings
    screenshots: {
      onFailure: true,
      onSuccess: true,
      fullPage: true,
    },
    
    // Video recording
    video: {
      enabled: true,
      dir: 'videos/',
    },
    
    // Retry settings
    retries: {
      failures: 2,
    },
    
    // Test data
    testData: {
      defaultPassword: 'TestPass@123',
      defaultCountry: 'Nepal',
      defaultCity: 'Kathmandu',
    },
  };
  