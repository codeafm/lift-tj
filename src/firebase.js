import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBX3CF6qcuaAa25jhoUt9ZhVyLWk1zKn30",
  authDomain: "lifttj.firebaseapp.com",
  projectId: "lifttj",
  storageBucket: "lifttj.firebasestorage.app",
  messagingSenderId: "742637600124",
  appId: "1:742637600124:web:023bd2a929218eef1e78f9",
  measurementId: "G-E6LCZJM07T"
};

const app = initializeApp(firebaseConfig);

export const initAnalytics = async () => {
  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  return getAnalytics(app);
};

export const trackEvent = async (eventName, params = {}) => {
  const analytics = await initAnalytics();

  if (!analytics) {
    return;
  }

  logEvent(analytics, eventName, params);
};