import "./App.css";
import { useEffect, useState } from "react";
import { trackEvent } from "./firebase";

const PHONE_RAW = "+992907762277";
const PHONE_TEXT = "+992 907 76 22 77";
const WHATSAPP_URL = "https://wa.me/992907762277";

const services = [
  {
    title: "Продажа лифтов",
    text: "Пассажирские, грузовые, панорамные и больничные лифты для жилых домов, бизнес-центров, гостиниц и коммерческих объектов в Таджикистане.",
    icon: "🛗",
  },
  {
    title: "Монтаж и установка",
    text: "Профессиональная установка, настройка, тестирование и ввод в эксплуатацию с учетом требований объекта и строительных норм.",
    icon: "🏗️",
  },
  {
    title: "Сервисное обслуживание",
    text: "Диагностика, техническое обслуживание, ремонт и модернизация лифтового оборудования для стабильной и безопасной работы.",
    icon: "🛠️",
  },
  {
    title: "Решения для новостроек",
    text: "Комплексный подход для застройщиков и строительных компаний: от подбора модели до монтажа и дальнейшего сопровождения.",
    icon: "🏢",
  },
];

const elevatorTypes = [
  {
    name: "Пассажирские",
    icon: "👥",
    desc: "Комфортные и безопасные решения для жилых комплексов, офисов и новостроек.",
    images: ["/images/lifts/passenger/1.jpg", "/images/lifts/passenger/2.jpg"],
  },
  {
    name: "Грузовые",
    icon: "📦",
    desc: "Надежные лифты с высокой грузоподъемностью для складов, магазинов и коммерческих объектов.",
    images: ["/images/lifts/freight/1.jpg", "/images/lifts/freight/2.jpg"],
  },
  {
    name: "Панорамные",
    icon: "🌆",
    desc: "Эстетичные стеклянные решения для бизнес-центров, гостиниц и современных зданий.",
    images: ["/images/lifts/panoramic/1.jpg", "/images/lifts/panoramic/2.jpg"],
  },
  {
    name: "Больничные",
    icon: "🏥",
    desc: "Специализированные лифты для медицинских учреждений с акцентом на безопасность и удобство.",
    images: ["/images/lifts/hospital/1.jpg", "/images/lifts/hospital/2.jpg"],
  },
];

const projects = [
  {
    title: "Жилой комплекс в Душанбе",
    type: "Пассажирские лифты",
    location: "Душанбе, Таджикистан",
    images: [
      "/images/projects/project1-1.jpg",
      "/images/projects/project1-2.jpg",
      "/images/projects/project1-3.jpg",
      "/images/projects/project1-4.jpg",
      "/images/projects/project1-5.jpg",
      "/images/projects/project1-6.jpg",
      "/images/projects/project1-7.jpg",
    ],
  },
  {
    title: "Бизнес-центр",
    type: "Панорамный лифт",
    location: "Душанбе, Таджикистан",
    images: [
      "/images/projects/project2-1.jpg",
      "/images/projects/project2-2.jpg",
      "/images/projects/project2-3.jpg",
    ],
  },
  {
    title: "Медицинский центр",
    type: "Больничный лифт",
    location: "Худжанд, Таджикистан",
    images: [
      "/images/projects/project3-1.jpg",
      "/images/projects/project3-2.jpg",
      "/images/projects/project3-3.jpg",
    ],
  },
  {
    title: "Торговый объект",
    type: "Грузовой лифт",
    location: "Бохтар, Таджикистан",
    images: [
      "/images/projects/project4-1.jpg",
      "/images/projects/project4-2.jpg",
      "/images/projects/project4-3.jpg",
    ],
  },
];

const advantages = [
  "Работаем по Таджикистану с жилыми и коммерческими объектами",
  "Подбираем лифтовое решение под конкретный проект",
  "Выполняем монтаж под ключ",
  "Обеспечиваем сервис и техническую поддержку",
  "Используем современные и надежные комплектующие",
  "Имеем опыт работы с новостройками, бизнес-центрами и медучреждениями",
];

const stats = [
  { value: "6+", label: "лет опыта" },
  { value: "120+", label: "реализованных объектов" },
  { value: "24/7", label: "сервис и поддержка" },
];

