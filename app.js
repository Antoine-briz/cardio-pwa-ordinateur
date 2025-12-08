// app.js – application Cardio ICU (squelette + intégration future ATB)

// =====================================================================
//  ROUTER DE BASE
// =====================================================================

const $app = document.getElementById("app");

function h(cls, html) {
  return `<div class="${cls}">${html}</div>`;
}

function sectionHeader(title, imageFile) {
  // Si pas d'image, on garde l'ancien comportement simple
  if (!imageFile) {
    return `
      <div class="hero">
        <h2>${title}</h2>
      </div>
    `;
  }

  // Avec image : encadré incliné à droite
  return `
    <div class="hero page-header-card">
      <h2>${title}</h2>
      <div class="angled-card">
        <img src="img/${imageFile}" alt="${title}">
      </div>
    </div>
  `;
}



// ==========================
//  GESTION DU THÈME GLOBAL
// ==========================
const THEME_KEY = "theme"; // "dark" ou "light"

// Applique le thème au <body> + synchronise les radios si elles existent
function applyTheme(theme) {
  const isLight = theme === "light";

  // Une seule classe pour le thème clair
  document.body.classList.toggle("theme-light", isLight);

  // Sauvegarde
  localStorage.setItem(THEME_KEY, theme);

  // Synchronise les radios si présentes
  const darkRadio = document.getElementById("theme-dark");
  const lightRadio = document.getElementById("theme-light");
  if (darkRadio && lightRadio) {
    darkRadio.checked = !isLight;
    lightRadio.checked = isLight;
  }
}

// Initialise le thème + branche les radios du footer
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(saved);

  const darkRadio = document.getElementById("theme-dark");
  const lightRadio = document.getElementById("theme-light");

  if (darkRadio && lightRadio) {
    darkRadio.addEventListener("change", () => {
      if (darkRadio.checked) applyTheme("dark");
    });
    lightRadio.addEventListener("change", () => {
      if (lightRadio.checked) applyTheme("light");
    });
  }
}


// =====================================================================
//  PAGE D’ACCUEIL
// =====================================================================


function renderHome() {
  $app.innerHTML = `
    <section class="home">
      <div class="hero home-hero">
        <h2>Menu principal</h2>
      </div>

      <div class="home-cards">
        <div class="card card-home" onclick="location.hash = '#/anesthesie'">
          <h3>Protocoles d’anesthésie</h3>
          <img src="img/anesthesie.png" alt="Anesthésie" class="menu-section-img" />
        </div>

        <div class="card card-home" onclick="location.hash = '#/reanimation'">
          <h3>Protocoles de réanimation</h3>
          <img src="img/reanimation.png" alt="Réanimation" class="menu-section-img" />
        </div>

        <div class="card card-home" onclick="location.hash = '#/cec'">
          <h3>Circulation extra-corporelle</h3>
          <img src="img/cec.png" alt="CEC" class="menu-section-img" />
        </div>
      </div>

      <div class="home-buttons">
        <button class="btn outline" onclick="window.open('files/planning_medical.xlsx')">
          Planning médical
        </button>
        <button class="btn ghost" onclick="location.hash = '#/annuaire'">
          Annuaire
        </button>
        </button>
        <button class="btn ghost" onclick="location.hash = '#/codes'">
          Codes d’accès
        </button>
      </div>
    </section>
  `;
}


// =====================================================================
//  ANESTHÉSIE – MENU PRINCIPAL
// =====================================================================

// =====================================================================
//  ANESTHÉSIE – MENU PRINCIPAL
// =====================================================================

function renderAnesthMenu() {
  $app.innerHTML = `
    <section class="anesth-menu">
      <div class="hero">
        <h2>Protocoles d’anesthésie</h2>
      </div>

      <div class="anesth-top-row">
        <button class="btn" onclick="location.hash = '#/anesthesie/consultations'">
          Consultations
        </button>
        <button class="btn" onclick="location.hash = '#/anesthesie/antibiopro'">
          Antibioprophylaxie
        </button>
      </div>

      <div class="anesth-cards">
        <div class="card anesth-card" onclick="location.hash = '#/anesthesie/chir-cec'">
          <img src="img/chircec.png" class="menu-section-img">
          <h3>Chirurgie cardiaque</h3>
        </div>

        <div class="card anesth-card" onclick="location.hash = '#/anesthesie/cardio-struct'">
          <img src="img/cardiostruct.png" class="menu-section-img">
          <h3>Cardiologie structurelle</h3>
        </div>

        <div class="card anesth-card" onclick="location.hash = '#/anesthesie/vasculaire'">
          <img src="img/vasculaire.png" class="menu-section-img">
          <h3>Chirurgie vasculaire</h3>
        </div>

        <div class="card anesth-card" onclick="location.hash = '#/anesthesie/radiovasculaire'">
          <img src="img/radiovasc.png" class="menu-section-img">
          <h3>Radio-vasculaire</h3>
        </div>
      </div>
    </section>
  `;
}


// Lance tout après chargement du DOM
// Lance tout après chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  // Initialisation du thème
  initTheme();

  // Gestion du bouton "Retour"
  const backBtn = document.getElementById("back-button");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1) {
        // On a un historique : on revient en arrière
        window.history.back();
      } else {
        // Pas d’historique utile : on revient à l’accueil
        window.location.hash = "#/";
      }
    });
  }
});


const routes = {
  "#/": renderHome,

  // Anesthésie
  "#/anesthesie": renderAnesthMenu,
  "#/anesthesie/consultations": renderAnesthConsultations,
  "#/anesthesie/antibiopro": renderAntibioproForm,
  "#/anesthesie/chir-cec": renderAnesthChirCecMenu,
  "#/anesthesie/cardio-struct": renderAnesthCardioStructMenu,
  "#/anesthesie/vasculaire": renderAnesthVasculaire,
  "#/anesthesie/radiovasculaire": renderAnesthRadioVasculaire,

  // Réanimation
  "#/reanimation": renderReanMenu,
  "#/reanimation/formules": renderReanFormulesMenu,
  "/reanimation/formules/ventilation": renderReanFormulesVentilation,
"/reanimation/formules/hemodynamique": renderReanFormulesCardio,
"/reanimation/formules/metabolique": renderReanFormulesMetabolique,
  "#/reanimation/prescriptions": renderReanPrescriptionsPostOp,
  "#/reanimation/saignements": renderReanSaignementsPostOp,
  "#/reanimation/fa": renderReanFAPostOp,
  "#/reanimation/eto": renderReanEto,
  "#/reanimation/antibiotherapie": renderReanAntibiotherapieMenu,
  "#/reanimation/eer": renderReanEerMenu,
  "#/reanimation/transplantation": renderReanTransplantMenu,
  "#/reanimation/assistances": renderReanAssistancesMenu,

  // Antibiothérapie probabiliste (menus Proba)
  "#/proba": renderProbaMenu,
"#/proba/pneumonies": renderProbaPneumonieForm,
"#/proba/iu": renderProbaIUForm,
"#/proba/abdo": renderProbaAbdoForm,
"#/proba/neuro": renderProbaNeuroForm,
"#/proba/dermohypo": renderProbaDermohypoForm,
"#/proba/endocardite": renderProbaEndocarditeForm,
"#/proba/mediastinite": renderProbaMediastiniteForm,
"#/proba/scarpa": renderProbaScarpaForm,
"#/proba/sepsis": renderProbaSepsisForm,
  
  // CEC
  "#/cec": renderCecMenu,

  // Divers
  "#/planning": renderPlanning,
  "#/annuaire": renderAnnuaire,
  "#/codes": renderCodesAcces,
};

function navigate() {
  const hash = window.location.hash || "#/";
  const view = routes[hash];
  if (view) {
    view();
  } else {
    renderNotFound();
  }
}

window.addEventListener("hashchange", navigate);
window.addEventListener("load", navigate);

/* ====================================================================
   ANESTHÉSIE – CONSULTATIONS
   ==================================================================== */

// Page "Consultations" : 2 boutons bleus
function renderAnesthConsultations() {
  $app.innerHTML = `
    <section>
      ${sectionHeader("Consultation d’anesthésie", "consultation.png")}

      <div class="grid">
        <button class="btn" onclick="window.open('https://www.euroscore.org/index.php?id=17', '_blank')">
          Calcul de l’EuroScore II
        </button>

        <button class="btn" onclick="renderAnesthConsultTraitements()">
          Gestion pré-opératoire des traitements
        </button>
      </div>
    </section>
  `;
}

// Page "Gestion pré-opératoire des traitements"
function renderAnesthConsultTraitements() {
  const encadres = [
    {
      titre: "Anti-coagulants",
      html: `
        <div class="info-content">
          <!-- Héparine non fractionnée -->
          <details>
            <summary>
              <span style="color:#b91c1c; font-weight:600;">
                Héparine non fractionnée
              </span>
            </summary>
            <ul>
              <li>Calciparine curatif&nbsp;: Dernière injection 8h avant l’intervention.</li>
              <li>HNF IVSE curatif&nbsp;: Poursuivre jusqu’à l’intervention.</li>
            </ul>
          </details>

          <!-- Héparines de bas poids moléculaire -->
          <details>
            <summary>
              <span style="color:#b91c1c; font-weight:600;">
                Héparines de bas poids moléculaire
              </span>
            </summary>
            <ul>
              <li>Préventif&nbsp;: arrêt 12h avant l’intervention.</li>
              <li>Curatif&nbsp;: arrêt 24h avant l’intervention.</li>
            </ul>
          </details>

          <!-- Anticoagulants oraux directs -->
          <details>
            <summary>
              <span style="color:#b91c1c; font-weight:600;">
                Anticoagulants oraux directs
              </span>
            </summary>
            <p><strong>Si absence de relai :</strong></p>
            <ul>
              <li>Dabigatran (Pradaxa)&nbsp;: Arrêt 3 jours pleins avant intervention (4 jours si DFG 30–50 mL/min/1,73m²).</li>
              <li>Rivaroxaban (Xarelto)&nbsp;: Arrêt 2 jours pleins avant intervention.</li>
              <li>Apixaban (Eliquis)&nbsp;: Arrêt 2 jours pleins avant intervention.</li>
            </ul>
            <p><strong>Relai AOD vers HBPM :</strong></p>
            <p>Indications&nbsp;: À discuter au cas par cas (uniquement si risque thrombotique majeur).</p>
            <p>
              Modalités&nbsp;: Arrêt de l’AOD idem (2 à 4 jours pleins selon molécule/fonction rénale).<br>
              HBPM 12h après dernière prise pour Rivaroxaban/Apixaban, 24h après dernière prise pour Dabigatran.<br>
              Dernière dose d’HBPM 24h avant l’intervention.
            </p>
          </details>

          <!-- Anti-vitamines K -->
          <details>
            <summary>
              <span style="color:#b91c1c; font-weight:600;">
                Anti-vitamines K
              </span>
            </summary>
            <p><strong>Si absence de relai :</strong></p>
            <ul>
              <li>Fluindione (Previscan)&nbsp;: Arrêt 5 jours pleins avant intervention.</li>
              <li>Warfarine (Coumadine)&nbsp;: Arrêt 5 jours pleins avant intervention.</li>
              <li>Acénocoumarol (Sintrom)&nbsp;: Arrêt 3 jours pleins avant intervention.</li>
            </ul>

            <p>
              <strong>Relai AVK vers HBPM</strong>
              (ou Calciparine si &lt; 30 mL/min/1,73m²)&nbsp;:
            </p>
            <p>
              <em>Indications :</em> Valve mécanique, EP/TVP &lt; 3 mois (ou MTEV récidivante),
              FA emboligène &lt; 3 mois, thrombus intra-cardiaque.
            </p>
            <p>
              <em>Modalités :</em> Arrêt de l’AVK idem (3 à 5 jours pleins).<br>
              Première injection HBPM/Calciparine 48h après la dernière prise
              de Fluindione (Previscan) / Warfarine (Coumadine),
              24h après dernière prise d’Acénocoumarol (Sintrom).
            </p>
            <p><strong>INR la veille de l’intervention :</strong></p>
            <ul>
              <li>INR &lt; 1,2&nbsp;: Intervention autorisée.</li>
              <li>INR 1,2–1,5&nbsp;: Vitamine K 5 mg + contrôle J0
                  (intervention autorisée pour TAVI).</li>
              <li>INR &gt; 1,5&nbsp;: Vitamine K 5 mg + repousser intervention
                  (intervention autorisée pour assistances et valve mitrale mécanique).</li>
            </ul>
          </details>
        </div>
      `,
    },

    {
      titre: "Anti-hypertenseurs",
      html: `
        <div class="info-content">
          <p><strong>A poursuivre jusqu’à l’intervention :</strong></p>
          <ul>
            <li>
              Bêtabloquants (propranolol, aténolol, bisoprolol, métoprolol…) :
              augmentation du risque d’ischémie myocardique ou d’arythmie en cas d’arrêt.
            </li>
            <li>
              Inhibiteurs calciques (amlodipine, lercanidipine, nifédipine,
              vérapamil, diltiazem)&nbsp;: pas/peu de risque per-anesthésique notable.
            </li>
            <li>
              Anti-HTA centraux (Urapidil, Rilménidine, Clonidine)&nbsp;:
              pas/peu de risque per-anesthésique notable.
            </li>
          </ul>

          <p><strong>A arrêter avant l’intervention :</strong></p>
          <ul>
            <li>
              IEC (Enalapril, périndopril, ramipril…)&nbsp;:
              Dernière prise 48h avant l’intervention (J-2).
            </li>
            <li>
              ARA II / sartans (Irbesartan, losartan, valsartan…)&nbsp;:
              Dernière prise 48h avant l’intervention (J-2).
            </li>
            <li>
              Diurétiques de l’anse (Furosémide, bumétanide)&nbsp;:
              Dernière prise 24h avant l’intervention.
            </li>
          </ul>
        </div>
      `,
    },

    {
      titre: "Anti-agrégants plaquettaires",
      html: `
        <div class="info-content">
          <ul>
            <li>Aspirine (Kardégic)&nbsp;: Ne pas arrêter.</li>
            <li>Clopidogrel (Plavix)&nbsp;: Arrêt 5 jours pleins avant l’intervention.</li>
            <li>Ticagrélor (Brilique)&nbsp;: Arrêt 3 jours pleins avant l’intervention.</li>
            <li>Prasugrel (Efient)&nbsp;: Arrêt 7 jours pleins avant l’intervention.</li>
            <li>AntiGpIIbIIIa&nbsp;: Arrêt à H-4 de l’intervention.</li>
          </ul>

          <p><strong>Indications de relai :</strong></p>
          <ul>
            <li>
              Si traitement par inhibiteur de P2Y12 en monothérapie&nbsp;:
              envisager un relai par Aspirine (Kardégic) dès 24h après la dernière prise
              de P2Y12 en cas de risque thrombotique significatif
              (stent &lt; 12 mois, maladie coronarienne active…).
            </li>
            <li>
              Relai par inhibiteur de P2Y12 IVSE (Cangrelor) à discuter si risque
              thrombotique majeur et risque hémorragique&nbsp;:
              arrêt à H-1 de l’intervention.
            </li>
          </ul>
        </div>
      `,
    },

    {
      titre: "Traitements du diabète",
      html: `
        <div class="info-content">
          <ul>
          <p><strong>Antidiabétiques oraux :</strong></p>
           <ul>
            <li>Metformine (Glucophage…)&nbsp;: Arrêt 48h avant l’intervention.</li>
            <li>
              Sulfamides hypoglycémiants (glimépiride, gliclazide…)&nbsp;:
              Arrêt à 24h de l’intervention (risque d’hypoglycémie).
            </li>
            <li>
              Inhibiteurs DPP-4 (sitagliptine, vildagliptine…)&nbsp;:
              Poursuivre jusqu’au matin de l’intervention (risque d’hypoglycémie faible).
            </li>
            <li>
              Inhibiteurs SGLT2 (gliflozines&nbsp;: dapagliflozine, empagliflozine…)&nbsp;:
              Arrêt à 72h de l’intervention (risque d’acidocétose euglycémique).
            </li>
          </ul>

          <p><strong>Insuline SC :</strong></p>
          <ul>
            <li>
              Schéma basal/bolus (lente/rapide)&nbsp;:
              Maintenir 50–80&nbsp;% de la dose habituelle de lente jusqu’à la veille
              de l’intervention. Pas de dose rapide le jour de l’intervention.
            </li>
            <li>
              Schéma bolus seul (rapide sans lente)&nbsp;:
              Pas de dose rapide le jour de l’intervention.
            </li>
          </ul>
        </div>
      `,
    },

    {
      titre: "Traitements de l’insuffisance cardiaque",
      html: `
        <div class="info-content">
          <ul>
            <li>
              Bêtabloquants (aténolol, bisoprolol, métoprolol, propranolol)&nbsp;:
              à poursuivre absolument.
            </li>
            <li>
              IEC (Enalapril, périndopril, ramipril…)&nbsp;:
              Dernière prise 48h avant l’intervention (J-2).
            </li>
            <li>
              Sacubitril/valsartan (Entresto)&nbsp;:
              Dernière prise 48h avant l’intervention (J-2).
            </li>
            <li>
              Dapagliflozine (Forxiga)&nbsp;: Arrêt 72h avant l’intervention.
            </li>
            <li>
              Diurétiques de l’anse (Furosémide, bumétanide)&nbsp;:
              Dernière prise 24h avant l’intervention
              ou poursuivre jusqu’au matin de l’intervention
              si risque important d’OAP.
            </li>
          </ul>
        </div>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Gestion pré-opératoire des traitements",
    sousTitre: "",
    image: "consultation.png",
    encadres,
  });
}

function renderAnesthChirCecMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">
      
      <!-- Colonne gauche : titre + boutons -->
      <div class="intervention-main">
        <div class="hero">
          <h2>Chirurgie cardiaque sous CEC</h2>
        </div>

        <h3>Chirurgies programmées sous CEC</h3>
        <div class="grid">
          <button class="btn" onclick="renderInterventionPontages()">
            Pontages coronaires
          </button>
          <button class="btn" onclick="renderInterventionRVA()">
            RVA ou plastie aortique
          </button>
          <button class="btn" onclick="renderInterventionRVM()">
            RVM ou plastie mitrale
          </button>
          <button class="btn" onclick="renderInterventionRVT()">
            RVT ou plastie tricuspide
          </button>
          <button class="btn" onclick="renderInterventionAorteAsc()">
            Chirurgie de l’aorte ascendante (hors dissection)
          </button>
        </div>

        <h3 style="margin-top:24px;">Chirurgies urgentes et assistances circulatoires</h3>
        <div class="grid">
          <button class="btn" onclick="renderInterventionDrainagePericardique()">
            Drainage péricardique
          </button>
          <button class="btn" onclick="renderInterventionDissectionAo()">
            Dissection aortique
          </button>
          <button class="btn" onclick="renderInterventionTransplantAnesth()">
            Transplantation cardiaque
          </button>
          <button class="btn" onclick="renderInterventionAssistancesCEC()">
            Assistances circulatoires (implantation / explantation)
          </button>
        </div>
      </div>

      <!-- Colonne droite : image pleine hauteur -->
      <aside class="intervention-side">
        <img src="img/chircec2.png" alt="Chirurgie cardiaque sous CEC">
      </aside>

    </section>
  `;
}

function renderAnesthCardioStructMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + deux groupes -->
      <div class="intervention-main">
        <div class="hero">
          <h2>Cardiologie structurelle et rythmologie</h2>
        </div>

        <!-- Groupe 1 : Cardiologie structurelle -->
        <h3>Cardiologie structurelle</h3>
        <div class="grid">
          <button class="btn" onclick="renderInterventionTAVI()">
            TAVI
          </button>

          <button class="btn" onclick="renderInterventionMitraClip()">
            Mitra-clip
          </button>

          <button class="btn" onclick="renderInterventionFOPCIA()">
            Fermeture FOP / CIA
          </button>
        </div>

        <!-- Groupe 2 : Rythmologie interventionnelle -->
        <h3 style="margin-top:24px;">Rythmologie interventionnelle</h3>
        <div class="grid">
          <button class="btn" onclick="renderInterventionPacemakerDAI()">
            Pacemaker &amp; DAI
          </button>

          <button class="btn" onclick="renderInterventionAblationDroit()">
            Ablations du cœur droit
          </button>

          <button class="btn" onclick="renderInterventionAblationGauche()">
            Ablations du cœur gauche
          </button>
        </div>
      </div>

      <!-- Colonne droite : grande image verticale -->
      <aside class="intervention-side">
        <img src="img/cardiostruct2.png" alt="Cardiologie structurelle et rythmologie">
      </aside>

    </section>
  `;
}


function renderAnesthVasculaire() {
  $app.innerHTML = `
    <section>
      ${sectionHeader("Chirurgie vasculaire", "vasculaire.png")}
      <p>Contenu à insérer à partir du tableau “Chirurgie vasculaire”.</p>
    </section>
  `;
}

function renderAnesthRadioVasculaire() {
  $app.innerHTML = `
    <section>
      ${sectionHeader("Radiologie interventionnelle", "radiovasc.png")}
      <p>Contenu à insérer à partir du tableau “Radio-vasculaire”.</p>
    </section>
  `;
}

// =====================================================================
//  ANESTHÉSIE – ANTIBIOPROPHYLAXIE
// =====================================================================

const ANTIBIOPRO_DATA = {
  orderSpecialites: [
    "Digestif","Orthopédie","Urologie","Gynécologie","Cardiaque",
    "Thoracique","Vasculaire","Neurochirurgie","Ophtalmologie",
    "ORL","Maxillo-facial","Plastique"
  ],
  // v1 : on ne renseigne que Digestif ; les autres seront ajoutées ensuite
  Digestif: {
    // Types (sections du tableau)
    "Chirurgies œsophagiennes": {
      interventions: {
        "Œsophagectomie": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Excision de tumeur œsophagienne": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Traitement de diverticule œsophagien": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
      }
    },

    "Chirurgies gastriques": {
      interventions: {
        "Gastrectomie totale/partielle": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Sleeve": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Bypass gastrique": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Mise en place d’un anneau gastrique": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Retrait d’anneau gastrique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies des voies biliaires": {
      interventions: {
        "Cholécystectomie coelioscopique à bas risque": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Cholécystectomie à haut risque (laparotomie ou coelio)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Ablation de calcul de la VBP": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Pose de prothèse biliaire": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Anastomose bilio-digestive": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si > 2 h, puis q2h).",
          allergy:   "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        }
      }
    },

    "Chirurgies hépatiques": {
      interventions: {
        "Résections atypiques du foie (laparo/ coelio)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Segmentectomie hépatique (laparo/ coelio)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Lobectomie hépatique (droite/gauche)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Résection de kystes hépatiques (hydatique, péri-kystectomie, dôme saillant)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Transplantation hépatique": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si > 2 h, puis q2h). (Adapter au portage rectal BLSE et aux ATCD fongiques.)",
          allergy:   "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        }
      }
    },

    "Splénectomie": {
      interventions: {
        "Splénectomie (programmée/urgence, laparo/coelio)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        }
      }
    },

    "Chirurgies pancréatiques": {
      interventions: {
        "Pancréatectomie avec conservation du duodénum (gauche/totale/isthmectomie)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "DPC/DPT sans drainage biliaire": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si > 2 h, puis q2h).",
          allergy:   "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "DPC/DPT avec drainage biliaire et/ou sphinctérotomie": {
          noAllergy: "Pipéracilline–Tazobactam 4 g IVL (réinjection 4 g q4h).",
          allergy:   "Discuter Aztréonam/Ciprofloxacine + Métronidazole + Vancomycine."
        },
        "Transplantation pancréatique": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si > 2 h, puis q2h). (Adapter au portage rectal BLSE et ATCD fongiques.)",
          allergy:   "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        }
      }
    },

    "Chirurgie de paroi": {
      interventions: {
        "Cure de hernie inguinale/crurale avec prothèse (ouverte ou coelio)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis q4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis q2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Hernie sans prothèse": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Endoscopies digestives hautes": {
      interventions: {
        "Gastroscopie diagnostique/ thérapeutique (mucosectomie, dilatation, prothèse, clips…)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Ligature de varices oeso-gastriques en période hémorragique": {
          noAllergy: "Ceftriaxone 1 g/j IV pendant 7 jours (ou Ciprofloxacine 400 mg IVL ×2/j 7 jours si non cirrhotique).",
          allergy:   "Ciprofloxacine 400 mg IVL ×2/j pendant 7 jours (à discuter si cirrhose Child B/C)."
        },
        "Pose de gastrostomie (PEG)": {
          noAllergy: "Céfazoline 2 g IVL — dose unique.",
          allergy:   "Vancomycine 20 mg/kg IVL."
        },
        "Ponction sous écho-endoscopie": {
          noAllergy: "Uniquement si lésion kystique: Céfoxitine 2 g IVL — dose unique.",
          allergy:   "Uniquement si lésion kystique: Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL (si antibioprophylaxie indiquée)."
        },
        "CPRE": {
          noAllergy: "Uniquement si drainage incomplet: Céfoxitine 2 g IVL — dose unique.",
          allergy:   "Uniquement si drainage incomplet: Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL (si antibioprophylaxie indiquée)."
        }
      }
    },

    "Endoscopie digestive basse": {
      interventions: {
        "Coloscopie diagnostique ou thérapeutique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Radiologie interventionnelle digestive": {
      interventions: {
        "Embolisation hépatique / chimio-embolisation": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "TIPS": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Drainage biliaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    }
  },

  Orthopédie: {
    "Chirurgie programmée du membre inférieur": {
      interventions: {
        "Prothèse de hanche ou de genou (y compris reprise, si non septique et précoce)": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "1ère intention : Clindamycine 900 mg IVL. 2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL (à privilégier si prothèse de hanche par voie antérieure)."
        },
        "Gestes osseux avec pose de matériel (clou, vis, plaque, arthrodèse…)": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "1ère intention : Clindamycine 900 mg IVL. 2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Résection osseuse (sans matériel)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Retrait de matériel d’ostéosynthèse": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Reconstruction ligamentaire": {
  noAllergy: "Uniquement si greffon: Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
  allergy:   "Uniquement si greffon: Clindamycine 900 mg IVL (2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL)"
        },
        "Arthroscopie": {
  noAllergy: "Uniquement si pose de matériel: Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
  allergy:   "Uniquement si pose de matériel: Clindamycine 900 mg IVL (2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL)"
        },
        "Chirurgie des parties molles": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie programmée du membre supérieur": {
      interventions: {
        "Pose de prothèse (toute articulation)": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "1ère intention : Clindamycine 900 mg IVL. 2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL (à privilégier si prothèse d’épaule)."
        },
        "Chirurgie de luxation récidivante de l’épaule (avec ou sans greffon)": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "1ère intention : Clindamycine 900 mg IVL. 2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Gestes osseux avec pose de matériel (clou, vis, plaque, arthrodèse…)": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "1ère intention : Clindamycine 900 mg IVL. 2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL."
        },
        "Retrait de matériel d’ostéosynthèse": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Arthroscopie": {
  noAllergy: "Uniquement si pose de matériel: Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
  allergy:   "Uniquement si pose de matériel: Clindamycine 900 mg IVL (2ème intention : Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL)"
        },
        "Chirurgie des parties molles": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies programmées rachidiennes": {
      interventions: {
        "Chirurgie instrumentée du rachis avec mise en place de matériel": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Chirurgie du rachis sans mise en place de matériel (ou retrait de matériel)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgie du rachis percutanée avec pose de matériel": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    },

    "Traumatologie": {
      interventions: {
        "Fractures fermées — Fixateur externe ou brochage percutané": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Fractures fermées — Ostéosynthèse à foyer ouvert ou enclouage": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Fracture ouverte — Gustilo I (ouverture < 1 cm)": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Fracture ouverte — Gustilo II ou III (ouverture > 1 cm)": {
          noAllergy: "Amoxicilline/Acide clavulanique 2 g IVL (réinjection 1 g si > 2 h, puis toutes les 2 h).",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Plaie des parties molles": {
          noAllergy: "Uniquement si contamination tellurique ou morsure: Amoxicilline/Acide clavulanique 2 g IVL (réinjection 1 g si > 2 h, puis toutes les 2 h).",
          allergy: "Uniquement si contamination tellurique ou morsure: Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL"
        },
        "Plaie articulaire": {
          noAllergy: "Céfazoline 2 g IVL (réinjection 1 g si durée > 4 h, puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    }
  },

  // ======= Partie Urologie =======
  Urologie: {
    "Chirurgies prostatiques": {
      interventions: {
        "Prostatectomie totale": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Résection trans-urétrale de prostate (RTUP)": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Adénomectomie chirurgicale": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Enucléation chirurgicale (HoLEP, ThuLEP, GreenLEP, bipolaire, REZUM)": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Ultrasons focalisés (HIFU), embolisation artères prostatiques": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Biopsies prostatiques": {
          noAllergy: "Uniquement si voie trans-rectale: Fosfomycine-trométamol 3 g PO dose unique (≥2 h avant le geste) OU Ciprofloxacine 500 mg PO dose unique (≥2 h avant le geste).",
          allergy: "Uniquement si voie trans-rectale: Fosfomycine-trométamol 3 g PO dose unique (≥2 h avant le geste) OU Ciprofloxacine 500 mg PO dose unique (≥2 h avant le geste)."
        },
        "Curiethérapie prostatique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies vésicales": {
      interventions: {
        "Cystoscopie diagnostique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Résection trans-urétrale de vessie (RTUV)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Cystectomie totale/partielle quel que soit le mode de dérivation": {
          noAllergy: "Céfoxitine 2 g IVL (1 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL.",
          allergy: "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "Cure d’incontinence urinaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Injection intra-détrusorienne de toxine botulique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Cure de prolapsus": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Injection de macroplastique": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        }
      }
    },

    "Chirurgies génitales masculines": {
      interventions: {
        "Pose de prothèse pénienne": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL + Clindamycine 900 mg IVL.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Pose de prothèse testiculaire": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL + Clindamycine 900 mg IVL.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mg/kg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Chirurgie scrotale ou de la verge sans prothèse": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies des voies excrétrices urinaires": {
      interventions: {
        "Urétéroscopie diagnostique/thérapeutique, montée de sonde JJ": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Néphrostomie": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Urétrotomie, urétroplastie": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Néphrolithotomie percutanée": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Lithotritie extra-corporelle": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies rénales ou surrénaliennes": {
      interventions: {
        "Néphrectomie totale ou partielle": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Surrénalectomie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Embolisation des artères rénales": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Thermoablation de tumeurs rénales": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Transplantation rénale": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        }
      }
    },

    "Cathéter de dialyse intrapéritonéale": {
      interventions: {
        "Pose ou changement de cathéter": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée >4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si >2 h, puis toutes les 2 h) + Gentamicine 6–7 mg/kg IVL.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        }
      }
    }
  },

  // ======= Partie Gynécologie =======
  Gynécologie: {
    "Chirurgies obstétricales": {
      interventions: {
        "Cerclage du col utérin (ou ablation)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Césarienne programmée ou en urgence": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Suture du corps utérin pour rupture utérine": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Délivrance artificielle, révision post-partum": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Tamponnement intra-utérin": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Embolisation des artères utérines pour HPP": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Ligatures artérielles, hémostase pelvienne": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Hystérectomie pour complication obstétricale": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si >2 h, puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        }
      }
    },

    "Chirurgie sénologique carcinologique": {
      interventions: {
        "Tumorectomie sans curage / avec ganglion sentinelle": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Tumorectomie avec curage axillaire, reconstruction immédiate": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Mastectomie avec/sans curage, avec/sans reconstruction": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    },

    "Chirurgie sénologique esthétique": {
      interventions: {
        "Mastoplastie de réduction uni ou bilatérale": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Mastopexie pour ptose simple": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Ablation d’implant mammaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Mastoplastie ou reconstruction avec implant ou lambeau": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Autogreffe adipeuse ≥ 200 mL ou durée > 2 h": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Autogreffe adipeuse < 200 mL, + durée < 2h": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgie du mamelon": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies annexielles": {
      interventions: {
        "Coelioscopie diagnostique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Détorsion d’annexe, ligature de trompe, salpingectomie": {
          noAllergy: "Pas d’antibioprophylaxie sauf si ATCD d’endométriose, chirurgie pelvienne ou infection génitale : Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h).",
          allergy: "Pas d’antibioprophylaxie sauf si ATCD d’endométriose, chirurgie pelvienne ou infection génitale : Clindamycine 900 mg IVL si antibioprophylaxie indiquée."
        },
        "Drilling ovarien, kystectomie, ponction de kyste": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Annexectomie, ovariectomie, curage pelvien/lombo-aortique, omentectomie. Geste combiné (Debulking) ou non": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Résection d’endométriose avec atteinte rectale": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) + Métronidazole 1 g IVL.",
          allergy: "Clindamycine 900 mg IVL + Métronidazole 1 g IVL."
        }
      }
    },

    "Chirurgies utérines": {
      interventions: {
        "Hystéroscopies diagnostiques ou thérapeutiques": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgies peu invasives par voie vaginale : curetages, conisations, D.I.U…": {
          noAllergy: "",
          allergy: ""
        },
        "Hystérectomie totale (avec temps vaginal ou non)": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si >2 h, puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Hystérectomie subtotale avec temps vaginal": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si >2 h, puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Hystérectomie subtotale sans temps vaginal": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Colpectomie subtotale ou totale (avec temps vaginal ou non)": {
          noAllergy: "Céfoxitine 2 g IVL (+1 g si >2 h, puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Myomectomie": {
          noAllergy: "Pas d’antibioprophylaxie si hystéroscopique. Si laparotomie ou coelioscopie : Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL (si voie haute)."
        },
        "Cerclage de l’isthme (hors grossesse)": {
          noAllergy: "Pas d’antibioprophylaxie si voie vaginale. Si laparotomie ou coelioscopie : Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL (si voie haute)."
        },
        "Hystérorraphie, hystéroplastie": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    },

    "Chirurgie du prolapsus": {
      interventions: {
        "Hystéropexie": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h). Attention : Élargir à Céfoxitine 2 g IVL si large incision vagino-péritonéale.",
          allergy: "Clindamycine 900 mg IVL. Attention : ajout Gentamicine 6–7 mg/kg IVL si large incision vagino-péritonéale."
        },
        "Promontofixation": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h). Attention : Élargir à Céfoxitine 2 g IVL si large incision vagino-péritonéale.",
          allergy: "Clindamycine 900 mg IVL. Attention : ajout Gentamicine 6–7 mg/kg IVL si large incision vagino-péritonéale."
        },
        "Colpo-périnéorraphie": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h). Attention : Élargir à Céfoxitine 2 g IVL si large incision vagino-péritonéale.",
          allergy: "Clindamycine 900 mg IVL. Attention : ajout Gentamicine 6–7 mg/kg IVL si large incision vagino-péritonéale."
        }
      }
    },

    "Chirurgies vulvaires": {
      interventions: {
        "Vulvectomie simple": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Vulvectomie partielle ou totale avec curage inguinal/iliaque": {
          noAllergy: "Céfazoline 2 g IVL (+1 g si >4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g si durée >2 h puis toutes les 2h).",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Nymphoplastie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Vulvo-périnéoplastie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Exérèse de lésions superficielles": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies vaginales": {
      interventions: {
        "Résection de cloison vaginale": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgies de l’hymen": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Destruction de lésions vaginales": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "PMA": {
      interventions: {
        "Ponction d’ovocytes, transfert d’embryon": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "IVG / IMG": {
      interventions: {
        "Révision utérine, aspiration 1er ou 2e trimestre": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Embolisation": {
      interventions: {
        "Fibromes utérins, varices pelviennes, hémorragie du post-partum": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    }
  },

  // ======= Partie Cardiaque =======
  Cardiaque: {
    "Chirurgie cardiaque (hors transplantation/assistances)": {
      interventions: {
        "Actes thérapeutiques des parois, des cavités et de la crosse aortique avec ou sans CEC": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée > 4 h, puis toutes les 4 h) + 1 g lors du priming si CEC OU Céfuroxime 1,5 g IVL (0,75 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Drainage péricardique par thoracotomie / sternotomie, fenêtre pleuro-/péritonéo-péricardique": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Reprise pour hémostase postopératoire": {
          noAllergy: "Céfazoline 2 g IVL (1 g si durée > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        }
      }
    },

    "Transplantation cardiaque": {
      interventions: {
        "Transplantation cardiaque (patient venant du domicile sans assistance, ou LVAD sans contexte de réanimation)": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Transplantation cardiaque avec assistance avec contexte infectieux et/ou réanimation": {
          noAllergy: "Adaptation individuelle après avis infectiologique selon antécédents et colonisation (SARM / E-BLSE).",
          allergy:   "Adaptation individuelle après avis infectiologique selon antécédents et colonisation (SARM / E-BLSE)."
        }
      }
    },

    "Assistances circulatoires": {
      interventions: {
        "Assistance circulatoire de courte durée percutanée (ECMO, Impella, CPIA, etc.)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Assistance circulatoire de courte durée avec abord chirurgical (ECMO, Impella..)": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Assistance circulatoire gauche de longue durée (LVAD) ou cœur artificiel sans hospitalisation en réanimation": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h, puis toutes les 4 h) OU Céfuroxime 1,5 g IVL (0,75 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Assistance circulatoire gauche de longue durée (LVAD) ou cœur artificiel hospitalisé en réanimation (avec ou sans ECMO préopératoire)": {
          noAllergy: "Adaptation individuelle après avis infectiologique selon antécédents et colonisation (SARM / E-BLSE).",
          allergy:   "Adaptation individuelle après avis infectiologique selon antécédents et colonisation (SARM / E-BLSE)."
        }
      }
    },

    "Cardiologie interventionnelle structurelle": {
      interventions: {
        "TAVI": {
          noAllergy: "Amoxicilline–acide clavulanique 2 g IVL (1 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "MitraClip": {
          noAllergy: "Amoxicilline–acide clavulanique 2 g IVL (1 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Fermeture de CIA/FOP percutanée": {
          noAllergy: "Amoxicilline–acide clavulanique 2 g IVL (1 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Fermeture de l’auricule percutanée": {
          noAllergy: "Amoxicilline–acide clavulanique 2 g IVL (1 g si > 2 h, puis toutes les 2 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        }
      }
    },

    "Rythmologie interventionnelle": {
      interventions: {
        "Implantation ou changement de prothèse rythmique (stimulateur, défibrillateur, changement de sonde)": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h, puis toutes les 4 h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL."
        },
        "Exploration électrophysiologique ou ablation de trouble du rythme (radiofréquence, cryothérapie, etc.)": {
          noAllergy: "Pas d’antibioprophylaxie. (Sauf si prothèse intracardiaque rythmique ou non déjà implantée : Céfazoline 2 g IVL (1 g si > 4 h, puis toutes les 4 h).)",
          allergy:   "Pas d’antibioprophylaxie. (Si antibioprophylaxie indiquée : Vancomycine 20 mg/kg IVL ou teicoplanine 12 mk/kg IVL.)"
        }
      }
    }
  },

  // ======= Partie Thoracique =======
  Thoracique: {
    "Chirurgie d’exérèse pulmonaire (thoracotomie ou cervico-thoracotomie)": {
      interventions: {
        "Lobectomie ou segmentectomie": {
          noAllergy: "Amoxicilline–Acide clavulanique 2 g IVL (+1 g si durée > 2 h, puis toutes les 2h) privilégier si BPCO OU Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Pneumonectomie et pleuro-pneumonectomie": {
          noAllergy: "Amoxicilline–Acide clavulanique 2 g IVL (+1 g si durée > 2 h, puis toutes les 2h) privilégier si BPCO OU Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Résection de bulle / Exérèse de kyste hydatique": {
          noAllergy: "Amoxicilline–Acide clavulanique 2 g IVL (+1 g si durée > 2 h, puis toutes les 2h) privilégier si BPCO OU Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        }
      }
    },

    "Chirurgies médiastinales, pleurales, pariétales": {
      interventions: {
        "Chirurgie du médiastin": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Chirurgie de pneumothorax": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Chirurgie de la plèvre (hors infection)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Chirurgie de la paroi thoracique (avec ou sans matériel)": {
  noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
  allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Médiastinoscopie ou thoracoscopie (avec ou sans biopsie)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Drainage thoracique (tunnellisé ou non)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie des voies aériennes sous-glottiques": {
      interventions: {
        "Trachéotomie chirurgicale": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Résection-anastomose bronchique ou trachéale (toutes localisations)": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Plastie, autogreffe, lambeau ou prothèse trachéale": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Fermeture de plaie ou fistule bronchique": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Résection thyro- ou crico-trachéale": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Trachéotomie percutanée": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgies œsophagiennes": {
      interventions: {
        "Œsophagectomie": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        },
        "Excision de tumeur œsophagienne": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        },
        "Traitement de diverticule œsophagien": {
          noAllergy: "Céfazoline 2 g IVL (+1 g > 4 h, puis toutes les 4h) OU Céfuroxime 1,5 g IVL (+0,75 g > 2 h, puis toutes les 2h).",
          allergy:   "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        }
      }
    },

    "Radiologie interventionnelle thoracique": {
      interventions: {
        "Ponction, biopsie, drainage": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Injection intrabronchique ou intrapulmonaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Radiofréquence bronchopulmonaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Endoscopies trachéo-bronchiques": {
      interventions: {
        "Fibroscopie diagnostique : simple, lavage broncho-alvéolaire, écho-endoscopie bronchique avec ponction (EBUS)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Fibroscopie thérapeutique : Dilatation, laser, cryothérapie, bronchoscopie rigide": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Pose de stent ou prothèse trachéo-bronchique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Pose de valves Zéphyr pour emphysème sévère": {
          noAllergy: "Amoxicilline/Clavulanate 1 g IVL 1 h avant + 1 g × 4/j PO pendant 48 h.",
          allergy:   "Pristinamycine 1 g PO 1 h avant + 1 g × 2/j pendant 48 h."
        }
      }
    },

    "Transplantation pulmonaire": {
      interventions: {
        "Transplantation pulmonaire": {
          noAllergy: "Adaptation selon le protocole local : épidémiologie, contexte infectieux, portage, colonisation.",
          allergy:   "Adaptation selon le protocole local : épidémiologie, contexte infectieux, portage, colonisation."
        }
      }
    }
  },

  // ======= Partie Vasculaire =======
  Vasculaire: {
    "Chirurgie artérielle ouverte": {
      interventions: {
        "Chirurgie artérielle périphérique ou aortique, avec ou sans mise en place de matériel": {
          noAllergy: "Céfazoline 2 g IVL → réinjection 1 g si durée > 4 h puis toutes les 4 h OU Céfuroxime 1,5 g IVL → réinjection 0,75 g si > 2 h puis toutes les 2 h.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        },
        "Chirurgie carotidienne avec mise en place de matériel": {
          noAllergy: "Céfazoline 2 g IVL → réinjection 1 g si durée > 4 h puis toutes les 4 h OU Céfuroxime 1,5 g IVL → réinjection 0,75 g si > 2 h puis toutes les 2 h.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        },
        "Chirurgie carotidienne sans mise en place de matériel": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie veineuse superficielle": {
      interventions: {
        "Varices sans abord chirurgical du Scarpa": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Varices avec abord chirurgical du Scarpa": {
          noAllergy: "Céfazoline 2 g IVL → réinjection 1 g si durée > 4 h puis toutes les 4 h OU Céfuroxime 1,5 g IVL → réinjection 0,75 g si > 2 h puis toutes les 2 h.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        },
        "Toute chirurgie veineuse profonde ouverte": {
          noAllergy: "Céfazoline 2 g IVL → réinjection 1 g si durée > 4 h puis toutes les 4 h OU Céfuroxime 1,5 g IVL → réinjection 0,75 g si > 2 h puis toutes les 2 h.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        }
      }
    },

    "Fistule artério-veineuse (FAV)": {
      interventions: {
        "Création/reprise sans mise en place de matériel": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Création/reprise avec mise en place de matériel": {
          noAllergy: "Céfazoline 2 g IVL → réinjection 1 g si durée > 4 h puis toutes les 4 h OU Céfuroxime 1,5 g IVL → réinjection 0,75 g si > 2 h puis toutes les 2 h.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        }
      }
    },

    "Procédures endovasculaires": {
      interventions: {
        "Stent couvert ou endoprothèse": {
          noAllergy: "Céfazoline 2 g IVL → réinjection 1 g si durée > 4 h puis toutes les 4 h OU Céfuroxime 1,5 g IVL → réinjection 0,75 g si > 2 h puis toutes les 2 h.",
          allergy: "Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL."
        },
        "Stent nu ou pas de matériel": {
          noAllergy: "Uniquement si facteurs de risque d'infection*: Céfazoline 2 g IVL → réinjection 1 g si durée > 4 h puis toutes les 4 h OU Céfuroxime 1,5 g IVL → réinjection 0,75 g si > 2 h puis toutes les 2 h (* Facteurs de risque d’infection : passage de guides à travers prothèses/stents préexistants, cathéter de radiologie interventionnelle en place > 6 h, réintervention < 7 jours, trouble trophique veineux/artériel ne nécessitant pas d’antibiothérapie).",
          allergy: "Uniquement si facteurs de risque d'infection*: Vancomycine 20 mg/kg IVL ou Teicoplanine 12 mk/kg IVL (* Facteurs de risque d’infection : passage de guides à travers prothèses/stents préexistants, cathéter de radiologie interventionnelle en place > 6 h, réintervention < 7 jours, trouble trophique veineux/artériel ne nécessitant pas d’antibiothérapie)."
        }
      }
    },

    "Amputation de membre": {
      interventions: {
        "Amputation hors contexte septique": {
          noAllergy: "Amoxicilline/Acide clavulanique 2 g IVL → réinjection 1 g si > 2 h puis toutes les 2 h ; puis 50 mg/kg/j en 3–4 injections IVL pendant 48 h.",
          allergy: "Clindamycine 600 mg IVL toutes les 6 h pendant 48 h + Gentamicine 6–7 mg/kg IVL."
        },
        "Amputation en contexte septique": {
          noAllergy: "Adaptation individuelle après avis infectiologique selon documentations et colonisations.",
          allergy: "Adaptation individuelle après avis infectiologique selon documentations et colonisations."
        }
      }
    }
  },

  // ======= Partie Neurochirurgie =======
  Neurochirurgie: {
    "Craniotomies": {
      interventions: {
        "Craniotomie": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        },
        "Ventriculoscopie, visiochirurgie intracrânienne": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        },
        "Biopsie cérébrale": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie trans-sphénoïdale / trans-labyrinthique": {
      interventions: {
        "Chirurgie intracrânienne par voie trans-sphénoïdale ou trans-labyrinthique": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        }
      }
    },

    "Dérivation ventriculaire": {
      interventions: {
        "Dérivation ventriculaire externe (DVE) ou dérivation lombaire externe (DLE)": {
          noAllergy: "Aucune.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Dérivation ventriculo-péritonéale (DVP) ou ventriculo-atriale (DVA)": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        }
      }
    },

    "Plaies/fractures cranio-cérébrales": {
      interventions: {
        "Plaies cranio-cérébrales pénétrantes ou non": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL, réinjection 1 g si durée > 2 h, puis toutes les 2 h.",
          allergy:   "Triméthoprime/Sulfaméthoxazole 160 mg/800 mg IVL (pas de réinjection)."
        },
        "Fracture base du crâne avec ou sans otorrhée": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie rachidienne": {
      interventions: {
        "Chirurgie instrumentée du rachis avec mise en place de matériel": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        },
        "Chirurgie du rachis sans mise en place de matériel (ou retrait de matériel)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Chirurgie du rachis percutanée avec pose de matériel": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        }
      }
    },

    "Stimulation cérébrale / médullaire": {
      interventions: {
        "Pose d’électrode de stimulation cérébrale ou médullaire": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        },
        "Pose de pompe médullaire": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        },
        "Pose de stimulateur médullaire": {
          noAllergy: "Céfazoline 2 g IVL, réinjection 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy:   "Clindamycine 900 mg IVL."
        }
      }
    },

    "Neuroradiologie interventionnelle": {
      interventions: {
        "Angiographie diagnostique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Angiographie interventionnelle (pose de stent, endoprothèse ou embolisation)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    }
  },

  // ======= Partie Ophtalmologie =======
  Ophtalmologie: {
    "Chirurgie du globe oculaire": {
      interventions: {
        "Chirurgie de la cataracte (simple ou combinée)": {
          noAllergy: "Céfuroxime 1 mg/0,1 mL intra-oculaire — dose unique en fin d’intervention.",
          allergy:   "Moxifloxacine 0,480 mg/0,3 mL intra-oculaire — dose unique en fin d’intervention."
        },
        "Chirurgies de la cornée, du glaucome, de la rétine et du vitré": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Traumatismes à globe ouvert": {
          noAllergy: "Vancomycine 1 mg/0,1 mL + Ceftazidime 2,25 mg/0,1 mL — dose unique en fin d’intervention.",
          allergy:   "Vancomycine 1 mg/0,1 mL + Amikacine 0,2 mg/0,1 mL — dose unique en fin d’intervention."
        }
      }
    },

    "Chirurgie péri-oculaire": {
      interventions: {
        "Chirurgie des paupières": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Chirurgie des voies lacrymales": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Chirurgie du strabisme ou de l’orbite": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    }
  },

  // ======= Partie ORL =======
  ORL: {
    "Chirurgie rhino-sinusienne": {
      interventions: {
        "Chirurgie sinusienne de polypose ou sinusite chronique (méatotomie, éthmo/sphénoïdectomie…)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgie rhinologique sans mise en place de greffon": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgie rhinologique avec greffon ou reprise chirurgicale": {
          noAllergy: "Céfazoline 2 g IVL, 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy: "Clindamycine 900 mg IVL."
        },
        "Chirurgie sinusienne tumorale": {
          noAllergy: "Céfazoline 2 g IVL, 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    },

    "Chirurgie carcinologique cervico-faciale": {
      interventions: {
        "Chirurgie carcinologique avec lambeau libre ou pédiculé cervico-facial": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL, 1 g si durée > 2 h, puis toutes les 2 h. Poursuivre 1 g/6 h postopératoire pendant 48 h.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        },
        "Chirurgie carcinologique sans reconstruction (laryngectomie, pharyngo-laryngectomie, etc.)": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL, 1 g si durée > 2 h, puis toutes les 2 h.",
          allergy: "Clindamycine 900 mg IVL + Gentamicine 6–7 mg/kg IVL."
        }
      }
    },

    "Chirurgie amygdalienne et adénoïdectomie": {
      interventions: {
        "Amygdalectomie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Adénoïdectomie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Cervicotomies": {
      interventions: {
        "Curage cervical": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Thyroïdectomie totale": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Thyroïdectomie partielle": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Parathyroïdectomie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Trachéotomie percutanée": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Trachéotomie chirurgicale": {
          noAllergy: "Céfazoline 2 g IVL, 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    },

    "Chirurgie des glandes salivaires": {
      interventions: {
        "Chirurgie des glandes salivaires sans accès par la cavité bucco-pharyngée": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgie des glandes salivaires avec accès par la cavité bucco-pharyngée": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL, 1 g si durée > 2 h, puis toutes les 2 h.",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    },

    "Laryngoscopie en suspension": {
      interventions: {
        "Laryngoscopie en suspension diagnostique sans ou avec biopsies": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Laryngoscopie en suspension avec geste thérapeutique (laser…)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie otologique": {
      interventions: {
        "Chirurgie des tympans": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgie des chaînes ossiculaires": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Chirurgie de cholestéatome (non infecté)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Implants cochléaires": {
          noAllergy: "Céfazoline 2 g IVL, 1 g si durée > 4 h, puis toutes les 4 h.",
          allergy: "Clindamycine 900 mg IVL."
        }
      }
    }
  },

  // ======= Partie Maxillo-facial =======
  "Maxillo-facial": {
    "Chirurgie orthognatique": {
      interventions: {
        "Chirurgie orthognatique": {
          noAllergy: "Céfazoline 2 g IVL, 1 g si durée > 4 h, puis toutes les 4 h ; 1 g/6 h postop pendant 48 h.",
          allergy:   "Clindamycine 900 mg IVL."
        },
        "Ablation de matériel": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie alvéolo-dentaire": {
      interventions: {
        "Extraction de dents incluses ou ectopiques": {
          noAllergy: "Amoxicilline 2 g IVL, 1 g si durée > 2 h, puis toutes les 2 h.",
          allergy:   "Clindamycine 900 mg IVL."
        },
        "Autres extraction dentaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Pose de matériel orthodontique": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Chirurgie apicale": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        },
        "Chirurgie alvéolaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy:   "Pas d’antibioprophylaxie."
        }
      }
    },

    "Traumatologie maxillo-faciale (fractures simples ou complexes, ouvertes ou non)": {
      interventions: {
        "Traumatologie maxillo-faciale": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL, 1 g si durée > 2 h, puis toutes les 2 h ; 1 g/6 h postop pendant 24 h.",
          allergy:   "Céfazoline 2 g IVL."
        }
      }
    }
  },

  // ======= Partie Plastique =======
  Plastique: {
    "Chirurgie mammaire plastique ou carcinologique": {
      interventions: {
        "Augmentation mammaire sans pose d’implant (Lipofilling)": {
          noAllergy: "Uniquement si > 200 mL OU durée > 2 h : Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h)",
          allergy: "Uniquement si > 200 mL OU durée > 2 h : Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL"
        },
        "Augmentation mammaire avec pose d’implant": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Gonflage expandeur": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Réduction mammaire et exérèse de gynécomastie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Mastopexie pour ptose simple": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Tumorectomie sans curage (ou ganglion sentinelle)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Tumorectomie avec curage": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Mastectomie (avec ou sans curage, avec ou sans reconstruction immédiate)": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        }
      }
    },

    "Chirurgie de silhouette": {
      interventions: {
        "Brachioplastie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Cruroplastie": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Abdominoplastie": {
          noAllergy: "Uniquement si durée > 2h: Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h)",
          allergy: "Uniquement si durée > 2h: Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL"
        },
        "Body-lift": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Lipoaspiration sous AG ou AL": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie de la tête et du cou": {
      interventions: {
        "Otoplastie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Blépharoplastie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Lifting cervico-facial": {
          noAllergy: "Uniquement si durée > 2h: Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h)",
          allergy: "Uniquement si durée > 2h: Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL"
        },
        "Septo-rhinoplastie": {
          noAllergy: "Uniquement si greffon: Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h)",
          allergy: "Uniquement si greffon: Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL"
        },
        "Implants faciaux": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Frontoplastie": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Génioplastie (avec ou sans implants)": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL (1 g si > 2 h puis toutes les 2 h).",
          allergy: "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "Chirurgie ortho-gnatique": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL (1 g si > 2 h puis toutes les 2 h), puis 1 g/6 h pendant 48 h post-opératoire.",
          allergy: "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "Auto-greffe capillaire et réimplantation": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Lambeau facial avec abord endo-oral": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL (1 g si > 2 h puis toutes les 2 h).",
          allergy: "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "Lambeau facial avec abord extra-oral": {
          noAllergy: "Uniquement si durée > 2h: Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h)",
          allergy: "Uniquement si durée > 2h: Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL"
        }
      }
    },

    "Chirurgie générale et carcinologique (hors tête et cou)": {
      interventions: {
        "Transfert adipeux": {
          noAllergy: "Uniquement si > 200mL OU durée > 2h: Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h)",
          allergy: "Uniquement si > 200mL OU durée > 2h: Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL"
        },
        "Greffe cutanée (hors brûlure)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Pose de substitut dermique": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Pose de prothèse pour expansion cutanée": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Lambeaux libres microchirurgicaux ou pédiculés": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Plasties et tumorectomies cutanées": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Curage ganglionnaire inguinal ou axillaire seul (ou ganglion sentinelle)": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie d’affirmation de genre": {
      interventions: {
        "Prothèses péniennes et testiculaires": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Vaginoplasties sans segment intestinal": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL (1 g si > 2 h puis toutes les 2 h).",
          allergy: "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "Vaginoplasties avec création de néo-vagin par segment intestinal": {
          noAllergy:
            "La veille au soir : Tobramycine 200 mg + Métronidazole 1 g PO<br><br>Per-opératoire : Céfoxitine 2 g IVL (puis 1 g si durée > 2 h puis toutes les 2 h)",
          allergy: "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "Phalloplastie": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Métoïdioplastie": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Chondro-laryngoplastie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        }
      }
    },

    "Chirurgie du patient brûlé": {
      interventions: {
        "Pansement initial ou secondaire sans geste chirurgical": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Escarrotomie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Aponévrotomie": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Excision de brûlure avec ou sans couverture temporaire": {
          noAllergy: "Pas d’antibioprophylaxie.",
          allergy: "Pas d’antibioprophylaxie."
        },
        "Autogreffe cutanée": {
          noAllergy: "Pas d’antibioprophylaxie (à discuter selon colonisations/infections).",
          allergy: "Pas d’antibioprophylaxie (à discuter selon colonisations/infections)."
        },
        "Greffe de matrice cutanée artificielle": {
          noAllergy: "Céfazoline 2 g IVL (1 g si > 4 h puis toutes les 4 h).",
          allergy: "Clindamycine 900 mg IVL OU Vancomycine 20 mg/kg IVL OU Teicoplanine 12 mg/kg IVL."
        },
        "Amputation": {
          noAllergy: "Amoxicilline/Clavulanate 2 g IVL (1 g si > 2 h puis toutes les 2 h).",
          allergy: "Gentamicine 6–7 mg/kg IVL + Métronidazole 1 g IVL."
        },
        "Lambeaux à pédicule ou vascularisation transitoire": {
          noAllergy: "Antibioprophylaxie adaptée à la flore et au risque du patient (avis infectieux).",
          allergy: "Antibioprophylaxie adaptée à la flore et au risque du patient (avis infectieux)."
        }
      }
    }
  },
};

// ===== Page Antibioprophylaxies per-opératoire (formulaire à 3 sélections)
function renderAntibioproForm() {
  const $app = document.getElementById("app");

  // Libellés longs demandés (clé interne -> libellé affiché)
  const SPEC_ORDER = [
    { key: "Digestif",       label: "Chirurgie viscérale et digestive" },
    { key: "Orthopédie",     label: "Chirurgie orthopédique et traumatologique" },
    { key: "Urologie",       label: "Chirurgie urologique" },
    { key: "Gynécologie",    label: "Chirurgie gynécologique et obstétricale" },
    { key: "Cardiaque",      label: "Chirurgie cardiaque et cardiologie interventionnelle" },
    { key: "Thoracique",     label: "Chirurgie thoracique" },
    { key: "Vasculaire",     label: "Chirurgie vasculaire" },
    { key: "Neurochirurgie", label: "Neurochirurgie" },
    { key: "Ophtalmologie",  label: "Chirurgie ophtalmologique" },
    { key: "ORL",            label: "Chirurgie ORL" },
    { key: "Maxillo-facial", label: "Chirurgie maxillo-faciale" },
    { key: "Plastique",      label: "Chirurgie plastique et reconstructrice" }
  ].filter(s => ANTIBIOPRO_DATA[s.key]); // ne garder que celles présentes dans les données

  // HTML
  $app.innerHTML = `
    <div class="page page-antibiopro">
      <span class="title-badge">Antibioprophylaxies per-opératoire</span>

      <div class="card hero">
        <img src="./img/antibioprophylaxie.png" alt="Antibioprophylaxie per-opératoire" onerror="this.style.display='none'">
      </div>

      <form class="form" onsubmit="return false;">
        <fieldset>
          <legend>Spécialité chirurgicale</legend>
          <select id="sel-specialite">
            <option value="">— Choisir —</option>
            ${SPEC_ORDER.map(s => `<option value="${s.key}">${s.label}</option>`).join("")}
          </select>
        </fieldset>

        <fieldset>
          <legend>Type d’intervention</legend>
          <select id="sel-type" disabled>
            <option value="">— Choisir —</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Intervention</legend>
          <select id="sel-intervention" disabled>
            <option value="">— Choisir —</option>
          </select>
        </fieldset>

        <label class="checkbox">
          <input type="checkbox" id="chk-allergie">
          Allergie aux β-lactamines
        </label>

        <div class="actions">
          <button class="btn outline" id="btn-run">Antibioprophylaxie recommandée</button>
          <button class="btn ghost" type="button" onclick="history.back()">← Retour</button>
        </div>
      </form>

      <div id="result" class="result" style="display:none;"></div>
      <div id="result-note" class="muted" style="display:none; margin-top:.5rem;">
        <small>Doubler la posologie de β-lactamines uniquement si IMC > 50 kg/m²</small>
      </div>
    </div>
  `;

  // Références DOM
  const $selSpec   = document.getElementById("sel-specialite");
  const $selType   = document.getElementById("sel-type");
  const $selInterv = document.getElementById("sel-intervention");
  const $chkAllerg = document.getElementById("chk-allergie");
  const $btnRun    = document.getElementById("btn-run");
  const $res       = document.getElementById("result");
  const $note      = document.getElementById("result-note");

  // Helpers
  const resetType = () => {
    $selType.innerHTML = `<option value="">— Choisir —</option>`;
    $selType.disabled = true;
  };
  const resetInterv = () => {
    $selInterv.innerHTML = `<option value="">— Choisir —</option>`;
    $selInterv.disabled = true;
  };
  const clearResult = () => {
    $res.style.display = "none";
    $res.innerHTML = "";
    $note.style.display = "none";
  };

  // Spécialité -> Types
  $selSpec.addEventListener("change", () => {
    clearResult();
    resetType();
    resetInterv();

    const specKey = $selSpec.value;
    if (!specKey) return;

    const typesObj = ANTIBIOPRO_DATA[specKey] || {};
    const types = Object.keys(typesObj);

    types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      $selType.appendChild(opt);
    });
    $selType.disabled = types.length === 0;
  });

  // Type -> Interventions
  $selType.addEventListener("change", () => {
    clearResult();
    resetInterv();

    const specKey = $selSpec.value;
    const type = $selType.value;
    if (!specKey || !type) return;

    const intervsObj = ANTIBIOPRO_DATA[specKey]?.[type]?.interventions || {};
    const intervs = Object.keys(intervsObj);

    intervs.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      $selInterv.appendChild(opt);
    });
    $selInterv.disabled = intervs.length === 0;
  });

  // Bouton : afficher la recommandation
$btnRun.addEventListener("click", () => {
  const specKey = $selSpec.value;
  const type    = $selType.value;
  const interv  = $selInterv.value;

  if (!specKey || !type || !interv) {
    $res.style.display = "block";
    $res.innerHTML = `
      <div class="info-card"><div class="info-content">
        Merci de sélectionner <strong>Spécialité</strong>, <strong>Type</strong> et <strong>Intervention</strong>.
      </div></div>`;
    $note.style.display = "none";
    return;
  }

  const node = ANTIBIOPRO_DATA[specKey]?.[type]?.interventions?.[interv];
  const text = node ? ($chkAllerg.checked ? (node.allergy || "—") : (node.noAllergy || "—")) : null;

  $res.style.display = "block";
  $res.innerHTML = text ? `
    <div class="info-card">
      <div class="info-content">${text}</div>
    </div>` : `
    <div class="info-card"><div class="info-content">
      Aucune recommandation trouvée pour cette intervention.
    </div></div>`;

  // 🔹 Ajout conditionnel uniquement pour "Chirurgie cardiaque et cardiologie interventionnelle"
  if (text && specKey === "Cardiaque") {
    $res.innerHTML += `
      <div class="muted" style="margin-top: 0.75rem; font-size: 0.9rem; line-height: 1.4;">
        <em>Si chirurgie cardiaque et portage nasal de <i>S. aureus</i> : décolonisation par mupirocine 2 % (2×/j) + décontamination oropharyngée à la chlorhexidine. Débuter ≥ 48 h avant la chirurgie (durée totale : 5–7 j).</em>
      </div>
    `;
  }

  $note.style.display = text ? "block" : "none";
});
}

function renderInterventionPage({ titre, sousTitre = "", encadres, image = null }) {
  const encadresHtml = encadres
    .map(
      (box) => `
      <details class="card">
  <summary><strong>${box.titre}</strong></summary>
  <div class="card-body">
      ${box.html}
  </div>
</details>
    `
    )
    .join("");

  // Cas avec image : mise en page 2 colonnes (contenu à gauche, image à droite)
  if (image) {
    $app.innerHTML = `
      <section class="intervention-shell ${image ? 'anesth-intervention' : ''}">
        <div class="intervention-main">
          <div class="hero">
            <h2 data-title="${titre}">${titre}</h2>
            ${sousTitre ? `<h3>${sousTitre}</h3>` : ""}
          </div>
          ${encadresHtml}
        </div>

        <aside class="intervention-side">
          <img src="img/${image}" alt="${titre}">
        </aside>
      </section>
    `;
    return;
  }

  // Cas sans image : ancien comportement (une seule colonne)
  $app.innerHTML = `
    <section>
      <div class="hero">
        <h2 data-title="${titre}">${titre}</h2>
        ${sousTitre ? `<h3>${sousTitre}</h3>` : ""}
      </div>
      ${encadresHtml}
    </section>
  `;
}


function expandPatientCharacteristics() {
  // On cible tous les <details class="card">
  const blocks = document.querySelectorAll("details.card");

  blocks.forEach((block) => {
    const summary = block.querySelector("summary");
    if (!summary) return;

    const titleText = summary.textContent.trim().toLowerCase();

    // On ouvre si le titre contient l’une des expressions suivantes
    if (
      titleText.includes("caractéristiques patient") ||
      titleText.includes("intervention chirurgicale")
    ) {
      block.open = true;
    }
  });
}

function setupAnesthGlobalDoseLogic() {
  const poidsInput = document.getElementById("anesth-poids"); // ← adapte à l’id réel de ton champ poids
  if (!poidsInput) return;

  function parseNumber(el) {
    if (!el) return null;
    const v = parseFloat((el.value || "").replace(",", "."));
    return isNaN(v) ? null : v;
  }

  function updateDoses() {
    const poids = parseNumber(poidsInput);

    const doseSpans = document.querySelectorAll("[data-per-kg]");
    if (!poids) {
      doseSpans.forEach(span => {
        span.textContent = "—";
      });
      return;
    }

    doseSpans.forEach(span => {
      const perKg = parseFloat(span.getAttribute("data-per-kg"));
      const unit = span.getAttribute("data-unit") || "";
      if (isNaN(perKg)) {
        span.textContent = "—";
        return;
      }
      const dose = poids * perKg;
      // arrondi simple, tu peux adapter (Math.round, toFixed(1), etc.)
      span.textContent = `${Math.round(dose)} ${unit}`;
    });
  }

  poidsInput.addEventListener("input", updateDoses);
  updateDoses();
}


// Helpers génériques pour les calculs poids / mg/kg

function parseKg(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return null;
  const v = parseFloat((el.value || "").replace(",", "."));
  if (isNaN(v) || v <= 0) return null;
  return v;
}

function formatDoseMgPerKg(poids, mgPerKg) {
  if (!poids) return `${mgPerKg} mg/kg`;
  const dose = mgPerKg * poids;
  return `${mgPerKg} mg/kg (~${dose.toFixed(0)} mg)`;
}

function renderInterventionPontages() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <!-- ID standard pour toute la section Anesthésie -->
              <input type="number" id="anesth-poids" min="30" max="250" step="1" />
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="pc-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="pc-induction-risque" />
              Induction à risque (FEVG &lt; 35%, TC serré, HTAP)
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="pc-seq-rapide" />
              Séquence rapide
            </label>
            <label>
              <input type="checkbox" id="pc-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, KTa radial gauche, KTC 5 voies JID, BIS,
          NIRS si FdR, ETO possible, Swan-Ganz si FEVG &lt; 35% ou HTAP.
        </p>
        <p><strong>Objectif :</strong> Lent, mou, fermé.</p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="pc-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>

        <p>
          <strong>Entretien :</strong> AIVOC Propofol/Sufentanil.
        </p>

        <p id="pc-keta-text">
          Kétamine 0,5 mg/kg
          (<span data-per-kg="0.5" data-unit="mg"></span> en bolus)
          puis 0,125 mg/kg/h.
        </p>

        <p id="pc-exacyl-text">
          Exacyl 20 mg/kg
          (<span data-per-kg="20" data-unit="mg"></span>) puis 2 mg/kg/h (sauf CI).
        </p>

        <p>
          <strong>ALR :</strong> Bloc thoracique transverse,
          Ropivacaïne 3,75 mg/mL 15–20 mL x2
          (dose max 3 mg/kg ≈
            <span data-per-kg="3" data-unit="mg"></span>).
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="pc-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+ 1 g priming CEC) puis 1 g toutes les 4 h.
          </li>
          <li id="pc-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+ 2 g priming CEC) puis 2 g toutes les 4 h.
          </li>
          <li id="pc-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine
            <span id="pc-vanco-dose">30 mg/kg</span> IVL,
            en une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
  titre: "Coupes et mesures ETO",
  html: `
    ${etoHtmlFonctionVG()}
    ${etoHtmlVGSegmentaire()}
    ${etoHtmlValveAortique()}
    ${etoHtmlValveMitrale()}
    ${etoHtmlPTDVG()}
    ${etoHtmlFonctionVD()}
    ${etoHtmlHTAP()}
  `,
},
    {
      titre: "CEC",
      html: `
        <p><strong>Canulation artérielle :</strong> Aortique.</p>
        <p><strong>Canulation veineuse :</strong> Atrio-cave.</p>
        <p>
          <strong>Héparine</strong> 300–400 UI/kg
          (~<span data-per-kg="300" data-unit="UI"></span> à
             <span data-per-kg="400" data-unit="UI"></span>),
          objectif ACT &gt; 400 s.
        </p>
        <p><strong>Cardioplégie</strong> froide (K) ou chaude (K, Mg) toutes les 20–30 min.</p>
        <p><strong>Protamine</strong> 60–80 % de la dose initiale d’héparine.</p>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Pontages coronaires",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  // Calculs mg/kg globaux (Kétamine, Exacyl, Ropivacaïne, Héparine…)
  setupAnesthGlobalDoseLogic();

  // Logique spécifique pontages (induction, ATB…)
  setupPcLogic();
}

function setupPcLogic() {
  const poidsInputId = "anesth-poids";
  const cbImc = document.getElementById("pc-imc50");
  const cbRisk = document.getElementById("pc-induction-risque");
  const cbSeq = document.getElementById("pc-seq-rapide");
  const cbAllergie = document.getElementById("pc-allergie-bl");

  const indText = document.getElementById("pc-induction-text");
  const liCefaStd = document.getElementById("pc-cefazoline-standard");
  const liCefaObese = document.getElementById("pc-cefazoline-obese");
  const liVanco = document.getElementById("pc-vancomycine");
  const spanVanco = document.getElementById("pc-vanco-dose");

  function updateInduction() {
    const poids = parseKg(poidsInputId);
    let txt = "<strong>Induction :</strong> ";

    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${formatDoseMgPerKg(poids, 0.3)} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${formatDoseMgPerKg(poids, 1.2)} (séquence rapide).`;
    } else {
      txt += `Atracurium ${formatDoseMgPerKg(poids, 0.5)}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

function updateAtb() {
  const poids = parseKg(poidsInputId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liCefaStd)  liCefaStd.style.display  = "none";
    if (liCefaObese) liCefaObese.style.display = "";
  } else {
    if (liCefaStd)  liCefaStd.style.display  = "";
    if (liCefaObese) liCefaObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liCefaStd)   liCefaStd.style.display   = "none";
    if (liCefaObese) liCefaObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne Céfazoline selon IMC
    if (cbImc && cbImc.checked) {
      if (liCefaStd)  liCefaStd.style.display  = "none";
      if (liCefaObese) liCefaObese.style.display = "";
    } else {
      if (liCefaStd)  liCefaStd.style.display  = "";
      if (liCefaObese) liCefaObese.style.display = "none";
    }
  }
}


  function updateAll() {
    updateInduction();
    updateAtb();
  }

  const poidsEl = document.getElementById(poidsInputId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);

  [cbImc, cbRisk, cbSeq, cbAllergie].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionRVA() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <!-- ID standard pour toute la section Anesthésie -->
              <input type="number" id="anesth-poids" min="30" max="250" step="1" />
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="rva-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="rva-induction-risque" />
              Induction à risque (FEVG &lt; 35%, RA serré, IA sévère, HTAP)
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="rva-seq-rapide" />
              Séquence rapide
            </label>
            <label>
              <input type="checkbox" id="rva-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, KTa radial gauche, KTC 5 voies JID, BIS,
          NIRS si FdR, ETO, Swan-Ganz si FEVG &lt; 35% ou HTAP.
        </p>
        <p><strong>Objectif IA :</strong> Plein, rapide, ouvert.</p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="rva-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>

        <p>
          <strong>Entretien :</strong> AIVOC Propofol/Sufentanil.
        </p>

        <p id="rva-keta-text">
          Kétamine 0,5 mg/kg
          (<span data-per-kg="0.5" data-unit="mg"></span> en bolus)
          puis 0,125 mg/kg/h.
        </p>

        <p id="rva-exacyl-text">
          Exacyl 20 mg/kg
          (<span data-per-kg="20" data-unit="mg"></span>) puis 2 mg/kg/h (sauf CI).
        </p>

        <p>
          <strong>ALR :</strong> Bloc thoracique transverse,
          Ropivacaïne 3,75 mg/mL 15–20 mL x2
          (dose max 3 mg/kg ≈
            <span data-per-kg="3" data-unit="mg"></span>).
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="rva-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+ 1 g priming CEC) puis 1 g toutes les 4 h.
          </li>
          <li id="rva-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+ 2 g priming CEC) puis 2 g toutes les 4 h.
          </li>
          <li id="rva-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine
            <span id="rva-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
  html: `
    ${etoHtmlFonctionVG()}
    ${etoHtmlVGSegmentaire()}
    ${etoHtmlValveAortique()}
    ${etoHtmlValveMitrale()}
    ${etoHtmlPTDVG()}
    ${etoHtmlFonctionVD()}
    ${etoHtmlHTAP()}
  `,
},
    {
      titre: "CEC",
      html: `
        <p><strong>Canulation artérielle :</strong> Aortique.</p>
        <p><strong>Canulation veineuse :</strong> Atrio-cave.</p>
        <p>
          <strong>Héparine</strong> 300–400 UI/kg
          (~<span data-per-kg="300" data-unit="UI"></span> à
             <span data-per-kg="400" data-unit="UI"></span>),
          ACT &gt; 400 s.
        </p>
        <p><strong>Bêta-bloquant</strong> (Esmolol ou Landiolol) si SIV &gt; 18 mm.</p>
        <p><strong>Cardioplégie</strong> froide (K) ou chaude (K, Mg) toutes les 20–30 min (Custodiol si durée prévue &gt; 2 h).</p>
        <p><strong>Protamine</strong> 60–80 % de la dose d’héparine.</p>
      `,
    },
  ];

  renderInterventionPage({
    titre: "RVA ou plastie aortique",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  // Calcul Kétamine / Exacyl / Ropivacaïne / Héparine à partir du poids
  setupAnesthGlobalDoseLogic();

  // Logique spécifique RVA (induction, ATB…)
  setupRvaLogic();
}

function setupRvaLogic() {
  const poidsId = "anesth-poids";
  const cbImc = document.getElementById("rva-imc50");
  const cbRisk = document.getElementById("rva-induction-risque");
  const cbSeq = document.getElementById("rva-seq-rapide");
  const cbAllergie = document.getElementById("rva-allergie-bl");

  const indText = document.getElementById("rva-induction-text");
  const liCefaStd = document.getElementById("rva-cefazoline-standard");
  const liCefaObese = document.getElementById("rva-cefazoline-obese");
  const liVanco = document.getElementById("rva-vancomycine");
  const spanVanco = document.getElementById("rva-vanco-dose");

  function updateInduction() {
    const poids = parseKg(poidsId);
    let txt = "<strong>Induction :</strong> ";

    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${formatDoseMgPerKg(poids, 0.3)} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${formatDoseMgPerKg(poids, 1.2)} (séquence rapide).`;
    } else {
      txt += `Atracurium ${formatDoseMgPerKg(poids, 0.5)}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

  function updateAtb() {
  const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liCefaStd)  liCefaStd.style.display  = "none";
    if (liCefaObese) liCefaObese.style.display = "";
  } else {
    if (liCefaStd)  liCefaStd.style.display  = "";
    if (liCefaObese) liCefaObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liCefaStd)   liCefaStd.style.display   = "none";
    if (liCefaObese) liCefaObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne Céfazoline selon IMC
    if (cbImc && cbImc.checked) {
      if (liCefaStd)  liCefaStd.style.display  = "none";
      if (liCefaObese) liCefaObese.style.display = "";
    } else {
      if (liCefaStd)  liCefaStd.style.display  = "";
      if (liCefaObese) liCefaObese.style.display = "none";
    }
  }
}

  function updateAll() {
    updateInduction();
    updateAtb();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);

  [cbImc, cbRisk, cbSeq, cbAllergie].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionRVM() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Type d'intervention
              <select id="rvm-type">
                <option value="rvm">RVM</option>
                <option value="plastie">Plastie mitrale</option>
              </select>
            </label>
          </div>
          <div class="row">
            <label>Poids (kg)
              <!-- ID commun pour toute l'anesthésie -->
              <input type="number" id="anesth-poids" min="30" max="250" step="1" />
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="rvm-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="rvm-induction-risque" />
              Induction à risque (FEVG &lt; 35%, RM serré, IM sévère, HTAP)
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="rvm-seq-rapide" />
              Séquence rapide
            </label>
            <label>
              <input type="checkbox" id="rvm-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, KTa radial gauche, KTC 5 voies JID
          (ajouter « KTa radial droit » si indiqué), BIS, NIRS si FdR, ETO,
          Swan-Ganz si FEVG &lt; 35% ou HTAP.
        </p>
        <p><strong>Objectif IM :</strong> Plein, rapide, ouvert.</p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="rvm-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>
        <p id="rvm-video-text" style="display:none;">
          <strong>Si plastie mitrale avec vidéo :</strong>
          Intubation sélective par Carlens ou bloqueur endobronchique.
        </p>
        <p>
          <strong>Entretien :</strong> AIVOC Propofol/Sufentanil.
        </p>
        <p id="rvm-keta-text">
          Kétamine 0,5 mg/kg
          (<span data-per-kg="0.5" data-unit="mg"></span> en bolus)
          puis 0,125 mg/kg/h.
        </p>
        <p id="rvm-exacyl-text">
          Exacyl 20 mg/kg
          (<span data-per-kg="20" data-unit="mg"></span>) puis 2 mg/kg/h (sauf CI).
        </p>
        <p>
          <strong>ALR :</strong> Bloc thoracique transverse,
          Ropivacaïne 3,75 mg/mL 15–20 mL x2
          (dose max 3 mg/kg ≈
            <span data-per-kg="3" data-unit="mg"></span>).
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="rvm-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+ 1 g priming CEC) puis 1 g toutes les 4 h.
          </li>
          <li id="rvm-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+ 2 g priming CEC) puis 2 g toutes les 4 h.
          </li>
          <li id="rvm-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="rvm-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
  html: `
    ${etoHtmlFonctionVG()}
    ${etoHtmlVGSegmentaire()}
    ${etoHtmlValveAortique()}
    ${etoHtmlValveMitrale()}
    ${etoHtmlPTDVG()}
    ${etoHtmlFonctionVD()}
    ${etoHtmlHTAP()}
  `,
},
    {
      titre: "CEC",
      html: `
        <p><strong>Canulation artérielle :</strong> Aortique.</p>
        <p><strong>Canulation veineuse :</strong> Atrio-cave.</p>
        <p>
          <strong>Héparine</strong> 300–400 UI/kg
          (~<span data-per-kg="300" data-unit="UI"></span> à
             <span data-per-kg="400" data-unit="UI"></span>),
          ACT &gt; 400 s.
        </p>
        <p>Bêta-bloquant (Esmolol ou Landiolol) si SIV &gt; 18 mm.</p>
        <p>
          <strong>Cardioplégie</strong> froide (K) ou chaude (K, Mg) toutes les 20–30 min
          (Custodiol si durée prévue &gt; 2 h).
        </p>
        <p>
          <strong>Protamine</strong> 60–80 % de la dose d’héparine.
        </p>
      `,
    },
  ];

  renderInterventionPage({
    titre: "RVM ou plastie mitrale",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  // Calcul global des doses (Kétamine / Exacyl / Ropi max / Héparine…)
  setupAnesthGlobalDoseLogic();

  // Logique spécifique RVM / plastie (induction, ATB, vidéo…)
  setupRvmLogic();
}

function setupRvmLogic() {
  const poidsId = "anesth-poids";
  const cbImc = document.getElementById("rvm-imc50");
  const cbRisk = document.getElementById("rvm-induction-risque");
  const cbSeq = document.getElementById("rvm-seq-rapide");
  const cbAllergie = document.getElementById("rvm-allergie-bl");
  const selType = document.getElementById("rvm-type");

  const indText = document.getElementById("rvm-induction-text");
  const videoText = document.getElementById("rvm-video-text");
  const liCefaStd = document.getElementById("rvm-cefazoline-standard");
  const liCefaObese = document.getElementById("rvm-cefazoline-obese");
  const liVanco = document.getElementById("rvm-vancomycine");
  const spanVanco = document.getElementById("rvm-vanco-dose");

  function updateInduction() {
    const poids = parseKg(poidsId);
    let txt = "<strong>Induction :</strong> ";

    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${formatDoseMgPerKg(poids, 0.3)} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${formatDoseMgPerKg(poids, 1.2)} (séquence rapide).`;
    } else {
      txt += `Atracurium ${formatDoseMgPerKg(poids, 0.5)}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

 function updateAtb() {
  const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liCefaStd)  liCefaStd.style.display  = "none";
    if (liCefaObese) liCefaObese.style.display = "";
  } else {
    if (liCefaStd)  liCefaStd.style.display  = "";
    if (liCefaObese) liCefaObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liCefaStd)   liCefaStd.style.display   = "none";
    if (liCefaObese) liCefaObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne Céfazoline selon IMC
    if (cbImc && cbImc.checked) {
      if (liCefaStd)  liCefaStd.style.display  = "none";
      if (liCefaObese) liCefaObese.style.display = "";
    } else {
      if (liCefaStd)  liCefaStd.style.display  = "";
      if (liCefaObese) liCefaObese.style.display = "none";
    }
  }
}

  function updateType() {
    if (!selType || !videoText) return;
    const isPlastie = selType.value === "plastie";
    videoText.style.display = isPlastie ? "" : "none";
  }

  function updateAll() {
    updateInduction();
    updateAtb();
    updateType();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);
  [cbImc, cbRisk, cbSeq, cbAllergie].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });
  if (selType) selType.addEventListener("change", updateAll);

  updateAll();
}


function renderInterventionRVT() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <!-- ID commun pour toute la partie Anesthésie -->
              <input type="number" id="anesth-poids" min="30" max="250" step="1" />
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="rvt-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="rvt-induction-risque" />
              Induction à risque (FEVG &lt; 35%, RT serré, IT sévère, HTAP)
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="rvt-seq-rapide" />
              Séquence rapide
            </label>
            <label>
              <input type="checkbox" id="rvt-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, KTa radial gauche, KTC 5 voies, BIS,
          NIRS si FdR, ETO, Swan-Ganz si induction à risque.
        </p>
        <p><strong>Objectif IT :</strong> Normovolémie, rapide, ouvert (RVP basses).</p>
        <p><strong>Objectif RT :</strong> Plein, lent, fermé.</p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="rvt-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>
        <p>
          <strong>Entretien :</strong> AIVOC Propofol/Sufentanil.
        </p>
        <p id="rvt-keta-text">
          Kétamine 0,5 mg/kg
          (<span data-per-kg="0.5" data-unit="mg"></span> en bolus)
          puis 0,125 mg/kg/h.
        </p>
        <p id="rvt-exacyl-text">
          Exacyl 20 mg/kg
          (<span data-per-kg="20" data-unit="mg"></span>) puis 2 mg/kg/h (sauf CI).
        </p>
        <p>
          <strong>ALR :</strong> Bloc thoracique transverse,
          Ropivacaïne 3,75 mg/mL 15–20 mL x2
          (Max 3 mg/kg ≈
            <span data-per-kg="3" data-unit="mg"></span>).
        </p>
        <p style="font-size: 0.9em; opacity: 0.8;">
          (Remplacement par Etomidate si induction à risque, Rocuronium 1,2 mg/kg si séquence rapide,
          comme indiqué dans le tableau.)
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="rvt-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+ 1 g priming CEC) puis 1 g toutes les 4 h.
          </li>
          <li id="rvt-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+ 2 g priming CEC) puis 2 g toutes les 4 h.
          </li>
          <li id="rvt-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="rvt-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
  html: `
    ${etoHtmlFonctionVG()}
    ${etoHtmlVGSegmentaire()}
    ${etoHtmlValveAortique()}
    ${etoHtmlValveMitrale()}
    ${etoHtmlPTDVG()}
    ${etoHtmlFonctionVD()}
    ${etoHtmlHTAP()}
  `,
},
    {
      titre: "CEC",
      html: `
        <p><strong>Canulation artérielle :</strong> Aortique.</p>
        <p><strong>Canulation veineuse :</strong> Bi-cave
           (risque de « lackage » du KTC).</p>
        <p>
          <strong>Héparine</strong> 300–400 UI/kg
          (~<span data-per-kg="300" data-unit="UI"></span> à
             <span data-per-kg="400" data-unit="UI"></span>),
          objectif ACT &gt; 400 s.
        </p>
        <p>
          <strong>Cardioplégie</strong> froide (K) ou chaude (K, Mg) toutes les 20–30 min.
        </p>
        <p>
          <strong>Protamine</strong> 60–80 % de la dose initiale d’héparine.
        </p>
        <p>
          <strong>Sevrage CEC :</strong> Dobutamine/NO si dysfonction VD pré-opératoire.
        </p>
      `,
    },
  ];

  renderInterventionPage({
    titre: "RVT ou plastie tricuspide",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  // Calcul global poids → Kétamine / Exacyl / Ropivacaïne / Héparine
  setupAnesthGlobalDoseLogic();

  // Logique spécifique RVT (induction, ATB…)
  setupRvtLogic();
}

function setupRvtLogic() {
  const poidsId = "anesth-poids";
  const cbImc = document.getElementById("rvt-imc50");
  const cbRisk = document.getElementById("rvt-induction-risque");
  const cbSeq = document.getElementById("rvt-seq-rapide");
  const cbAllergie = document.getElementById("rvt-allergie-bl");

  const indText = document.getElementById("rvt-induction-text");
  const liCefaStd = document.getElementById("rvt-cefazoline-standard");
  const liCefaObese = document.getElementById("rvt-cefazoline-obese");
  const liVanco = document.getElementById("rvt-vancomycine");
  const spanVanco = document.getElementById("rvt-vanco-dose");

  function updateInduction() {
    const poids = parseKg(poidsId);
    let txt = "<strong>Induction :</strong> ";

    // Hypnotique : Etomidate si induction à risque, sinon Propofol
    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${formatDoseMgPerKg(poids, 0.3)} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    // Curare : Rocuronium si SR, sinon Atracurium
    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${formatDoseMgPerKg(poids, 1.2)} (séquence rapide).`;
    } else {
      txt += `Atracurium ${formatDoseMgPerKg(poids, 0.5)}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

  function updateAtb() {
  const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liCefaStd)  liCefaStd.style.display  = "none";
    if (liCefaObese) liCefaObese.style.display = "";
  } else {
    if (liCefaStd)  liCefaStd.style.display  = "";
    if (liCefaObese) liCefaObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liCefaStd)   liCefaStd.style.display   = "none";
    if (liCefaObese) liCefaObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne Céfazoline selon IMC
    if (cbImc && cbImc.checked) {
      if (liCefaStd)  liCefaStd.style.display  = "none";
      if (liCefaObese) liCefaObese.style.display = "";
    } else {
      if (liCefaStd)  liCefaStd.style.display  = "";
      if (liCefaObese) liCefaObese.style.display = "none";
    }
  }
}


  function updateAll() {
    updateInduction();
    updateAtb();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);
  [cbImc, cbRisk, cbSeq, cbAllergie].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionAorteAsc() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <!-- Id commun pour toute la partie Anesthésie -->
              <input type="number" id="anesth-poids" min="30" max="250" step="1" />
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="aoasc-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="aoasc-induction-risque" />
              Induction à risque (FEVG &lt; 35%, valvulopathie sévère, HTAP)
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="aoasc-seq-rapide" />
              Séquence rapide
            </label>
            <label>
              <input type="checkbox" id="aoasc-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, KTa radial gauche, KTc 5 voies, BIS,
          NIRS <strong>systématique</strong>, ETO, Swan-Ganz si FEVG &lt; 35% ou HTAP.
        </p>
        <p>
          <strong>Objectif :</strong> Plein, mou, ouvert, lent. Éviter les pics hypertensifs&nbsp;!
        </p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="aoasc-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>
        <p>
          <strong>Entretien :</strong> AIVOC Propofol/Sufentanil.
        </p>
        <p id="aoasc-keta-text">
          Kétamine 0,5 mg/kg
          (<span data-per-kg="0.5" data-unit="mg"></span> en bolus)
          puis 0,125 mg/kg/h.
        </p>
        <p id="aoasc-exacyl-text">
          Exacyl 20 mg/kg
          (<span data-per-kg="20" data-unit="mg"></span>) puis 2 mg/kg/h (sauf CI).
        </p>
        <p>
          <strong>ALR :</strong> Bloc thoracique transverse,
          Ropivacaïne 3,75 mg/mL 15–20 mL x2 (Max 3 mg/kg ≈
            <span data-per-kg="3" data-unit="mg"></span>).
        </p>
        <p style="font-size:0.9em;opacity:0.8;">
          (Remplacement par Etomidate si induction à risque, Rocuronium 1,2 mg/kg si séquence rapide cochée,
          comme indiqué dans le tableau.)
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="aoasc-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+ 1 g priming CEC) puis 1 g toutes les 4 h.
          </li>
          <li id="aoasc-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+ 2 g priming CEC) puis 2 g toutes les 4 h.
          </li>
          <li id="aoasc-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="aoasc-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
  html: `
    ${etoHtmlFonctionVG()}
    ${etoHtmlVGSegmentaire()}
    ${etoHtmlValveAortique()}
    ${etoHtmlValveMitrale()}
    ${etoHtmlPTDVG()}
    ${etoHtmlFonctionVD()}
    ${etoHtmlHTAP()}
  `,
},
    {
      titre: "CEC",
      html: `
        <p><strong>Canulation artérielle :</strong> Aortique.</p>
        <p><strong>Canulation veineuse :</strong> Atrio-cave.</p>
        <p>
          <strong>Héparine</strong> 300–400 UI/kg
          (~<span data-per-kg="300" data-unit="UI"></span> à
             <span data-per-kg="400" data-unit="UI"></span>),
          objectif ACT &gt; 400 s.
        </p>
        <p>
          <strong>Bêta-bloquant<strong> (Esmolol ou Landiolol) si SIV &gt; 18 mm.
        </p>
        <p>
          <strong>Cardioplégie</strong> froide (K) ou chaude (K, Mg) toutes les 20–30 min
          (Custodiol si durée prévue &gt; 2 h).
        </p>
        <p>
          <strong>Protamine</strong> 60–80 % de la dose initiale d’héparine.
        </p>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Chirurgie de l’aorte ascendante (hors dissection Ao)",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  setupAnesthGlobalDoseLogic();
  setupAorteAscLogic();
}

function setupAorteAscLogic() {
  const poidsId = "anesth-poids";
  const cbImc = document.getElementById("aoasc-imc50");
  const cbRisk = document.getElementById("aoasc-induction-risque");
  const cbSeq = document.getElementById("aoasc-seq-rapide");
  const cbAllergie = document.getElementById("aoasc-allergie-bl");

  const indText = document.getElementById("aoasc-induction-text");
  const liCefaStd = document.getElementById("aoasc-cefazoline-standard");
  const liCefaObese = document.getElementById("aoasc-cefazoline-obese");
  const liVanco = document.getElementById("aoasc-vancomycine");
  const spanVanco = document.getElementById("aoasc-vanco-dose");

  function updateInduction() {
    const poids = parseKg(poidsId);
    let txt = "<strong>Induction :</strong> ";

    // Hypnotique : Etomidate si induction à risque, sinon Propofol
    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${formatDoseMgPerKg(poids, 0.3)} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    // Curare : Rocuronium si SR, sinon Atracurium
    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${formatDoseMgPerKg(poids, 1.2)} (séquence rapide).`;
    } else {
      txt += `Atracurium ${formatDoseMgPerKg(poids, 0.5)}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

  function updateAtb() {
  const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liCefaStd)  liCefaStd.style.display  = "none";
    if (liCefaObese) liCefaObese.style.display = "";
  } else {
    if (liCefaStd)  liCefaStd.style.display  = "";
    if (liCefaObese) liCefaObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liCefaStd)   liCefaStd.style.display   = "none";
    if (liCefaObese) liCefaObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne Céfazoline selon IMC
    if (cbImc && cbImc.checked) {
      if (liCefaStd)  liCefaStd.style.display  = "none";
      if (liCefaObese) liCefaObese.style.display = "";
    } else {
      if (liCefaStd)  liCefaStd.style.display  = "";
      if (liCefaObese) liCefaObese.style.display = "none";
    }
  }
}


  function updateAll() {
    updateInduction();
    updateAtb();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);
  [cbImc, cbRisk, cbSeq, cbAllergie].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionDrainagePericardique() {
  const encadres = [
    // ----------------------------------------------------------------------
    // 1) CARACTÉRISTIQUES PATIENT
    // ----------------------------------------------------------------------
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <input type="number" id="dp-poids" min="30" max="250" step="1" />
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="dp-imc50" />
              IMC &gt; 50 kg/m²
            </label>

            <label>
              <input type="checkbox" id="dp-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },

    // ----------------------------------------------------------------------
    // 2) CONDITIONNEMENT PRÉ-OPÉRATOIRE
    // ----------------------------------------------------------------------
    {
      titre: "Conditionnement pré-opératoire",
      html: `
        <p><strong>Avant l’induction :</strong></p>
        <ul>
          <li>Débuter Noradrénaline</li>
          <li>Expansion volémique</li>
          <li>Chirurgie en salle</li>
          <li>Désinfection et champage fait</li>
        </ul>
      `,
    },

    // ----------------------------------------------------------------------
    // 3) MONITORAGE
    // ----------------------------------------------------------------------
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, KTa à discuter (ne doit pas retarder le drainage),
          VVP x2, BIS.
        </p>

        <p><strong>Objectif :</strong></p>
        <ul>
          <li>Éviter absolument l’augmentation de la post-charge VD</li>
          <li>Éviter l’hypovolémie (diminution de la pré-charge VD)</li>
        </ul>

        <p>Optimisation de la pré-oxygénation pour maximiser la durée d’apnée.</p>
      `,
    },

    // ----------------------------------------------------------------------
    // 4) ANESTHÉSIE
    // ----------------------------------------------------------------------
    {
      titre: "Anesthésie",
      html: `
        <p><strong>Induction :</strong></p>
        <ul>
          <li>Etomidate 0,3 mg/kg car induction à risque</li>
          <li>Rocuronium 1,2 mg/kg <em>(ou Célocurine 1 mg/kg)</em> car séquence rapide systématique</li>
        </ul>

        <p>
          Ventilation mécanique uniquement après ouverture du péricarde
          (en l’absence de désaturation).
        </p>

        <p><strong>Entretien :</strong> AIVOC Propofol/Sufentanil</p>
      `,
    },

    // ----------------------------------------------------------------------
    // 5) ANTIBIOPROPHYLAXIE
    // ----------------------------------------------------------------------
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="dp-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+1 g priming CEC) puis 1 g toutes les 4 h.
          </li>

          <li id="dp-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+2 g priming CEC) puis 2 g toutes les 4 h.
          </li>

          <li id="dp-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="dp-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },

    // ----------------------------------------------------------------------
    // 6) ETO
    // ----------------------------------------------------------------------
    {
      titre: "ETO",
      html: `
        <p><strong>Non systématique.</strong></p>
        <p>Utile pour vérifier l’absence d’épanchement résiduel et/ou caillot péricardique.</p>
      `,
    },
  ];

  // ---- Rendu de la page ----
  renderInterventionPage({
    titre: "Drainage péricardique",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics();
  setupAnesthGlobalDoseLogic();
  setupDrainagePericardiqueLogic();
}

// =====================================================================
// LOGIQUE ANTIBIOPROPHYLAXIE
// =====================================================================
function setupDrainagePericardiqueLogic() {
  const poidsId    = "dp-poids";
  const cbImc      = document.getElementById("dp-imc50");
  const cbAllergie = document.getElementById("dp-allergie-bl");

  const liStd   = document.getElementById("dp-cefazoline-standard");
  const liObese = document.getElementById("dp-cefazoline-obese");
  const liVanco = document.getElementById("dp-vancomycine");
  const spanV   = document.getElementById("dp-vanco-dose");

  function updateATB() {
    const poids = parseKg(poidsId);

    // --- Gestion IMC ---
    if (cbImc.checked) {
      liStd.style.display = "none";
      liObese.style.display = "";
    } else {
      liStd.style.display = "";
      liObese.style.display = "none";
    }

    // --- Allergie BL => remplacement complet ---
    if (cbAllergie.checked) {
      liStd.style.display = "none";
      liObese.style.display = "none";
      liVanco.style.display = "";
      spanV.textContent = formatDoseMgPerKg(poids, 30);
    } else {
      liVanco.style.display = "none";

      if (cbImc.checked) {
        liStd.style.display = "none";
        liObese.style.display = "";
      } else {
        liStd.style.display = "";
        liObese.style.display = "none";
      }
    }
  }

  // Écouteurs
  [cbImc, cbAllergie].forEach(cb => cb.addEventListener("change", updateATB));
  document.getElementById(poidsId).addEventListener("input", updateATB);

  updateATB();
}

function renderInterventionDissectionAo() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <input type="number" id="anesth-poids" min="30" max="250" step="1" />
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="dissec-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="dissec-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Conditionnement pré-opératoire",
      html: `
        <p><strong>Analgésie (Morphiniques)</strong></p>
        <p><strong>En l’absence d’instabilité hémodynamique :</strong></p>
        <ul>
          <li>Contrôle FC 50–65/min (Esmolol ou Landiolol)</li>
          <li>Contrôle PAS 110–120 mmHg (Urapidil ou Nicardipine)</li>
        </ul>
        <p><strong>Précommande large de PSL</strong></p>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, KTa radial droit
          (gauche si canulation artère sous-clavière droite ou TSA droite),
          KTC 5 voies, BIS, NIRS <strong>systématique</strong>, ETO.
        </p>
        <p>
          <strong>Objectif :</strong> Plein, mou, ouvert, lent.
          Aucun pic hypertensif&nbsp;!
        </p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p>
          <strong>IOT :</strong> vidéo-laryngoscope systématique.
        </p>
        <p>
          <strong>Entretien :</strong>
          AIVOC Propofol/Sufentanil.
        </p>
        <p>
          ± Thiopental 5–10 mg/kg avant arrêt circulatoire à 28 °C.
        </p>
        <p id="dissec-keta-text">
          Kétamine 0,5 mg/kg
          (<span data-per-kg="0.5" data-unit="mg"></span> en bolus)
          puis 0,125 mg/kg/h IVSE.
        </p>
        <p id="dissec-exacyl-text">
          Exacyl 20 mg/kg
          (<span data-per-kg="20" data-unit="mg"></span>) puis 2 mg/kg/h IVSE (sauf CI).
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="dissec-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+ 1 g priming CEC) puis 1 g toutes les 4 h.
          </li>
          <li id="dissec-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+ 2 g priming CEC) puis 2 g toutes les 4 h.
          </li>
          <li id="dissec-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="dissec-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
  html: `
    ${etoHtmlFonctionVG()}
    ${etoHtmlVGSegmentaire()}
    ${etoHtmlValveAortique()}
    ${etoHtmlValveMitrale()}
    ${etoHtmlPTDVG()}
    ${etoHtmlFonctionVD()}
    ${etoHtmlHTAP()}
  `,
},
    {
      titre: "CEC",
      html: `
        <p>
          <strong>Canulation artérielle :</strong>
          Aortique, fémorale ou axillaire/sous-clavière droite.
        </p>
        <p><strong>Canulation veineuse :</strong> Atrio-cave.</p>
        <p>
          <strong>Héparine</strong> 300–400 UI/kg
          (~<span data-per-kg="300" data-unit="UI"></span> à
             <span data-per-kg="400" data-unit="UI"></span>),
          objectif ACT &gt; 400 s.
        </p>
        <p>
          <strong>Cardioplégie</strong> froide (K) ou chaude (K, Mg) toutes les 20–30 min
          (Custodiol si durée prévue &gt; 2 h).
        </p>
        <p>
          Cérébroplégie à 28 °C si arrêt circulatoire. Réchauffement 1 °C/5 min.
        </p>
        <p>
          <strong>Protamine</strong> 60–80 % de la dose initiale d’héparine.
        </p>
      `,
    },
    {
      titre: "Particularités post-CEC",
      html: `
        <p><strong>Correction agressive de l’hémostase :</strong></p>
        <ul>
          <li>
            PFC, CUP, fibrinogène guidés par Quantra
            (
              <span class="img-link" onclick="openImg('quantra.png')">
                Afficher algorithme du Quantra
                <span style="font-size:18px;">🖼️️ </span>
              </span>
            )
          </li>
          <li>Correction de l’hypothermie</li>
          <li>Correction de l’hypocalcémie</li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Dissection aortique",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  setupAnesthGlobalDoseLogic();
  setupDissectionAoLogic();
}

function setupDissectionAoLogic() {
  const poidsId = "anesth-poids";
  const cbImc = document.getElementById("dissec-imc50");
  const cbAllergie = document.getElementById("dissec-allergie-bl");

  const liCefaStd = document.getElementById("dissec-cefazoline-standard");
  const liCefaObese = document.getElementById("dissec-cefazoline-obese");
  const liVanco = document.getElementById("dissec-vancomycine");
  const spanVanco = document.getElementById("dissec-vanco-dose");

 function updateAtb() {
  const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liCefaStd)  liCefaStd.style.display  = "none";
    if (liCefaObese) liCefaObese.style.display = "";
  } else {
    if (liCefaStd)  liCefaStd.style.display  = "";
    if (liCefaObese) liCefaObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liCefaStd)   liCefaStd.style.display   = "none";
    if (liCefaObese) liCefaObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne Céfazoline selon IMC
    if (cbImc && cbImc.checked) {
      if (liCefaStd)  liCefaStd.style.display  = "none";
      if (liCefaObese) liCefaObese.style.display = "";
    } else {
      if (liCefaStd)  liCefaStd.style.display  = "";
      if (liCefaObese) liCefaObese.style.display = "none";
    }
  }
}
updateAll();
}
  
function renderInterventionTransplantAnesth() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <!-- Poids commun à toute la partie Anesthésie -->
              <input type="number" id="anesth-poids" min="30" max="250" step="1" />
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="txa-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="txa-seq-rapide" />
              Séquence rapide
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="txa-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Conditionnement pré-opératoire",
      html: `
        <p><strong>Bilan pré-opératoire :</strong></p>
        <ul>
          <li>
            Recherche de DSA + cross-match virtuel<br>
            &rarr; Si DSA &gt; 3000 MFI ou cross-match positif : EP ×1 en réanimation.
          </li>
          <li>
            Bilan receveur : 2 tubes secs (cross-match réel + Ac anti-HLA J0),
            hémostase complète (TP, TCA, INR, fibrinogène, anti-Xa, ATIII).
          </li>
          <li>Pré-commande large de PSL.</li>
        </ul>
        <p><strong>Traitements à administrer :</strong></p>
        <ul>
          <li>
            Solumédrol
            <span id="txa-solumedrol-preop-dose">4 mg/kg</span> IVL sur 1 h.
          </li>
          <li>
            Si AVK : Vitamine K 10 mg + prévoir PPSB
            (administrer 30 % de la dose pré-incision si redux).
          </li>
          <li>
            Prévoir en salle : bouteille de NO + aimant si DAI.
          </li>
        </ul>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p><strong>Monitorage standard :</strong></p>
        <ul>
          <li>Scope ECG 5 branches</li>
          <li>SpO₂</li>
          <li>KTa radial droit</li>
          <li>KTc 5 voies JID</li>
          <li>BIS</li>
          <li>NIRS</li>
          <li>ETO</li>
          <li>Swan-Ganz</li>
        </ul>
        <p><strong>Gestion hémodynamique :</strong></p>
        <ul>
          <li>PAM &gt; 65 mmHg</li>
          <li>PVC &lt; 15 mmHg</li>
          <li>FC 90–110/min</li>
          <li>NO inhalé systématique</li>
        </ul>
        <p><strong>En cas de dysfonction VD :</strong></p>
        <ul>
          <li>NO inhalé</li>
          <li>Accélération de la FC (stimulation épicardique ou inotropes)</li>
          <li>± ECMO VA</li>
        </ul>
        <p><strong>Si défaillance multi-cavitaire (DPG VG ou biV) :</strong></p>
        <ul>
          <li>Dobutamine</li>
          <li>± ECMO VA (BCPIA généralement associée)</li>
        </ul>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="txa-induction-text">
          <strong>Induction :</strong>
          Etomidate 0,3 mg/kg (induction à risque),
          Atracurium 0,5 mg/kg (remplacé par Rocuronium 1,2 mg/kg si séquence rapide),
          Sufentanil (AIVOC).
        </p>
        <p id="txa-keta-text">
          Kétamine 0,5 mg/kg puis 0,125 mg/kg/h IVSE.
        </p>
        <p id="txa-exacyl-text">
          Exacyl 20 mg/kg puis 2 mg/kg/h IVSE (sauf CI).
        </p>
        <p>
          Solumédrol 120 mg IVL.
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="txa-cefazoline-standard">
            <strong>Céfazoline :</strong>
            2 g (+ 1 g priming CEC) puis 1 g toutes les 4 h (Attention: Avis infectieux si colonisation BMR/BHRe ou si patient hospitalisé en réanimation).
          </li>
          <li id="txa-cefazoline-obese" style="display:none;">
            <strong>Céfazoline (IMC &gt; 50) :</strong>
            4 g (+ 2 g priming CEC) puis 2 g toutes les 4 h.
          </li>
          <li id="txa-vancomycine" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="txa-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision (Attention: Avis infectieux si colonisation BMR/BHRe ou si patient hospitalisé en réanimation).
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
  html: `
    ${etoHtmlFonctionVG()}
    ${etoHtmlVGSegmentaire()}
    ${etoHtmlValveAortique()}
    ${etoHtmlValveMitrale()}
    ${etoHtmlPTDVG()}
    ${etoHtmlFonctionVD()}
    ${etoHtmlHTAP()}
  `,
},
    {
      titre: "CEC",
      html: `
        <p><strong>Canulation :</strong></p>
        <ul>
          <li>Canulation artérielle : aortique</li>
          <li>Canulation veineuse : bi-cave</li>
        </ul>
        <p><strong>Anticoagulation :</strong></p>
        <ul>
          <li>
            <strong>Héparine</strong> 300–400 UI/kg,
            objectif ACT &gt; 400 s.
          </li>
          <li>
            <strong>Protamine</strong> 60–80 % de la dose initiale d’héparine
          </li>
        </ul>
        <p><strong>Spécificités :</strong></p>
        <ul>
          <li>Pas de cardioplégie</li>
          <li>Temps d’assistance = ~25 % de la durée d’ischémie</li>
          <li>PPSB 25 UI/kg si AVK pré-opératoire</li>
        </ul>
      `,
    },
    {
      titre: "Particularités post-CEC",
      html: `
        <p><strong>Correction agressive de l’hémostase :</strong></p>
        <ul>
          <li>
            PFC, CUP, fibrinogène guidés par Quantra
            (
              <span class="img-link" onclick="openImg('quantra.png')">
                Afficher algorithme du Quantra <span style="font-size:18px;">🖼️</span>
              </span>
            )
          </li>
          <li>Correction de l’hypothermie</li>
          <li>Correction de l’hypocalcémie</li>
        </ul>
        <p><strong>Gestion hémodynamique (post-CEC) :</strong></p>
        <ul>
          <li>PAM &gt; 65 mmHg</li>
          <li>PVC &lt; 15 mmHg</li>
          <li>FC 90–110/min</li>
          <li>NO inhalé systématique</li>
          <li>Si dysfonction VD : NO inhalé, accélération FC, ± ECMO VA</li>
          <li>Si DPG (VG ou biV) : Dobutamine, ± ECMO VA (BCPIA généralement associée)</li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Transplantation cardiaque",
    sousTitre: "",
    image: "chircec2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  // Met à jour tous les spans [data-per-kg] éventuels de la partie Anesthésie
  setupAnesthGlobalDoseLogic();
  setupTransplantAnesthLogic();
}

function setupTransplantAnesthLogic() {
  const poidsId = "anesth-poids";
  const cbImc = document.getElementById("txa-imc50");
  const cbSeq = document.getElementById("txa-seq-rapide");
  const cbAllergie = document.getElementById("txa-allergie-bl");

  const indText = document.getElementById("txa-induction-text");
  const ketaText = document.getElementById("txa-keta-text");
  const exacylText = document.getElementById("txa-exacyl-text");
  const solumedrolPreopSpan = document.getElementById("txa-solumedrol-preop-dose");

  const liCefaStd = document.getElementById("txa-cefazoline-standard");
  const liCefaObese = document.getElementById("txa-cefazoline-obese");
  const liVanco = document.getElementById("txa-vancomycine");
  const spanVanco = document.getElementById("txa-vanco-dose");

  function updateInductionEtPerfusions() {
    const poids = parseKg(poidsId);

    // Induction : Etomidate toujours (induction à risque), curare selon SR
    const etoDose = formatDoseMgPerKg(poids, 0.3);
    const atrDose = formatDoseMgPerKg(poids, 0.5);
    const rocDose = formatDoseMgPerKg(poids, 1.2);

    let txt = `<strong>Induction :</strong> Etomidate ${etoDose} (induction à risque), Sufentanil (AIVOC), `;

    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${rocDose} (séquence rapide).`;
    } else {
      txt += `Atracurium ${atrDose}.`;
    }

    if (indText) indText.innerHTML = txt;

    // Kétamine
    if (ketaText) {
      const doseKeta = formatDoseMgPerKg(poids, 0.5);
      ketaText.innerHTML = `Kétamine ${doseKeta} puis 0,125 mg/kg/h IVSE.`;
    }

    // Exacyl
    if (exacylText) {
      const doseExacyl = formatDoseMgPerKg(poids, 20);
      exacylText.innerHTML = `Exacyl ${doseExacyl} puis 2 mg/kg/h IVSE (sauf CI).`;
    }

    // Solumédrol pré-op 4 mg/kg
    if (solumedrolPreopSpan) {
      solumedrolPreopSpan.textContent = formatDoseMgPerKg(poids, 4);
    }
  }

  function updateAntibioprophylaxie() {
    const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liCefaStd) liCefaStd.style.display = "none";
    if (liCefaObese) liCefaObese.style.display = "";
  } else {
    if (liCefaStd) liCefaStd.style.display = "";
    if (liCefaObese) liCefaObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liCefaStd) liCefaStd.style.display = "none";
    if (liCefaObese) liCefaObese.style.display = "none";
    if (liVanco) liVanco.style.display = "";
    if (spanVanco) spanVanco.textContent = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne version de la Céfazoline selon IMC
    if (cbImc && cbImc.checked) {
      if (liCefaStd) liCefaStd.style.display = "none";
      if (liCefaObese) liCefaObese.style.display = "";
    } else {
      if (liCefaStd) liCefaStd.style.display = "";
      if (liCefaObese) liCefaObese.style.display = "none";
    }
  }
}

  function updateAll() {
    updateInductionEtPerfusions();
    updateAntibioprophylaxie();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);
  [cbImc, cbSeq, cbAllergie].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionTAVI() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <input type="number" id="tavi-poids" min="30" max="200" step="1" />
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="tavi-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="tavi-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>

          <div class="row">
            <label>
              <input type="checkbox" id="tavi-ag" />
              Anesthésie générale prévue (Dyspnée stade IV, agitation, voies autres que fémorale/carotidienne)
            </label>
          </div>

          <div class="row" id="tavi-ag-options" style="display:none;">
            <label>
              <input type="checkbox" id="tavi-induction-risque" />
              Induction à risque (FEVG &lt; 35%, RA serré)
            </label>
            <label>
              <input type="checkbox" id="tavi-seq-rapide" />
              Séquence rapide
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p id="tavi-monitor-text">
          Scope ECG 5 branches, SpO₂, VVP x2 de bon calibre, PNI
          (KTa radial si anesthésie générale ou RA très serré), ± BIS / NIRS,
          ETT/ETO selon l'opérateur.
        </p>
        <p><strong>Objectif RA :</strong> Plein, régulier, fermé.</p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="tavi-induction-line"></p>
        <p id="tavi-entretien-line"></p>

        <p>
          <strong>Héparine</strong> 80–100 UI/kg
          (~<span data-per-kg="80" data-unit="UI"></span> à
             <span data-per-kg="100" data-unit="UI"></span>),
          ACT cible 200–300 s.
        </p>
        <p>
          <strong>Protamine</strong> = 50 % de la dose d’héparine
          (à discuter avec l’opérateur).
        </p>
        <p>
          <strong>ALR :</strong> Aucune si voie fémorale.
          Discuter bloc cervical pour voie carotidienne,
          bloc serratus antérieur pour voie apicale.
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="tavi-augm-standard">
            <strong>Augmentin :</strong>
            2 g IVL, puis 1 g après 2 h (1 g toutes les 2 h).
          </li>
          <li id="tavi-augm-obese" style="display:none;">
            <strong>Augmentin (IMC &gt; 50) :</strong>
            4 g IVL, puis 2 g après 2 h (2 g toutes les 2 h).
          </li>
          <li id="tavi-vanco" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="tavi-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Imagerie (ETO/ETT)",
      html: `
        <p><strong>ETO :</strong> généralement non indiquée.</p>
        <p><strong>ETT en fin d’intervention :</strong></p>
        <ul>
          <li>Recherche d’épanchement péricardique</li>
          <li>Contrôle du fonctionnement de la prothèse valvulaire</li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "TAVI",
    sousTitre: "",
    image: "cardiostruct2.png",
    encadres,
  });

  expandPatientCharacteristics();
  setupAnesthGlobalDoseLogic();
  setupTaviLogic();
}

function setupTaviLogic() {
  const poidsId     = "tavi-poids";
  const cbImc       = document.getElementById("tavi-imc50");
  const cbAllergie  = document.getElementById("tavi-allergie-bl");
  const cbAG        = document.getElementById("tavi-ag");
  const cbRisk      = document.getElementById("tavi-induction-risque");
  const cbSeq       = document.getElementById("tavi-seq-rapide");

  const agOptions   = document.getElementById("tavi-ag-options");
  const lineInduction = document.getElementById("tavi-induction-line");
  const lineEntretien = document.getElementById("tavi-entretien-line");

  const liAugmStd   = document.getElementById("tavi-augm-standard");
  const liAugmObese = document.getElementById("tavi-augm-obese");
  const liVanco     = document.getElementById("tavi-vanco");
  const spanVanco   = document.getElementById("tavi-vanco-dose");

  // --- Anesthésie : sédation par défaut, AG si case cochée ---
  function updateAnesth() {
    const poids = parseKg(poidsId);

    if (!lineInduction || !lineEntretien) return;

    // Sédation (AG non cochée)
    if (!cbAG || !cbAG.checked) {
      if (agOptions) agOptions.style.display = "none";

      lineInduction.innerHTML = `
        <strong>Induction :</strong>
        — (anesthésie générale non prévue, procédure sous sédation).
      `;
      lineEntretien.innerHTML = `
        <strong>Entretien :</strong>
        Sédation AIVOC Rémifentanil (cibles 0,8–2 ng/mL)
        + anesthésie locale fémorale (Lidocaïne/Ropivacaïne).
      `;
      return;
    }

    // Anesthésie générale
    if (agOptions) agOptions.style.display = "";

    const etoDose = formatDoseMgPerKg(poids, 0.3);
    const atrDose = formatDoseMgPerKg(poids, 0.5);
    const rocDose = formatDoseMgPerKg(poids, 1.2);

    let inductionTxt = "<strong>Induction :</strong> ";
    if (cbRisk && cbRisk.checked) {
      inductionTxt += `Etomidate ${etoDose} + Sufentanil (AIVOC), `;
    } else {
      inductionTxt += "AIVOC Propofol/Sufentanil, ";
    }
    if (cbSeq && cbSeq.checked) {
      inductionTxt += `Rocuronium ${rocDose} (séquence rapide).`;
    } else {
      inductionTxt += `Atracurium ${atrDose}.`;
    }

    lineInduction.innerHTML = inductionTxt;
    lineEntretien.innerHTML = `
      <strong>Entretien :</strong>
      AIVOC Propofol/Sufentanil.
    `;
  }

  // --- ATB : IMC + Allergie BL (remplacement complet par Vancomycine) ---
  function updateATB() {
    const poids = parseKg(poidsId);

    if (cbAllergie && cbAllergie.checked) {
      if (liAugmStd)   liAugmStd.style.display = "none";
      if (liAugmObese) liAugmObese.style.display = "none";
      if (liVanco)     liVanco.style.display = "";
      if (spanVanco)   spanVanco.textContent = formatDoseMgPerKg(poids, 30);
      return;
    }

    if (liVanco) liVanco.style.display = "none";

    if (cbImc && cbImc.checked) {
      if (liAugmStd)   liAugmStd.style.display = "none";
      if (liAugmObese) liAugmObese.style.display = "";
    } else {
      if (liAugmStd)   liAugmStd.style.display = "";
      if (liAugmObese) liAugmObese.style.display = "none";
    }
  }

  function updateAll() {
    updateAnesth();
    updateATB();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);

  [cbImc, cbAllergie, cbAG, cbRisk, cbSeq].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionMitraClip() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <input type="number" id="mitra-poids" min="30" max="200" step="1" />
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="mitra-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="mitra-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="mitra-induction-risque" />
              Induction à risque (FEVG &lt; 50 % et IM sévère)
            </label>
            <label>
              <input type="checkbox" id="mitra-seq-rapide" />
              Séquence rapide
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, VVP x2 de bon calibre, PNI
          (remplacée par KTa radial si induction à risque),
          BIS ± NIRS, ETO.
        </p>
        <p><strong>Objectif IM :</strong> Plein, rapide, ouvert.</p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="mitra-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>
        <p id="fop-entretien-text">
          <strong>Entretien :</strong>
          AIVOC Propofol/Sufentanil
        </p>
        <p>
          <strong>Héparine</strong> 100 UI/kg
          (~<span data-per-kg="100" data-unit="UI"></span>),
          ACT cible 300–350 s.
        </p>
        <p>
          <strong>Protamine</strong> : généralement non indiquée
          (parfois 50 % de la dose d’héparine à la demande de l’opérateur).
        </p>
        <p><strong>ALR :</strong> Aucune.</p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="mitra-augm-standard">
            <strong>Augmentin :</strong>
            2 g IVL, puis 1 g après 2 h (1 g toutes les 2 h).
          </li>
          <li id="mitra-augm-obese" style="display:none;">
            <strong>Augmentin (IMC &gt; 50) :</strong>
            4 g IVL, puis 2 g après 2 h (2 g toutes les 2 h).
          </li>
          <li id="mitra-vanco" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="mitra-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
      html: `
        <p><strong>Caractérisation de l’IM :</strong></p>
        <ul>
          <li>
            Description et mécanisme de l’IM
          </li>
          <li>
            Quantification par Vena contracta
          </li>
          <li>
            Quantification par méthode PISA: SOR et VR
          </li>
          <li>
            Quantification par PHT (temps de 1/2 pression)
          </li>
          <li>
            Mesure du diamètre anneau mitral
          </li>
        </ul>
        <p><strong>Points complémentaires :</strong></p>
        <ul>
          <li>
            Vacuité auriculaire
          </li>
          <li>
            Echo-guidage de la ponction trans-septale
          </li>
          <li>
            Contrôle post-opératoire (IM résiduelle, FEVG, épanchement péricardique)
          </li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Mitra-clip",
    sousTitre: "",
    image: "cardiostruct2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  // met à jour les spans data-per-kg (Héparine) en fonction du poids
  setupAnesthGlobalDoseLogic();
  setupMitraClipLogic();
}

function setupMitraClipLogic() {
  const poidsId = "mitra-poids";
  const cbImc = document.getElementById("mitra-imc50");
  const cbAllergie = document.getElementById("mitra-allergie-bl");
  const cbRisk = document.getElementById("mitra-induction-risque");
  const cbSeq = document.getElementById("mitra-seq-rapide");

  const indText = document.getElementById("mitra-induction-text");
  const liAugmStd = document.getElementById("mitra-augm-standard");
  const liAugmObese = document.getElementById("mitra-augm-obese");
  const liVanco = document.getElementById("mitra-vanco");
  const spanVanco = document.getElementById("mitra-vanco-dose");

  function updateInduction() {
    const poids = parseKg(poidsId);
    const etoDose = formatDoseMgPerKg(poids, 0.3);
    const atrDose = formatDoseMgPerKg(poids, 0.5);
    const rocDose = formatDoseMgPerKg(poids, 1.2);

    let txt = "<strong>Induction :</strong> ";

    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${etoDose} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${rocDose} (séquence rapide).`;
    } else {
      txt += `Atracurium ${atrDose}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

 function updateATB() {
  const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liAugmStd)   liAugmStd.style.display   = "none";
    if (liAugmObese) liAugmObese.style.display = "";
  } else {
    if (liAugmStd)   liAugmStd.style.display   = "";
    if (liAugmObese) liAugmObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liAugmStd)   liAugmStd.style.display   = "none";
    if (liAugmObese) liAugmObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne version de l’Augmentin selon IMC
    if (cbImc && cbImc.checked) {
      if (liAugmStd)   liAugmStd.style.display   = "none";
      if (liAugmObese) liAugmObese.style.display = "";
    } else {
      if (liAugmStd)   liAugmStd.style.display   = "";
      if (liAugmObese) liAugmObese.style.display = "none";
    }
  }
}

  function updateAll() {
    updateInduction();
    updateATB();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);
  [cbImc, cbAllergie, cbRisk, cbSeq].forEach((el) => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionFOPCIA() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <input type="number" id="fop-poids" min="30" max="200" step="1" />
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="fop-imc50" />
              IMC &gt; 50 kg/m²
            </label>
            <label>
              <input type="checkbox" id="fop-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="fop-induction-risque" />
              Induction à risque (FEVG &lt; 30 %, valvulopathie sévère, HTAP)
            </label>
            <label>
              <input type="checkbox" id="fop-seq-rapide" />
              Séquence rapide
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p id="fop-monitor-text">
          Scope ECG 5 branches, SpO₂, VVP de bon calibre, PNI
          (KTa radial si induction à risque), BIS ± NIRS, ETO.
        </p>
      `,
    },
    {
      titre: "Anesthésie (anesthésie générale)",
      html: `
        <p id="fop-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>
        <p id="fop-entretien-text">
          <strong>Entretien :</strong>
          AIVOC Propofol/Sufentanil
        </p>
        <p>
          <strong>Héparine</strong> 100 UI/kg (ACT cible 300–350 s).<br>
          <strong>Protamine</strong> : généralement non indiquée
          (parfois 50&nbsp;% de la dose d’héparine à la demande de l’opérateur).
        </p>
        <p><strong>ALR :</strong> Aucune.</p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <ul>
          <li id="mitra-augm-standard">
            <strong>Augmentin :</strong>
            2 g IVL, puis 1 g après 2 h (1 g toutes les 2 h).
          </li>
          <li id="mitra-augm-obese" style="display:none;">
            <strong>Augmentin (IMC &gt; 50) :</strong>
            4 g IVL, puis 2 g après 2 h (2 g toutes les 2 h).
          </li>
          <li id="mitra-vanco" style="display:none;">
            <strong>Allergie BL :</strong>
            Vancomycine <span id="mitra-vanco-dose">30 mg/kg</span> IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
      html: `
        <p><strong>Évaluation ETO :</strong></p>
        <ul>
          <li>
            Visualisation du FOP / CIA, shunt droite-gauche, test aux microbulles
          </li>
          <li>
            Taille et morphologie du défect (localisation, bords, rapport avec les veines pulmonaires)
          </li>
          <li>
            Echo-guidage de la ponction / du positionnement du dispositif
          </li>
          <li>
            Contrôle final : shunt résiduel, épanchement péricardique,
            fonction VG/VD
          </li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Fermeture FOP / CIA",
    sousTitre: "",
    image: "cardiostruct2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  setupAnesthGlobalDoseLogic(); // si tu l’utilises pour d’autres doses
  setupFOPLogic();
}

function setupFOPLogic() {
  const poidsId = "fop-poids";
  const cbRisk = document.getElementById("fop-induction-risque");
  const cbSeq = document.getElementById("fop-seq-rapide");

  const indText = document.getElementById("fop-induction-text");
  const monitorText = document.getElementById("fop-monitor-text");

  function updateInduction() {
    const poids = parseKg(poidsId);
    const etoDose = formatDoseMgPerKg(poids, 0.3);
    const atrDose = formatDoseMgPerKg(poids, 0.5);
    const rocDose = formatDoseMgPerKg(poids, 1.2);

    let txt = "<strong>Induction :</strong> ";

    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${etoDose} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${rocDose} (séquence rapide).`;
    } else {
      txt += `Atracurium ${atrDose}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

function updateATB() {
  const poids = parseKg(poidsId);

  // --- Gestion IMC (si pas allergique) ---
  if (cbImc && cbImc.checked) {
    if (liAugmStd)   liAugmStd.style.display   = "none";
    if (liAugmObese) liAugmObese.style.display = "";
  } else {
    if (liAugmStd)   liAugmStd.style.display   = "";
    if (liAugmObese) liAugmObese.style.display = "none";
  }

  // --- Allergie BL : remplace totalement par Vancomycine ---
  if (cbAllergie && cbAllergie.checked) {
    if (liAugmStd)   liAugmStd.style.display   = "none";
    if (liAugmObese) liAugmObese.style.display = "none";
    if (liVanco)     liVanco.style.display     = "";
    if (spanVanco)   spanVanco.textContent     = formatDoseMgPerKg(poids, 30);
  } else {
    if (liVanco) liVanco.style.display = "none";

    // Réafficher la bonne version de l’Augmentin selon IMC
    if (cbImc && cbImc.checked) {
      if (liAugmStd)   liAugmStd.style.display   = "none";
      if (liAugmObese) liAugmObese.style.display = "";
    } else {
      if (liAugmStd)   liAugmStd.style.display   = "";
      if (liAugmObese) liAugmObese.style.display = "none";
    }
  }
}

  function updateMonitor() {
    if (!monitorText) return;
    if (cbRisk && cbRisk.checked) {
      monitorText.innerHTML = `
        Scope ECG 5 branches, SpO₂, KTa radial, BIS ± NIRS, ETO.
      `;
    } else {
      monitorText.innerHTML = `
        Scope ECG 5 branches, SpO₂, VVP de bon calibre, PNI, BIS ± NIRS, ETO.
      `;
    }
  }

  function updateAll() {
    updateInduction();
    updateMonitor();
    updateATB();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);
  [cbRisk, cbSeq].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionPacemakerDAI() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>
              <input type="checkbox" id="pm-allergie-bl" />
              Allergie aux bêta-lactamines
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="pm-retrait-sondes" />
              Retrait de sondes de PM/DAI anciennes
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p id="pm-monitor-text">
          Scope ECG 5 branches, SpO₂, VVP de bon calibre, PNI.
        </p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p id="pm-anesth-text">
          <strong>Options :</strong><br>
          - Sédation AIVOC Rémifentanil (cibles 0,8–2 ng/mL) + anesthésie locale par l’opérateur<br>
          - ou ALR bi-bloc (Serratus antérieur + PECS1 ou thoracique transverse)
            + anesthésie locale par l’opérateur<br>
          - ou anesthésie générale avec masque laryngé si intolérance, douleur,
            troubles cognitifs.
        </p>
        <p id="pm-retrait-text" style="font-style:italic;">
          Si retrait de sondes de PM/DAI anciennes : anesthésie générale
          systématique avec intubation oro-trachéale (idem protocole CEC).
        </p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `
        <p><strong>Uniquement si pose de matériel (non indiquée si retrait isolé) :</strong></p>
        <ul id="pm-atb-block">
          <li id="pm-cefa-standard">
            Céfazoline 2 g (+1 g priming CEC) puis 1 g toutes les 4 h.
          </li>
          <li id="pm-cefa-obese" style="display:none;">
            Céfazoline 4 g (+2 g priming CEC) puis 2 g toutes les 4 h
            (IMC &gt; 50).
          </li>
          <li id="pm-vanco" style="display:none;">
            Allergie BL : Vancomycine 30 mg/kg IVL,
            une injection 30 min avant incision.
          </li>
        </ul>
      `,
    },
    {
      titre: "Coupes et mesures ETO",
      html: `<p>Non indiquée.</p>`,
    },
  ];

  renderInterventionPage({
    titre: "Pacemaker & DAI",
    sousTitre: "Rythmologie",
    image: "cardiostruct2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  setupAnesthGlobalDoseLogic();
  setupPacemakerLogic();
}

function setupPacemakerLogic() {
  const cbAllergie = document.getElementById("pm-allergie-bl");
  const cbRetrait = document.getElementById("pm-retrait-sondes");
  const monitorText = document.getElementById("pm-monitor-text");
  const anesthText = document.getElementById("pm-anesth-text");
  const retraitText = document.getElementById("pm-retrait-text");
  const liCefaStd = document.getElementById("pm-cefa-standard");
  const liCefaObese = document.getElementById("pm-cefa-obese");
  const liVanco = document.getElementById("pm-vanco");

  // Ici pas de poids dans le tableau pour dosage mg/kg → on laisse la vancomycine à 30 mg/kg "sec".

  function updateMonitor() {
    if (!monitorText) return;
    if (cbRetrait && cbRetrait.checked) {
      monitorText.innerHTML = `
        KTa radial, KTc 5 voies JID, BIS ± NIRS, ETO.
      `;
    } else {
      monitorText.innerHTML = `
        Scope ECG 5 branches, SpO₂, VVP de bon calibre, PNI.
      `;
    }
  }

  function updateAnesth() {
    if (!anesthText || !retraitText) return;
    if (cbRetrait && cbRetrait.checked) {
      retraitText.style.display = "";
    } else {
      retraitText.style.display = "none";
    }
  }

  function updateATB() {
    // IMC > 50 n'est pas explicitement dans la cellule caracs pour cette ligne,
    // on garde donc les posologies textuelles, avec uniquement l'allergie :
    if (cbAllergie && cbAllergie.checked) {
      if (liVanco) liVanco.style.display = "";
    } else {
      if (liVanco) liVanco.style.display = "none";
    }
  }

  function updateAll() {
    updateMonitor();
    updateAnesth();
    updateATB();
  }

  [cbAllergie, cbRetrait].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

function renderInterventionAblationDroit() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `<p>Aucun critère particulier dans le protocole.</p>`,
    },
    {
      titre: "Monitorage",
      html: `
        <p>
          Scope ECG 5 branches, SpO₂, VVP de bon calibre, PNI.
        </p>
      `,
    },
    {
      titre: "Anesthésie",
      html: `
        <p>
          <strong>Sédation :</strong>
          AIVOC Rémifentanil (cibles 0,8–2 ng/mL)
          + anesthésie locale par l’opérateur.
        </p>
        <p>
          <strong>Héparine :</strong>
          généralement non indiquée, poursuite de l’AOD.<br>
          Si héparine : objectif ACT = 250 s.
        </p>
        <p><strong>ALR :</strong> Aucune.</p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `<p>Non indiquée.</p>`,
    },
    {
      titre: "Coupes et mesures ETO",
      html: `<p>Non indiquée.</p>`,
    },
  ];

  renderInterventionPage({
    titre: "Ablations du cœur droit",
    sousTitre: "Flutter commun, ESV / TV droites",
    image: "cardiostruct2.png",
    encadres,
  });
}

function renderInterventionAblationGauche() {
  const encadres = [
    {
      titre: "Caractéristiques patient",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <input type="number" id="ablg-poids" min="30" max="200" step="1" />
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="ablg-induction-risque" />
              Induction à risque (FEVG &lt; 30 %, valvulopathie sévère, HTAP)
            </label>
            <label>
              <input type="checkbox" id="ablg-seq-rapide" />
              Séquence rapide
            </label>
          </div>
        </div>
      `,
    },
    {
      titre: "Monitorage",
      html: `
        <p id="ablg-monitor-text">
          Scope ECG 5 branches, SpO₂, VVP de bon calibre, PNI
          (remplacer par KTa radial si induction à risque), BIS ± NIRS, ETO.
        </p>
      `,
    },
    {
      titre: "Anesthésie (anesthésie générale)",
      html: `
        <p id="ablg-induction-text">
          <strong>Induction :</strong>
          AIVOC Propofol/Sufentanil + Atracurium 0,5 mg/kg.
        </p>
        <p>
          <strong>Héparine</strong> 100 UI/kg (ACT cible 300–350 s).<br>
          <strong>Protamine</strong> : généralement non indiquée
          (parfois 50&nbsp;% de la dose d’héparine à la demande de l’opérateur).
        </p>
        <p><strong>ALR :</strong> Aucune.</p>
      `,
    },
    {
      titre: "Antibioprophylaxie",
      html: `<p>Non indiquée.</p>`,
    },
    {
      titre: "Coupes et mesures ETO",
      html: `
        <p><strong>ETO :</strong></p>
        <ul>
          <li>
            Vacuité auriculaire
          </li>
          <li>
            Echo-guidage de la ponction / trans-septale
          </li>
          <li>
            Contrôle post-opératoire : épanchement péricardique, fonction systolique VG
            (risque de choc cardiogénique si ablation de TV)
          </li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Ablations du cœur gauche",
    sousTitre: "Flutter gauche, FA, ESV / TV gauches",
    image: "cardiostruct2.png",
    encadres,
  });

  expandPatientCharacteristics(); 
  setupAnesthGlobalDoseLogic();
  setupAblationGaucheLogic();
}

function setupAblationGaucheLogic() {
  const poidsId = "ablg-poids";
  const cbRisk = document.getElementById("ablg-induction-risque");
  const cbSeq = document.getElementById("ablg-seq-rapide");

  const monitorText = document.getElementById("ablg-monitor-text");
  const indText = document.getElementById("ablg-induction-text");

  function updateMonitor() {
    if (!monitorText) return;
    if (cbRisk && cbRisk.checked) {
      monitorText.innerHTML = `
        Scope ECG 5 branches, SpO₂, KTa radial, BIS ± NIRS, ETO.
      `;
    } else {
      monitorText.innerHTML = `
        Scope ECG 5 branches, SpO₂, VVP de bon calibre, PNI, BIS ± NIRS, ETO.
      `;
    }
  }

  function updateInduction() {
    const poids = parseKg(poidsId);
    const etoDose = formatDoseMgPerKg(poids, 0.3);
    const atrDose = formatDoseMgPerKg(poids, 0.5);
    const rocDose = formatDoseMgPerKg(poids, 1.2);

    let txt = "<strong>Induction :</strong> ";

    if (cbRisk && cbRisk.checked) {
      txt += `Etomidate ${etoDose} + Sufentanil (AIVOC), `;
    } else {
      txt += "AIVOC Propofol/Sufentanil, ";
    }

    if (cbSeq && cbSeq.checked) {
      txt += `Rocuronium ${rocDose} (séquence rapide).`;
    } else {
      txt += `Atracurium ${atrDose}.`;
    }

    if (indText) indText.innerHTML = txt;
  }

  function updateAll() {
    updateMonitor();
    updateInduction();
  }

  const poidsEl = document.getElementById(poidsId);
  if (poidsEl) poidsEl.addEventListener("input", updateAll);
  [cbRisk, cbSeq].forEach(el => {
    if (el) el.addEventListener("change", updateAll);
  });

  updateAll();
}

// =====================================================================
//  RÉANIMATION 
// =====================================================================

function renderReanMenu() {
  $app.innerHTML = `
    <section class="rean-menu">
      <div class="hero">
        <h2>Protocoles de réanimation</h2>
      </div>

      <div class="grid rean-grid">

        <!-- 1. Formules -->
        <div class="card rean-card" onclick="location.hash = '#/reanimation/formules'">
          <img src="img/formules.png" alt="Formules" class="menu-section-img" />
          <h3>Formules</h3>
        </div>

        <!-- 2. Prescriptions post-opératoires -->
        <div class="card rean-card" onclick="renderReanPrescriptionsPostOp()">
          <img src="img/prescription.png" alt="Prescriptions post-opératoires" class="menu-section-img" />
          <h3>Prescriptions post-opératoires</h3>
        </div>

        <!-- 3. Saignements post-opératoires -->
        <div class="card rean-card" onclick="renderReanSaignementsPostOp()">
          <img src="img/saignement.png" alt="Saignements post-opératoires" class="menu-section-img" />
          <h3>Saignements post-opératoires</h3>
        </div>

        <!-- 4. FA post-opératoire -->
        <div class="card rean-card" onclick="renderReanFAPostOp()">
          <img src="img/fa.png" alt="FA post-opératoire" class="menu-section-img" />
          <h3>FA post-opératoire</h3>
        </div>

        <!-- 5. ETO (hors assistances) -->
        <div class="card rean-card" onclick="location.hash = '#/reanimation/eto'">
          <img src="img/eto.png" alt="Échocardiographie trans-œsophagienne" class="menu-section-img" />
          <h3>ETO (hors assistances)</h3>
        </div>

        <!-- 6. Antibiothérapies -->
        <div class="card rean-card" onclick="renderReanAntibiotherapieMenu()">
          <img src="img/antibiotherapie.png" alt="Antibiothérapie en réanimation" class="menu-section-img" />
          <h3>Antibiothérapies</h3>
        </div>

        <!-- 7. EER et échanges plasmatiques -->
        <div class="card rean-card" onclick="location.hash = '#/reanimation/eer'">
          <img src="img/dialyse.png" alt="EER et échanges plasmatiques" class="menu-section-img" />
          <h3>EER et échanges plasmatiques</h3>
        </div>

        <!-- 8. Transplantation cardiaque -->
        <div class="card rean-card" onclick="location.hash = '#/reanimation/transplantation'">
          <img src="img/transplantation.png" alt="Transplantation cardiaque" class="menu-section-img" />
          <h3>Transplantation cardiaque</h3>
        </div>

        <!-- 9. Assistances circulatoires -->
        <div class="card rean-card" onclick="location.hash = '#/reanimation/assistances'">
          <img src="img/assistances.png" alt="Assistances circulatoires" class="menu-section-img" />
          <h3>Assistances circulatoires</h3>
        </div>

      </div>
    </section>
  `;
}


/* ====================================================================
   RÉANIMATION – FORMULES
   (avec menu Ventilation / Cardio-vasculaire / Métabolique)
   ==================================================================== */

/* ============================================================
   MENU FORMULES
   ============================================================ */

function renderReanFormulesMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <div class="intervention-main">
        <div class="hero">
          <h2>Formules</h2>
        </div>

        <div class="grid">
          <button class="btn" onclick="renderReanFormulesVentilation()">
            Ventilation
          </button>

          <button class="btn" onclick="renderReanFormulesCardio()">
            Cardio-vasculaire
          </button>

          <button class="btn" onclick="renderReanFormulesMetabolique()">
            Métabolique
          </button>

          <button class="btn" onclick="renderReanFormulesNeuro()">
            Neurologie
          </button>
        </div>
      </div>

      <aside class="intervention-side">
        <img src="img/formules2.png" alt="Formules">
      </aside>

    </section>
  `;
}



/* ============================================================
   FORMULES – VENTILATION
   ============================================================ */

function renderReanFormulesVentilation() {
  const encadres = [
    {
      titre: "Volume courant 6 mL/kg",
      sousTitreEncadre: "",
      html: `
        <form class="form" oninput="calcVT6Compact()">
          <div style="height:6px;"></div>

          <div class="form-line">
            <label>Sexe</label>
            <select id="vtSexe">
              <option value="H">H</option>
              <option value="F">F</option>
            </select>
          </div>

          <div class="form-line">
            <label>Taille (cm)</label>
            <input id="vtTaille" type="number" min="120" max="230">
          </div>

          <p id="vtResult" class="form-result">Volume courant = —</p>
        </form>
      `,
    },

    {
      titre: "Espace mort fonctionnel",
      sousTitreEncadre: "",
      html: `
        <form class="form" oninput="calcEspaceMortCompact()">
          <div style="height:6px;"></div>

          <div class="form-line">
            <label>PaCO₂ (mmHg)</label>
            <input id="evPaCO2" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>EtCO₂ (mmHg)</label>
            <input id="evEtCO2" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>VT (mL)</label>
            <input id="evVt" type="number" step="1">
          </div>

          <p id="evResult" class="form-result">Espace mort = —</p>
        </form>
      `,
    },

    {
      titre: "Conversion du NO (ppm → L/min)",
      sousTitreEncadre: "",
      html: `
        <form class="form" oninput="calcNOCompact()">
          <div style="height:6px;"></div>

          <div class="form-line">
            <label>[NO] bouteille (ppm)</label>
            <input id="noBottle" type="number" min="1" max="5000">
          </div>

          <div class="form-line">
            <label>[NO] souhaité patient (ppm)</label>
            <input id="noPatient" type="number" min="1" max="200">
          </div>

          <div class="form-line">
            <label>VM (L/min)</label>
            <input id="noVM" type="number" step="0.1" min="1" max="20">
          </div>

          <p id="noResult" class="form-result">Débit de NO = —</p>
        </form>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Formules",
    image: "formules2.png",
    sousTitre: "Ventilation",
    encadres,
  });
}

function calcVT6Compact() {
  const sexe = document.getElementById("vtSexe").value;
  const taille = parseFloat(document.getElementById("vtTaille").value);
  const $res = document.getElementById("vtResult");

  if (!taille) {
    $res.textContent = "Volume courant = —";
    return;
  }

  const poidsIdeal =
    sexe === "H"
      ? 50 + 0.91 * (taille - 152.4)
      : 45.5 + 0.91 * (taille - 152.4);

  const vt = poidsIdeal * 6;

  $res.textContent = "Volume courant = " + vt.toFixed(0) + " mL";
}

function calcEspaceMortCompact() {
  const pa = parseFloat(document.getElementById("evPaCO2").value);
  const et = parseFloat(document.getElementById("evEtCO2").value);
  const vt = parseFloat(document.getElementById("evVt").value);
  const $res = document.getElementById("evResult");

  if (!pa || !et || !vt) {
    $res.textContent = "Espace mort = —";
    return;
  }

  const ratio = (pa - et) / pa;
  const espaceMort = ratio * vt;

  $res.textContent = "Espace mort = " + espaceMort.toFixed(0) + " mL";
}

function calcNOCompact() {
  const bottle = parseFloat(document.getElementById("noBottle").value);
  const patient = parseFloat(document.getElementById("noPatient").value);
  const VM = parseFloat(document.getElementById("noVM").value);
  const $res = document.getElementById("noResult");

  if (!bottle || !patient || !VM) {
    $res.textContent = "Débit de NO = —";
    return;
  }

  const debitNO = (patient * VM) / bottle;

  $res.textContent = "Débit de NO = " + debitNO.toFixed(3) + " L/min";
}


/* ============================================================
   FORMULES – CARDIO-VASCULAIRES
   ============================================================ */

function renderReanFormulesCardio() {
  const encadres = [
    {
      titre: "Débit cardiaque échographique",
      sousTitreEncadre: "",
      html: `
        <form class="form" oninput="calcDCEcho()">
          <div style="height:6px;"></div>

          <div class="form-line">
            <label>Diamètre CCVG (mm)</label>
            <input id="dcDiam" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>ITV CCVG (cm)</label>
            <input id="dcITV" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>FC (/min)</label>
            <input id="dcFC" type="number">
          </div>

          <p id="dcResult" class="form-result">Débit cardiaque = —</p>
        </form>
      `,
    },
    {
      titre: "Résistances vasculaires pulmonaires",
      sousTitreEncadre: "",
      html: `
        <form class="form" oninput="calcPVR()">
          <div style="height:6px;"></div>

          <div class="form-line">
            <label>PAPm (mmHg)</label>
            <input id="pvrPAPm" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>PAPO (mmHg)</label>
            <input id="pvrPOAP" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>DC (L/min)</label>
            <input id="pvrDC" type="number" step="0.1">
          </div>

          <p id="pvrResult" class="form-result">RVP = —</p>
        </form>
      `,
    },
    {
      titre: "DO₂ (apport en O₂)",
      sousTitreEncadre: "",
      html: `
        <form class="form" oninput="calcDO2()">
          <div style="height:6px;"></div>

          <div class="form-line">
            <label>Hb (g/dL)</label>
            <input id="doHb" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>SaO₂</label>
            <input id="doSaO2" type="number" step="0.01" placeholder="0.97">
          </div>

          <div class="form-line">
            <label>PaO₂ (mmHg)</label>
            <input id="doPaO2" type="number" step="1">
          </div>

          <div class="form-line">
            <label>DC (L/min)</label>
            <input id="doDC" type="number" step="0.1">
          </div>

          <p id="doResult" class="form-result">DO₂ = —</p>
        </form>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Formules",
    image: "formules2.png",
    sousTitre: "Cardio-vasculaires",
    encadres,
  });
}

// 1) Débit cardiaque échographique
function calcDCEcho() {
  const Dmm = parseFloat(document.getElementById("dcDiam").value);
  const ITV = parseFloat(document.getElementById("dcITV").value);
  const FC = parseFloat(document.getElementById("dcFC").value);
  const $res = document.getElementById("dcResult");

  if (!Dmm || !ITV || !FC) {
    $res.textContent = "Débit cardiaque = —";
    return;
  }

  const Dcm = Dmm / 10;
  const surface = Math.PI * Math.pow(Dcm / 2, 2);
  const VES = surface * ITV;
  const DC = (VES * FC) / 1000;

  $res.textContent = "Débit cardiaque = " + DC.toFixed(2) + " L/min";
}

// 2) RVP
function calcPVR() {
  const PAPm = parseFloat(document.getElementById("pvrPAPm").value);
  const POAP = parseFloat(document.getElementById("pvrPOAP").value);
  const DC = parseFloat(document.getElementById("pvrDC").value);
  const $res = document.getElementById("pvrResult");

  if (!PAPm || !POAP || !DC) {
    $res.textContent = "RVP = —";
    return;
  }

  const gradient = PAPm - POAP;

  if (gradient <= 0 || DC <= 0) {
    $res.textContent = "RVP = —";
    return;
  }

  const wood = gradient / DC;
  const dynes = wood * 80;

  $res.textContent =
    "RVP = " + wood.toFixed(2) + " UW (" + dynes.toFixed(0) + " dyn·s·cm⁻⁵)";
}

// 3) DO2
function calcDO2() {
  const Hb = parseFloat(document.getElementById("doHb").value);
  const SaO2 = parseFloat(document.getElementById("doSaO2").value);
  const PaO2 = parseFloat(document.getElementById("doPaO2").value);
  const DC = parseFloat(document.getElementById("doDC").value);
  const $res = document.getElementById("doResult");

  if (!Hb || !SaO2 || !PaO2 || !DC) {
    $res.textContent = "DO₂ = —";
    return;
  }

  const CaO2 = 1.34 * Hb * SaO2 + 0.0031 * PaO2;
  const DO2 = DC * CaO2 * 10;

  $res.textContent = "DO₂ = " + DO2.toFixed(0) + " mL/min";
}


/* ============================================================
   FORMULES – MÉTABOLIQUES
   ============================================================ */

function renderReanFormulesMetabolique() {
  const encadres = [
    {
      titre: "DFG (clairance mesurée)",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcDFG()">

          <div class="form-line">
            <label>Créat. urinaire (mmol/L)</label>
            <input id="dfgU" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>Volume des 24h (mL)</label>
            <input id="dfgV" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Créat. plasmatique (µmol/L)</label>
            <input id="dfgP" type="number" step="1">
          </div>

          <p id="dfgResult" class="form-result">DFG = —</p>
        </form>
      `,
    },

    {
      titre: "Osmolarité plasmatique",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcOsm()">

          <div class="form-line">
            <label>Na (mmol/L)</label>
            <input id="osmNa" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Glycémie (g/L)</label>
            <input id="osmGly" type="number" step="0.01">
          </div>

          <div class="form-line">
            <label>Urée (mmol/L)</label>
            <input id="osmUrea" type="number" step="0.1">
          </div>

          <p id="osmResult" class="form-result">Osmolarité = —</p>
        </form>
      `,
    },

    {
      titre: "Variation de volume intra-cellulaire (ICW)",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcICW()">

          <div class="form-line">
            <label>Na (mmol/L)</label>
            <input id="icwNa" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Poids (kg)</label>
            <input id="icwPoids" type="number" step="0.1">
          </div>

          <p id="icwResult" class="form-result">ΔICW = —</p>
        </form>
      `,
    },

    {
      titre: "Variation de volume plasmatique (Hte)",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcPV()">

          <div class="form-line">
            <label>Poids actuel (kg)</label>
            <input id="pvPoids" type="number" step="0.1">
          </div>

          <div class="form-line">
            <label>Hématocrite (%)</label>
            <input id="pvHte" type="number" step="0.1">
          </div>

          <p id="pvResult" class="form-result">ΔVP = —</p>
        </form>
      `,
    },

    {
      titre: "Sodium corrigé (hyperglycémie)",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcNaCorr()">

          <div class="form-line">
            <label>Na (mmol/L)</label>
            <input id="naCorrNa" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Glycémie (g/L)</label>
            <input id="naCorrGly" type="number" step="0.01">
          </div>

          <p id="naCorrResult" class="form-result">Na corrigé = —</p>
        </form>
      `,
    },

    {
      titre: "Calcium corrigé",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcCaCorr()">

          <div class="form-line">
            <label>Ca total (mmol/L)</label>
            <input id="caTot" type="number" step="0.01">
          </div>

          <div class="form-line">
            <label>Albumine (g/L)</label>
            <input id="alb" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Protidémie (g/L)</label>
            <input id="prot" type="number" step="1">
          </div>

          <p id="caCorrResult" class="form-result">Ca corrigé = —</p>
        </form>
      `,
    },

    {
      titre: "CVVH – Fraction de filtration",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcCVVH()">

          <div class="form-line">
            <label>Qsang (mL/min)</label>
            <input id="cvvhQs" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Qpré (mL/h)</label>
            <input id="cvvhQpre" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Qpost (mL/h)</label>
            <input id="cvvhQpost" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Pertes (mL/h)</label>
            <input id="cvvhPerte" type="number" step="1">
          </div>

          <p id="cvvhResult" class="form-result">FF = —</p>
        </form>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Formules",
    image: "formules2.png",
    sousTitre: "Métaboliques",
    encadres,
  });
}

/* ---------- 1) DFG = U × V / P ---------- */
function calcDFG() {
  const U = parseFloat(document.getElementById("dfgU").value);
  const V = parseFloat(document.getElementById("dfgV").value);
  const P = parseFloat(document.getElementById("dfgP").value);
  const $res = document.getElementById("dfgResult");

  if (!U || !V || !P) {
    $res.textContent = "DFG = —";
    return;
  }

  const dfg = (U * V * 1000) / (1440 * P);

  $res.textContent = "DFG = " + dfg.toFixed(1) + " mL/min";
}

/* ---------- 2) Osmolarité plasmatique ---------- */
function calcOsm() {
  const Na = parseFloat(document.getElementById("osmNa").value);
  const Gly = parseFloat(document.getElementById("osmGly").value);
  const Urea = parseFloat(document.getElementById("osmUrea").value);
  const $res = document.getElementById("osmResult");

  if (!Na || !Gly || !Urea) {
    $res.textContent = "Osmolarité = —";
    return;
  }

  const osm = 2 * Na + (Gly * 18) + Urea;

  $res.textContent = "Osmolarité = " + osm.toFixed(0) + " mOsm/L";
}

/* ---------- 3) Eau intracellulaire ---------- */
function calcICW() {
  const Na = parseFloat(document.getElementById("icwNa").value);
  const poids = parseFloat(document.getElementById("icwPoids").value);
  const $res = document.getElementById("icwResult");

  if (!Na || !poids) {
    $res.textContent = "ΔICW = —";
    return;
  }

  const icw = 0.4 * poids * (140 / Na - 1);

  $res.textContent = "ΔICW = " + icw.toFixed(1) + " L";
}

/* ---------- 4) Variation de volume plasmatique ---------- */
function calcPV() {
  const poids = parseFloat(document.getElementById("pvPoids").value);
  const HtePct = parseFloat(document.getElementById("pvHte").value);
  const $res = document.getElementById("pvResult");

  if (!poids || (!HtePct && HtePct !== 0)) {
    $res.textContent = "ΔVP = —";
    return;
  }

  const Hte = HtePct / 100;
  const delta = 0.2 * poids * (Hte / 0.45 - 1);

  let suffixe = " L";
  if (delta > 0) {
    suffixe += " (excès)";
  } else if (delta < 0) {
    suffixe += " (déficit)";
  }

  $res.textContent = "ΔVP = " + delta.toFixed(1) + suffixe;
}

/* ---------- 5) Sodium corrigé ---------- */
function calcNaCorr() {
  const Na = parseFloat(document.getElementById("naCorrNa").value);
  const Gly = parseFloat(document.getElementById("naCorrGly").value);
  const $res = document.getElementById("naCorrResult");

  if (!Na || !Gly) {
    $res.textContent = "Na corrigé = —";
    return;
  }

  const naCorr = Na + 1.6 * (Gly - 1);

  $res.textContent = "Na corrigé = " + naCorr.toFixed(1) + " mmol/L";
}

/* ---------- 6) Calcium corrigé ---------- */
function calcCaCorr() {
  const Ca = parseFloat(document.getElementById("caTot").value);
  const Alb = parseFloat(document.getElementById("alb").value);
  const Prot = parseFloat(document.getElementById("prot").value);
  const $res = document.getElementById("caCorrResult");

  if (!Ca) {
    $res.textContent = "Ca corrigé = —";
    return;
  }

  let CaCorr = null;

  if (Alb) {
    CaCorr = Ca + 0.02 * (40 - Alb);
  } else if (Prot) {
    CaCorr = Ca + 0.01 * (75 - Prot);
  }

  if (CaCorr === null) {
    $res.textContent = "Ca corrigé = —";
    return;
  }

  $res.textContent = "Ca corrigé = " + CaCorr.toFixed(2) + " mmol/L";
}

/* ---------- 7) CVVH — Fraction de filtration ---------- */
function calcCVVH() {
  const QsMin = parseFloat(document.getElementById("cvvhQs").value);
  const Qpre = parseFloat(document.getElementById("cvvhQpre").value);
  const Qpost = parseFloat(document.getElementById("cvvhQpost").value);
  const Pertes = parseFloat(document.getElementById("cvvhPerte").value);
  const $res = document.getElementById("cvvhResult");

  if (!QsMin || (!Qpre && Qpre !== 0) || (!Qpost && Qpost !== 0) || (!Pertes && Pertes !== 0)) {
    $res.textContent = "FF = —";
    return;
  }

  const Qs_h = QsMin * 60;
  const numerateur = Qpre + Qpost + Pertes;
  const denominateur = Qs_h + Qpre;

  if (denominateur <= 0) {
    $res.textContent = "FF = —";
    return;
  }

  const FF = (numerateur / denominateur) * 100;

  $res.textContent = "FF = " + FF.toFixed(1) + " % (N < 25%)";
}


/* ============================================================
   FORMULES – NEUROLOGIE
   ============================================================ */

function renderReanFormulesNeuro() {
  const encadres = [
    {
      titre: "Index de pulsatilité (IP)",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcIP()">

          <div class="form-line">
            <label>V systolique (cm/s)</label>
            <input id="ipVs" type="number" step="1">
          </div>

          <div class="form-line">
            <label>V diastolique (cm/s)</label>
            <input id="ipVd" type="number" step="1">
          </div>

          <div class="form-line">
            <label>V moyenne (cm/s)</label>
            <input id="ipVm" type="number" step="1">
          </div>

          <p id="ipResult" class="form-result">IP = —</p>

          <div style="font-size:0.85rem; margin-top:4px;">
            Normes : IP ≈ 0,6–1,1. IP ↑ en cas d’HTIC, vasospasme sévère, HTA maligne…
          </div>
        </form>
      `,
    },

    {
      titre: "Index de Lindegaard",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>
        <form class="form" oninput="calcLindegaard()">

          <div class="form-line">
            <label>Vm ACM (cm/s)</label>
            <input id="linVmAcm" type="number" step="1">
          </div>

          <div class="form-line">
            <label>Vm carotide interne (cm/s)</label>
            <input id="linVmCi" type="number" step="1">
          </div>

          <p id="linResult" class="form-result">Index de Lindegaard = —</p>

          <div style="font-size:0.85rem; margin-top:4px;">
            Normes : &lt; 3 : pas de vasospasme / 3–6 : vasospasme modéré / &gt; 6 : vasospasme sévère.
          </div>
        </form>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Formules",
    image: "formules2.png",
    sousTitre: "Neurologie",
    encadres,
  });
}

// ---------- IP = (Vsyst - Vdiast) / Vmoy ----------
function calcIP() {
  const Vs = parseFloat(document.getElementById("ipVs").value);
  const Vd = parseFloat(document.getElementById("ipVd").value);
  const Vm = parseFloat(document.getElementById("ipVm").value);
  const $res = document.getElementById("ipResult");

  if (!Vs || !Vd || !Vm || Vm === 0) {
    $res.textContent = "IP = —";
    return;
  }

  const IP = (Vs - Vd) / Vm;

  $res.textContent = "IP = " + IP.toFixed(2);
}

// ---------- Index de Lindegaard = Vm_ACM / Vm_CI ----------
function calcLindegaard() {
  const VmAcm = parseFloat(document.getElementById("linVmAcm").value);
  const VmCi = parseFloat(document.getElementById("linVmCi").value);
  const $res = document.getElementById("linResult");

  if (!VmAcm || !VmCi || VmCi === 0) {
    $res.textContent = "Index de Lindegaard = —";
    return;
  }

  const IL = VmAcm / VmCi;

  $res.textContent = "Index de Lindegaard = " + IL.toFixed(2);
}


/* ====================================================================
   RÉANIMATION – PRESCRIPTIONS POST-OP (page directe)
   ==================================================================== */

function renderReanPrescriptionsPostOp() {
  const encadres = [
    {
      titre: "Intervention chirurgicale",
  html: `
    <div class="form">
      <label>Intervention
        <select id="presc-intervention">
          <option value="pc">Pontages coronaires</option>
          <option value="rva">RVA</option>
          <option value="rvm">RVM</option>
          <option value="rvt-bio">RVT biologique</option>
          <option value="plastie-ao">Plastie aortique</option>
          <option value="plastie-mit">Plastie mitrale</option>
          <option value="plastie-tric">Plastie tricuspide</option>
          <option value="tsc">TSC (tube sus-coronaire)</option>
          <option value="tirone">Tirone-David</option>
          <option value="bentall">Bentall</option>
          <option value="crosse">Remplacement de crosse</option>
        </select>
      </label>

      <div class="row" id="presc-type-valve-row" style="margin-top:8px; display:none;">
        <label>Type de prothèse
          <select id="presc-type-valve">
            <option value="bio">Biologique</option>
            <option value="meca">Mécanique</option>
          </select>
        </label>
      </div>
    </div>

    <p style="margin-top:8px;">
      La sélection permet de contextualiser les prescriptions
      (anti-agrégants, anticoagulation, retrait des électrodes).
    </p>
      `,
    },
    {
      titre: "Analgésie",
      html: `
        <ul>
          <li>Paracétamol 1 g x4/j IVL ou PO</li>
          <li>Acupan 80–120 mg/j en IVSE</li>
          <li>Morphine (titration IV puis relais IVSE ou PO)</li>
          <li>Oxycodone 5 mg x6/j PO</li>
          <li>± Kétoprofène 50–100 mg x4/j IVL/PO (si pas de contre-indication)</li>
        </ul>
      `,
    },
    {
      titre: "Anti-agrégants plaquettaires",
      html: `
        <div id="presc-antiagg"></div>
      `,
    },
    {
      titre: "Anticoagulation",
      html: `
        <div id="presc-anticoag"></div>
      `,
    },
    {
      titre: "Retrait des drainages",
      html: `
        <ul>
          <li>Retrait dès 24 h post-op si &lt; 100 mL / 6 h et absence de bullage.</li>
          <li>Pas d’arrêt de l’anticoagulation, sauf surdosage.</li>
        </ul>
      `,
    },
    {
      titre: "Retrait des électrodes épicardiques",
      html: `
        <div id="presc-electrodes"></div>
      `,
    },
  ];
  
  renderInterventionPage({
    titre: "Prescriptions post-opératoires (hors transplant. et assistances)",
    sousTitre: "",
    image: "prescription2.png", 
    encadres,
  });

  expandPatientCharacteristics();  
  setupReanPrescLogic();
}

function setupReanPrescLogic() {
  const select = document.getElementById("presc-intervention");
  const typeRow = document.getElementById("presc-type-valve-row");
  const typeSelect = document.getElementById("presc-type-valve");

  const antiaggDiv = document.getElementById("presc-antiagg");
  const anticoagDiv = document.getElementById("presc-anticoag");
  const electrodesDiv = document.getElementById("presc-electrodes");

  // Groupe "coronaire / tube / RVA bio" :
  // - Aspirine + Kardégic systématiques
  // - Anticoagulation préventive
  // - Retrait électrodes J1
  const groupePréventif = new Set(["pc", "tsc", "rva-bio"]);

  function update() {
    // 1) valeur brute du select
    let val = select ? select.value : "pc";

    // 2) Afficher ou non le choix Bio/Méca
    const besoinTypeValve =
      val === "rva" || val === "rvm" || val === "bentall";

    if (typeRow) {
      typeRow.style.display = besoinTypeValve ? "" : "none";
    }

    // 3) Si RVA / RVM / Bentall → on fabrique une clé "rva-bio" / "rva-meca"…
    if (besoinTypeValve) {
      const t = typeSelect ? typeSelect.value : "bio"; // défaut bio
      val = `${val}-${t}`;                             // ex: "rva-bio"
    }

    const estGroupePréventif = groupePréventif.has(val);

    // === 1/ Anti-agrégants plaquettaires ===
    if (antiaggDiv) {
      if (estGroupePréventif) {
        // Pontages, TSC, RVA biologique → Aspirine/Kardégic systématiques
        antiaggDiv.innerHTML = `
          <ul>
            <li>Aspirine 100 mg IVL à H+6 puis Kardégic 75 mg/j PO.</li>
            <li>Bi-antiagrégation plaquettaire selon indication
                (stent récent, NSTEMI, etc.) à reprendre après retrait des électrodes.</li>
          </ul>
        `;
      } else {
        // Autres interventions → à mettre si coronarien ou présent en pré-op
        antiaggDiv.innerHTML = `
          <ul>
            <li>Aspirine 100 mg IVL H+6 puis Kardégic 75 mg/j PO
                si patient coronarien ou si déjà présent en pré-opératoire.</li>
            <li>Bi-antiagrégation plaquettaire uniquement selon indication
                (stent récent, NSTEMI, etc.), à reprendre après retrait des électrodes.</li>
          </ul>
        `;
      }
    }

    // === 2/ Anticoagulation ===
    if (anticoagDiv) {
      if (estGroupePréventif) {
        // Pontages, TSC, RVA bio → anticoag préventive
        anticoagDiv.innerHTML = `
          <ul>
            <li>Lovenox 4000 UI SC à H+6.</li>
            <li>Ensuite : anticoagulation préventive :
                Lovenox 4000 UI x1/j SC
                (HNF ou Calciparine si DFG &lt; 15 mL/min/1,73m²).</li>
          </ul>
        `;
      } else {
        // Autres (valvulaires, aorte…) → schéma thérapeutique
        anticoagDiv.innerHTML = `
          <ul>
            <li>Lovenox 4000 UI SC à H+6.</li>
            <li>Ensuite : anticoagulation efficace :
                Lovenox 100 UI/kg x2/j dès J1
                (HNF IVSE si DFG &lt; 15 mL/min/1,73m²).</li>
          </ul>
        `;
      }
    }

    // === 3/ Retrait des électrodes épicardiques ===
    if (electrodesDiv) {
      if (estGroupePréventif) {
        // Pontages + TSC + RVA bio → J1
        electrodesDiv.innerHTML = `
          <ul>
            <li>En l’absence de trouble de conduction :</li>
            <li>Retrait possible dès J1.</li>
            <li>Arrêt systématique des anticoagulants
                (même préventifs) pour le retrait.</li>
          </ul>
        `;
      } else {
        // Tout le reste (valvules mécaniques / aorte…) → J4
        electrodesDiv.innerHTML = `
          <ul>
            <li>En l’absence de trouble de conduction :</li>
            <li>Retrait à partir de J4 (chirurgie valvulaire / aortique).</li>
            <li>Arrêt systématique des anticoagulants
                (même préventifs) pour le retrait.</li>
          </ul>
        `;
      }
    }
  }

  if (select) select.addEventListener("change", update);
  if (typeSelect) typeSelect.addEventListener("change", update);
  update();
}


/* ====================================================================
   RÉANIMATION – SAIGNEMENTS POST-OP (page directe)
   ==================================================================== */

function renderReanSaignementsPostOp() {
  const encadres = [
    {
      titre: "Objectifs",
      html: `
        <p><strong>Objectifs transfusionnels :</strong></p>
        <ul>
          <li>TP &gt; 50 %</li>
          <li>Fibrinogène &gt; 2 g/L</li>
          <li>Plaquettes &gt; 50 000/mm³
              (bi-AAP ou très haut risque hémorragique : &gt; 100 000/mm³)</li>
          <li>Hb 7–8 g/dL</li>
          <li>Privilégier la transfusion de PSL sur réchauffeur thermique (sauf plaquettes).</li>
        </ul>
        <p><strong>Autres objectifs :</strong></p>
        <ul>
          <li>PAM &gt; 60–65 mmHg</li>
          <li>Température &gt; 36 °C</li>
          <li>Ca ionisé &gt; 1,10</li>
          <li>pH &gt; 7,30</li>
        </ul>
      `,
    },
    {
      titre: "Hémostase médicale basée sur le Quantra",
      html: `
        <p>Utilisation des différents tests (CTR, fibrinogène, plaquettes…) pour guider :</p>
        <ul>
          <li>CTR > 1,4: Protamine 30 UI/kg</li>
          <li>FCS < 1,9 hPa (fibrinogène < 2g/L): fibrinogène 20-50mg/kg</li>
          <li>PCS < 14,2 hPa (Pl < 100 G/L) ou  < 11,2 hPa (Pl < 50 G/L): 1 CPA 1 UI/8-10kg</li>
          <li>CT > 189s avec CTR < 1,4: PFC pour expansion volémique, sinon PPSB 20-25 UI/kg</li>
        </ul>
        <p>Si tests normaux et saignement persistant : discuter reprise chirurgicale. En dernier recours: Novoseven 90µg/kg.</p>
      `,
    },
    {
      titre: "Indications de reprise chirurgicale",
      html: `
        <p><strong>Reprise chirurgicale si :</strong></p>
        <ul>
          <li>&gt; 400 mL la 1ʳᵉ heure</li>
          <li>OU &gt; 200 mL/h sur 2 h</li>
          <li>OU &gt; 100 mL/h sur 4 h</li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Saignements post-opératoires",
    sousTitre: "",
    image: "saignement2.png", 
    encadres,
  });
}

/* ====================================================================
   RÉANIMATION – FA POST-OP (page directe + logique choix)
   ==================================================================== */

function renderReanFAPostOp() {
  const encadres = [
    {
      titre: "Traitement préventif de la FAPO",
      html: `
        <p><strong>Contrôle des facteurs favorisants :</strong></p>
        <ul>
          <li>Corriger hypovolémie, troubles ioniques, hypoxémie, infections.</li>
          <li>Limiter les inotropes positifs au strict nécessaire.</li>
        </ul>
        <p><strong>Traitement anti-arythmique:</strong></p>
        <div class="form">
          <label>
            <input type="checkbox" id="fa-catecholamines" />
            Catécholamines en cours
          </label>
          <label>
            <input type="checkbox" id="fa-bb-preop" />
            Bêta-bloquant pré-opératoire
          </label>
        </div>
        <div id="fa-preventif-reco"></div>
      `,
    },
    {
  titre: "Traitement curatif de la FAPO",
  html: `
        <p><strong>Stratégie de traitement de la FAPO :</strong></p>
        <div class="form">
          <label>
            <input type="checkbox" id="fa-mauvaise-tolerance" />
            Mauvaise tolérance (hémodynamique, neurologique, respiratoire…)
          </label>
          <label>
            <input type="checkbox" id="fa-ci-anticoag" />
            Contre-indication à l'anticoagulation
          </label>
        </div>
        <div id="fa-curatif-reco"></div>
      `,
},
    {
      titre: "Anticoagulation",
      html: `
        <p><strong>Principes :</strong></p>
        <ul>
          <li>Pendant les premières 48 h : discussion au cas par cas selon CHADS-VASc et risque hémorragique.</li>
          <li>Après 48 h de FA post-opératoire : anticoagulation systématique sauf contre-indication.</li>
          <li>Durée : au moins 4 à 6 semaines puis réévaluation.</li>
          <li>
  <span style="cursor:pointer; color:#0077cc;" onclick="openChadsVascImage()">
    Voir le score CHA₂DS₂-VASc <span style="font-size:18px;">🖼️</span>
  </span>
</li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Prise en charge de la FA post-opératoire",
    sousTitre: "",
    image: "fa2.png",   // 👈 nouvelle ligne : image juste sous le titre
    encadres,
  });

  setupReanFALogic();
}

function setupReanFALogic() {
  // Prévention (déjà existant)
  const cbCatechol = document.getElementById("fa-catecholamines");
  const cbBBpreop = document.getElementById("fa-bb-preop");
  const recoPrev = document.getElementById("fa-preventif-reco");

  // Curatif (nouveaux critères)
  const cbMauvaiseTol = document.getElementById("fa-mauvaise-tolerance");
  const cbCiAnticoag = document.getElementById("fa-ci-anticoag");
  const recoCur = document.getElementById("fa-curatif-reco");

  // --- Préventif : inchangé dans l'esprit ---
  function updatePreventif() {
    if (!recoPrev) return;

    let html = "<p><strong>Proposition de prévention :</strong></p><ul>";

    if (cbCatechol && cbCatechol.checked) {
      html += `
        <li>Catécholamines en cours : privilégier l'Amiodarone
            (ex. 5 mg/kg x2/j PO ou ≈ 10 mg/kg/j IVSE si PO impossible).</li>
      `;
    } else if (cbBBpreop && cbBBpreop.checked) {
      html += `
        <li>Patient déjà sous bêta-bloquant : reprise du bêta-bloquant habituel
            dès que possible (en l’absence de contre-indication).</li>
      `;
    } else {
      html += `
        <li>Pas de BB pré-op ni catécholamines :
          envisager l’initiation d’un bêta-bloquant
          (ex. Carvédilol 6,25 mg x2/j ou Métoprolol 25 mg x2/j)
          si pas de contre-indication.</li>
      `;
    }

    html += "</ul>";
    recoPrev.innerHTML = html;
  }

  // --- Curatif : nouvelle logique FAPO ---
  function updateCuratif() {
    if (!recoCur) return;

    const mauvaiseTol = cbMauvaiseTol && cbMauvaiseTol.checked;
    const ciAnticoag = cbCiAnticoag && cbCiAnticoag.checked;

    let html = "<p><strong>1) Stratégie de traitement :</strong></p><ul>";

    if (!mauvaiseTol && !ciAnticoag) {
      // Cas simple : aucune case cochée → contrôle de la fréquence
      html += `
        <li>
          Stratégie de contrôle de la fréquence (&lt; 110/min) :
          bêta-bloquant, inhibiteur calcique
          (CI si FEVG altérée), ou Digoxine.
        </li>
      `;
    } else {
      // Au moins un critère → contrôle du rythme
      html += `
        <li>
          Stratégie de contrôle du rythme :
          réduction de la FAPO (CEE et/ou Amiodarone selon la tolérance)
          et entretien par Amiodarone PO ou IVSE.
        </li>
      `;
    }

    html += "</ul>";

    // Bloc commun : contrôle des facteurs favorisants
    html += `
      <p><strong>2) Contrôle systématique des facteurs favorisants :</strong></p>
      <ul>
        <li>Hypovolémie, troubles ioniques, hypoxémie, infections.</li>
        <li>Inotropes positifs : arrêt ou réduction si non indispensables.</li>
      </ul>
    `;

    recoCur.innerHTML = html;
  }

  // Listeners
  if (cbCatechol) cbCatechol.addEventListener("change", updatePreventif);
  if (cbBBpreop) cbBBpreop.addEventListener("change", updatePreventif);

  if (cbMauvaiseTol) cbMauvaiseTol.addEventListener("change", updateCuratif);
  if (cbCiAnticoag) cbCiAnticoag.addEventListener("change", updateCuratif);

  // Init
  updatePreventif();
  updateCuratif();
}

function openChadsVascImage() {
  const overlay = document.createElement("div");
  overlay.className = "img-overlay";

  overlay.innerHTML = `
    <div class="img-overlay-content">
      <img src="img/chadsvasc.png" alt="Score CHA2DS2-VASc 🖼️️" />
      <button class="close-btn" onclick="this.parentElement.parentElement.remove()">✖</button>
    </div>
  `;

  document.body.appendChild(overlay);
}

/* ====================================================================
   RÉANIMATION – ETO
   ==================================================================== */

// Pour la RÉA : extrait seulement la liste <ul class="eto-list">...</ul>
// à partir du HTML complet renvoyé par etoHtmlXXX()
function stripEtoWrapper(html) {
  if (!html) return html;

  const ulStart = html.indexOf('<ul class="eto-list">');
  if (ulStart === -1) {
    // Si on ne trouve pas la liste, on renvoie tel quel
    return html;
  }

  const ulEnd = html.indexOf("</ul>", ulStart);
  if (ulEnd === -1) {
    return html;
  }

  const inner = html.slice(ulStart, ulEnd + "</ul>".length);

  // On remet juste un petit <section> autour pour garder le style
  return `
    <section class="eto-section">
      ${inner}
    </section>
  `.trim();
}

function renderReanEto() {
  const encadres = [
    {
      titre: "Fonction systolique VG",
      html: stripEtoWrapper(etoHtmlFonctionVG()),
    },
    {
      titre: "Cinétique segmentaire du VG",
      html: stripEtoWrapper(etoHtmlVGSegmentaire()),
    },
    {
      titre: "Valve aortique",
      html: stripEtoWrapper(etoHtmlValveAortique()),
    },
    {
      titre: "Valve mitrale",
      html: stripEtoWrapper(etoHtmlValveMitrale()),
    },
    {
      titre: "PTDVG (Fonction diastolique VG)",
      html: stripEtoWrapper(etoHtmlPTDVG()),
    },
    {
      titre: "Fonction systolique du VD",
      html: stripEtoWrapper(etoHtmlFonctionVD()),
    },
    {
      titre: "Evaluation d'une HTAP",
      html: stripEtoWrapper(etoHtmlHTAP()),
    },
  ];

  renderInterventionPage({
    titre: "Échocardiographie trans-œsophagienne",
    sousTitre: "",
    image: "eto.png",
    encadres,
  });
}

function openImg(name) {
  document.getElementById("popup-img").src = `img/${name}`;
  document.getElementById("img-popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("img-popup").style.display = "none";
}

function openVideo(src) {
  const modal = document.createElement("div");
  modal.className = "img-modal";

  modal.innerHTML = `
    <div class="img-modal-content">
      <video class="eto-video" autoplay muted loop controls playsinline>
        <source src="img/${src}" type="video/mp4">
      </video>
    </div>
  `;

  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}


/* ====================================================================
   RÉANIMATION – EER & ÉCHANGES PLASMATIQUES (MENU + sous-pages)
   ==================================================================== */

function renderReanEerMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <div class="intervention-main">
        <div class="hero">
          <h2>EER et échanges plasmatiques</h2>
        </div>

        <div class="grid">
          <button class="btn" onclick="renderReanEerPostOp()">
            EER post-opératoire
          </button>
          <button class="btn" onclick="renderReanEchangesPlasmatiques()">
            Echanges plasmatiques
          </button>
        </div>
      </div>

      <aside class="intervention-side">
        <img src="img/dialyse2.png" alt="EER et échanges plasmatiques">
      </aside>

    </section>
  `;
}


// --- EER post-opératoire (indications, abord, CVVH)

function renderReanEerPostOp() {
  const encadres = [
    {
      titre: "Indications d’EER en réanimation chirurgicale",
      html: `
        <p><strong>Indications absolues :</strong></p>
        <ul>
          <li>Acidose métabolique &lt; 7,20 anurique</li>
          <li>OAP anurique</li>
          <li>Hyperkaliémie &gt; 6,5 mmol/L ou avec troubles du rythme</li>
          <li>Complications urémiques (neurologiques, cardiaques…)</li>
        </ul>
        <p><strong>Indications relatives :</strong></p>
        <ul>
          <li>Urée &gt; 30 mmol/L, créatininémie &gt; 300 µmol/L</li>
          <li>Acidose métabolique ou OAP sans critères absolus</li>
          <li>Troubles ioniques sévères (Ca &gt; 4 mmol/L, hyponatrémie symptomatique…)</li>
        </ul>
      `,
    },
    {
  titre: "Abord vasculaire",
  html: `
    <p><strong>Abord vasculaire :</strong></p>
    <ul>
      <li>Jugulaire interne droite (prioritaire)</li>
      <li>Fémorale</li>
      <li>Jugulaire interne gauche</li>
    </ul>

    <p style="margin-top:8px;">
      <strong>Si ECMO VA :</strong>
    </p>
    <ul>
      <li>
        Possibilité de branchement entre la pompe centrifuge et l’oxygénateur
        (<span class="img-link" onclick="openImg('eerecmo.png')">
          Cf schéma 🖼️️
        </span>).
      </li>
      <li>
        Attention : <strong>pas de restitution totale du volume sanguin</strong>
        (risque de bullage).
      </li>
    </ul>
  `,
},
    {
      titre: "Prescription CVVH Prismaflex (calculateur)",
      html: `
        <div class="form">
          <div class="row">
            <label>Sexe
              <select id="cvvh-sexe">
                <option value="H">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>
            <label>Poids réel (kg)
              <input type="number" id="cvvh-poids" min="35" max="200" step="1" />
            </label>
            <label>Taille (cm)
              <input type="number" id="cvvh-taille" min="140" max="210" step="1" />
            </label>
          </div>
        </div>
        <div id="cvvh-resultats"></div>
        <p style="margin-top:8px;font-size:0.9em;opacity:0.8;">
          Le calculateur utilise un <strong>poids corrigé</strong> :
          poids idéal (formule de Devine) puis poids ajusté si obésité,
          puis applique les paliers de débit sang / réinjection du protocole
          (40–50 kg : 110/1000, 50–60 kg : 120/1000, 60–70 kg : 130/1000,
          70–80 kg : 140/1300, 80–90 kg : 150/1500, 90–100 kg : 160/1700,
          100–110 kg : 170/1800, 110–120 kg : 180/2000, &gt; 120 kg : 190/2200).
        </p>
      `,
    },
    {
  titre: "Adaptation posologique des antibiotiques sous CVVH",
  html: `
    <p>
      Pour adapter la posologie des antibiotiques chez un patient sous CVVH,
      tu peux utiliser directement l’outil d’<strong>adaptation rénale des antibiotiques</strong>.
    </p>
    <p style="margin-top:8px;">
      <button class="btn outline" type="button" onclick="openAtbReinCVVH()">
        Ouvrir l’outil "Adaptation rénale" (CVVH pré-sélectionné)
      </button>
    </p>
  `,
},
  ];

  renderInterventionPage({
    titre: "EER et échanges plasmatiques",
    sousTitre: "EER post-opératoire",
    image: "dialyse2.png",
    encadres,
  });

  setupCvvhPrismaflexLogic();
}

function openAtbReinCVVH() {
  // 1) Menu principal ATB
  renderReanAntibiotherapieMenu();

  // 2) Section "Adaptation rénale"
  if (typeof renderReinForm === "function") {
    renderReinForm();
  }

  // 3) On attend la fin du rendu AVANT de sélectionner CVVH
  setTimeout(() => {
    const select = document.getElementById("rein-fonction");
    if (select) {
      select.value = "cvvh";       // valeur exacte que tu m'as confirmée
      select.dispatchEvent(new Event("change"));
    }
  }, 150);  // ⬅ garanti que le DOM est prêt
}


function setupCvvhPrismaflexLogic() {
  const sexeEl = document.getElementById("cvvh-sexe");
  const poidsEl = document.getElementById("cvvh-poids");
  const tailleEl = document.getElementById("cvvh-taille");
  const resultDiv = document.getElementById("cvvh-resultats");

  function getNumber(el) {
    if (!el) return null;
    const v = parseFloat((el.value || "").replace(",", "."));
    return isNaN(v) ? null : v;
  }

  // Poids idéal (Devine, version métrique)
  // Homme : 50 + 0,9 × (taille(cm) – 152)
  // Femme : 45,5 + 0,9 × (taille(cm) – 152)
  // Poids corrigé : si poids réel > poids idéal -> PI + 0,4 × (PR – PI), sinon PR.
  function calcPoidsCorrige(sexe, poidsReel, taille) {
    if (!sexe || !poidsReel || !taille) return null;
    const deltaT = Math.max(0, taille - 152);
    const poidsIdeal =
      sexe === "H"
        ? 50 + 0.9 * deltaT
        : 45.5 + 0.9 * deltaT;

    if (poidsReel <= poidsIdeal) return poidsReel;
    return poidsIdeal + 0.4 * (poidsReel - poidsIdeal);
  }

  function getDebitsFromPoids(pCorrige) {
    if (!pCorrige) return null;

    const p = pCorrige;

    // Paliers du protocole
    if (p >= 40 && p < 50) return { qs: 110, reinj: 1000 };
    if (p >= 50 && p < 60) return { qs: 120, reinj: 1000 };
    if (p >= 60 && p < 70) return { qs: 130, reinj: 1000 };
    if (p >= 70 && p < 80) return { qs: 140, reinj: 1300 };
    if (p >= 80 && p < 90) return { qs: 150, reinj: 1500 };
    if (p >= 90 && p < 100) return { qs: 160, reinj: 1700 };
    if (p >= 100 && p < 110) return { qs: 170, reinj: 1800 };
    if (p >= 110 && p < 120) return { qs: 180, reinj: 2000 };
    if (p >= 120) return { qs: 190, reinj: 2200 };

    // < 40 kg : en dehors de la plage définie
    return null;
  }

  function update() {
    const sexe = sexeEl ? sexeEl.value : "H";
    const poidsReel = getNumber(poidsEl);
    const taille = getNumber(tailleEl);

    if (!sexe || !poidsReel || !taille) {
      if (resultDiv) {
        resultDiv.innerHTML = "<p>Renseigner le sexe, le poids réel et la taille.</p>";
      }
      return;
    }

    const pCorrige = calcPoidsCorrige(sexe, poidsReel, taille);
    const debits = getDebitsFromPoids(pCorrige);

    if (!debits) {
      if (resultDiv) {
        resultDiv.innerHTML = `
          <p>Poids corrigé estimé : ${pCorrige.toFixed(1)} kg.</p>
          <p>Aucun palier défini pour &lt; 40 kg dans ce protocole.
             Merci d'adapter manuellement.</p>
        `;
      }
      return;
    }

    if (resultDiv) {
      resultDiv.innerHTML = `
        <p><strong>Résultats CVVH Prismaflex :</strong></p>
        <ul>
          <li>Poids corrigé estimé : <strong>${pCorrige.toFixed(1)} kg</strong></li>
          <li>Débit sang : <strong>${debits.qs} mL/min</strong></li>
          <li>Débit réinjection : <strong>${debits.reinj} mL/h</strong></li>
          <li>Pré/Post : <strong>Post</strong></li>
          <li>Dose citrate : <strong>2,8 mmol/L</strong></li>
          <li>Complément Calcium : <strong>110 %</strong></li>
          <li>Perte patient : <strong>0–250 mL/h</strong> selon clinique</li>
        </ul>
      `;
    }
  }

  [sexeEl, poidsEl, tailleEl].forEach(el => {
    if (el) el.addEventListener("input", update);
  });

  update();
}



// --- Échanges plasmatiques (calculateur + paramétrage)

function renderReanEchangesPlasmatiques() {
  const encadres = [
    {
      titre: "Volume à échanger (Calculateur)",
      html: `
        <div class="form">
          <div class="row">
            <label>Sexe
              <select id="ep-sexe">
                <option value="H">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>
            <label>Poids (kg)
              <input type="number" id="ep-poids" min="30" max="200" step="1" />
            </label>
          </div>
          <div class="row">
            <label>Hématocrite (%) 
              <input type="number" id="ep-ht" min="15" max="60" step="1" />
            </label>
            <label>Type d’EP
              <select id="ep-type">
                <option value="preventif">Préventif (1,3 × MS)</option>
                <option value="curatif">Curatif (1,5 × MS)</option>
              </select>
            </label>
          </div>
          <div class="row">
            <label>TP (%)
              <input type="number" id="ep-tp" min="0" max="150" step="1" />
            </label>
          </div>
        </div>
        <div id="ep-resultats"></div>
        <p style="margin-top:8px;">
          Rappel de l’algorithme (issu du tableau) :<br>
          1/ Préventif = 1,3 × Masse sanguine (MS)<br>
          2/ Curatif = 1,5 × MS<br>
          3/ MS (mL) = (100 – Ht %) × 0,7 × poids (kg)<br>
          4/ Volume à traiter réparti en 1/3 Albumine 5 % et 2/3 PFC,<br>
             <em>sauf</em> EP curatif + TP &gt; 50 % : 1/2 Albumine, 1/2 PFC.
        </p>
      `,
    },
    {
  titre: "Paramétrage habituel",
  html: `
    <ul>
      <li>Débit sang = 400–450 mL/min</li>
      <li>Débit de réinjection : ajusté pour garder FF &lt; 30 % et Hte post-filtre &lt; 55 %</li>
      <li>Pré-pompe sang = 0 mL/h</li>
      <li>Perte patient = 0 mL/h (EP isolé)</li>
    </ul>
  `,
},
{
  titre: "Bilans biologiques à prévoir",
  html: `
    <ul>
      <li>Ionogramme sanguin avec Ca/Mg avant et après chaque séance d’EP</li>
      <li>Hémostase (TP, fibrinogène principalement) avant et après chaque séance</li>
      <li>Tube sec pour dosage des Ac anti-HLA après chaque série d’EP</li>
    </ul>
  `,
},

  ];

  renderInterventionPage({
    titre: "EER et échanges plasmatiques",
    sousTitre: "Échanges plasmatiques",
    image: "dialyse2.png",
    encadres,
  });

  setupEchangesPlasmatiquesLogic();
}

function setupEchangesPlasmatiquesLogic() {
  const poidsInput = document.getElementById("ep-poids");
  const htInput = document.getElementById("ep-ht");
  const typeSelect = document.getElementById("ep-type");
  const tpInput = document.getElementById("ep-tp");
  const resultDiv = document.getElementById("ep-resultats");

  function getNumber(el) {
    if (!el) return null;
    const v = parseFloat((el.value || "").replace(",", "."));
    return isNaN(v) ? null : v;
  }

  function update() {
    const poids = getNumber(poidsInput);
    const ht = getNumber(htInput);
    const tp = getNumber(tpInput);
    const type = typeSelect ? typeSelect.value : "preventif";

    if (!poids || !ht) {
      if (resultDiv) {
        resultDiv.innerHTML = "<p>Renseigner au minimum le poids et l'hématocrite.</p>";
      }
      return;
    }

    const masseSanguine = (100 - ht) * 0.7 * poids; // mL
    const coef = type === "curatif" ? 1.5 : 1.3;
    const volumeAEchanger = masseSanguine * coef; // mL

    let fracAlb = 1 / 3;
    let fracPFC = 2 / 3;
    if (type === "curatif" && tp && tp > 50) {
      fracAlb = 0.5;
      fracPFC = 0.5;
    }

    const volAlb = volumeAEchanger * fracAlb;
    const volPFC = volumeAEchanger * fracPFC;

    if (resultDiv) {
      resultDiv.innerHTML = `
        <p><strong>Résultats :</strong></p>
        <ul>
          <li>Masse sanguine estimée : ~${(masseSanguine / 1000).toFixed(2)} L</li>
          <li>Volume à échanger (${type === "curatif" ? "curatif 1,5 × MS" : "préventif 1,3 × MS"}) :
              ~${(volumeAEchanger / 1000).toFixed(2)} L</li>
          <li>Albumine 5 % : ~${(volAlb / 1000).toFixed(2)} L</li>
          <li>PFC : ~${(volPFC / 1000).toFixed(2)} L</li>
        </ul>
      `;
    }
  }

  [poidsInput, htInput, typeSelect, tpInput].forEach(el => {
    if (el) el.addEventListener("input", update);
  });
  if (typeSelect) typeSelect.addEventListener("change", update);

  update();
}

/* ====================================================================
   RÉANIMATION – TRANSPLANTATION CARDIAQUE (MENU + sous-pages)
   ==================================================================== */

function renderReanTransplantMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche -->
      <div class="intervention-main">
        <div class="hero">
          <h2>Transplantation cardiaque</h2>
        </div>

        <div class="grid">
          <button class="btn" onclick="renderReanTransplantHemodynamique()">
            Gestion hémodynamique post-opératoire
          </button>
          <button class="btn" onclick="renderReanTransplantImmuno()">
            Protocole d’immunosuppression
          </button>
          <button class="btn" onclick="renderReanTransplantRejet()">
            Rejet aigu de greffon
          </button>
          <button class="btn" onclick="renderReanTransplantInfections()">
            Infections et transplantation
          </button>
          <button class="btn" onclick="renderReanTransplantCoronaires()">
            Prévention maladie coronaire du greffon
          </button>
        </div>
      </div>

      <!-- Colonne droite : image verticale -->
      <aside class="intervention-side">
        <img src="img/transplantation2.png" alt="Transplantation cardiaque">
      </aside>

    </section>
  `;
}


function renderReanTransplantHemodynamique() {
  $app.innerHTML = `
    <section>
      ${sectionHeader("Transplantation cardiaque – Réanimation", "transplantation.png")}

      <h3>Gestion hémodynamique post-opératoire</h3>

      <div class="card">
        <div class="card-body">
          <div class="form" style="margin-bottom:12px;">
            <label>
              <input type="checkbox" id="tx-ecmo" />
              Patient sous ECMO VA
            </label>
          </div>

          <div id="tx-gestion-noecmo">
            <p><strong>En l’absence d’ECMO VA :</strong></p>
            <ul>
              <li>Monitorage Swan-Ganz systématique.</li>
              <li>NO inhalé systématique.</li>
              <li>Objectifs hémodynamiques :
                <ul>
                  <li>FC 90–110/min</li>
                  <li>PAM &gt; 65 mmHg</li>
                  <li>PVC &lt; 15 mmHg</li>
                  <li>Diurèse &gt; 0,5 mL/kg/h</li>
                </ul>
              </li>
            </ul>
          </div>

          <div id="tx-gestion-ecmo" style="display:none;">
            <p><strong>Assistance par ECMO VA :</strong></p>
            <ul>
              <li>BCPIA souvent associée.</li>
              <li>Objectif de débit ECMO suffisant pour perfusion systémique,
                  tout en conservant un certain flux trans-aortique.</li>
              <li>HNF IVSE avec cible d’ACT / anti-Xa selon protocole.</li>
              <li>Adaptation de la ventilation
                  (Vt 6–8 mL/kg, FR 15–20/min, PEP 8–10 cmH₂O selon contexte).</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;

  setupReanTransplantHemodynamiqueLogic();
}

function setupReanTransplantHemodynamiqueLogic() {
  const cb = document.getElementById("tx-ecmo");
  const blocNoEcm = document.getElementById("tx-gestion-noecmo");
  const blocEcm = document.getElementById("tx-gestion-ecmo");

  function update() {
    const on = cb && cb.checked;
    if (blocNoEcm) blocNoEcm.style.display = on ? "none" : "";
    if (blocEcm) blocEcm.style.display = on ? "" : "none";
  }

  if (cb) cb.addEventListener("change", update);
  update();
}


function renderReanTransplantImmuno() {
  const encadres = [
    {
      titre: "Caractéristiques du patient (Choix)",
      html: `
        <div class="form">
          <div class="row">
            <label>Poids (kg)
              <input type="number" id="tx-poids" min="30" max="200" step="1" />
            </label>
          </div>
          <div class="row">
            <label>
              <input type="checkbox" id="tx-dsa" />
              DSA &gt; 3000 MFI
            </label>
            <label>
              <input type="checkbox" id="tx-infect" />
              Infection pré-opératoire ou haut risque infectieux
            </label>
            <label>
              <input type="checkbox" id="tx-cancer" />
              Cancer récent
            </label>
          </div>
        </div>
        <p style="margin-top:8px;">
          Ces critères conditionnent l’induction, la prophylaxie du rejet humoral,
          et le début des différents traitements (corticoïdes, Tacrolimus, MMF).
        </p>
      `,
    },
    {
      titre: "Induction de l’immunosuppression",
      html: `<div id="tx-induction"></div>`,
    },
    {
      titre: "Prévention du rejet humoral (DSA &gt; 3000 MFI)",
      html: `<div id="tx-rejet-humoral"></div>`,
    },
    {
      titre: "Corticothérapie",
      html: `<div id="tx-cortico"></div>`,
    },
    {
      titre: "Tacrolimus (ou Ciclosporine si CI)",
      html: `<div id="tx-tacro"></div>`,
    },
    {
      titre: "Mycophénolate mofétil (Cellcept)",
      html: `
        <div class="form">
          <label>GB (G/L)
            <input type="number" id="tx-gb" min="0" max="20" step="0.1" />
          </label>
        </div>
        <div id="tx-mmf"></div>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Transplantation cardiaque – Réanimation",
    sousTitre: "Protocole d’immunosuppression",
    image: "transplantation2.png",
    encadres,
  });

  setupReanTransplantImmunoLogic();
}

function setupReanTransplantImmunoLogic() {
  const poidsEl = document.getElementById("tx-poids");
  const dsaEl = document.getElementById("tx-dsa");
  const infectEl = document.getElementById("tx-infect");
  const cancerEl = document.getElementById("tx-cancer");
  const gbEl = document.getElementById("tx-gb");

  const inductionDiv = document.getElementById("tx-induction");
  const rejetHumoralDiv = document.getElementById("tx-rejet-humoral");
  const corticoDiv = document.getElementById("tx-cortico");
  const tacroDiv = document.getElementById("tx-tacro");
  const mmfDiv = document.getElementById("tx-mmf");

  function num(el) {
    if (!el) return null;
    const v = parseFloat((el.value || "").replace(",", "."));
    return isNaN(v) ? null : v;
  }

  function update() {
    const poids = num(poidsEl);
    const dsaHigh = !!(dsaEl && dsaEl.checked);
    const highRisk = !!(infectEl && infectEl.checked);
    const cancer = !!(cancerEl && cancerEl.checked);
    const gb = num(gbEl);
    const infectOrCancer = highRisk || cancer;

    // ===== Induction de l’immunosuppression =====
    if (inductionDiv) {
      let html = "";

      if (infectOrCancer && !dsaHigh) {
        // Infection/haut risque ou cancer récent coché + DSA <= 3000
        html = `
          <p><strong>Induction par Simulect (Basiliximab) :</strong></p>
          <ul>
            <li>20 mg à la fermeture sternale.</li>
            <li>20 mg à J4.</li>
          </ul>
          <p>Utiliser le Basiliximab si infection/haut risque ou cancer récent
             et DSA ≤ 3000 MFI.</p>
        `;
      } else {
        // Thymoglobulines
        const doseThymo = poids ? Math.min(1.25 * poids, 100).toFixed(1) : null;
        html = `
          <p><strong>Thymoglobulines IVL (sérum anti-lymphocytaire) :</strong></p>
          <ul>
            <li>3 à 5 doses de <strong>1,25 mg/kg/j</strong> (max 100 mg/j).</li>
            ${
              doseThymo
                ? `<li>Pour ce patient : environ <strong>${doseThymo} mg/j</strong> (dose max 100 mg).</li>`
                : ""
            }
            <li>Perfusion sur 12 h.</li>
            <li>4ᵉ et 5ᵉ dose si lymphocytes &gt; 0,1 G/L.</li>
            <li>Arrêt si Pl &lt; 30 G/L ou Leucocytes &lt; 4 G/L
                (ou diminution &gt; 50 % entre 2 doses) → ½ doses ultérieures
                pour atteindre 3 injections.</li>
          </ul>
          <p>Utiliser ce schéma si rien n’est coché ou si DSA &gt; 3000 MFI,
             même en cas d’infection/cancer récent.</p>
        `;
      }

      inductionDiv.innerHTML = html;
    }

    // ===== Prévention du rejet humoral (DSA > 3000) =====
    if (rejetHumoralDiv) {
      if (!dsaHigh) {
        rejetHumoralDiv.innerHTML = `
          <p>DSA ≤ 3000 MFI : pas de prophylaxie spécifique du rejet humoral.</p>
        `;
      } else {
        let html = `
          <p><strong>Prévention du rejet humoral (DSA &gt; 3000 MFI) :</strong></p>
          <p>Echanges plasmatiques <strong>1,3 × masse sanguine</strong>.</p>
          <div class="form">
            <div class="row">
              <label>Hématocrite (%)
                <input type="number" id="tx-ht" min="15" max="60" step="1" />
              </label>
            </div>
          </div>
          <div id="tx-ep-resultats"></div>
          <p style="margin-top:8px;">
            Planification :
            <ul>
              <li>1ʳᵉ séance pré-opératoire.</li>
              <li>Puis J1, J2, J3 et J4 (5 séances au total).</li>
              <li>Au moins 6 h entre la fin de la Thymoglobuline et le début de l’EP.</li>
            </ul>
          </p>
          <p><strong>Biologie après EP :</strong></p>
          <ul>
            <li>Hémostase après chaque séance (TP, fibrinogène).</li>
            <li>Tube sec pour dosage des Ac anti-HLA après la série d’EP.</li>
          </ul>
        `;
        rejetHumoralDiv.innerHTML = html;

        // Calcul masse sanguine + volumes
        const htEl = document.getElementById("tx-ht");
        const resDiv = document.getElementById("tx-ep-resultats");

        function updateEP() {
          const ht = num(htEl);
          if (!poids || !ht || !resDiv) {
            if (resDiv) {
              resDiv.innerHTML = "<p>Renseigner poids et hématocrite pour estimer les volumes.</p>";
            }
            return;
          }
          const masseSanguine = (100 - ht) * 0.7 * poids; // mL
          const volEP = masseSanguine * 1.3;
          const volAlb = volEP / 3;
          const volPfc = volEP * 2 / 3;

          resDiv.innerHTML = `
            <p><strong>Volumes estimés :</strong></p>
            <ul>
              <li>Masse sanguine : ~${(masseSanguine / 1000).toFixed(2)} L</li>
              <li>Volume à échanger (1,3 × MS) : ~${(volEP / 1000).toFixed(2)} L</li>
              <li>Albumine 5 % : ~${(volAlb / 1000).toFixed(2)} L</li>
              <li>PFC : ~${(volPfc / 1000).toFixed(2)} L</li>
            </ul>
          `;
        }

        if (htEl) htEl.addEventListener("input", updateEP);
        updateEP();
      }
    }

    // ===== Corticothérapie =====
    if (corticoDiv) {
      let html = `
        <p><strong>Prednisone PO ou Méthylprednisolone IV :</strong></p>
        <ul>
          <li>Posologie initiale : <strong>1 mg/kg/j</strong>
              de J4 à J10.</li>
          <li>Si Infection/haut risque ou cancer récent et DSA ≤ 3000 :
              de J1 à J7.</li>
          <li>Diminution de 10 mg/j tous les 7 jours.</li>
          <li>Dose d’entretien : <strong>0,3 mg/kg/j</strong>.</li>
        </ul>
      `;
      if (poids) {
        const doseInit = (1 * poids).toFixed(1);
        const doseEnt = (0.3 * poids).toFixed(1);
        html += `
          <p>Pour ce patient :</p>
          <ul>
            <li>Posologie initiale ≈ <strong>${doseInit} mg/j</strong>.</li>
            <li>Dose d’entretien ≈ <strong>${doseEnt} mg/j</strong>.</li>
          </ul>
        `;
      }
      corticoDiv.innerHTML = html;
    }

    // ===== Tacrolimus =====
    if (tacroDiv) {
      let html = `
        <p><strong>Tacrolimus</strong> (Ciclosporine si CI Tacrolimus) :</p>
        <ul>
          <li>Posologie initiale : <strong>0,01 mg/kg/j IVSE</strong>
              à partir de J2.</li>
          <li>Si Infection/haut risque ou cancer récent et DSA ≤ 3000 :
              début possible dès J0.</li>
          <li>Relais per os : <strong>0,075 mg/kg/j</strong> en 2 prises (08h/20h) dès que possible.</li>
          <li>Objectif Cmin (T0) : 10–13 ng/mL les 3 premiers mois.</li>
        </ul>
      `;
      if (poids) {
        const doseIV = (0.01 * poids).toFixed(3);
        const dosePO = (0.075 * poids).toFixed(2);
        html += `
          <p>Pour ce patient :</p>
          <ul>
            <li>Dose IVSE ≈ <strong>${doseIV} mg/j</strong>.</li>
            <li>Dose PO totale ≈ <strong>${dosePO} mg/j</strong>
                (soit ~${(dosePO / 2).toFixed(2)} mg x2/j).</li>
          </ul>
        `;
      }
      tacroDiv.innerHTML = html;
    }

    // ===== Mycophénolate mofétil =====
    if (mmfDiv) {
      let html = `
        <p><strong>Mycophénolate mofétil (Cellcept) :</strong></p>
        <ul>
          <li>À partir de J4.</li>
          <li>À partir de J0 si Infection/haut risque ou cancer récent
              et DSA ≤ 3000 MFI.</li>
          <li>Posologie selon NFS :</li>
        </ul>
      `;

      if (gb != null) {
        let reco = "";
        if (gb > 4) {
          reco = "1 g x2/j PO ou IV.";
        } else if (gb >= 3) {
          reco = "750 mg x2/j PO ou IV.";
        } else {
          reco = "ne pas débuter le traitement.";
        }
        html += `
          <p>GB = ${gb.toFixed(1)} G/L → <strong>${reco}</strong></p>
        `;
      } else {
        html += `
          <p>Renseigner les GB pour proposer la posologie (GB &gt; 4, 3–4, &lt; 3 G/L).</p>
        `;
      }

      html += `
        <p>En cas d’infection : ne pas débuter ou arrêter le traitement si déjà initié.</p>
        <p>Si Rovalcyte 900 mg x2/j : diminuer la posologie de MMF de 50 %.</p>
      `;

      mmfDiv.innerHTML = html;
    }
  }

  [poidsEl, dsaEl, infectEl, cancerEl, gbEl].forEach(el => {
    if (el) el.addEventListener("input", update);
    if (el && el.type === "checkbox") el.addEventListener("change", update);
  });

  update();
}

function renderReanTransplantRejet() {
  const encadres = [
    {
      titre: "Rejet aigu cellulaire",
      html: `
        <div class="form">
          <label>Poids (kg)
            <input type="number" id="tx-rejet-poids" min="30" max="200" step="1" />
          </label>
        </div>
        <p><strong>Dépistage :</strong></p>
        <ul>
          <li>Biopsie myocardique à J15 puis tous les 10 j pendant 2 mois, puis espacement progressif.</li>
          <li>Échocardiographies répétées.</li>
        </ul>
        <p><strong>Prise en charge (Choix) :</strong></p>
        <div class="form">
          <label>
            <input type="radio" name="tx-grade" value="1R">
            Léger – Grade 1R
          </label>
          <label>
            <input type="radio" name="tx-grade" value="2R">
            Modéré – Grade 2R
          </label>
          <label>
            <input type="radio" name="tx-grade" value="3R">
            Grade 3R
          </label>
        </div>
        <div id="tx-rejet-cellulaire-reco"></div>
      `,
    },
    {
      titre: "Rejet aigu humoral",
      html: `
        <p><strong>Dépistage :</strong></p>
        <ul>
          <li>Biopsies myocardiques comme pour le rejet cellulaire.</li>
          <li>Ac anti-HLA :
            <ul>
              <li>En réanimation : hebdomadaire.</li>
              <li>Ensuite :
                <ul>
                  <li>Si immunisé : M1, M3, M6, M12.</li>
                  <li>Si non immunisé : 1 fois/an.</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Échocardiographies répétées.</li>
        </ul>
        <p><strong>Prise en charge :</strong></p>
        <ul>
          <li>Échanges plasmatiques (1,5 × masse sanguine) :
            <ul>
              <li>DSA &gt; 15 000 MFI : 10 séances.</li>
              <li>DSA &lt; 15 000 MFI : 5 séances (± 5 selon la cinétique des Ac).</li>
            </ul>
          </li>
          <li>IgIV (Privigen) : <strong>0,5 g/kg/j pendant 4 jours</strong>
              après la dernière séance d’EP.</li>
        </ul>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Transplantation cardiaque – Réanimation",
    sousTitre: "Rejet aigu de greffon",
    image: "transplantation2.png",
    encadres,
  });

  setupReanTransplantRejetLogic();
}

function setupReanTransplantRejetLogic() {
  const poidsEl = document.getElementById("tx-rejet-poids");
  const recoDiv = document.getElementById("tx-rejet-cellulaire-reco");
  const radios = Array.from(document.querySelectorAll("input[name='tx-grade']"));

  function num(el) {
    if (!el) return null;
    const v = parseFloat((el.value || "").replace(",", "."));
    return isNaN(v) ? null : v;
  }

  function update() {
    if (!recoDiv) return;
    const poids = num(poidsEl);
    const selected = radios.find(r => r.checked)?.value || null;

    let html = "<p><strong>Proposition de traitement :</strong></p>";

    if (!selected) {
      html += "<p>Choisir un grade de rejet pour afficher la conduite à tenir.</p>";
      recoDiv.innerHTML = html;
      return;
    }

    if (selected === "1R") {
      let dosePred = poids ? (1.5 * poids).toFixed(1) : null;
      html += `
        <ul>
          <li>Léger – Grade 1R : généralement pas de traitement agressif.</li>
          <li>Surveillance clinique, échographique et biopsies selon protocole.</li>
          <li>Discussion d’une cure courte de corticoïdes selon contexte :</li>
          ${
            dosePred
              ? `<li>Exemple : Prednisone ≈ <strong>${dosePred} mg/j</strong> pendant 5 jours,
                   ½ dose à J6, puis dose habituelle à partir de J7.</li>`
              : `<li>Prednisone 1,5 mg/kg 5 jours, ½ dose à J6, dose habituelle dès J7.</li>`
          }
        </ul>
      `;
    } else if (selected === "2R") {
      let doseMP = poids ? (10 * poids).toFixed(1) : null;
      html += `
        <ul>
          <li>Modéré – Grade 2R :</li>
          <li>Bolus de Méthylprednisolone sur 3 jours.</li>
          ${
            doseMP
              ? `<li>Par exemple : ~<strong>${doseMP} mg/j</strong> (10 mg/kg/j) sur 3 jours.</li>`
              : `<li>Posologie type : 10 mg/kg/j sur 3 jours.</li>`
          }
          <li>± Thymoglobuline 1,25 mg/kg/j sur 3 jours si dysfonction VG de novo.</li>
        </ul>
      `;
    } else if (selected === "3R") {
      let doseMP = poids ? (10 * poids).toFixed(1) : null;
      html += `
        <ul>
          <li>Grade 3R :</li>
          <li>Bolus de Méthylprednisolone sur 3 jours
              + Thymoglobuline 1,25 mg/kg/j sur 3 jours
              + traitement habituel.</li>
          ${
            doseMP
              ? `<li>Exemple : Méthylprednisolone ≈ <strong>${doseMP} mg/j</strong> (10 mg/kg/j).</li>`
              : ""
          }
        </ul>
      `;
    }

    recoDiv.innerHTML = html;
  }

  if (poidsEl) poidsEl.addEventListener("input", update);
  radios.forEach(r => r.addEventListener("change", update));
  update();
}

function renderReanTransplantInfections() {
  const encadres = [
    {
      titre: "Poids (pour calculs mg/kg)",
      html: `
        <div class="form">
          <label>Poids (kg)
            <input type="number" id="tx-inf-poids" min="30" max="200" step="1" />
          </label>
        </div>
      `,
    },
    {
      titre: "Infections à CMV",
      html: `
        <p><strong>Traitement préventif :</strong></p>
        <div class="form">
          <div class="row">
            <label>Donneur
              <select id="cmv-donneur">
                <option value="neg">Négatif</option>
                <option value="pos">Positif</option>
              </select>
            </label>
            <label>Receveur
              <select id="cmv-receveur">
                <option value="neg">Négatif</option>
                <option value="pos">Positif</option>
              </select>
            </label>
          </div>
        </div>
        <div id="cmv-prophylaxie"></div>

        <p style="margin-top:8px;"><strong>Traitement curatif :</strong></p>
        <div class="form">
          <label>
            <input type="radio" name="cmv-severite" value="severe">
            Infection sévère
          </label>
          <label>
            <input type="radio" name="cmv-severite" value="frustre">
            Infection frustre
          </label>
        </div>
        <div id="cmv-curatif"></div>
      `,
    },
    {
      titre: "Toxoplasmose",
      html: `
        <p><strong>Traitement préventif (Choix Donneur/Receveur) :</strong></p>
        <div class="form">
          <div class="row">
            <label>Donneur
              <select id="toxo-donneur">
                <option value="neg">Négatif</option>
                <option value="pos">Positif</option>
              </select>
            </label>
            <label>Receveur
              <select id="toxo-receveur">
                <option value="neg">Négatif</option>
                <option value="pos">Positif</option>
              </select>
            </label>
          </div>
        </div>
        <div id="toxo-prophylaxie"></div>

        <p style="margin-top:8px;"><strong>Traitement curatif :</strong></p>
        <div id="toxo-curatif"></div>
      `,
    },
    {
      titre: "Pneumocystose",
      html: `
        <p><strong>Traitement préventif :</strong></p>
        <ul>
          <li>Bactrim forte 800/160 mg 1 cp/j systématique à partir de J10
              (si GB &gt; 2 G/L), à poursuivre la 1ʳᵉ année.</li>
        </ul>
        <p><strong>Traitement curatif :</strong></p>
        <div id="pcp-curatif"></div>
      `,
    },
    {
      titre: "Hépatite B",
      html: `
        <p>Se référer au protocole spécifique.</p>
        <p>
          <li>
  VHB : <span class="img-link" onclick="openImg('hepatite.png')">🖼️️ Tableau hépatite B</span>
</li>
        </p>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Transplantation cardiaque – Réanimation",
    sousTitre: "Infections et transplantation",
    image: "transplantation2.png",
    encadres,
  });

  setupReanTransplantInfectionsLogic();
}

function setupReanTransplantInfectionsLogic() {
  const poidsEl = document.getElementById("tx-inf-poids");

  const cmvDon = document.getElementById("cmv-donneur");
  const cmvRec = document.getElementById("cmv-receveur");
  const cmvProphDiv = document.getElementById("cmv-prophylaxie");
  const cmvCuratifDiv = document.getElementById("cmv-curatif");
  const cmvRadios = Array.from(document.querySelectorAll("input[name='cmv-severite']"));

  const toxoDon = document.getElementById("toxo-donneur");
  const toxoRec = document.getElementById("toxo-receveur");
  const toxoProphDiv = document.getElementById("toxo-prophylaxie");
  const toxoCuratifDiv = document.getElementById("toxo-curatif");

  const pcpCuratifDiv = document.getElementById("pcp-curatif");

  function num(el) {
    if (!el) return null;
    const v = parseFloat((el.value || "").replace(",", "."));
    return isNaN(v) ? null : v;
  }

  function update() {
    const poids = num(poidsEl);

    // ===== CMV prophylaxie =====
    if (cmvProphDiv && cmvDon && cmvRec) {
      const d = cmvDon.value;
      const r = cmvRec.value;
      let html = "<p><strong>Prophylaxie CMV :</strong></p><ul>";

      if (d === "neg" && r === "neg") {
        html += "<li>D-/R- : surveillance clinique.</li>";
      } else if (d === "pos" && r === "neg") {
        html += "<li>D+/R- : Valganciclovir 900 mg x2/j pendant 3 mois.</li>";
      } else {
        html += `
          <li>R+ : PCR CMV à partir de J7 puis 1 fois/semaine.</li>
          <li>Si &gt; 4 log (10 000 copies) : Valganciclovir 900 mg x2/j pendant 3 mois.</li>
        `;
      }

      html += "</ul>";
      cmvProphDiv.innerHTML = html;
    }

    // ===== CMV curatif =====
    if (cmvCuratifDiv) {
      const sel = cmvRadios.find(r => r.checked)?.value || null;
      let html = "";

      if (!sel) {
        html = "<p>Choisir infection sévère ou frustre.</p>";
      } else if (sel === "severe") {
        let doseMin = poids ? (2.5 * poids).toFixed(1) : null;
        let doseMax = poids ? (5 * poids).toFixed(1) : null;
        html = "<p><strong>Infection sévère :</strong></p><ul>";
        html += "<li>Ganciclovir 2,5 à 5 mg/kg x2/j IVL pendant 15–20 jours,</li>";
        if (doseMin && doseMax) {
          html += `<li>→ soit environ ${doseMin}–${doseMax} mg x2/j pour ce patient.</li>`;
        }
        html += "<li>Puis Valganciclovir 900 mg x2/j pendant 3 mois.</li></ul>";
      } else {
        html = `
          <p><strong>Infection frustre :</strong></p>
          <ul>
            <li>Valganciclovir 900 mg x2/j pendant 3 mois.</li>
          </ul>
        `;
      }

      cmvCuratifDiv.innerHTML = html;
    }

    // ===== Toxoplasmose =====
    if (toxoProphDiv && toxoDon && toxoRec) {
      const d = toxoDon.value;
      const r = toxoRec.value;
      let html = "<p><strong>Prophylaxie Toxoplasmose :</strong></p><ul>";

      if (d === "pos" && r === "neg") {
        html += "<li>D+/R- : Bactrim forte 800/160 mg 1 cp/j à partir de J10 puis à vie (ou Pyriméthamine 50 mg/j).</li>";
      } else {
        html += "<li>Autres combinaisons : pas de prophylaxie spécifique.</li>";
      }

      html += "</ul>";
      toxoProphDiv.innerHTML = html;
    }

    if (toxoCuratifDiv) {
      let doseMin = poids ? (50 * poids).toFixed(0) : null;
      let doseMax = poids ? (100 * poids).toFixed(0) : null;
      let html = "<ul>";
      html += "<li>Pyriméthamine 50 mg/j.</li>";
      html += "<li>Sulfadiazine 50–100 mg/kg/j.</li>";
      if (doseMin && doseMax) {
        html += `<li>→ soit environ ${doseMin}–${doseMax} mg/j de Sulfadiazine pour ce patient.</li>`;
      }
      html += "</ul>";
      toxoCuratifDiv.innerHTML = html;
    }

    // ===== Pneumocystose curatif =====
    if (pcpCuratifDiv) {
      let html = `
        <ul>
          <li>Bactrim 100/20 mg/kg/j IVL pendant 10 jours,</li>
      `;
      if (poids) {
        const smx = (100 * poids).toFixed(0);
        const tmp = (20 * poids).toFixed(0);
        html += `<li>→ soit ~${smx} mg SMX + ${tmp} mg TMP par jour.</li>`;
      }
      html += `
          <li>Puis relais 50/10 mg/kg/j PO jusqu’à 21 jours au total.</li>
        </ul>
      `;
      pcpCuratifDiv.innerHTML = html;
    }
  }

  const allInputs = [
    poidsEl,
    cmvDon,
    cmvRec,
    ...cmvRadios,
    toxoDon,
    toxoRec,
  ];
  allInputs.forEach(el => {
    if (!el) return;
    if (el.type === "radio" || el.type === "select-one" || el.type === "checkbox") {
      el.addEventListener("change", update);
    } else {
      el.addEventListener("input", update);
    }
  });

  update();
}

function openHepatiteImage() {
  window.open("img/hepatite.PNG", "_blank");
}

function renderReanTransplantCoronaires() {
  $app.innerHTML = `
    <section>
      ${sectionHeader("Transplantation cardiaque – Réanimation", "transplantation.png")}

      <h3>Prévention de la maladie coronaire du greffon</h3>

      <div class="card">
        <div class="card-body">
          <ul>
            <li>Kardégic 75 mg/j PO ou Aspirine 100 mg/j IVL dès que possible
              en l’absence de thrombopénie.</li>
            <li>Pravastatine 40 mg/j PO à partir de J10 (si bilan hépatique normal).</li>
            <li>Coronarographie à 1 an puis tous les 2 ans.</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

/* ====================================================================
   RÉANIMATION – ASSISTANCES CIRCULATOIRES (MENU + sous-pages)
   ==================================================================== */

function renderReanAssistancesMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <div class="intervention-main">
        <div class="hero">
          <h2>Assistances circulatoires</h2>
        </div>

        <div class="grid">
          <button class="btn" onclick="renderReanAssistECMO()">
            ECMO artério-veineuse
          </button>
          <button class="btn" onclick="renderReanAssistBCPIA()">
            BCPIA
          </button>
          <button class="btn" onclick="renderReanAssistImpella()">
            Impella
          </button>
          <button class="btn" onclick="renderReanAssistLVAD()">
            LVAD
          </button>
          <button class="btn" onclick="renderReanAssistCardioWest()">
            Cardio-west
          </button>
        </div>
      </div>

      <aside class="intervention-side">
        <img src="img/assistances2.png" alt="Assistances circulatoires">
      </aside>

    </section>
  `;
}


function renderReanAssistECMO() {
  const encadres = [
    {
      titre: "ECMO artério-veineuse",
      html: `
        <p>Prise en charge d’une ECMO VA (débit, anticoagulation, sevrage, interactions ventilatoires).
        Contenu détaillé à compléter à partir de ton tableau dédié.</p>
      `,
    },
  ];
  renderInterventionPage({
    titre: "Assistances circulatoires",
    sousTitre: "ECMO artério-veineuse",
    image: "assistances.png",
    encadres,
  });
}

function renderReanAssistBCPIA() {
  const encadres = [
    {
      titre: "BCPIA",
      html: `
        <p>Prise en charge d’une contre-pulsion intra-aortique :
        positionnement, synchronisation, réglages, sevrage. Contenu à compléter.</p>
      `,
    },
  ];
  renderInterventionPage({
    titre: "Assistances circulatoires",
    sousTitre: "BCPIA",
    image: "assistances.png",
    encadres,
  });
}

function renderReanAssistImpella() {
  const encadres = [
    {
      titre: "Impella",
      html: `
        <p>Prise en charge d’un dispositif Impella (positionnement, débits, anticoagulation).
        Contenu à compléter.</p>
      `,
    },
  ];
  renderInterventionPage({
    titre: "Assistances circulatoires",
    sousTitre: "Impella",
    image: "assistances.png",
    encadres,
  });
}

function renderReanAssistLVAD() {
  const encadres = [
    {
      titre: "LVAD",
      html: `
        <p>Prise en charge d’un LVAD (paramètres de pompe, anticoagulation, surveillance).
        Contenu à compléter.</p>
      `,
    },
  ];
  renderInterventionPage({
    titre: "Assistances circulatoires",
    sousTitre: "LVAD",
    image: "assistances.png",
    encadres,
  });
}

function renderReanAssistCardioWest() {
  const encadres = [
    {
      titre: "Cardio-west",
      html: `
        <p>Prise en charge d’un cœur artificiel total (Cardio-west).
        Contenu à compléter.</p>
      `,
    },
  ];
  renderInterventionPage({
    titre: "Assistances circulatoires",
    sousTitre: "Cardio-west",
    image: "assistances.png",
    encadres,
  });
}

// =====================================================================
//  RÉANIMATION – ANTIBIOTHÉRAPIE (5 sous-parties existantes ATB)
// =====================================================================

function renderReanAntibiotherapieMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <div class="intervention-main">
        <div class="hero">
          <h2>Antibiothérapie en Réanimation</h2>
        </div>

        <div class="grid">
          <button class="btn" onclick="renderProbaMenu()">
            Antibiothérapie probabiliste
          </button>
          <button class="btn" onclick="renderAdapteeMenu()">
            Traitement des BMR et BHRe
          </button>
          <button class="btn" onclick="renderDureesForm()">
            Durée d'antibiothérapie
          </button>
          <button class="btn" onclick="renderReinForm()">
            Adaptation posologique à la fonction rénale
          </button>
          <button class="btn" onclick="renderModalitesForm()">
            Modalités d'administration des antibiotiques
          </button>
        </div>

        <div id="atb-section-root" style="margin-top:16px;"></div>
      </div>

      <aside class="intervention-side">
        <img src="img/antibiotherapie2.png" alt="Antibiothérapie en réanimation">
      </aside>

    </section>
  `;
}


// Les 5 fonctions suivantes se contentent de déléguer à tes fonctions
// existantes de pwa-atb-rules (renderProbaMenu, renderAdapteeMenu, etc.)

// Layout générique : contenu à gauche, image à droite
function renderWithRightImage({ title, image, bodyHtml }) {
  $app.innerHTML = `
    <section class="intervention-shell">

      <div class="intervention-main">
        ${bodyHtml}
      </div>

      <aside class="intervention-side">
        <img src="img/${image}" alt="${title}">
      </aside>

    </section>
  `;
}

function renderProbaMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + texte + boutons -->
      <div class="intervention-main">

        ${h("card", `
          <h2>Antibiothérapie probabiliste</h2>
          <p>Sélectionnez le foyer infectieux :</p>
        `)}

        ${h("grid cols-2", `
          <button class="btn" onclick="location.hash='#/proba/pneumonies'">Pneumonies</button>
          <button class="btn" onclick="location.hash='#/proba/mediastinite'">Médiastinites post-opératoires</button>
          <button class="btn" onclick="location.hash='#/proba/scarpa'">Infections de Scarpa</button>
          <button class="btn" onclick="location.hash='#/proba/endocardite'">Endocardites infectieuses</button>
          <button class="btn" onclick="location.hash='#/proba/iu'">Infections urinaires</button>
          <button class="btn" onclick="location.hash='#/proba/abdo'">Infections intra-abdominales</button>
          <button class="btn" onclick="location.hash='#/proba/dermohypo'">Infections des parties molles</button>
          <button class="btn" onclick="location.hash='#/proba/neuro'">Infections neuro-méningées</button>
          <button class="btn" onclick="location.hash='#/proba/sepsis'">Sepsis sans porte d'entrée</button>
        `)}

        ${h("card", `
          <button class="btn ghost" onclick="history.back()">← Retour</button>
        `)}

      </div>

      <!-- Colonne droite : image -->
      <aside class="intervention-side">
        <img src="img/probabiliste.png" alt="Antibiothérapie probabiliste">
      </aside>

    </section>
  `;
}

function renderAdapteeMenu() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + boutons -->
      <div class="intervention-main">
        <div class="hero">
          <h2>Antibiothérapie adaptée : germes multisensibles, BMR et BHRe</h2>
        </div>

        <div class="grid cols-2">
          <button class="btn" onclick="location.hash='#/adaptee/sensibles'">
            Germes multisensibles
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/SARM'">
            SARM
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/ampC'">
            Entérobactéries ampC
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/BLSE'">
            BLSE
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/pyo'">
            Pseudomonas aeruginosa MDR/XDR
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/acineto'">
            Acinetobacter baumannii Imipénème-R
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/steno'">
            Stenotrophomonas maltophilia
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/carba'">
            Entérobactéries carbapénémases
          </button>

          <button class="btn" onclick="location.hash='#/adaptee/erv'">
            E. faecium Vancomycine-R
          </button>
        </div>

        <div style="margin-top: 16px;">
          <button class="btn ghost" onclick="history.back()">← Retour</button>
        </div>
      </div>

      <!-- Colonne droite : image verticale -->
      <aside class="intervention-side">
        <img src="img/adaptee.png" alt="Antibiothérapie adaptée">
      </aside>

    </section>
  `;
}

function renderDureesForm() {
  // ======================= Données – listes =======================
  const INFECTIONS = {
    "Pneumonies": ["Communautaire", "PAVM", "Nécrose/abcès", "Empyème pleural"],
    "Infections urinaires": ["Cystite", "Pyélonéphrite", "IU masculine"],
    "Bactériémies": ["Inconnue", "Cathéter", "Autre infection"],
    "Infections intra-abdominales": [
      "Cholécystite", "Angiocholite", "Abcès hépatique", "Inf. nécrose pancréatique",
      "Péritonite communautaire", "Péritonite nosocomiale", "Appendicite", "Diverticulite",
      "Entéro-colite", "Inf. liquide ascite"
    ],
    "Infections neuro-méningées": ["Méningite", "Encéphalite", "Abcès cérébral"],
    "Infections des parties molles": ["Non nécrosantes", "Nécrosantes"],
    "Endocardite infectieuse": ["Valve native", "Prothèse valvulaire (< ou > 1 an)"]
  };

  const BACTERIES = {
    "Cocci Gram -": ["Neisseria meningitidis"],
    "Cocci Gram +": ["Streptococcus spp.", "Staphylococcus spp.", "Enterococcus spp."],
    "Bacilles Gram -": [
      "Entérobactéries", "Pseudomonas aeruginosa", "Stenotrophomonas maltophilia",
      "Acinetobacter baumannii", "Haemophilus influenzae", "Legionella pneumophila"
    ],
    "Bacilles Gram +": ["Clostridium difficile", "Listeria monocytogenes", "Nocardia spp."],
    "Autres": ["Mycoplasma pneumoniae", "Mycobacterium tuberculosis"]
  };

  const GROUPES_BACT = Object.keys(BACTERIES);

  // ======================= UI =======================
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">
        <h2 class="antibio-title">Durée d’antibiothérapie</h2>
        <form id="formDuree" class="form">
          <div class="grid two">
            <fieldset>
              <legend>Infection</legend>
              <label for="selTypeInfect">Type d’infection</label>
              <select id="selTypeInfect"></select>

              <label for="selSousType">Sous-type d’infection</label>
              <select id="selSousType"></select>
            </fieldset>

            <fieldset>
              <legend>Documentation</legend>
              <label for="selCatBact">Catégorie</label>
              <select id="selCatBact"></select>

              <label for="selEspece">Espèce bactérienne</label>
              <select id="selEspece"></select>
            </fieldset>
          </div>

          <div class="actions">
            <button type="button" class="btn" id="btnCalcul">Durée recommandée</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resDuree" class="result"></div>
        </form>
      </div>

      <!-- Colonne droite : image verticale -->
      <aside class="intervention-side">
        <img src="./img/fabrice.png" alt="Durée d'antibiothérapie">
      </aside>

    </section>
  `;
}

  // Remplissage des combos + dépendances
  const $type = document.getElementById("selTypeInfect");
  const $sous = document.getElementById("selSousType");
  const $cat  = document.getElementById("selCatBact");
  const $esp  = document.getElementById("selEspece");

  function fillSelect(sel, arr) {
    sel.innerHTML = arr.map(v => `<option value="${v}">${v}</option>`).join("");
  }

  fillSelect($type, Object.keys(INFECTIONS));
  fillSelect($cat, GROUPES_BACT);

  function updateSousTypes() {
    fillSelect($sous, INFECTIONS[$type.value] || []);
  }
  function updateEspeces() {
    fillSelect($esp, BACTERIES[$cat.value] || []);
  }

  $type.addEventListener("change", updateSousTypes);
  $cat.addEventListener("change", updateEspeces);

  // init
  updateSousTypes();
  updateEspeces();

  // ======================= Logique / table des durées =======================
  // dictionnaire "G|S|GB|B" -> durée brute (sera formatée avant affichage)
  const map = buildDureesMap();

  document.getElementById("btnCalcul").addEventListener("click", () => {
    const cle = `${$type.value}|${$sous.value}|${$cat.value}|${$esp.value}`;
    const brut = map[cle] || "Aucune recommandation disponible pour cette combinaison.";
    document.getElementById("resDuree").textContent = formatDuree(brut);
  });

  // ---------------- helpers ----------------
  function buildDureesMap() {
    const d = {};
    // 1) tout à "NA" par défaut (seules les combinaisons présentes seront écrasées)
    for (const g of Object.keys(INFECTIONS)) {
      for (const s of INFECTIONS[g]) {
        for (const gb of GROUPES_BACT) {
          for (const b of BACTERIES[gb]) {
            d[`${g}|${s}|${gb}|${b}`] = "NA";
          }
        }
      }
    }

    const add = (G,S,GB,B,val) => { d[`${G}|${S}|${GB}|${B}`] = val; };

    // --------- PNEUMONIES ---------
    // Communautaire
    add("Pneumonies","Communautaire","Cocci Gram -","Neisseria meningitidis","7 j");                                           // :contentReference[oaicite:0]{index=0}
    add("Pneumonies","Communautaire","Cocci Gram +","Streptococcus spp.","5 à 7 j");                                           // :contentReference[oaicite:1]{index=1}
    add("Pneumonies","Communautaire","Cocci Gram +","Staphylococcus spp.","5 à 7 j");                                          // :contentReference[oaicite:2]{index=2}
    add("Pneumonies","Communautaire","Cocci Gram +","Enterococcus spp.","5 à 7 j");                                            // :contentReference[oaicite:3]{index=3}
    add("Pneumonies","Communautaire","Bacilles Gram -","Entérobactéries","5 à 7 j");                                           // :contentReference[oaicite:4]{index=4}
    add("Pneumonies","Communautaire","Bacilles Gram -","Pseudomonas aeruginosa","7 j");                                        // :contentReference[oaicite:5]{index=5}
    add("Pneumonies","Communautaire","Bacilles Gram -","Stenotrophomonas maltophilia","7 j");                              // :contentReference[oaicite:6]{index=6}
    add("Pneumonies","Communautaire","Bacilles Gram -","Acinetobacter baumannii","7 j ");                   // :contentReference[oaicite:7]{index=7}
    add("Pneumonies","Communautaire","Bacilles Gram -","Legionella pneumophila","14 à 21 j (21 jours en réanimation)");
    add("Pneumonies","Communautaire","Bacilles Gram -","Haemophilus influenzae","5 à 7 j");                                    // :contentReference[oaicite:8]{index=8}
    add("Pneumonies","Communautaire","Bacilles Gram +","Nocardia spp.","6 mois");                                              // :contentReference[oaicite:9]{index=9}
    add("Pneumonies","Communautaire","Autres","Mycoplasma pneumoniae","5 à 7 j");                                              // :contentReference[oaicite:10]{index=10}
    add("Pneumonies","Communautaire","Autres","Mycobacterium tuberculosis","6 mois");                                          // :contentReference[oaicite:11]{index=11}

    // PAVM
    add("Pneumonies","PAVM","Cocci Gram +","Streptococcus spp.","7 j");                                                        // :contentReference[oaicite:12]{index=12}
    add("Pneumonies","PAVM","Cocci Gram +","Staphylococcus spp.","7 j");                                                       // :contentReference[oaicite:13]{index=13}
    add("Pneumonies","PAVM","Cocci Gram +","Enterococcus spp.","7 j");                                                         // :contentReference[oaicite:14]{index=14}
    add("Pneumonies","PAVM","Bacilles Gram -","Entérobactéries","7 j");                                                        // :contentReference[oaicite:15]{index=15}
    add("Pneumonies","PAVM","Bacilles Gram -","Pseudomonas aeruginosa","8 à 15 j");                                            // :contentReference[oaicite:16]{index=16}
    add("Pneumonies","PAVM","Bacilles Gram -","Stenotrophomonas maltophilia","7 j");                                           // :contentReference[oaicite:17]{index=17}
    add("Pneumonies","PAVM","Bacilles Gram -","Acinetobacter baumannii","7 j ");                            // :contentReference[oaicite:18]{index=18}
    add("Pneumonies","PAVM","Bacilles Gram -","Legionella pneumophila","14 à 21 j (21 jours en réanimation)");
    add("Pneumonies","PAVM","Bacilles Gram -","Haemophilus influenzae","7 j");                                                 // :contentReference[oaicite:19]{index=19}

    // Nécrose / abcès pulmonaires
    const necabc = "3 à 6 semaines";                                                                                            // :contentReference[oaicite:20]{index=20}
    add("Pneumonies","Nécrose/abcès","Cocci Gram +","Streptococcus spp.",necabc);
    add("Pneumonies","Nécrose/abcès","Cocci Gram +","Staphylococcus spp.",necabc);
    add("Pneumonies","Nécrose/abcès","Cocci Gram +","Enterococcus spp.",necabc);
    add("Pneumonies","Nécrose/abcès","Bacilles Gram -","Entérobactéries",necabc);
    add("Pneumonies","Nécrose/abcès","Bacilles Gram -","Pseudomonas aeruginosa",necabc);
    add("Pneumonies","Nécrose/abcès","Bacilles Gram -","Stenotrophomonas maltophilia",necabc);
    add("Pneumonies","Nécrose/abcès","Bacilles Gram -","Acinetobacter baumannii",necabc);
    add("Pneumonies","Nécrose/abcès","Bacilles Gram -","Legionella pneumophila","3 à 6 semaines");
    add("Pneumonies","Nécrose/abcès","Cocci Gram -","Neisseria meningitidis",necabc);                                          // :contentReference[oaicite:21]{index=21}
    add("Pneumonies","Nécrose/abcès","Bacilles Gram -","Haemophilus influenzae",necabc);                                       // :contentReference[oaicite:22]{index=22}
    add("Pneumonies","Nécrose/abcès","Bacilles Gram +","Nocardia spp.","6 mois");                                              // :contentReference[oaicite:23]{index=23}
    add("Pneumonies","Nécrose/abcès","Autres","Mycobacterium tuberculosis","9 à 12 mois");                                     // :contentReference[oaicite:24]{index=24}

    // Empyème pleural
    const emp = "15 jours après drainage ; 3 à 4 semaines si pas de drainage";                                                 // :contentReference[oaicite:25]{index=25}
    add("Pneumonies","Empyème pleural","Cocci Gram +","Streptococcus spp.",emp);
    add("Pneumonies","Empyème pleural","Cocci Gram +","Staphylococcus spp.",emp);
    add("Pneumonies","Empyème pleural","Cocci Gram +","Enterococcus spp.",emp);
    add("Pneumonies","Empyème pleural","Bacilles Gram -","Entérobactéries",emp);
    add("Pneumonies","Empyème pleural","Bacilles Gram -","Pseudomonas aeruginosa",emp);
    add("Pneumonies","Empyème pleural","Bacilles Gram -","Stenotrophomonas maltophilia",emp);
    add("Pneumonies","Empyème pleural","Bacilles Gram -","Acinetobacter baumannii",emp);
    add("Pneumonies","Empyème pleural","Bacilles Gram -","Haemophilus influenzae",emp); 
    add("Pneumonies","Empyème pleural","Bacilles Gram -","Legionella pneumophila",emp);
    add("Pneumonies","Empyème pleural","Bacilles Gram +","Nocardia spp.","6 mois");                                            // :contentReference[oaicite:26]{index=26}
    add("Pneumonies","Empyème pleural","Autres","Mycobacterium tuberculosis",">= 6 mois");                                     // :contentReference[oaicite:27]{index=27}

    // --------- INFECTIONS URINAIRES ---------
    // Cystite
    add("Infections urinaires","Cystite","Cocci Gram +","Streptococcus spp.","7 jours si β-lactamine");                      // :contentReference[oaicite:28]{index=28}
    add("Infections urinaires","Cystite","Cocci Gram +","Staphylococcus spp.","7 jours si β-lactamine");                     // :contentReference[oaicite:29]{index=29}
    add("Infections urinaires","Cystite","Cocci Gram +","Enterococcus spp.","7 jours si β-lactamine");                       // :contentReference[oaicite:30]{index=30}
    add("Infections urinaires","Cystite","Bacilles Gram -","Entérobactéries","7 jours si β-lactamine");                      // :contentReference[oaicite:31]{index=31}
    add("Infections urinaires","Cystite","Bacilles Gram -","Pseudomonas aeruginosa","7 jours si β-lactamine");               // :contentReference[oaicite:32]{index=32}
    add("Infections urinaires","Cystite","Bacilles Gram -","Stenotrophomonas maltophilia","7 jours si β-lactamine");         // :contentReference[oaicite:33]{index=33}
    add("Infections urinaires","Cystite","Bacilles Gram -","Acinetobacter baumannii","7 jours si β-lactamine");              // :contentReference[oaicite:34]{index=34}
    add("Infections urinaires","Cystite","Autres","Mycobacterium tuberculosis","6 mois");                                       // :contentReference[oaicite:35]{index=35}

    // Pyélonéphrite
    const py = "7 jours si forme simple ; 10 jours si forme grave ou à risque de complication";                                 // :contentReference[oaicite:36]{index=36}
    add("Infections urinaires","Pyélonéphrite","Cocci Gram +","Streptococcus spp.",py);
    add("Infections urinaires","Pyélonéphrite","Cocci Gram +","Staphylococcus spp.",py);
    add("Infections urinaires","Pyélonéphrite","Cocci Gram +","Enterococcus spp.",py);
    add("Infections urinaires","Pyélonéphrite","Bacilles Gram -","Entérobactéries",py);
    add("Infections urinaires","Pyélonéphrite","Bacilles Gram -","Pseudomonas aeruginosa",py);
    add("Infections urinaires","Pyélonéphrite","Bacilles Gram -","Stenotrophomonas maltophilia",py);
    add("Infections urinaires","Pyélonéphrite","Bacilles Gram -","Acinetobacter baumannii",py);
    add("Infections urinaires","Pyélonéphrite","Autres","Mycobacterium tuberculosis","9 à 12 mois");

    // IU masculine
    const ium = "14 jours (21 jours si uropathie non corrigée)";                                                                // :contentReference[oaicite:37]{index=37}
    add("Infections urinaires","IU masculine","Cocci Gram +","Streptococcus spp.",ium);
    add("Infections urinaires","IU masculine","Cocci Gram +","Staphylococcus spp.",ium);
    add("Infections urinaires","IU masculine","Cocci Gram +","Enterococcus spp.",ium);
    add("Infections urinaires","IU masculine","Bacilles Gram -","Entérobactéries",ium);
    add("Infections urinaires","IU masculine","Bacilles Gram -","Pseudomonas aeruginosa",ium);
    add("Infections urinaires","IU masculine","Bacilles Gram -","Stenotrophomonas maltophilia",ium);
    add("Infections urinaires","IU masculine","Bacilles Gram -","Acinetobacter baumannii",ium);
    add("Infections urinaires","IU masculine","Autres","Mycobacterium tuberculosis","9 à 12 mois");

    // --------- BACTÉRIÉMIES ---------
    // Inconnue
    add("Bactériémies","Inconnue","Cocci Gram -","Neisseria meningitidis","7 j");                                               // :contentReference[oaicite:38]{index=38}
    add("Bactériémies","Inconnue","Cocci Gram +","Streptococcus spp.","7 j");                                                   // :contentReference[oaicite:39]{index=39}
    add("Bactériémies","Inconnue","Cocci Gram +","Staphylococcus spp.","Staphylocoques à coagulase négative : 3 à 5 j ; Staphylococcus aureus ou lugdunensis : 14 j"); // :contentReference[oaicite:40]{index=40}
    add("Bactériémies","Inconnue","Cocci Gram +","Enterococcus spp.","7 j");                                                    // :contentReference[oaicite:41]{index=41}
    add("Bactériémies","Inconnue","Bacilles Gram -","Entérobactéries","7 j");                                                   // :contentReference[oaicite:42]{index=42}
    add("Bactériémies","Inconnue","Bacilles Gram -","Pseudomonas aeruginosa","7 à 10 j");                                       // :contentReference[oaicite:43]{index=43}
    add("Bactériémies","Inconnue","Bacilles Gram -","Acinetobacter baumannii","7 à 10 j");
    add("Bactériémies","Inconnue","Bacilles Gram -","Stenotrophomonas maltophilia","7 à 10 j");
    add("Bactériémies","Inconnue","Bacilles Gram -","Haemophilus influenzae","7 j");
    add("Bactériémies","Inconnue","Bacilles Gram +","Listeria monocytogenes","21 j");                                           // :contentReference[oaicite:45]{index=45}
    add("Bactériémies","Inconnue","Bacilles Gram +","Nocardia spp.","6 mois");                                                  // :contentReference[oaicite:46]{index=46}
    add("Bactériémies","Inconnue","Autres","Mycobacterium tuberculosis","9 à 12 mois");                                         // :contentReference[oaicite:47]{index=47}

    // Cathéter
    add("Bactériémies","Cathéter","Cocci Gram -","Neisseria meningitidis","7 j");                                               // :contentReference[oaicite:48]{index=48}
    add("Bactériémies","Cathéter","Cocci Gram +","Streptococcus spp.","7 j");                                                   // :contentReference[oaicite:49]{index=49}
    add("Bactériémies","Cathéter","Cocci Gram +","Staphylococcus spp.","Staphylocoques à coagulase négative : 3 j ; Staphylococcus aureus ou lugdunensis : 14 j"); // :contentReference[oaicite:50]{index=50}
    add("Bactériémies","Cathéter","Cocci Gram +","Enterococcus spp.","7 j");                                                    // :contentReference[oaicite:51]{index=51}
    add("Bactériémies","Cathéter","Bacilles Gram -","Entérobactéries","7 j");                                                   // :contentReference[oaicite:52]{index=52}
    add("Bactériémies","Cathéter","Bacilles Gram -","Pseudomonas aeruginosa","7 à 10 j");                                       // :contentReference[oaicite:53]{index=53}
    add("Bactériémies","Cathéter","Bacilles Gram -","Acinetobacter baumannii","7 à 10 j"); 
    add("Bactériémies","Cathéter","Bacilles Gram -","Stenotrophomonas maltophilia","7 à 10 j");
    add("Bactériémies","Cathéter","Bacilles Gram -","Haemophilus influenzae","7 j");      // :contentReference[oaicite:54]{index=54}
    add("Bactériémies","Cathéter","Bacilles Gram +","Nocardia spp.","6 mois"); 

    // Autre infection – identique à l’infection source
    const idem = "Identique à l'infection responsable";                                                                         // :contentReference[oaicite:55]{index=55}
    add("Bactériémies","Autre infection","Cocci Gram -","Neisseria meningitidis",idem);
    add("Bactériémies","Autre infection","Cocci Gram +","Streptococcus spp.",idem);
    add("Bactériémies","Autre infection","Cocci Gram +","Staphylococcus spp.",idem);
    add("Bactériémies","Autre infection","Cocci Gram +","Enterococcus spp.",idem);
    add("Bactériémies","Autre infection","Bacilles Gram -","Entérobactéries",idem);
    add("Bactériémies","Autre infection","Bacilles Gram -","Pseudomonas aeruginosa",idem);
    add("Bactériémies","Autre infection","Bacilles Gram -","Acinetobacter baumannii",idem); 
    add("Bactériémies","Autre infection","Bacilles Gram -","Stenotrophomonas maltophilia",idem);
    add("Bactériémies","Autre infection","Bacilles Gram -","Haemophilus influenzae",idem);
    add("Bactériémies","Autre infection","Bacilles Gram +","Listeria monocytogenes","21 j");
    add("Bactériémies","Autre infection","Bacilles Gram +","Nocardia spp.","6 mois");
    add("Bactériémies","Autre infection","Autres","Mycobacterium tuberculosis",idem);
          // :contentReference[oaicite:54]{index=54}
  

    // --------- INFECTIONS INTRA-ABDOMINALES ---------
    const chole     = "3 jours post-opératoire ; 7 jours si non opérée";                                                        // :contentReference[oaicite:57]{index=57}
    const angio     = "3 jours post-drainage, 7 à 10 jours si non drainée";
    const absh      = "3 à 4 semaines si drainage ; 6 semaines sinon";
    const inp       = "Aucune recommandation – dépend de l’évolution clinique/radiologique";
    const peritCom  = "4 jours (5 jours si sepsis)";
    const peritNos  = "5 à 8 jours (8 jours si sepsis)";
    const app       = "1 jour (si péritonite = 3 jours ; si non opérée = 7)";
    const divert    = "7 jours (Antibiothérapie indiquée uniquement si: gravité, grossesse, immunodépression ou ASA3)";
    const entecol   = "3 à 7 j";
    const cdiff     = "10 j";
    const asc       = "5 à 7 jours (5 jours si C3G IV)";
    const tbLong    = "9 à 12 mois";

    // Cholécystite
    for (const gb of ["Cocci Gram +","Bacilles Gram -"]) {
      for (const b of (gb==="Cocci Gram +"? ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]
                                         : ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"])) {
        add("Infections intra-abdominales","Cholécystite",gb,b,chole);
      }
    }                                                                                                                            // :contentReference[oaicite:58]{index=58}
    add("Infections intra-abdominales","Cholécystite","Autres","Mycobacterium tuberculosis",tbLong);                            // :contentReference[oaicite:59]{index=59}

    // Angiocholite
    for (const gb of ["Cocci Gram +","Bacilles Gram -"]) {
      for (const b of (gb==="Cocci Gram +"? ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]
                                         : ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"])) {
        add("Infections intra-abdominales","Angiocholite",gb,b,angio);
      }
    }                                                                                                                            // :contentReference[oaicite:60]{index=60}
    add("Infections intra-abdominales","Angiocholite","Autres","Mycobacterium tuberculosis",tbLong);

    // Abcès hépatique
    for (const b of ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]) add("Infections intra-abdominales","Abcès hépatique","Cocci Gram +",b,absh);
    for (const b of ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"]) add("Infections intra-abdominales","Abcès hépatique","Bacilles Gram -",b,absh);
    add("Infections intra-abdominales","Abcès hépatique","Autres","Mycobacterium tuberculosis",tbLong);                         // :contentReference[oaicite:61]{index=61}

    // Infection de nécrose pancréatique
    for (const b of ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]) add("Infections intra-abdominales","Inf. nécrose pancréatique","Cocci Gram +",b,inp);
    for (const b of ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"]) add("Infections intra-abdominales","Inf. nécrose pancréatique","Bacilles Gram -",b,inp);
    add("Infections intra-abdominales","Inf. nécrose pancréatique","Autres","Mycobacterium tuberculosis",tbLong);               // :contentReference[oaicite:62]{index=62}

    // Péritonite communautaire
    for (const b of ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]) add("Infections intra-abdominales","Péritonite communautaire","Cocci Gram +",b,peritCom);
    for (const b of ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"]) add("Infections intra-abdominales","Péritonite communautaire","Bacilles Gram -",b,peritCom); // :contentReference[oaicite:63]{index=63}
    add("Infections intra-abdominales","Péritonite communautaire","Autres","Mycobacterium tuberculosis",tbLong);

    // Péritonite nosocomiale
    for (const b of ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]) add("Infections intra-abdominales","Péritonite nosocomiale","Cocci Gram +",b,peritNos);
    for (const b of ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"]) add("Infections intra-abdominales","Péritonite nosocomiale","Bacilles Gram -",b,peritNos); // :contentReference[oaicite:64]{index=64}

    // Appendicite
    for (const gb of ["Cocci Gram +","Bacilles Gram -"]) {
      for (const b of (gb==="Cocci Gram +"? ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]
                                         : ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"])) {
        add("Infections intra-abdominales","Appendicite",gb,b,app);
      }
    }
    // Diverticulite
    for (const gb of ["Cocci Gram +","Bacilles Gram -"]) {
      for (const b of (gb==="Cocci Gram +"? ["Streptococcus spp.","Staphylococcus spp.","Enterococcus spp."]
                                         : ["Entérobactéries","Pseudomonas aeruginosa","Stenotrophomonas maltophilia","Acinetobacter baumannii"])) {
        add("Infections intra-abdominales","Diverticulite",gb,b,divert);
      }
    }
    // Entéro-colite
    add("Infections intra-abdominales","Entéro-colite","Bacilles Gram -","Entérobactéries",entecol);
    add("Infections intra-abdominales","Entéro-colite","Bacilles Gram +","Clostridium difficile",cdiff);
    add("Infections intra-abdominales","Entéro-colite","Autres","Mycobacterium tuberculosis","6 mois");                          // :contentReference[oaicite:65]{index=65}
    // Inf. liquide ascite
    add("Infections intra-abdominales","Inf. liquide ascite","Bacilles Gram -","Entérobactéries",asc);
    add("Infections intra-abdominales","Inf. liquide ascite","Autres","Mycobacterium tuberculosis","NA");                        // :contentReference[oaicite:66]{index=66}

    // --------- INFECTIONS NEURO-MÉNINGÉES ---------
    // Méningite
    add("Infections neuro-méningées","Méningite","Cocci Gram -","Neisseria meningitidis","5 à 7 j");                             // :contentReference[oaicite:67]{index=67}
    add("Infections neuro-méningées","Méningite","Cocci Gram +","Streptococcus spp.","10 à 14 j (14 à 21 j si groupe B)");
    add("Infections neuro-méningées","Méningite","Cocci Gram +","Staphylococcus spp.","10 à 21 j (généralement nosocomiale)");
    add("Infections neuro-méningées","Méningite","Cocci Gram +","Enterococcus spp.","21 j (car généralement nosocomiale)");
    add("Infections neuro-méningées","Méningite","Bacilles Gram -","Entérobactéries","21 j (car généralement nosocomiale)");
    add("Infections neuro-méningées","Méningite","Bacilles Gram -","Pseudomonas aeruginosa","21 j (car généralement nosocomiale)");
    add("Infections neuro-méningées","Méningite","Bacilles Gram -","Acinetobacter baumannii","21 j (car généralement nosocomiale)");
    add("Infections neuro-méningées","Méningite","Bacilles Gram -","Stenotrophomonas maltophilia","21 j (car généralement nosocomiale)");
    add("Infections neuro-méningées","Méningite","Bacilles Gram -","Haemophilus influenzae","7 j");                              // :contentReference[oaicite:68]{index=68}
    add("Infections neuro-méningées","Méningite","Bacilles Gram +","Listeria monocytogenes","21 j");
    add("Infections neuro-méningées","Méningite","Autres","Mycobacterium tuberculosis","12 mois");

    // Encéphalite (bactérienne)
    add("Infections neuro-méningées","Encéphalite","Bacilles Gram +","Listeria monocytogenes","21 j");
    add("Infections neuro-méningées","Encéphalite","Autres","Mycobacterium tuberculosis","12 à 18 mois");                         // :contentReference[oaicite:69]{index=69}

    // Abcès cérébral
    const abc = "4 à 6 semaines si drainage (4 semaines si exérèse chirurgicale) ; 8 à 12 semaines en l’absence de geste";       // :contentReference[oaicite:70]{index=70}
    add("Infections neuro-méningées","Abcès cérébral","Cocci Gram +","Streptococcus spp.",abc);
    add("Infections neuro-méningées","Abcès cérébral","Cocci Gram +","Staphylococcus spp.",abc);
    add("Infections neuro-méningées","Abcès cérébral","Cocci Gram +","Enterococcus spp.",abc);
    add("Infections neuro-méningées","Abcès cérébral","Bacilles Gram -","Entérobactéries",abc);
    add("Infections neuro-méningées","Abcès cérébral","Bacilles Gram -","Pseudomonas aeruginosa",abc);
    add("Infections neuro-méningées","Abcès cérébral","Bacilles Gram -","Acinetobacter baumannii",abc);
    add("Infections neuro-méningées","Abcès cérébral","Bacilles Gram -","Stenotrophomonas maltophilia",abc);
    add("Infections neuro-méningées","Abcès cérébral","Bacilles Gram -","Haemophilus influenzae",abc)
    add("Infections neuro-méningées","Abcès cérébral","Bacilles Gram +","Nocardia spp.","12 à 18 mois");
    add("Infections neuro-méningées","Abcès cérébral","Autres","Mycobacterium tuberculosis","12 mois");

    // --------- INFECTIONS DES PARTIES MOLLES ---------
    // Non nécrosantes
    add("Infections des parties molles","Non nécrosantes","Cocci Gram +","Streptococcus spp.","7 j");                             // :contentReference[oaicite:71]{index=71}
    add("Infections des parties molles","Non nécrosantes","Cocci Gram +","Staphylococcus spp.","7 j");
    add("Infections des parties molles","Non nécrosantes","Cocci Gram +","Enterococcus spp.","7 j");
    add("Infections des parties molles","Non nécrosantes","Bacilles Gram -","Entérobactéries","7 j");
    add("Infections des parties molles","Non nécrosantes","Bacilles Gram -","Pseudomonas aeruginosa","7 j");
    add("Infections des parties molles","Non nécrosantes","Bacilles Gram -","Acinetobacter baumannii","7 j");
    add("Infections des parties molles","Non nécrosantes","Bacilles Gram -","Stenotrophomonas maltophilia","7 j");
    add("Infections des parties molles","Non nécrosantes","Bacilles Gram +","Nocardia spp.","3 à 6 mois");
    add("Infections des parties molles","Non nécrosantes","Autres","Mycobacterium tuberculosis","6 mois");      // :contentReference[oaicite:72]{index=72}

    // Nécrosantes
    const npo = "10 à 15 jours post-opératoire (selon évolution)";                                                               // :contentReference[oaicite:73]{index=73}
    add("Infections des parties molles","Nécrosantes","Cocci Gram -","Neisseria meningitidis","7 j (purpura fulminans)");
    add("Infections des parties molles","Nécrosantes","Cocci Gram +","Streptococcus spp.",npo);
    add("Infections des parties molles","Nécrosantes","Cocci Gram +","Staphylococcus spp.",npo);
    add("Infections des parties molles","Nécrosantes","Cocci Gram +","Enterococcus spp.",npo);
    add("Infections des parties molles","Nécrosantes","Bacilles Gram -","Entérobactéries",npo);
    add("Infections des parties molles","Nécrosantes","Bacilles Gram -","Pseudomonas aeruginosa",npo);
    add("Infections des parties molles","Nécrosantes","Bacilles Gram -","Acinetobacter baumannii",npo);
    add("Infections des parties molles","Nécrosantes","Bacilles Gram -","Stenotrophomonas maltophilia",npo);
    add("Infections des parties molles","Nécrosantes","Bacilles Gram +","Nocardia spp.","3 à 6 mois");
    add("Infections des parties molles","Nécrosantes","Autres","Mycobacterium tuberculosis","9 à 12 mois");

    // --------- ENDOCARDITE INFECTIEUSE ---------
    // Valve native
    add("Endocardite infectieuse","Valve native","Cocci Gram +","Streptococcus spp.","2 à 4 semaines (2 semaines si gentamicine)"); // :contentReference[oaicite:74]{index=74}
    add("Endocardite infectieuse","Valve native","Cocci Gram +","Staphylococcus spp.","4 à 6 semaines (pas d’aminoside)");
    add("Endocardite infectieuse","Valve native","Cocci Gram +","Enterococcus spp.","6 semaines (+ 2 semaines gentamicine ou + 6 semaines C3G)");
    add("Endocardite infectieuse","Valve native","Bacilles Gram -","Entérobactéries","6 semaines (+ 2 semaines gentamicine)");
    add("Endocardite infectieuse","Valve native","Bacilles Gram -","Pseudomonas aeruginosa",">= 6 semaines en bithérapie");
    add("Endocardite infectieuse","Valve native","Bacilles Gram -","Acinetobacter baumannii",">= 6 semaines en bithérapie");
    add("Endocardite infectieuse","Valve native","Bacilles Gram -","Stenotrophomonas maltophilia",">= 6 semaines en bithérapie");
    add("Endocardite infectieuse","Valve native","Bacilles Gram -","Haemophilus influenzae","4 sem C3G (ou 4 sem amoxicilline + 2 sem gentamicine)");
    add("Endocardite infectieuse","Valve native","Bacilles Gram +","Listeria monocytogenes","4 semaines de C3G (ou 4 semaines amoxicilline + 2 semaines gentamicine)");
    add("Endocardite infectieuse","Valve native","Bacilles Gram +","Nocardia spp.","6 mois");
    add("Endocardite infectieuse","Valve native","Autres","Mycobacterium tuberculosis","9 à 12 mois");

    // Prothèse valvulaire (< ou > 1 an)
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Cocci Gram +","Streptococcus spp.","6 semaines (dont gentamicine 2 semaines)"); // :contentReference[oaicite:75]{index=75}
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Cocci Gram +","Staphylococcus spp.",">= 6 semaines (dont gentamicine 2 semaines)");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Cocci Gram +","Enterococcus spp.","6 semaines (+ 2 semaines gentamicine ou + 6 semaines C3G)");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Bacilles Gram -","Entérobactéries","6 semaines (+ 2 semaines gentamicine)");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Bacilles Gram -","Pseudomonas aeruginosa",">= 6 semaines en bithérapie");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Bacilles Gram -","Acinetobacter baumannii",">= 6 semaines en bithérapie");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Bacilles Gram -","Stenotrophomonas maltophilia",">= 6 semaines en bithérapie");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Bacilles Gram -","Haemophilus influenzae","6 sem C3G (ou 6 sem amoxicilline + 2 sem gentamicine)");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Bacilles Gram +","Nocardia spp.","6 mois");
    add("Endocardite infectieuse","Prothèse valvulaire (< ou > 1 an)","Autres","Mycobacterium tuberculosis","12 à 18 mois");

    return d;
  }



  function formatDuree(txt) {
    if (!txt) return "";
    if (txt.trim().toUpperCase() === "NA") {
      return "Non applicable : bactérie jamais/rarement impliquée dans ce type d’infection.";
    }
    let r = txt;
    // Conserver l'intention "=" en ASCII ">="
    r = r.replace(/=/g, ">=");
    r = r.replace(/Idem infect°/g, "Identique à l'infection responsable");
    // j -> jours
    r = r.replace(/ j /g, " jours ");
    r = r.replace(/ j$/g, " jours");
    r = r.replace(/\(j/g, "(jours");
    r = r.replace(/j\)/g, "jours)");
    // sem -> semaines
    r = r.replace(/ sem\. /g, " semaines ");
    r = r.replace(/ sem /g, " semaines ");
    r = r.replace(/sem\.$/g, "semaines");
    r = r.replace(/sem$/g, "semaines");
    return r;
  }

function renderReinForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">

        <div class="card">
          <strong>Adaptation à la fonction rénale</strong>
        </div>

        <form id="formRein" class="form">

          <fieldset>
            <legend>Famille d’antibiotique</legend>
            <select id="famille">
              <option value="">— Sélectionner —</option>
              <option value="betalactamine">β-lactamines</option>
              <option value="aminoside">Aminosides</option>
              <option value="fluoroquinolone">Fluoroquinolones</option>
              <option value="antigram">Anti-Gram+</option>
              <option value="autres">Autres</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Molécule</legend>
            <select id="molecule">
              <option value="">— Choisir une famille d’abord —</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Fonction rénale</legend>
            <select id="fonction">
              <option value="">— Sélectionner —</option>
              <option value=">120">DFG > 120 mL/min/1,73m²</option>
              <option value="30-120">DFG = 30–120 mL/min/1,73m²</option>
              <option value="30-10">DFG = 30–10 mL/min/1,73m²</option>
              <option value="<10">DFG < 10 mL/min/1,73m²</option>
              <option value="hd">Hémodialyse intermittente</option>
              <option value="cvvh">CVVH 30–35 mL/kg/h</option>
              <option value="cvvhd">CVVHD 30–35 mL/kg/h</option>
            </select>
          </fieldset>

          <div class="actions">
            <button type="button" class="btn" id="btnRein">Afficher la posologie</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resRein" class="result"></div>

        </form>
      </div>

      <!-- Colonne droite : image verticale -->
      <aside class="intervention-side">
        <img src="./img/dialyse2.png" alt="Fonction rénale">
      </aside>

    </section>
  `;

  // ===== Données fidèles au tableau PDF =====
  // Colonnes: charge | >120 | 30-120 | 30-10 | <10 | hd | cvvh | cvvhd
  const data = {
    betalactamine: {
      "Amoxicilline": {charge:"2g sur 30min",">120":"2g /4 à 6h","30-120":"1g /4 à 8h","30-10":"1g /12h","<10":"1g /24h","hd":"Jours sans EER: 1g /12-24h, Jours avec EER: 1g après EER","cvvh":"1g /8h","cvvhd":"1g /6 à 8h"},                                          // :contentReference[oaicite:6]{index=6}
      "Cloxacilline": {charge:"2g sur 30min",">120":"2g /4 à 6h","30-120":"1g /4 à 6h","30-10":"1g /6 à 8h","<10":"1g /6 à 8h","hd":"Jours sans EER: 1g /6-8h, Jours avec EER: 1g après EER","cvvh":"1g /6h","cvvhd":"1g /4 à 6h"},                                          // :contentReference[oaicite:7]{index=7}
      "Oxacilline": {charge:"2g sur 30min",">120":"2g /6h","30-120":"2g /4 à 6h","30-10":"2g /4 à 6h","<10":"2g /4 à 6h","hd":"Jours sans EER: 2g /6-8h, Jours avec EER: 1-2g après EER","cvvh":"2g /6h","cvvhd":"2g /4 à 6h"},                                               // :contentReference[oaicite:8]{index=8}
      "Amoxicilline + Clavulanate": {charge:"2g +0,2g sur 30min",">120":"2g +0,2g /6h","30-120":"1g +0,2g /4 à 8h","30-10":"1g +0,2g /12h","<10":"1g +0,2g /24h","hd":"Jours sans EER: 1g +0,2g /24h, Jours avec EER: 1 +0,2g après EER","cvvh":"1g +0,2g /8h","cvvhd":"1g +0,2g /6 à 8h"}, // :contentReference[oaicite:9]{index=9}
      "Pipéracilline": {charge:"4g sur 30min",">120":"4g /6h","30-120":"4g /6h","30-10":"4g /8h","<10":"4g /12h","hd":"Jours sans EER: 4g /12-24h, Jours avec EER: 4g après EER","cvvh":"4g /8h","cvvhd":"4g /6 à 8h"},                                                // :contentReference[oaicite:10]{index=10}
      "Pipéracilline + Tazobactam": {charge:"4g +0,5g sur 30min",">120":"4g +0,5g /6h","30-120":"4g +0,5g /6h","30-10":"4g +0,5g /8h","<10":"4g +0,5g /12h","hd":"Jours sans EER: 4g +0,5 /12-24h, Jours avec EER: 4 +0,5g après EER","cvvh":"4g +0,5g /8h","cvvhd":"4g +0,5g /6 à 8h"},       // :contentReference[oaicite:11]{index=11}
      "Céfazoline": {charge:"2g sur 30min",">120":"8g/24h IVSE","30-120":"6–8g/24h IVSE","30-10":"1g /12h","<10":"1g /24h","hd":"Jours sans EER: 1g /12-24h, Jours avec EER: 1g après EER","cvvh":"2g /12h","cvvhd":"2g /8 à 12h"},                                      // :contentReference[oaicite:12]{index=12}
      "Céfotaxime": {charge:"2g sur 30min",">120":"2g /6h","30-120":"1g /4 à 8h","30-10":"1g /12h","<10":"1g /24h","hd":"Jours sans EER: 1-2g /12-24h, Jours avec EER: 1-2g après EER","cvvh":"2g /8h","cvvhd":"2g /6 à 8h"},                                              // :contentReference[oaicite:13]{index=13}
      "Ceftriaxone": {charge:"2g sur 30min",">120":"1g /12 à 24h","30-120":"1g /12 à 24h","30-10":"1g /24h","<10":"1g /24h","hd":"1 à 2g/24h (peu dialysable)","cvvh":"2g /24h","cvvhd":"2g /24h"},                                        // :contentReference[oaicite:14]{index=14}
      "Ceftazidime": {charge:"2g sur 30min",">120":"2g /6h","30-120":"1g /4 à 8h","30-10":"1g /6 à 12h","<10":"1g /12h","hd":"Jours sans EER: 1g /24h, Jours avec EER: 1-2g après EER","cvvh":"2g /12h","cvvhd":"2g /8 à 12h"},                                       // :contentReference[oaicite:15]{index=15}
      "Céfépime": {charge:"2g sur 30min",">120":"2g /6h","30-120":"1g /4 à 8h","30-10":"1g /12h","<10":"1g /24h","hd":"Jours sans EER: 1g /24h, Jours avec EER: 1-2g après EER","cvvh":"2g /12h","cvvhd":"2g /8 à 12h"},                                              // :contentReference[oaicite:16]{index=16}
      "Ceftobiprole": {charge:"1g sur 1h",">120":"1g /6h","30-120":"0,5–1g /8h","30-10":"1g /12h","<10":"500mg /24h","hd":"Jours sans EER: 500mg /24h, Jours avec EER: 500mg après EER","cvvh":"500mg /8h","cvvhd":"500mg /8h"},                                   // :contentReference[oaicite:17]{index=17}
      "Ceftaroline": {charge:"600mg sur 1h",">120":"600mg /8h","30-120":"600mg /8h","30-10":"600mg /12h","<10":"600mg /24h","hd":"Jours sans EER: 600mg/24h, Jours avec EER: 600mg après EER","cvvh":"600mg /12h","cvvhd":"600mg /12h"},                                 // :contentReference[oaicite:18]{index=18}
      "Ceftazidime + Avibactam": {charge:"2g +0,5g sur 2h",">120":"2g +0,5g /6h","30-120":"2g +0,5g /8h","30-10":"2g +0,5g /12h","<10":"2g +0,5g /24h","hd":"Jours sans EER: 2g +0,5g /24h, Jours avec EER: 2g +0,5g après EER","cvvh":"2g +0,5g /8h","cvvhd":"2g +0,5g /8h"}, // :contentReference[oaicite:19]{index=19}
      "Ceftolozane + Tazobactam": {charge:"1g +0,5g sur 1h",">120":"1g +0,5g /6h","30-120":"1g +0,5g /8h","30-10":"1g +0,5g /12h","<10":"1g +0,5g /24h","hd":"Jours sans EER: 1g +0,5g /24h, Jours avec EER: 1g + 0,5g après EER","cvvh":"1g +0,5g /8h","cvvhd":"1g +0,5g /8h"}, // :contentReference[oaicite:20]{index=20}
      "Cefidérocol": {charge:"2g sur 1h",">120":"2g /6h","30-120":"2g /8h","30-10":"1g /8h","<10":"0,75g /12h","hd":"Jours sans EER: 0,75g /12h, Jours avec EER: 0,75g après EER","cvvh":"2g /8h","cvvhd":"2g /8h"},                                                   // :contentReference[oaicite:21]{index=21}
      "Imipénème": {charge:"2g sur 30min",">120":"1g /6h","30-120":"1g /6 à 8h","30-10":"1g /12h","<10":"1g /24h","hd":"Jours sans EER: 0,5g /12h, Jours avec EER: 0,5g après EER","cvvh":"1g /8h","cvvhd":"1g /8h"},                                                   // :contentReference[oaicite:22]{index=22}
      "Méropénème": {charge:"2g sur 30min",">120":"2g /6h","30-120":"1g /4 à 8h","30-10":"1g /6 à 12h","<10":"1g /12h","hd":"Jours sans EER: 1g /24h, Jours avec EER: 1g après EER","cvvh":"1g /8h","cvvhd":"1g /8h"},                                             // :contentReference[oaicite:23]{index=23}
      "Ertapénème": {charge:"2g sur 30min",">120":"1g /8h","30-120":"1g /12h","30-10":"500mg /24h (à éviter)","<10":"500mg /24h (à éviter)","hd":"0,5-1g après EER uniquement (à éviter)","cvvh":"500mg /24h (à éviter)","cvvhd":"500mg /24h (à éviter)"}, // :contentReference[oaicite:24]{index=24}
      "Imipénème + Relebactam": {charge:"2g +1g sur 30min",">120":"1g +0,5g /6h","30-120":"1g +0,5g /6 à 8h","30-10":"1g +0,5g /12h","<10":"1g +0,5g /24h","hd":"Jours sans EER: 1g +0,5g /24h, Jours avec EER: 1g +0,5g après EER","cvvh":"1g +0,5g /8h","cvvhd":"1g +0,5g /8h"},       // :contentReference[oaicite:25]{index=25}
      "Méropénème + Vaborbactam": {charge:"2g +2g sur 30min",">120":"2g +2g /6h","30-120":"2g +2g /8h","30-10":"1g +1g /6 à 12h","<10":"1g +1g /12h","hd":"Jours sans EER: 1g +1g /24h, Jours avec EER: 1g +1g après EER","cvvh":"2g +2g /8h","cvvhd":"2g +2g /8h"},              // :contentReference[oaicite:26]{index=26}
      "Aztréonam": {charge:"2g sur 30min",">120":"2g /6h","30-120":"2g /6 à 8h","30-10":"1g /8h","<10":"1g /12h","hd":"Jours sans EER: 1g /12h, Jours avec EER: 1-2g après EER","cvvh":"2g /8h","cvvhd":"2g /8h"},                                                   // :contentReference[oaicite:27]{index=27}
      "Témocilline": {charge:"2g sur 30min",">120":"8–10g/24h IVSE","30-120":"4–6g/24h IVSE","30-10":"2g /24h","<10":"1g /24h","hd":"Jours sans EER: 1g /24h, Jours avec EER: 2g après EER","cvvh":"2g /8h","cvvhd":"2g /8h"}                                       // :contentReference[oaicite:28]{index=28}
    },

    aminoside: {
      "Amikacine": {charge:"30mg/kg sur 30min",">120":"Généralement pas d’entretien","30-120":"Généralement pas d’entretien","30-10":"Généralement pas d’entretien","<10":"Généralement pas d’entretien","hd":"Uniquement si C résiduelle < 2,5 mg/L","cvvh":"—","cvvhd":"—"}, // :contentReference[oaicite:29]{index=29}
      "Gentamicine": {charge:"8mg/kg sur 30min",">120":"Généralement pas d’entretien","30-120":"Généralement pas d’entretien","30-10":"Généralement pas d’entretien","<10":"Généralement pas d’entretien","hd":"Uniquement si C résiduelle < 0,5 mg/L","cvvh":"—","cvvhd":"—"},     // :contentReference[oaicite:30]{index=30}
      "Tobramycine": {charge:"8mg/kg sur 30min",">120":"Généralement pas d’entretien","30-120":"Généralement pas d’entretien","30-10":"Généralement pas d’entretien","<10":"Généralement pas d’entretien","hd":"Uniquement si C résiduelle < 0,5 mg/L","cvvh":"—","cvvhd":"—"}      // :contentReference[oaicite:31]{index=31}
    },

    fluoroquinolone: {
      "Ofloxacine": {charge:"400mg IVL ou PO",">120":"400mg /12h","30-120":"400mg /12h","30-10":"400mg /24h","<10":"200mg /24h","hd":"200mg /24h","cvvh":"400mg /24h","cvvhd":"400mg /24h"},                                   // :contentReference[oaicite:32]{index=32}
      "Ciprofloxacine": {charge:"400mg IVL ou PO",">120":"400mg /8h","30-120":"400mg /8h","30-10":"400mg /24h","<10":"400mg /24h","hd":"400mg /24h","cvvh":"400mg /12h","cvvhd":"400mg /12h"},                                  // :contentReference[oaicite:33]{index=33}
      "Lévofloxacine": {charge:"500mg IVL ou PO",">120":"500mg /12h","30-120":"500mg /12h","30-10":"500mg /24h","<10":"500mg /48h","hd":"500mg après EER uniquement","cvvh":"500mg /24h","cvvhd":"500mg /24h"},                           // :contentReference[oaicite:34]{index=34}
      "Moxifloxacine": {charge:"400mg IVL ou PO",">120":"400mg /24h","30-120":"400mg /24h","30-10":"400mg /24h","<10":"400mg /24h","hd":"400mg /24h","cvvh":"400mg /24h","cvvhd":"400mg /24h"}                                  // :contentReference[oaicite:35]{index=35}
    },

    antigram: {
      "Vancomycine": {charge:"30mg/kg sur 1h",">120":"30mg/kg/24h (C. continue 20–25mg/L)","30-120":"30mg/kg/24h (C. continue 20–25mg/L)","30-10":"10mg/kg/24h (C. continue 20–25mg/L)","<10":"10mg/kg/24h (C. continue 20–25mg/L)","hd":"10mg/kg après EER (C résiduelle 20–25mg/L)","cvvh":"15–20 mg/kg/24h (C. continue 20–25mg/L)","cvvhd":"15–20 mg/kg/24h (C. continue 20–25mg/L)"}, // :contentReference[oaicite:36]{index=36}
      "Teicoplanine": {charge:"6-12mg/kg/12h pour 3 à 5 injections",">120":"12mg/kg/24h (C. résiduelle 20–25mg/L)","30-120":"6-12mg/kg/24h (C. résiduelle 20–25mg/L)","30-10":"4mg/kg/24h (C. résiduelle 20–25mg/L)","<10":"4mg/kg/24h (C. résiduelle 20–25mg/L)","hd":"4mg/kg/24h (C. résiduelle 20–25mg/L)","cvvh":"6–8 mg/kg/24h (C. continue 20–25mg/L)","cvvhd":"6–8 mg/kg/24h (C. continue 20–25mg/L)"}, // :contentReference[oaicite:37]{index=37}
      "Linézolide": {charge:"600mg IVL ou PO",">120":"600mg /12h","30-120":"600mg /12h","30-10":"600mg /12h","<10":"600mg /12h","hd":"600mg /12h","cvvh":"600mg /12h","cvvhd":"600mg /12h"},                                     // :contentReference[oaicite:38]{index=38}
      "Daptomycine": {charge:"10mg/kg IVL",">120":"12mg/kg/24h ou 8mg/kg/12h","30-120":"10mg/kg/24h","30-10":"10mg/kg/48h","<10":"10mg/kg/48h","hd":"10mg/kg après EER","cvvh":"10mg/kg/24h","cvvhd":"10mg/kg/24h"},       // :contentReference[oaicite:39]{index=39}
      "Clindamycine": {charge:"600mg IVL",">120":"600mg /6 à 8h","30-120":"600mg /6 à 8h","30-10":"600mg /6 à 8h","<10":"600mg /6 à 8h","hd":"600mg /6 à 8h","cvvh":"600mg /6 à 8h","cvvhd":"600mg /6 à 8h"}               // :contentReference[oaicite:40]{index=40}
    },

    autres: {
      "Colistine": {charge:"9 MUI IVL",">120":"4,5 MUI /12h","30-120":"4,5 MUI /12h","30-10":"4,5 MUI /24h","<10":"3,5 MUI /24h","hd":"2 MUI après EER","cvvh":"—","cvvhd":"—"},                                           // :contentReference[oaicite:41]{index=41}
      "Cotrimoxazole (pneumocystose)": {charge:"800mg IVL ou PO",">120":"100 mg/kg/j (12 amp/j max)","30-120":"75–100 mg/kg/j (12 amp/j max)","30-10":"40–50 mg/kg/j","<10":"20–25 mg/kg/j","hd":"20 mg/kg/j","cvvh":"15–20 mg/kg/j","cvvhd":"15–20 mg/kg/j"}, // :contentReference[oaicite:42]{index=42}
      "Cotrimoxazole (autre)": {charge:"800mg IVL ou PO",">120":"800mg /8h","30-120":"800mg /8h","30-10":"800mg /24h","<10":"800mg /48h","hd":"400mg après EER","cvvh":"400mg /24h","cvvhd":"400mg /24h"},                     // :contentReference[oaicite:43]{index=43}
      "Doxycycline": {charge:"200mg IVL ou PO",">120":"100mg /12h","30-120":"100mg /12h","30-10":"100mg /12h","<10":"100mg /12h","hd":"100mg /12h","cvvh":"100mg /12h","cvvhd":"100mg /12h"},                                   // :contentReference[oaicite:44]{index=44}
      "Fidaxomicine": {charge:"200mg PO",">120":"200mg /12h","30-120":"200mg /12h","30-10":"200mg /12h","<10":"200mg /12h","hd":"200mg /12h","cvvh":"200mg /12h","cvvhd":"200mg /12h"},                                  // :contentReference[oaicite:45]{index=45}
      "Métronidazole": {charge:"500mg IVL ou PO",">120":"500mg /8h","30-120":"500mg /8h","30-10":"500mg /8h","<10":"500mg /8h","hd":"500mg /8h","cvvh":"500mg /8h","cvvhd":"500mg /8h"},                                       // :contentReference[oaicite:46]{index=46}
      "Rifampicine": {charge:"10mg/kg IVL ou PO",">120":"10mg/kg /8h","30-120":"10mg/kg /8h","30-10":"10mg/kg /8h","<10":"10mg/kg /8h","hd":"10mg/kg /8h","cvvh":"10mg/kg /8h","cvvhd":"10mg/kg /8h"},                         // :contentReference[oaicite:47]{index=47}
      "Spiramycine": {charge:"3 MUI IVL",">120":"3 MUI /8h","30-120":"3 MUI /8h","30-10":"3 MUI /8h","<10":"3 MUI /8h","hd":"3 MUI /8h","cvvh":"3 MUI /8h","cvvhd":"3 MUI /8h"},                                         // :contentReference[oaicite:48]{index=48}
      "Tigécycline": {charge:"100mg IVL",">120":"50mg /12h","30-120":"50mg /12h","30-10":"50mg /12h","<10":"50mg /12h","hd":"50mg /12h","cvvh":"50mg /12h","cvvhd":"50mg /12h"}                                          // :contentReference[oaicite:49]{index=49}
    }
  };

  const selFamille = document.getElementById("famille");
  const selMoleculeRein = document.getElementById("molecule");

  selFamille.addEventListener("change", () => {
    const f = selFamille.value;
    if (!f) {
      selMoleculeRein.innerHTML = `<option value="">— Choisir une famille d’abord —</option>`;
      return;
    }
    const options = Object.keys(data[f]).map(m => `<option value="${m}">${m}</option>`).join("");
    selMoleculeRein.innerHTML = `<option value="">— Sélectionner —</option>` + options;
  });

  document.getElementById("btnRein").addEventListener("click", () => {
    const f = selFamille.value;
    const m = selMoleculeRein.value;
    const fn = document.getElementById("fonction").value;
    const out = document.getElementById("resRein");

    if (!f || !m || !fn) {
      out.textContent = "⚠️ Merci de sélectionner une famille, une molécule et une fonction rénale.";
      return;
    }

    const mol = data[f][m];
    const entretienBrut = mol[fn] || "—";
    const entretienLisible = humanizeEntretien(entretienBrut);

    out.innerHTML = `
      <strong>${m}</strong><br>
      <em>Dose de charge :</em> ${mol.charge}<br>
      <em>Dose d’entretien (${document.getElementById("fonction").selectedOptions[0].textContent}) :</em> ${entretienLisible}
    `;

    out.innerHTML += `
      <div class="credits">
        D'après le travail de : Dr Gilles TROCHE, Dr Marine PAUL et Dr Antoine BRIZARD<br>
        (Bases de données ANSM, GPR et Dexther)
      </div>
    `;

  // ✅ Ajout de l'encadré d'information supplémentaire
  const existingNote = document.querySelector(".rein-note");
  if (existingNote) existingNote.remove(); // Évite les doublons si on reclique plusieurs fois

  const infoDiv = document.createElement("div");
  infoDiv.className = "info-card rein-note";
  infoDiv.innerHTML = `
    <div class="info-content">
      Le dosage plasmatique des antibiotiques est recommandé en soins critiques,
      notamment en cas de DFG &lt; 30&nbsp;mL/min/1,73m² ou EER.
    </div>
  `;

  out.insertAdjacentElement("afterend", infoDiv);
});

// Remplace les "/6h", "/8h", "/12 à 24h", "/8–12h", etc. par "toutes les …"
function humanizeEntretien(text) {
  if (!text) return text;
  // 1) "/ 6h" ; "/6 à 8h" ; "/6–8h" ; "/6-8h"
  text = text.replace(/\/\s*(\d+(?:\s*(?:à|–|-)\s*\d+)?)\s*h/gi, (_m, grp) => ` toutes les ${grp}h`);
  return text;
}

function renderModalitesForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">

        <div class="card">
          <strong>Modalités d’administration des antibiotiques</strong>
        </div>

        <form id="formModa" class="form">

          <fieldset>
            <legend>Classe d’antibiotique</legend>
            <select id="classeModa">
              <option value="">— Sélectionner —</option>
              <option value="betalactamine">β-lactamines</option>
              <option value="aminoside">Aminosides</option>
              <option value="fluoroquinolone">Fluoroquinolones</option>
              <option value="antigram">Anti-Gram+</option>
              <option value="autres">Autres</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>Molécule</legend>
            <select id="moleculeModa">
              <option value="">— Choisir une classe d’abord —</option>
            </select>
          </fieldset>

          <div class="actions">
            <button type="button" class="btn" id="btnModa">Afficher les modalités</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resModa" class="result"></div>

        </form>
      </div>

      <!-- Colonne droite : grande image verticale -->
      <aside class="intervention-side">
        <img src="./img/modalite.png" alt="Modalités d'administration">
      </aside>

    </section>
  `;
}


  // ==========================
  // 📋 Données MODALITÉS À COMPLÉTER
  // ==========================
  const MODALITES = {

    // ========= β-lactamines =========
    betalactamine: {
      "Amoxicilline":             { dosages:"1g ou 2g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"4 à 6h", doses:"1 à 2g", volume:"50mL", perfusion:"IVL 60min", stabilite:"8h"} },
      "Cloxacilline":             { dosages:"1 ou 2gg", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"2 à 6g", volume:"50mL", perfusion:"IVSE 24h", stabilite:"24h"} },
      "Oxacilline":               { dosages:"1 ou 2g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"1 à 2g", volume:"50mL", perfusion:"IVSE 6h", stabilite:"8h"} },
      "Amoxicilline + Clavulanate":{ dosages:"1g+0,1g ou 2g+0,2g", solvant:"Eau PPI", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"4 à 6h", doses:"1g +0,25g ou 2g +0,5g", volume:"50mL", perfusion:"IVL 60min", stabilite:"1 à 2h"} },
      "Pipéracilline":            { dosages:"4g", solvant:"Glucosé 5%", charge:{schema:"4g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"4g", volume:"50mL", perfusion:"IVSE 6h", stabilite:"24h"} },
      "Pipéracilline + Tazobactam":{ dosages:"4g+0,5g", solvant:"Glucosé 5%", charge:{schema:"4g+0,5g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"4g +0,5g", volume:"50mL", perfusion:"IVSE 6h", stabilite:"12h"} },
      "Céfazoline":               { dosages:"1g ou 2g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"3g", volume:"50mL", perfusion:"IVSE 12h", stabilite:"24h"} },
      "Céfotaxime":               { dosages:"1g ou 2g", solvant:"Eau PPI", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"4 à 6h", doses:"1g", volume:"50mL", perfusion:"IVL 30min", stabilite:"6h"} },
      "Ceftriaxone":              { dosages:"1g ou 2g", solvant:"Eau PPI", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"24h", doses:"1g", volume:"50mL", perfusion:"IVL 30min", stabilite:"-"} },
      "Ceftazidime":              { dosages:"1g ou 2g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"2g", volume:"50mL", perfusion:"IVSE 8h", stabilite:"8h"} },
      "Céfépime":                 { dosages:"1g ou 2g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"2 à 3g", volume:"50mL", perfusion:"IVSE 12h", stabilite:"24h"} },
      "Ceftobiprole":             { dosages:"500mg", solvant:"NaCl 0,9%", charge:{schema:"1g dans 500mL IVL sur 120min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"8h", doses:"1g", volume:"500mL", perfusion:"IV 4h", stabilite:"6h"} },
      "Ceftaroline":              { dosages:"600mg", solvant:"Eau PPI", charge:{schema:"600mg dans 100mL IVL sur 60min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"8h", doses:"600mg", volume:"100mL", perfusion:"IVL 60min", stabilite:"6h"} },
      "Ceftazidime + Avibactam":  { dosages:"2g+0,5g", solvant:"Eau PPI", charge:{schema:"2g dans 50mL sur 2h"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"2g", volume:"50mL", perfusion:"IVSE 4h", stabilite:"24h"} },
      "Ceftolozane + Tazobactam": { dosages:"1g+0,5g", solvant:"Eau PPI", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"2g", volume:"50mL", perfusion:"IVSE 4h", stabilite:"24h"} },
      "Cefidérocol":              { dosages:"1g", solvant:"NaCl 0,9%", charge:{schema:"2g dans 50mL IVL sur 3h"}, entretien:{rythme:"Perfusion intermittente", intervalle:"8h", doses:"2g", volume:"50mL", perfusion:"IVSE 3h", stabilite:"6h"} },
      "Imipénème":                { dosages:"1g", solvant:"Glucosé 5%", charge:{schema:"2g dans 500mL sur 60min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"6 à 8h", doses:"1g", volume:"250mL", perfusion:"IVL 60min", stabilite:"< 3h"} },
      "Méropénème":               { dosages:"1g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"2g", volume:"50mL", perfusion:"IVSE 3h", stabilite:"4h"} },
      "Ertapénème":               { dosages:"1g", solvant:"Glucosé 5%", charge:{schema:"2g dans 100mL sur 30min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"12h", doses:"1g", volume:"50mL", perfusion:"IVL 30min", stabilite:"6h"} },
      "Imipénème + Relebactam":   { dosages:"0,5g+0,25g", solvant:"Glucosé 5%", charge:{schema:"2g dans 500mL sur 60min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"6 à 8h", doses:"1g +0,5g", volume:"250mL", perfusion:"IVL 60min", stabilite:"< 3h"} },
      "Méropénème + Vaborbactam": { dosages:"1g/1g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"6 à 8h", doses:"2g +2g", volume:"50mL", perfusion:"IVSE 3h", stabilite:"4h"} },
      "Aztréonam":                { dosages:"1g", solvant:"Glucosé 5%", charge:{schema:"2g dans 100mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"4g", volume:"50mL", perfusion:"IVSE 12h", stabilite:"24h"} },
      "Témocilline":              { dosages:"1g ou 2g", solvant:"Glucosé 5%", charge:{schema:"2g dans 50mL sur 30min"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"3g", volume:"50mL", perfusion:"IVSE 12h", stabilite:"24h"} }
    },

    // ========= Aminosides =========
    aminoside: {
      "Amikacine":   { dosages:"500mg", solvant:"Glucosé 5%", charge:{schema:"25-30mg/kg dans 250mL IVL 30min"}, entretien:{rythme:"Perfusion intermittente (si entretien indiqué)", intervalle:"Lorsque C. résiduelle < 2,5 mg/L", doses:"Adapter selon C. pic", volume:"250mL", perfusion:"IVL 30min", stabilite:"10-14h"} },
      "Gentamicine": { dosages:"80mg", solvant:"Glucosé 5%", charge:{schema:"8-10mg/kg dans 100mL IVL 30min"}, entretien:{rythme:"Perfusion intermittente (si entretien indiqué)", intervalle:"Lorsque C. résiduelle < 0,5 mg/L", doses:"Adapter selon C. pic", volume:"100mL", perfusion:"IVL 30min", stabilite:"10-14h"} },
      "Tobramycine": { dosages:"75mg", solvant:"Glucosé 5%", charge:{schema:"8-10mg/kg dans 100mL IVL 30min"}, entretien:{rythme:"Perfusion intermittente (si entretien indiqué)", intervalle:"Lorsque C. résiduelle < 0,5 mg/L", doses:"Adapter selon C. pic", volume:"100mL", perfusion:"IVL 30min", stabilite:"10-14h"} }
    },

    // ========= Fluoroquinolones =========
    fluoroquinolone: {
      "Ofloxacine":     { dosages:"200mg pochon ou comprimé (Biodisponibilité 100%)", solvant:"Préconditionné 40mL", charge:{schema:"400mg IVL (80mL sur 1h) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"12h", doses:"400mg", volume:"80mL", perfusion:"60min", stabilite:"24h"} },
      "Ciprofloxacine": { dosages:"200/400mg pochon ou comprimé (Biodisponibilité 100%)", solvant:"Préconditionné 100/200mL", charge:{schema:"400mg IVL (200mL sur 1h) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"8h", doses:"400mg", volume:"200mL", perfusion:"60min", stabilite:"> 24h"} },
      "Lévofloxacine":  { dosages:"500mg pochon ou comprimé (Biodisponibilité 100%)", solvant:"Préconditionné 100mL", charge:{schema:"500mg IVL (100mL sur 1h) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"12h", doses:"500mg", volume:"100mL", perfusion:"60min", stabilite:"> 24h"} },
      "Moxifloxacine":  { dosages:"400mg pochon ou comprimé (Biodisponibilité 100%)", solvant:"Préconditionné 250mL", charge:{schema:"400mg IVL (250mL sur 1h) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"24h", doses:"400mg", volume:"250mL", perfusion:"60min", stabilite:"24h"} }
    },

    // ========= Anti-Gram+ =========
    antigram: {
      "Vancomycine":  { dosages:"500mg et 1g", solvant:"Glucosé 5%", charge:{schema:"30mg/kg dans 50mL IVL sur 1h"}, entretien:{rythme:"Perfusion continue", intervalle:"Immédiatement", doses:"20-30mg/kg (Objectif C. continue = 20-25mg/L)", volume:"50mL", perfusion:"IVSE 24h sur VVC/Midline", stabilite:"24h"} },
      "Teicoplanine": { dosages:"100/200/400mg", solvant:"Glucosé 5%", charge:{schema:"6-12mg/kg/12h dans 50mL pour 3-5 inj IVL sur 30min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"12h pour les 3-5 premières injections, puis 24h", doses:"6-12mg/kg/24h (Objectif C. continue = 20-25mg/L)", volume:"50mL", perfusion:"IVL 30min sur VVC/Midline", stabilite:"< 24h"} },
      "Linézolide":   { dosages:"600mg ampoule ou comprimé (Biodisponibilité 100%)", solvant:"Préconditionné 300mL", charge:{schema:"600mg IVL (300mL sur 30-120min) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"12h", doses:"600mg", volume:"300mL", perfusion:"IVL 30-120min", stabilite:"faible, utiliser immédiatement"} },
      "Daptomycine":  { dosages:"500mg", solvant:"NaCl 0,9%", charge:{schema:"10mg/kg/24h dans 50mL IVL sur 30min "}, entretien:{rythme:"Perfusion intermittente", intervalle:"24g", doses:"10mg/kg", volume:"50mL", perfusion:"30min", stabilite:"faible, utiliser immédiatement"} },
      "Clindamycine": { dosages:"600/900mg ampoules, 150/300mg comprimés (Biodisponibilité 90%)", solvant:"Glucosé 5%", charge:{schema:"600 à 900mg IVL (100mL sur 60min) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"8h", doses:"600 à 900mg", volume:"100mL", perfusion:"60min", stabilite:"24h"} }
    },

    // ========= Autres =========
    autres: {
      "Colistine":                   { dosages:"1 MUI ampoule", solvant:"Glucosé 5%", charge:{schema:"6 MUI dans 50mL IVL sur 60min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"8h", doses:"3 MUI", volume:"50mL", perfusion:"60min", stabilite:"24h"} },
      "Cotrimoxazole (pneumocystose)":{ dosages:"400+80mg ampoule, 400+80/800+160mg comprimé (Biodisponibilité 90%)", solvant:"Glucosé 5%", charge:{schema:"800-1200mg IVL (250-500mL sur 60min) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"6 à 8h", doses:"800-1200mg", volume:"250-500mL", perfusion:"60min", stabilite:"6h"} },
      "Cotrimoxazole (autre)":       { dosages:"400+80mg ampoule, 400+80/800+160mg comprimé (Biodisponibilité 90%)", solvant:"Glucosé 5%", charge:{schema:"800mg IVL (250mL sur 60min) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"8h", doses:"800mg", volume:"250mL", perfusion:"60min", stabilite:"6h"} },
      "Doxycycline":                 { dosages:"100mg ampoule ou comprimé (Biodisponibilité 100%)", solvant:"Glucosé 5%", charge:{schema:"200mg IVL (250mL sur 60min) ou PO"}, entretien:{rythme:"Perfusion intermittente", intervalle:"12h", doses:"200mg", volume:"250mL", perfusion:"60min", stabilite:"24h"} },
      "Fidaxomicine":                { dosages:"200mg comprimé", solvant:"-", charge:{schema:"200mg PO"}, entretien:{rythme:"Per OS", intervalle:"12h", doses:"200mg", volume:"-", perfusion:"-", stabilite:"-"} },
      "Métronidazole":               { dosages:"500mg ampoule ou comprimé (Biodisponibilité 100%)", solvant:"Préconditionné 100mL", charge:{schema:"500mg IVL (100mL sur 30min) ou PO"}, entretien:{rythme:"Perfusion intermittente", intervalle:"8h", doses:"500mg", volume:"100mL", perfusion:"30min", stabilite:"24h"} },
      "Rifampicine":                 { dosages:"600mg ampoule ou 300mg comprimé (Biodisponibilité 90%)", solvant:"Glucosé 5%", charge:{schema:"10mg/kg IVL (250mL sur 60min) ou PO"}, entretien:{rythme:"Perfusion intermittente ou PO", intervalle:"8h à 12h (24h pour BK)", doses:"10mg/kg", volume:"250mL", perfusion:"60min", stabilite:"6h"} },
      "Spiramycine":                 { dosages:"1,5 MUI ampoule, éviter la voie PO", solvant:"Glucosé 5%", charge:{schema:"3 MUI dans 100mL IVL sur 60min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"8h", doses:"1,5 à 3 MUI", volume:"100mL", perfusion:"60mL", stabilite:"12h"} },
      "Tigécycline":                 { dosages:"50mg ampoule", solvant:"Glucosé 5%", charge:{schema:"200mg dans 250mL IVL sur 60min"}, entretien:{rythme:"Perfusion intermittente", intervalle:"12h", doses:"100mg", volume:"100mL", perfusion:"60min", stabilite:"6h"} }
    }
  };

  // ====== Dynamique du formulaire ======
  const selClasse = document.getElementById("classeModa");
  const selMolecule = document.getElementById("moleculeModa");

  selClasse.addEventListener("change", () => {
    const c = selClasse.value;
    if (!c || !MODALITES[c] || Object.keys(MODALITES[c]).length === 0) {
      selMolecule.innerHTML = `<option value="">— Choisir une classe d’abord —</option>`;
      return;
    }
    const options = Object.keys(MODALITES[c]).map(m => `<option value="${m}">${m}</option>`).join("");
    selMolecule.innerHTML = `<option value="">— Sélectionner —</option>` + options;
  });

  // ====== Affichage du résultat ======
  document.getElementById("btnModa").addEventListener("click", () => {
    const c = selClasse.value, m = selMolecule.value;
    const out = document.getElementById("resModa");

    if (!c || !m || !MODALITES[c] || !MODALITES[c][m]) {
      out.textContent = "⚠️ Merci de sélectionner une classe et une molécule.";
      return;
    }

    const F = MODALITES[c][m];

  out.innerHTML = [
    `<strong>${m}</strong>`,
    `<em>Dosages disponibles :</em> ${F.dosages || "—"}`,
    `<em>Solvant préférentiel :</em> ${F.solvant || "—"}`,
    `<em>Dose de charge :</em> ${(F.charge && F.charge.schema) || "—"}`,
    `<em>Dose d’entretien :</em>`,
    [
      `- <u>Rythme d’administration</u> : ${(F.entretien && F.entretien.rythme) || "—"}`,
      `- <u>Intervalle après dose de charge</u> : ${(F.entretien && F.entretien.intervalle) || "—"}`,
      `- <u>Doses habituelles</u> : ${(F.entretien && F.entretien.doses) || "—"}`,
      `- <u>Volume de dilution</u> : ${(F.entretien && F.entretien.volume) || "—"}`,
      `- <u>Durée de perfusion</u> : ${(F.entretien && F.entretien.perfusion) || "—"}`,
      `- <u>Durée de stabilité</u> : ${(F.entretien && F.entretien.stabilite) || "—"}`
    ].join("<br>")
  ].join("<br>");

  // ➕ crédits en bas de l’encadré
  out.innerHTML += `
    <div class="credits">
      D'après le travail de : Dr Candice FONTAINE et Dr Antoine BRIZARD<br>
      (Bases de données ANSM, RCP européennes et Dexther)
    </div>`;
}); 
} 


function renderSensiblesPage() {
  const $app = document.getElementById("app");
  $app.innerHTML = `
    <div class="bact-page">
      <span class="title-badge">Bactéries multisensibles — tableau de référence</span>

      <div class="info-card">
        <div class="info-content">
          <table class="simple">
            <thead>
              <tr>
                <th rowspan="2">Bactéries pathogènes</th>
                <th rowspan="2">Antibiotique de référence</th>
                <th rowspan="2">Posologie</th>
                <th colspan="2">Break-points cliniques (mg/L)</th>
                <th rowspan="2">Alternatives (dont allergies)</th>
                <th rowspan="2">Remarques</th>
              </tr>
              <tr>
                <th>≤ S</th>
                <th>&gt; R</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><em>Staphylococcus aureus</em></td>
                <td>Cloxacilline</td>
                <td>100-200mg/kg/j</td>
                <td>2<br><small>(mecA-)</small></td>
                <td>2<br><small>(mecA+)</small></td>
                <td>Céfazoline<br>Cotrimoxazole<br>Fluoroquinolones</td>
                <td>Sensibilité préservée à l’Amoxicilline<br>dans 10% des cas (à privilégier dans ce cas)</td>
              </tr>
              <tr>
                <td>Staphylocoques blancs</td>
                <td>Vancomcyine</td>
                <td>30-40mg/kg/24h<br><small>Obj.= 20-30mg/L</small></td>
                <td>4</td>
                <td>4</td>
                <td>Linezolide<br>Daptomycine</td>
                <td><em>S. epidermidis</em> résistant aux β-lactamines<br>dans 70-90% des cas</td>
              </tr>
              <tr>
                <td><em>Streptococcus pneumoniae</em></td>
                <td>Amoxicilline</td>
                <td>50-100mg/kg/24h</td>
                <td>0,5</td>
                <td>2</td>
                <td>Lévofloxacine<br>Spiramycine<br>C3G selon CMI Amox.</td>
                <td>CMI seuil sensibilité diminuée:<br>- > 0,5mg/L ménignites<br>- > 2mg/L autres</td>
              </tr>
              <tr>
                <td>Autres streptocoques<br><small>(Groupes A, B, C &amp; G)</small></td>
                <td>Amoxicilline</td>
                <td>50-100mg/kg/24h</td>
                <td>0,25</td>
                <td>0,25</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td><em>Enterococcus faecalis</em></td>
                <td>Amoxicilline</td>
                <td>50-100mg/kg/24h</td>
                <td>4</td>
                <td>8</td>
                <td>Vancomycine<br>Linezolide<br>Daptomycine</td>
                <td>Résistance à l’Amoxicilline dans 0,5% des cas.<br><br>Résistance naturelle céphalosporines (PLP5)</td>
              </tr>
              <tr>
                <td><em>Enterococcus faecium</em></td>
                <td>Vancomycine</td>
                <td>30-40mg/kg/24h<br><small>Obj.= 20-30mg/L</small></td>
                <td>4<br><small>(vanA-)</small></td>
                <td>4<br><small>(vanA+)</small></td>
                <td>Linezolide<br>Daptomycine<br>Tigécycline</td>
                <td>Résistance à l’Amoxicilline dans 80% des cas.<br><br>Résistance naturelle céphalosporines (PLP5)</td>
              </tr>
              <tr>
                <td><em>Neisseria meningitidis</em></td>
                <td>Amoxicilline</td>
                <td>150-200mg/kg/j si méningite</td>
                <td>0,125</td>
                <td>1</td>
                <td>Macrolides<br>Fluoroquinolones<br>Cyclines<br>Rifampicine<br>C3G (en probabiliste)</td>
                <td>Résistance naturelle au Cotrimoxazole</td>
              </tr>
              <tr>
                <td><em>Neisseria gonorrhoeae</em></td>
                <td>Amoxicilline</td>
                <td>50-100mg/kg/j</td>
                <td>0,06</td>
                <td>1</td>
                <td>C3G (en probabiliste)</td>
                <td>Résistance naturelle au Cotrimoxazole</td>
              </tr>
              <tr>
                <td><em>Moraxella catarrhalis</em></td>
                <td>Amoxicilline-Clav.</td>
                <td>1g/0,5g x3/24h</td>
                <td>1</td>
                <td>1</td>
                <td></td>
                <td>Pénicillinase 95% des cas (R. amox, S. augmentin)</td>
              </tr>
              <tr>
                <td><em>Clostridium difficile</em></td>
                <td>Fidaxomycine</td>
                <td>200mg x2/j PO</td>
                <td>0,5</td>
                <td>0,5</td>
                <td>Vancomycine<br>Métronidazole<br>Tigécycline</td>
                <td>Privilégier Fidaxomycine car moins de récurrences<br>(Fidaxo. &gt; Vancomycine. &gt; Métronidazole)</td>
              </tr>
              <tr>
                <td><em>Listeria monocytogenes</em></td>
                <td>Amoxicilline<br><small>+ Gentamicine 5-8mg/kg</small></td>
                <td>50-100mg/kg/j</td>
                <td>1</td>
                <td></td>
                <td>Cotrimoxazole<br>Macrolides<br>Moxifloxacine<br>Linezolide</td>
                <td>Si inf. neuroméningées : Cotrimoxazole, Moxifloxacine<br>et Linezolide possibles<br><br>Résistant céphalosporines</td>
              </tr>
              <tr>
                <td><em>Nocardia</em> spp.<br><small>N. farcinica<br>N. abscessus<br>N. asteroides<br>N. nova</small></td>
                <td>Cotrimoxazole IV<br><small>en bithérapie avec :</small><br>– Ou Imipénème<br>– Ou Linezolide<br>– Ou Amikacine</td>
                <td>20+100mg/kg/j<br><small>Imipénème 3-4g/24g</small><br><small>Linezolide 600mg x2/j</small><br><small>Amikacine 25-30mg/kg</small></td>
                <td>4<br>8<br>8<br>2/38</td>
                <td>16<br>64<br>16<br>4/76</td>
                <td></td>
                <td>Monothérapie possible (Pneumonies non graves)<br>Choix de la bi-thérapie selon espèce.<br><br>Activité quasi constante (&gt;95%) de cotrimoxazole,<br>linezolide et amikacine.</td>
              </tr>

              <!-- ===== Partie 2 du tableau ===== -->

              <tr>
                <td>Entérobactéries Groupe 0<br><small><em>Proteus mirabilis</em>,<br><em>Salmonella</em> spp.</small></td>
                <td>Amoxicilline</td>
                <td>50-100mg/kg/j</td>
                <td>1</td>
                <td>4</td>
                <td>C3G<br>Aztréonam<br>Ciprofloxacine<br>Cotrimoxazole</td>
                <td>Résistances C3G : BLSE (CTX-M) &gt; AmpC plasmidiques</td>
              </tr>
              <tr>
                <td>Entérobactéries Groupe 1<br><small><em>Escherichia coli</em>,<br><em>Shigella</em></small></td>
                <td>Amoxicilline</td>
                <td>50-100mg/kg/j</td>
                <td>1</td>
                <td>4</td>
                <td>C3G<br>Aztréonam<br>Ciprofloxacine<br>Cotrimoxazole</td>
                <td>Résistances C3G : BLSE (CTX-M) &gt; AmpC déréprimée<br>&gt; AmpC plasmidique</td>
              </tr>
              <tr>
                <td>Entérobactéries Groupe 2<br><small><em>K. pneumoniae</em>,<br><em>K. oxytoca</em>,<br><em>Citrobacter koserii</em></small></td>
                <td>Amoxicilline-Clav.</td>
                <td>1g/0,5g x3/24h</td>
                <td>1</td>
                <td>4</td>
                <td>C3G<br>Aztréonam<br>Ciprofloxacine<br>Cotrimoxazole</td>
                <td>Résistances C3G : BLSE (CTX-M) &gt; AmpC plasmidiques</td>
              </tr>
              <tr>
                <td>Entérobactéries Groupe 3<br><small><em>E. cloacae</em>,<br><em>K. aerogenes</em>,<br><em>C. freundii</em>,<br><em>M. morganii</em>,<br><em>S. marcescens</em>,<br><em>H. alvei</em>,<br><em>Providencia</em></small></td>
                <td>Céfépime</td>
                <td>4-6g/24h</td>
                <td>1</td>
                <td>4</td>
                <td>Ciprofloxacine<br>Cotrimoxazole<br>Tigécycline (sauf protéacées :<br><em>M. morganii</em>, <em>Providencia</em>)</td>
                <td>Résistances C3G : AmpC induite &gt; BLSE &gt; AmpC déréprimée<br><br><em>E. cloacae</em>, <em>K. aerogenes</em>, <em>C. freundii</em> : pas de C3G ou<br>Tazocilline (risque AmpC induite)<br><br><em>S. marcescens</em> résistant naturellement à l’Amikacine</td>
              </tr>
              <tr>
                <td><em>Pseudomonas aeruginosa</em></td>
                <td>Ceftazidime<br><small>ou Pipéracilline</small></td>
                <td>4-6g/24h IVSE<br><small>Pipéracilline 4g x4/24h IVL</small></td>
                <td>0,001<br>0,001</td>
                <td>8<br>16</td>
                <td>Céfépime<br>Aztréonam<br>Ciprofloxacine<br>Carbapénèmes<br>Amikacine</td>
                <td>Résistances : Pase, Case AmpC, BLSE, PorineD2,<br>carbapénèmases, efflux MexAB/XY-OprM<br><br>Résistance naturelle à la Tigécycline.</td>
              </tr>
              <tr>
                <td><em>Acinetobacter baumannii</em></td>
                <td>Imipénème<br><small>+ Amikacine 25-30mg/kg</small></td>
                <td>3-4g/24h</td>
                <td>2<br>4</td>
                <td>8<br>8</td>
                <td>Ciprofloxacine<br>Cotrimoxazole<br>Colistine<br>Tigécycline</td>
                <td>Résistances : Pase, Case AmpC, BLSE,<br>carbapénèmases (ABRI), efflux AdeABC, Acétylase AAC-6’</td>
              </tr>
              <tr>
                <td><em>Stenotrophomonas maltophilia</em></td>
                <td>Cotrimoxazole</td>
                <td>20+100mg/kg/j (12amp/j max)</td>
                <td>0,001</td>
                <td>4</td>
                <td>Ceftazidime<br>Lévofloxacine<br>Tigécycline</td>
                <td>R. ceftazidime = 30% des cas<br>R. lévofloxacine = 20% des cas<br>R. cotrimoxazole = 4% des cas<br><br>Résistance naturelles à tous les aminosides.</td>
              </tr>
              <tr>
                <td><em>Haemophilus influenza</em></td>
                <td>Amoxicilline</td>
                <td>50-100mg/kg/j</td>
                <td>2</td>
                <td>2</td>
                <td>Oflo/Ciproflox.<br>Cotrimoxazole</td>
                <td>Pénicillinase = 21% (R. Amox)<br>Mutation PLP3 = 7% (Résistance Augmentin +/- C3G)<br>C3G en probabiliste</td>
              </tr>
              <tr>
                <td><em>Legionella pneumophila</em></td>
                <td>Levofloxacine</td>
                <td>500mg x2/j</td>
                <td>–</td>
                <td>–</td>
                <td>Spiramycine<br>Rifampicine</td>
                <td>Monothérapie ou bithérapie (Levoflo/Spiramycine) pendant 5j<br>Durée 14-21 jours au total<br>Attention à l’allongement du QTc<br>Résistances aux macrolides/FLQ exceptionnelles (envoi CNR)</td>
              </tr>
              <tr>
                <td><em>Mycoplasma pneumoniae</em></td>
                <td>Spiramycine</td>
                <td>3 MUI x3/j IVL</td>
                <td>–</td>
                <td>–</td>
                <td>Cipro/Lévoflox.<br>Doxycycline</td>
                <td>R. macrolides &lt; 5% en France<br>Absence de résistance connue contre quinolones/cyclines.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}


function renderBacteriaPage(slug, data){
  const $app = document.getElementById("app");
  const title = data.title;
  const img = `./img/${slug}.png`; // ex : ./img/SARM.png ou ./img/ampC.png

  $app.innerHTML = `
    <div class="bact-page">
      <span class="title-badge">${title}</span>

      <div class="card bact-hero">
        <img src="${img}" alt="${title}" onerror="this.style.display='none'">
      </div>

      <div class="info-grid">
        <section class="info-card">
          <h3>Définition</h3>
          <div class="info-content">${data.definition}</div>
        </section>

        <section class="info-card">
          <h3>Mécanisme de résistance</h3>
          <div class="info-content">${data.mecanisme}</div>
        </section>

        <section class="info-card">
          <h3>Epidémiologie</h3>
          <div class="info-content">${data.epidemio}</div>
        </section>

        <section class="info-card">
          <h3>Phénotype habituel</h3>
          <div class="info-content">${data.phenotype}</div>
        </section>

        <section class="info-card">
          <h3>Antibiotique de référence</h3>
          <div class="info-content">${data.refAtb}</div>
        </section>

        <section class="info-card">
          <h3>Antibiotique selon le site infectieux</h3>
          <div class="info-content">${data.siteAtb}</div>
        </section>

        <section class="info-card">
          <h3>Ajout si choc septique</h3>
          <div class="info-content">${data.choc}</div>
        </section>
      </div>

      <div class="actions">
        <button class="btn ghost" onclick="history.back()">← Retour</button>
      </div>
    </div>
  `;
}

const BACTERIA_DATA = {
  SARM: {
    title: "Staphylococcus aureus résistant à la méticilline (SARM)",
    definition: `
      Souches de <em>S. aureus</em> résistantes aux pénicillines M (Cloxacilline et Oxacilline), 
      qui constituent le traitement de référence des infections invasives à <em>Staphylocoque aureus</em>.`,
    mecanisme: `
      Le phénotype de résistance du SARM est expliqué par 2 mécanismes :<br>
      • Synthèse d’une Pénicillinase (gène <em>blaZ</em>) chez 90% des souches de <em>S. aureus</em><br>
      • Modification de la PLP (PLP2a) codée par le gène <em>mecA</em> (uniquement chez le SARM).`,
    epidemio: `11% des souches de <em>S. aureus</em> invasives documentées sont des SARM (2023, France).`,
    phenotype: `
      <table class="pheno"><thead>
        <tr><th>S. aureus</th><th>SAMS Sauvage</th><th>SAMS Pase</th><th>SARM</th><th>VRSA</th></tr>
      </thead><tbody>
        <tr><td>Amoxicilline</td><td>S</td><td>R</td><td>R</td><td>R</td></tr>
        <tr><td>Oxa/Cloxacilline</td><td>S</td><td>S</td><td>R</td><td>R</td></tr>
        <tr><td>Augmentin</td><td>S</td><td>S</td><td>R</td><td>R</td></tr>
        <tr><td>C1G/C2G</td><td>S</td><td>S</td><td>R</td><td>R</td></tr>
        <tr><td>C3G/C4G</td><td>S</td><td>S</td><td>R</td><td>R</td></tr>
        <tr><td>C5G</td><td>S</td><td>S</td><td>S</td><td>R</td></tr>
        <tr><td>Carbapénèmes</td><td>S</td><td>S</td><td>R</td><td>R</td></tr>
        <tr><td>Lévofloxacine</td><td>S</td><td>S</td><td>I/R</td><td>R</td></tr>
        <tr><td>Gentamicine</td><td>S/I/R</td><td>S/I/R</td><td>S/I/R</td><td>S/I/R</td></tr>
        <tr><td>Vancomycine</td><td>S</td><td>S</td><td>S</td><td>R</td></tr>
        <tr><td>Daptomycine/Linezolide</td><td>S</td><td>S</td><td>S</td><td>S</td></tr>
      </tbody></table>`,
    refAtb: `
      <table class="simple">
        <thead><tr><th>Molécule</th><th>Posologie</th><th>BP EUCAST</th><th>Effets indésirables</th></tr></thead>
        <tbody>
          <tr>
            <td>Vancomycine</td>
            <td>15–30 mg/kg IVL<br>+ 30–40 mg/kg/24h IVSE<br>Objectif = C. continue 20–30 mg/L</td>
            <td>S : CMI ≤ 2 mg/L<br>R : CMI &gt; 2 mg/L</td>
            <td>Red-man syndrome, veinotoxicité,<br>néphrotoxicité, ototoxicité,<br>neutropénies</td>
          </tr>
        </tbody>
      </table>`,
    siteAtb: `
      <table class="simple">
        <thead><tr><th>Site infectieux</th><th>1ère intention</th><th>Alternatives</th></tr></thead>
        <tbody>
          <tr>
            <td>Pneumonie</td>
            <td>Linézolide 600 mg x2/j PO/IV<br><br>+ Clindamycine 3–6 mg/kg x4/j PO/IV<br>si infection sévère (toxine PVL)</td>
            <td>Vancomycine<br>ou CTX 20+100 mg/kg/j<br><br>+ Clindamycine si inf. sévère<br><em>(Daptomycine inactivée)</em></td>
          </tr>
          <tr>
            <td>Bactériémie</td>
            <td>Vancomycine<br>ou Daptomycine 10 mg/kg/j</td>
            <td>–</td>
          </tr>
          <tr>
            <td>Inf. abdominale</td>
            <td>Vancomycine</td>
            <td>Linézolide<br>ou Cotrimoxazole<br>ou Tigécycline 100 mg puis 50 mg x2/j IV si inf.sévère</td>
          </tr>
          <tr>
            <td>Infection urinaire</td>
            <td>Vancomycine</td>
            <td>Linézolide<br>ou Cotrimoxazole</td>
          </tr>
          <tr>
            <td>Dermo-hypodermite</td>
            <td>Vancomycine<br>+ Clindamycine si infection sévère</td>
            <td>Linézolide<br>ou Cotrimoxazole<br>ou Tigécycline si inf. sévère<br><br>+ Clindamycine si infection sévère</td>
          </tr>
        </tbody>
      </table>`,
    choc: `
      <table class="simple">
        <thead><tr><th>Molécule</th><th>Posologie</th><th>Effets indésirables</th></tr></thead>
        <tbody>
          <tr>
            <td>Gentamicine<br>(sensibilité = 94%)</td>
            <td>8 mg/kg IVL sur 30 min<br>Objectif pic 30 min : CMI x8–10<br>Objectif résiduelle : &lt; 0,5 mg/L</td>
            <td>Néphrotoxicité (NTA),<br>Toxicité cochléaire (irréversible)</td>
          </tr>
        </tbody>
      </table>`
  },

    ampC: {
    title: "Entérobactéries sécrétrices de céphalosporinase AmpC",
    definition: `
      Entérobactéries sécrétrices d’une enzyme responsable de l’hydrolyse des C1G/C2G, 
      C3G dans certaines conditions (« Case de haut niveau »), sans hydrolyse du céfépime.`,
    mecanisme: `
      Les entérobactéries de groupes 1 et 3 sont porteuses de Case <em>ampC</em> chromosomiques. 
      Leur production peut être amplifiée dans 2 conditions (Case hyperproduite) :<br>
      • <strong>Induction (Groupe 3)</strong> : Surproduction de AmpC à la suite d’une antibiothérapie inductrice<br>
      • <strong>Dérépression (Groupe 1 &amp; 3)</strong> : Mutation d’un gène régulateur de AmpC<br><br>
      <em>Attention :</em> En cas de transmission plasmidique, les entérobactéries des groupes 0 et 2 
      peuvent également exprimer des Case <em>ampC</em> (<em>K. pneumoniae</em> en particulier).`,
    epidemio: `
      La résistance aux C3G chez les entérobactéries est expliquée dans 76% par une BLSE, 
      et dans 25% par une Case <em>ampC</em> (2023, France).`,
    phenotype: `
      <div class="muted">Phénotype habituel selon le groupe d’entérobact.</div>
      <table class="pheno"><thead>
        <tr>
          <th>Entérobactéries</th>
          <th>Groupes 0 &amp; 1</th>
          <th>Groupe 2 — Pase</th>
          <th>Groupe 3 — AmpC naturelle</th>
          <th>Groupe 3 (&amp; 1) — AmpC hyperproduite</th>
        </tr>
      </thead><tbody>
        <tr><td>Amoxicilline</td><td>S</td><td>R</td><td>R</td><td>R</td></tr>
        <tr><td>Amox./Clav.</td><td>S</td><td>S</td><td>R</td><td>R</td></tr>
        <tr><td>Pipéracilline</td><td>S</td><td>S/I</td><td>S</td><td>R</td></tr>
        <tr><td>Pipé./Tazo.</td><td>S</td><td>S</td><td>S</td><td>I/R</td></tr>
        <tr><td>C1G/C2G</td><td>S</td><td>S</td><td>I/R</td><td>R</td></tr>
        <tr><td>C3G</td><td>S</td><td>S</td><td>S</td><td>R</td></tr>
        <tr><td>Céfépime</td><td>S</td><td>S</td><td>S</td><td>S</td></tr>
        <tr><td>Carbapénèmes</td><td>S</td><td>S</td><td>S</td><td>S</td></tr>
        <tr><td>Aztréonam</td><td>S</td><td>S</td><td>S/I/R</td><td>R</td></tr>
        <tr><td>Ciprofloxacine</td><td>S</td><td>S</td><td>S</td><td>S</td></tr>
        <tr><td>Amikacine</td><td>S</td><td>S</td><td>S (sauf <em>Serratia</em>)</td><td>S (sauf <em>Serratia</em>)</td></tr>
      </tbody></table>`,
    refAtb: `
      <table class="simple">
        <thead><tr><th>Molécule</th><th>Posologie</th><th>BP EUCAST</th><th>Effets indésirables</th></tr></thead>
        <tbody>
          <tr>
            <td>Céfépime</td>
            <td>Charge 2 g IVL<br>+ 4–6 g/24h IVSE</td>
            <td>S : CMI ≤ 1<br>R : CMI &gt; 4</td>
            <td>Allergies (croisée pénicilline &lt; 5%),<br>neurotoxicité, néphrotoxicité,<br>effets digestifs</td>
          </tr>
        </tbody>
      </table>`,
    siteAtb: `
      <table class="simple">
        <thead><tr><th>Site infectieux</th><th>1ère intention</th><th>Alternatives (Dont allergies β-lactamines)</th></tr></thead>
        <tbody>
          <tr>
            <td>Pneumonie</td>
            <td>Céfépime IV</td>
            <td>Ciprofloxacine 400 mg x2/j IV ou 750 mg x2/j PO<br>
                Cotrimoxazole 20+100 mg/kg/j PO/IV (dose max)</td>
          </tr>
          <tr>
            <td>Bactériémie</td>
            <td>Céfépime IV</td>
            <td>Ciprofloxacine IV/PO ou Cotrimoxazole IV/PO</td>
          </tr>
          <tr>
            <td>Inf. intra-abdominale</td>
            <td>Céfépime IV<br>+ Métronidazole 500mg x3/j IV/PO</td>
            <td>Ciprofloxacine IV/PO ou Cotrimoxazole IV/PO<br>ou Tigécycline 100mg puis 50mg x2/j IV si inf. sévère</td>
          </tr>
          <tr>
            <td>Infection urinaire</td>
            <td>Céfépime IV puis FLQ/Cotrimoxazole</td>
            <td>Ciprofloxacine IV/PO ou Cotrimoxazole IV/PO</td>
          </tr>
          <tr>
            <td>Dermo-hypodermite</td>
            <td>Céfépime IV</td>
            <td>Ciprofloxacine IV/PO ou Cotrimoxazole IV/PO<br>ou Tigécycline IV si inf. sévère</td>
          </tr>
        </tbody>
      </table>`,
    choc: `
      <table class="simple">
        <thead><tr><th>Molécule</th><th>Posologie</th><th>Effets indésirables</th></tr></thead>
        <tbody>
          <tr>
            <td>Amikacine <br>(Gentamicine pour <em>Serratia marcescens</em>)</td>
            <td>30 mg/kg IVL 30’<br>Obj pic 30’ &gt; CMI×8<br>Obj. résid. &lt; 5 mg/L</td>
            <td>Néphrotoxicité (NTA),<br>Toxicité cochléaire (irréversible)</td>
          </tr>
        </tbody>
      </table>`
  }
};

BACTERIA_DATA.BLSE = {
  title: "Entérobactéries sécrétrices de BLSE",
  definition: `
    Sécrétion de β-lactamases d’origine plasmidique (résistance acquise) responsables d’une hydrolyse des pénicillines,
    céphalosporines (dont C4G) et aztréonam. Les céphamycines (Céfoxitine) et carbapénèmes ne sont pas hydrolysées.`,
  mecanisme: `
    β-lactamases transmises sur plasmides au sein des population d’entérobactéries et BGN non fermentants. Les principales enzymes impliquées sont :<br>
    • Depuis 1990 : Enzymes dérivées des pénicillinases TEM et SHV (minoritaires)<br>
    • Depuis 2000 : Nouvelles BLSE : CTX-M (nettement majoritaires).`,
  epidemio: `
    La résistance aux C3G chez les entérobactéries est expliquée dans 76% par une BLSE, et dans 25% par une Case ampC.
    Des BLSE étaient sécrétées par 8% des souches cliniques de <em>E. coli</em> et 25% des souches cliniques de <em>K. pneumoniae</em> (Europe, 2023).`,
  phenotype: `
    <div class="muted">Phénotype habituel selon le groupe d’entérobact.</div>
    <table class="pheno"><thead>
      <tr>
        <th>Entérobactéries</th><th>Groupes 0 &amp; 1</th><th>Groupe 2 — Pase</th>
        <th>Groupe 3 — AmpC</th><th>Case AmpC hyperproduite</th><th>BLSE</th>
      </tr>
    </thead><tbody>
      <tr><td>Amoxicilline</td><td>S</td><td>R</td><td>R</td><td>R</td><td>R</td></tr>
      <tr><td>Amox./Clav.</td><td>S</td><td>S</td><td>R</td><td>R</td><td>I/R</td></tr>
      <tr><td>Pipéracilline</td><td>S</td><td>S/I</td><td>S</td><td>R</td><td>R</td></tr>
      <tr><td>Pipé./Tazo.</td><td>S</td><td>S</td><td>S</td><td>I/R</td><td>I/R</td></tr>
      <tr><td>C1G/C2G</td><td>S</td><td>S</td><td>I/R</td><td>R</td><td>R</td></tr>
      <tr><td>C3G</td><td>S</td><td>S</td><td>S</td><td>R</td><td>R</td></tr>
      <tr><td>Céfépime</td><td>S</td><td>S</td><td>S</td><td>S</td><td>R</td></tr>
      <tr><td>Carbapénèmes</td><td>S</td><td>S</td><td>S</td><td>S</td><td>S</td></tr>
      <tr><td>Aztréonam</td><td>S</td><td>S</td><td>S/I/R</td><td>R</td><td>R</td></tr>
      <tr><td>Ciprofloxacine</td><td>S</td><td>S</td><td>S</td><td>S</td><td>I/R</td></tr>
      <tr><td>Amikacine</td><td>S</td><td>S</td><td>S (sauf <em>Serratia</em>)</td><td>S (sauf <em>Serratia</em>)</td><td>S (sauf <em>Serratia</em>)</td></tr>
    </tbody></table>`,
  refAtb: `
    <table class="simple">
      <thead><tr><th>Molécules</th><th>Posologie</th><th>BP EUCAST</th><th>Effets indésirables</th></tr></thead>
      <tbody>
        <tr>
          <td>Méropénème</td><td>4–6 g/24h IV</td>
          <td>S : CMI ≤ …<br>R : CMI &gt; 8</td>
          <td>Allergies, néphrotox.,<br>troubles digestifs</td>
        </tr>
        <tr>
          <td>Imipénème</td><td>3–4 g/24h IV</td>
          <td>S : CMI ≤ 2<br>R : CMI &gt; 4</td>
          <td>Allergies, neurotox (Imip.),<br>néphrotox., troubles digestifs</td>
        </tr>
      </tbody>
    </table>`,
  siteAtb: `
    <table class="simple">
      <thead><tr><th>Site infectieux</th><th>1ère intention</th><th>B-lact. alternative (inf. non grave)</th><th>Si allergie β-lactamines</th></tr></thead>
      <tbody>
        <tr><td>Pneumonie</td><td>Méropénème</td><td>Témocilline 2–4 g/j IV</td><td>Colimycine 9–12 MUI x3/j IV</td></tr>
        <tr><td>Bactériémie</td><td>Méropénème</td><td>Témocilline</td><td>–</td></tr>
        <tr><td>Péritonite</td><td>Imipénème</td><td>–</td><td>Tigécycline 100 mg puis 50 mg x2/j IV (inf. sévère)</td></tr>
        <tr><td>Infection biliaire</td><td>Imipénème ou Méropénème</td><td>Pipéracilline/Tazobactam</td>
            <td>Ciprofloxacine 400 mg x2/j IV<br>CTX 20+100 mg/kg/j IV/PO<br>Tigécycline (inf. sévère)</td></tr>
        <tr><td>Infection urinaire</td><td>Imipénème ou Méropénème</td><td>Pipéracilline/Tazobactam, Témocilline</td>
            <td>Ciprofloxacine 400 mg x2/j IV<br>CTX 20+100 mg/kg/j IV/PO</td></tr>
        <tr><td>Dermo-hypodermite</td><td>Méropénème</td><td>Témocilline</td><td>Tigécycline (infection sévère)</td></tr>
      </tbody>
    </table>`,
  choc: `
    <table class="simple">
      <thead><tr><th>Molécule</th><th>Posologie</th><th>Effets indésirables</th></tr></thead>
      <tbody>
        <tr>
          <td>Amikacine<br>(Gentamicine pour <em>Serratia marcescens</em>)</td>
          <td>30 mg/kg IVL 30 min<br>Objectif pic 30 min : CMI ×8–10 (60–80 mg/L)<br>Objectif résiduelle : &lt; 5 mg/L</td>
          <td>Néphrotoxicité (NTA),<br>Toxicité cochléaire (irréversible)</td>
        </tr>
      </tbody>
    </table>`
};

BACTERIA_DATA.pyo = {
  title: "Pseudomonas aeruginosa MDR et XDR",
  definition: `
    Les souches de <em>P. aeruginosa</em> sont définies comme multi-résistantes (MDR) ou ultra-résistantes (XDR) devant 3 ou 5 résistances respectivement parmi :<br>
    • Les pénicillines (Pipéracilline-Tazobactam)<br>
    • Les céphalosporines (Ceftazidime)<br>
    • Les carbapénèmes (Imipénème ou méropénème)<br>
    • Les fluoroquinolones (Ciprofloxacine)<br>
    • Les aminosides (Gentamicine, amikacine et/ou tobramycine).`,
  mecanisme: `
    <em>P. aeruginosa</em> peut exprimer un grand nombre de gènes de résistance naturels (chromosomiques) et acquis (plasmidiques) :<br>
    • <strong>β-lactamines</strong> : Case (AmpC), BLSE (CTX-M), carbapénèmases (KPC, OXA198), mutation <em>oprD</em> (porine D2 mutée), pompes à efflux (MexAB-OprM, MexXY-OprM)<br>
    • <strong>Aminosides</strong> : Acétylases AAC-6’, méthylase ArmA, pompe à efflux MexXY-OprM<br>
    • <strong>Fluoroquinolones</strong> : Mutations <em>gyrA</em> et <em>parC</em>, efflux MexAB-OprM et MexXY-OprM.`,
  epidemio: `Parmi les souches invasives de <em>P. aeruginosa</em> documentées : 12% sont résistantes aux carbapénèmes, 6% sont MDR, et 4,4% sont XDR (2021, France).`,
  phenotype: `
    <table class="pheno">
      <thead>
        <tr>
          <th><em>P. aeruginosa</em></th>
          <th>WT</th>
          <th>Case (AmpC)</th>
          <th>BLSE (PER, VEB)</th>
          <th>Carbapé-nèmase</th>
          <th>Perte OprD2</th>
          <th>MexAB-OprM</th>
          <th>MexXY-OprM</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Pipéracilline</td><td>S</td><td>I/R</td><td>R</td><td>R</td><td>I</td><td>I</td><td>I</td></tr>
        <tr><td>Pipé/Tazo.</td><td>S</td><td>I/R</td><td>I</td><td>R</td><td>I</td><td>I</td><td>I</td></tr>
        <tr><td>Ceftazidime</td><td>S</td><td>I/R</td><td>R</td><td>R</td><td>I</td><td>I</td><td>I</td></tr>
        <tr><td>Céfépime</td><td>S</td><td>I/R</td><td>R</td><td>R</td><td>I</td><td>I</td><td>I/R</td></tr>
        <tr><td>Aztréonam</td><td>S</td><td>I/R</td><td>R</td><td>I/R</td><td>I</td><td>I/R</td><td>I</td></tr>
        <tr><td>Cefto/Tazo.</td><td>S</td><td>S</td><td>S</td><td>R</td><td>S</td><td>–</td><td>–</td></tr>
        <tr><td>Méropénème</td><td>S</td><td>S</td><td>S</td><td>R</td><td>I/R</td><td>S/I</td><td>S</td></tr>
        <tr><td>Ciprofloxacine</td><td>S</td><td>S</td><td>I/R</td><td>R</td><td>S</td><td>R</td><td>R</td></tr>
        <tr><td>Amikacine</td><td>S</td><td>S</td><td>S/I</td><td>S/I/R</td><td>S</td><td>S</td><td>R</td></tr>
      </tbody>
    </table>`,
  refAtb: `
    <table class="simple">
      <thead><tr><th>Molécule</th><th>Posologie</th><th>BP EUCAST</th><th>Effets indésirables</th></tr></thead>
      <tbody>
        <tr>
          <td>Ceftolozane–Tazobactam</td>
          <td>2 g/1 g x3/j IVL</td>
          <td>S : CMI ≤ 4 mg/L<br>R : CMI &gt; 4 mg/L</td>
          <td>Allergies (croisée pénicilline &lt; 5%),<br>neurotoxicité, néphrotoxicité,<br>troubles digestifs</td>
        </tr>
      </tbody>
    </table>`,
 siteAtb: `
  <table class="simple">
    <thead>
      <tr>
        <th>Site infectieux</th>
        <th>1ère intention</th>
        <th>Alternatives (dont allergies β-lactamines)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Pneumonie</td>
        <td>Ceftolozane-Tazobactam</td>
        <td>
          Ceftazidime/Avibactam 2g/0,5g x3/j IVL<br>
          Imipénème/Relebactam 500mg/250mg x4/j IV<br>
          Céfidérocol 2g x3/j IVL<br>
          Colimycine 9–12 MUI x3/j IV (Pneumonies)
        </td>
      </tr>
      <tr>
        <td>Bactériémie</td>
        <td>Ceftolozane-Tazobactam</td>
        <td>
          Ceftazidime/Avibactam 2g/0,5g x3/j IVL<br>
          Imipénème/Relebactam 500mg/250mg x4/j IV<br>
          Céfidérocol 2g x3/j IVL
        </td>
      </tr>
      <tr>
        <td>Inf. intra-abdominale</td>
        <td>Ceftolozane-Tazobactam</td>
        <td>
          Ceftazidime/Avibactam 2g/0,5g x3/j IVL<br>
          Imipénème/Relebactam 500mg/250mg x4/j IV<br>
          Céfidérocol 2g x3/j IVL
        </td>
      </tr>
      <tr>
        <td>Infection urinaire</td>
        <td>Ceftolozane-Tazobactam</td>
        <td>
          Ceftazidime/Avibactam 2g/0,5g x3/j IVL<br>
          Imipénème/Relebactam 500mg/250mg x4/j IV<br>
          Céfidérocol 2g x3/j IVL
        </td>
      </tr>
      <tr>
        <td>Dermo-hypodermite</td>
        <td>Ceftolozane-Tazobactam</td>
        <td>
          Ceftazidime/Avibactam 2g/0,5g x3/j IVL<br>
          Imipénème/Relebactam 500mg/250mg x4/j IV<br>
          Céfidérocol 2g x3/j IVL
        </td>
      </tr>
    </tbody>
  </table>`, // :contentReference[oaicite:9]{index=9}

  choc: `
    <table class="simple">
      <thead><tr><th>Molécule</th><th>Posologie</th><th>Effets indésirables</th></tr></thead>
      <tbody>
        <tr>
          <td>Amikacine</td>
          <td>30 mg/kg IVL<br>Objectif pic &gt; CMI×8<br>Objectif résiduelle &lt; 5 mg/L</td>
          <td>Néphrotoxicité (NTA),<br>Toxicité cochléaire (irréversible)</td>
        </tr>
      </tbody>
    </table>`
};


BACTERIA_DATA.acineto = {
  title: "Acinetobacter baumannii résistant aux carbapénèmes",
  definition: `
    <em>Acinetobacter baumannii</em> est également susceptible d’évoluer vers des souches multirésistantes en milieu nosocomial,
    et notamment vers la résistance aux carbapénèmes (ABRI = <em>A. baumannii</em> résistant à l’Imipénème).`,
  mecanisme: `
    <em>A. baumannii</em> peut exprimer de nombreux gènes de résistance naturels (chromosomiques) et acquis (plasmidiques) :<br>
    • β-lactamines : Pase (SCO-1), Case (AmpC), carbapénèmases (KPC, NDM, OXA23), pompe à efflux AdeABC<br>
    • Aminosides : Acétylase AAC-6’, méthylase ArmA, pompes à efflux AdeABC et AbeM<br>
    • Fluoroquinolones : Mutations <em>gyrA</em>, pompes à efflux AdeABC et AbeM.`,
  epidemio: `Parmi les souches invasives de <em>A. baumannii</em> documentées : 15% sont résistantes à l’Imipénème (2021, France).`,
  phenotype: `
    <table class="pheno"><thead>
      <tr>
        <th><em>A. baumannii</em></th><th>WT</th><th>Pase</th><th>Case</th><th>Pase + Case</th><th>BLSE</th><th>ABRI</th>
      </tr>
    </thead><tbody>
      <tr><td>Pipéracilline</td><td>S</td><td>R</td><td>I/R</td><td>R</td><td>R</td><td>S/I/R</td></tr>
      <tr><td>Pipé/Tazo.</td><td>S</td><td>I</td><td>I/R</td><td>R</td><td>R</td><td>S/I/R</td></tr>
      <tr><td>Ceftazidime</td><td>S</td><td>S</td><td>I/R</td><td>I/R</td><td>R</td><td>S/I/R</td></tr>
      <tr><td>Céfépime</td><td>S</td><td>S</td><td>S/I/R</td><td>S/I/R</td><td>R</td><td>S/I/R</td></tr>
      <tr><td>Aztréonam</td><td>I</td><td>I</td><td>R</td><td>R</td><td>R</td><td>S/I/R</td></tr>
      <tr><td>Imipénème</td><td>S</td><td>S</td><td>S</td><td>S</td><td>S</td><td>R</td></tr>
      <tr><td>Ciprofloxacine</td><td>S</td><td>S</td><td>S</td><td>S</td><td>I/R</td><td>S/I/R</td></tr>
      <tr><td>Amikacine</td><td>S</td><td>S</td><td>S</td><td>S</td><td>S/I</td><td>S/I</td></tr>
    </tbody></table>`,
  refAtb: `
    <table class="simple">
      <thead><tr><th>Molécule</th><th>Posologie</th><th>BP EUCAST</th><th>+ 1 antibiotique parmi…</th></tr></thead>
      <tbody>
        <tr>
          <td>Ampicilline-sulbactam</td>
          <td>2 g/1 g x3/j IV</td>
          <td>Données insuffisantes</td>
          <td>Colimycine, amikacine, tigécycline, méropénème (si CMI &lt; 8 mg/L)</td>
        </tr>
      </tbody>
    </table>`,
  siteAtb: `
  <table class="simple">
    <thead>
      <tr>
        <th>Site infectieux</th>
        <th>1ère intention</th>
        <th>Alternatives (dont allergies β-lactamines)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Pneumonie</td>
        <td>Ampicilline-sulbactam<br>+ autre antibiotique</td>
        <td>Bithérapie associant :<br>- Méropénème 4–6 g/24h IV (sauf allergie)<br>-Colistine 9–12 MUI x3/j IV<br>- Amikacine 25–30 mg/kg IV</td>
      </tr>
      <tr>
        <td>Bactériémie</td>
        <td>Ampicilline-sulbactam<br>+ autre antibiotique</td>
        <td>Bithérapie associant :<br>- Méropénème 4–6 g/24h IV (sauf allergie)<br>- Amikacine 25–30 mg/kg IV</td>
      </tr>
      <tr>
        <td>Inf. intra-abdominale</td>
        <td>Ampicilline-sulbactam<br>+ autre antibiotique</td>
        <td>Bithérapie associant :<br>- Méropénème 4–6 g/24h IV (sauf allergie)<br>- Tigécycline 100 mg puis 50 mg x2/j IV<br>- Amikacine 25–30 mg/kg IV</td>
      </tr>
      <tr>
        <td>Infection urinaire</td>
        <td>Ampicilline-sulbactam<br>+ autre antibiotique</td>
        <td>Bithérapie associant :<br>- Méropénème 4–6 g/24h IV (sauf allergie)<br>- Amikacine 25–30 mg/kg IV</td>
      </tr>
      <tr>
        <td>Dermo-hypodermite</td>
        <td>Ampicilline-sulbactam<br>+ autre antibiotique</td>
        <td>Bithérapie associant :<br>- Méropénème 4–6 g/24h IV (sauf allergie)<br>- Tigécycline 100 mg puis 50 mg x2/j IV<br>- Amikacine 25–30 mg/kg IV</td>
      </tr>
    </tbody>
  </table>`,

  choc: `
    <table class="simple">
      <thead><tr><th>Molécule</th><th>Posologie</th><th>Effets indésirables</th></tr></thead>
      <tbody>
        <tr>
          <td>Amikacine (Sauf si employé dans la bithérapie)</td>
          <td>30 mg/kg IVL<br>Obj. pic &gt; CMI×8<br>Obj. résiduelle &lt; 5 mg/L</td>
          <td>Néphrotoxicité (NTA),<br>Toxicité cochléaire (irréversible)</td>
        </tr>
      </tbody>
    </table>`
};

BACTERIA_DATA.steno = {
  title: "Stenotrophomonas maltophilia",
  definition: `
    <em>Stenotrophomonas maltophilia</em> est un BGN non fermentant de l’environnement et de la flore intestinale de l’homme,
    ayant un pouvoir pathogène en milieu nosocomial, et caractérisé par de nombreuses résistances naturelles
    induites par la pression de sélection antibiotique.`, // :contentReference[oaicite:2]{index=2}

  mecanisme: `
    <p><em>S. maltophilia</em> présente des résistances naturelles contre :</p>
    <p><strong>Les β-lactamines</strong> : Hydrolyse par 2 types de β-lactamases<br>
    - β-lactamase L1 (Classe B) : R. pénicillines, céphalosporines, carbapénèmes<br>
    - β-lactamase L1 (Classe A) : BLSE (R. Péni, céphalosporines, aztréonam)</p>
    <p><strong>Les aminosides</strong> : Modification des aminosides par les enzymes : APH-3’, ANT-2’, AAC-6’</p>
    <p><strong>Autres</strong> : La colistine et la fosfomycine</p>`, // :contentReference[oaicite:3]{index=3}

  epidemio: `
    Les souches invasives de <em>S. maltophilia</em> sont toujours résistantes aux β-lactamines
    (sauf Ceftazidime : résistance dans 30% des cas), toujours résistantes aux aminosides,
    et résistantes à la Lévofloxacine dans 20% des cas. Elles sont sensibles au Cotrimoxazole dans 96% des cas
    (1997–2016, Monde).`, // :contentReference[oaicite:4]{index=4}

  phenotype: `
  <table class="simple">
    <thead>
      <tr>
        <th><em>S. maltophilia</em></th>
        <th>Sauvage</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Pipéracilline</td><td>R</td></tr>
      <tr><td>Pipé/Tazo.</td><td>R</td></tr>
      <tr><td>Ceftazidime</td><td>S/I</td></tr>
      <tr><td>Céfépime</td><td>R</td></tr>
      <tr><td>Aztréonam</td><td>R</td></tr>
      <tr><td>Imi/méropénème</td><td>R</td></tr>
      <tr><td>Lévofloxacine</td><td>S (80% des cas)</td></tr>
      <tr><td>Aminosides</td><td>R</td></tr>
      <tr><td>Cotrimoxazole</td><td>S (96% des cas)</td></tr>
    </tbody>
  </table>`,

  refAtb: `
    <table class="simple">
      <thead><tr><th>Molécule</th><th>Posologie</th><th>BP EUCAST</th><th>Effets secondaires</th></tr></thead>
      <tbody>
        <tr>
          <td>Cotrimoxazole</td>
          <td>20+100 mg/kg/j PO/IV (dose max)</td>
          <td>S : CMI ≤ 0,001 mg/L<br>R : CMI &gt; 4 mg/L</td>
          <td>Neutropénies, néphrotox., neurotox.,<br>hépatotox., sd Lyell &amp; SJ</td>
        </tr>
      </tbody>
    </table>`, // :contentReference[oaicite:6]{index=6}

siteAtb: `
    <table class="simple">
      <thead>
        <tr>
          <th>Site infectieux</th>
          <th>1ère intention</th>
          <th>Alternatives ou bithérapie (si grave ou immunodépressé)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Pneumonie</td>
          <td>Cotrimoxazole</td>
          <td>
            Ceftazidime 4-6g/24h IVSE<br>
            Lévofloxacine 500mg x2/j IV/PO
          </td>
        </tr>
        <tr>
          <td>Bactériémie</td>
          <td>Cotrimoxazole</td>
          <td>
            Ceftazidime 4-6g/24h IVSE<br>
            Lévofloxacine 500mg x2/j IV/PO
          </td>
        </tr>
        <tr>
          <td>Inf. intra-abdominale</td>
          <td>Cotrimoxazole</td>
          <td>
            Ceftazidime 4-6g/24h IVSE<br>
            Lévofloxacine 500mg x2/j IV/PO<br>
            Tigécycline 100mg puis 50mg x2/j IV pour inf. sévères
          </td>
        </tr>
        <tr>
          <td>Infection urinaire</td>
          <td>Cotrimoxazole</td>
          <td>
            Ceftazidime 4-6g/24h IVSE<br>
            Lévofloxacine 500mg x2/j IV/PO
          </td>
        </tr>
        <tr>
          <td>Dermo-hypodermite</td>
          <td>Cotrimoxazole</td>
          <td>
            Ceftazidime 4-6g/24h IVSE<br>
            Lévofloxacine 500mg x2/j IV/PO<br>
            Tigécycline 100mg puis 50mg x2/j IV pour inf. sévères
          </td>
        </tr>
      </tbody>
    </table>`, 

  choc: `
      <p><strong>Aminosides :</strong> S. maltophilia résiste aux aminosides</p>
      <p><strong>Bithérapie :</strong> Bithérapie Bactrim/Levofloxacine indiquée</p>
`,
};

BACTERIA_DATA.carba = {
  title: "Entérobactéries sécrétrices de carbapénèmases",
  definition: `
    Sécrétion de carbapénèmases d’origine plasmidique (résistance acquise) responsables d’une hydrolyse de l’ensemble des β-lactamines par des entérobactéries originaires du tube digestif.`,
  mecanisme: `
    Carbapénèmases transmises sur plasmides au sein des population d’entérobactéries. Les principales enzymes impliquées dans le monde sont :<br>
    • KPC (Classe A)<br>
    • NDM, VIM, IMP (Classe B)<br>
    • OXA48 (Classe D).`,
  epidemio: `
    Les genres bactériens concernés sont par ordre décroissant : <em>Klebsiella</em> spp., <em>Enterobacter</em> spp., <em>Escherichia coli</em>, <em>Citrobacter</em> spp.<br>
    Les mécanismes impliqués étaient : 63% de OXA48 (Classe D), 20% de NDM (Classe B), 9% de VIM (Classe B), et 2,9% de KPC (Classe A). (CNR Kremlin Bicêtre 2021)`,
  phenotype: `
    <table class="pheno">
      <thead>
        <tr>
          <th>Type</th>
          <th>KPC (classe A)</th>
          <th>NDM / VIM (classe B)</th>
          <th>OXA-48 (classe D)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Amoxicilline</td><td>R</td><td>R</td><td>R</td></tr>
        <tr><td>Amoxicilline–Ac. Clav.</td><td>I/R</td><td>R</td><td>R</td></tr>
        <tr><td>Ticarcilline</td><td>R</td><td>R</td><td>R</td></tr>
        <tr><td>Pipéracilline</td><td>R</td><td>R</td><td>R</td></tr>
        <tr><td>Pipéracilline–Tazobact.</td><td>I/R</td><td>R</td><td>R</td></tr>
        <tr><td>C1G/C2G</td><td>I/R</td><td>R</td><td>S</td></tr>
        <tr><td>Céphamycines (Cefoxitine)</td><td>I/R</td><td>R</td><td>S</td></tr>
        <tr><td>C3G</td><td>I/R</td><td>R</td><td>S</td></tr>
        <tr><td>Céfépime</td><td>I/R</td><td>R</td><td>S</td></tr>
        <tr><td>Aztréonam</td><td>I/R</td><td>S</td><td>S</td></tr>
        <tr><td>Carbapénèmes</td><td>I/R</td><td>R</td><td>S/I/R</td></tr>
        <tr><td>Témocilline</td><td>S</td><td>–</td><td>S</td></tr>
        <tr><td>Ceftazidime–Avibactam</td><td>S</td><td>I/R</td><td>S</td></tr>
        <tr><td>Ceftolozane–Tazobactam</td><td>S</td><td>I/R</td><td>S</td></tr>
        <tr><td>Imipénème–Relebactam</td><td>S</td><td>I/R</td><td>S/I/R</td></tr>
        <tr><td>Céfidérocol</td><td>S</td><td>S</td><td>S</td></tr>
        <tr><td>Tigécycline</td><td>S</td><td>S</td><td>S</td></tr>
      </tbody>
    </table>`,
  refAtb: `
    <table class="simple">
      <thead><tr><th>Molécules</th><th>Posologie</th><th>BP EUCAST</th><th>Effets indésirables</th></tr></thead>
      <tbody>
        <tr>
          <td>Ceftazidime–avibactam</td>
          <td>2 g/0,5 g x3/j IVSE sur 4 h</td>
          <td>S : CMI ≤ 8<br>R : CMI &gt; 8</td>
          <td>Allergies, encéphalopathie,<br>convulsions, coma</td>
        </tr>
        <tr>
          <td>Aztréonam +<br>Cefta-avibactam pour classe B</td>
          <td>4 g x2/j IVSE sur 12 h</td>
          <td>S : CMI ≤ 1<br>R : CMI &gt; 4</td>
          <td>—</td>
        </tr>
      </tbody>
    </table>`,
  siteAtb: ``,
  choc: ``
};

BACTERIA_DATA.erv = {
  title: "Entérocoques résistants à la vancomycine (ERV)",
  definition: `
    Souches de <em>E. faecium</em> résistantes aux glycopeptides. Plus rarement, les souches de <em>E. faecalis</em> peuvent être concernées. 
    Les souches de <em>S. aureus</em>, sont exceptionnellement résistantes aux glycopeptides.`,
  mecanisme: `
    La résistance aux glycopeptides chez <em>Enterococcus faecium</em> est liée à la transmission plasmidique des îlots de résistance VanA (largement majoritaire) et VanB. 
    Ces îlots sont porteurs de plusieurs gènes à l’origine de la synthèse d’un peptidoglycane alternatif, non reconnu par les glycopeptides.<br>
    Ce mécanisme concerne également les rares résistances aux glycopeptides chez <em>E. faecalis</em> et <em>S. aureus</em>.`,
  epidemio: `
    La résistance à la vancomycine reste rare en France : 0,1 % des souches cliniques de <em>E. faecium</em> et 0,1% des souches cliniques de <em>E. faecalis</em> en 2021. 
    La résistance aux glycopeptides est exceptionnelle chez <em>S. aureus</em>.`,
  phenotype: `
    <table class="pheno">
      <thead><tr><th>Type</th><th>ERV</th></tr></thead>
      <tbody>
        <tr><td>Amoxicilline</td><td>R</td></tr>
        <tr><td>Oxacilline / Cloxacilline</td><td>R</td></tr>
        <tr><td>Amoxicilline – Ac. Clav.</td><td>R</td></tr>
        <tr><td>Pipéracilline</td><td>R</td></tr>
        <tr><td>Pipéracilline – Tazobact.</td><td>R</td></tr>
        <tr><td>C1G/C2G</td><td>R</td></tr>
        <tr><td>Céphamycines (Cefoxitine)</td><td>R</td></tr>
        <tr><td>C3G/C4G</td><td>R</td></tr>
        <tr><td>C5G</td><td>R</td></tr>
        <tr><td>Carbapénèmes</td><td>R</td></tr>
        <tr><td>Glycopeptides</td><td>R</td></tr>
        <tr><td>Daptomycine</td><td>S/I</td></tr>
        <tr><td>Linézolide</td><td>S</td></tr>
        <tr><td>Ofloxacine</td><td>R</td></tr>
        <tr><td>Lévofloxacine</td><td>R</td></tr>
        <tr><td>Amikacine</td><td>S/I/R</td></tr>
        <tr><td>Tobramycine</td><td>S/I/R</td></tr>
        <tr><td>Gentamicine</td><td>S/I/R</td></tr>
        <tr><td>Cotrimoxazole</td><td>R</td></tr>
        <tr><td>Rifampicine</td><td>I/R</td></tr>
        <tr><td>Tigécycline</td><td>S</td></tr>
      </tbody>
    </table>`,
  refAtb: `
    <table class="simple">
      <thead><tr><th>Molécules</th><th>Posologie</th><th>BP EUCAST</th><th>Effets indésirables</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>Référence :</strong> Linézolide <small>(sauf bactériémies et endocardites)</small></td>
          <td>600 mg 2×/jour</td>
          <td>4</td>
          <td>Cytopénie, hyperlactatémie,<br>syndrome sérotoninergique,<br>neuropathies</td>
        </tr>
        <tr>
          <td>Tigécycline <small>(infections abdominales et des tissus mous)</small></td>
          <td>50 mg ×2/jour</td>
          <td>Données insuffisantes</td>
          <td>Troubles digestifs, photosensibilisation,<br>hépatotoxicité, allergies</td>
        </tr>
        <tr>
          <td>Daptomycine <small>(bactériémies et endocardites, efficacité modérée sur <em>E. faecium</em>)</small></td>
          <td>12 mg/kg/jour</td>
          <td>Données insuffisantes</td>
          <td>Rhabdomyolyse, hépatotoxicité,<br>céphalées, infections fongiques</td>
        </tr>
      </tbody>
    </table>`,
  siteAtb: ``,
  choc: ``
};


function renderProbaPneumonieForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">
        <h2 class="antibio-title">Pneumonies</h2>

        <form id="formPneu" class="form">
          <!-- le reste de ton formulaire inchangé -->

          <fieldset>
            <legend>Lieu de survenue</legend>
            <label><input type="radio" name="origine" value="Communautaire" checked> Communautaire</label>
            <label><input type="radio" name="origine" value="Nosocomiale"> Nosocomiale</label>
          </fieldset>

          <fieldset>
            <legend>Risque de bactérie multirésistante</legend>
            <div class="row">
              <label><input type="checkbox" name="pseudo"> FdR de P. aeruginosa*</label>
              <label><input type="checkbox" name="blse"> FdR de BLSE**</label>
              <label><input type="checkbox" name="sarm"> FdR de SARM***</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Caractéristiques patient</legend>
            <div class="row">
              <label><input type="checkbox" name="immuno"> Immunodépression</label>
              <label><input type="checkbox" name="allergie"> Allergie β-lactamines</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Sévérité</legend>
            <label><input type="checkbox" name="choc"> Choc septique</label>
          </fieldset>

          <fieldset>
            <legend>Pneumonies particulières</legend>
            <div class="row">
              <label><input type="checkbox" name="necro"> Pneumonie nécrosante</label>
              <label><input type="checkbox" name="inhal"> Inhalation</label>
            </div>
          </fieldset>

          <!-- Encadré d'explications -->
          <div class="warning-container">
            <p><strong>*Risque de P. aeruginosa:</strong> Un facteur de risque parmi « antibiothérapie < 3 mois, BPCO sévère (VEMS < 50%), bronchectasies/mucoviscidose, trachéotomie, ATCD de colonisation/infection à P. aeruginosa »</p>
            <p><strong>**Risque de BLSE:</strong> « Antibiothérapie < 3 mois, ATCD de colonisation/infection à BLSE, hospitalisation depuis plus de 5j, voyage dans un pays endémique ». Indications des carbapénèmes:</p>
            <ul>
              <li> Choc septique ou P/F < 150 + 1 facteur de risque</li>
              <li> 3 facteurs de risque</li>
            </ul>
            <p><strong>***Risque de SARM:</strong> Un facteur de risque parmi « colonisation/infection récente à SARM, prévalence locale > 10-12%, lésion cutanée chronique, dialyse chronique ».</p>
          </div>

          <div class="actions">
            <button type="button" class="btn" id="btnReco">Antibiothérapie probabiliste recommandée</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>
          <div id="resPneu" class="result"></div>
        </form>
      </div>

      <!-- Colonne droite : image pneumonie -->
      <aside class="intervention-side">
        <img src="./img/pneumonie.png" alt="Pneumonie">
      </aside>

    </section>
  `;

  document.getElementById("btnReco").addEventListener("click", () => {
    const fd = new FormData(document.getElementById("formPneu"));
    const params = {
      origine: fd.get("origine") || "Communautaire",
      pseudo: !!fd.get("pseudo"),
      blse: !!fd.get("blse"),
      sarm: !!fd.get("sarm"),
      immuno: !!fd.get("immuno"),
      allergie: !!fd.get("allergie"),
      choc: !!fd.get("choc"),
      necro: !!fd.get("necro"),
      inhal: !!fd.get("inhal")
    };

    // ——— Logique PROVISOIRE pour démonstration (on branchera tes vraies règles ensuite)
    const reco = decidePneumonie(params);
    document.getElementById("resPneu").textContent = reco +
      "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

function renderProbaIUForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">
        
        <h2 class="antibio-title">Infections urinaires</h2>

        <form id="formIU" class="form">

          <fieldset>
            <legend>Lieu de survenue</legend>
            <label><input type="radio" name="origine" value="Communautaire" checked> Communautaire</label>
            <label><input type="radio" name="origine" value="Nosocomiale"> Nosocomiale</label>
          </fieldset>
          
          <fieldset>
            <legend>Signes de gravité</legend>
            <label><input type="checkbox" name="qsofa2"> Q-SOFA ≥ 2</label>
            <label><input type="checkbox" name="gesteUrg"> Geste urologique urgent</label>
            <label><input type="checkbox" name="choc"> Choc septique</label>
          </fieldset>

          <fieldset>
            <legend>Facteurs de risque microbiologique</legend>
            <label><input type="checkbox" name="blse" value="BLSE/portage"> Infection/portage BLSE < 6 mois</label>
            <label><input type="checkbox" name="autreFdrBlse" value="Autre FdR BLSE*"> Autre FdR BLSE*</label>
          </fieldset>

          <fieldset>
            <legend>Facteurs liés au patient</legend>
            <label><input type="checkbox" name="allergieBL" value="Allergie aux β-lactamines"> Allergie aux β-lactamines</label>
            <label><input type="checkbox" name="immunodep" value="Immunodépression"> Immunodépression</label>
          </fieldset>

          <fieldset>
            <legend>Cas particulier</legend>
            <label><input type="checkbox" name="pnaEmphy"> Pyélonéphrite emphysémateuse</label>
          </fieldset>

          <!-- Encadré d'explication -->
          <div class="warning-container">
            <p><strong>*Facteurs de risque de BLSE :</strong> ATCD de colonisation/infection à BLSE dans les 6 mois, antibiothérapie dans les 6 mois (Spectre ≥ Augmentin/C1G/C2G), voyage en pays endémique.</p>
          </div>

          <div class="actions">
            <button type="button" class="btn" id="btnIU">Antibiothérapie probabiliste recommandée</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resIU" class="result"></div>
        </form>
      </div>

      <!-- Colonne droite : image -->
      <aside class="intervention-side">
        <img src="./img/urinaire.png" alt="Infections urinaires">
      </aside>

    </section>
  `;

  document.getElementById("btnIU").addEventListener("click", () => {
   const fd = new FormData(document.getElementById("formIU"));
const params = {
  origine: fd.get("origine") || "Communautaire",
  qsofa2: !!fd.get("qsofa2"),
  gesteUrg: !!fd.get("gesteUrg"),
  choc: !!fd.get("choc"),
  blse: fd.get("blse") || "",
  autreFdrBlse: fd.get("autreFdrBlse") || "",
  allergieBL: fd.get("allergieBL") || "",
  immunodep: fd.get("immunodep") || "",
  pnaEmphy: !!fd.get("pnaEmphy")
};
const out = decideIU(params);
document.getElementById("resIU").textContent = out + "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

// ——— Transposition stricte de ta macro VBA (IU_GenerateResult) ———
function decideIU(p){
  // Gravité
  let gravite = "Sans signe de gravité";
  if (p.choc) gravite = "Choc septique";
  else if (p.qsofa2 || p.gesteUrg) gravite = "Signes de gravité sans choc (Q-SOFA = 2 et/ou geste urologique urgent)";

  const fdrBLSE = (p.blse || p.autreFdrBlse); // Vérification des facteurs de risque BLSE
  let res = "", notes = "";

  // Cas particuliers prioritaires
 if (p.pnaEmphy) {
  if (p.allergieBL) {
    // Si PNA emphysémateuse et allergie aux béta-lactamines
    res = "Aztréonam 1 g x4/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min + levée de l’obstacle.\n" +
          "PNA emphysémateuse — FdR : diabète, obstacle des voies urinaires ; TDM : gaz intra-rénal ; Germes : entérobactéries (E. coli ~70%).\n" +
          "Remarque : exceptionnellement nosocomiale.";
  } else {
    // Si uniquement PNA emphysémateuse sans allergie
    res = "Céfotaxime 1 g x4–6/24h IVL + Amikacine 25–30 mg/kg IVL sur 30 min + levée de l’obstacle.\n" +
          "PNA emphysémateuse — FdR : diabète, obstacle des voies urinaires ; TDM : gaz intra-rénal ; Germes : entérobactéries (E. coli ~70%).\n" +
          "Remarque : exceptionnellement nosocomiale.";
  }
  return wrapIU(p, gravite, res, notes);
}

  if (p.allergieBL){
    if (p.origine === "Communautaire"){
      if (p.choc){
        res = "Aztréonam 1 g x4/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Aztréonam 1 g x4/j IVL OU Amikacine 25–30 mg/kg IVL sur 30 min.\n" +
              "Si choc septique : associer Aztréonam + Amikacine.";
      }
    } else {
      res = "Aztréonam 1 g x4/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
    }
    return wrapIU(p, gravite, res, notes);
  }


  // Tronc commun
  if (p.origine === "Communautaire"){
    if (gravite === "Sans signe de gravité"){
      res = "Céfotaxime 1 g x4–6/24h IVL.";
      if (fdrBLSE) notes = "Note : pas de couverture BLSE même en cas de facteur de risque.";
    } else if (gravite.startsWith("Signes de gravité")){
      if (p.blse){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Céfotaxime 1 g x4–6/24h IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    } else { // Choc
      if (fdrBLSE){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Céfotaxime 1 g x4–6/24h IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    }
    if (p.immuno && gravite === "Sans signe de gravité"){
      notes = (notes ? notes + "\n" : "") + 'Remarque : "patient immunodéprimé ou non" ? même schéma.';
    }
  } else {
    // Nosocomiale
    if (gravite === "Sans signe de gravité"){
      if (fdrBLSE){
        res = "Pipéracilline-tazobactam 4 g x4/j + Amikacine 25–30 mg/kg IVL sur 30 min.";
        notes = "Éviter les carbapénèmes en probabiliste.";
      } else {
        res = "Pipéracilline-tazobactam 4 g x4/j.";
      }
    } else if (gravite.startsWith("Signes de gravité")){
      if (p.blse){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Pipéracilline-tazobactam 4 g x4/j + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    } else { // Choc
      if (fdrBLSE){
        res = "Méropénème 4–6 g/24h IVL OU Imipénème 1 g x3/j IVL + Amikacine 25–30 mg/kg IVL sur 30 min.";
      } else {
        res = "Pipéracilline-tazobactam 4 g x4/j + Amikacine 25–30 mg/kg IVL sur 30 min.";
      }
    }
  }

  return wrapIU(p, gravite, res, notes);
}

function wrapIU(p, gravite, res, notes){
  const lignes = [];
  if (p.immuno)   lignes.push("Critère : immunodépression cochée");
  if (p.blse)   lignes.push("Critère : infection/portage BLSE < 6 mois");
  if (p.autreFdrBlse)  lignes.push("Critère : autre facteur de risque de BLSE");
  if (p.pnaEmphy) lignes.push("Critère : PNA emphysémateuse");
  if (p.allergie) lignes.push("Critère : allergie sévère aux ß-lactamines");

  return [
    "Origine : " + p.origine,
    "Gravité : " + gravite,
    (lignes.length ? lignes.join("\n") : null),
     "",
    "Proposition thérapeutique :",
    "", 
    res,
    (notes ? "\n" + notes : "")
  ].filter(Boolean).join("\n");
}

function renderProbaAbdoForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- COLONNE GAUCHE -->
      <div class="intervention-main">

        <h2 class="antibio-title">Infections intra-abdominales</h2>

        <form id="formAbdo" class="form">

          <fieldset>
            <legend>Origine</legend>
            <label><input type="radio" name="origine" value="Communautaires" checked> Communautaires</label>
            <label><input type="radio" name="origine" value="Nosocomiales"> Nosocomiales</label>
          </fieldset>

          <fieldset>
            <legend>Catégorie d’infection</legend>
            <div class="row">
              <label><input type="radio" name="categorie" value="Infections des voies biliaires"> Infections des voies biliaires</label>
              <label><input type="radio" name="categorie" value="Infections entéro-coliques (hors péritonites)"> Infections entéro-coliques (hors péritonites)</label>
              <label><input type="radio" name="categorie" value="Péritonites secondaires"> Péritonites secondaires</label>
              <label><input type="radio" name="categorie" value="Cas particuliers"> Cas particuliers</label>
            </div>
          </fieldset>

          <fieldset id="fsSousType" class="hidden">
            <legend>Sous-type</legend>
            <select id="cboSousType"></select>
          </fieldset>

          <fieldset>
            <legend>Facteurs de risque microbiologiques</legend>
            <div class="row">
              <label><input type="checkbox" name="BLSE"> FdR de BLSE* </label>
              <label><input type="checkbox" name="Faecium"> FdR de E. faecium**</label>
              <label><input type="checkbox" name="Dupont"> Score de Dupont ≥ 3*** </label>
              <label><input type="checkbox" name="ProtheseBiliaire"> Prothèse biliaire</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Gravité</legend>
            <div class="row">
              <label><input type="checkbox" name="Sepsis"> Sepsis</label>
              <label><input type="checkbox" name="Choc"> Choc septique</label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Facteurs liés au patient</legend>
            <div class="row">
              <label><input type="checkbox" name="allergieBL"> Allergie sévère β-lactamines</label>
              <label><input type="checkbox" name="immunodep"> Immunodépression</label>
            </div>
          </fieldset>

          <!-- Encadré explicatif -->
          <div class="warning-container">
            <p><strong>*Facteurs de risque d’infection à BLSE :</strong> traitement < 1 mois par Tazocilline ou C3G anti-pyo, colonisation/infection à EBLSE, colonisation/infection à P. aeruginosa Tazo-R dans les 3 derniers mois.</p>
            <p><strong>**Risque de E. faecium :</strong> immunodéprimé, infection biliaire, ATB en cours, colonisation connue à E. faecium.</p>
            <p><strong>***Score de Dupont :</strong> antifongique si ≥ 3 critères : femme, perforation sus-mésocolique, choc, ATB > 48h.</p>
          </div>

          <div class="actions">
            <button type="button" class="btn" id="btnAbdo">Antibiothérapie probabiliste recommandée</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resAbdo" class="result"></div>

        </form>
      </div>

      <!-- COLONNE DROITE : image -->
      <aside class="intervention-side">
        <img src="./img/abdo.png" alt="Infections intra-abdominales">
      </aside>

    </section>
  `;

  // — sous-types dynamiques (ComboBox)
  const form = document.getElementById("formAbdo");
  const fsST = document.getElementById("fsSousType");
  const cbo = document.getElementById("cboSousType");

  function fillSubtypes(cat){
    const map = {
      "Infections des voies biliaires": [
        "Cholécystite aiguë",
        "Angiocholite aiguë",
        "Abcès hépatique",
        "Infection nécrose pancréatique"
      ],
      "Infections entéro-coliques (hors péritonites)": [
        "Appendicite aiguë",
        "Diverticulite aiguë",
        "Entérocolite ou colite"
      ],
      "Péritonites secondaires": [
        "Péritonite secondaire"
      ],
      "Cas particuliers": [
        "Infection de liquide d’ascite",
        "Perforation œsophagienne (dont syndrome de Boerhaave)"
      ]
    };
    const list = map[cat] || [];
    cbo.innerHTML = list.map(s => `<option value="${s}">${s}</option>`).join("");
    fsST.classList.toggle("hidden", list.length === 0);
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "categorie") fillSubtypes(e.target.value);
  });

  document.getElementById("btnAbdo").addEventListener("click", () => {
    const fd = new FormData(form);
    const p = {
      origine: fd.get("origine") || "Communautaires",
      TypeInfection: fd.get("categorie") || "",
      SousType: cbo.value || "",
      BLSE: !!fd.get("BLSE"),
      Faecium: !!fd.get("Faecium"),
      Dupont: !!fd.get("Dupont"),
      Sepsis: !!fd.get("Sepsis"),
      Choc: !!fd.get("Choc"),
      ProtheseBiliaire: !!fd.get("ProtheseBiliaire"),
      allergieBL: !!fd.get("allergieBL"),
      immunodep: !!fd.get("immunodep")
    };
    if (!p.TypeInfection){
      document.getElementById("resAbdo").textContent = "Sélectionnez une catégorie d’infection.";
      return;
    }
    const out = decideAbdo(p);
    document.getElementById("resAbdo").textContent = out +
      "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

// ======= LOGIQUE (transposition VBA) =======

function sepsisOuChoc(p){ return !!(p.Sepsis || p.Choc); }

function decideAbdo(p){
  switch (p.TypeInfection){
    case "Infections des voies biliaires":      return recoVoiesBiliaires(p);
    case "Infections entéro-coliques (hors péritonites)": return recoEnteroColiques(p);
    case "Péritonites secondaires":              return recoPeritonites(p);
    case "Cas particuliers":                     return recoCasParticuliers(p);
    default: return "";
  }
}

// 1) Voies biliaires
function recoVoiesBiliaires(p){
  let txt = "";
  // origine effective si immunodépression (comme VBA)
  let oEff = p.origine;
  if (oEff === "Communautaires" && p.immunodep) oEff = "Nosocomiales";

  // Sous-type : Infection nécrose pancréatique (prioritaire)
  if (p.SousType === "Infection nécrose pancréatique"){
    if (p.allergieBL){
      txt = "Ciprofloxacine 400 mg x3/j IVL/PO ou Aztréonam 1 g x4/j\n" +
            "+ Métronidazole 500 mg x3/j IVL/PO\n" +
            "+ Vancomycine 30 mg/kg/j IVSE";
      if (sepsisOuChoc(p)) txt += "\n\nSi sepsis/choc septique : Ajout Amikacine 30 mg/kg IVL";
    } else {
      txt = "Pas d’antibiothérapie récente : Céfotaxime ou Ciprofloxacine + Métronidazole 500 mg x3/j IV/PO\n\n" +
            "Antibiothérapie récente : Imipénème 1 g x3/j + Vancomycine 30 mg/kg + Fluconazole 400 mg x3/j";
      if (sepsisOuChoc(p)) txt += "\n\nSi sepsis/choc septique : Ajout Amikacine 30 mg/kg IVL";
    }
    return txt;
  }

  // Allergie prioritaire — autres sous-types biliaires
  if (p.allergieBL){
    if (oEff === "Communautaires"){
      if (["Cholécystite aiguë","Angiocholite aiguë","Abcès hépatique"].includes(p.SousType)){
        if (sepsisOuChoc(p)){
          txt = "Ciprofloxacine 750 mg x2/j IV/PO ou Aztréonam 1 g x4/j IVL\n" +
                "+ Métronidazole 500 mg x3/j IVL/PO\n" +
                "+ Vancomycine 30 mg/kg/j\n" +
                "+ Amikacine 25–30 mg/kg IVL sur 30 min";
        } else {
          txt = "Lévofloxacine 500 mg x2/j IVL/PO\n+ Métronidazole 500 mg x3/j IVL/PO\n+ Gentamicine 5–8 mg/kg IVL 30 min";
        }
      }
    } else { // Nosocomiales
      txt = "Ciprofloxacine 750 mg x2/j IVL/PO ou Aztréonam 1 g x4/j IVL\n" +
            "+ Métronidazole 500 mg x3/j IVL/PO\n" +
            "+ Vancomycine 30 mg/kg/j IVSE";
      if (sepsisOuChoc(p)){
        txt += "\nSi sepsis/choc septique:\n- Systématique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
        if (p.ProtheseBiliaire) txt += "\n- Si prothèse biliaire : Ajout Caspofungine 70 mg puis 50 mg/j IVL";
      }
    }
    return txt;
  }

  // Non allergiques — autres sous-types
  if (oEff === "Communautaires"){
    if (["Cholécystite aiguë","Angiocholite aiguë"].includes(p.SousType)){
      if (sepsisOuChoc(p)){
        txt = "Pipéracilline-tazobactam 4 g x4/j\nAmikacine 25–30 mg/kg IVL 30 min";
      } else {
        txt = "Ceftriaxone 1 g x2/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
        if (p.BLSE) txt += "\nSi FdR de BLSE* : Pas de carbapénème";
      }
    } else if (p.SousType === "Abcès hépatique"){
      txt = "Drainage percutané de l’abcès\n+ Ceftriaxone 1 g x2/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (p.BLSE) txt += "\nSi FdR de BLSE* : Pas de carbapénème";
      if (sepsisOuChoc(p)) txt += "\nSi sepsis/choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
    }
  } else { // Nosocomiales
    if (["Cholécystite aiguë","Angiocholite aiguë"].includes(p.SousType)){
      txt = p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j";
      if (sepsisOuChoc(p)){
        txt += "\nSi sepsis/choc septique:\n- Systématique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
        if (p.ProtheseBiliaire) txt += "\n- Si prothèse biliaire : Ajout Vancomycine 30 mg/kg/j IVSE et Caspofungine 70 mg puis 50 mg/j";
      }
    } else if (p.SousType === "Abcès hépatique"){
      txt = "Drainage percutané de l’abcès\n+ " + (p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j");
      if (sepsisOuChoc(p)){
        txt += "\nSi sepsis/choc septique:\n- Systématique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
        if (p.ProtheseBiliaire) txt += "\n- Si prothèse biliaire : Ajout Vancomycine 30 mg/kg/j IVSE et Caspofungine 70 mg puis 50 mg/j";
      }
    }
  }
  return txt;
}

// 2) Entéro-coliques (hors péritonites)
function recoEnteroColiques(p){
  let txt = "";
  const o = p.origine;
  const isSev = sepsisOuChoc(p);

  if (p.allergieBL){
    if (o === "Communautaires"){
      txt = "Lévofloxacine 500 mg x2/j IVL/PO\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (isSev) txt += "\nAjout Gentamicine 5–8 mg/kg ou Amikacine 25–30 mg/kg IVL 30 min";
    } else {
      txt = "Ciprofloxacine 750 mg x2/j IVL/PO ou Aztréonam 1 g x4/j IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (isSev) txt += "\n+/- Vancomycine 30 mg/kg/j IVSE\n+/- Caspofungine 70 mg puis 50 mg/j IVL";
    }
    return txt;
  }

  if (o === "Communautaires"){
    if (p.SousType === "Appendicite aiguë"){
      txt = "Appendicectomie + Amoxicilline-acide clavulanique 1 g x3/j IVL (antibiothérapie seule non recommandée)";
    } else if (p.SousType === "Diverticulite aiguë"){
      txt = "Amoxicilline-acide clavulanique 1 g x3/j IVL uniquement si : sepsis, grossesse, ASA >3, immunodépression (dont cancer évolutif et IRC terminale)";
    } else if (p.SousType === "Entérocolite ou colite"){
      txt = "Céfotaxime 4–6 g/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
    }
    if (p.BLSE) txt += "\nIdem absence de FdR de BLSE (pas de carbapénème)";
    if (isSev) txt += "\nAjout Gentamicine 5–8 mg/kg IV 30 min";
    if (p.immunodep){
      const p2 = {...p, origine: "Nosocomiales"};
      return recoEnteroColiques(p2);
    }
  } else { // Nosocomiales
    if (["Appendicite aiguë","Diverticulite aiguë","Entérocolite ou colite"].includes(p.SousType)){
      txt = p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j";
    }
    if (isSev){
      txt += "\nAjout Amikacine 25–30 mg/kg IVL 30 min\n+/- Vancomycine 30 mg/kg/j IVSE\n+/- Caspofungine 70 mg puis 50 mg/j IVL";
    }
  }
  return txt;
}

// 3) Péritonites secondaires
function recoPeritonites(p){
  let txt = "";
  const o = p.origine;

  if (p.allergieBL){
    if (o === "Communautaires"){
      txt = "Lévofloxacine 500 mg x2/j IVL/PO\n+ Métronidazole 500 mg x3/j IVL/PO\n+ Gentamicine 5–8 mg/kg IVL 30 min";
    } else {
      txt = "Ciprofloxacine 750 mg x2/j IVL/PO ou Aztréonam 1 g x4/j IVL\n+ Métronidazole 500 mg x3/j IVL/PO\n+ Vancomycine 30 mg/kg/j IVSE\n+ Amikacine 25–30 mg/kg IVL 30 min";
    }
    return txt;
  }

  if (o === "Communautaires"){
    txt = "Céfotaxime 4–6 g/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
    if (p.BLSE) txt += "\nIdem absence de FdR BLSE";
    if (p.Faecium && p.immunodep) txt += "\nAjout Vancomycine 30 mg/kg/j IVSE uniquement si immunodépression";
    if (p.Dupont) txt += "\nAjout Caspofungine 70 mg puis 50 mg/j IVL";
    if (p.Choc) txt = "Pipéracilline-tazobactam 4 g x4/j\n+ Gentamicine 5–8 mg/kg IVL 30 min";
    if (p.immunodep){
      const p2 = {...p, origine: "Nosocomiales"};
      return recoPeritonites(p2);
    }
  } else { // Nosocomiales
    txt = p.BLSE ? "Imipénème 1 g x3/j IVL" : "Pipéracilline-tazobactam 4 g x4/j";
    if (p.Faecium) txt += "\nAjout Vancomycine 30 mg/kg/j IVSE";
    if (p.Dupont) txt += "\nAjout Caspofungine 70 mg puis 50 mg/j IVL";
    if (p.Choc) txt += "\nAjout Amikacine 25–30 mg/kg IVL + Vancomycine 30 mg/kg/j IVSE";
  }
  return txt;
}

// 4) Cas particuliers
function recoCasParticuliers(p){
  let txt = "";
  const o = p.origine;

  if (p.SousType === "Infection de liquide d’ascite"){
    if (o === "Communautaires"){
      txt = "Drainage percutané de l’ascite\n+ Céfotaxime 1 g x4–6/24h IVL\n+ Albumine 1,5 g/kg J1 puis 1 g/kg J3";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
    } else {
      txt = "Drainage percutané de l’ascite\n+ Pipéracilline-tazobactam 4 g x4/j\n+ Albumine 1,5 g/kg J1 puis 1 g/kg J3";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min";
    }
  } else if (p.SousType === "Perforation œsophagienne (dont syndrome de Boerhaave)"){
    if (o === "Communautaires"){
      txt = "Ceftriaxone 1 g x2/24h IVL\n+ Métronidazole 500 mg x3/j IVL/PO";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Gentamicine 5–8 mg/kg IVL 30 min et Caspofungine 70 mg puis 50 mg/j IVL";
    } else {
      txt = "Pipéracilline-tazobactam 4 g x4/j";
      if (sepsisOuChoc(p)) txt += "\nSi choc septique : Ajout Amikacine 25–30 mg/kg IVL 30 min et Caspofungine 70 mg puis 50 mg/j IVL";
    }
  }
  return txt;
}

function renderProbaNeuroForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">

        <h2 class="antibio-title">Infections neuro-méningées</h2>

        <form id="formNeuro" class="form">

          <fieldset>
            <legend>Allergie aux β-lactamines</legend>
            <label><input type="radio" name="allergie" value="non" checked> Non</label>
            <label><input type="radio" name="allergie" value="oui"> Oui</label>
          </fieldset>

          <fieldset>
            <legend>Type d’infection</legend>
            <label><input type="radio" name="type" value="meningite" checked> Méningite purulente</label>
            <label><input type="radio" name="type" value="me"> Méningo-encéphalite</label>
            <label><input type="radio" name="type" value="abces"> Abcès cérébral</label>
          </fieldset>

          <!-- Bloc MÉNINGITE -->
          <fieldset id="blocMeningite">
            <legend>Méningite — Examen direct du LCS</legend>
            <label><input type="radio" name="edi" value="non" checked> Non</label>
            <label><input type="radio" name="edi" value="oui"> Oui</label>

            <div id="ediSelect" class="row hidden" style="margin-top:8px">
              <label style="grid-column:1/-1">
                Résultat :
                <select id="cmbEDI">
                  <option value="CG+">CG+</option>
                  <option value="CG-">CG-</option>
                  <option value="BG+">BG+</option>
                  <option value="BG-">BG-</option>
                </select>
              </label>
            </div>

            <fieldset style="margin-top:10px">
              <legend>Eléments complémentaires</legend>
              <div class="row">
                <label><input type="checkbox" name="argListeria"> Argument pour listériose*</label>
                <label><input type="checkbox" name="lcsHSV"> LCS compatible HSV/VZV</label>
              </div>
            </fieldset>
          </fieldset>

          <!-- Bloc MÉNINGO-ENCÉPHALITE -->
          <fieldset id="blocME" class="hidden">
            <legend>Signes de gravité</legend>
            <div class="row">
              <label><input type="checkbox" name="focal"> Signe de localisation</label>
              <label><input type="checkbox" name="coma"> Coma</label>
              <label><input type="checkbox" name="convuls"> Convulsions</label>
            </div>

            <fieldset style="margin-top:10px">
              <legend>Orientation étiologique</legend>
              <label><input type="radio" name="etio" value="oui"> Oui</label>
              <label><input type="radio" name="etio" value="non"> Non</label>
            </fieldset>
          </fieldset>

          <!-- Bloc ABCÈS CÉRÉBRAL -->
          <fieldset id="blocAbces" class="hidden">
            <legend>Porte d’entrée</legend>
            <label style="display:block;max-width:380px">
              <select id="cmbPorte">
                <option value=""></option>
                <option value="Post-operatoire">Post-opératoire</option>
                <option value="Traumatique">Traumatique</option>
                <option value="Indeterminee">Indéterminée</option>
                <option value="Autre">Autre</option>
              </select>
            </label>

            <fieldset style="margin-top:10px">
              <legend>Immunodépression</legend>
              <div class="row">
                <label><input type="checkbox" name="onco"> Onco-hématologie</label>
                <label><input type="checkbox" name="transp"> Transplanté</label>
                <label><input type="checkbox" name="vih"> VIH</label>
                <label><input type="checkbox" name="immunAutre"> Autre</label>
              </div>
            </fieldset>
          </fieldset>

          <!-- Encadré d'information -->
          <div class="warning-container">
            <p><strong>*Arguments en faveur d’une listériose :</strong> Un critère suffit parmi : « âge > 65 ans, grossesse, diabète, immunodépression (dont cancer évolutif), maladies hépatiques chroniques (hépatite chronique, cirrhose, OH chronique) ».</p>
          </div>

          <div class="actions">
            <button type="button" class="btn" id="btnNeuro">Antibiothérapie probabiliste recommandée</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resNeuro" class="result"></div>
        </form>

      </div>

      <!-- Colonne droite : image -->
      <aside class="intervention-side">
        <img src="./img/neuro.png" alt="Infections neuro-méningées">
      </aside>

    </section>
  `;

  // UI dynamique (affichages conditionnels)
  const form = document.getElementById("formNeuro");
  const blocM = document.getElementById("blocMeningite");
  const blocME = document.getElementById("blocME");
  const blocA = document.getElementById("blocAbces");
  const ediSelect = document.getElementById("ediSelect");
  const cmbEDI = document.getElementById("cmbEDI");
  const cmbPorte = document.getElementById("cmbPorte");

  function syncBlocks(){
    const type = new FormData(form).get("type");
    blocM.classList.toggle("hidden", type!=="meningite");
    blocME.classList.toggle("hidden", type!=="me");
    blocA.classList.toggle("hidden", type!=="abces");
    const edi = new FormData(form).get("edi");
    ediSelect.classList.toggle("hidden", !(type==="meningite" && edi==="oui"));
  }
  form.addEventListener("change", syncBlocks);
  syncBlocks();

  document.getElementById("btnNeuro").addEventListener("click", () => {
    const fd = new FormData(form);
    const p = {
      allergie: (fd.get("allergie")==="oui"),
      type: fd.get("type") || "meningite",

      // MENINGITE
      edi: fd.get("edi")==="oui",
      ediRes: cmbEDI.value,          // CG+/CG-/BG+/BG-
      argListeria: !!fd.get("argListeria"),
      lcsHSV: !!fd.get("lcsHSV"),

      // ME
      focal: !!fd.get("focal"),
      coma: !!fd.get("coma"),
      convuls: !!fd.get("convuls"),
      etio: fd.get("etio") || "",   // oui/non/""

      // ABCES
      porte: cmbPorte.value || "",
      onco: !!fd.get("onco"),
      transp: !!fd.get("transp"),
      vih: !!fd.get("vih"),
      immunAutre: !!fd.get("immunAutre")
    };

    const out = decideNeuro(p);
    document.getElementById("resNeuro").textContent =
      out + "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });
}

// ===== Logique (transposition du VBA) =====
function decideNeuro(p){
  if (p.type==="meningite")   return buildMeningite(p);
  if (p.type==="me")          return buildME(p);
  if (p.type==="abces")       return buildAbces(p);
  return "";
}

// --- Méningite purulente ---
function buildMeningite(p){
  const allerg = p.allergie;
  let S = "", dex = "", addAcyclo = "";

  if (p.lcsHSV) addAcyclo = " +/- Aciclovir 10 mg/kg x3/j IVL (si LCS compatible HSV/VZV)";

  if (p.edi){
    switch (p.ediRes){
      case "CG+":
        if (!allerg) S = "Céfotaxime 300 mg/kg/j IV";
        else         S = "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV (ou Méropénème 2 g x3/j IVL) — allergie.";
        dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
        break;
      case "CG-":
        if (!allerg) S = "Céfotaxime 200 mg/kg/j IV";
        else         S = "Ciprofloxacine 800–1200 mg/j + Rifampicine 300 mg x2/j PO/IV — allergie.";
        dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
        break;
      case "BG+":
        if (!allerg) S = "Amoxicilline 200 mg/kg/j IVL + Gentamicine 5 mg/kg IVL (30 min).";
        else         S = "Cotrimoxazole (poso max 100/20 mg/kg/j) — allergie.";
        dex = ""; // pas de dexaméthasone si BG+
        break;
      case "BG-":
        if (!allerg) S = "Céfotaxime 200 mg/kg/j IVL";
        else         S = "Ciprofloxacine 800–1200 mg/j — allergie.";
        dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
        break;
    }
  } else {
    if (!p.argListeria){
      if (!allerg) S = "Céfotaxime 300 mg/kg/j IVL" + addAcyclo + ".";
      else         S = "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV" + addAcyclo + " — allergie.";
      dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
    } else {
      if (!allerg) S = "Céfotaxime 300 mg/kg/j + Amoxicilline 200 mg/kg/j" + addAcyclo + ".";
      else         S = "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV + Cotrimoxazole (poso max 100/20 mg/kg/j)" + addAcyclo + " — allergie.";
      dex = " + Dexaméthasone 10 mg x4/j IVL à débuter avant ou en même temps que l’ATB.";
    }
  }

  return "Méningite purulente aiguë :\n• " + S + (dex || "");
}

// --- Méningo-encéphalite ---
function buildME(p){
  const allerg = p.allergie;
  const grave = !!(p.focal || p.coma || p.convuls);

  let firstLine = grave
    ? "1ère intention : Céfotaxime 300 mg/kg/j IVL + Amoxicilline + Aciclovir + Dexaméthasone + TDM cérébrale en urgence (puis PL si non contre-indiquée)"
    : "1ère intention : Ponction lombaire + TDM cérébrale";

  let detail = "";
  const lOrient = "Si orientation étiologique : traitement spécifique";
  const lSansOrient = "Si pas d’orientation : Aciclovir 10 mg/kg x3/j + Amoxicilline 200 mg/kg/j IVL +/- Céfotaxime si doute";

  if (p.etio === "oui") detail = lOrient;
  else if (p.etio === "non") detail = lSansOrient;

  if (allerg){
    firstLine = firstLine.replace("Céfotaxime 300 mg/kg/j IVL", "Vancomycine 30 mg/kg IVSE + Rifampicine 300 mg x2/j PO/IV");
    detail = detail.replace("Amoxicilline 200 mg/kg/j IVL", "Cotrimoxazole (poso max 100/20 mg/kg/j)");
  }

  return "Méningo-encéphalite :\n• " + firstLine + (detail ? "\n• " + detail : "");
}

// --- Abcès cérébral ---
function buildAbces(p){
  const allerg = p.allergie;
  const entree = p.porte || "";
  let S = "", addImmuno = "";
  const immunoPrisEnCompte = !p.immunAutre; // même logique que VBA

  if (!allerg){
    if (entree==="Post-operatoire" || entree==="Traumatique"){
      S = "Méropénème 2 g x2/j (ou Céfépime ou Ceftazidime) + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j IVL/PO.";
    } else {
      S = "Céfotaxime 300 mg/kg/j IVL (ou Ceftriaxone 100 mg/kg/j IVL) + Métronidazole 500 mg x3/j IV/PO.";
    }
  } else {
    S = "Lévofloxacine 500 mg x2/j IVL/PO + Métronidazole 500 mg x3/j IV/PO + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j IVL/PO — allergie.";
  }

  if (immunoPrisEnCompte){
    if (p.onco || p.transp){
      addImmuno += "\n• Ajouter : Cotrimoxazole (poso max 100/20 mg/kg/j) pour Nocardia spp. + Voriconazole 5 mg/kg x2/j IVL pour Aspergillus spp.";
    }
    if (p.vih){
      addImmuno += "\n• Patient VIH : Pyriméthamine-Sulfadiazine (si CD4 < 200) pour T. gondii, + Céfotaxime/Métronidazole si doute +/- quadrithérapie anti-tuberculeuse si gravité et contexte très évocateur.";
    }
  }

  return "Abcès cérébral (ATB idéalement après ponction-aspiration si possible) :\n• " + S + addImmuno;
}

function renderProbaDermohypoForm(){
  $app.innerHTML = `
    <h2 class="antibio-title">Infections des parties molles</h2>

    <div class="hero-pneu card">
      <img src="./img/dermohypodermite.png" alt="Dermohypodermite" class="form-hero">
    </div>

    <form id="formDH" class="form">
      <!-- Type d'infection -->
      <fieldset>
        <legend>Type d’infection</legend>
        <div class="row">
          <label><input type="radio" name="type" value="DHNN" checked> Dermohypodermite bactérienne non nécrosante</label>
          <label><input type="radio" name="type" value="Shock"> Suspicion choc strepto ou staphylococcique</label>
          <label><input type="radio" name="type" value="DHN"> Dermohypodermite bactérienne nécrosante</label>
          <label><input type="radio" name="type" value="FN"> Fasciite nécrosante</label>
        </div>
      </fieldset>

      <!-- BLOC GAUCHE : visible pour DH non nécrosante OU choc toxique -->
      <fieldset id="fsLeft">
        <legend>&nbsp;</legend>
        <div class="row">
          <label><input type="checkbox" name="morsure"> Morsure</label>
          <label><input type="checkbox" name="cath"> Infection de cathéter</label>
          <label><input type="checkbox" name="sarmLeft"> FdR de SARM**</label>
          <label><input type="checkbox" name="allergieLeft"> Allergie aux β-lactamines</label>
        </div>
      </fieldset>

      <!-- BLOC DROIT : visible uniquement pour DH nécrosante ou fasciite -->
      <fieldset id="fsRight" class="hidden">
        <legend>&nbsp;</legend>

        <fieldset>
          <legend>Lieu de survenue</legend>
          <label><input type="radio" name="origine" value="Communautaire" checked> Communautaire</label>
          <label><input type="radio" name="origine" value="Nosocomiale"> Nosocomiale/Post-opératoire</label>
        </fieldset>

        <fieldset>
          <legend>Localisation</legend>
          <label><input type="radio" name="loc" value="Membres" checked> Membres</label>
          <label><input type="radio" name="loc" value="Cervico-faciales"> Cervico-faciale</label>
          <label><input type="radio" name="loc" value="Abdomino-périnéales"> Abdomino-périnéale</label>
        </fieldset>

        <fieldset>
          <legend>Facteurs</legend>
          <div class="row">
            <label><input type="checkbox" name="blse"> FdR de BLSE*</label>
            <label><input type="checkbox" name="sarmRight"> FdR de SARM**</label>
            <label><input type="checkbox" name="allergieRight"> Allergie aux β-lactamines</label>
            <label><input type="checkbox" name="sepsis"> Sepsis/choc septique</label>
          </div>
        </fieldset>
      </fieldset>

<!-- Ajout de l'encadré avec la légende pour les infections des parties molles -->
      <div class="warning-container">
        <p><strong>*FdR de BLSE :</strong> ATB < 3 mois, ATCD de colonisation/infection BLSE, hospit. dans les 3 mois, voyage dans un pays endémique.</p>
        <p><strong>**FdR de SARM :</strong> colo/infection récente SARM, vie institution/long séjour, lésion cutanée chronique, dialyse chronique.</p>
      </div>

      <div class="actions">
        <button type="button" class="btn" id="btnDH">Antibiothérapie probabiliste recommandée</button>
        <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
      </div>
      <div id="resDH" class="result"></div>
    </form>
  `;

  // --- Affichages conditionnels des blocs (mêmes règles que le UserForm VBA)
  const form   = document.getElementById("formDH");
  const fsLeft = document.getElementById("fsLeft");
  const fsRight= document.getElementById("fsRight");

  function syncBlocks(){
    const type = new FormData(form).get("type");
    // Bloc gauche visible pour DH non nécrosante ET pour Choc toxique
    fsLeft.classList.toggle("hidden", !(type==="DHNN" || type==="Shock"));
    // Bloc droit visible uniquement pour infections nécrosantes
    fsRight.classList.toggle("hidden", !(type==="DHN" || type==="FN"));
  }
  form.addEventListener("change", syncBlocks);
  syncBlocks();

  // --- Génération de la recommandation (transposition stricte du VBA)
  document.getElementById("btnDH").addEventListener("click", () => {
    const fd = new FormData(form);
    const p = {
      type: fd.get("type") || "DHNN",

      // Bloc gauche
      morsure: !!fd.get("morsure"),
      cath: !!fd.get("cath"),
      sarmLeft: !!fd.get("sarmLeft"),
      allergieLeft: !!fd.get("allergieLeft"),

      // Bloc droit
      origine: fd.get("origine") || "Communautaire",
      loc: fd.get("loc") || "Membres",
      blse: !!fd.get("blse"),
      sarmRight: !!fd.get("sarmRight"),
      allergieRight: !!fd.get("allergieRight"),
      sepsis: !!fd.get("sepsis")
    };

    const out = decideDermohypo(p);
    document.getElementById("resDH").textContent =
      out + "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions, et adapter au contexte local.";
  });

  // ===== Logique (équivalente à M1_BuildReco/M1_ShockBlock) =====
  function decideDermohypo(p){
    // 1) Choc toxique
    if (p.type==="Shock"){
      const allergic   = p.allergieLeft;
      const fdrSarmAny = (p.sarmLeft || p.sarmRight);
      return shockBlock(allergic, fdrSarmAny);
    }

    // 2) DH non nécrosante
    if (p.type==="DHNN"){
      // Point de départ cathéter prioritaire
      if (p.cath){
        const atbSevere = p.allergieLeft
          ? "Ciprofloxacine + Vancomycine + Amikacine/Gentamicine"
          : "Céfepime/Imipénème + Vancomycine + Amikacine/Gentamicine";
        return [
          "Dermohypodermite bactérienne non nécrosante – point de départ de cathéter",
          "• Retrait du cathéter +",
          "  - Si absence de signe de gravité : Pas d’antibiothérapie probabiliste",
          "  - Si sepsis/choc septique : " + atbSevere,
          "  - +/- Caspofungine 70 mg puis 50 mg si haut risque d’infection fongique."
        ].join("\n");
      }

      // DHBNN standard
      let S = "Dermohypodermite bactérienne non nécrosante (DHBNN)\n";
      if (p.allergieLeft){
        S += "• Allergie ß-lactamines : Pristinamycine 1 g x3/j ou Clindamycine 600 mg x3/j IV/PO.\n";
      } else if (p.morsure){
        S += "• Morsure : Amoxicilline–acide clavulanique 4–6 g/j IVL.\n";
      } else {
        S += "• Référence : Amoxicilline 4–6 g/j IVL.\n";
      }
      return S.trim();
    }

    // 3) Infections nécrosantes (DHN/FN)
    const isNosocomial = (p.origine === "Nosocomiale");
    const hasAllergy   = p.allergieRight;
    const hasBLSE      = p.blse;
    const hasSARM      = p.sarmRight;
    const hasSepsis    = p.sepsis;
    const loc          = p.loc; // "Membres" | "Cervico-faciales" | "Abdomino-périnéales"

    if (isNosocomial){
      let S = "Infection nécrosante nosocomiale/post-opératoire\n";
      if (hasAllergy){
        S += "• Schéma : Ciprofloxacine 750 mg x2/j IVL/PO + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j.";
      } else {
        if (hasBLSE){
          S += "• Schéma : Méropénème 4–6 g/j IVL.";
        } else {
          S += "• Schéma : Pipéracilline–tazobactam 4 g x4/j IVL ou Méropénème 4–6 g/j IVL.";
        }
        if (hasSARM){
          S += " + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j.";
        }
      }
      if (hasSepsis) S += " + Amikacine 25–30 mg/kg IVL 30 min.";
      return S;
    }

    // Communautaire
    let S = "Infection nécrosante communautaire – Localisation : " + loc + "\n";
    if (loc === "Membres"){
      if (hasAllergy){
        S += "• Ciprofloxacine 750 mg x2/j IVL/PO + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j.";
      } else {
        if (hasBLSE){
          S += "• Méropénème 4–6 g/j IVL";
        } else {
          S += "• Pipéracilline–tazobactam 4 g x4/j IVL + Clindamycine 600 mg x3/j (48 h)";
        }
        if (hasSARM) S += " + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j ";
        S += ".";
      }
      if (hasSepsis) S += " + Amikacine 25–30 mg/kg IVL 30 min.";
      return S;
    }

    if (loc === "Cervico-faciales"){
      if (hasAllergy){
        S += "• Ciprofloxacine 750 mg x2/j IVL/PO + Clindamycine 600 mg x3/j.";
      } else {
        S += "• Amoxicilline–acide clavulanique 4–6 g/j IVL ou Céfotaxime 4–6 g/j IVL + Métronidazole 500 mg x3/j IVL/PO.";
      }
      if (hasSepsis) S += " + Gentamicine 5–8 mg/kg IVL 30 min.";
      return S;
    }

    if (loc === "Abdomino-périnéales"){
      if (hasAllergy){
        S += "• Ciprofloxacine 750 mg x2/j IVL/PO + Métronidazole 500 mg x3/j IVL/PO + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j.";
      } else {
        if (hasBLSE){
          S += "• Méropénème 4–6 g/j IVL";
        } else {
          S += "• Pipéracilline–tazobactam 4 g x4/j IVL";
        }
        if (hasSARM) S += " + Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j ";
        S += ".";
      }
      if (hasSepsis) S += " + Amikacine 25–30 mg/kg IVL 30 min.";
      return S;
    }

    return S + "• Veuillez sélectionner une localisation.";
  }

  function shockBlock(allergic, fdrSarmAny){
    const topLine = (allergic || fdrSarmAny)
      ? "Vancomycine 30 mg/kg/j ou Linézolide 600 mg x2/j IV/PO"
      : "Céfazoline 4–6 g/24 h IVL (Ou autre ß-lactamine anti-strepto/staphylococcique)";
    return [
      topLine,
      "",
      "+ Clindamycine 600 mg x3/j",
      "+ Immunoglobulines IV 1 g/kg à discuter",
      "Choc streptococcique : Evolution possible vers une forme nécrosante nécessitant la chirurgie",
      "Choc staphylococcique : Recherche d’un tampon hygiénique usagé chez la femme jeune"
    ].join("\n");
  }
}

function renderProbaEndocarditeForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">

        <h2 class="antibio-title">Endocardites infectieuses</h2>

        <form id="formEndo" class="form">

          <fieldset>
            <legend>Lieu de survenue</legend>
            <label><input type="radio" name="lieu" value="Communautaire" checked> Communautaire</label>
            <label><input type="radio" name="lieu" value="Nosocomiale/Associée aux soins"> Nosocomiale / Associée aux soins</label>
          </fieldset>

          <fieldset>
            <legend>Type de valve</legend>
            <label><input type="radio" name="valve" value="Native" checked> Native</label>
            <label><input type="radio" name="valve" value="Prothétique"> Prothétique</label>
          </fieldset>

          <fieldset>
            <legend>Allergie aux β-lactamines</legend>
            <label><input type="radio" name="aller" value="Non" checked> Non</label>
            <label><input type="radio" name="aller" value="Oui"> Oui</label>
          </fieldset>

          <div class="actions">
            <button type="button" class="btn" id="btnEndo">Antibiothérapie probabiliste recommandée</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resEndo" class="result"></div>
        </form>
      </div>

      <!-- Colonne droite : image -->
      <aside class="intervention-side">
        <img src="./img/endocardite.png" alt="Endocardite infectieuse">
      </aside>

    </section>
  `;

  document.getElementById("btnEndo").addEventListener("click", () => {
    const fd = new FormData(document.getElementById("formEndo"));
    const lieu = fd.get("lieu") || "Communautaire";
    const valve = fd.get("valve") || "Native";
    const allergie = (fd.get("aller") === "Oui");

    const message = buildRecoEndocardite(lieu, valve, allergie);
    document.getElementById("resEndo").textContent =
      message + "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions et adapter aux protocoles locaux.";
  });

  // ---------- Logique (transposition du VBA) ----------
  function buildRecoEndocardite(lieu, valve, allergie){
    const intro = [
      "Contexte : " + lieu,
      "Valve : " + valve,
      "Allergie aux β-lactamines : " + (allergie ? "Oui" : "Non"),
      "----------------------------------------------------------------------"
    ].join(" | ").replace(" | ----------------------------------------------------------------------", "\n----------------------------------------------------------------------") + "\n";

    let res = "";

    if (allergie){
      res = rec_VancoDaptoGent();
      if (valve === "Prothétique") res += "\n" + rifampicineLine();

    } else if (lieu.indexOf("Nosocomiale") === 0){
      res = rec_VancoDaptoGent();
      if (valve === "Prothétique") res += "\n" + rifampicineLine();

    } else {
      // Communautaire
      if (valve === "Native"){
        res = rec_Native_AmoxCloxa_Ou_AmoxCeftriax();
      } else if (valve === "Prothétique"){
        res = rec_VancoDaptoGent() + "\n" + rifampicineLine();
      }
    }
    return intro + res;
  }

  // --- Blocs de texte thérapeutiques ---
  function rifampicineLine(){
    return "+ Rifampicine 900 mg/j (< 70 kg) ou 1200 mg/j (> 70 kg) IV/PO en 1 à 2 prises";
    // d’après le module VBA. :contentReference[oaicite:0]{index=0}
  }

  function rec_Native_AmoxCloxa_Ou_AmoxCeftriax(){
    return [
      "Option 1 :",
      "• Amoxicilline 200 mg/kg/j IV en 6 injections +",
      "  Cloxacilline 150 mg/kg/j IV en 4–6 injections +",
      "  Gentamicine 3 mg/kg/j IVL 30 min",
      "OU",
      "Option 2 :",
      "• Amoxicilline 200 mg/kg/j IV en 6 injections +",
      "  Ceftriaxone 2–4 g/j en 1–2 injections +",
      "  Gentamicine 3 mg/kg/j IVL 30 min"
    ].join("\n"); // :contentReference[oaicite:1]{index=1}
  }

  function rec_VancoDaptoGent(){
    return [
      "• Vancomycine 30–60 mg/kg/j IVSE (objectif résiduelle 20–30 mg/L)",
      "  OU Daptomycine 10 mg/kg/j",
      "+ Gentamicine 3 mg/kg/j IVL 30 min"
    ].join("\n"); // :contentReference[oaicite:2]{index=2}
  }
}

function renderProbaSepsisForm() {
  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : contenu inchangé -->
      <div class="intervention-main">

        <h2 class="antibio-title">Sepsis sans point d'appel</h2>

        <form id="formSepsis" class="form">

          <fieldset>
            <legend>Lieu de survenue</legend>
            <label><input type="radio" name="lieu" value="Communautaire" checked> Communautaire</label>
            <label><input type="radio" name="lieu" value="Nosocomiale"> Nosocomiale</label>
          </fieldset>

          <fieldset>
            <legend>Patient neutropénique</legend>
            <label><input type="radio" name="neutro" value="Non" checked> Non</label>
            <label><input type="radio" name="neutro" value="Oui"> Oui</label>
          </fieldset>

          <fieldset>
            <legend>Allergie aux β-lactamines</legend>
            <label><input type="radio" name="allergie" value="Non" checked> Non</label>
            <label><input type="radio" name="allergie" value="Oui"> Oui</label>
          </fieldset>

          <fieldset>
            <legend>Critères microbiologiques</legend>
            <label><input type="checkbox" name="blse"> FdR de BLSE*</label>
            <label><input type="checkbox" name="sarm"> FdR de SARM**</label>
          </fieldset>

          <fieldset>
            <legend>Choc septique</legend>
            <label><input type="radio" name="choc" value="Non" checked> Non</label>
            <label><input type="radio" name="choc" value="Oui"> Oui</label>
          </fieldset>

          <aside class="card ghost" style="max-width:520px">
            <strong>Conseil malin !</strong><br>
            Avez-vous bien pensé à la Leptospirose et à la maladie de Still ?
          </aside>

          <!-- Encadré d'avertissement -->
          <div class="warning-container">
            <p><strong>*FdR de BLSE :</strong> ATB &lt; 3 mois, ATCD de colonisation/infection BLSE, hospit. dans les 3 mois, voyage dans un pays endémique.</p>
            <p><strong>**FdR de SARM :</strong> colo/infection récente SARM, vie institution/long séjour, lésion cutanée chronique, dialyse chronique.</p>
          </div>

          <div class="actions">
            <button type="button" class="btn" id="btnSepsis">Antibiothérapie probabiliste recommandée</button>
            <button type="button" class="btn ghost" onclick="history.back()">← Retour</button>
          </div>

          <div id="resSepsis" class="result"></div>

        </form>
      </div>

      <!-- Colonne droite : image -->
      <aside class="intervention-side">
        <img src="./img/sepsis.png" alt="Sepsis sans porte d'entrée">
      </aside>

    </section>
  `;

  document.getElementById("btnSepsis").addEventListener("click", () => {
    const fd = new FormData(document.getElementById("formSepsis"));
    const isCommu   = (fd.get("lieu") || "Communautaire") === "Communautaire";
    const isNoso    = !isCommu;
    const isNeutro  = (fd.get("neutro") === "Oui");
    const isAllergy = (fd.get("allergie") === "Oui");
    const hasBLSE   = !!fd.get("blse");
    const hasSARM   = !!fd.get("sarm");
    const isShock   = (fd.get("choc") === "Oui");

    const message = buildRegimen({isCommu,isNoso,isNeutro,isAllergy,hasBLSE,hasSARM,isShock});
    document.getElementById("resSepsis").textContent =
      message + "\n\n⚠️ Vérifier CI/IR, allergies, grossesse, interactions et adapter aux protocoles locaux.";
  });

  // ===== Logique transposée du VBA =====
  function buildRegimen(p){
    let res = "Antibiothérapie probabiliste recommandée :\n";
    let baseTx = "", addTx = "";

    // ---- Neutropénique vs non-neutropénique (allergie prioritaire) ----
    if (p.isNeutro){
      if (p.isAllergy){
        baseTx =
          "• Allergie aux β-lactamines :\n" +
          "  - Ciprofloxacine 750 mg x2/j IVL/PO OU Aztréonam 1 g x4/j IVL\n" +
          "  - + Métronidazole 500 mg x3/j\n" +
          "  - + Vancomycine 30 mg/kg/j IVSE";
      } else if (p.hasBLSE){
        baseTx =
          "• FdR de BLSE :\n" +
          "  - Méropénème 4–6 g/j OU Imipénème 1 g x3/j";
        baseTx += p.isNoso ? "\n  - + Vancomycine 30 mg/kg/j" : "\n  - +/- Vancomycine 30 mg/kg/j";
      } else {
        baseTx =
          "• Référence neutropénique :\n" +
          "  - Pipéracilline–tazobactam 4 g x4/j IVL OU\n" +
          "  - Céfépime 4–6 g/24h IVL + Métronidazole 500 mg x3/j";
        baseTx += p.isNoso ? "\n  - + Vancomycine 30 mg/kg/j" : "\n  - +/- Vancomycine 30 mg/kg/j";
      }

    } else {
      if (p.isAllergy){
        if (p.isCommu){
          baseTx =
            "• Allergie aux β-lactamines (communautaire) :\n" +
            "  - Lévofloxacine 500 mg x2/j + Métronidazole 500 mg x3/j";
        } else {
          baseTx =
            "• Allergie aux β-lactamines (nosocomial) :\n" +
            "  - Ciprofloxacine 750 mg x2/j IVL/PO OU Aztréonam 1 g x4/j IVL\n" +
            "  - + Métronidazole 500 mg x3/j\n" +
            "  - + Vancomycine 30 mg/kg/j IVSE";
        }
      } else if (p.hasBLSE){
        baseTx =
          "• FdR de BLSE :\n" +
          "  - Méropénème 4–6 g/j OU Imipénème 1 g x3/j";
      } else {
        if (p.isCommu){
          // Correction #1 : une seule proposition
          baseTx =
            "• Référence (communautaire) :\n" +
            "  - Céfotaxime 4–6 g/24h IVL + Métronidazole 500 mg x3/j";
        } else {
          baseTx =
            "• Référence (nosocomial) :\n" +
            "  - Pipéracilline–tazobactam 4 g x4/j IVL OU\n" +
            "  - Céfépime 4–6 g/24h IVL + Métronidazole 500 mg x3/j";
        }
      }
    }

    // ---- Ajouts imposés ----
    // Aminoside si choc septique (+/- caspofungine)
    if (p.isShock){
      if (p.isCommu){
        addTx += "\n• Choc septique : ajouter Gentamicine 5–8 mg/kg IVL (30 min)";
      } else {
        addTx += "\n• Choc septique : ajouter Amikacine 25–30 mg/kg IVL (30 min)";
      }
      addTx += "\n  +/- Caspofungine 70 mg J1 puis 50 mg/j";
    }

    // Vancomycine si FdR SARM (sauf communautaire non-neutropénique sans choc)
    if (p.hasSARM){
      let shouldAddVanco = true;
      // Correction #2
      if (p.isCommu && !p.isNeutro && !p.isShock) shouldAddVanco = false;

      if (shouldAddVanco && baseTx.toLowerCase().indexOf("vancomycine") === -1){
        addTx += "\n• Ajouter : Vancomycine 30 mg/kg/j";
      }
    }

    return res + baseTx + addTx;
  }
}

function renderProbaMediastiniteForm() {
  const $app = document.getElementById('app');

  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">

        <h2 class="antibio-title">Caractéristiques de la médiastinite post-opératoire</h2>

        <form class="form" onsubmit="return false;">
          <fieldset>
            <legend>Options</legend>

            <label class="checkbox" style="margin-top:.25rem;">
              <input type="checkbox" id="chk-allergie">
              Allergie aux β-lactamines
            </label>

            <label class="checkbox">
              <input type="checkbox" id="chk-choc">
              Choc septique
            </label>
          </fieldset>

          <div class="actions">
            <button class="btn" id="btn-run">Antibiothérapie probabiliste recommandée</button>
            <button class="btn ghost" type="button" onclick="history.back()">← Retour</button>
          </div>
        </form>

        <div id="result" class="result" style="display:none;"></div>
      </div>

      <!-- Colonne droite : image verticale -->
      <aside class="intervention-side">
        <img src="./img/mediastinite.png" alt="Médiastinites post-opératoires">
      </aside>

    </section>
  `;

  const $chkAllerg = document.getElementById('chk-allergie');
  const $chkChoc   = document.getElementById('chk-choc');
  const $btnRun    = document.getElementById('btn-run');
  const $res       = document.getElementById('result');

  $btnRun.addEventListener('click', () => {
    // 1) Base selon allergie
let gramNeg;

if ($chkAllerg.checked) {
  gramNeg = "Anti-Gram- : Aztréonam 1 g x4/j";
} else {
  // Si pas d’allergie
  gramNeg = "Anti-Gram- : Céfépime 1 g x4/j IVL ou Pipéracilline-tazobactam 4 g x4/j IVL";

  // ...et s’il y a un choc septique, on ajoute la mention carbapénème
  if ($chkChoc.checked) {
    gramNeg += " (Envisager carbapénème)";
  }
}


    // 2) Couverture Gram+
    const gramPos = "Anti-Gram+ : Vancomycine 30 mg/kg/j IVSE ou Daptomycine 10 mg/kg/j IVL";

    // 3) Si choc septique → ajout amikacine
    const choc    = $chkChoc.checked
      ? "<br>Ajout d’Amikacine 25–30 mg/kg IVL sur 30 min"
      : "";

    const text = `${gramNeg}<br><br>${gramPos}${choc ? `<br><br>${choc}` : ""}`;

    $res.style.display = 'block';
    $res.innerHTML = `
      <div class="info-card">
        <div class="info-content">${text}</div>
      </div>
    `;
  });
}

  function renderProbaScarpaForm() {
  const $app = document.getElementById('app');

  $app.innerHTML = `
    <section class="intervention-shell">

      <!-- Colonne gauche : titre + formulaire -->
      <div class="intervention-main">
        <h2 class="antibio-title">Infection de Scarpa</h2>

        <form class="form" onsubmit="return false;">
          <fieldset>
            <legend>Options</legend>

            <label class="checkbox" style="margin-top:.25rem;">
              <input type="checkbox" id="chk-allergie">
              Allergie aux β-lactamines
            </label>

            <label class="checkbox">
              <input type="checkbox" id="chk-choc">
              Choc septique
            </label>
          </fieldset>

          <div class="actions">
            <button class="btn" id="btn-run">
              Antibiothérapie probabiliste recommandée
            </button>
            <button class="btn ghost" type="button" onclick="history.back()">
              ← Retour
            </button>
          </div>
        </form>

        <div id="result" class="result" style="display:none;"></div>
      </div>

      <!-- Colonne droite : image verticale -->
      <aside class="intervention-side">
        <img src="./img/scarpa.png" alt="Infection de Scarpa">
      </aside>

    </section>
  `;

  const $chkAllerg = document.getElementById('chk-allergie');
  const $chkChoc   = document.getElementById('chk-choc');
  const $btnRun    = document.getElementById('btn-run');
  const $res       = document.getElementById('result');

  $btnRun.addEventListener('click', () => {
    // Anti-Gram- selon allergie, avec mention carbapénème si pas d’allergie + choc
    let gramNeg;
    if ($chkAllerg.checked) {
      gramNeg = "Anti-Gram- : Aztréonam 1 g x4/j";
    } else {
      gramNeg = "Anti-Gram- : Céfépime 1 g x4/j IVL ou Pipéracilline-tazobactam 4 g x4/j IVL";
      if ($chkChoc.checked) {
        gramNeg += " (Envisager carbapénème)";
      }
    }

    // Anti-Gram+
    const gramPos = "Anti-Gram+ : Vancomycine 30 mg/kg/j IVSE ou Daptomycine 10 mg/kg/j IVL";

    // Ajout si choc septique
    const choc = $chkChoc.checked
      ? "<br>Ajout d’Amikacine 25–30 mg/kg IVL sur 30 min"
      : "";

    const text = `${gramNeg}<br><br>${gramPos}${choc ? `<br><br>${choc}` : ""}`;

    $res.style.display = 'block';
    $res.innerHTML = `
      <div class="info-card">
        <div class="info-content">${text}</div>
      </div>
    `;
  });
}

function decideDuree(infection, germe){
  if (infection==="Pneumonies" && germe==="Autres") return "5–7 jours (à affiner selon documentation).";
  return "";
}


/* ============================================================
   HELPERS ETO
   ============================================================ */

// Toggle des sous-listes (lignes bleues)
function toggleEtoSub(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const visible = window.getComputedStyle(el).display !== "none";
  el.style.display = visible ? "none" : "block";
}


/* ============================================================
   BLOCS ETO RÉUTILISABLES
   ============================================================ */


// Fonction systolique VG
function etoHtmlFonctionVG() {
  return `
    <section class="eto-section">
      <h4 class="eto-title" onclick="toggleEtoBlock(this)">
        Fonction systolique VG
        <span class="eto-toggle-icon">▸</span>
      </h4>
      <div class="eto-block" style="display:none;">
      <ul class="eto-list">
        <li>
          FR de surface du VG
          <span class="eto-icon" onclick="openImg('eto_FRVG.png')">🖥️</span>
        </li>
        <li>
          FEVG par Simpson biplan
          <span class="eto-icon" onclick="openImg('eto_fevg.png')">🖥️</span>
        </li>
        <li>
          Durée d'accélération systolique CCVG
          <span class="eto-icon" onclick="openImg('eto_ccvg.png')">🖥️</span>
        </li>
        <li>
          dP/dt sur flux d'IM
          <span class="eto-icon" onclick="openImg('eto_dpdt.png')">🖥️</span>
        </li>
        <li>
          Onde S' de l'anneau mitral (TDI)
          <span class="eto-icon" onclick="openImg('eto_ondeS.png')">🖥️</span>
        </li>
        <li>
          Indice de Tei (VG)
          <span class="eto-icon" onclick="openImg('eto_tei_vg.png')">🖥️</span>
        </li>
        <li>
          Global longitudinal strain (GLS) du VG
          <span class="eto-icon" onclick="openImg('eto_strain_vg.png')">🖥️</span>
        </li>
      </ul>
      </div>
    </section>
  `;
}

// Cinétique segmentaire du VG (séparée)
function etoHtmlVGSegmentaire() {
  return `
    <section class="eto-section">
      <h4 class="eto-title" onclick="toggleEtoBlock(this)">
        Cinétique segmentaire du VG
        <span class="eto-toggle-icon">▸</span>
      </h4>
      <div class="eto-block" style="display:none;">
      <ul class="eto-list">
        <li>
         Cinétique segmentaire: 17 segments du VG (AHA)
          <span class="eto-icon" onclick="openImg('eto_vg_17segments.png')">🖥️</span>
        </li>
      </ul>
      </div>
    </section>
  `;
}

// Valve aortique + RA/IA
function etoHtmlValveAortique() {
  return `
    <section class="eto-section">
      <h4 class="eto-title" onclick="toggleEtoBlock(this)">
        Valve aortique
        <span class="eto-toggle-icon">▸</span>
      </h4>
      <div class="eto-block" style="display:none;">
      <ul class="eto-list">
        <li>
          Morphologie de la valve aortique
          <span class="eto-icon" onclick="openImg('eto_ao_morphologie.png')">🖥️</span>
        </li>
        <li>
          Insuffisance aortique : Classification
          <span class="eto-icon" onclick="openImg('eto_ia_quantification.png')">🖥️</span>
        </li>
        <li>
          Insuffisance aortique : Quantification par méthode PISA
          <span class="eto-icon" onclick="openImg('eto_ia_PISA.png')">🖥️</span>
        </li>
        <li>
          Insuffisance aortique : Quantification par Vena Contracta
          <span class="eto-icon" onclick="openImg('eto_ia_VC.png')">🖥️</span>
        </li>
        <li>
          Insuffisance aortique : Quantification par temps de 1/2 pression (PHT)
          <span class="eto-icon" onclick="openImg('eto_ia_1.2.png')">🖥️</span>
        </li>
        <li>
          Rétrécissement aortique
          <span class="eto-icon" onclick="openImg('eto_ra.png')">🖥️</span>
        </li>
      </ul>
      </div>
    </section>
  `;
}

// Valve mitrale (IM / RM)
function etoHtmlValveMitrale() {
  return `
    <section class="eto-section">
      <h4 class="eto-title" onclick="toggleEtoBlock(this)">
        Valve mitrale
        <span class="eto-toggle-icon">▸</span>
      </h4>
      <div class="eto-block" style="display:none;">
      <ul class="eto-list">
        <li>
          Morphologie de la valve mitrale
          <span class="eto-icon" onclick="openImg('eto_mit_morphologie.png')">🖥️</span>
        </li>
        <li>
          Insuffisance mitrale: Classification
          <span class="eto-icon" onclick="openImg('eto_im_classif.png')">🖥️</span>
        </li>
        <li>
          Insuffisance mitrale: Quantification par méthode PISA
          <span class="eto-icon" onclick="openImg('eto_im_PISA.png')">🖥️</span>
        </li>
        <li>
          Insuffisance mitrale: Quantification par Vena Contracta
          <span class="eto-icon" onclick="openImg('eto_im_VC.png')">🖥️</span>
        </li>
        <li>
          Insuffisance mitrale: Quantification par temps de 1/2 pression (PHT)
          <span class="eto-icon" onclick="openImg('eto_im_1.2.png')">🖥️</span>
        </li>
        <li>
          Rétrécissement mitral: Gradient moyen
          <span class="eto-icon" onclick="openImg('eto_rm_gradient.png')">🖥️</span>
        </li>
        <li>
          Rétrécissement mitral: Surface mitrale par planimétrie
          <span class="eto-icon" onclick="openImg('eto_rm_plani.png')">🖥️</span>
        </li>
        <li>
          Rétrécissement mitral: Surface mitrale par temps de 1/2 pression (PHT)
          <span class="eto-icon" onclick="openImg('eto_rm_1.2.png')">🖥️</span>
        </li>
        <li>
          Rétrécissement mitral: : Surface mitrale par équiation de continuité
          <span class="eto-icon" onclick="openImg('eto_rm_gradient_surface.png')">🖥️</span>
        </li>
      </ul>
      </div>
    </section>
  `;
}

// PTDVG fonction diastolique
function etoHtmlPTDVG() {
  return `
    <section class="eto-section">
      <h4 class="eto-title" onclick="toggleEtoBlock(this)">
        Estimation des PTDVG
        <span class="eto-toggle-icon">▸</span>
      </h4>
      <div class="eto-block" style="display:none;">
      <ul class="eto-list">
        <li>
         Estimation des PTDVG: E/A, E/E', pente E, flux veines pulmoanires
          <span class="eto-icon" onclick="openImg('eto_ptdvg.png')">🖥️</span>
        </li>
      </ul>
      </div>
    </section>
  `;
}

// Fonction VD
function etoHtmlFonctionVD() {
  return `
    <section class="eto-section">
      <h4 class="eto-title" onclick="toggleEtoBlock(this)">
        Fonction systolique du VD
        <span class="eto-toggle-icon">▸</span>
      </h4>
      <div class="eto-block" style="display:none;">
      <ul class="eto-list">
        <li>
          FR de surface du VD
          <span class="eto-icon" onclick="openImg('eto_frvd.png')">🖥️</span>
        </li>
        <li>
          TAPSE
          <span class="eto-icon" onclick="openImg('eto_vd_tapse.png')">🖥️</span>
        </li>
        <li>
          Onde S tricuspide (TDI)
          <span class="eto-icon" onclick="openImg('eto_vd_sprime.png')">🖥️</span>
        </li>
        <li>
          Indice de Tei VD
          <span class="eto-icon" onclick="openImg('eto_vd_tei.png')">🖥️</span>
        </li>
        <li>
          Global longitudinal strain (GLS) du VD
          <span class="eto-icon" onclick="openImg('eto_vd_strain.png')">🖥️</span>
        </li>
        <li>
          Rapport TAPSE/PAPs
          <span class="eto-icon" onclick="openImg('eto_tapsepaps.png')">🖥️</span>
        </li>
      </ul>
      </div>
    </section>
  `;
}

// HTAP
function etoHtmlHTAP() {
  return `
    <section class="eto-section">
      <h4 class="eto-title" onclick="toggleEtoBlock(this)">
        Evaluation d'une HTAP
        <span class="eto-toggle-icon">▸</span>
      </h4>
      <div class="eto-block" style="display:none;">
      <ul class="eto-list">
        <li>
          Estimation PAPS sur IT
          <span class="eto-icon" onclick="openImg('eto_htap_paps_it.png')">🖥️</span>
        </li>
        <li>
          Estimation PAPm/PAPd sur IP
          <span class="eto-icon" onclick="openImg('eto_htap_pap_ip.png')">🖥️</span>
        </li>
        <li>
          Ralentissement méso-systolique pulmonaire
          <span class="eto-icon" onclick="openImg('eto_htap_mesosyst.png')">🖥️</span>
        </li>
      </ul>
      </div>
    </section>
  `;
}

function toggleEtoBlock(titleEl) {
  const section = titleEl.closest(".eto-section");
  if (!section) return;

  const block = section.querySelector(".eto-block");
  const icon  = titleEl.querySelector(".eto-toggle-icon");

  if (!block) return;

  const isHidden = block.style.display === "none" || block.style.display === "";
  block.style.display = isHidden ? "block" : "none";

  if (icon) {
    icon.textContent = isHidden ? "▾" : "▸";
  }
}

/* ============================================================
   PAGE OPTIONNELLE : BIBLIOTHÈQUE ETO
   ============================================================ */

function renderEtoBibliotheque() {
  const encadres = [
  etoHtmlFonctionVG(),
  etoHtmlVGSegmentaire(),   // 👈 nouveau
  etoHtmlValveAortique(),
  etoHtmlValveMitrale(),
  etoHtmlPTDVG(),
  etoHtmlFonctionVD(),
  etoHtmlHTAP(),
];

  renderInterventionPage({
    titre: "Bibliothèque ETO",
    sousTitre: "",
    image: "eto_bibliotheque.png",
    encadres,
  });
}

// =====================================================================
//  CEC
// =====================================================================

function renderCecMenu() {
  $app.innerHTML = `
    <section>
      <div class="hero">
        <img src="cec.png" alt="CEC" class="menu-section-img" />
        <h2>Circulation extra-corporelle</h2>
      </div>
      <p>Menu CEC à remplir ensuite (priming, anticoagulation, sevrage, particularités, etc.).</p>
    </section>
  `;
}

// =====================================================================
//  PAGES “PLANNING” ET “ANNUAIRE” (PLACEHOLDERS)
// =====================================================================

function renderPlanning() {
  $app.innerHTML = `
    <section>
      ${sectionHeader("Planning médical", "planning.png")}

      <div class="card">
        <p>Le planning médical s’affiche ci-dessous. Vous pouvez le faire défiler ou l’ouvrir dans un nouvel onglet.</p>

        <div style="margin-top:12px; height:70vh;">
          <iframe
            src="planning-medical.pdf"
            style="width:100%; height:100%; border:none;"
          ></iframe>
        </div>

        <p style="margin-top:8px; font-size:0.9rem;">
          Si le document ne s’affiche pas, vous pouvez le
          <a href="planning-medical.pdf" target="_blank" rel="noopener noreferrer">télécharger ici</a>.
        </p>
      </div>
    </section>
  `;
}

function renderAnnuaire() {
  const encadres = [

    /* ================================
       1) ANESTHÉSISTES-RÉANIMATEURS
       ================================ */
    {
      titre: "Anesthésistes-réanimateurs",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>

        <table class="annuaire-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Poste</th>
              <th>Téléphone</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>BOUGLE Adrien</td><td>62 991</td><td><a href="tel:0664825629">06.64.82.56.29</a></td></tr>
            <tr><td>ABBES Ahmed</td><td>65 693</td><td><a href="tel:0758706125">07.58.70.61.25</a></td></tr>
            <tr><td>ANNONAY Marianne</td><td>62 994</td><td><a href="tel:0622829131">06.22.82.91.31</a></td></tr>
            <tr><td>ARZOINE Jérémy</td><td>27 133</td><td><a href="tel:0633705373">06.33.70.53.73</a></td></tr>
            <tr><td>BOROUCHAKI Antoine</td><td>62 998</td><td><a href="tel:0650912946">06.50.91.29.46</a></td></tr>
            <tr><td>CAMPEANU Aurélie</td><td>28 252</td><td><a href="tel:0665317885">06.65.31.78.85</a></td></tr>
            <tr><td>CARILLION Aude</td><td>27 387</td><td><a href="tel:0683086530">06.83.08.65.30</a></td></tr>
            <tr><td>CLAPIN Sixtine</td><td>28 353</td><td><a href="tel:0689129279">06.89.12.92.79</a></td></tr>
            <tr><td>COELEMBIER Clément</td><td>65 689</td><td><a href="tel:0674580098">06.74.58.00.98</a></td></tr>
            <tr><td>DESAL Raphaël</td><td>27 195</td><td><a href="tel:0638992672">06.38.99.26.72</a></td></tr>
            <tr><td>DE SARCUS Martin</td><td>75 869</td><td><a href="tel:0665722676">06.65.72.26.76</a></td></tr>
            <tr><td>DJAVIDI Nima</td><td>28 363</td><td><a href="tel:0615791470">06.15.79.14.70</a></td></tr>
            <tr><td>DUARTE Lucie</td><td>62 315</td><td><a href="tel:0688320622">06.88.32.06.22</a></td></tr>
            <tr><td>DUCEAU Baptiste</td><td>27 915</td><td><a href="tel:0630943934">06.30.94.39.34</a></td></tr>
            <tr><td>DUREAU Pauline</td><td>27 689</td><td><a href="tel:0663800946">06.63.80.09.46</a></td></tr>
            <tr><td>GUILLEMIN Jérémie</td><td>28 258</td><td><a href="tel:0658390639">06.58.39.06.39</a></td></tr>
            <tr><td>HAMIDI Dany</td><td>28 253</td><td><a href="tel:0684283219">06.84.28.32.19</a></td></tr>
            <tr><td>HENOCQ Paul</td><td>28 255</td><td><a href="tel:0628710814">06.28.71.08.14</a></td></tr>
            <tr><td>HIRWE Axel</td><td>28 355</td><td><a href="tel:0662187589">06.62.18.75.89</a></td></tr>
            <tr><td>LABARRIERE Ambroise</td><td>28 308</td><td><a href="tel:0658989337">06.58.98.93.37</a></td></tr>
            <tr><td>LANCELOT Aymeric</td><td>62 379</td><td><a href="tel:0626362306">06.26.36.23.06</a></td></tr>
            <tr><td>LEPERE Victoria</td><td>75 885</td><td><a href="tel:0699516900">06.99.51.69.00</a></td></tr>
            <tr><td>MANSOURI Sehm</td><td>28 256</td><td><a href="tel:0772644530">07.72.64.45.30</a></td></tr>
            <tr><td>MARQUET Yann</td><td>28 356</td><td><a href="tel:0630132014">06.30.13.20.14</a></td></tr>
            <tr><td>MELLANO Vincent</td><td>28 358</td><td><a href="tel:0682288105">06.82.28.81.05</a></td></tr>
            <tr><td>MONTANA Vincenzo</td><td>62 995</td><td><a href="tel:+393890112381">(+39) 389.01.12.381</a></td></tr>
            <tr><td>NICULESCU Michaela</td><td>62 996</td><td><a href="tel:0647626407">06.47.62.64.07</a></td></tr>
            <tr><td>OMAR Edris</td><td>27 386</td><td><a href="tel:0618301220">06.18.30.12.20</a></td></tr>
            <tr><td>PERRIER Johann</td><td>28 357</td><td><a href="tel:0682997279">06.82.99.72.79</a></td></tr>
            <tr><td>POUJADE Julien</td><td>27 816</td><td><a href="tel:0632392252">06.32.39.22.52</a></td></tr>
            <tr><td>ROMBI Louise</td><td>28 106</td><td><a href="tel:0634656993">06.34.65.69.93</a></td></tr>
            <tr><td>SCHRAMM Rémi</td><td>28 062</td><td><a href="tel:0611398260">06.11.39.82.60</a></td></tr>
            <tr><td>SOUILAMAS Dina</td><td>28 279</td><td><a href="tel:0677139773">06.77.13.97.73</a></td></tr>
            <tr><td>VAUZANGES Quentin</td><td>27 613</td><td><a href="tel:0679528363">06.79.52.83.63</a></td></tr>
          </tbody>
        </table>
      `,
    },

    /* ================================
       2) CHIRURGIENS CARDIAQUES
       ================================ */
    {
      titre: "Chirurgiens cardiaques",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>

        <table class="annuaire-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Poste</th>
              <th>Téléphone</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>LEPRINCE Pascal</td><td>27 550</td><td><a href="tel:0658251284">06.58.25.12.84</a></td></tr>
            <tr><td>BARREDA Theo</td><td>27 343</td><td><a href="tel:0632127497">06.32.12.74.97</a></td></tr>
            <tr><td>D’ALESSANDRO Cosimo</td><td>65 690</td><td><a href="tel:0633009198">06.33.00.91.98</a></td></tr>
            <tr><td>DANIAL Pichoy</td><td>27 801</td><td><a href="tel:0626361022">06.26.36.10.22</a></td></tr>
            <tr><td>DEBAUCHEZ Mathieu</td><td>80 622</td><td><a href="tel:0631049949">06.31.04.99.49</a></td></tr>
            <tr><td>FARAHMAND Patrick</td><td>27 018</td><td><a href="tel:0660037997">06.60.03.79.97</a></td></tr>
            <tr><td>JUVIN Charles</td><td>27 737</td><td><a href="tel:0769172755">07.69.17.27.55</a></td></tr>
            <tr><td>HENNEB Belkacem</td><td>27 177</td><td><a href="tel:0668628504">06.68.62.85.04</a></td></tr>
            <tr><td>LAALI Mojgan</td><td>63 839</td><td><a href="tel:0622146945">06.22.14.69.45</a></td></tr>
            <tr><td>LANSAC Emmanuel</td><td>27 123</td><td><a href="tel:0664234453">06.64.23.44.53</a></td></tr>
            <tr><td>LEBRETON Guillaume</td><td>62 979</td><td><a href="tel:0672320194">06.72.32.01.94</a></td></tr>
            <tr><td>SAIYDOUN Gabriel</td><td>27 175</td><td><a href="tel:0609777694">06.09.77.76.94</a></td></tr>
            <tr><td>MEYER Horacio</td><td>28 391</td><td><a href="tel:0768222955">07.68.22.29.55</a></td></tr>
            <tr><td>RAMA Akhtar</td><td>65 687</td><td><a href="tel:0679287348">06.79.28.73.48</a></td></tr>
            <tr><td>ZAMORANO Claudio</td><td>28 391</td><td><a href="tel:0745332100">07.45.33.21.00</a></td></tr>
            <tr><td><em>Interne de garde</em></td><td>65 645</td><td>—</td></tr>
          </tbody>
        </table>
      `,
    },

    /* ================================
       3) CHIRURGIENS VASCULAIRES
       ================================ */
    {
      titre: "Chirurgiens vasculaires",
      sousTitreEncadre: "",
      html: `
        <div style="height:6px;"></div>

        <table class="annuaire-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Poste</th>
              <th>Téléphone</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>CHICHE Laurent</td><td>75 710 / 27 690</td><td><a href="tel:0612592909">06.12.59.29.09</a></td></tr>
            <tr><td>COCHENNEC Frédéric</td><td>28 217</td><td><a href="tel:0658414933">06.58.41.49.33</a></td></tr>
            <tr><td>COUTURE Thibault</td><td>28 082</td><td><a href="tel:0679067982">06.79.06.79.82</a></td></tr>
            <tr><td>LAME Charles</td><td>—</td><td><a href="tel:0771085204">07.71.08.52.04</a></td></tr>
            <tr><td>GAUDRIC Julien</td><td>27 691</td><td><a href="tel:0663739002">06.63.73.90.02</a></td></tr>
            <tr><td>LOCATELLI Federica</td><td>—</td><td><a href="tel:0759527538">07.59.52.75.38</a></td></tr>
            <tr><td>PELISSIE Jérôme</td><td>—</td><td><a href="tel:0614556626">06.14.55.66.26</a></td></tr>
            <tr><td>RUELLO Pauline</td><td>—</td><td><a href="tel:0623736504">06.23.73.65.04</a></td></tr>
            <tr><td>VERSCHEURE Dorian</td><td>27 635</td><td><a href="tel:0632901212">06.32.90.12.12</a></td></tr>
            <tr><td><em>Interne chirurgie vasculaire</em></td><td>27 493</td><td>—</td></tr>
          </tbody>
        </table>
      `,
    },
  ];

  renderInterventionPage({
    titre: "Annuaire",
    sousTitre: "",
    encadres,
  });
}

function renderCodesAcces() {
  $app.innerHTML = `
    <section>
      <div class="hero">
        <h2>Codes d’accès</h2>
      </div>

      <div class="card">
        <p>
          Page « Codes d’accès » à compléter (VPN, logiciels, accès dossiers, etc.).
        </p>
      </div>
    </section>
  `;
}

document.addEventListener("click", (e) => {
  if (e.target.id === "back-button") {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      renderHome(); // ou ta fonction d'accueil
    }
  }
});


// =====================================================================
//  PAGE 404
// =====================================================================

function renderNotFound() {
  $app.innerHTML = `
    <section>
      <h2>Page introuvable</h2>
      <button class="btn" onclick="location.hash = '#/'">Retour au menu</button>
    </section>
  `;
}

/* Titres génériques des pages Antibiothérapie */
.antibio-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 24px;
  padding: 0;
  border: none !important;
  background: none !important;
  box-shadow: none !important;
}
