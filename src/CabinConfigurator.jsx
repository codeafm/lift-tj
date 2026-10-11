import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";
import { trackEvent } from "./firebase";
import { cabinOptions, swatches } from "./data";

const WALLS = {
  steel: { back: ["#b9c0c7", "#eef1f3", "#c4cad0"], front: "#868d95", rear: "#c7cdd3", seam: "rgba(0,0,0,.14)" },
  gold: { back: ["#b88d45", "#f1d9a0", "#c39a52"], front: "#7d5b29", rear: "#d2ad6a", seam: "rgba(80,50,10,.25)" },
  mirror: { back: ["#20252b", "#5d6773", "#262c33"], front: "#101317", rear: "#3e4650", seam: "rgba(255,255,255,.08)" },
  wood: { back: ["#7a4d2c", "#ad7a4d", "#82532f"], front: "#4f321b", rear: "#93643b", seam: "rgba(40,20,5,.3)" },
};

const LIGHT = {
  warm: { ceiling: "#f3ece0", lamp: "#fff1d1", tint: "rgba(255,186,102,.16)" },
  cool: { ceiling: "#eef2f6", lamp: "#ffffff", tint: "rgba(160,205,255,.14)" },
  stars: { ceiling: "#141b28", lamp: "#ffffff", tint: "rgba(110,130,255,.08)" },
};

// Deterministic "random" star field for the starry-sky ceiling.
const STARS = Array.from({ length: 70 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const fx = a - Math.floor(a);
  const fy = b - Math.floor(b);
  const y = 52 + fy * 76;
  const half = 170 - ((y - 50) / 80) * 90;
  return { x: 200 + (fx * 2 - 1) * half * 0.95, y, r: 0.6 + fx * 1.1, d: (i % 7) * 0.4 };
});

const stop = (color) => ({ stopColor: color, transition: "stop-color .7s ease" });

