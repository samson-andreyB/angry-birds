# Deploy: GitHub + GitHub Pages

## 1) Инициализация репозитория (локально)

```bash
git init -b main
git add .
git commit -m "chore: cleanup, local server, pages workflow"
```

## 2) Создание удалённого репозитория на GitHub

Создай пустой репозиторий, например `angry-birds`.

## 3) Подключение remote и push

```bash
git remote add origin git@github.com:<YOUR_USER>/angry-birds.git
git push -u origin main
```

## 4) Включение GitHub Pages

1. GitHub -> `Settings` -> `Pages`.
2. Source: `GitHub Actions`.
3. После push workflow `.github/workflows/pages.yml` выполнит деплой автоматически.

## 5) URL сайта

После успешного workflow сайт будет доступен по адресу:

- `https://<YOUR_USER>.github.io/angry-birds/index.html`

## Примечание

- Локально запускать только через HTTP:
  - `./scripts/serve.sh`