const processSteps = [
  {
    number: "01",
    title: "Консультация",
    text: "Обсуждаем объект, этажность, назначение здания и требования к лифту.",
  },
  {
    number: "02",
    title: "Подбор решения",
    text: "Подбираем тип лифта, характеристики, дизайн кабины и техническую комплектацию.",
  },
  {
    number: "03",
    title: "Монтаж",
    text: "Выполняем установку, настройку, проверку и подготовку оборудования к работе.",
  },
  {
    number: "04",
    title: "Сервис",
    text: "Обеспечиваем техническое обслуживание, диагностику и поддержку после запуска.",
  },
];

function App() {
  const [projectSlides, setProjectSlides] = useState(projects.map(() => 0));
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroFloor, setHeroFloor] = useState(1);

  useEffect(() => {
    trackEvent("page_view", {
      page_title: "Lift TJ",
      page_path: window.location.pathname,
      website: "lifttj",
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectSlides((prev) =>
        prev.map((value, index) => (value + 1) % projects[index].images.length)
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const floorTimer = setInterval(() => {
      setHeroFloor((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 2600);

    return () => clearInterval(floorTimer);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleWhatsappClick = (location) => {
    trackEvent("whatsapp_click", {
      location,
      phone: PHONE_TEXT,
    });
  };

  const handlePhoneClick = (location) => {
    trackEvent("phone_click", {
      location,
      phone: PHONE_TEXT,
    });
  };

  const nextProjectSlide = (projectIndex) => {
    setProjectSlides((prev) =>
      prev.map((value, index) =>
        index === projectIndex
          ? (value + 1) % projects[projectIndex].images.length
          : value
      )
    );

    trackEvent("project_slider_next", {
      project: projects[projectIndex].title,
    });
  };

  const prevProjectSlide = (projectIndex) => {
    setProjectSlides((prev) =>
      prev.map((value, index) =>
        index === projectIndex
          ? (value - 1 + projects[projectIndex].images.length) %
            projects[projectIndex].images.length
          : value
      )
    );

    trackEvent("project_slider_prev", {
      project: projects[projectIndex].title,
    });
  };

  const setProjectSlide = (projectIndex, slideIndex) => {
    setProjectSlides((prev) =>
      prev.map((value, index) => (index === projectIndex ? slideIndex : value))
    );

    trackEvent("project_slide_select", {
      project: projects[projectIndex].title,
      slide: slideIndex + 1,
    });
  };

  return (
    <div className="site">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-grid"></div>

      <header className="header">
        <div className="container nav">
          <a href="#top" className="brand" onClick={closeMenu}>
            <div className="brand-mark">
              <span>LT</span>
            </div>
            <div className="brand-text">
              <strong>Lift TJ</strong>
              <span>Лифты, монтаж и сервис</span>
            </div>
          </a>

          <nav className={`menu ${menuOpen ? "open" : ""}`}>
            <a href="#services" onClick={closeMenu}>Услуги</a>
            <a href="#catalog" onClick={closeMenu}>Лифты</a>
            <a href="#projects" onClick={closeMenu}>Работы</a>
            <a href="#process" onClick={closeMenu}>Этапы</a>
            <a href="#about" onClick={closeMenu}>О нас</a>
            <a href="#contact" onClick={closeMenu}>Контакты</a>
          </nav>

          <div className="nav-actions">
            <a
              href={`tel:${PHONE_RAW}`}
              className="header-phone"
              onClick={() => handlePhoneClick("header")}
            >
              Позвонить
            </a>

            <button
              className={`menu-toggle ${menuOpen ? "active" : ""}`}
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Открыть меню"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot"></span>
                Lift TJ • Работаем по всему Таджикистану
              </div>

              <h1>
                Современные лифты <span>для объектов в Таджикистане</span>
              </h1>

              <p>
                Продажа, установка, модернизация и сервис лифтов для новостроек,
                жилых комплексов, бизнес-центров, медицинских учреждений и
                коммерческих объектов.
              </p>

              <div className="hero-actions">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  onClick={() => handleWhatsappClick("hero")}
                >
                  <span>Заявка в WhatsApp</span>
                  <b>→</b>
                </a>

                <a
                  href={`tel:${PHONE_RAW}`}
                  className="btn btn-secondary"
                  onClick={() => handlePhoneClick("hero")}
                >
                  Позвонить
                </a>
              </div>

              <div className="hero-note">
                <span>📍 Душанбе • Худжанд • Бохтар • объекты по всему Таджикистану</span>
              </div>

              <div className="stats">
                {stats.map((item) => (
                  <div className="stat" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-premium-card">
                <div className="premium-status">
                  <span className="status-dot"></span>
                  Premium Lift System
                </div>

                <div className="lift-3d-scene">
                  <div className="lift-building">
                    <div className="lift-top-panel">
                      <span>Lift TJ</span>
                      <span className="lift-floor-display">0{heroFloor}</span>
                    </div>

                    <div className="lift-shaft-3d">
                      <div className={`lift-cabin-3d floor-${heroFloor}`}>
                        <div className="lift-door left"></div>
                        <div className="lift-door right"></div>
                        <div className="lift-cabin-inner">
                          <div className="lift-light"></div>
                          <div className="lift-panel-mini">
                            <span>{heroFloor}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shaft-line shaft-line-left"></div>
                      <div className="shaft-line shaft-line-right"></div>

                      <div className="lift-floor-markers">
                        <span>05</span>
                        <span>04</span>
                        <span>03</span>
                        <span>02</span>
                        <span>01</span>
                      </div>
                    </div>

                    <div className="lift-info-row">
                      <div className="lift-info-chip">Modern</div>
                      <div className="lift-info-chip">Premium</div>
                      <div className="lift-info-chip">Safe</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="floating-card card-top">
                <strong>24/7</strong>
                <span>Сервисная поддержка</span>
              </div>

              <div className="floating-card card-bottom">
                <strong>120+</strong>
                <span>Объектов выполнено</span>
              </div>
            </div>
          </div>
        </section>

        <section className="premium-strip">
          <div className="container premium-strip-grid">
            <div>
              <span>01</span>
              <strong>Подбор под объект</strong>
            </div>
            <div>
              <span>02</span>
              <strong>Монтаж под ключ</strong>
            </div>
            <div>
              <span>03</span>
              <strong>Сервис и ремонт</strong>
            </div>
            <div>
              <span>04</span>
              <strong>Работа по Таджикистану</strong>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Наши услуги</div>
              <h2>Лифтовые решения для современных зданий</h2>
              <p>
                Мы работаем с застройщиками, владельцами коммерческих объектов,
                жилыми комплексами и медицинскими учреждениями по всему Таджикистану.
              </p>
            </div>

            <div className="services-grid">
              {services.map((item) => (
                <article className="service-card" key={item.title}>
                  <div className="service-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="catalog">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Категории лифтов</div>
              <h2>Какие лифты мы предлагаем</h2>
              <p>
                Подбираем подходящий тип лифта под жилой, коммерческий или
                специализированный объект.
              </p>
            </div>

            <div className="catalog-grid">
              {elevatorTypes.map((item) => (
                <article className="catalog-card" key={item.name}>
                  <div className="catalog-top">
                    <div className="catalog-icon">{item.icon}</div>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>

                  <div className="catalog-gallery">
                    {item.images.map((img, index) => (
                      <div className="catalog-image-box" key={index}>
                        <img src={img} alt={`${item.name} ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Наши работы</div>
              <h2>Установленные лифты в Таджикистане</h2>
              <p>
                Примеры объектов, где мы выполнили поставку и установку
                лифтового оборудования.
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project, projectIndex) => (
                <article className="project-card" key={project.title}>
                  <div className="project-slider">
                    <img
                      src={project.images[projectSlides[projectIndex]]}
                      alt={project.title}
                      className="project-main-image"
                    />

                    <div className="project-badge project-type">
                      {project.type}
                    </div>

                    <div className="project-badge project-location">
                      {project.location}
                    </div>

                    <button
                      type="button"
                      className="project-arrow left"
                      onClick={() => prevProjectSlide(projectIndex)}
                      aria-label="Предыдущее фото"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      className="project-arrow right"
                      onClick={() => nextProjectSlide(projectIndex)}
                      aria-label="Следующее фото"
                    >
                      ›
                    </button>
                  </div>

                  <div className="project-body">
                    <h3>{project.title}</h3>
                    <p>{project.type}</p>

                    <div className="project-dots">
                      {project.images.map((_, dotIndex) => (
                        <button
                          type="button"
                          key={dotIndex}
                          className={`project-dot ${
                            projectSlides[projectIndex] === dotIndex ? "active" : ""
                          }`}
                          onClick={() => setProjectSlide(projectIndex, dotIndex)}
                          aria-label={`Фото ${dotIndex + 1}`}
                        />
                      ))}
                    </div>

                    <div className="project-thumbs">
                      {project.images.map((img, thumbIndex) => (
                        <button
                          type="button"
                          key={thumbIndex}
                          className={`project-thumb ${
                            projectSlides[projectIndex] === thumbIndex ? "active" : ""
                          }`}
                          onClick={() => setProjectSlide(projectIndex, thumbIndex)}
                        >
                          <img
                            src={img}
                            alt={`${project.title} ${thumbIndex + 1}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" id="process">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Этапы работы</div>
              <h2>От консультации до запуска лифта</h2>
              <p>
                Работаем понятно и поэтапно, чтобы заказчик заранее понимал
                сроки, решение и дальнейшее обслуживание.
              </p>
            </div>

            <div className="process-grid">
              {processSteps.map((step) => (
                <article className="process-card" key={step.number}>
                  <span>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="about">
          <div className="container about-grid">
            <div className="about-copy">
              <div className="eyebrow">О компании</div>
              <h2>Lift TJ — лифтовая компания в Таджикистане</h2>
              <p>
                Мы предлагаем профессиональные решения для жилых комплексов,
                новостроек, бизнес-центров, медицинских учреждений и других объектов.
              </p>

              <div className="experience-box">
                <strong>6+</strong>
                <span>лет работы по Таджикистану</span>
              </div>
            </div>

            <div className="advantages-list">
              {advantages.map((item) => (
                <div className="advantage-item" key={item}>
                  <span className="advantage-check">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="container contact-grid">
            <div className="contact-info">
              <div className="eyebrow">Контакты</div>
              <h2>Свяжитесь с нами</h2>
              <p>
                Самый быстрый способ оставить заявку — написать нам в WhatsApp
                или сразу позвонить.
              </p>

              <div className="contact-cards">
                <div className="contact-card">
                  <span>🟢</span>
                  <div>
                    <strong>WhatsApp</strong>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleWhatsappClick("contact_card")}
                    >
                      {PHONE_TEXT}
                    </a>
                  </div>
                </div>

                <div className="contact-card">
                  <span>📞</span>
                  <div>
                    <strong>Звонок</strong>
                    <a
                      href={`tel:${PHONE_RAW}`}
                      onClick={() => handlePhoneClick("contact_card")}
                    >
                      {PHONE_TEXT}
                    </a>
                  </div>
                </div>

                <div className="contact-card">
                  <span>📍</span>
                  <div>
                    <strong>Адрес</strong>
                    <p>Душанбе, Таджикистан</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form contact-actions-box">
              <div className="contact-form-glow"></div>

              <h3>Оставить заявку</h3>

              <p className="contact-actions-text">
                Выберите удобный способ связи. Мы быстро ответим и подскажем,
                какой лифт подходит для вашего объекта.
              </p>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary full"
                onClick={() => handleWhatsappClick("contact_button")}
              >
                Написать в WhatsApp
              </a>

              <a
                href={`tel:${PHONE_RAW}`}
                className="btn btn-secondary full"
                onClick={() => handlePhoneClick("contact_button")}
              >
                Позвонить сейчас
              </a>

            
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">
              <div className="brand-mark">
                <span>LT</span>
              </div>
              <div className="brand-text">
                <strong>Lift TJ</strong>
                <span>Лифты, монтаж и сервис в Таджикистане</span>
              </div>
            </div>

            <p className="footer-muted">
              Поставка, установка и сервисное обслуживание лифтов для жилых и
              коммерческих объектов по Таджикистану.
            </p>
          </div>

          <div>
            <h4>Услуги</h4>
            <a href="#services">Продажа лифтов</a>
            <a href="#services">Монтаж</a>
            <a href="#services">Сервис</a>
          </div>

          <div>
            <h4>Навигация</h4>
            <a href="#catalog">Типы лифтов</a>
            <a href="#projects">Наши работы</a>
            <a href="#about">О компании</a>
          </div>

          <div>
            <h4>Связь</h4>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsappClick("footer")}
            >
              WhatsApp
            </a>

            <a
              href={`tel:${PHONE_RAW}`}
              onClick={() => handlePhoneClick("footer")}
            >
              Позвонить
            </a>

            <span className="footer-location">Душанбе, Таджикистан</span>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© 2026 Lift TJ. Все права защищены.</p>
          <p>Premium elevator solutions in Tajikistan</p>
        </div>
      </footer>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        onClick={() => handleWhatsappClick("floating_button")}
      >
        <span>💬</span>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}

export default App;