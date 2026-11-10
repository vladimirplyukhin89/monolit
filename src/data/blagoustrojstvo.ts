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

export interface TestimonialItem {
  quote: string;
  author: string;
}

export const pageMeta = {
  title: 'Благоустройство участка под ключ в Тюмени — Монолит',
  description:
    'Комплексное благоустройство участка в Тюмени и области: асфальт, брусчатка, дренаж, отмостки. Бесплатный выезд и расчёт.',
};

export const hero = {
  title: 'Комплексное благоустройство участка в Тюмени и области',
  support: 'Бесплатный выезд специалиста и расчёт стоимости',
  ctaLabel: 'Оставить заявку',
  ctaHref: '#lead',
  chips: [
    'асфальтирование',
    'брусчатка',
    'водоотведение',
    'отмостки',
    'тротуарная плитка',
  ] as const,
  photoAlt: 'Фото выполненного благоустройства участка — будет добавлено',
};

export const services: ServiceItem[] = [
  {
    title: 'Асфальтирование территорий',
    summary: 'Дворы, парковки, подъездные дороги',
    priceFrom: 'от 800 ₽/м²',
  },
  {
    title: 'Укладка брусчатки и тротуарной плитки',
    summary: 'Дорожки, парковочные зоны, площадки',
    priceFrom: 'от 900 ₽/м²',
  },
  {
    title: 'Установка бордюров',
    summary: 'Тротуарный, дорожный, металлический, шарнирный',
    priceFrom: 'от 400 ₽/м',
  },
  {
    title: 'Отмостка',
    summary: 'Брусчатка, тротуарная плитка, бетон',
    priceFrom: 'от 800 ₽/м²',
  },
  {
    title: 'Комплексное благоустройство участка',
    summary: 'Планировка, основание, комплекс под ключ',
    priceFrom: 'от 350 ₽',
  },
  {
    title: 'Водоотведение и дренаж',
    summary: 'Дренаж, ливнёвка, отвод воды',
    priceFrom: 'от 400 ₽',
  },
];

export const cta = {
  title: 'Закажите бесплатный выезд специалиста и получите скидку 5%',
  text: 'Специалист приедет в удобное время, сделает замеры и подготовит предварительную смету.',
  ctaLabel: 'Оставить заявку',
  href: '#lead',
};

export const cases: CaseItem[] = [
  { title: '[Объект: дорожки]', category: 'дорожки' },
  { title: '[Объект: асфальтирование]', category: 'асфальтирование' },
  { title: '[Объект: площадка]', category: 'площадки' },
  { title: '[Объект: отмостка]', category: 'отмостки' },
];

export const about = {
  title: 'О нас',
  text: 'Мы занимаемся благоустройством участков и территорий в Тюмени и области.',
  metrics: [
    { value: '300+', label: 'выполненных объектов' },
    { value: '5+', label: 'лет опыта' },
  ] as const,
};

export const testimonials: TestimonialItem[] = [
  {
    quote: '[Текст отзыва клиента]',
    author: '[Имя]',
  },
  {
    quote: '[Текст отзыва клиента]',
    author: '[Имя]',
  },
];

export const faq: FaqItem[] = [
  {
    question: 'Сколько стоит благоустройство участка?',
    answer:
      'Стоимость зависит от площади и состава работ. Ориентиры «от» — в блоке услуг; точный расчёт — после выезда специалиста.',
  },
  {
    question: 'Вы выезжаете на объект?',
    answer: 'Да. Бесплатный выезд специалиста и расчёт стоимости.',
  },
  {
    question: 'Цена может измениться в процессе работ?',
    answer: 'Цена фиксируется в смете до начала работ — без скрытых платежей.',
  },
  {
    question: 'Вы работаете по договору?',
    answer: 'Да, работаем по договору. Сроки и объём фиксируем в документах.',
  },
  {
    question: 'Сколько времени занимают работы?',
    answer: '[Сроки зависят от объёма работ; фиксируем в договоре.]',
  },
  {
    question: 'Есть ли гарантия на работы?',
    answer: 'Гарантия на работы — до 5 лет.',
  },
  {
    question: 'Можно заказать только одну услугу?',
    answer: 'Да. Можно заказать одну услугу или комплексное благоустройство.',
  },
];

export const jsonLdService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Благоустройство участка',
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
