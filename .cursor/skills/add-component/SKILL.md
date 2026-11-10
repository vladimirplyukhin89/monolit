---
name: add-component
description: Добавляет UI-компонент monolit по инвентарю и макету — решает статика или остров, токены, размещение в src/components. Use when creating a new component, block, section, or when the user asks to implement something from the component inventory or Figma.
---

# Добавление компонента

## Перед кодом

1. Прочитай `docs/design/component-inventory.md` и найди/добавь запись.
2. Уточни источник: макет Figma (предпочтительно) или разбор в `docs/design/references/`.
3. Реши тип:
   - **статика** → `src/components/Name.astro`
   - **остров** → React в компонентах + `client:*` только при необходимости JS
4. Данные компании не выдумывай — плейсхолдеры.

## Реализация

1. Создай файл `PascalCase` в `src/components/`.
2. Стили — только токены из `src/styles/tokens.css`, mobile-first.
3. Если нужны новые токены — список «было → стало», согласуй до правки `tokens.css`.
4. Подключи на странице; для островов — минимальная гидратация.
5. Обнови статус в `component-inventory.md` (например, «в работе» / «готово»).

## Проверка

- Один смысл у компонента, без лишнего JS
- `alt` у изображений, фокус и подписи у интерактивных элементов
- Не копируй тексты/бренд с референсов