function Cabin({ walls, floor, light, open }) {
  const w = WALLS[walls];
  const l = LIGHT[light];
  const sideSeams = [0.33, 0.66];

  return (
    <svg viewBox="0 0 400 500" className="cabin-svg" role="img" aria-hidden="true">
      <defs>
        <clipPath id="cab-open">
          <rect x="30" y="50" width="340" height="450" />
        </clipPath>
        <linearGradient id="cab-back" x1="0" x2="1">
          <stop offset="0" style={stop(w.back[0])} />
          <stop offset=".5" style={stop(w.back[1])} />
          <stop offset="1" style={stop(w.back[2])} />
        </linearGradient>
        <linearGradient id="cab-left" x1="0" x2="1">
          <stop offset="0" style={stop(w.front)} />
          <stop offset="1" style={stop(w.rear)} />
        </linearGradient>
        <linearGradient id="cab-right" x1="1" x2="0">
          <stop offset="0" style={stop(w.front)} />
          <stop offset="1" style={stop(w.rear)} />
        </linearGradient>
        <linearGradient id="cab-rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#8b939c" />
        </linearGradient>
        <linearGradient id="cab-door" x1="0" x2="1">
          <stop offset="0" stopColor="#9aa2aa" />
          <stop offset=".45" stopColor="#e9ecef" />
          <stop offset=".55" stopColor="#d5dade" />
          <stop offset="1" stopColor="#8e969e" />
        </linearGradient>
        <linearGradient id="cab-frame" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3b4047" />
          <stop offset="1" stopColor="#23272c" />
        </linearGradient>
        <linearGradient id="cab-floor-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cab-tint" cx=".5" cy="0" r="1">
          <stop offset="0" style={{ stopColor: l.tint, transition: "stop-color .7s" }} />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <pattern id="cab-grain" width="6" height="40" patternUnits="userSpaceOnUse">
          <path d="M1 0 Q3 20 1 40M4 0 Q2 22 4 40" stroke="rgba(40,20,5,.18)" fill="none" strokeWidth=".7" />
        </pattern>
        <pattern id="cab-brush" width="4" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 1.5H4" stroke="rgba(255,255,255,.18)" strokeWidth=".5" />
        </pattern>
        <pattern id="cab-speck" width="9" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".7" fill="#6b6f76" />
          <circle cx="6.5" cy="5" r=".5" fill="#9a9ea5" />
        </pattern>
        <filter id="cab-glow" x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <g clipPath="url(#cab-open)">
        {/* Ceiling */}
        <polygon points="30,50 370,50 280,130 120,130" style={{ fill: l.ceiling, transition: "fill .7s" }} />
        {light === "stars" ? (
          <g className="cab-stars">
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" style={{ animationDelay: `${s.d}s` }} />
            ))}
          </g>
        ) : (
          <g>
            {[
              [140, 72],
              [200, 72],
              [260, 72],
              [168, 104],
              [232, 104],
            ].map(([x, y]) => (
              <g key={`${x}${y}`}>
                <ellipse cx={x} cy={y} rx="16" ry="5" fill={l.lamp} filter="url(#cab-glow)" />
                <ellipse cx={x} cy={y} rx="9" ry="2.6" fill={l.lamp} />
              </g>
            ))}
          </g>
        )}

        {/* Walls */}
        <polygon points="30,50 120,130 120,400 30,500" fill="url(#cab-left)" />
        <polygon points="370,50 280,130 280,400 370,500" fill="url(#cab-right)" />
        <rect x="120" y="130" width="160" height="270" fill="url(#cab-back)" />
        {walls === "wood" && (
          <g opacity=".9">
            <rect x="120" y="130" width="160" height="270" fill="url(#cab-grain)" />
            <polygon points="30,50 120,130 120,400 30,500" fill="url(#cab-grain)" />
            <polygon points="370,50 280,130 280,400 370,500" fill="url(#cab-grain)" />
          </g>
        )}
        {walls === "steel" && (
          <g>
            <rect x="120" y="130" width="160" height="270" fill="url(#cab-brush)" />
            <polygon points="30,50 120,130 120,400 30,500" fill="url(#cab-brush)" />
            <polygon points="370,50 280,130 280,400 370,500" fill="url(#cab-brush)" />
          </g>
        )}
        {walls === "mirror" && (
          <g fill="#fff">
            <polygon points="140,130 168,130 132,400 120,400 120,250" opacity=".09" />
            <polygon points="196,130 210,130 176,400 162,400" opacity=".06" />
            <polygon points="30,120 120,170 120,230 30,215" opacity=".05" />
          </g>
        )}
        {/* Panel seams */}
        <g stroke={w.seam} strokeWidth="1.2">
          <line x1="173" y1="130" x2="173" y2="400" />
          <line x1="227" y1="130" x2="227" y2="400" />
          {sideSeams.map((s) => (
            <g key={s}>
              <line x1={30 + 90 * s} y1={50 + 80 * s} x2={30 + 90 * s} y2={500 - 100 * s} />
              <line x1={370 - 90 * s} y1={50 + 80 * s} x2={370 - 90 * s} y2={500 - 100 * s} />
            </g>
          ))}
        </g>

        {/* Handrails */}
        <rect x="130" y="290" width="140" height="6" rx="3" fill="url(#cab-rail)" />
        <line x1="34" y1="318" x2="118" y2="293" stroke="url(#cab-rail)" strokeWidth="6" strokeLinecap="round" />

        {/* Control panel */}
        <polygon points="347.5,211.75 334,214.3 334,308.8 347.5,313" fill="#14161a" />
        {[230, 246, 262, 278].map((y, i) => (
          <circle key={y} cx="340.8" cy={y + i} r="2.6" fill={i === 1 ? "#ffb15c" : "#9aa1aa"} />
        ))}

        {/* Floor */}
        <polygon
          points="30,500 370,500 280,400 120,400"
          style={{
            fill: floor === "granite" ? "#1a1b1e" : "#eeebe5",
            transition: "fill .7s",
          }}
        />
        {floor === "granite" && <polygon points="30,500 370,500 280,400 120,400" fill="url(#cab-speck)" />}
        {floor !== "granite" && (
          <g stroke="#b5afa5" strokeWidth=".9" fill="none" opacity=".55">
            <path d="M60 470 Q140 440 200 455 T340 430" />
            <path d="M130 410 Q170 430 230 418 T290 440" />
            <path d="M90 495 Q150 470 210 488" />
          </g>
        )}
        {floor === "medallion" && (
          <g className="cab-medallion">
            <ellipse cx="200" cy="452" rx="118" ry="36" fill="#1d1f22" />
            <ellipse cx="200" cy="452" rx="106" ry="32" fill="#f1ede6" />
            <ellipse cx="200" cy="452" rx="84" ry="25" fill="none" stroke="#1d1f22" strokeWidth="5" strokeDasharray="6 4" />
            <ellipse cx="200" cy="452" rx="58" ry="17" fill="#c9a46c" />
            <ellipse cx="200" cy="452" rx="46" ry="13.5" fill="#f1ede6" />
            <ellipse cx="200" cy="452" rx="22" ry="6.5" fill="#1d1f22" />
          </g>
        )}
        <polygon points="30,500 370,500 280,400 120,400" fill="url(#cab-floor-shine)" />
        <rect x="0" y="0" width="400" height="500" fill="url(#cab-tint)" />

        {/* Doors */}
        <g className={`cab-doors ${open ? "open" : ""}`}>
          <g className="cab-door left">
            <rect x="30" y="50" width="170" height="450" fill="url(#cab-door)" />
            <rect x="30" y="50" width="170" height="450" fill="url(#cab-brush)" />
            <line x1="199.5" y1="50" x2="199.5" y2="500" stroke="rgba(0,0,0,.35)" />
          </g>
          <g className="cab-door right">
            <rect x="200" y="50" width="170" height="450" fill="url(#cab-door)" />
            <rect x="200" y="50" width="170" height="450" fill="url(#cab-brush)" />
            <line x1="200.5" y1="50" x2="200.5" y2="500" stroke="rgba(255,255,255,.5)" />
          </g>
        </g>
      </g>

      {/* Portal frame */}
      <path d="M0 0H400V500H0Z M30 50V500H370V50Z" fill="url(#cab-frame)" fillRule="evenodd" />
      <rect x="160" y="12" width="80" height="26" rx="5" fill="#08090b" />
      <text x="200" y="31" textAnchor="middle" className="cab-display">
        {open ? "▲ LT" : "■ LT"}
      </text>
    </svg>
  );
}

