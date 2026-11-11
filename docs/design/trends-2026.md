# Тренды веб-дизайна 2026 и решения для monolit

Разбор от 2026-11-11. Фокус: микроанимации и переходы, радиусы, цвета кнопок, фонов, затемнений и hover.

## Общая картина

- **Спокойная основа + один акцент.** Цвет года Pantone 2026 — Cloud Dancer `#F0EEE9` (тёплый off-white). Тренд: тёплые нейтральные фоны вместо `#FFFFFF` и холодного серого, тонированные тёмные, один насыщенный цвет для действий. «Дофаминовая» насыщенность — для лайфстайл- и молодёжных брендов, monolit не подходит.
- **Motion как система.** Длительности и кривые — токены. Анимация подтверждает действие или объясняет смену состояния; ничего не играет при загрузке без триггера; `prefers-reduced-motion` обязателен.
- **Форма.** Радиус по размеру элемента; капсулы для главных кнопок и чипов; концентричность вложенных радиусов (Apple Liquid Glass); шкала Material 3 Expressive 4–48 + full. `corner-shape: squircle` — только Chromium, как прогрессивное улучшение.
- **Нативные средства.** Переходы между страницами, анимация `<dialog>`, scroll-driven анимации и пружины через `linear()` — на CSS, без зависимостей.

## Поддержка браузеров (ноябрь 2026)

| Возможность | Поддержка | Без поддержки |
|---|---|---|
| `@view-transition` между страницами | Chrome/Edge 126+, Safari 18.2+ | Firefox: обычный мгновенный переход |
| `document.startViewTransition()` в пределах страницы | все, Firefox 144+ | — |
| `@starting-style`, `transition-behavior: allow-discrete` | все | Firefox: выход из `<dialog>` без анимации |
| `animation-timeline` (scroll-driven) | все с октября 2026 | старые версии — без анимации |
| `linear()` easing | все | — |
| `corner-shape` | только Chromium | обычный `border-radius` |

## Решения (согласовано 2026-11-11)

### Цвет

- Текст на оранжевой кнопке — `#222222` (`--color-primary-contrast`). Контраст 6.48:1; белый давал 2.45:1 (не AA).
- Состояния выводятся из базовых токенов через `color-mix(in oklch, ...)`: `--color-primary-hover`, `--color-primary-active`, `--color-inverse-hover`, `--color-ghost-hover`.
- Затемнение — `--color-scrim` (тёплый тёмный 55 %, в dark — чёрный 65 %). Для фона модалок и подложек под текст на фото; на фото — градиент снизу вверх, не сплошная плашка.
- Тёплый фон (пробуем, сверить с Figma): `--color-bg-muted` `#E8E8E8` → `#EBE8E2`, `--color-surface` `#F3F3F1` → `#F5F3EF`, `--color-border` `#D4D4D4` → `#D9D5CE`. Dark-тема пока без изменений.

### Радиусы

- Кнопки, чипы, переключатели — капсула `--radius-full`.
- Модалки, шторки, крупные контейнеры — `--radius-2xl` (32px).
- Вложенные элементы — концентрично: `max(var(--radius-md), calc(<внешний радиус> - <отступ>))`. Применено в `DirectionChooser`.
- Открыто: поля формы 8px → 12px (в шкале нет 12px).

### Анимации

| Токен | Значение | Для чего |
|---|---|---|
| `--duration-fast` | 120ms | hover, нажатие |
| `--duration-base` | 200ms | смена состояния: вкладка, поле формы |
| `--duration-slow` | 320ms | панели, модалки, переход страницы |
| `--ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | появление |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | перемещение |
| `--press-scale` | 0.97 | нажатие кнопки |

- Правила: анимируем только `transform` и `opacity` (и цвет фона на hover); закрытие быстрее открытия; при `prefers-reduced-motion: reduce` движение отключается глобально (`global.css`), `--press-scale: 1`.
- Переходы между страницами: `@view-transition { navigation: auto; }` в `global.css`, шапка закреплена через `view-transition-name: site-header`. `<ClientRouter />` Astro не используем — превращает сайт в SPA и добавляет JS.

### Форма заявки

- И модалка из шапки/CTA, и форма внизу страницы. Модалка — нативный `<dialog>`: на мобиле шторка снизу, на десктопе fade + scale 0.96 → 1; фон `--color-scrim`. Реализация — отдельной задачей через skill `implement-lead`.

## Следующие шаги

- `LeadDialog`: `<dialog>` + `@starting-style`, фокус-ловушка нативная, закрытие по Esc и клику по фону.
- `MobileNav` как шторка на `<dialog>` с той же анимацией.
- Морфинг карточки направления на главной в hero страницы направления (`view-transition-name`).
- Вкладки/выбор в `DirectionChooser`: переезжающая подложка + кроссфейд через `startViewTransition()`.
- Hover карточек кейсов: подъём 2px, фото `scale(1.03)` внутри `overflow: hidden`.
- Поля формы: плавное появление фокуса, состояние ошибки и успеха.

## Источники

- [StudioMeyer — Web Design Trends 2026](https://studiomeyer.io/en/blog/webdesign-trends-2026)
- [Gleam — UI Design Trends 2026](https://www.gleamstudio.design/blog-post/ui-design-trends-2026)
- [Gleam — Color Trends 2026](https://www.gleamstudio.design/blog-post/color-trends-2026)
- [Envato — Web design trends 2026](https://elements.envato.com/learn/web-design-trends)
- [Material 3 — corner radius scale](https://m3.material.io/styles/shape/corner-radius-scale)
- [Smashing — corner-shape](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/)
- [caniuse — cross-document view transitions](https://caniuse.com/cross-document-view-transitions)
- [Chrome — animate to/from top layer](https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/animate-to-from-top-layer)
- [Recolor — Cloud Dancer on a website](https://recolor.page/guides/color-of-the-year-2026-on-a-website/)
