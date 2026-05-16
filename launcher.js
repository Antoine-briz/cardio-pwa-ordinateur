const SERVICE_KEY = "saric_service";

const SERVICES = {
  cardio: {
    label: "Institut de cardiologie",
    className: "service-cardio",
    file: "./app-saric.js"
  },

  gaston: {
    label: "Gaston Cordier",
    className: "service-gaston",
    file: "./app-gaston.js"
  },

  husson: {
    label: "Husson Mourier",
    className: "service-husson",
    file: "./app-husson.js"
  },

  babinski: {
    label: "Babinski",
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
  const menu = document.getElementById("service-menu");

  if (!chip || !label || !menu) return;

  label.textContent = service.label;

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
