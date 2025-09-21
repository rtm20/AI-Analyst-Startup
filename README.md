# 🚀 AI Startup Analyst - Google AI Hackathon

**Real Google Cloud AI-Powered Investment Analysis Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Google Cloud AI](https://img.shields.io/badge/Google%20Cloud-AI%20Powered-blue)](https://cloud.google.com/ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

## 🎯 **Project Overview**

AI Startup Analyst is a sophisticated investment analysis platform that leverages **real Google Cloud AI services** to automatically analyze startup pitch decks and generate comprehensive investment insights. Built specifically for the Google AI Hackathon, this application showcases the power of Google's AI ecosystem in transforming how investors evaluate early-stage companies.

### 🏆 **Hackathon Highlights**

- ✅ **Real Google AI Integration**: Uses Google Vision API, Vertex AI (Gemini), and Cloud Storage
- ✅ **Production-Ready**: Complete error handling, health monitoring, and fallback systems
- ✅ **Intelligent Fallback**: Graceful degradation from real AI to mock mode for demonstrations
- ✅ **Professional UI**: Enterprise-grade interface with comprehensive analytics
- ✅ **Scalable Architecture**: Built for real-world deployment and usage

## 🤖 **Google AI Services Integration**

### **Google Vision API**
- **Document Text Extraction**: OCR for PDFs, presentations, and images
- **Multi-format Support**: PDF, JPEG, PNG, GIF, WebP, BMP, TIFF
- **High Accuracy**: Production-grade text recognition for financial documents

### **Google Vertex AI (Gemini)**
- **Intelligent Analysis**: Company information extraction
- **Financial Metrics**: Revenue, growth rates, unit economics analysis
- **Team Evaluation**: Founder backgrounds and team strength assessment
- **Risk Analysis**: Automated risk flag detection and scoring
- **Investment Recommendations**: AI-generated buy/sell/hold decisions

### **Google Cloud Storage**
- **Secure File Handling**: Encrypted document storage
- **Signed URLs**: Temporary access for processed documents
- **Scalable Architecture**: Handle thousands of document uploads

## 🚀 **Quick Start**

### **Demo Mode (No Setup Required)**
```bash
# Clone the repository
git clone <repository-url>
cd "AI Analyst for Startup Evaluation"

# Install dependencies
npm install

# Run in demo mode
npm run dev
```

Visit `http://localhost:3000` - The app will run in demo mode with mock AI processing.

### **Real Google AI Mode**
Follow the comprehensive [Google Cloud Setup Guide](./GOOGLE_CLOUD_SETUP.md) to enable real AI processing.

## 🎨 **Key Features**

- **📊 Comprehensive Analysis Dashboard**
- **🔄 Smart Processing System** (Real AI + Demo fallback)
- **🎯 Professional UI/UX** 
- **⚡ Real-time Health Monitoring**
- **🛡️ Production-Ready Security**

## 🏆 **Ready for Google AI Hackathon!** 

This project demonstrates the full potential of Google's AI ecosystem in creating practical, scalable solutions for real-world business challenges.

## ✨ Features

- **📄 Document Processing**: Upload pitch decks (PDF/PPTX) with Cloud Vision OCR
- **🧠 AI Analysis**: Gemini-powered startup evaluation and risk assessment  
- **📊 Benchmarking**: Industry comparisons and financial metrics analysis
- **⚠️ Risk Detection**: Automated red flag identification
- **📈 Investment Insights**: AI-generated recommendations and deal notes
- **🎨 Modern UI**: React with Tailwind CSS and Google Material Design

## 🏗️ Architecture

```
Frontend (React/Next.js) → Google Cloud Functions → AI Services
                                ↓
                          Cloud Storage ← Cloud Vision
                                ↓
                          Firestore ← Gemini Pro
                                ↓
                          BigQuery ← Vertex AI
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Cloud Account (free tier)
- Google Cloud CLI installed

### 1. Clone & Install
```bash
git clone <repo-url>
cd ai-startup-analyst
npm install
```

### 2. Google Cloud Setup
```bash
# Create new project
gcloud projects create ai-startup-analyst-demo

# Set project
gcloud config set project ai-startup-analyst-demo

# Enable APIs
gcloud services enable vision.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com

# Create service account
gcloud iam service-accounts create ai-analyst-service
gcloud projects add-iam-policy-binding ai-startup-analyst-demo \
  --member="serviceAccount:ai-analyst-service@ai-startup-analyst-demo.iam.gserviceaccount.com" \
  --role="roles/storage.admin"
gcloud projects add-iam-policy-binding ai-startup-analyst-demo \
  --member="serviceAccount:ai-analyst-service@ai-startup-analyst-demo.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Download key
gcloud iam service-accounts keys create google-cloud-key.json \
  --iam-account=ai-analyst-service@ai-startup-analyst-demo.iam.gserviceaccount.com
```

### 3. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your Google Cloud project details
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Project Structure

```
ai-startup-analyst/
├── app/                    # Next.js 13+ app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── upload/           # File upload UI
│   ├── analysis/         # Analysis results
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── google-cloud.ts  # Google Cloud services
│   └── document-processor.ts # Document processing
├── store/                # Zustand state management
├── types/                # TypeScript definitions
└── public/               # Static assets
```

## 🔧 Google Cloud Free Tier Usage

This project is optimized for Google Cloud's generous free tier:

- **Cloud Functions**: 2M invocations/month
- **Cloud Storage**: 5GB storage  
- **Cloud Vision**: 1,000 requests/month
- **Vertex AI**: Limited free tier for Gemini
- **Firestore**: 50K reads, 20K writes/day

## 🎯 Demo Scenarios

### 1. Upload Pitch Deck
- Drag & drop PDF/PPTX file
- Watch real-time processing stages
- Get complete analysis in <2 minutes

### 2. Risk Analysis
- Upload problematic deck with red flags
- See AI-detected inconsistencies
- Review risk assessment matrix

### 3. Benchmarking
- Compare startup metrics vs industry
- View percentile rankings
- Get investment recommendations

## 🧠 AI Capabilities

### Document Processing
- **OCR Extraction**: Cloud Vision API for text/image processing
- **Structure Analysis**: Identify slides, sections, financial tables
- **Multi-format Support**: PDF, PPTX, DOCX, TXT

### Startup Analysis  
- **Financial Metrics**: Revenue, growth, burn rate, runway
- **Team Assessment**: Founder backgrounds, experience gaps
- **Market Analysis**: TAM/SAM validation, competitive positioning
- **Risk Detection**: Inconsistencies, unrealistic claims, red flags

### Investment Insights
- **Scoring**: 0-100 investment recommendation score
- **Benchmarking**: Industry comparisons and percentiles  
- **Due Diligence**: Key questions and next steps
- **Executive Summary**: Investor-ready 2-3 sentence insights

## 🔍 Technical Deep Dive

### AI Prompting Strategy
- **Multi-stage Analysis**: Separate prompts for different analysis types
- **Structured Output**: JSON schemas for consistent data extraction
- **Confidence Scoring**: 0-100 confidence for each insight
- **Evidence Tracking**: Citations and supporting data for claims

### Performance Optimization
- **Caching**: Store processed results to avoid re-analysis
- **Lazy Loading**: Load analysis sections on-demand
- **Batch Processing**: Group API calls for efficiency
- **Progressive Enhancement**: Core features work without JS

### Error Handling
- **Graceful Degradation**: Fallbacks for API failures
- **User Feedback**: Clear error messages and retry options
- **Monitoring**: Track success rates and performance metrics
- **Rate Limiting**: Respect free tier quotas

## 🚀 Deployment

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
npm install -g vercel
vercel deploy

# Or deploy to Google Cloud Run
gcloud run deploy ai-startup-analyst \
  --source . \
  --platform managed \
  --region us-central1
```

### Environment Variables
Set these in your deployment platform:
- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_APPLICATION_CREDENTIALS` (or use service account keys)
- `NEXTAUTH_SECRET`

## 📊 Success Metrics

- **Processing Speed**: <2 minutes for standard pitch deck
- **Accuracy**: 80%+ financial metric extraction accuracy
- **User Experience**: Sub-3 second page loads
- **AI Quality**: 3+ actionable insights per analysis

## 🤝 Contributing

This is a hackathon project showcasing Google AI capabilities. Future improvements:

1. **Enhanced AI**: Fine-tuned models for startup analysis
2. **Real-time Data**: Live market data integration  
3. **Collaboration**: Multi-user analysis and sharing
4. **Mobile App**: React Native companion app
5. **API Access**: Public API for integration

## 📜 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Google Cloud AI team for amazing APIs
- Vercel for seamless deployment
- Next.js community for excellent documentation
- Tailwind CSS for beautiful UI components

---

**Built with ❤️ for the Google AI Hackathon**

*Showcasing the power of Gemini, Cloud Vision, and Vertex AI for startup investment analysis.*
