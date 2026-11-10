# Черновик контента

Сюда копируйте тексты и фото до переноса в Astro collections (`src/content`) и `src/assets` / `public`.

## Файлы

| Файл | Что заполнить |
|---|---|
| `company.md` | бренд, контакты, реквизиты |
| `home.md` | оффер главной, тексты DirectionChooser, trust |
| `blagoustrojstvo.md` | услуги, FAQ, about, CTA |
| `remont-kvartir.md` | то же для ремонта (сейчас плейсхолдеры) |
| `politika-konfidencialnosti.md` | текст политики |

Маркеры `<!-- вставить: ... -->` — места для вашей вставки. Можно затирать плейсхолдеры целиком.

## Фото

Кладёте файлы в `media/<направление>/<раздел>/`.

Рекомендуемые имена:

- hero: `01.webp`, `02.webp`
- services: `asfalt.webp`, `bruschatka.webp` (или `01.webp`…)
- before-after: `before-01.webp`, `after-01.webp`
- cases: `01.webp`, `02.webp`…

Форматы: WebP или JPEG. Желательно сжимать перед коммитом (оригиналы 10+ МБ лучше не коммитить).

После заполнения скажите — перенесём в код страниц и коллекции.
