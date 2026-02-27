# Аудит проекта Angry Birds (frontend/game)

Дата: 2026-02-27

## 1) Сводка

Проект рабочий, но технически перегружен одним большим файлом и дублирующими ресурсами.
Ключевые риски перед production-публикацией:

- Монолитный `AngryBirdsGame.js` (движок + логика + base64-ресурсы) сильно усложняет поддержку.
- Дубли/лишние ассеты занимают ~16.5 МБ (`assets/resources` + `resources.zip`), при этом не нужны в рантайме.
- Механика хранения настроек местами использует `Secure` cookie, что ломает локальный сценарий на `http://`.
- Service Worker кеширует все same-origin ответы без ограничений (риск разрастания кеша и устаревших ресурсов).
- В коде присутствует debug-функционал (`WIN` кнопка), который должен быть отключаемым.

---

## 2) Архитектурный аудит

### 2.1 Файловая структура

- Точка входа оболочки: `AngryBirds.htm` (iframe-обертка, SW, manifest).
- Игровая страница: `AngryBirdsGame.htm`.
- Вся игровая логика: `AngryBirdsGame.js`.
- Runtime-ассеты: `assets/embedded/*`.
- Нерабочие/референс ассеты: `assets/resources/*` + `resources.zip`.

### 2.2 Размеры

- Общий размер проекта: ~20 МБ.
- `assets/embedded`: ~1.3 МБ.
- `assets/resources`: ~9.0 МБ.
- `resources.zip`: ~7.5 МБ.

### 2.3 Использование ассетов

Проверка соответствия `assets/embedded` и ссылок из `AngryBirdsGame.js`:

- Файлов в `assets/embedded`: 40.
- Ссылок на `assets/embedded/*` в JS: 32.
- Лишние (неиспользуемые) 8 файлов: все `audio*.mp3`.

Причина: аудио сейчас грузится из `data:audio/...` внутри `AngryBirdsGame.js`, а не из `assets/embedded`.

---

## 3) Проблемы и приоритет

## Critical

1. Монолитный JS и смешение ответственности
- Файл: `AngryBirdsGame.js`.
- Включает: Phaser/Pixi/p2 + game states + уровни + base64-ресурсы.
- Риск: крайне дорогая поддержка и высокий риск регрессий при точечных правках.

2. Неправильная конфигурация манифеста для форка/нового Pages
- Файл: `AngryBirds.json`.
- `start_url` и `icons.src` жестко указывают на `https://lrusso.github.io/AngryBirds/...`.
- Риск: в вашем репозитории PWA/иконки будут ссылаться на чужой origin.

## High

1. Дублированная и частично неконсистентная логика настроек
- Файл: `AngryBirdsGame.js`.
- `setBooleanSetting` дублируется в разных state и использует `Secure` cookie (минимум в двух местах).
- Риск: локальный запуск и поведение настроек могут отличаться по экрану/сценарию.

2. Service Worker без стратегии ограничения кеша
- Файл: `worker.js`.
- Сейчас `fetch` пишет все successful same-origin ответы в кеш.
- Риск: рост кеша, сложность инвалидации, неочевидное устаревание статических ресурсов.

3. Debug-кнопка в production-коде
- Файл: `AngryBirdsGame.js` (`debugPassLevel*`).
- Риск: пользователь может ломать progression в релизной версии.

## Medium

1. Мертвый код после отключения заставок
- Файл: `AngryBirdsGame.js`.
- `Preloader` сразу идет в `SplashGame`, но `Splash`/`Disclaimer` state остаются в коде и регистрируются.
- Риск: лишняя поддержка, шум в файле.

2. Лишние runtime-файлы
- `assets/resources/*` и `resources.zip` не нужны при текущем режиме загрузки.
- Риск: раздутый репозиторий и время клонирования.

3. Обертка через iframe + частый `setInterval(..., 250)`
- Файл: `AngryBirds.htm`.
- Риск: лишние перерисовки/focus-циклы, потенциальные мобильные баги.

## Low

