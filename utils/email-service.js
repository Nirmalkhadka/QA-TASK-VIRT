// Email for OTP retrieval
const axios = require('axios');

class TempMailService {
  constructor() {
    this.baseUrl = 'https://api.mail.tm';
    this.token = null;
    this.email = null;
    this.password = null;
    this.accountId = null;
  }

   // temporary email account
  
  async createAccount() {
    try {
      // Get available domains
      const domainsRes = await axios.get(`${this.baseUrl}/domains`);
      const domain = domainsRes.data['hydra:member'][0].domain;
      
      // Generate random credentials
      const randomStr = Math.random().toString(36).substring(2, 10);
      this.email = `test_${randomStr}@${domain}`;
      this.password = `Test@${Math.random().toString(36).substring(2, 15)}`;
      
      // Create account
      const createRes = await axios.post(`${this.baseUrl}/accounts`, {
        address: this.email,
        password: this.password
      });
      
      this.accountId = createRes.data.id;
      console.log(`Created temp email: ${this.email}`);
      
      // Get authentication token
      const tokenRes = await axios.post(`${this.baseUrl}/token`, {
        address: this.email,
        password: this.password
      });
      
      this.token = tokenRes.data.token;
      console.log('Authenticated with mail service');
      
      return this.email;
    } catch (error) {
      console.error('Failed to create temp email:', error.message);
      throw error;
    }
  }

  /**
   * Wait for and retrieve OTP from email
   * @param {number} maxWaitTime - Max time to wait : 60000
   * @param {number} pollInterval - How often to check in : 3000
   */
  async waitForOTP(maxWaitTime = 60000, pollInterval = 3000) {
    console.log('Waiting for OTP email');
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        // Get messages
        const messagesRes = await axios.get(`${this.baseUrl}/messages`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        
        const messages = messagesRes.data['hydra:member'];
        
        // Look for OTP email
        for (const message of messages) {
          if (message.subject && 
              (message.subject.includes('verification') || 
               message.subject.includes('OTP') || 
               message.subject.includes('code') ||
               message.subject.includes('Authorized Partner'))) {
            
            // Get full message content
            const messageRes = await axios.get(
              `${this.baseUrl}/messages/${message.id}`, 
              {
                headers: {
                  'Authorization': `Bearer ${this.token}`
                }
              }
            );
            
            const emailBody = messageRes.data.text || messageRes.data.html || '';
            
            // get OTP using regex
            const otpMatch = emailBody.match(/\b(\d{6})\b/);
            
            if (otpMatch) {
              const otp = otpMatch[1];
              console.log(`Found OTP: ${otp}`);
              return otp;
            }
          }
        }
        
        // Wait
        console.log(`No OTP yet, checking again in ${pollInterval/1000}s`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
      } catch (error) {
        console.error('Error checking messages:', error.message);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }
    
    throw new Error('Timeout waiting for OTP email');
  }

  // Clean up - delete the temporary account
   
  async cleanup() {
    try {
      if (this.accountId && this.token) {
        await axios.delete(`${this.baseUrl}/accounts/${this.accountId}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        console.log('Cleaned up temporary email account');
      }
    } catch (error) {
      // Ignore
      console.log('Could not cleanup temp email');
    }
  }
}

module.exports = { TempMailService };
