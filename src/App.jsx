import "./App.css";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { trackEvent } from "./firebase";
import { Icon, Logo, WhatsAppIcon } from "./Icon";
import OrderForm from "./OrderForm";
import CabinConfigurator from "./CabinConfigurator";
import { LANGS, useI18n } from "./i18n";
import {
  MAP_EMBED_URL,
  PHONE_RAW,
  PHONE_TEXT,
  WHATSAPP_URL,
  advantageIcons,
  elevatorTypes,
  navSections,
  projectImages,
  serviceIcons,
  statValues,
} from "./data";

const trackPhone = (location) => trackEvent("phone_click", { location, phone: PHONE_TEXT });
const trackWhatsapp = (location) => trackEvent("whatsapp_click", { location, phone: PHONE_TEXT });
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useReveal(dep) {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [dep]);
}

function SectionHead({ eyebrow, title, text, light = false }) {
  return (
    <div className={`section-head reveal ${light ? "on-dark" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function CountUp({ value }) {
  const ref = useRef(null);
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(match && !prefersReducedMotion() ? 0 : target);

  useEffect(() => {
    if (!match || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    let raf;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1600);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return <span ref={ref}>{match ? `${n}${suffix}` : value}</span>;
}

function Preloader() {
  const [stage, setStage] = useState(() => {
    try {
      if (prefersReducedMotion() || sessionStorage.getItem("lifttj-intro")) return "done";
      sessionStorage.setItem("lifttj-intro", "1");
    } catch {
      // ignore storage errors
    }
    return "closed";
  });
  const [floor, setFloor] = useState(1);

  useEffect(() => {
    if (stage === "done") return;
    document.body.classList.add("no-scroll");
    const counter = setInterval(() => setFloor((f) => Math.min(f + 1, 9)), 110);
    const open = setTimeout(() => setStage("open"), 1150);
    const done = setTimeout(() => {
      setStage("done");
      document.body.classList.remove("no-scroll");
    }, 2200);
    return () => {
      clearInterval(counter);
      clearTimeout(open);
      clearTimeout(done);
      document.body.classList.remove("no-scroll");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (stage === "done") return null;

  return (
    <div className={`preloader ${stage === "open" ? "open" : ""}`} aria-hidden="true">
      <div className="pre-door left" />
      <div className="pre-door right" />
      <div className="pre-center">
        <div className="pre-display">
          <Icon name="up" size={18} strokeWidth={2.6} />
          <span key={floor}>{String(floor).padStart(2, "0")}</span>
        </div>
        <div className="pre-brand">
          <Logo />
          <strong>Lift TJ</strong>
        </div>
      </div>
    </div>
  );
}

function LangSwitch({ className = "" }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t.nav.language}>
      {LANGS.map((l) => (
        <button
          type="button"
          key={l.code}
          className={lang === l.code ? "active" : ""}
          aria-pressed={lang === l.code}
          title={l.name}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}

function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header ${scrolled || open ? "solid" : ""} ${open ? "open" : ""}`}>
      <ScrollProgress />
      <div className="container nav">
        <a href="#top" className="brand" onClick={close} aria-label={`Lift TJ — ${t.nav.home}`}>
          <Logo />
          <span className="brand-text">
            <strong>Lift TJ</strong>
            <small>{t.brandTagline}</small>
          </span>
        </a>

        <nav className={`menu ${open ? "open" : ""}`} aria-label="Main">
          {navSections
            .filter((id) => id !== "process")
            .map((id, i) => (
              <a key={id} href={`#${id}`} onClick={close} style={{ "--i": i }}>
                {t.nav[id]}
              </a>
            ))}
          <a className="menu-phone" href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("menu")}>
            <Icon name="phone" size={18} /> {PHONE_TEXT}
          </a>
        </nav>

        <div className="nav-actions">
          <LangSwitch />
          <a className="nav-phone" href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("header")}>
            <Icon name="phone" size={17} />
            <span>{PHONE_TEXT}</span>
          </a>
          <a className="btn btn-primary btn-sm" href="#order" onClick={close}>
            {t.nav.order}
          </a>
          <button
            type="button"
            className={`burger ${open ? "active" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={open}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

// Elevator-shaft page navigation: the cabin rides down the shaft as you scroll.
function ShaftNav() {
  const { t } = useI18n();
  const floors = [
    { id: "top", label: t.nav.hero },
    { id: "catalog", label: t.nav.catalog },
    { id: "configurator", label: t.nav.configurator },
    { id: "services", label: t.nav.services },
    { id: "order", label: t.nav.order_section },
    { id: "projects", label: t.nav.projects },
    { id: "process", label: t.nav.process },
    { id: "about", label: t.about.eyebrow },
    { id: "faq", label: t.nav.faq },
    { id: "contact", label: t.nav.contact },
  ];
  const [active, setActive] = useState(0);
  const count = floors.length;

  useEffect(() => {
    let raf;
    const update = () => {
      const mid = window.innerHeight * 0.45;
      let idx = 0;
      floors.forEach((f, i) => {
        const el = document.getElementById(f.id);
        if (el && el.getBoundingClientRect().top <= mid) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="shaft" aria-label="Floors">
      <div className="shaft-track">
        <div className="shaft-cabin" style={{ top: `${(active / (count - 1)) * 100}%` }}>
          {String(count - active).padStart(2, "0")}
        </div>
      </div>
      <ol>
        {floors.map((f, i) => (
          <li key={f.id} className={i === active ? "active" : ""}>
            <a href={`#${f.id}`} aria-label={f.label}>
              <span className="shaft-label">{f.label}</span>
              <span className="shaft-num">{String(count - i).padStart(2, "0")}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FloorDisplay() {
  const [{ floor, dir }, setState] = useState({ floor: 1, dir: 1 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = setInterval(() => {
      setState(({ floor, dir }) => {
        const nextDir = floor + dir > 12 || floor + dir < 1 ? -dir : dir;
        return { floor: floor + nextDir, dir: nextDir };
      });
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="floor-display" aria-hidden="true">
      <Icon name="up" size={16} strokeWidth={2.4} className={dir < 0 ? "down" : ""} />
      <span key={floor}>{String(floor).padStart(2, "0")}</span>
    </div>
  );
}

function SplitWords({ text, offset = 0 }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={`${word}-${i}`}>
      <span className="word">
        <span style={{ "--w": i + offset }}>{word}</span>
      </span>{" "}
    </Fragment>
  ));
}

function Hero() {
  const { t } = useI18n();
  const h = t.hero;
  const titleWords = h.title.split(" ").length;
  const frameRef = useRef(null);

  const onMove = (e) => {
    if (e.pointerType !== "mouse" || !frameRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frameRef.current.style.setProperty("--px", `${x * -18}px`);
    frameRef.current.style.setProperty("--py", `${y * -18}px`);
  };

  return (
    <section className="hero" id="top" onPointerMove={onMove}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-beam" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow reveal">
            <i className="pulse" /> {h.eyebrow}
          </span>
          <h1 className="split reveal" key={t.meta.title}>
            <SplitWords text={h.title} />
            <em>
              <SplitWords text={h.accent} offset={titleWords} />
            </em>
          </h1>
          <p className="hero-lead reveal">{h.lead}</p>
          <div className="hero-actions reveal">
            <a href="#order" className="btn btn-primary btn-lg btn-shine">
              {h.cta} <Icon name="arrow" size={20} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass btn-lg"
              onClick={() => trackWhatsapp("hero")}
            >
              <WhatsAppIcon size={20} /> {h.wa}
            </a>
          </div>
          <ul className="hero-points reveal">
            {h.points.map((p) => (
              <li key={p}>
                <Icon name="check" size={16} strokeWidth={2.4} /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual reveal" ref={frameRef}>
          <div className="hero-frame">
            <img src="/images/projects/project1-6.jpg" alt={h.imgAlt} fetchPriority="high" />
            <FloorDisplay />
          </div>
          <div className="hero-badge">
            <strong>
              <CountUp value="120+" />
            </strong>
            <span>
              {h.badge[0]}
              <br />
              {h.badge[1]}
            </span>
          </div>
          <div className="hero-ring" aria-hidden="true" />
        </div>
      </div>

      <div className="container">
        <dl className="stats reveal">
          {statValues.map((v, i) => (
            <div key={i}>
              <dt>
                <CountUp value={v} />
              </dt>
              <dd>{t.stats[i]}</dd>
            </div>
          ))}
        </dl>
      </div>
      <a href="#catalog" className="scroll-cue" aria-label={h.scroll}>
        <span />
      </a>
    </section>
  );
}

function Marquee() {
  const { t } = useI18n();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i}>
            {item}
            <i>◆</i>
          </span>
        ))}
      </div>
    </div>
  );
}

const tiltMove = (e) => {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", `${x * 8}deg`);
  el.style.setProperty("--rx", `${y * -8}deg`);
  el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
  el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
};

const tiltLeave = (e) => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

function Catalog({ onOrder }) {
  const { t } = useI18n();
  const c = t.catalog;
  return (
    <section className="section" id="catalog">
      <div className="container">
        <SectionHead eyebrow={c.eyebrow} title={c.title} text={c.text} />
        <div className="catalog-grid">
          {elevatorTypes.map((x, i) => {
            const tt = t.types[x.id];
            return (
              <article className="reveal" key={x.id} style={{ "--d": `${i * 80}ms` }}>
                <div className="lift-card" onPointerMove={tiltMove} onPointerLeave={tiltLeave}>
                  <div className="lift-card-media">
                    <img src={x.image} alt={`${tt.name} ${c.alt}`} loading="lazy" />
                    <span className="lift-card-index">0{i + 1}</span>
                  </div>
                  <div className="lift-card-body">
                    <h3>{tt.name}</h3>
                    <p>{tt.desc}</p>
                    <dl className="spec-list">
                      {tt.specs.map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <button type="button" className="btn btn-dark btn-block" onClick={() => onOrder({ type: x.id })}>
                      {c.order}: {tt.short.toLowerCase()} <Icon name="arrow" size={18} />
                    </button>
                  </div>
                  <span className="card-glare" aria-hidden="true" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function Services() {
  const { t } = useI18n();
  const s = t.services;
  return (
    <section className="section section-dark" id="services">
      <div className="container">
        <SectionHead light eyebrow={s.eyebrow} title={s.title} text={s.text} />
        <div className="services-grid">
          {s.items.map((item, i) => (
            <article
              className="service-card reveal"
              key={i}
              style={{ "--d": `${i * 80}ms` }}
              onPointerMove={spotlight}
            >
              <div className="service-icon">
                <Icon name={serviceIcons[i]} size={26} />
              </div>
              <span className="service-num">0{i + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderSection({ preset }) {
  const { t } = useI18n();
  const o = t.order;
  const icons = ["clock", "doc", "shield"];
  return (
    <section className="section order-section" id="order">
      <div className="container order-grid">
        <div className="order-intro reveal">
          <span className="eyebrow">{o.eyebrow}</span>
          <h2>{o.title}</h2>
          <p>{o.text}</p>
          <ul className="order-benefits">
            {o.benefits.map((b, i) => (
              <li key={i}>
                <span>
                  <Icon name={icons[i]} size={20} />
                </span>
                <div>
                  <strong>{b.title}</strong>
                  {b.text}
                </div>
              </li>
            ))}
          </ul>
          <div className="order-direct">
            <span>{o.callPrompt}</span>
            <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("order")}>
              {PHONE_TEXT}
            </a>
          </div>
        </div>
        <div className="reveal" style={{ "--d": "120ms" }}>
          <OrderForm key={preset.nonce} initialType={preset.type} initialFinish={preset.finish} />
        </div>
      </div>
    </section>
  );
}

function Lightbox({ project, images, index, onClose, onIndex }) {
  const { t } = useI18n();
  const count = images.length;
  const go = useCallback((delta) => onIndex((index + delta + count) % count), [index, count, onIndex]);
  const touch = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [go, onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={project.title} onClick={onClose}>
      <div
        className="lightbox-inner"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <img key={index} src={images[index]} alt={`${project.title} — ${t.projects.photo} ${index + 1}`} />
        <div className="lightbox-bar">
          <div>
            <strong>{project.title}</strong>
            <span>
              {project.type} · {project.location}
            </span>
          </div>
          <span className="lightbox-count">
            {index + 1} / {count}
          </span>
        </div>
        <button type="button" className="lb-btn lb-prev" onClick={() => go(-1)} aria-label={t.projects.prev}>
          <Icon name="chevronLeft" />
        </button>
        <button type="button" className="lb-btn lb-next" onClick={() => go(1)} aria-label={t.projects.next}>
          <Icon name="chevronRight" />
        </button>
      </div>
      <button type="button" className="lb-close" onClick={onClose} aria-label={t.projects.close}>
        <Icon name="close" />
      </button>
    </div>
  );
}

function Projects() {
  const { t } = useI18n();
  const p = t.projects;
  const [viewer, setViewer] = useState(null);

  const open = (idx, i = 0) => {
    setViewer({ p: idx, i });
    trackEvent("project_open", { project: idx });
  };

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead eyebrow={p.eyebrow} title={p.title} text={p.text} />
        <div className="projects-grid">
          {p.items.map((project, idx) => {
            const images = projectImages[idx];
            return (
              <article className={`project-card reveal ${idx === 0 ? "featured" : ""}`} key={idx}>
                <button type="button" className="project-cover" onClick={() => open(idx)}>
                  <img src={images[0]} alt={project.title} loading="lazy" />
                  <span className="project-zoom">
                    <Icon name="expand" size={18} /> {images.length} {p.photos}
                  </span>
                  <span className="project-info">
                    <small>{project.location}</small>
                    <strong>{project.title}</strong>
                    <span>{project.type}</span>
                  </span>
                </button>
                {idx === 0 && (
                  <div className="project-thumbs">
                    {images.slice(1, 5).map((img, i) => (
                      <button type="button" key={img} onClick={() => open(idx, i + 1)} aria-label={`${p.photo} ${i + 2}`}>
                        <img src={img} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
      {viewer && (
        <Lightbox
          project={p.items[viewer.p]}
          images={projectImages[viewer.p]}
          index={viewer.i}
          onClose={() => setViewer(null)}
          onIndex={(i) => setViewer((v) => ({ ...v, i }))}
        />
      )}
    </section>
  );
}

function Process() {
  const { t } = useI18n();
  const p = t.process;
  return (
    <section className="section section-stone" id="process">
      <div className="container">
        <SectionHead eyebrow={p.eyebrow} title={p.title} text={p.text} />
        <ol className="process reveal">
          {p.steps.map((s, i) => (
            <li key={i} style={{ "--d": `${i * 140}ms` }}>
              <span className="process-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <section className="section section-dark about" id="about">
      <div className="container about-grid">
        <div className="about-media reveal">
          <img src="/images/projects/project2-2.jpg" alt={a.imgAlt} loading="lazy" />
          <div className="about-years">
            <strong>
              <CountUp value="6+" />
            </strong>
            <span>{a.years}</span>
          </div>
        </div>
        <div>
          <SectionHead light eyebrow={a.eyebrow} title={a.title} text={a.text} />
          <div className="adv-grid">
            {a.items.map((item, i) => (
              <div className="adv reveal" key={i} style={{ "--d": `${i * 80}ms` }}>
                <span className="adv-icon">
                  <Icon name={advantageIcons[i]} size={24} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { t } = useI18n();
  const f = t.faq;
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <SectionHead eyebrow={f.eyebrow} title={f.title} text={f.text} />
          <a
            className="btn btn-dark reveal"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsapp("faq")}
          >
            <WhatsAppIcon size={20} /> {f.ask}
          </a>
        </div>
        <div className="faq-list">
          {f.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className="reveal" key={i} style={{ "--d": `${i * 50}ms` }}>
                <div className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  >
                    <span>{item.q}</span>
                    <i>
                      <Icon name="plus" size={18} />
                    </i>
                  </button>
                  <div className="faq-answer" id={`faq-${i}`} role="region">
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  const { t } = useI18n();
  const c = t.cta;
  return (
    <section className="cta-band">
      <div className="container cta-inner reveal">
        <div>
          <h2>{c.title}</h2>
          <p>{c.text}</p>
        </div>
        <div className="cta-actions">
          <a href="#order" className="btn btn-dark btn-lg">
            {c.button} <Icon name="arrow" size={20} />
          </a>
          <a href={`tel:${PHONE_RAW}`} className="btn btn-outline-dark btn-lg" onClick={() => trackPhone("cta")}>
            <Icon name="phone" size={18} /> {c.call}
          </a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  return (
    <section className="section section-stone" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <SectionHead eyebrow={c.eyebrow} title={c.title} text={c.text} />
          <div className="contact-list reveal">
            <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("contact")}>
              <span className="contact-ic">
                <Icon name="phone" size={20} />
              </span>
              <div>
                <small>{c.phone}</small>
                <strong>{PHONE_TEXT}</strong>
              </div>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsapp("contact")}>
              <span className="contact-ic wa">
                <WhatsAppIcon size={20} />
              </span>
              <div>
                <small>WhatsApp</small>
                <strong>{PHONE_TEXT}</strong>
              </div>
            </a>
            <div>
              <span className="contact-ic">
                <Icon name="pin" size={20} />
              </span>
              <div>
                <small>{c.office}</small>
                <strong>{c.address}</strong>
              </div>
            </div>
            <div>
              <span className="contact-ic">
                <Icon name="clock" size={20} />
              </span>
              <div>
                <small>{c.emergency}</small>
                <strong>{c.emergencyValue}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="map reveal">
          <iframe title={c.mapTitle} src={MAP_EMBED_URL} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  return (
    <footer className="footer">
      <div className="footer-word" aria-hidden="true">
        LIFT TJ
      </div>
      <div className="container footer-grid">
        <div className="footer-about">
          <a href="#top" className="brand">
            <Logo />
            <span className="brand-text">
              <strong>Lift TJ</strong>
              <small>{t.brandTagline}</small>
            </span>
          </a>
          <p>{f.about}</p>
          <LangSwitch className="footer-lang" />
        </div>
        <div>
          <h4>{f.lifts}</h4>
          {elevatorTypes.map((x) => (
            <a key={x.id} href="#catalog">
              {t.types[x.id].name}
            </a>
          ))}
        </div>
        <div>
          <h4>{f.company}</h4>
          {navSections.slice(1).map((id) => (
            <a key={id} href={`#${id}`}>
              {t.nav[id]}
            </a>
          ))}
        </div>
        <div>
          <h4>{f.contact}</h4>
          <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("footer")}>
            {PHONE_TEXT}
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsapp("footer")}>
            WhatsApp
          </a>
          <span>{t.contact.address}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Lift TJ. {f.rights}
        </span>
        <a href="#top" className="to-top">
          <span className="to-top-btn">
            <Icon name="up" size={16} strokeWidth={2.2} />
          </span>
          {t.nav.top}
        </a>
      </div>
    </footer>
  );
}

function MobileBar() {
  const { t } = useI18n();
  return (
    <div className="mobile-bar">
      <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("mobile_bar")} aria-label={t.mobile.call}>
        <Icon name="phone" size={20} />
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="wa"
        onClick={() => trackWhatsapp("mobile_bar")}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon size={22} />
      </a>
      <a href="#order" className="mobile-bar-cta">
        {t.mobile.order}
      </a>
    </div>
  );
}

function App() {
  const { t, lang } = useI18n();
  const [preset, setPreset] = useState({ type: "", finish: null, nonce: 0 });
  useReveal(lang);

  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Lift TJ",
      page_path: window.location.pathname,
      website: "lifttj",
    });
  }, []);

  const startOrder = ({ type = "", finish = null }) => {
    setPreset((prev) => ({ type, finish, nonce: prev.nonce + 1 }));
    trackEvent("order_preset", { lift_type: type, with_finish: !!finish });
    requestAnimationFrame(() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <>
      <Preloader />
      <a className="skip-link" href="#order">
        {t.skip}
      </a>
      <Header />
      <ShaftNav />
      <main>
        <Hero />
        <Marquee />
        <Catalog onOrder={startOrder} />
        <CabinConfigurator onOrder={(finish) => startOrder({ finish })} />
        <Services />
        <OrderSection preset={preset} />
        <Projects />
        <Process />
        <About />
        <Faq />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}

export default App;
