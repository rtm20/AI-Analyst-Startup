# 🚀 Google Cloud AI Setup Guide
## Complete Step-by-Step Instructions

### 📋 **Prerequisites**
- Google account (Gmail, etc.)
- Credit card for verification (Google provides $300 free credits)
- 15-20 minutes of setup time

---

## 🏗️ **Step 1: Create Google Cloud Project**

### 1.1 Go to Google Cloud Console
```
🌐 Open: https://console.cloud.google.com/
```

### 1.2 Create New Project
1. Click **"New Project"** (top right)
2. **Project Name**: `AI Startup Analyst Hackathon`
3. **Project ID**: Will auto-generate (note this down!)
4. Click **"Create"**

### 1.3 Enable Billing (Required for APIs)
1. Go to **Billing** → **Link a billing account**
2. Add credit card (Google gives $300 free credits)
3. Select the billing account for your project

---

## 🔧 **Step 2: Enable Required APIs**

### 2.1 Enable Vision API
```
🌐 Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com
```
1. Make sure your project is selected (top bar)
2. Click **"Enable"**
3. Wait for activation ✅

### 2.2 Enable Vertex AI API
```
🌐 Go to: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
```
1. Click **"Enable"**
2. Wait for activation ✅

### 2.3 Enable Cloud Storage API
```
🌐 Go to: https://console.cloud.google.com/apis/library/storage.googleapis.com
```
1. Click **"Enable"**
2. Wait for activation ✅

---

## 🔑 **Step 3: Create Service Account**

### 3.1 Go to IAM & Admin
```
🌐 Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
```

### 3.2 Create Service Account
1. Click **"+ Create Service Account"**
2. **Service account name**: `ai-startup-analyst-service`
3. **Description**: `Service account for AI Startup Analyst hackathon project`
4. Click **"Create and Continue"**

### 3.3 Assign Roles
Add these roles one by one:
1. **Cloud Storage Admin** (for document storage)
2. **AI Platform Developer** (for Vertex AI)
3. **Cloud Vision API Service Agent** (for document OCR)

Click **"Done"**

### 3.4 Download JSON Key
1. Click on your created service account
2. Go to **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **"JSON"**
5. Click **"Create"**
6. **Save the downloaded file as `google-cloud-key.json`**

---

## 🪣 **Step 4: Create Cloud Storage Bucket**

### 4.1 Go to Cloud Storage
```
🌐 Go to: https://console.cloud.google.com/storage/browser
```

### 4.2 Create Bucket
1. Click **"Create Bucket"**
2. **Bucket name**: `ai-startup-docs-[YOUR_PROJECT_ID]` (must be globally unique)
3. **Location**: `us-central1` (Region)
4. **Storage class**: Standard
5. **Access control**: Uniform
6. Click **"Create"**

---

## ⚙️ **Step 5: Configure Your Project**

### 5.1 Move Credentials File
1. Copy the downloaded `google-cloud-key.json` to your project root:
```
C:\Hackathon\Google\AI Analyst for Startup Evaluation\google-cloud-key.json
```

### 5.2 Update Environment Variables
I'll help you update your `.env.local` file with the actual values...

---

## 🎯 **What Information Do I Need?**

**Please provide me with:**

1. **Your Project ID** (from Step 1.2)
   - Example: `ai-startup-analyst-428392`

2. **Your Bucket Name** (from Step 4.2)
   - Example: `ai-startup-docs-428392`

3. **Confirm you've downloaded the JSON key file**
   - ✅ Yes, I have `google-cloud-key.json`

**Once you have these, I'll automatically update your configuration! 🚀**

---

## 🆘 **Need Help?**

**Common Issues:**
- **Billing not enabled**: APIs won't work without billing
- **Wrong project selected**: Check the project name in the top bar
- **Permission denied**: Make sure service account has all 3 roles

**Tell me if you get stuck on any step!** 💪