1. Отсутствие i18n-модуля как инфраструктуры
- Сейчас язык задается через `STRING_*` и условие `userLanguage.substring(0,2)=="es"`.
- Риск: сложное масштабирование локализаций (RU/EN и т.д.).

2. Отсутствие CI/линта/автотестов
- Риск: баги ловятся только вручную в браузере.

---

## 4) Предложения по рефакторингу (по этапам)

### Этап A — Стабилизация (без изменения геймплея)

1. Вынести конфиг окружения:
- `config/appConfig.js` (debug, rendererMode, storage policy).

2. Единый storage-сервис:
- `src/core/storage.js` с API:
  - `getBoolean(key)` / `setBoolean(key, value)`
  - `getNumber(key, fallback)` / `setNumber(key, value)`
- Приоритет: `localStorage`, fallback на cookie без `Secure` для локали.

3. Debug-only режим:
- Кнопку `WIN` рендерить только при `DEBUG=true`.

4. Удалить/отключить мертвые state:
- `Splash`/`Disclaimer` либо удалить, либо оставить под флагом `SHOW_INTRO`.

### Этап B — Декомпозиция

1. Разбить `AngryBirdsGame.js`:
- `vendor/phaser-bundle.js` (движок).
- `src/game/states/*.js`.
- `src/game/levels/*.json`.
- `src/game/assetsManifest.js`.

2. Убрать `data:audio` из JS:
- Переключить аудио на `assets/embedded/audio*.mp3`.
- Это вернет удобную замену ассетов без правки кода.

3. Уровни в отдельные JSON:
- `assets/levels/level01.json` ... `level15.json`.

### Этап C — i18n (инфраструктурный)

1. Добавить:
- `assets/i18n/ru.json`, `assets/i18n/en.json`.
- `src/core/localization.js` (`getText`, `setLanguage`, `detectBrowserLanguage`).

2. Убрать захардкоженные UI-строки в state.

---

## 5) План удаления лишнего кода и ресурсов

1. Удалить из runtime-пакета:
- `resources.zip`.
- `assets/resources/*` (оставить только если нужна папка `source-assets/` для дизайнеров).

2. После перевода аудио на внешние файлы:
- удалить `data:audio` блоки из JS.

3. Удалить дубли `setBooleanSetting` и унифицировать через storage-сервис.

4. Удалить неиспользуемые state и обработчики.

---

## 6) План оптимизации

1. Оптимизация загрузки
- Внешние ассеты вместо base64 в JS.
- Lazy preload тяжелых экранов (например, episode intro).

2. Оптимизация кеша
- Service Worker: cache-first только для статик-файлов по whitelist.
- Версионирование `APP_CACHE` + cleanup в `activate`.

3. Оптимизация рендера
- Свести `Graphics` overlays к минимуму.
- Оставить `Phaser.CANVAS` для `file://` debug, но на production предпочесть `AUTO` через флаг.

4. Оптимизация репозитория
- Git LFS для крупных бинарников (опционально).

---

## 7) GitHub (репозиторий)

Сейчас в директории нет `.git`.

Минимальные шаги:

```bash
git init
git add .
git commit -m "chore: initial import and audit"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Рекомендуется:
- Добавить `.gitignore`.
- Добавить `CHANGELOG.md`.
- Ввести commit-конвенцию (`feat/fix/chore/refactor`).

---

## 8) GitHub Pages (публикация)

1. Исправить `AngryBirds.json`:
- `start_url` -> относительный (`"./AngryBirds.htm"`).
- `icons.src` -> относительные пути.

2. Включить Pages:
- Settings -> Pages -> Deploy from branch -> `main` / root.

3. Проверка после деплоя:
- Игра стартует по `https://<user>.github.io/<repo>/AngryBirds.htm`.
- Работают уровни и прогресс.
- Нет 404 по ассетам.
- SW отдает актуальные ресурсы после hard refresh.

---

## 9) Рекомендуемый порядок работ

1. Стабилизация (storage + debug flag + manifest fix).
2. Очистка лишних ассетов и dead code.
3. Декомпозиция JS и вынос уровней/ассетов в манифесты.
4. i18n-инфраструктура.
5. Финальная оптимизация и публикация на GitHub Pages.

