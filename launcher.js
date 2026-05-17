function applyTheme(theme) {
  document.body.classList.toggle("theme-light", theme === "light");
  document.body.classList.toggle("theme-dark", theme === "dark");

  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);

  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

const SERVICE_KEY = "saric_service";

const SERVICES = {
  cardio: {
    label: "Institut de cardiologie",
    icon: "img/logoIC.png",
    className: "service-cardio",
    file: "./app-saric.js"
  },

  gaston: {
    label: "Gaston Cordier",
    icon: "img/logoGC.png",
    className: "service-gaston",
    file: "./app-gaston.js"
  },

  husson: {
    label: "Husson Mourier",
    icon: "img/logoHM.png",
    className: "service-husson",
    file: "./app-husson.js"
  },

  babinski: {
    label: "Babinski",
    icon: "img/logoBA.png",
    className: "service-babinski",
    file: "./app-babinski.js"
  }
};

let currentService = localStorage.getItem(SERVICE_KEY) || "cardio";

if (!SERVICES[currentService]) {
  currentService = "cardio";
}

function initServiceSwitcher() {
  const service = SERVICES[currentService];

  const chip = document.getElementById("service-switch-btn");
  const label = document.getElementById("service-chip-label");
const icon = document.getElementById("service-chip-icon");
const menu = document.getElementById("service-menu");

if (!chip || !menu) return;

if (label) {
  label.textContent = service.label;
}

if (icon) {
  icon.src = service.icon;
  icon.alt = service.label;
}

  chip.classList.remove(
    "service-cardio",
    "service-gaston",
    "service-husson",
    "service-babinski"
  );

  chip.classList.add(service.className);

  chip.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll("button[data-service]").forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.setItem(SERVICE_KEY, btn.dataset.service);
      location.hash = "#/";
      location.reload();
    });
  });
}

function loadServiceScript() {
  const service = SERVICES[currentService];

  const script = document.createElement("script");
  script.src = service.file + "?v=1.0.0";

  document.body.appendChild(script);
}

initServiceSwitcher();
loadServiceScript();
