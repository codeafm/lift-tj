import { useState } from "react";
import { Icon, WhatsAppIcon } from "./Icon";
import { trackEvent } from "./firebase";
import { useI18n } from "./i18n";
import { PHONE_RAW, PHONE_TEXT, WHATSAPP_NUMBER, elevatorTypes, swatches } from "./data";

const UNSURE = "unsure";
const AUTO = "auto";

const initialForm = {
  type: "",
  capacity: null,
  service: 0,
  building: 0,
  stops: 9,
  count: 1,
  city: 0,
  name: "",
  phone: "",
  contact: 0,
  comment: "",
};

function Stepper({ label, value, min, max, onChange, less, more }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="stepper">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`${label}: ${less}`}
        >
          <Icon name="minus" size={18} />
        </button>
        <output aria-live="polite">{value}</output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`${label}: ${more}`}
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
            key={option.value}
            className={`chip ${value === option.value ? "active" : ""}`}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const indexed = (labels) => labels.map((label, value) => ({ label, value }));

function finishText(finish, t) {
  const o = t.configurator.options;
  return `${o[finish.walls]} · ${o[finish.floor]} · ${o[finish.light]}`;
}

function buildMessage(form, finish, t) {
  const o = t.order;
  const m = o.msg;
  const type = form.type === UNSURE ? m.unsure : t.types[form.type]?.short;
  const capacity =
    form.capacity === null ? null : form.capacity === AUTO ? o.pickForMe : `${form.capacity} ${t.unit}`;

  return [
    m.greeting,
    "",
    `${m.service}: ${o.serviceKinds[form.service]}`,
    `${m.type}: ${type}`,
    capacity ? `${m.capacity}: ${capacity}` : null,
    finish ? `${m.finish}: ${finishText(finish, t)}` : null,
    `${m.building}: ${o.buildingTypes[form.building]}`,
    `${m.stops}: ${form.stops}`,
    `${m.count}: ${form.count}`,
    `${m.city}: ${o.cities[form.city]}`,
    "",
    `${m.name}: ${form.name.trim()}`,
    `${m.phone}: ${form.phone.trim()}`,
    `${m.contact}: ${o.contactKinds[form.contact]}`,
    form.comment.trim() ? `${m.comment}: ${form.comment.trim()}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export default function OrderForm({ initialType = "", initialFinish = null }) {
  const { t } = useI18n();
  const o = t.order;
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [form, setForm] = useState({ ...initialForm, type: initialType });
  const [finish, setFinish] = useState(initialFinish);
  const [errorKeys, setErrorKeys] = useState({});
  const [sent, setSent] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrorKeys((prev) => ({ ...prev, [key]: undefined }));
  };

  const selectedType = elevatorTypes.find((x) => x.id === form.type);

  const validate = (index) => {
    const next = {};
    if (index === 0 && !form.type) next.type = "errType";
    if (index === 2) {
      if (form.name.trim().length < 2) next.name = "errName";
      if (form.phone.replace(/\D/g, "").length < 9) next.phone = "errPhone";
    }
    setErrorKeys(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(2, s + 1));
    trackEvent("order_step", { step: step + 2 });
  };

  const whatsappHref = () =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(form, finish, t))}`;

  const submit = (event) => {
    event.preventDefault();
    if (step < 2) {
      goNext();
      return;
    }
    if (!validate(2)) return;
    trackEvent("order_submit", {
      lift_type: form.type,
      service: form.service,
      building: form.building,
      city: form.city,
      with_finish: !!finish,
    });
    window.open(whatsappHref(), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const reset = () => {
    setForm(initialForm);
    setFinish(null);
    setStep(0);
    setSent(false);
  };

  const err = (key) => errorKeys[key] && o[errorKeys[key]];

  if (sent) {
    return (
      <div className="order-card order-done">
        <div className="done-mark">
          <Icon name="check" size={34} strokeWidth={2} />
        </div>
        <h3>{o.doneTitle}</h3>
        <p>{o.doneText}</p>
        <div className="done-actions">
          <a className="btn btn-primary" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={20} /> {o.doneAgain}
          </a>
          <a className="btn btn-ghost" href={`tel:${PHONE_RAW}`}>
            <Icon name="phone" size={18} /> {PHONE_TEXT}
          </a>
        </div>
        <button type="button" className="link-btn" onClick={reset}>
          {o.newOrder}
        </button>
      </div>
    );
  }

  return (
    <form className="order-card" onSubmit={submit} noValidate>
      <ol className="order-steps" aria-label={o.stepsLabel}>
        {o.steps.map((label, index) => (
          <li
            key={index}
            className={index === step ? "current" : index < step ? "done" : ""}
            aria-current={index === step ? "step" : undefined}
          >
            <span>{index < step ? <Icon name="check" size={14} strokeWidth={2.4} /> : index + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      {finish && (
        <div className="finish-banner">
          <span className="finish-dots" aria-hidden="true">
            {[finish.walls, finish.floor, finish.light].map((id) => (
              <i key={id} style={{ background: swatches[id] }} />
            ))}
          </span>
          <div>
            <small>{o.finishLabel}</small>
            <strong>{finishText(finish, t)}</strong>
          </div>
          <button type="button" onClick={() => setFinish(null)} aria-label={o.finishRemove}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      {step === 0 && (
        <div className="order-pane" key="s0">
          <h3>{o.q1}</h3>
          <div className="type-grid" role="radiogroup" aria-label={o.steps[0]}>
            {elevatorTypes.map((x) => (
              <button
                type="button"
                role="radio"
                aria-checked={form.type === x.id}
                key={x.id}
                className={`type-option ${form.type === x.id ? "active" : ""}`}
                onClick={() => {
                  update("type", x.id);
                  update("capacity", null);
                }}
              >
                <img src={x.image} alt="" loading="lazy" />
                <span>{t.types[x.id].name}</span>
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
              <span>{o.unsure}</span>
              <i className="type-check">
                <Icon name="check" size={14} strokeWidth={2.6} />
              </i>
            </button>
          </div>
          {err("type") && <p className="field-error">{err("type")}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="order-pane" key="s1">
          <h3>{o.q2}</h3>
          <ChipGroup
            label={o.serviceLabel}
            options={indexed(o.serviceKinds)}
            value={form.service}
            onChange={(v) => update("service", v)}
          />
          <div className="field-row">
            <label className="field">
              <span className="field-label">{o.buildingLabel}</span>
              <select value={form.building} onChange={(e) => update("building", Number(e.target.value))}>
                {o.buildingTypes.map((b, i) => (
                  <option key={i} value={i}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">{o.cityLabel}</span>
              <select value={form.city} onChange={(e) => update("city", Number(e.target.value))}>
                {o.cities.map((c, i) => (
                  <option key={i} value={i}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="field-row">
            <Stepper
              label={o.stopsLabel}
              value={form.stops}
              min={2}
              max={40}
              onChange={(v) => update("stops", v)}
              less={o.less}
              more={o.more}
            />
            <Stepper
              label={o.countLabel}
              value={form.count}
              min={1}
              max={20}
              onChange={(v) => update("count", v)}
              less={o.less}
              more={o.more}
            />
          </div>
          {selectedType && (
            <ChipGroup
              label={o.capacityLabel}
              options={[
                ...selectedType.capacities.map((kg) => ({ label: `${kg} ${t.unit}`, value: kg })),
                { label: o.pickForMe, value: AUTO },
              ]}
              value={form.capacity}
              onChange={(v) => update("capacity", v)}
            />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="order-pane" key="s2">
          <h3>{o.q3}</h3>
          <div className="field-row">
            <label className="field">
              <span className="field-label">{o.nameLabel}</span>
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={!!err("name")}
                placeholder={o.namePh}
              />
              {err("name") && <span className="field-error">{err("name")}</span>}
            </label>
            <label className="field">
              <span className="field-label">{o.phoneLabel}</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/[^\d+\s()-]/g, ""))}
                aria-invalid={!!err("phone")}
                placeholder="+992 __ ___ __ __"
              />
              {err("phone") && <span className="field-error">{err("phone")}</span>}
            </label>
          </div>
          <ChipGroup
            label={o.contactLabel}
            options={indexed(o.contactKinds)}
            value={form.contact}
            onChange={(v) => update("contact", v)}
          />
          <label className="field">
            <span className="field-label">{o.commentLabel}</span>
            <textarea
              rows={3}
              value={form.comment}
              onChange={(e) => update("comment", e.target.value)}
              placeholder={o.commentPh}
            />
          </label>
        </div>
      )}

      <div className="order-nav">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}>
            <Icon name="arrowLeft" size={18} /> {o.back}
          </button>
        ) : (
          <span className="order-hint">{o.hint}</span>
        )}
        <button type="submit" className="btn btn-primary">
          {step < 2 ? (
            <>
              {o.next} <Icon name="arrow" size={18} />
            </>
          ) : (
            <>
              <WhatsAppIcon size={20} /> {o.submit}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
