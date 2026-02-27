# Angry Birds Clone (Static Web)

Локальная веб-игра на Phaser 2.

## Быстрый старт

1. Запусти локальный HTTP-сервер:

```bash
./scripts/serve.sh
```

2. Открой в браузере:

- `http://127.0.0.1:8080/AngryBirds.htm`

Важно: не запускать через `file://`.
Браузер блокирует локальные XHR/WebGL-запросы (CORS), из-за чего ломается загрузка ассетов.

## Замена ассетов

Все рабочие ассеты находятся в `assets/embedded/`.

Чтобы заменить визуал/звук:

1. Положи свой файл в `assets/embedded/`.
2. Сохрани исходное имя файла (или обнови путь в `AngryBirdsGame.js`).
3. Обнови страницу с жёсткой очисткой кэша (`Ctrl+F5`).

## Уровни

В текущей сборке подключены уровни `level1..level15`.

## GitHub Pages

В проект добавлен workflow `.github/workflows/pages.yml`.
После пуша в `main`/`master` сайт деплоится на GitHub Pages автоматически.

## Проверка перед push

```bash
node --check AngryBirdsGame.js
python3 scripts/validate_project.py
```

Дополнительно это же проверяется в CI (`.github/workflows/ci.yml`).
