// ------- sw.js : PWA hors-ligne pour l'app de réanimation -------

const CACHE_NAME = "cardio-icu-v1";

// Tous les fichiers à pré-cacher (HTML, CSS, JS, images, Excel)
const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",

  // Icônes
  "./icons/icon-192.png",
  "./icons/icon-512.png",

  // Images
  "./img/BLSE.png",
  "./img/SARM.png",
  "./img/abdo.png",
  "./img/acineto.png",
  "./img/adaptee.png",
  "./img/ampC.png",
  "./img/anesthesie.png",
  "./img/antibioprophylaxie.png",
  "./img/antibioprophylaxies.png",
  "./img/bandeau.png",
  "./img/carba.png",
  "./img/cec.png",
  "./img/dermohypodermite.png",
  "./img/dialyse.png",
  "./img/duree.png",
  "./img/ecmo.png",
  "./img/endocardite.png",
  "./img/erv.png",
  "./img/fabrice.png",
  "./img/mediastinite.png",
  "./img/modalite.png",
  "./img/modalites.png",
  "./img/neuro.png",
  "./img/pneumonie.png",
  "./img/proba.png",
  "./img/pyo.png",
  "./img/reanimation.png",
  "./img/rein.png",
  "./img/sepsis.png",
  "./img/steno.png",
  "./img/titre.png",
  "./img/urinaire.png",

  "./img/eto.png",
  "./img/eto_ao_morphologie.png",
  "./img/eto_ccvg.png",
  "./img/eto_dpdt.png",
  "./img/eto_fevg.png",
  "./img/eto_frvd.png",
  "./img/eto_FRVG.png",
  "./img/eto_htap_mesosyst.png",
  "./img/eto_htap_pap_ip.png",
  "./img/eto_htap_paps_it.png",
  "./img/eto_ia_1.2.png",
  "./img/eto_ia_PISA.png",
  "./img/eto_ia_quantification.png",
  "./img/eto_ia_VC.png",
  "./img/eto_im_1.2.png",
  "./img/eto_im_classif.png",
  "./img/eto_im_PISA.png",
  "./img/eto_im_VC.png",
  "./img/eto_mit_morphologie.png",
  "./img/eto_ondeS.png",
  "./img/eto_ptdvg.png",
  "./img/eto_ra.png",
  "./img/eto_rm_1.2.png",
  "./img/eto_rm_gradient_surface.png",
  "./img/eto_rm_plani.png",
  "./img/eto_strain_vg.png",
  "./img/eto_tapsepaps.png",
  "./img/eto_tei_vg.png",
  "./img/eto_vd_sprime.png",
  "./img/eto_vd_strain.png",
  "./img/eto_vd_tapse.png",
  "./img/eto_vd_tei.png",
  "./img/eto_vg_17segments.png",

  "./img/fa.png",
  "./img/saignement.png",
  "./img/transplantation.png",
  "./img/assistances.png",
  "./img/chadsvasc.png",
  "./img/eerecmo.png",
  "./img/cardiostruct.png",
  "./img/chircec.png",
  "./img/consultation.png",
  "./img/formules.png",
  "./img/antibiotherapie.png",
  "./img/prescription.png",
  "./img/radiovasc.png",
  "./img/vasculaire.png",

  "./img/aidecognitiveSFAR.png",
  "./img/antibiotherapie2.png",
  "./img/assistances2.png",
  "./img/cardiostruct2.png",
  "./img/chircec2.png",
  "./img/dialyse2.png",
  "./img/dv.png",
  "./img/eclair.png",
  "./img/ecmova.png",
  "./img/eto2.png",
  "./img/fa2.png",
  "./img/formules2.png",
  "./img/gestionunipulm.png",
  "./img/iot.png",
  "./img/iotdoublelum.png",
  "./img/logocardio.png",
  "./img/logosaric.png",
  "./img/prescription2.png",
  "./img/radiovasc2.png",
  "./img/saignement2.png",
  "./img/tableauacr.png",
  "./img/titre2.png",
  "./img/titre3.png",
  "./img/titre4.png",
  "./img/titre5.png",
  "./img/transplantation2.png",
  "./img/annuaire.png",
  "./img/code.png",
  "./img/cf-bloc-cervical.png",
"./img/cf-bloc-thoracique-transverse.png",
"./img/cf-algorithme-quantra.png",
"./img/cf-bpv.png",
"./img/cf-erecteur-rachis.png",
"./img/cf-tap-bloc.png",
"./img/cf-serratus.png",
"./img/cf-qlb.png",
"./img/cf-biiih.png",
"./img/cf-femoral.png",
"./img/cf-obturateur.png",
"./img/cf-canal-adducteurs.png",
"./img/cf-sciatique.png",
"./img/cf-supra-claviculaire.png",
"./img/cf-plastieaortique.png",
"./img/cf-diametre-aortique.png",
"./img/objectifs-tensionnels.png",

  // Files
  "./files/Infections des prothèses vasculaires.pdf",
"./files/Antibiothérapies des amputations de membre.pdf",
"./files/Protocole DLE.pdf",
"./files/Mémo DLE.pdf",
"./files/Protocole fibrinolyse in situ.pdf",
"./files/Mémo fibrinolyse in situ.pdf",
  "./files/Bactériologie clinique.pdf",
  "./files/planning_medical.xlsx",
];

// INSTALL : pré-cache tous les fichiers définis ci-dessus
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ACTIVATE : nettoie les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  self.clients.claim();
});

// FETCH : stratégie hors-ligne (cache d'abord pour le local)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // On laisse tranquilles les requêtes externes (Euroscore 2, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Navigation (documents HTML) : on essaie le réseau puis le cache
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put("./index.html", networkResp.clone());
          return networkResp;
        } catch (e) {
          const cached = await caches.match("./index.html");
          if (cached) return cached;
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
          });
        }
      })()
    );
    return;
  }

  // Pour le reste (CSS, JS, images, Excel, etc.) : cache d'abord, puis réseau
  event.respondWith(
    (async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) {
        // En arrière-plan, on tente une mise à jour silencieuse
        fetch(req)
          .then(async (networkResp) => {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(req, networkResp.clone());
          })
          .catch(() => {});
        return cached;
      }

      try {
        const networkResp = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        await cache.put(req, networkResp.clone());
        return networkResp;
      } catch (e) {
        // Si on est hors ligne et que ce n'était pas en cache : rien à faire
        return new Response("", { status: 504, statusText: "Offline" });
      }
    })()
  );
});
