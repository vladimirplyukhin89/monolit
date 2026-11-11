import { useState } from 'react';

type Status = 'idle' | 'ok' | 'error';

export default function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [submitting, setSubmitting] = useState(false);

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

    if (!name || !phone || !consent) {
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

  return (
    <section id="lead" className="lead section" aria-labelledby="lead-title">
      <div className="container">
        <div className="lead__panel">
          <h2 id="lead-title" className="lead__title">
            Оставить заявку
          </h2>
          <p className="lead__text">Перезвоним и согласуем выезд или консультацию.</p>
          <form className="lead__form" onSubmit={onSubmit} noValidate>
            <div className="lead__honeypot" aria-hidden="true">
              <label htmlFor="company_site">Сайт</label>
              <input id="company_site" name="company_site" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="lead__field">
              <label htmlFor="lead-name">Имя</label>
              <input id="lead-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="lead__field">
              <label htmlFor="lead-phone">Телефон</label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>
            <div className="lead__field">
              <label htmlFor="lead-message">Комментарий</label>
              <textarea id="lead-message" name="message" rows={3} />
            </div>
            <label className="lead__consent">
              <input name="consent" type="checkbox" required />
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
