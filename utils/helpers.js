// Helper function for Playwright

// Wait navigation to complete

async function waitForNavigation(page, timeout = 30000) {
    await page.waitForLoadState('networkidle', { timeout });
  }
  
  // Fill a form field with proper waiting
  
  async function fillFormField(page, selector, value) {
    await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
    await page.fill(selector, value);
    await page.waitForTimeout(300); // Small delay
  }
  
  // Click element with retry logic
  
  async function clickWithRetry(page, selector, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
        await page.click(selector);
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await page.waitForTimeout(1000);
      }
    }
  }
  
  // Check if element exists
  
  async function elementExists(page, selector) {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  
  // Select dropdown option
  
  async function selectDropdown(page, selector, value) {
    await page.waitForSelector(selector, { state: 'visible' });
    await page.selectOption(selector, value);
  }
  
  // Upload file to input
  
  async function uploadFile(page, selector, filePath) {
    const fileInput = await page.locator(selector);
    await fileInput.setInputFiles(filePath);
  }
  
  // Wait for element and get text
  
  async function getElementText(page, selector) {
    await page.waitForSelector(selector, { state: 'visible' });
    return await page.textContent(selector);
  }
  
  // Take screenshot
  
  async function takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}_${timestamp}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Screenshot saved: ${filename}`);
  }
  
  // Log test step
  
  function logStep(stepNumber, description) {
    console.log(`\n[Step ${stepNumber}] ${description}`);
  }
  
  // Handle alerts
  
  async function handleDialog(page, accept = true) {
    page.on('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
  
  module.exports = {
    waitForNavigation,
    fillFormField,
    clickWithRetry,
    elementExists,
    selectDropdown,
    uploadFile,
    getElementText,
    takeScreenshot,
    logStep,
    handleDialog
  };
  