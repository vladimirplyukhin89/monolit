import { useId, useState, type ChangeEvent } from 'react';

type Status = 'idle' | 'ok' | 'error';
type Field = 'name' | 'contact' | 'consent';
type ContactChannel = 'phone' | 'telegram' | 'max';

interface LeadImage {
  src: string;
  width: number;
  height: number;
}

interface Props {
  /** `dialog` — только форма, заголовок и обёртку даёт LeadDialog */
  variant?: 'section' | 'dialog';
  /** Фото справа на desktop (секция); в dialog не показывается */
  image?: LeadImage;
}

const DEFAULT_IMAGE: LeadImage = {
  src: '/images/jpg/участок-3.jpg',
  width: 1003,
  height: 1280,
};

const CHANNELS: readonly {
  id: ContactChannel;
  ariaLabel: string;
}[] = [
  { id: 'phone', ariaLabel: 'Телефон' },
  { id: 'telegram', ariaLabel: 'Telegram' },
  { id: 'max', ariaLabel: 'Max' },
];

const CONTACT_LABEL: Record<ContactChannel, string> = {
  phone: 'Телефон',
  telegram: 'Никнейм или номер телефона',
  max: 'Ссылка или телефон',
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Нормализация к 11 цифрам, начиная с 7 (РФ). */
function normalizeRuPhoneDigits(raw: string): string {
  let digits = digitsOnly(raw);
  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  } else if (digits.length > 0 && !digits.startsWith('7')) {
    digits = `7${digits}`;
  }
  return digits.slice(0, 11);
}

/** Маска: +7 (999) 999-99-99 */
function formatRuPhone(raw: string): string {
  const digits = normalizeRuPhoneDigits(raw);
  if (digits.length === 0) return '';

  const rest = digits.slice(1);
  let result = '+7';
  if (rest.length === 0) return result;

  result += ` (${rest.slice(0, 3)}`;
  if (rest.length <= 3) return result;

  result += `) ${rest.slice(3, 6)}`;
  if (rest.length <= 6) return result;

  result += `-${rest.slice(6, 8)}`;
  if (rest.length <= 8) return result;

  return `${result}-${rest.slice(8, 10)}`;
}

function isValidRuPhone(value: string): boolean {
  return /^7\d{10}$/.test(normalizeRuPhoneDigits(value));
}

function isValidContact(channel: ContactChannel, value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (channel === 'phone') return isValidRuPhone(trimmed);
  return trimmed.length >= 2;
}

function ChannelIcon({ channel }: { channel: ContactChannel }) {
  if (channel === 'phone') {
    return (
      <svg
        className="lead__icon-phone"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        />
      </svg>
    );
  }

  if (channel === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path
          fill="#1d98dc"
          d="M21.5 4.3 3.8 11.1c-1.2.5-1.2 1.2-.2 1.5l4.5 1.4 1.7 5.3c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.5c.3-1.3-.5-1.9-1.5-1.3zM9.8 14.2l-.3 3.7-1.2-4 10.8-6.7-9.3 7z"
        />
      </svg>
    );
  }

  return (
    <img
      className="lead__channel-icon"
      src="/icons/max.svg"
      width={20}
      height={20}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
}

