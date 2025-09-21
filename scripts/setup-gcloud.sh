#!/bin/bash

# Google Cloud Setup Script for AI Startup Analyst
# This script sets up all required Google Cloud services for the hackathon

set -e

echo "🚀 Setting up Google Cloud for AI Startup Analyst..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI not found. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Configuration
PROJECT_ID="ai-startup-analyst-$(date +%s)"
REGION="us-central1"
SERVICE_ACCOUNT="ai-analyst-service"

echo "📋 Project ID: $PROJECT_ID"
echo "🌍 Region: $REGION"

# Create new project
echo "🏗️ Creating Google Cloud project..."
gcloud projects create $PROJECT_ID --name="AI Startup Analyst"

# Set active project
gcloud config set project $PROJECT_ID

# Enable billing (requires manual setup)
echo "💳 Please enable billing for project $PROJECT_ID in the Google Cloud Console:"
echo "https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
echo "Press Enter when billing is enabled..."
read

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable vision.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable run.googleapis.com

# Create service account
echo "👤 Creating service account..."
gcloud iam service-accounts create $SERVICE_ACCOUNT \
    --description="Service account for AI Startup Analyst" \
    --display-name="AI Analyst Service"

# Grant necessary permissions
echo "🔐 Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/datastore.user"

# Create and download service account key
echo "🔑 Creating service account key..."
gcloud iam service-accounts keys create google-cloud-key.json \
    --iam-account=$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com

# Create Cloud Storage bucket
echo "🪣 Creating Cloud Storage bucket..."
BUCKET_NAME="$PROJECT_ID-startup-docs"
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME

# Set bucket permissions
gsutil iam ch serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com:objectAdmin gs://$BUCKET_NAME

# Initialize Firestore
echo "🔥 Initializing Firestore..."
gcloud firestore databases create --region=$REGION

# Create environment file
echo "📝 Creating environment configuration..."
cat > .env.local << EOF
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=$BUCKET_NAME
GOOGLE_CLOUD_LOCATION=$REGION

# Application Configuration
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
PORT=3000

# Rate Limiting (for free tier management)
MAX_UPLOADS_PER_HOUR=10
MAX_ANALYSES_PER_DAY=50
EOF

echo "✅ Google Cloud setup complete!"
echo ""
echo "📋 Summary:"
echo "   Project ID: $PROJECT_ID"
echo "   Service Account: $SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"
echo "   Storage Bucket: gs://$BUCKET_NAME"
echo "   Key File: google-cloud-key.json"
echo "   Environment: .env.local"
echo ""
echo "🚀 Next steps:"
echo "   1. Install dependencies: npm install"
echo "   2. Start development server: npm run dev"
echo "   3. Open http://localhost:3000"
echo ""
echo "💡 Free tier limits:"
echo "   - Cloud Vision: 1,000 requests/month"
echo "   - Cloud Storage: 5GB"
echo "   - Firestore: 50K reads, 20K writes/day"
echo "   - Cloud Functions: 2M invocations/month"
echo ""
echo "🎉 Happy hacking!"
