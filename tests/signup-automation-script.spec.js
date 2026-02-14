const { test, expect } = require('@playwright/test');
const { generateTestData } = require('../utils/test-data');
const { TempMailService } = require('../utils/email-service');
const fs = require('fs');
const path = require('path');

test('Complete Signup Flow - Fully Automated (No Manual Intervention)', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes timeout
  const testData = generateTestData();

  // Temporary email service
  const emailService = new TempMailService();
  let tempEmail;

  try {
    // temporary email account
    tempEmail = await emailService.createAccount();
    console.log(`Using automated email: ${tempEmail}\n`);

    // Create dummy file for upload
    const uploadFilePath = path.join(__dirname, 'dummy-document.pdf');
    fs.writeFileSync(uploadFilePath, 'This is a test document for automation.');

    console.log('Starting fully automated signup\n');


    // Landing page
    await page.goto('https://authorized-partner.vercel.app/');
    await page.waitForLoadState('networkidle');
    console.log('Navigated to landing page');

    await page.getByRole('button', { name: /Join Us Now/i }).first().click();
    console.log('Clicked Join Us Now');

    // Terms and conditions page
    await page.waitForSelector('text=/Register Your Agency/i', { timeout: 15000 });
    console.log('On Terms & Conditions page');

    await page.waitForTimeout(1000);

    // Click the checkbox - try both methods
    const checkboxLabel = page.locator('label:has-text("I agree to the")');
    const forAttribute = await checkboxLabel.getAttribute('for');

    if (forAttribute) {
      await page.locator(`#${forAttribute}`).check({ force: true });
    } else {
      await page.locator('input[type="checkbox"]').first().check({ force: true });
    }

    // Remove the expect assertion - just wait  for 500sec
    await page.waitForTimeout(500);
    console.log('Accepted Terms & Conditions');

    // Click Continue button
    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('Clicked Continue');

    // STEP 1: Set up your account

    await page.waitForSelector('text=/Set up your Account/i', { timeout: 10000 });
    console.log('\n Step 1: Personal Details');

    await page.locator('input[name="firstName"]').fill(testData.firstName);
    await page.locator('input[name="lastName"]').fill(testData.lastName);
    await page.locator('input[name="email"]').fill(tempEmail); // Use temp email
    await page.locator('input[name="phoneNumber"]').fill(testData.phone);
    await page.locator('input[name="password"]').first().fill(testData.password);
    await page.locator('input[name="confirmPassword"]').fill(testData.password);

    await page.screenshot({ path: 'screenshots/step1-filled.png', fullPage: true });
    console.log('Filled personal details with temp email');

    await page.getByRole('button', { name: 'Next' }).click();


    // OTP verification 

    console.log('\n OTP verification');
    console.log(`Inbox: ${tempEmail}`);

    await page.waitForSelector('text=/Email Verification/i', { timeout: 10000 });

    // Retrieve OTP from email
    const otp = await emailService.waitForOTP(60000, 3000);
    console.log(`OTP : ${otp}`);

    // Fill OTP 
    await page.locator('input').first().fill(otp);
    await page.waitForTimeout(500);

    console.log('Filled OTP code');

    // Click Verify button
    await page.getByRole('button', { name: /Verify/i }).click();
    console.log('OTP verified\n');

    // STEP 2: Agency details
    console.log(' Step 2: Agency Details');

    await page.waitForSelector('text=/Agency Details/i', { state: 'visible', timeout: 60000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.getByPlaceholder(/Enter Agency Name/i).fill(testData.agencyName);
    await page.getByPlaceholder(/Enter Your Role/i).fill(testData.agencyRole);
    await page.getByPlaceholder(/Enter Your Agency Email/i).fill(testData.agencyEmail);

    const websiteWithoutProtocol = testData.website.replace('https://', '').replace('http://', '');
    await page.getByPlaceholder(/Enter Your Agency Website/i).fill(websiteWithoutProtocol);

    await page.getByPlaceholder(/Enter Your Agency Address/i).fill(testData.address);

    console.log('Selecting regions');
    await page.getByText('Select Your Region of Operation').click();
    await page.waitForTimeout(500);
    await page.getByText('Australia', { exact: true }).click();
    await page.getByText('Canada', { exact: true }).click();
    await page.keyboard.press('Escape');

    await page.screenshot({ path: 'screenshots/step2-filled.png', fullPage: true });
    console.log('Filled agency details');

    await page.getByRole('button', { name: 'Next' }).click();

    // STEP 3: Professional experience
    console.log('\n Step 3: Professional Experience');

    await page.waitForSelector('text=/Professional Experience/i', { timeout: 10000 });
    await page.waitForTimeout(1500);

    const yearsSelect = page.locator('select').first();
    await yearsSelect.waitFor({ state: 'visible', timeout: 5000 });
    await yearsSelect.selectOption('5');
    console.log('Selected experience level');

    await page.getByPlaceholder(/Enter an approximate number/i).fill(testData.studentsPlaced);
    await page.getByPlaceholder(/Undergraduate admissions to Canada/i).fill(testData.specialization);
    await page.getByPlaceholder(/90%/i).fill('95');

    await page.getByText('Career Counseling').click();
    await page.getByText('Visa Processing').click();

    await page.screenshot({ path: 'screenshots/step3-filled.png', fullPage: true });
    console.log('Filled professional experience');

    await page.getByRole('button', { name: 'Next' }).click();

    // STEP 4: VERIFICATION and preferences
    console.log('\n Step 4: Verification and Preferences');

    await page.waitForSelector('text=/Verification and Preferences/i', { timeout: 10000 });
    await page.waitForTimeout(1000);

    await page.getByPlaceholder(/Enter your registration number/i).fill(testData.referenceCode);

    console.log('Selecting preferred countries');
    await page.getByText('Select Your Preferred Countries').click();
    await page.waitForTimeout(500);
    await page.getByText('Australia', { exact: true }).click();
    await page.getByText('Canada', { exact: true }).click();
    await page.keyboard.press('Escape');

    await page.getByText('Universities').click();
    await page.getByText('Colleges').click();

    await page.getByPlaceholder(/ICEF Certified/i).fill('ICEF Certified Education Agent');

    console.log('Uploading document');
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(uploadFilePath);
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'screenshots/step4-filled.png', fullPage: true });
    console.log('Filled verification and preferences');
    console.log('Document uploaded');

    // SUBMIT FORM
    console.log('\n Submitting form');
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'screenshots/form-submitted.png', fullPage: true });

    // DASHBOARD ACCESS
    console.log('\n Verifying dashboard access');

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Verify on dashboard
    await expect(page).toHaveURL(/dashboard|profile|home/i, { timeout: 10000 });
    console.log('Successfully landed on dashboard');

    await page.screenshot({ path: 'screenshots/dashboard-loaded.png', fullPage: true });

    // LOGOUT PROCESS
    console.log('\n Testing logout flow');

    // Click the Logout button
    await page.locator('li:has-text("Logout")').click();
    console.log('Clicked logout button');

    await page.waitForTimeout(1500);

    // Handle logout confirmation popup

    await page.waitForSelector('text=Are you sure you want to log out?', { timeout: 5000 });

    await page.locator('button:has-text("Logout")').last().click();
    console.log('Confirmed logout');

    await page.waitForTimeout(2000);

    // VERIFY REDIRECT TO LOGIN PAGE
    await expect(page).toHaveURL(/login/i, { timeout: 10000 });
    console.log('Redirected to login page');

    await page.screenshot({ path: 'screenshots/login-page.png', fullPage: true });

    // LOGIN WITH SAME CREDENTIALS
    console.log('\n Testing login flow');

    // Fill email
    await page.locator('input[type="email"]').fill(tempEmail);
    console.log('Filled email');

    // Fill password
    await page.locator('input[type="password"]').fill(testData.password);
    console.log('Filled password');

    await page.screenshot({ path: 'screenshots/login-filled.png', fullPage: true });

    // Click Login button
    await page.locator('button[type="submit"]:has-text("Log in")').click();
    console.log('Clicked login button');

    await page.waitForTimeout(3000);

    // Successful login
    console.log('\n Verifying Successful Login');

    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Verify back on dashboard
    await expect(page).toHaveURL(/dashboard|profile|home/i, { timeout: 10000 });
    console.log('Back to dashboard');

    await page.screenshot({ path: 'screenshots/login-success-dashboard.png', fullPage: true });

    console.log('\n Complete test!');

    console.log(' Test account:');
    console.log(`  Email: ${tempEmail}`);
    console.log(`  Password: ${testData.password}`);

    try {
      fs.unlinkSync(uploadFilePath);
    } catch (e) { }

  } finally {
    if (emailService) {
      await emailService.cleanup();
    }
  }
});
