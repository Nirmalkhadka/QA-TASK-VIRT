// Generate random test data

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function generateEmail() {
    const timestamp = Date.now();
    const randomStr = generateRandomString(5);
    return `test_${randomStr}_${timestamp}@example.com`;
  }
  
  function generatePhone() {
    // Generate 10 digit phone number starting with 98
    return `98${generateRandomNumber(10000000, 99999999)}`;
  }
  
  function generateTestData() {
    const randomNum = Math.floor(Math.random() * 10000);
    const timestamp = new Date().getTime();
    
    return {
      // Step 1: Account
      firstName: `TestUser${randomNum}`,
      lastName: `Automation`,
      email: `automation_test_${timestamp}@gmail.com`, 
      phone: `98${Math.floor(Math.random() * 100000000)}`, 
      password: 'Password@123',
      
      // Step 2: Agency Details
      agencyName: `Agency ${randomNum} Ltd`,
      agencyRole: 'Senior Recruiter',
      agencyEmail: `contact_${timestamp}@agency.com`,
      website: `https://www.agency${randomNum}.com`,
      address: 'Kathmandu, Nepal',
      
      // Step 3: Professional Experience
      studentsPlaced: '500',
      specialization: 'Undergraduate admissions to USA',
      successMetric: '95', 
      
      // Step 4: Verification & Preferences
      referenceCode: `REG-${randomNum}-NP`,
      certification: 'ICEF Certified Agent',
    };
  }
  
  module.exports = {
    generateTestData,
    generateRandomString,
    generateRandomNumber,
    generateEmail,
    generatePhone
  };