export default function LeadForm({ variant = 'section', image = DEFAULT_IMAGE }: Props) {
  const uid = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState<Field[]>([]);
  const [channel, setChannel] = useState<ContactChannel>('phone');
  const [contact, setContact] = useState('');

  const clearInvalid = (field: Field) => {
    setInvalid((fields) => fields.filter((item) => item !== field));
  };

  const selectChannel = (next: ContactChannel) => {
    setChannel(next);
    setContact('');
    clearInvalid('contact');
    setStatus('idle');
  };

  const onContactChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setContact(channel === 'phone' ? formatRuPhone(value) : value);
    clearInvalid('contact');
  };

  const onSubmit = (event: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get('company_site') ?? '').trim() !== '') {
      setStatus('ok');
      form.reset();
      setChannel('phone');
      setContact('');
      return;
    }

    const name = String(data.get('name') ?? '').trim();
    const consent = data.get('consent') === 'on';
    const contactValue = contact.trim();

    const nextInvalid: Field[] = [];
    if (!name) nextInvalid.push('name');
    if (!isValidContact(channel, contactValue)) nextInvalid.push('contact');
    if (!consent) nextInvalid.push('consent');
    setInvalid(nextInvalid);

    if (nextInvalid.length > 0) {
      setStatus('error');
      return;
    }

    setSubmitting(true);
    // Заглушка до API lead (Telegram / Max / почта)
    console.info('lead stub', {
      name,
      contactChannel: channel,
      contact:
        channel === 'phone' ? normalizeRuPhoneDigits(contactValue) : contactValue,
    });
    window.setTimeout(() => {
      setSubmitting(false);
      setStatus('ok');
      form.reset();
      setChannel('phone');
      setContact('');
    }, 400);
  };

  const form = (
    <form className="lead__form" onSubmit={onSubmit} noValidate>
      <div className="lead__honeypot" aria-hidden="true">
        <label htmlFor={`${uid}-site`}>Сайт</label>
        <input id={`${uid}-site`} name="company_site" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="lead__field">
        <label htmlFor={`${uid}-name`}>Имя</label>
        <input
          id={`${uid}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={invalid.includes('name') || undefined}
          onInput={() => clearInvalid('name')}
        />
      </div>

      <div className="lead__contact">
        <div className="lead__channels" role="tablist" aria-label="Способ связи">
          {CHANNELS.map((item) => {
            const selected = channel === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${uid}-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`${uid}-contact`}
                className={`lead__channel${selected ? ' is-selected' : ''}`}
                onClick={() => selectChannel(item.id)}
              >
                <ChannelIcon channel={item.id} />
                <span className="lead__channel-label">{item.ariaLabel}</span>
              </button>
            );
          })}
        </div>

        <div
          className="lead__field"
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-tab-${channel}`}
        >
          <label htmlFor={`${uid}-contact`}>{CONTACT_LABEL[channel]}</label>
          <input
            id={`${uid}-contact`}
            name="contact"
            type={channel === 'phone' ? 'tel' : 'text'}
            autoComplete={channel === 'phone' ? 'tel' : 'off'}
            inputMode={channel === 'phone' ? 'tel' : 'text'}
            required
            value={contact}
            placeholder={
              channel === 'phone'
                ? '+7 (___) ___-__-__'
                : channel === 'telegram'
                  ? '@username или телефон'
                  : 'Ссылка или телефон'
            }
            aria-invalid={invalid.includes('contact') || undefined}
            onChange={onContactChange}
          />
          <input type="hidden" name="contactChannel" value={channel} />
        </div>
      </div>

      <label className="lead__consent">
        <input
          name="consent"
          type="checkbox"
          required
          aria-invalid={invalid.includes('consent') || undefined}
          onChange={() => clearInvalid('consent')}
        />
        <span>
          Согласен(на) на обработку персональных данных и ознакомлен(а) с{' '}
          <a href="/politika-konfidencialnosti">политикой конфиденциальности</a>
        </span>
      </label>
      <button className="lead__submit" type="submit" disabled={submitting}>
        {submitting ? 'Отправка…' : 'Отправить'}
      </button>
      {status === 'ok' ? (
        <p className="lead__status" role="status">
          Заявка принята (тест). Скоро подключим отправку на сервер.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="lead__status lead__status--error" role="alert">
          {channel === 'phone'
            ? 'Заполните имя, корректный телефон и согласие.'
            : 'Заполните имя, способ связи и согласие.'}
        </p>
      ) : null}
    </form>
  );

  if (variant === 'dialog') {
    return (
      <>
        {form}
        <style>{styles}</style>
      </>
    );
  }

  return (
    <section id="lead" className="lead section" aria-labelledby="lead-title">
      <div className="container">
        <div className="lead__layout">
          <div className="lead__panel glow">
            <h2 id="lead-title" className="lead__title">
              Оставить заявку
            </h2>
            <p className="lead__text">Перезвоним и согласуем выезд или консультацию.</p>
            {form}
          </div>
          <div className="lead__media" aria-hidden="true">
            <img
              className="lead__photo"
              src={encodeURI(image.src)}
              alt=""
              width={image.width}
              height={image.height}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .lead__layout {
    display: grid;
    gap: var(--space-6);
  }
  .lead__panel {
    background: var(--color-bg);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    max-width: 36rem;
  }
  .lead__media {
    display: none;
  }
  .lead__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-xl);
  }
  @media (min-width: 768px) {
    .lead__layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: stretch;
      gap: var(--space-8);
    }
    .lead__panel {
      max-width: none;
    }
    .lead__media {
      display: block;
      min-height: 100%;
      overflow: hidden;
      border-radius: var(--radius-xl);
    }
  }
  .lead__title {
    margin: 0 0 var(--space-3);
    font-size: var(--font-size-xl);
    font-weight: 500;
    line-height: var(--line-height-tight);
  }
  .lead__text {
    margin: 0 0 var(--space-6);
    color: var(--color-text-muted);
  }
  .lead__form {
    display: grid;
    gap: var(--space-4);
  }
  .lead__contact {
    display: grid;
    gap: var(--space-3);
  }
  .lead__channels {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-2);
  }
  .lead__channel {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    min-height: 2.75rem;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-bg);
    color: var(--color-text-muted);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .lead__channel:hover {
    background: var(--color-ghost-hover);
    color: var(--color-text);
  }
  .lead__channel:active {
    transform: scale(var(--press-scale));
  }
  .lead__channel.is-selected {
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary) 16%, var(--color-bg));
    color: var(--color-text);
  }
  .lead__icon-phone {
    color: #000;
    flex-shrink: 0;
  }
  [data-theme='dark'] .lead__icon-phone {
    color: #fff;
  }
  .lead__channel-icon {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
  .lead__channel-label {
    display: none;
  }
  @media (min-width: 480px) {
    .lead__channel-label {
      display: inline;
    }
  }
  .lead__field {
    display: grid;
    gap: var(--space-2);
  }
  .lead__field label,
  .lead__consent {
    font-weight: 500;
  }
  .lead__field input,
  .lead__field textarea {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-3);
    font: inherit;
    color: var(--color-text);
    background: var(--color-bg);
    transition:
      border-color var(--duration-base) var(--ease-out),
      box-shadow var(--duration-base) var(--ease-out);
  }
  .lead__field input:focus-visible,
  .lead__field textarea:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
  .lead__form [aria-invalid='true'] {
    border-color: var(--color-primary);
    animation: lead-shake var(--duration-slow) var(--ease-out);
  }
  .lead__consent input[aria-invalid='true'] {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  @keyframes lead-shake {
    25% { translate: calc(var(--space-1) * -1) 0; }
    75% { translate: var(--space-1) 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .lead__form [aria-invalid='true'] {
      animation: none;
    }
  }
  .lead__consent {
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;
    font-weight: 400;
    color: var(--color-text-muted);
  }
  .lead__consent input {
    margin-top: 0.25rem;
  }
  .lead__submit {
    justify-self: start;
    border: 0;
    border-radius: var(--radius-full);
    padding: var(--space-3) var(--space-6);
    background: var(--color-primary);
    color: var(--color-primary-contrast);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    transition:
      background-color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }
  .lead__submit:hover:not(:disabled) {
    background: var(--color-primary-hover);
  }
  .lead__submit:active:not(:disabled) {
    background: var(--color-primary-active);
    transform: scale(var(--press-scale));
  }
  .lead__submit:disabled {
    opacity: 0.7;
    cursor: wait;
  }
  .lead__status {
    margin: 0;
    color: var(--color-text);
    animation: lead-status-in var(--duration-base) var(--ease-out);
  }
  @keyframes lead-status-in {
    from {
      opacity: 0;
      translate: 0 var(--space-1);
    }
  }
  .lead__status--error {
    color: var(--color-primary);
  }
  .lead__honeypot {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
`;
