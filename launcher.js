const SERVICE_KEY = "saric_service";

const SERVICES = {
  cardio: {
    label: "Institut de cardiologie",
    icon: "♡",
    file: "./apps/app-cardio.js",
    className: "service-cardio",
  },

  gaston: {
    label: "Gaston Cordier",
    icon: "⚕",
    file: "./apps/app-gaston.js",
    className: "service-gaston",
  },

  husson: {
    label: "Husson Mourier",
    icon: "⌁",
    file: "./apps/app-husson.js",
    className: "service-husson",
  },

  babinski: {
    label: "Babinski",
    icon: "☊",
    file: "./apps/app-babinski.js",
    className: "service-babinski",
  },
};

let currentService =
  localStorage.getItem(SERVICE_KEY) || "cardio";

if (!SERVICES[currentService]) {
  currentService = "cardio";
}

function initServiceSwitcher() {

  const service = SERVICES[currentService];

  document.body.classList.remove(
    "service-cardio",
    "service-gaston",
    "service-husson",
    "service-babinski"
  );

  document.body.classList.add(service.className);

  const chip =
    document.getElementById("service-switch-btn");

  const label =
    document.getElementById("service-chip-label");

  const icon =
    document.getElementById("service-chip-icon");

  const menu =
    document.getElementById("service-menu");

  label.textContent = service.label;
  icon.textContent = service.icon;

  chip.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll("button[data-service]")
    .forEach(btn => {

      btn.addEventListener("click", () => {

        const selected = btn.dataset.service;

        localStorage.setItem(
          SERVICE_KEY,
          selected
        );

        location.reload();
      });
    });

  document.addEventListener("click", e => {

    if (
      !chip.contains(e.target) &&
      !menu.contains(e.target)
    ) {
      menu.classList.add("hidden");
    }
  });
}

function loadCurrentServiceApp() {

  const script = document.createElement("script");

  script.src =
    SERVICES[currentService].file + "?v=1.0.0";

  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {

  initServiceSwitcher();

  loadCurrentServiceApp();
});
