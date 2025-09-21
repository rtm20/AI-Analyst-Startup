# 🚀 Google Cloud Setup Guide for AI Startup Analyst

This guide will help you set up the real Google Cloud AI services for the hackathon submission.

## 📋 Prerequisites

1. **Google Cloud Account**: Sign up at [console.cloud.google.com](https://console.cloud.google.com)
2. **Credit Card**: Required for Google Cloud (but you get $300 free credits)
3. **Node.js 18+**: Already installed in this project

## 🏗️ Step 1: Create Google Cloud Project

```bash
# 1. Create a new project
gcloud projects create ai-startup-analyst --name="AI Startup Analyst"

# 2. Set as default project
gcloud config set project ai-startup-analyst

# 3. Enable billing (required for AI APIs)
# Go to: https://console.cloud.google.com/billing
```

## 🔧 Step 2: Enable Required APIs

```bash
# Enable all necessary APIs
gcloud services enable vision.googleapis.com
gcloud services enable aiplatform.googleapis.com  
gcloud services enable storage.googleapis.com
gcloud services enable compute.googleapis.com
```

## 🔐 Step 3: Create Service Account

```bash
# 1. Create service account
gcloud iam service-accounts create ai-startup-analyst \
    --description="Service account for AI Startup Analyst" \
    --display-name="AI Startup Analyst"

# 2. Grant necessary permissions
gcloud projects add-iam-policy-binding ai-startup-analyst \
    --member="serviceAccount:ai-startup-analyst@ai-startup-analyst.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding ai-startup-analyst \
    --member="serviceAccount:ai-startup-analyst@ai-startup-analyst.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding ai-startup-analyst \
    --member="serviceAccount:ai-startup-analyst@ai-startup-analyst.iam.gserviceaccount.com" \
    --role="roles/ml.developer"

# 3. Create and download key
gcloud iam service-accounts keys create ./google-cloud-key.json \
    --iam-account=ai-startup-analyst@ai-startup-analyst.iam.gserviceaccount.com
```

## 📦 Step 4: Create Cloud Storage Bucket

```bash
# Create bucket for document storage
gsutil mb -l us-central1 gs://ai-startup-analyst-docs

# Set permissions
gsutil iam ch serviceAccount:ai-startup-analyst@ai-startup-analyst.iam.gserviceaccount.com:objectAdmin gs://ai-startup-analyst-docs
```

## ⚙️ Step 5: Configure Environment

1. **Copy the example environment file:**
```bash
cp .env.example .env.local
```

2. **Update `.env.local` with your settings:**
```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=ai-startup-analyst
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_BUCKET=ai-startup-analyst-docs

# Authentication (choose one option)
# Option 1: Service account key file
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json

# Option 2: Service account credentials (for production deployment)
# GOOGLE_CLIENT_EMAIL=ai-startup-analyst@ai-startup-analyst.iam.gserviceaccount.com
# GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Feature flags
NEXT_PUBLIC_ENABLE_REAL_AI=true
NEXT_PUBLIC_ENABLE_MOCK_MODE=false
```

## 🧪 Step 6: Test the Setup

```bash
# Install dependencies
npm install

# Run the application
npm run dev

# Test the health check endpoint
curl http://localhost:3000/api/health
```

## 💰 Cost Management

### Free Tier Limits:
- **Vision API**: 1,000 units/month free
- **Vertex AI (Gemini)**: Limited free usage
- **Cloud Storage**: 5GB free

### Estimated Costs for Hackathon:
- **Document Processing**: ~$0.50 per 100 documents
- **AI Analysis**: ~$1.00 per 100 analyses  
- **Storage**: ~$0.01 per GB/month

**Total estimated cost for hackathon demo: $5-15**

## 🚨 Security Best Practices

1. **Never commit credentials:**
```bash
# Add to .gitignore
echo "google-cloud-key.json" >> .gitignore
echo ".env.local" >> .gitignore
```

2. **Rotate keys regularly**
3. **Use IAM roles with minimal permissions**
4. **Enable audit logging**

## 🐛 Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   ```bash
   # Check service account permissions
   gcloud auth list
   gcloud config list
   ```

2. **"API not enabled"**
   ```bash
   # Re-enable APIs
   gcloud services enable vision.googleapis.com aiplatform.googleapis.com
   ```

3. **"Quota exceeded"**
   - Check usage in Google Cloud Console
   - Request quota increase if needed

4. **"Module not found"**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📊 Monitoring and Logging

1. **Check API usage:**
   - Go to: https://console.cloud.google.com/apis/dashboard

2. **View logs:**
   ```bash
   gcloud logging read "resource.type=cloud_function"
   ```

3. **Monitor costs:**
   - Go to: https://console.cloud.google.com/billing

## 🎯 Production Deployment

For deploying to Vercel/Netlify/etc:

1. **Use environment variables instead of key files**
2. **Set up proper CORS headers**
3. **Implement rate limiting**
4. **Add monitoring and alerting**

## 📚 Additional Resources

- [Google Cloud Vision API Docs](https://cloud.google.com/vision/docs)
- [Vertex AI Gemini Docs](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Cloud Storage Docs](https://cloud.google.com/storage/docs)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

## 🎉 Ready for Hackathon!

Once you've completed these steps, your AI Startup Analyst will be powered by real Google AI services:

- ✅ **Google Vision API** for document text extraction
- ✅ **Gemini AI** for intelligent startup analysis  
- ✅ **Cloud Storage** for secure file handling
- ✅ **Production-ready** error handling and monitoring

Perfect for showcasing at the Google AI hackathon! 🏆
