const $app = document.getElementById("app");

function renderHome() {

  $app.innerHTML = `
    <section class="home">

      <h1>Babinski</h1>

      <div class="grid">

        <div class="card">
          <h3>Anesthésie</h3>
        </div>

        <div class="card">
          <h3>Réanimation</h3>
        </div>

        <div class="card">
          <h3>Enseignement</h3>
        </div>

        <div class="card">
          <h3>Bibliographie</h3>
        </div>

        <div class="card">
          <h3>Recherche</h3>
        </div>

        <div class="card">
          <h3>Annuaire</h3>
        </div>

      </div>

    </section>
  `;
}

function router() {
  renderHome();
}

window.addEventListener("hashchange", router);

document.addEventListener(
  "DOMContentLoaded",
  router
);
