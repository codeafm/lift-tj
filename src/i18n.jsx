import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./translations";
import { trackEvent } from "./firebase";

export const LANGS = [
  { code: "ru", label: "RU", name: "Русский" },
  { code: "tg", label: "TJ", name: "Тоҷикӣ" },
  { code: "en", label: "EN", name: "English" },
];

const STORAGE_KEY = "lifttj-lang";
const I18nContext = createContext(null);

function detectLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && translations[fromUrl]) return fromUrl;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch {
    // storage may be unavailable (private mode)
  }
  const browser = (navigator.language || "ru").slice(0, 2).toLowerCase();
  if (browser === "tg") return "tg";
  if (browser === "en") return "en";
  return "ru";
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLang);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang, t]);

  const setLang = (code) => {
    if (!translations[code] || code === lang) return;
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
    trackEvent("language_change", { language: code });
  };

  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  return useContext(I18nContext);
}
