# Google Cloud Setup Script for AI Startup Analyst (PowerShell)
# This script sets up all required Google Cloud services for the hackathon

param(
    [string]$ProjectName = "ai-startup-analyst-$(Get-Date -Format 'yyyyMMddHHmmss')"
)

Write-Host "🚀 Setting up Google Cloud for AI Startup Analyst..." -ForegroundColor Green

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "gcloud not found"
    }
} catch {
    Write-Host "❌ Google Cloud CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Configuration
$PROJECT_ID = $ProjectName
$REGION = "us-central1"
$SERVICE_ACCOUNT = "ai-analyst-service"

Write-Host "📋 Project ID: $PROJECT_ID" -ForegroundColor Blue
Write-Host "🌍 Region: $REGION" -ForegroundColor Blue

# Create new project
Write-Host "🏗️ Creating Google Cloud project..." -ForegroundColor Yellow
gcloud projects create $PROJECT_ID --name="AI Startup Analyst"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create project. It might already exist." -ForegroundColor Red
    Write-Host "Please use a different project name or delete the existing project." -ForegroundColor Yellow
    exit 1
}

# Set active project
gcloud config set project $PROJECT_ID

# Prompt for billing
Write-Host "💳 Please enable billing for project $PROJECT_ID in the Google Cloud Console:" -ForegroundColor Yellow
Write-Host "https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID" -ForegroundColor Cyan
Write-Host "Press Enter when billing is enabled..." -ForegroundColor Yellow
Read-Host

# Enable required APIs
Write-Host "🔌 Enabling required APIs..." -ForegroundColor Yellow
$apis = @(
    "vision.googleapis.com",
    "aiplatform.googleapis.com", 
    "storage.googleapis.com",
    "firestore.googleapis.com",
    "cloudfunctions.googleapis.com",
    "run.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "   Enabling $api..." -ForegroundColor Gray
    gcloud services enable $api
}

# Create service account
Write-Host "👤 Creating service account..." -ForegroundColor Yellow
gcloud iam service-accounts create $SERVICE_ACCOUNT `
    --description="Service account for AI Startup Analyst" `
    --display-name="AI Analyst Service"

# Grant necessary permissions
Write-Host "🔐 Granting permissions..." -ForegroundColor Yellow
$serviceAccountEmail = "$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$serviceAccountEmail" `
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$serviceAccountEmail" `
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$serviceAccountEmail" `
    --role="roles/datastore.user"

# Create and download service account key
Write-Host "🔑 Creating service account key..." -ForegroundColor Yellow
gcloud iam service-accounts keys create google-cloud-key.json `
    --iam-account=$serviceAccountEmail

# Create Cloud Storage bucket
Write-Host "🪣 Creating Cloud Storage bucket..." -ForegroundColor Yellow
$BUCKET_NAME = "$PROJECT_ID-startup-docs"
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME

# Set bucket permissions
gsutil iam ch serviceAccount:${serviceAccountEmail}:objectAdmin gs://$BUCKET_NAME

# Initialize Firestore
Write-Host "🔥 Initializing Firestore..." -ForegroundColor Yellow
gcloud firestore databases create --region=$REGION

# Generate random secret
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$NEXTAUTH_SECRET = [Convert]::ToBase64String($bytes)

# Create environment file
Write-Host "📝 Creating environment configuration..." -ForegroundColor Yellow
$envContent = @"
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS=./google-cloud-key.json
GOOGLE_CLOUD_STORAGE_BUCKET=$BUCKET_NAME
GOOGLE_CLOUD_LOCATION=$REGION

# Application Configuration
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
PORT=3000

# Rate Limiting (for free tier management)
MAX_UPLOADS_PER_HOUR=10
MAX_ANALYSES_PER_DAY=50
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Google Cloud setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Blue
Write-Host "   Project ID: $PROJECT_ID" -ForegroundColor Gray
Write-Host "   Service Account: $serviceAccountEmail" -ForegroundColor Gray
Write-Host "   Storage Bucket: gs://$BUCKET_NAME" -ForegroundColor Gray
Write-Host "   Key File: google-cloud-key.json" -ForegroundColor Gray
Write-Host "   Environment: .env.local" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Blue
Write-Host "   1. Install dependencies: npm install" -ForegroundColor Yellow
Write-Host "   2. Start development server: npm run dev" -ForegroundColor Yellow
Write-Host "   3. Open http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Free tier limits:" -ForegroundColor Blue
Write-Host "   - Cloud Vision: 1,000 requests/month" -ForegroundColor Gray
Write-Host "   - Cloud Storage: 5GB" -ForegroundColor Gray
Write-Host "   - Firestore: 50K reads, 20K writes/day" -ForegroundColor Gray
Write-Host "   - Cloud Functions: 2M invocations/month" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Happy hacking!" -ForegroundColor Green
