---
name: seo-page-check
description: Проверяет страницу Astro по SEO, семантике, OG/JSON-LD и доступности перед релизом или после правок. Use when adding or editing pages, before release, or when the user asks for an SEO checklist or page audit.
---

# SEO-проверка страницы

## Перед проверкой

1. Определи целевую страницу (`src/pages/...`) и её layout.
2. Прочитай страницу и `src/layouts/BaseLayout.astro`.
3. При необходимости открой собранную/dev-страницу в браузере.

## Чек-лист

Скопируй и отмечай:

```
SEO / страница:
- [ ] Уникальные title и description через BaseLayout
- [ ] Один h1, логичная иерархия h2–h3
- [ ] Семантическая разметка (header, main, nav, footer, section)
- [ ] canonical корректен
- [ ] Open Graph (title, description, url; image если есть)
- [ ] alt у содержательных изображений
- [ ] JSON-LD LocalBusiness и/или Service где уместно (slot="head")
- [ ] Понятный URL без лишних параметров
- [ ] noindex только если страница служебная
- [ ] Изображения через оптимизацию Astro, размеры заданы, lazy где уместно
- [ ] Минимум клиентского JS
- [ ] Контраст и фокус с клавиатуры (WCAG 2.1 AA)
- [ ] У полей форм есть подписи; согласие на ПДн со ссылкой на политику
```

## Отчёт

Кратко: что ок, что починить (с путями файлов), что отложить. Не предлагай SSR или новые зависимости без согласования.
