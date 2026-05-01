# Comfy Panel

Веб-пульт управления для [ComfyUI](https://github.com/comfyanonymous/ComfyUI). Импортируй любой workflow в API-формате, выстави наружу только те входы, которые реально крутишь (промпт, seed, steps, CFG, сэмплер, LoRA и т.п.), и работай с ними через аккуратную форму с live-прогрессом, окном Picture-in-Picture, галереей и пресетами.

> 🇬🇧 English version — [README.md](README.md)

![Дашборд](docs/screenshots/dashboard.png)

## Возможности

- **Дашборд** — live-статус ComfyUI, GPU/VRAM, очередь, поиск по всем установленным нодам.
- **Импорт workflow** — drag&drop, выбор файла, вставка JSON, импорт одним кликом из истории/очереди ComfyUI. Строгая валидация API-формата.
- **Динамический пульт** — для каждого выставленного входа автоматически подбирается виджет по типу из `/object_info` (`INT`, `FLOAT`, `STRING`, `BOOLEAN`, `COMBO`): слайдеры для чисел с диапазоном, textarea для multiline-промптов, select с фильтром для сотен LoRA/чекпоинтов, отдельный виджет seed с режимом `fixed / randomize / increment / decrement`.
- **Drag & drop карточек**, **цвета на блок** (11 палитр) и переключатель **1 / 2 / 3 колонки**.
- **Запуск** — отправка в `/prompt`, прогресс по WebSocket, текущая нода, прогресс-бар, ошибки и **live-превью** во время сэмплинга. Кнопка прерывания. История запусков.
- **Picture-in-Picture** окно (Chrome/Edge 116+) и плавающее «закрепляемое» превью, которое остаётся видимым при скролле.
- **Галерея** — постраничная история всех запусков с превью, вкладками метаданных (Картинки / Workflow / Статус), импортом workflow в один клик.
- **Пресеты** — сохранение всей текущей конфигурации (workflow + выставленные входы + значения + режимы seed + порядок + цвета) в JSON-файл в `data/presets/`. Загрузка, переименование, удаление из отдельной страницы.
- **Двуязычный интерфейс** — English / Русский, переключатель в шапке.

## Скриншоты

| Экран        | Путь                                  |
| ------------ | ------------------------------------- |
| Дашборд      | `docs/screenshots/dashboard.png`      |
| Workflow     | `docs/screenshots/workflow.png`       |
| Пульт        | `docs/screenshots/panel.png`          |
| Live-превью  | `docs/screenshots/preview.png`        |
| Галерея      | `docs/screenshots/gallery.png`        |
| Пресеты      | `docs/screenshots/presets.png`        |

> Положи свои скриншоты в `docs/screenshots/` с именами выше — они автоматически появятся в README.

## Требования

- **Node.js 20+** (LTS) — [скачать](https://nodejs.org/).
- **Запущенный ComfyUI**. По умолчанию пульт ожидает его на `http://127.0.0.1:8188`. Проверено с **ComfyUI 0.19+** (frontend ≥ 1.42).
- **Современный браузер** — Chrome / Edge / Firefox. PiP-окно работает в Chromium-браузерах 116+.

## Быстрый старт (Windows)

1. Установи [Node.js 20+](https://nodejs.org/) и запусти ComfyUI любым привычным способом.
2. Клонируй или скачай этот репозиторий.
3. Двойной клик по **`start.bat`**.
   - При первом запуске выполнится `npm install` (≈ 1–2 минуты).
   - Дальше пульт стартует на **http://localhost:3000**.

## Установка вручную (любая ОС)

```bash
git clone https://github.com/iliazykov19-cpu/ComfyComfyUI.git
cd comfy-panel

# По желанию — скопировать и поправить env (дефолты обычно подходят)
cp .env.example .env.local

npm install
npm run dev
```

Открой http://localhost:3000 в браузере.

## Переменные окружения

`.env.local` (скопировать из `.env.example`):

| Переменная                  | По умолчанию             | Описание                                                                                                              |
| --------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `COMFY_BASE_URL`            | `http://127.0.0.1:8188`  | Адрес твоего сервера ComfyUI.                                                                                          |
| `NEXT_PUBLIC_COMFY_WS_URL`  | *(не задано)*            | Принудительный URL WS. Оставь пустым — встроенный сервер проксирует WS к ComfyUI и обходит его DNS-rebinding защиту. |

## Как пользоваться

### 1. Импорт workflow

В навигации открой **Workflow**. Способы:

- Перетащи `.json`, экспортированный из ComfyUI (**Save (API Format)** — включи Dev Mode в настройках ComfyUI, если пункт скрыт).
- Выбери файл через кнопку.
- Вставь сырой JSON в textarea.
- Нажми **Import last run** — подтянет последний prompt из истории ComfyUI (выручает, если экспорт глючит).
- Нажми **Import from queue** — берёт то, что прямо сейчас в очереди/выполняется.

Отметь чекбоксы у входов, которые хочешь редактировать на пульте. **Expose all** удобно, чтобы выставить всё сразу и потом снять лишнее.

### 2. Собрать пульт

Открой **Panel**. Форма генерируется из схемы:

- Перетаскивай карточки за иконку-«ручку» (слева сверху каждой карточки) для смены порядка.
- Кнопка-палитра выбирает цвет блока — удобно группировать визуально.
- Переключатель **1 / 2 / 3** колонки в тулбаре.
- Виджет **seed** — с кнопкой случайного значения и селектором «после генерации» (`fixed / randomize / increment / decrement`), который применяется автоматически после каждого запуска.

### 3. Запуск

Жми **Run**. Пульт:

- Шлёт собранный workflow в `/prompt` со стабильным client_id.
- Подключается к WebSocket ComfyUI через прокси (`/api/comfy/ws`), обходя его 403 от DNS-rebinding защиты.
- Стримит события `progress`, `executing`, `executed`, `execution_*` в интерфейс.
- Показывает **live-превью** во время сэмплинга, если в ComfyUI включён preview method (Settings → *Image Preview Method* → TAESD/Latent2RGB или флаг `--preview-method taesd` при запуске).

Кнопки:

- **Open PiP** — системное Picture-in-Picture окно (Chrome/Edge 116+).
- **Pin preview** — плавающее окно превью в углу страницы.
- **Interrupt** — прервать текущий запуск.

### 4. Галерея и пресеты

- **Gallery** — список прошлых запусков с превью и метаданными. Клик по карточке открывает вкладки: все выходные изображения, исходный workflow JSON и статус.
- **Presets** сохраняют всю текущую конфигурацию (workflow + выставленные входы + значения + seed-режимы + порядок + цвета) в `data/presets/<id>.json`. Управляй через кнопки **Save preset** / **Load preset** на страницах Workflow и Panel либо на отдельной странице **Presets** (переименование, удаление).

## Архитектура

- **Next.js 16** (App Router) + TypeScript + TailwindCSS + shadcn/ui (внутри base-ui).
- **Zustand**-стейт: `workflow`, `panel`, `run`, `i18n`. Где надо — persist в `localStorage`.
- **TanStack Query** для REST-данных ComfyUI.
- **Кастомный Node.js-сервер** (`server.js`):
  - Хостит Next.js (REST + страницы).
  - Проксирует REST `/api/comfy/*` к ComfyUI (server-to-server, удаляя `Origin`/`Referer`, чтобы обойти DNS-rebinding защиту).
  - Проксирует WebSocket `/api/comfy/ws` → `/ws` ComfyUI, переписывая `Origin` на адрес самого ComfyUI.
- **dnd-kit** для drag-and-drop.
- **Document Picture-in-Picture API** для системного PiP-окна (с fallback в виде CSS-плавающего overlay).

```
comfy-panel/
├── server.js                # Кастомный Next.js-сервер с WS-прокси
├── src/
│   ├── app/                 # App Router страницы + API
│   │   ├── api/
│   │   │   ├── comfy/[...path]/   # REST-прокси к ComfyUI
│   │   │   └── presets/           # CRUD пресетов
│   │   ├── page.tsx               # Дашборд
│   │   ├── workflow/page.tsx      # Редактор workflow
│   │   ├── panel/page.tsx         # Основной пульт
│   │   ├── gallery/page.tsx       # История запусков
│   │   └── presets/page.tsx       # Управление пресетами
│   ├── components/          # UI-компоненты (PanelForm, RunPanel, Gallery, ...)
│   ├── lib/
│   │   ├── comfy/           # Server-only клиент к ComfyUI + типы
│   │   ├── workflow/        # Парсер/билдер API-формата
│   │   ├── widgets/         # Нормализация спецификаций виджетов
│   │   ├── presets/         # Схема пресетов + хранилище в файлах
│   │   ├── panel/           # Палитра цветов карточек
│   │   └── i18n/            # Сообщения переводов
│   └── store/               # Zustand-сторы
└── data/                    # Создаётся при работе, хранит JSON пресетов
```

## Скрипты

| Команда            | Что делает                                                                  |
| ------------------ | --------------------------------------------------------------------------- |
| `npm run dev`      | Запуск dev-сервера (кастомный Node-сервер + Next.js HMR + WS-прокси).      |
| `npm run dev:next` | Чистый `next dev` (без WS-прокси, для отладки Next.js).                    |
| `npm run build`    | Production-сборка.                                                          |
| `npm run start`    | Запуск production-сервера.                                                  |
| `npm run lint`     | ESLint.                                                                     |

## Решение проблем

- **`offline` или `403` от `/prompt`** — что-то идёт в ComfyUI с чужого origin. Встроенный `server.js` уже срезает `Origin`/`Referer` для REST и подменяет `Origin` для WS. Если всё равно ловишь 403 — запусти ComfyUI с `--enable-cors-header "*"`.
- **WebSocket мерцает `closed/connecting`** — проверь, что запускаешь через `npm run dev` (или `start.bat`), а не `npm run dev:next`. WS-прокси живёт в кастомном сервере.
- **Нет live-превью** — ComfyUI не шлёт превью-фреймы. В настройках ComfyUI поставь *Image Preview Method* → **TAESD** (лучше всего) или **Latent2RGB**, либо запусти ComfyUI с флагом `--preview-method taesd`.
- **Нет пункта `Save (API Format)`** — включи *Dev Mode* в настройках ComfyUI или используй кнопку **Import last run** в пульте, предварительно один раз поставив workflow в очередь.

## Лицензия

MIT.
