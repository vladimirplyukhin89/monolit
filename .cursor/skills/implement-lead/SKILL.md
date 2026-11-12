---
name: implement-lead
description: Реализует или правит форму заявок и серверный поток lead — сохранение, каналы Telegram/Max/почта, антиспам, env. Use when working on LeadForm, /api/lead, lead notifications, honeypot, Callibri, or docs/architecture/leads.md.
---

# Реализация заявок

## Перед началом

1. Прочитай целиком `docs/architecture/leads.md` и `.env.example`.
2. Статус: архитектура проектная. PHP vs Node, маршрут Telegram, хранение — **предложи варианты и спроси**, не выбирай сам.
3. Не клади секреты в клиент и не используй `PUBLIC_*` для токенов.

## Целевой поток

1. Остров `LeadForm`: клиентская валидация → `POST` JSON на `PUBLIC_LEAD_ENDPOINT` (обычно `/api/lead`). Без переменной — stub (Vercel staging).
2. Сервер: метод, размер, honeypot (`website`), `startedAt`, rate limit, поля, `consent === true`.
3. **Сначала сохранить** заявку, потом независимая рассылка в Telegram / Max / почту (таймаут 5–10 с на канал).
4. Ответ `200 {"ok": true}`, если сохранено; `400` с `errors`; `429`; `500` только если не сохранили.
5. Позже: cron на повтор упавших каналов.

## Контракт полей

Обязательные: `name`, `phone`, `consent`, `startedAt`.  
Опциональные: `email`, `message`, `service` (`landscape` | `renovation` | `other`), `page`, `utm`, honeypot `website` (пустой).

Шаблон сообщения в каналы — обычный текст без разметки, как в `leads.md`.

## Callibri

Отдельный отложенный виджет (`CallibriWidget.astro` + `PUBLIC_CALLIBRI_ENABLED`). Не смешивать с `/api/lead`.

## После правок

- Сверь `.env.example` с новыми именами переменных (без значений).
- Напомни про проверки на Beget из раздела «Открытые вопросы» в `leads.md`.
- На Vercel staging не задавать секреты каналов и `PUBLIC_LEAD_ENDPOINT` (см. `docs/architecture/deploy.md`).
