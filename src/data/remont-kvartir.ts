export interface ServiceItem {
  title: string;
  summary: string;
  priceFrom: string;
}

export interface CaseItem {
  title: string;
  category: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const pageMeta = {
  title: 'Ремонт квартир под ключ в Тюмени — Монолит',
  description:
    'Ремонт квартир под ключ в Тюмени: дизайн, отделка, инженерия. Оставьте заявку — рассчитаем смету.',
};

export const hero = {
  title: 'Ремонт квартир под ключ в Тюмени',
  support: '[Короткий оффер: смета, сроки, одна команда]',
  ctaLabel: 'Оставить заявку',
  ctaHref: '#lead',
  photoAlt: 'Фото готового ремонта квартиры — будет добавлено',
};

export const trust = [
  {
    title: '[Фиксированная смета]',
    text: '[Кратко: без скрытых доплат в процессе]',
  },
  {
    title: '[Сроки по договору]',
    text: '[Кратко: ответственность за график]',
  },
  {
    title: '[Гарантия на работы]',
    text: '[Срок гарантии — уточнить]',
  },
  {
    title: '[Приёмка с вами]',
    text: '[Кратко: этапы и финальная сдача]',
  },
] as const;

export const packageOffer = {
  title: '[Название пакета под ключ]',
  eyebrow: 'Пакетное предложение',
  items: [
    '[Черновые и чистовые материалы]',
    '[Дизайн-проект]',
    '[Работы и надзор]',
    '[Инженерия и отделка]',
    '[Дополнительно — уточнить]',
  ] as const,
  priceFrom: '[от — ₽/м²]',
  ctaLabel: 'Оставить заявку',
  ctaHref: '#lead',
};

export const services: ServiceItem[] = [
  {
    title: '[Услуга 1]',
    summary: '[Краткое описание]',
    priceFrom: '[от — ₽]',
  },
  {
    title: '[Услуга 2]',
    summary: '[Краткое описание]',
    priceFrom: '[от — ₽]',
  },
  {
    title: '[Услуга 3]',
    summary: '[Краткое описание]',
    priceFrom: '[от — ₽]',
  },
  {
    title: '[Услуга 4]',
    summary: '[Краткое описание]',
    priceFrom: '[от — ₽]',
  },
];

export const cases: CaseItem[] = [
  { title: '[Объект 1]', category: '[категория]' },
  { title: '[Объект 2]', category: '[категория]' },
  { title: '[Объект 3]', category: '[категория]' },
  { title: '[Объект 4]', category: '[категория]' },
];

export const about = {
  title: 'О нас',
  text: '[Текст о направлении ремонта квартир — плейсхолдер до материалов заказчика.]',
  metrics: [
    { value: '[N+]', label: '[метрика 1]' },
    { value: '[N+]', label: '[метрика 2]' },
  ] as const,
};

export const faq: FaqItem[] = [
  {
    question: '[Что входит в ремонт под ключ?]',
    answer: '[Ответ — плейсхолдер.]',
  },
  {
    question: '[Сколько длится ремонт?]',
    answer: '[Ответ — плейсхолдер.]',
  },
  {
    question: '[Как считается стоимость?]',
    answer: '[Ответ — плейсхолдер.]',
  },
  {
    question: '[Какая гарантия?]',
    answer: '[Ответ — плейсхолдер.]',
  },
];

export const jsonLdService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ремонт квартир под ключ',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Монолит',
    telephone: '+7-919-950-77-22',
    email: 'monolittmn@mail.ru',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Депутатская, 129',
      addressLocality: 'Тюмень',
      addressCountry: 'RU',
    },
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Тюмень и область',
  },
  description: pageMeta.description,
};
