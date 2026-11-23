// Petit JavaScript du portfolio : menu téléphone, filtres de projets, apparitions et lien actif.

// 1. Menu téléphone
const burger = document.querySelector(".nav__burger");
const menu = document.getElementById("menu");
function basculerMenu(ouvrir) {
  burger.setAttribute("aria-expanded", String(ouvrir));
  burger.setAttribute("aria-label", ouvrir ? "Fermer le menu" : "Ouvrir le menu");
  menu.hidden = !ouvrir;
  document.body.style.overflow = ouvrir ? "hidden" : "";
}
burger.addEventListener("click", () => basculerMenu(menu.hidden));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => basculerMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) basculerMenu(false); });

// 2. Filtres des projets
const filtres = document.querySelectorAll(".filter");
const cartes = document.querySelectorAll(".card");
filtres.forEach((f) => f.addEventListener("click", () => {
  filtres.forEach((x) => { x.classList.toggle("is-active", x === f); x.setAttribute("aria-pressed", String(x === f)); });
  cartes.forEach((c) => { c.hidden = f.dataset.f !== "tous" && c.dataset.s !== f.dataset.f; });
}));

// 3. Apparition douce des blocs au défilement
const aReveler = document.querySelectorAll(".head, .stack > *, .level, .card, .timeline li, .ways li");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const obs = new IntersectionObserver((entrees) => {
    entrees.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  aReveler.forEach((el) => { el.classList.add("reveal"); obs.observe(el); });
}

// 4. Lien du menu actif selon la section visible
const liens = document.querySelectorAll(".nav__links a");
const sections = [...liens].map((a) => document.querySelector(a.getAttribute("href")));
const obsNav = new IntersectionObserver((entrees) => {
  entrees.forEach((e) => {
    if (e.isIntersecting) liens.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => s && obsNav.observe(s));
