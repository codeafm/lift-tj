// Language-independent data. All text lives in translations.js.

export const PHONE_RAW = "+992907762277";
export const PHONE_TEXT = "+992 907 76 22 77";
export const WHATSAPP_NUMBER = "992907762277";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const MAP_EMBED_URL = "https://www.google.com/maps?q=Crowne+Plaza+Dushanbe&output=embed";

// Order of sections on the page; drives the menu and the elevator-shaft navigation.
export const navSections = ["catalog", "configurator", "services", "projects", "process", "faq", "contact"];

export const statValues = ["6+", "120+", "24/7", "4"];

export const elevatorTypes = [
  {
    id: "passenger",
    image: "/images/lifts/passenger/2.jpg",
    capacities: [400, 630, 800, 1000, 1275, 1600],
  },
  {
    id: "freight",
    image: "/images/lifts/freight/2.jpg",
    capacities: [500, 1000, 2000, 3000, 5000],
  },
  {
    id: "panoramic",
    image: "/images/lifts/panoramic/1.jpg",
    capacities: [630, 800, 1000, 1350, 1600],
  },
  {
    id: "hospital",
    image: "/images/lifts/hospital/2.jpg",
    capacities: [1275, 1600, 2000, 2500],
  },
];

export const serviceIcons = ["lift", "build", "wrench", "refresh"];
export const advantageIcons = ["shield", "doc", "team", "clock"];

export const projectImages = [
  [
    "/images/projects/project1-7.jpg",
    "/images/projects/project1-5.jpg",
    "/images/projects/project1-8.jpg",
    "/images/projects/project1-4.jpg",
    "/images/projects/project1-6.jpg",
    "/images/projects/project1-2.jpg",
    "/images/projects/project1-3.jpg",
    "/images/projects/project1-1.jpg",
  ],
  ["/images/projects/project2-1.jpg", "/images/projects/project2-2.jpg", "/images/projects/project2-3.jpg"],
  ["/images/projects/project3-1.jpg", "/images/projects/project3-2.jpg", "/images/projects/project3-3.jpg"],
  ["/images/projects/project4-1.jpg", "/images/projects/project4-2.jpg", "/images/projects/project4-3.jpg"],
];

export const cabinOptions = {
  walls: ["steel", "gold", "mirror", "wood"],
  floor: ["marble", "granite", "medallion"],
  light: ["warm", "cool", "stars"],
};

// Swatch colors for the configurator option buttons.
export const swatches = {
  steel: "linear-gradient(135deg,#eef0f2,#9aa1a9 55%,#d8dce0)",
  gold: "linear-gradient(135deg,#f6e3b4,#c79a4b 55%,#f1d79c)",
  mirror: "linear-gradient(135deg,#5b6470,#1d2229 55%,#8a95a3)",
  wood: "linear-gradient(135deg,#a8774a,#6b4528 55%,#93633b)",
  marble: "linear-gradient(135deg,#ffffff,#e4e1dc 60%,#f7f5f1)",
  granite: "radial-gradient(circle at 30% 30%,#3a3d42,#121315 70%)",
  medallion: "radial-gradient(circle,#1d1f22 0 18%,#f3efe8 19% 32%,#1d1f22 33% 38%,#f3efe8 39%)",
  warm: "radial-gradient(circle,#fff3d6,#f2b866 70%)",
  cool: "radial-gradient(circle,#ffffff,#a9cdf5 70%)",
  stars: "radial-gradient(circle at 30% 35%,#fff 0 6%,transparent 7%),radial-gradient(circle at 70% 60%,#fff 0 5%,transparent 6%),radial-gradient(circle at 45% 75%,#fff 0 4%,transparent 5%),#1b2433",
};
