#!/bin/bash
echo "🚀 Hostinger Deployment Script"
echo "================================"

# Build the application
echo "📦 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in dist/ directory"
    echo "🌐 Ready for deployment to Hostinger"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "📋 Next steps for Hostinger:"
echo "1. Upload all files to your Hostinger hosting"
echo "2. Set Node.js version to 18+ in Hostinger panel"
echo "3. Set startup file to: server/server.js"
echo "4. Set application root to: /"
echo "5. Enable PM2 process manager"
echo "6. Your site will be live!"