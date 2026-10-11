import { useState } from "react";
import { Icon, WhatsAppIcon } from "./Icon";
import { trackEvent } from "./firebase";
import {
  PHONE_RAW,
  PHONE_TEXT,
  WHATSAPP_NUMBER,
  buildingTypes,
  cities,
  elevatorTypes,
  serviceKinds,
} from "./data";

const UNSURE = "unsure";
const steps = ["Тип лифта", "Объект", "Контакты"];

const initialForm = {
  type: "",
  capacity: "",
  service: serviceKinds[0],
  building: buildingTypes[0],
  stops: 9,
  count: 1,
  city: cities[0],
  name: "",
  phone: "",
  contact: "WhatsApp",
  comment: "",
};

function Stepper({ label, value, min, max, onChange }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="stepper">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`${label}: меньше`}
        >
          <Icon name="minus" size={18} />
        </button>
        <output aria-live="polite">{value}</output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`${label}: больше`}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>
    </div>
  );
}

function ChipGroup({ label, options, value, onChange }) {
  return (
    <fieldset className="field">
      <legend className="field-label">{label}</legend>
      <div className="chips">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`chip ${value === option ? "active" : ""}`}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function buildMessage(form) {
  const type =
    form.type === UNSURE
      ? "Нужна консультация по выбору"
      : elevatorTypes.find((t) => t.id === form.type)?.short;

  return [
    "Здравствуйте! Заявка с сайта Lift TJ",
    "",
    `Услуга: ${form.service}`,
    `Тип лифта: ${type}`,
    form.capacity ? `Грузоподъёмность: ${form.capacity}` : null,
    `Объект: ${form.building}`,
    `Остановок: ${form.stops}`,
    `Количество лифтов: ${form.count}`,
    `Город: ${form.city}`,
    "",
    `Имя: ${form.name.trim()}`,
    `Телефон: ${form.phone.trim()}`,
    `Удобная связь: ${form.contact}`,
    form.comment.trim() ? `Комментарий: ${form.comment.trim()}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export default function OrderForm({ initialType = "" }) {
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [form, setForm] = useState({ ...initialForm, type: initialType });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const selectedType = elevatorTypes.find((t) => t.id === form.type);

  const validate = (index) => {
    const next = {};
    if (index === 0 && !form.type) next.type = "Выберите тип лифта или консультацию";
    if (index === 2) {
      if (form.name.trim().length < 2) next.name = "Укажите имя";
      if (form.phone.replace(/\D/g, "").length < 9) next.phone = "Укажите номер телефона";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(steps.length - 1, s + 1));
    trackEvent("order_step", { step: step + 2 });
  };

  const submit = (event) => {
    event.preventDefault();
    if (step < steps.length - 1) {
      goNext();
      return;
    }
    if (!validate(2)) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(form))}`;
    trackEvent("order_submit", {
      lift_type: form.type,
      service: form.service,
      building: form.building,
      city: form.city,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const reset = () => {
    setForm(initialForm);
    setStep(0);
    setSent(false);
  };

  if (sent) {
    return (
      <div className="order-card order-done">
        <div className="done-mark">
          <Icon name="check" size={34} strokeWidth={2} />
        </div>
        <h3>Заявка сформирована</h3>
        <p>
          Мы открыли WhatsApp с готовым сообщением — осталось нажать «Отправить».
          Инженер свяжется с вами и подготовит расчёт.
        </p>
        <div className="done-actions">
          <a
            className="btn btn-primary"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(form))}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon size={20} /> Открыть WhatsApp ещё раз
          </a>
          <a className="btn btn-ghost" href={`tel:${PHONE_RAW}`}>
            <Icon name="phone" size={18} /> {PHONE_TEXT}
          </a>
        </div>
        <button type="button" className="link-btn" onClick={reset}>
          Новая заявка
        </button>
      </div>
    );
  }

  return (
    <form className="order-card" onSubmit={submit} noValidate>
      <ol className="order-steps" aria-label="Шаги заявки">
        {steps.map((label, index) => (
          <li
            key={label}
            className={index === step ? "current" : index < step ? "done" : ""}
            aria-current={index === step ? "step" : undefined}
          >
            <span>{index < step ? <Icon name="check" size={14} strokeWidth={2.4} /> : index + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="order-pane" key="s0">
          <h3>Какой лифт вам нужен?</h3>
          <div className="type-grid" role="radiogroup" aria-label="Тип лифта">
            {elevatorTypes.map((t) => (
              <button
                type="button"
                role="radio"
                aria-checked={form.type === t.id}
                key={t.id}
                className={`type-option ${form.type === t.id ? "active" : ""}`}
                onClick={() => {
                  update("type", t.id);
                  update("capacity", "");
                }}
              >
                <img src={t.image} alt="" loading="lazy" />
                <span>{t.name}</span>
                <i className="type-check">
                  <Icon name="check" size={14} strokeWidth={2.6} />
                </i>
              </button>
            ))}
            <button
              type="button"
              role="radio"
              aria-checked={form.type === UNSURE}
              className={`type-option type-unsure ${form.type === UNSURE ? "active" : ""}`}
              onClick={() => update("type", UNSURE)}
            >
              <Icon name="help" size={28} />
              <span>Не знаю — помогите подобрать</span>
              <i className="type-check">
                <Icon name="check" size={14} strokeWidth={2.6} />
              </i>
            </button>
          </div>
          {errors.type && <p className="field-error">{errors.type}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="order-pane" key="s1">
          <h3>Расскажите об объекте</h3>
          <ChipGroup
            label="Что требуется"
            options={serviceKinds}
            value={form.service}
            onChange={(v) => update("service", v)}
          />
          <div className="field-row">
            <label className="field">
              <span className="field-label">Тип здания</span>
              <select value={form.building} onChange={(e) => update("building", e.target.value)}>
                {buildingTypes.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Город</span>
              <select value={form.city} onChange={(e) => update("city", e.target.value)}>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="field-row">
            <Stepper
              label="Остановок (этажей)"
              value={form.stops}
              min={2}
              max={40}
              onChange={(v) => update("stops", v)}
            />
            <Stepper
              label="Количество лифтов"
              value={form.count}
              min={1}
              max={20}
              onChange={(v) => update("count", v)}
            />
          </div>
          {selectedType && (
            <ChipGroup
              label="Грузоподъёмность"
              options={[...selectedType.capacities, "Подберите сами"]}
              value={form.capacity}
              onChange={(v) => update("capacity", v)}
            />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="order-pane" key="s2">
          <h3>Куда отправить расчёт?</h3>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Ваше имя</span>
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={!!errors.name}
                placeholder="Как к вам обращаться"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label className="field">
              <span className="field-label">Телефон</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/[^\d+\s()-]/g, ""))}
                aria-invalid={!!errors.phone}
                placeholder="+992 __ ___ __ __"
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>
          </div>
          <ChipGroup
            label="Как удобнее связаться"
            options={["WhatsApp", "Звонок", "Telegram"]}
            value={form.contact}
            onChange={(v) => update("contact", v)}
          />
          <label className="field">
            <span className="field-label">Комментарий (необязательно)</span>
            <textarea
              rows={3}
              value={form.comment}
              onChange={(e) => update("comment", e.target.value)}
              placeholder="Размеры шахты, сроки, пожелания по отделке…"
            />
          </label>
        </div>
      )}

      <div className="order-nav">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
            <Icon name="arrowLeft" size={18} /> Назад
          </button>
        ) : (
          <span className="order-hint">Займёт меньше минуты</span>
        )}
        <button type="submit" className="btn btn-primary">
          {step < steps.length - 1 ? (
            <>
              Далее <Icon name="arrow" size={18} />
            </>
          ) : (
            <>
              <WhatsAppIcon size={20} /> Отправить заявку
            </>
          )}
        </button>
      </div>
    </form>
  );
}
