 🚀 QA Automation Task – Authorized Partner Signup

---

## 📌 Project Overview

This project automates the complete signup process for the Authorized Partner platform:

🔗 [https://authorized-partner.vercel.app/](https://authorized-partner.vercel.app/)

The objective of this task is to automate the **entire signup flow without any manual intervention**, including:

* OTP verification
* Multi-step form submission
* File upload
* Dashboard verification
* Logout and Login validation

The automation is implemented using **Playwright with Node.js**.

The test simulates a real user journey from landing page → dashboard → logout → login → dashboard verification.

---

## Live Test Report
Interactive Playwright HTML report: https://nirmalkhadka.github.io/QA-TASK-VIRT/
(shows steps, screenshots, video traces, logs)

---


## 🎯 Scope of Automation

### 🏠 1. Landing Page

* Navigates to the website
* Clicks **“Join Us Now”**

---

### 📜 2. Terms & Conditions

* Waits for page load
* Accepts Terms & Conditions
* Clicks **Continue**

---

### 📝 3. Step 1 – Account Setup

* Fills:

  * First Name
  * Last Name
  * Phone Number
  * Password
* Uses dynamically generated temporary email
* Submits form

---

### 🔐 4. OTP Email Verification (Fully Automated)

* Creates temporary email via **mail.tm API**
* Monitors inbox automatically
* Extracts 6-digit OTP using RegEx
* Fills OTP automatically
* Verifies account

✅ No manual intervention required

---

### 🏢 5. Step 2 – Agency Details

* Fills agency information
* Selects regions
* Proceeds to next step

---

### 💼 6. Step 3 – Professional Experience

* Selects experience level
* Fills numeric fields
* Selects services offered

---

### 🌍 7. Step 4 – Verification & Preferences

* Enters registration/reference details
* Selects preferred countries
* Uploads generated dummy PDF
* Submits final form

---

### 📊 8. Dashboard Verification

* Verifies successful navigation using URL assertion
* Captures screenshot as evidence

---

### 🚪 9. Logout Flow

* Clicks logout
* Confirms logout modal
* Verifies redirection to login page

---

### 🔁 10. Login Flow

* Logs in using same dynamically created credentials
* Verifies dashboard access again

---

## ✅ What This Automation Validates

* End-to-end Signup Flow
* OTP verification
* Multi-step form handling
* File upload functionality
* Dashboard access
* Logout functionality
* Login functionality
* Session persistence

---

# 📁 Project Structure

```
QA-TASK-VIRT/
│
├── config/
│   └── test-config.js
│
├── tests/
│   └── signup-automation-script.spec.js
│
├── utils/
│   ├── email-service.js
│   ├── test-data.js
│   └── helper.js
│
├── screenshots/
│
├── test-results/
│
├── playwright-report/
│
└── playwright.config.js
```

---

# ⚙️ Key Implementation Details

## 🔄 Dynamic Test Data

* Random name generation
* Random phone number
* Secure password
* Unique email per execution

Prevents duplication and allows re-runnable tests.

---

## 📧 Temporary Email & OTP Handling

File:
`utils/email-service.js`

Process:

1. Create temporary email via mail.tm API
2. Authenticate account
3. Poll inbox
4. Extract 6-digit OTP using RegEx
5. Auto-fill OTP input fields

No manual OTP entry required.

---

## 📎 File Upload

* Generates dummy PDF at runtime
* Uploads during verification step

---

## 📊 Assertions Used

* URL-based validation
* Page load verification
* Dashboard redirection confirmation

---

# 🛠 Setup Instructions & Execution Guide

## 📋 Prerequisites

Ensure the following are installed:

* Node.js (v18+ recommended)
* npm
* Git (optional)

Verify installation:

```bash
node -v
npm -v
```

---

## 📦 Project Setup

Clone repository:

```bash
git clone git@github.com:Nirmalkhadka/QA-TASK-VIRT.git
cd QA-TASK-VIRT
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# ▶️ How to Run Tests

### Run all tests

```bash
npx playwright test
```

### Run in headed mode

```bash
npx playwright test --headed
```

### Run specific test file

```bash
npx playwright test tests/signup-automation-script.spec.js
```

### Debug mode

```bash
npx playwright test --debug
```

---

# 📊 Reports & Results

## HTML Report

Generate and open report:

```bash
npx playwright show-report
```

Example:

```
Serving HTML report at http://localhost:9323
```

Location:

```
playwright-report/
```

---

## Test Results Folder

```
test-results/
```

Contains:

* JSON reports
* Execution artifacts
* Videos (if enabled)
* Traces
* Screenshots

---

## 📸 Screenshots

Stored in:

```
screenshots/
```

Captured during:

* Landing page
* OTP verification
* Form completion
* Dashboard access
* Logout
* Login verification

---

# 🔄 Execution Flow Summary

The automation performs:

1. Signup
2. OTP verification
3. Multi-step form completion
4. File upload
5. Dashboard verification
6. Logout
7. Login
8. Dashboard re-verification

Ensures complete end-to-end authentication validation.

---

# 🚀 Recommended Future Improvements

* Parallel execution
* Cross-browser testing
* GitHub Actions CI/CD integration
* Environment variable support (.env)
* Page Object Model (POM) implementation
* Retry strategy enhancement

---
