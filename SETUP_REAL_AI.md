# 🚀 Real Google Cloud AI Setup - Step by Step Guide

## 📋 **What You Need to Configure**

To enable real Google Cloud AI processing, you need:

1. **Google Cloud Project** with billing enabled
2. **Service Account** with proper permissions
3. **API Keys/Credentials** for authentication
4. **Environment Variables** in your application

---

## 🏗️ **Step 1: Create Google Cloud Project**

### **Option A: Using Google Cloud Console (Recommended)**

1. **Go to Google Cloud Console**:
   ```
   https://console.cloud.google.com/
   ```

2. **Create New Project**:
   - Click "Select a project" → "New Project"
   - Project Name: `ai-startup-analyst`
   - Project ID: `ai-startup-analyst-[random-number]` (must be unique)
   - Click "Create"

3. **Enable Billing**:
   - Go to "Billing" in the left menu
   - Link a credit card (you get $300 free credits!)
   - Don't worry - our usage will be minimal

### **Option B: Using Command Line**

If you have Google Cloud CLI installed:
```bash
# Install Google Cloud CLI first if you don't have it
# Download from: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Create project
gcloud projects create ai-startup-analyst-$(date +%s) --name="AI Startup Analyst"

# Set as default project
gcloud config set project ai-startup-analyst-$(date +%s)
```

---

## 🔧 **Step 2: Enable Required APIs**

### **Using Google Cloud Console**:

1. **Go to APIs & Services**:
   ```
   https://console.cloud.google.com/apis/dashboard
   ```

2. **Enable these APIs** (click "Enable" for each):
   - **Cloud Vision API**: https://console.cloud.google.com/apis/library/vision.googleapis.com
   - **Vertex AI API**: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
   - **Cloud Storage API**: https://console.cloud.google.com/apis/library/storage.googleapis.com

### **Using Command Line**:
```bash
# Enable all required APIs
gcloud services enable vision.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage.googleapis.com
```

---

## 🔐 **Step 3: Create Service Account & Credentials**

### **Using Google Cloud Console**:

1. **Go to IAM & Admin → Service Accounts**:
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts
   ```

2. **Create Service Account**:
   - Click "Create Service Account"
   - Name: `ai-startup-analyst`
   - Description: `Service account for AI Startup Analyst app`
   - Click "Create and Continue"

3. **Grant Roles**:
   Add these roles to your service account:
   - `Storage Admin` (for file uploads)
   - `AI Platform Developer` (for Vertex AI)
   - `Cloud Vision AI Service Agent` (for Vision API)

4. **Create JSON Key**:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Choose "JSON" format
   - Download the file and save it as `google-cloud-key.json` in your project root

### **Using Command Line**:
```bash
# Create service account
gcloud iam service-accounts create ai-startup-analyst \
    --description="Service account for AI Startup Analyst" \
    --display-name="AI Startup Analyst"

# Get your project ID
PROJECT_ID=$(gcloud config get-value project)

# Grant required permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:ai-startup-analyst@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:ai-startup-analyst@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:ai-startup-analyst@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/ml.developer"

# Create and download key
gcloud iam service-accounts keys create ./google-cloud-key.json \
    --iam-account=ai-startup-analyst@$PROJECT_ID.iam.gserviceaccount.com
```

---

## 📦 **Step 4: Create Cloud Storage Bucket**

### **Using Google Cloud Console**:

1. **Go to Cloud Storage**:
   ```
   https://console.cloud.google.com/storage/browser
   ```

2. **Create Bucket**:
   - Click "Create Bucket"
   - Name: `ai-startup-analyst-docs-[random-number]` (must be globally unique)
   - Location: `us-central1` (same as Vertex AI)
   - Storage class: `Standard`
   - Click "Create"

### **Using Command Line**:
```bash
# Create bucket (replace RANDOM_NUMBER with actual random number)
gsutil mb -l us-central1 gs://ai-startup-analyst-docs-$(date +%s)
```

---

## ⚙️ **Step 5: Configure Your Application**

### **Create Environment File**:

1. **Copy the example**:
   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local`** with your actual values:

```bash
# Real AI Mode Configuration
NEXT_PUBLIC_ENABLE_REAL_AI=true
NEXT_PUBLIC_ENABLE_MOCK_MODE=false
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true

# Google Cloud Configuration (UPDATE THESE!)
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_BUCKET=your-actual-bucket-name

# Authentication
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=AI Startup Analyst
NEXT_PUBLIC_APP_VERSION=2.0.0
```

### **How to Get Your Values**:

**Project ID**: 
```bash
gcloud config get-value project
```
Or from Google Cloud Console → Dashboard

**Bucket Name**: 
```bash
gsutil ls
```
Or from Google Cloud Console → Storage

---

## 🧪 **Step 6: Test Your Setup**

### **1. Place Credentials File**:
Make sure `google-cloud-key.json` is in your project root:
```
C:\Hackathon\Google\AI Analyst for Startup Evaluation\google-cloud-key.json
```

### **2. Update .env.local**:
```bash
# Edit this file with your actual values
C:\Hackathon\Google\AI Analyst for Startup Evaluation\.env.local
```

### **3. Test the Application**:
```bash
cd "C:\Hackathon\Google\AI Analyst for Startup Evaluation"
npm run dev
```

### **4. Check Health Status**:
Visit: `http://localhost:3000/api/health`

You should see:
```json
{
  "status": "healthy",
  "services": {
    "cloudStorage": { "status": "operational" },
    "visionAPI": { "status": "operational" },
    "vertexAI": { "status": "operational" }
  }
}
```

---

## 💰 **Cost Estimation**

### **Free Tier (Per Month)**:
- **Vision API**: 1,000 units free
- **Vertex AI**: Limited free usage
- **Cloud Storage**: 5GB free

### **Expected Costs for Demo/Hackathon**:
- **Document Processing**: ~$0.50 per 100 documents
- **AI Analysis**: ~$1.00 per 100 analyses
- **Storage**: ~$0.01 per GB/month

**Total for hackathon demo: $2-10 max**

---

## 🚨 **Security Important!**

### **Never Commit Credentials**:
```bash
# Add to .gitignore (already included)
google-cloud-key.json
.env.local
```

### **Rotate Keys Regularly**:
After the hackathon, delete and recreate your service account keys.

---

## 🎯 **Quick Setup Summary**

Here's what you need to provide me or configure:

1. **Google Cloud Project ID** (e.g., `ai-startup-analyst-123456`)
2. **Storage Bucket Name** (e.g., `ai-startup-analyst-docs-123456`)
3. **Service Account JSON Key** file saved as `google-cloud-key.json`
4. **Updated `.env.local`** file with real values

Once you have these, your application will switch from demo mode to **real Google AI processing**! 🚀

---

## 🆘 **Need Help?**

**Common Issues**:
- **"Project not found"**: Check your project ID
- **"Permission denied"**: Verify service account roles
- **"API not enabled"**: Make sure all APIs are enabled
- **"Quota exceeded"**: Check your billing account

**Quick Test Commands**:
```bash
# Test Google Cloud CLI connection
gcloud auth list
gcloud config list

# Test API access
gcloud services list --enabled
```

Let me know which step you need help with! 🤝
