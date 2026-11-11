import { useId, useState } from 'react';

type Status = 'idle' | 'ok' | 'error';
type Field = 'name' | 'phone' | 'consent';

interface Props {
  /** `dialog` — только форма, заголовок и обёртку даёт LeadDialog */
  variant?: 'section' | 'dialog';
}

export default function LeadForm({ variant = 'section' }: Props) {
  const uid = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [invalid, setInvalid] = useState<Field[]>([]);

  const clearInvalid = (field: Field) => {
    setInvalid((fields) => fields.filter((item) => item !== field));
  };

  const onSubmit = (event: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get('company_site') ?? '').trim() !== '') {
      setStatus('ok');
      form.reset();
      return;
    }

    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const consent = data.get('consent') === 'on';

    const nextInvalid: Field[] = [];
    if (!name) nextInvalid.push('name');
    if (!phone) nextInvalid.push('phone');
    if (!consent) nextInvalid.push('consent');
    setInvalid(nextInvalid);

    if (nextInvalid.length > 0) {
      setStatus('error');
      return;
    }

    setSubmitting(true);
    // Заглушка до API lead (Telegram / Max / почта)
    console.info('lead stub', { name, phone, message: String(data.get('message') ?? '') });
    window.setTimeout(() => {
      setSubmitting(false);
      setStatus('ok');
      form.reset();
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
      <div className="lead__field">
        <label htmlFor={`${uid}-phone`}>Телефон</label>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          aria-invalid={invalid.includes('phone') || undefined}
          onInput={() => clearInvalid('phone')}
        />
      </div>
      <div className="lead__field">
        <label htmlFor={`${uid}-message`}>Комментарий</label>
        <textarea id={`${uid}-message`} name="message" rows={3} />
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
          Заполните имя, телефон и согласие.
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
        <div className="lead__panel glow">
          <h2 id="lead-title" className="lead__title">
            Оставить заявку
          </h2>
          <p className="lead__text">Перезвоним и согласуем выезд или консультацию.</p>
          {form}
        </div>
      </div>
      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .lead__panel {
    background: var(--color-bg);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    max-width: 36rem;
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