function OptionRow({ label, group, value, onChange, labels }) {
  return (
    <fieldset className="cfg-row">
      <legend>{label}</legend>
      <div className="cfg-options">
        {cabinOptions[group].map((id) => (
          <button
            type="button"
            key={id}
            className={`cfg-option ${value === id ? "active" : ""}`}
            aria-pressed={value === id}
            onClick={() => onChange(id)}
          >
            <span className="cfg-swatch" style={{ background: swatches[id] }} />
            {labels[id]}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function CabinConfigurator({ onOrder }) {
  const { t } = useI18n();
  const c = t.configurator;
  const [cfg, setCfg] = useState({ walls: "gold", floor: "medallion", light: "warm" });
  const [open, setOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setOpen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setOpen(true), 350);
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const set = (key) => (value) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
    setOpen(true);
    trackEvent("configurator_change", { [key]: value });
  };

  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 10, y: ((e.clientY - r.top) / r.height - 0.5) * -8 });
  };

  return (
    <section className="section section-dark configurator" id="configurator">
      <div className="cfg-glow" aria-hidden="true" />
      <div className="container cfg-grid">
        <div className="cfg-stage reveal" ref={stageRef}>
          <div
            className="cfg-preview"
            onPointerMove={onMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            style={{ transform: `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` }}
          >
            <Cabin {...cfg} open={open} />
          </div>
          <div className="cfg-stage-bar">
            <span>{c.your}</span>
            <button type="button" className="cfg-doors-btn" onClick={() => setOpen((v) => !v)}>
              <Icon name="expand" size={16} /> {open ? c.doorsClose : c.doorsOpen}
            </button>
          </div>
        </div>

        <div className="cfg-panel">
          <div className="section-head reveal on-dark">
            <span className="eyebrow">{c.eyebrow}</span>
            <h2>{c.title}</h2>
            <p>{c.text}</p>
          </div>
          <div className="cfg-controls reveal" style={{ "--d": "120ms" }}>
            <OptionRow label={c.walls} group="walls" value={cfg.walls} onChange={set("walls")} labels={c.options} />
            <OptionRow label={c.floor} group="floor" value={cfg.floor} onChange={set("floor")} labels={c.options} />
            <OptionRow label={c.light} group="light" value={cfg.light} onChange={set("light")} labels={c.options} />
            <button type="button" className="btn btn-primary btn-lg cfg-order" onClick={() => onOrder(cfg)}>
              {c.order} <Icon name="arrow" size={20} />
            </button>
            <p className="cfg-note">{c.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
