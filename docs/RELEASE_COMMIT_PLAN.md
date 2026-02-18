# Yayın Öncesi 3 Commit Planı

Bu plan, mevcut değişiklikleri **commit atmadan önce** temiz 3 gruba ayırır.

## 1) `chore(repo): workspace cleanup and docs grouping`

```bash
git add .gitignore .dockerignore .env.example README.md docs/ \
  API_DOCS.md MOBILE_README.md QUICKSTART.md SETUP_COMPLETE.md

git commit -m "chore(repo): clean workspace and regroup docs"
```

Not: Eski kök dokümanların silinmesi (`D`) ve `docs/` altına taşınması bu committe birlikte olmalı.

## 2) `feat(backend): production-ready server and deployment`

```bash
git add package.json package-lock.json vite.config.js server/index.js Dockerfile docker-compose.yml

git commit -m "feat(backend): add production server and deployment setup"
```

## 3) `feat(web+mobile): auth, messaging and mobile structure`

```bash
git add src/data.js src/components/Auth.jsx src/components/CompanyDashboard.jsx src/components/CompanyProfile.jsx \
  mobile/package.json mobile/package-lock.json mobile/App.js mobile/api.js mobile/constants.js \
  mobile/MOBILE_APP_README.md mobile/screens/ mobile/app/(tabs)/index.tsx mobile/app/(tabs)/web.tsx

git commit -m "feat(web-mobile): unify auth and messaging flows"
```

## Commit öncesi hızlı kontrol

```bash
npm run build
```

## Önemli

Aşağıdaki dosyalar **repo'dan kaldırılmış** olmalı (takip edilmemeli):
- `server.db`
- `db.sqlite`
- `node_modules/.package-lock.json`
- `node_modules/.vite/deps/_metadata.json`
