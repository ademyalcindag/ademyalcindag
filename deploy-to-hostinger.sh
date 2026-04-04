#!/bin/bash
echo "🚀 tasimacilikrehberi.com - Prodüksiyon Derlemesi Başlıyor"
echo "================================"

# Build the application
echo "📦 Bağımlılıklar kontrol ediliyor..."
npm install

echo "📦 Frontend derleniyor..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Derleme başarılı!"
    echo "📁 'dist' klasörü oluşturuldu."
    echo "📦 Node modülleri prodüksiyon için optimize ediliyor..."
    npm install --production
else
    echo "❌ Derleme hatası!"
    exit 1
fi

echo ""
echo "📋 Next steps for Hostinger:"
echo "1. GitHub deponuzdaki güncellemelerin tamamlandığından emin olun."
echo "2. Hostinger panelinde Node.js versiyonunu 20+ olarak seçin."
echo "3. Set startup file to: server/server.js"
echo "4. Set application root to: /"
echo "5. Enable PM2 process manager"
echo "6. Siteniz artık tasimacilikrehberi.com adresinde yayında!"