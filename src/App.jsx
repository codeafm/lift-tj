import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "./firebase";
import { Icon, Logo, WhatsAppIcon } from "./Icon";
import OrderForm from "./OrderForm";
import {
  ADDRESS,
  MAP_EMBED_URL,
  PHONE_RAW,
  PHONE_TEXT,
  WHATSAPP_URL,
  advantages,
  elevatorTypes,
  faq,
  navLinks,
  processSteps,
  projects,
  services,
  stats,
} from "./data";

const trackPhone = (location) => trackEvent("phone_click", { location, phone: PHONE_TEXT });
const trackWhatsapp = (location) => trackEvent("whatsapp_click", { location, phone: PHONE_TEXT });

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
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
  }, []);
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

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 24);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header ${scrolled || open ? "solid" : ""}`}>
      <div className="container nav">
        <a href="#top" className="brand" onClick={close} aria-label="Lift TJ — на главную">
          <Logo />
          <span className="brand-text">
            <strong>Lift TJ</strong>
            <small>Лифты · монтаж · сервис</small>
          </span>
        </a>

        <nav className={`menu ${open ? "open" : ""}`} aria-label="Основное меню">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <a className="menu-phone" href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("menu")}>
            <Icon name="phone" size={18} /> {PHONE_TEXT}
          </a>
        </nav>

        <div className="nav-actions">
          <a className="nav-phone" href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("header")}>
            <Icon name="phone" size={17} />
            <span>{PHONE_TEXT}</span>
          </a>
          <a className="btn btn-primary btn-sm" href="#order" onClick={close}>
            Заказать лифт
          </a>
          <button
            type="button"
            className={`burger ${open ? "active" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
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

function FloorDisplay() {
  const [{ floor, dir }, setState] = useState({ floor: 1, dir: 1 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow reveal">
            <i className="pulse" /> Работаем по всему Таджикистану
          </span>
          <h1 className="reveal">
            Лифты для вашего здания <em>от проекта до запуска</em>
          </h1>
          <p className="hero-lead reveal">
            Поставка, монтаж и сервис пассажирских, грузовых, панорамных и
            больничных лифтов для жилых комплексов, бизнес-центров и клиник.
          </p>
          <div className="hero-actions reveal">
            <a href="#order" className="btn btn-primary btn-lg">
              Рассчитать стоимость <Icon name="arrow" size={20} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass btn-lg"
              onClick={() => trackWhatsapp("hero")}
            >
              <WhatsAppIcon size={20} /> Написать в WhatsApp
            </a>
          </div>
          <ul className="hero-points reveal">
            <li><Icon name="check" size={16} strokeWidth={2.4} /> Бесплатный выезд на замер</li>
            <li><Icon name="check" size={16} strokeWidth={2.4} /> Цена фиксируется в договоре</li>
            <li><Icon name="check" size={16} strokeWidth={2.4} /> Сервис 24/7</li>
          </ul>
        </div>

        <div className="hero-visual reveal">
          <div className="hero-frame">
            <img
              src="/images/projects/project1-6.jpg"
              alt="Кабина пассажирского лифта Lift TJ с золотой отделкой"
              fetchPriority="high"
            />
            <FloorDisplay />
          </div>
          <div className="hero-badge">
            <strong>120+</strong>
            <span>объектов сдано<br />под ключ</span>
          </div>
        </div>
      </div>

      <div className="container">
        <dl className="stats reveal">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Catalog({ onOrder }) {
  return (
    <section className="section" id="catalog">
      <div className="container">
        <SectionHead
          eyebrow="Каталог"
          title="Лифты под любую задачу"
          text="Подбираем модель, грузоподъёмность и отделку кабины под ваш объект. Ниже — типичные параметры, точную конфигурацию рассчитаем после замера."
        />
        <div className="catalog-grid">
          {elevatorTypes.map((t, i) => (
            <article className="lift-card reveal" key={t.id} style={{ "--d": `${i * 70}ms` }}>
              <div className="lift-card-media">
                <img src={t.image} alt={`${t.name} лифты`} loading="lazy" />
                <span className="lift-card-index">0{i + 1}</span>
              </div>
              <div className="lift-card-body">
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
                <dl className="spec-list">
                  {t.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <button type="button" className="btn btn-dark btn-block" onClick={() => onOrder(t.id)}>
                  Заказать {t.short.toLowerCase()} <Icon name="arrow" size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section section-dark" id="services">
      <div className="container">
        <SectionHead
          light
          eyebrow="Услуги"
          title="Полный цикл работ с лифтом"
          text="Один подрядчик на всех этапах — от подбора оборудования до многолетнего обслуживания."
        />
        <div className="services-grid">
          {services.map((s, i) => (
            <article className="service-card reveal" key={s.title} style={{ "--d": `${i * 70}ms` }}>
              <div className="service-icon">
                <Icon name={s.icon} size={26} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrderSection({ preset }) {
  return (
    <section className="section order-section" id="order">
      <div className="container order-grid">
        <div className="order-intro reveal">
          <span className="eyebrow">Онлайн-заявка</span>
          <h2>Закажите лифт за 3 шага</h2>
          <p>
            Укажите параметры объекта — инженер Lift TJ свяжется с вами,
            уточнит детали и подготовит коммерческое предложение.
          </p>
          <ul className="order-benefits">
            <li>
              <span><Icon name="clock" size={20} /></span>
              <div>
                <strong>Быстрый ответ</strong>
                Перезваниваем в рабочее время в день обращения
              </div>
            </li>
            <li>
              <span><Icon name="doc" size={20} /></span>
              <div>
                <strong>Подробный расчёт</strong>
                Оборудование, монтаж и сроки — одним документом
              </div>
            </li>
            <li>
              <span><Icon name="shield" size={20} /></span>
              <div>
                <strong>Без обязательств</strong>
                Консультация и расчёт бесплатны
              </div>
            </li>
          </ul>
          <div className="order-direct">
            <span>Предпочитаете позвонить?</span>
            <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("order")}>
              {PHONE_TEXT}
            </a>
          </div>
        </div>
        <div className="reveal" style={{ "--d": "120ms" }}>
          <OrderForm key={preset.nonce} initialType={preset.type} />
        </div>
      </div>
    </section>
  );
}

function Lightbox({ project, index, onClose, onIndex }) {
  const count = project.images.length;
  const go = useCallback((delta) => onIndex((index + delta + count) % count), [index, count, onIndex]);

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
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <img src={project.images[index]} alt={`${project.title} — фото ${index + 1}`} />
        <div className="lightbox-bar">
          <div>
            <strong>{project.title}</strong>
            <span>{project.type} · {project.location}</span>
          </div>
          <span className="lightbox-count">{index + 1} / {count}</span>
        </div>
        <button type="button" className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Предыдущее фото">
          <Icon name="chevronLeft" />
        </button>
        <button type="button" className="lb-btn lb-next" onClick={() => go(1)} aria-label="Следующее фото">
          <Icon name="chevronRight" />
        </button>
      </div>
      <button type="button" className="lb-close" onClick={onClose} aria-label="Закрыть">
        <Icon name="close" />
      </button>
    </div>
  );
}

function Projects() {
  const [viewer, setViewer] = useState(null);

  const open = (p, i = 0) => {
    setViewer({ p, i });
    trackEvent("project_open", { project: projects[p].title });
  };

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead
          eyebrow="Наши объекты"
          title="Лифты, которые уже работают"
          text="Несколько объектов, где мы выполнили поставку и монтаж. Нажмите на фото, чтобы посмотреть галерею."
        />
        <div className="projects-grid">
          {projects.map((project, p) => (
            <article className={`project-card reveal ${p === 0 ? "featured" : ""}`} key={project.title}>
              <button type="button" className="project-cover" onClick={() => open(p)}>
                <img src={project.images[0]} alt={project.title} loading="lazy" />
                <span className="project-zoom">
                  <Icon name="expand" size={18} /> {project.images.length} фото
                </span>
                <span className="project-info">
                  <small>{project.location}</small>
                  <strong>{project.title}</strong>
                  <span>{project.type}</span>
                </span>
              </button>
              {p === 0 && (
                <div className="project-thumbs">
                  {project.images.slice(1, 5).map((img, i) => (
                    <button type="button" key={img} onClick={() => open(p, i + 1)} aria-label={`Фото ${i + 2}`}>
                      <img src={img} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
      {viewer && (
        <Lightbox
          project={projects[viewer.p]}
          index={viewer.i}
          onClose={() => setViewer(null)}
          onIndex={(i) => setViewer((v) => ({ ...v, i }))}
        />
      )}
    </section>
  );
}

function Process() {
  return (
    <section className="section section-stone" id="process">
      <div className="container">
        <SectionHead
          eyebrow="Как мы работаем"
          title="От заявки до первого рейса"
          text="Понятные этапы и фиксированные сроки — вы всегда знаете, что происходит на объекте."
        />
        <ol className="process">
          {processSteps.map((s, i) => (
            <li className="reveal" key={s.title} style={{ "--d": `${i * 80}ms` }}>
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
  return (
    <section className="section section-dark about" id="about">
      <div className="container about-grid">
        <div className="about-media reveal">
          <img src="/images/projects/project2-2.jpg" alt="Панорамный лифт бизнес-центра в Душанбе" loading="lazy" />
          <div className="about-years">
            <strong>6+</strong>
            <span>лет опыта</span>
          </div>
        </div>
        <div>
          <SectionHead
            light
            eyebrow="Почему Lift TJ"
            title="Надёжность, за которую отвечаем мы"
            text="Работаем с застройщиками, управляющими компаниями, владельцами бизнеса и медучреждениями по всему Таджикистану."
          />
          <div className="adv-grid">
            {advantages.map((a, i) => (
              <div className="adv reveal" key={a.title} style={{ "--d": `${i * 70}ms` }}>
                <Icon name={a.icon} size={24} />
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <SectionHead
            eyebrow="Вопросы и ответы"
            title="Частые вопросы"
            text="Не нашли ответ? Напишите нам — проконсультируем бесплатно."
          />
          <a
            className="btn btn-dark reveal"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsapp("faq")}
          >
            <WhatsAppIcon size={20} /> Задать вопрос
          </a>
        </div>
        <div className="faq-list">
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className="reveal" key={item.q}>
              <div className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <i><Icon name="plus" size={18} /></i>
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

function Contact() {
  return (
    <section className="section section-stone" id="contact">
      <div className="container contact-grid">
        <div className="contact-info">
          <SectionHead
            eyebrow="Контакты"
            title="Свяжитесь с нами"
            text="Ответим на вопросы, приедем на замер и подготовим расчёт для вашего объекта."
          />
          <div className="contact-list reveal">
            <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("contact")}>
              <span className="contact-ic"><Icon name="phone" size={20} /></span>
              <div>
                <small>Телефон</small>
                <strong>{PHONE_TEXT}</strong>
              </div>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsapp("contact")}>
              <span className="contact-ic wa"><WhatsAppIcon size={20} /></span>
              <div>
                <small>WhatsApp</small>
                <strong>{PHONE_TEXT}</strong>
              </div>
            </a>
            <div>
              <span className="contact-ic"><Icon name="pin" size={20} /></span>
              <div>
                <small>Офис</small>
                <strong>{ADDRESS}</strong>
              </div>
            </div>
            <div>
              <span className="contact-ic"><Icon name="clock" size={20} /></span>
              <div>
                <small>Аварийная служба</small>
                <strong>Круглосуточно, без выходных</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="map reveal">
          <iframe
            title="Lift TJ на карте"
            src={MAP_EMBED_URL}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="container cta-inner reveal">
        <div>
          <h2>Готовы обсудить ваш объект?</h2>
          <p>Оставьте заявку — расчёт стоимости и консультация бесплатно.</p>
        </div>
        <div className="cta-actions">
          <a href="#order" className="btn btn-dark btn-lg">
            Оставить заявку <Icon name="arrow" size={20} />
          </a>
          <a href={`tel:${PHONE_RAW}`} className="btn btn-outline-dark btn-lg" onClick={() => trackPhone("cta")}>
            <Icon name="phone" size={18} /> Позвонить
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <a href="#top" className="brand">
            <Logo />
            <span className="brand-text">
              <strong>Lift TJ</strong>
              <small>Лифты · монтаж · сервис</small>
            </span>
          </a>
          <p>
            Поставка, монтаж и сервисное обслуживание лифтов для жилых и
            коммерческих объектов по всему Таджикистану.
          </p>
        </div>
        <div>
          <h4>Лифты</h4>
          {elevatorTypes.map((t) => (
            <a key={t.id} href="#catalog">{t.name}</a>
          ))}
        </div>
        <div>
          <h4>Компания</h4>
          {navLinks.slice(1).map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>
        <div>
          <h4>Связь</h4>
          <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("footer")}>{PHONE_TEXT}</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsapp("footer")}>
            WhatsApp
          </a>
          <span>{ADDRESS}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Lift TJ. Все права защищены.</span>
        <a href="#top">Наверх ↑</a>
      </div>
    </footer>
  );
}

function MobileBar() {
  return (
    <div className="mobile-bar">
      <a href={`tel:${PHONE_RAW}`} onClick={() => trackPhone("mobile_bar")} aria-label="Позвонить">
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
        Заказать лифт
      </a>
    </div>
  );
}

function App() {
  const [preset, setPreset] = useState({ type: "", nonce: 0 });
  useReveal();

  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Lift TJ",
      page_path: window.location.pathname,
      website: "lifttj",
    });
  }, []);

  const orderType = (type) => {
    setPreset((prev) => ({ type, nonce: prev.nonce + 1 }));
    trackEvent("catalog_order_click", { lift_type: type });
    requestAnimationFrame(() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <>
      <a className="skip-link" href="#order">Перейти к заявке</a>
      <Header />
      <main>
        <Hero />
        <Catalog onOrder={orderType} />
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
