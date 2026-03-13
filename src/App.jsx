import "./App.css";
import { useEffect, useState } from "react";

const services = [
  {
    title: "Продажа лифтов",
    text: "Пассажирские, грузовые и панорамные решения для жилых и коммерческих объектов.",
    icon: "🛗",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    title: "Монтаж",
    text: "Профессиональная установка, настройка и запуск лифтового оборудования.",
    icon: "🏗️",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    title: "Сервис",
    text: "Техническое обслуживание, диагностика, ремонт и модернизация.",
    icon: "🛠️",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    title: "Для новостроек",
    text: "Комплексные решения для застройщиков и строительных компаний.",
    icon: "🏢",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
];

const elevatorTypes = [
  {
    name: "Пассажирские",
    icon: "👥",
    desc: "Комфорт и безопасность для жилых и офисных зданий.",
    images: [
      "/images/lifts/passenger/1.jpg",
      "/images/lifts/passenger/2.jpg",
    ],
  },
  {
    name: "Грузовые",
    icon: "📦",
    desc: "Надежные решения с высокой грузоподъемностью.",
    images: [
      "/images/lifts/freight/1.jpg",
      "/images/lifts/freight/2.jpg",
    ],
  },
  {
    name: "Панорамные",
    icon: "🌆",
    desc: "Эстетика, стеклянные кабины и современный внешний вид.",
    images: [
      "/images/lifts/panoramic/1.jpg",
      "/images/lifts/panoramic/2.jpg",
    ],
  },
  {
    name: "Больничные",
    icon: "🏥",
    desc: "Специализированные лифты для медучреждений.",
    images: [
      "/images/lifts/hospital/1.jpg",
      "/images/lifts/hospital/2.jpg",
    ],
  },
];

const projects = [
  {
    title: "Жилой комплекс в Душанбе",
    type: "Пассажирские лифты",
    location: "Душанбе",
    images: [
      "/images/projects/project1-1.jpg",
      "/images/projects/project1-2.jpg",
      "/images/projects/project1-3.jpg",
      "/images/projects/project1-4.jpg",
      "/images/projects/project1-5.jpg",
      "/images/projects/project1-6.jpg",
      "/images/projects/project1-7.jpg",
      "/images/projects/project1-8.jpg",
      
    ],
  },
  {
    title: "Бизнес-центр",
    type: "Панорамный лифт",
    location: "Душанбе",
    images: [
      "/images/projects/project2-1.jpg",
      "/images/projects/project2-2.jpg",
      "/images/projects/project2-3.jpg",
    ],
  },
  {
    title: "Медицинский центр",
    type: "Больничный лифт",
    location: "Худжанд",
    images: [
      "/images/projects/project3-1.jpg",
      "/images/projects/project3-2.jpg",
      "/images/projects/project3-3.jpg",
    ],
  },
  {
    title: "Торговый объект",
    type: "Грузовой лифт",
    location: "Бохтар",
    images: [
      "/images/projects/project4-1.jpg",
      "/images/projects/project4-2.jpg",
      "/images/projects/project4-3.jpg",
    ],
  },
];

const advantages = [
  { text: "Подбор под ваш объект", icon: "📐" },
  { text: "Монтаж под ключ", icon: "🔧" },
  { text: "Современный дизайн кабин", icon: "✨" },
  { text: "Сервис и поддержка", icon: "⚡" },
];

const stats = [
  { value: "6+", label: "лет опыта", icon: "⏳" },
  { value: "100+", label: "объектов", icon: "🏗️" },
  { value: "24/7", label: "сервис", icon: "📞" },
];

function App() {
  const [isVisible, setIsVisible] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [projectSlides, setProjectSlides] = useState(
    projects.map(() => 0)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-observe]");
    elements.forEach((el) => observer.observe(el));

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 16,
        y: (e.clientY / window.innerHeight - 0.5) * 16,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectSlides((prev) =>
        prev.map((value, index) => (value + 1) % projects[index].images.length)
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextProjectSlide = (projectIndex) => {
    setProjectSlides((prev) =>
      prev.map((value, index) =>
        index === projectIndex
          ? (value + 1) % projects[projectIndex].images.length
          : value
      )
    );
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
  };

  const setProjectSlide = (projectIndex, slideIndex) => {
    setProjectSlides((prev) =>
      prev.map((value, index) => (index === projectIndex ? slideIndex : value))
    );
  };

  return (
    <div className="site">
      <div className="gradient-bg">
        <div className="gradient-orb orb1"></div>
        <div className="gradient-orb orb2"></div>
        <div className="gradient-orb orb3"></div>
      </div>

      <header className="header" data-observe="header">
        <div className="container nav">
          <div
            className="logo"
            style={{ transform: `translateX(${mousePosition.x * 0.08}px)` }}
          >
            <div className="logo-mark">
              <span className="logo-3d">LT</span>
            </div>
            <div className="logo-text">
              <h2>Lift TJ</h2>
              <p>Продажа и установка лифтов</p>
            </div>
          </div>

          <nav className="menu">
            <a href="#services" className="nav-link">
              Услуги
            </a>
            <a href="#catalog" className="nav-link">
              Лифты
            </a>
            <a href="#projects" className="nav-link">
              Наши работы
            </a>
            <a href="#about" className="nav-link">
              О нас
            </a>
            <a href="#contact" className="nav-link">
              Контакты
            </a>
          </nav>

          <a href="tel:+992907762277" className="btn btn-primary btn-small">
            +992 907 76 22 77
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-left" data-observe="hero">
            <span className="badge">Lift TJ • Лифтовые решения под ключ</span>

            <h1 className="glitch-text">
              Лифты для новостроек и коммерческих объектов
            </h1>

            <p className="typing-text">
              Поставка, монтаж и сервис современных лифтов с акцентом на
              надежность, безопасность и стиль.
            </p>

            <div className="hero-buttons">
              <a href="#contact" className="btn btn-primary btn-pulse">
                <span>Получить расчет</span>
                <span className="btn-shine"></span>
              </a>

              <a href="#catalog" className="btn btn-outline">
                Смотреть лифты
              </a>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="stat-icon">{stat.icon}</span>
                  <div>
                    <h3 className="counter">{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right" data-observe="hero">
            <div
              className="elevator-3d"
              style={{
                transform: `rotateY(${mousePosition.x}deg) rotateX(${
                  mousePosition.y * -1
                }deg)`,
              }}
            >
              <div className="elevator-card glass-card">
                <div className="elevator-top">
                  <span>Premium Lift Design</span>
                  <span className="status">Modern</span>
                </div>

                <div className="elevator-visual">
                  <div className="lift-shaft">
                    <div className={`lift-cabin cabin-${activeSlide}`}>
                      <div className="cabin-door door-left"></div>
                      <div className="cabin-door door-right"></div>
                      <div className="cabin-interior">
                        <span className="floor-indicator">
                          {activeSlide + 1}
                        </span>
                      </div>
                    </div>
                    <div className="shaft-lines"></div>
                  </div>
                </div>

                <div className="elevator-bottom">
                  <div className="mini-box">Новостройки</div>
                  <div className="mini-box">Бизнес-центры</div>
                  <div className="mini-box">Сервис</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services" data-observe="services">
        <div className="container">
          <div className="section-head">
            <span className="section-subtitle">Наши услуги</span>
            <h2 className="section-title">Что мы предлагаем</h2>
            <p className="section-desc">
              Полный цикл работ — от подбора модели до запуска и технического
              сопровождения.
            </p>
          </div>

          <div className="services-grid">
            {services.map((item, index) => (
              <div
                className="service-card"
                key={index}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = item.gradient;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "";
                }}
              >
                <div className="service-icon-wrapper">
                  <div className="service-icon">{item.icon}</div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="service-hover-bg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section dark-section"
        id="catalog"
        data-observe="catalog"
      >
        <div className="container">
          <div className="section-head">
            <span className="section-subtitle">Категории</span>
            <h2 className="section-title">Типы лифтов</h2>
            <p className="section-desc">
              Решения для жилых, коммерческих и специализированных объектов.
            </p>
          </div>

          <div className="catalog-grid">
            {elevatorTypes.map((item, index) => (
              <div key={index} className="catalog-card floating-card">
                <div className="card-icon">{item.icon}</div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>

                <div className="lift-gallery">
                  {item.images.map((img, imgIndex) => (
                    <div className="lift-image-box" key={imgIndex}>
                      <img
                        src={img}
                        alt={`${item.name} ${imgIndex + 1}`}
                        className="lift-image"
                      />
                    </div>
                  ))}
                </div>

                <div className="card-shine"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section projects-section"
        id="projects"
        data-observe="projects"
      >
        <div className="container">
          <div className="section-head">
            <span className="section-subtitle">Наши работы</span>
            <h2 className="section-title">Установленные лифты</h2>
            <p className="section-desc">
              Каждый объект показывает несколько фотографий, чтобы можно было
              увидеть реальную установку, качество и внешний вид.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project, projectIndex) => (
              <div className="project-card project-card-slider" key={projectIndex}>
                <div className="project-slider">
                  <img
                    src={project.images[projectSlides[projectIndex]]}
                    alt={project.title}
                    className="project-image"
                  />

                  <div className="project-overlay top-badge">
                    <span>{project.type}</span>
                  </div>

                  <div className="project-overlay location-badge">
                    <span>{project.location}</span>
                  </div>

                  <button
                    type="button"
                    className="project-nav prev"
                    onClick={() => prevProjectSlide(projectIndex)}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    className="project-nav next"
                    onClick={() => nextProjectSlide(projectIndex)}
                  >
                    ›
                  </button>
                </div>

                <div className="project-content">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="about" data-observe="about">
        <div className="container about-grid">
          <div className="about-left">
            <div className="section-head left">
              <span className="section-subtitle">О компании</span>
              <h2 className="section-title">Надежный партнер по лифтам</h2>
              <p className="section-desc">
                Мы работаем с новостройками, жилыми комплексами и коммерческими
                объектами, предлагая качественные и современные лифтовые решения.
              </p>
            </div>

            <div className="experience-badge">
              <span className="years">6+</span>
              <span className="text">лет уверенной работы</span>
            </div>
          </div>

          <div className="advantages-list">
            {advantages.map((item, index) => (
              <div key={index} className="advantage-item">
                <span className="advantage-icon">{item.icon}</span>
                <span>{item.text}</span>
                <div
                  className="advantage-progress"
                  style={{ width: isVisible["about"] ? "100%" : "0%" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section contact-section"
        id="contact"
        data-observe="contact"
      >
        <div className="container contact-grid">
          <div className="contact-info">
            <span className="section-subtitle">Контакты</span>
            <h2 className="section-title">Получите консультацию</h2>
            <p className="section-desc">
              Оставьте заявку и мы подберем оптимальное решение для вашего
              объекта.
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <strong>Телефон:</strong>
                  <a href="tel:+992907762277">+992 907 76 22 77</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">🟢</span>
                <div>
                  <strong>WhatsApp:</strong>
                  <a
                    href="https://wa.me/992907762277"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +992 907 76 22 77
                  </a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <strong>Email:</strong>
                  <a href="mailto:info@lifttj.tj">info@lifttj.tj</a>
                </div>
              </div>

              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <strong>Адрес:</strong>
                  <span>Душанбе, Таджикистан</span>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form glass-card">
            <h3>Оставить заявку</h3>

            <div className="form-group">
              <input
                type="text"
                placeholder="Ваше имя"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Номер телефона"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Объект / компания"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <textarea
                placeholder="Кратко опишите проект"
                className="form-input"
                rows="4"
              ></textarea>
            </div>

            <button type="button" className="btn btn-primary full-btn btn-3d">
              <span>Отправить заявку</span>
              <span className="btn-ripple"></span>
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                <span className="logo-mark">LT</span>
                <span>Lift TJ</span>
              </div>
              <p>
                Современные лифтовые решения для жилых и коммерческих объектов.
              </p>
            </div>

            <div className="footer-col">
              <h4>Услуги</h4>
              <a href="#services">Продажа</a>
              <a href="#services">Монтаж</a>
              <a href="#services">Сервис</a>
            </div>

            <div className="footer-col">
              <h4>Навигация</h4>
              <a href="#catalog">Лифты</a>
              <a href="#projects">Наши работы</a>
              <a href="#about">О нас</a>
              <a href="#contact">Контакты</a>
            </div>

            <div className="footer-col">
              <h4>Связь</h4>
              <p>+992 907 76 22 77</p>
              <p>info@lifttj.tj</p>
              <p>WhatsApp: +992 907 76 22 77</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 Lift TJ. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/992907762277"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <span className="whatsapp-icon">💬</span>
        <span className="whatsapp-text">WhatsApp</span>
      </a>
    </div>
  );
}

export default App;