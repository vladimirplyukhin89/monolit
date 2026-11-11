# Предложения по токенам

Источники: фирменные цвета monolit, ритм география.рф, nikakih-nervov (структура ремонта), light/dark тема.

## Актуальные (в `src/styles/tokens.css`)

### Light (`:root`)

| Токен | Значение | Роль |
|---|---|---|
| `--color-bg` | `#FFFFFF` | светлые секции / поверхности |
| `--color-bg-muted` | `#EBE8E2` | фон page-shell (тёплый, сверить с Figma) |
| `--color-bg-inverse` | `#222222` | контрастные секции (кейсы ремонта и т. п.) |
| `--color-on-inverse` | `#FFFFFF` | текст на inverse |
| `--color-surface` | `#F5F3EF` | вторичные поверхности |
| `--color-text` | `#222222` | основной текст |
| `--color-text-muted` | `#5C5C5C` | приглушённый текст |
| `--color-primary` | `#F28C28` | фирменный оранжевый (CTA) |
| `--color-primary-contrast` | `#222222` | текст на оранжевом (см. контраст) |
| `--color-border` | `#D9D5CE` | границы |
| `--color-primary-hover` / `-active` | `color-mix` от primary | hover / нажатие оранжевых кнопок |
| `--color-inverse-hover` | `color-mix` от inverse | hover тёмных кнопок |
| `--color-ghost-hover` | `color-mix` от text | hover кнопок-контуров |
| `--color-scrim` | тёплый тёмный 55 % | фон модалок, подложки на фото |
| `--color-ambient-landscape` | `#D5E8DA` | салатовый tint карточки «Благоустройство» |
| `--color-ambient-renovation` | `#F3DDE6` | розовый tint карточки «Ремонт» |
| `--color-chooser-text` | `#222222` | текст на пастельных карточках chooser |
| `--color-chooser-text-muted` | `#5C5C5C` | приглушённый на карточках chooser |

### Dark (`[data-theme='dark']`)

| Токен | Значение | Роль |
|---|---|---|
| `--color-bg` | `#2A2825` | поверхности / карточки |
| `--color-bg-muted` | `#211F1D` | фон page-shell |
| `--color-bg-inverse` | `#1B1A18` | контрастные секции — остаются тёмными, глубже фона |
| `--color-on-inverse` | `#F3F1EC` | текст на inverse |
| `--color-surface` | `#34312E` | вторичные поверхности |
| `--color-text` | `#F3F1EC` | основной текст |
| `--color-text-muted` | `#B3AEA6` | приглушённый текст |
| `--color-border` | `#4A4642` | границы |
| `--color-scrim` | чёрный 65 % | фон модалок |
| `--shadow-color` | чёрный 50 % | тени (в light — тёплый тёмный 14 %) |

Primary и primary-contrast без смены. Ambient и chooser-text **не** переопределяются — карточки направлений всегда пастельные с тёмным текстом. Контраст dark-пар — в `trends-2026.md`.

Тема: `localStorage['monolit-theme']` или `prefers-color-scheme`; anti-FOUC в `BaseLayout`.

Шрифт: Golos Text. Радиусы: sm/md/lg/xl/2xl + `--radius-full` (кнопки, чипы). Контейнер: `72rem`. Анимации: `--duration-*`, `--ease-*`, `--press-scale` — см. `trends-2026.md`.

## Контраст (промер)

| Пара | Контраст | WCAG 2.1 AA |
|---|---|---|
| `#222222` на `#FFFFFF` | 15.91:1 | ок |
| `#FFFFFF` на `#F28C28` | **2.45:1** | **не ок** |
| `#222222` на `#F28C28` | 6.48:1 | ок |
| `#222222` на `#D5E8DA` / `#F3DDE6` | высокий | ок для текста на карточках |

**Решено (2026-11-11):** на оранжевой кнопке текст `#222222`.

## Правила применения

- Оранжевый — CTA и редкие плашки (`PackageBand`), не фон страницы.
- Салатовый / розовый — **только** карточки DirectionChooser на главной.
- Глобально — light/dark через `data-theme` на `<html>`, переключатель в Header.
- `/remont-kvartir`: локальные inverse-секции (PhotoHero, CaseGrid dark) — контентный контраст, не тема сайта.

## Статус

- Light/dark + tint только в chooser — внесено в `tokens.css` (2026-11-11).
- Тёплый фон, состояния кнопок, scrim, капсулы, токены анимаций — внесено (2026-11-11), разбор в `trends-2026.md`.
- Тёплая dark-тема, inverse тёмный в dark, `--shadow-color` — внесено (2026-11-11).
