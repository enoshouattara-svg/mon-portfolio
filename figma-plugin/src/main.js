// Plugin Figma : dessine la maquette du portfolio d'Enosh Ouattara.
// Il crée les styles (couleurs, textes), les composants (boutons, badges, cartes...)
// puis les deux maquettes : ordinateur (1440 px) et téléphone (390 px).
// PHOTO_B64 (la photo en base64) est ajouté au début du fichier par build.py.

let ETAPE = "démarrage";

// ---------- Données (validées par Enosh, voir CONTENU.md) ----------
const NOM = "Enosh Jean-Ange Yerafiala Ouattara";
const NOM_ACCENT = "Ouattara";

const COULEURS = {
  "Fond": "#0B0B0F",
  "Surface": "#14141B",
  "Surface 2": "#1C1C26",
  "Bordure": "#2A2A36",
  "Texte": "#F5F3EE",
  "Texte secondaire": "#A3A1AE",
  "Accent orange": "#F77F00",
  "Accent survol": "#FF9A33",
  "Vert": "#34D399",
  "Texte sur accent": "#0B0B0F",
};

const PROJETS = [
  { fichier: "nova-spees/", chemin: "~/projets/boutique", type: "Site pour une marque", titre: "NOVA SPEES — boutique de casquettes", desc: "Boutique en ligne animée pour une marque de casquettes : 7 coloris, panier et commande par WhatsApp.", tags: ["React", "Vite", "GSAP", "WebGL"], statut: "Terminé", ia: true, lien: "Pas encore en ligne" },
  { fichier: "generateur/", chemin: "~/projets/freelance", type: "Mission freelance", titre: "Générateur de contenus marketing", desc: "Outil web qui transforme des transcriptions d’appels en contenus marketing, pour une agence au Québec. Découpé en 6 étapes hebdomadaires.", tags: ["Next.js", "Supabase", "API Claude"], statut: "En cours", ia: true, lien: "Client confidentiel" },
  { fichier: "foodstock/", chemin: "~/projets/foodstock-pro", type: "Projet personnel", titre: "FoodStock Pro", desc: "Logiciel en ligne de gestion des stocks et des achats pour les restaurants en Côte d’Ivoire ; chaque restaurant a son espace séparé.", tags: ["Python", "Django", "SQLite"], statut: "En cours", ia: true, lien: "En développement" },
  { fichier: "MaisonConnectee.java", chemin: "~/projets/maison-connectee", type: "Projet scolaire · réalisé seul", titre: "Maison Connectée", desc: "Application de bureau en Java pour une maison connectée, reliée à une base de données MySQL. Présentée en soutenance.", tags: ["Java", "JavaFX", "MySQL", "POO"], statut: "Terminé", ia: true, lien: "Présenté en soutenance" },
  { fichier: "scraper.py", chemin: "~/projets/scraper-amazon", type: "Projet académique", titre: "Scraper Amazon", desc: "Récupérer automatiquement le nom, le prix, la note, le nombre d’avis et le lien de produits Amazon, sur des pages qui se chargent dynamiquement.", tags: ["Python", "Selenium", "CSV", "pandas"], statut: "Terminé", ia: false, lien: "Code privé · disponible sur demande" },
  { fichier: "produit.py", chemin: "~/projets/comptoir-ivoire", type: "Exercice académique", titre: "Le stock du Comptoir Ivoire", desc: "Modéliser le stock d’un grossiste ivoirien : produits, prix hors taxe en FCFA, TVA de 18 % et gestion des erreurs.", tags: ["Python", "POO", "Exceptions"], statut: "Terminé", ia: false, lien: "Exercice de cours" },
];

const NIVEAUX = [
  { nom: "Pratique", barres: 4, desc: "Je m’en sers seul sur des projets.", items: ["Python", "Programmation orientée objet"] },
  { nom: "En cours", barres: 3, desc: "Je pratique régulièrement et je progresse.", items: ["Java", "SQL / MySQL", "HTML / CSS", "Selenium & scraping web"] },
  { nom: "Bases", barres: 2, desc: "Je connais les notions essentielles.", items: ["JavaScript", "Git & GitHub", "CSV · pandas · Requests", "Flutter / Dart", "Langage C"] },
  { nom: "Découverte", barres: 1, desc: "Utilisé sur de vrais projets, avec l’aide de l’IA.", items: ["Django", "React + GSAP", "Next.js", "Supabase", "API Claude"] },
];
const OUTILS = ["VS Code", "Android Studio", "Word · PowerPoint · Excel", "Figma"];
const QUALITES = ["Apprentissage rapide", "Créativité", "Discipline", "Résolution de problèmes", "Travail en équipe"];

const PARCOURS = [
  { periode: "2026 — 2027", titre: "Licence 2 Génie Logiciel (Computer Science)", lieu: "Institut Ivoirien de Technologie · Abidjan", enCours: true },
  { periode: "2025 — 2026", titre: "Licence 1 Génie Logiciel", lieu: "Institut Ivoirien de Technologie · Abidjan", enCours: false },
  { periode: "2024 — 2025", titre: "Baccalauréat", lieu: "Côte d’Ivoire", enCours: false },
  { periode: "2021 — 2022", titre: "BEPC", lieu: "Côte d’Ivoire", enCours: false },
];

const CONTACTS = [
  { icone: "@", label: "E-mail", valeur: "enoshouattara@gmail.com" },
  { icone: "✆", label: "WhatsApp", valeur: "+225 07 88 27 12 31" },
  { icone: "</>", label: "GitHub", valeur: "github.com/enoshouattara-svg" },
  { icone: "in", label: "LinkedIn", valeur: "linkedin.com/in/enosh-ouattara-2708643b0" },
];

const LIENS_NAV = ["À propos", "Compétences", "Projets", "Parcours", "Contact"];

// ---------- Outils de base ----------
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}
function solide(hex, opacite = 1) {
  return { type: "SOLID", color: rgb(hex), opacity: opacite };
}

const PS = {}; // styles de couleur
const TS = {}; // styles de texte
let POLICES = {};

let DISPO = null;
async function police(famille, styles, secours) {
  if (!DISPO) {
    const liste = await figma.listAvailableFontsAsync();
    DISPO = new Set(liste.map((f) => f.fontName.family + "|" + f.fontName.style));
  }
  for (const s of styles) {
    if (DISPO.has(famille + "|" + s)) {
      const fn = { family: famille, style: s };
      await figma.loadFontAsync(fn);
      return fn;
    }
  }
  if (secours) return police(secours[0], secours[1]);
  const fn = { family: "Inter", style: "Regular" };
  await figma.loadFontAsync(fn);
  return fn;
}

async function stylesCouleur() {
  const existants = await figma.getLocalPaintStylesAsync();
  for (const [nom, hex] of Object.entries(COULEURS)) {
    const complet = "Couleurs/" + nom;
    let s = existants.find((x) => x.name === complet);
    if (!s) { s = figma.createPaintStyle(); s.name = complet; }
    s.paints = [solide(hex)];
    PS[nom] = s;
  }
}

async function stylesTexte() {
  const SG = (st) => police("Space Grotesk", st, ["Inter", ["Bold", "Semi Bold", "SemiBold"]]);
  POLICES = {
    sgBold: await SG(["Bold"]),
    sgSemi: await SG(["SemiBold", "Semi Bold", "Medium"]),
    sgMed: await SG(["Medium", "Regular"]),
    inReg: await police("Inter", ["Regular"]),
    inMed: await police("Inter", ["Medium", "Regular"]),
    inSemi: await police("Inter", ["Semi Bold", "SemiBold", "Medium"]),
    monoReg: await police("JetBrains Mono", ["Regular"], ["Roboto Mono", ["Regular"]]),
    monoMed: await police("JetBrains Mono", ["Medium", "Regular"], ["Roboto Mono", ["Medium", "Regular"]]),
  };
  const P = POLICES;
  const defs = [
    ["Hero/Ordinateur", P.sgBold, 72, 100, -3],
    ["Hero/Téléphone", P.sgBold, 40, 105, -2],
    ["Titre H2/Ordinateur", P.sgBold, 48, 110, -2],
    ["Titre H2/Téléphone", P.sgBold, 32, 115, -1],
    ["Titre H3", P.sgSemi, 22, 130, -1],
    ["Menu mobile", P.sgSemi, 32, 120, -1],
    ["Sous-titre/Ordinateur", P.sgMed, 22, 140, 0],
    ["Sous-titre/Téléphone", P.sgMed, 18, 140, 0],
    ["Corps/Grand", P.inReg, 18, 160, 0],
    ["Corps", P.inReg, 16, 160, 0],
    ["Corps/Petit", P.inReg, 14, 155, 0],
    ["Label", P.inMed, 15, 130, 0],
    ["Label petit", P.inMed, 13, 130, 0],
    ["Mono/Petit", P.monoMed, 13, 140, 4, true],
    ["Mono/Tag", P.monoReg, 12, 130, 0],
    ["Mono/Couverture", P.monoMed, 22, 130, -1],
    ["Logo", P.sgBold, 15, 100, 0],
  ];
  const existants = await figma.getLocalTextStylesAsync();
  for (const [nom, fn, taille, lh, ls, maj] of defs) {
    let s = existants.find((x) => x.name === nom);
    if (!s) { s = figma.createTextStyle(); s.name = nom; }
    s.fontName = fn;
    s.fontSize = taille;
    s.lineHeight = { unit: "PERCENT", value: lh };
    s.letterSpacing = { unit: "PERCENT", value: ls };
    s.textCase = maj ? "UPPER" : "ORIGINAL";
    TS[nom] = s;
  }
}

// Cadre (frame), avec ou sans mise en page automatique (auto-layout)
async function cadre(nom, o = {}) {
  const f = o.composant ? figma.createComponent() : figma.createFrame();
  f.name = nom;
  f.fills = [];
  if (o.dir) {
    f.layoutMode = o.dir;
    f.itemSpacing = o.gap || 0;
    const p = o.pad || [0, 0, 0, 0];
    f.paddingTop = p[0]; f.paddingRight = p[1]; f.paddingBottom = p[2]; f.paddingLeft = p[3];
    f.primaryAxisAlignItems = o.main || "MIN";
    f.counterAxisAlignItems = o.cross || "MIN";
    if (o.wrap) { f.layoutWrap = "WRAP"; f.counterAxisSpacing = o.wrapGap != null ? o.wrapGap : (o.gap || 0); }
  }
  if (o.w || o.h) f.resize(o.w || 100, o.h || 100);
  if (o.dir) {
    f.layoutSizingHorizontal = o.w ? "FIXED" : "HUG";
    f.layoutSizingVertical = o.h ? "FIXED" : "HUG";
  }
  if (o.r != null) f.cornerRadius = o.r;
  if (o.fond) await f.setFillStyleIdAsync(PS[o.fond].id);
  if (o.fondHex) f.fills = [solide(o.fondHex, o.fondA != null ? o.fondA : 1)];
  if (o.trait) {
    await f.setStrokeStyleIdAsync(PS[o.trait].id);
    f.strokeWeight = o.tw || 1;
    f.strokeAlign = "INSIDE";
  }
  if (o.traitHex) {
    f.strokes = [solide(o.traitHex, o.traitA != null ? o.traitA : 1)];
    f.strokeWeight = o.tw || 1;
    f.strokeAlign = "INSIDE";
  }
  f.clipsContent = !!o.clip;
  return f;
}

function mettre(parent, enfant, o = {}) {
  parent.appendChild(enfant);
  if (o.abs) {
    enfant.layoutPositioning = "ABSOLUTE";
    enfant.x = o.x || 0;
    enfant.y = o.y || 0;
    if (o.contraintes) enfant.constraints = o.contraintes;
    return enfant;
  }
  if (o.fillW) enfant.layoutSizingHorizontal = "FILL";
  if (o.fillH) enfant.layoutSizingVertical = "FILL";
  if (o.grow) enfant.layoutGrow = 1;
  if (enfant.type === "TEXT" && o.fillW) enfant.textAutoResize = "HEIGHT";
  return enfant;
}

async function texte(chaine, style, couleur, o = {}) {
  const t = figma.createText();
  t.fontName = POLICES.inReg;
  await t.setTextStyleIdAsync(TS[style].id);
  t.characters = chaine;
  await t.setFillStyleIdAsync(PS[couleur].id);
  if (o.w) { t.resize(o.w, t.height); t.textAutoResize = "HEIGHT"; }
  else t.textAutoResize = "WIDTH_AND_HEIGHT";
  if (o.align) t.textAlignHorizontal = o.align;
  t.name = o.nom || chaine.slice(0, 40);
  return t;
}

async function colorerMot(t, mot, couleur) {
  const i = t.characters.lastIndexOf(mot);
  if (i >= 0) await t.setRangeFillStyleIdAsync(i, i + mot.length, PS[couleur].id);
}

function rect(nom, w, h, hex, opacite = 1, r = 0) {
  const x = figma.createRectangle();
  x.name = nom;
  x.resize(w, h);
  x.fills = [solide(hex, opacite)];
  x.cornerRadius = r;
  return x;
}

function halo(nom, taille, opacite, flou) {
  const e = figma.createEllipse();
  e.name = nom;
  e.resize(taille, taille);
  e.fills = [solide(COULEURS["Accent orange"], opacite)];
  e.effects = [{ type: "LAYER_BLUR", radius: flou, visible: true }];
  return e;
}

function changerTexte(noeud, nom, valeur) {
  const t = noeud.findOne((n) => n.type === "TEXT" && n.name === nom);
  if (t) t.characters = valeur;
  return t;
}

async function survol(defaut, cible) {
  try {
    await defaut.setReactionsAsync([{
      trigger: { type: "ON_HOVER" },
      actions: [{ type: "NODE", destinationId: cible.id, navigation: "CHANGE_TO", transition: { type: "SMART_ANIMATE", easing: { type: "EASE_OUT" }, duration: 0.2 }, preserveScrollPosition: false }],
    }]);
  } catch (e) { console.warn("Interaction de survol ignorée :", e); }
}

function ranger(set, colonnes) {
  set.layoutMode = "HORIZONTAL";
  set.layoutWrap = "WRAP";
  set.itemSpacing = 24;
  set.counterAxisSpacing = 24;
  set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 32;
  set.layoutSizingVertical = "HUG";
  if (colonnes) { set.layoutSizingHorizontal = "FIXED"; set.resize(colonnes, set.height); }
  else set.layoutSizingHorizontal = "HUG";
  set.fills = [solide("#101016")];
  set.cornerRadius = 16;
  set.strokes = [solide("#9747FF")];
  set.dashPattern = [6, 4];
}

// ---------- Composants ----------
const COMP = {};

async function composants(page) {
  ETAPE = "composants : bouton";
  // Bouton : Type (Principal / Secondaire) x État (Défaut / Survol)
  const boutons = [];
  for (const type of ["Principal", "Secondaire"]) {
    const parEtat = {};
    for (const etat of ["Défaut", "Survol"]) {
      const c = await cadre(`Type=${type}, État=${etat}`, { composant: true, dir: "HORIZONTAL", gap: 10, pad: [14, 24, 14, 24], cross: "CENTER", main: "CENTER", r: 999 });
      if (type === "Principal") await c.setFillStyleIdAsync(PS[etat === "Défaut" ? "Accent orange" : "Accent survol"].id);
      else { await c.setStrokeStyleIdAsync(PS[etat === "Défaut" ? "Bordure" : "Accent orange"].id); c.strokeWeight = 1; c.strokeAlign = "INSIDE"; }
      const coul = type === "Principal" ? "Texte sur accent" : (etat === "Défaut" ? "Texte" : "Accent orange");
      mettre(c, await texte("Bouton", "Label", coul, { nom: "Libellé" }));
      mettre(c, await texte("→", "Label", coul, { nom: "Flèche" }));
      parEtat[etat] = c;
      boutons.push(c);
    }
    await survol(parEtat["Défaut"], parEtat["Survol"]);
  }
  COMP.bouton = figma.combineAsVariants(boutons, page);
  COMP.bouton.name = "Bouton";
  ranger(COMP.bouton);

  ETAPE = "composants : badge";
  const badges = [];
  for (const statut of ["Terminé", "En cours"]) {
    const hex = statut === "Terminé" ? COULEURS["Vert"] : COULEURS["Accent orange"];
    const c = await cadre(`Statut=${statut}`, { composant: true, dir: "HORIZONTAL", gap: 8, pad: [6, 12, 6, 10], cross: "CENTER", r: 999, fondHex: hex, fondA: 0.12 });
    const point = figma.createEllipse(); point.name = "Point"; point.resize(8, 8); point.fills = [solide(hex)];
    mettre(c, point);
    const t = await texte(statut, "Label petit", statut === "Terminé" ? "Vert" : "Accent orange", { nom: "Libellé" });
    mettre(c, t);
    badges.push(c);
  }
  COMP.badge = figma.combineAsVariants(badges, page);
  COMP.badge.name = "Badge statut";
  ranger(COMP.badge);

  const ia = await cadre("Badge IA", { composant: true, dir: "HORIZONTAL", gap: 6, pad: [6, 12, 6, 10], cross: "CENTER", r: 999, fond: "Surface 2", trait: "Bordure" });
  mettre(ia, await texte("✦", "Label petit", "Accent orange", { nom: "Icône" }));
  mettre(ia, await texte("Avec l’aide de l’IA", "Label petit", "Texte secondaire", { nom: "Libellé" }));
  page.appendChild(ia);
  COMP.ia = ia;

  ETAPE = "composants : tag";
  const tag = await cadre("Tag techno", { composant: true, dir: "HORIZONTAL", pad: [5, 10, 5, 10], cross: "CENTER", r: 6, trait: "Bordure" });
  mettre(tag, await texte("Python", "Mono/Tag", "Texte secondaire", { nom: "Libellé" }));
  page.appendChild(tag);
  COMP.tag = tag;

  const puce = await cadre("Puce compétence", { composant: true, dir: "HORIZONTAL", pad: [8, 14, 8, 14], cross: "CENTER", r: 999, fond: "Surface 2" });
  mettre(puce, await texte("Python", "Corps/Petit", "Texte", { nom: "Libellé" }));
  page.appendChild(puce);
  COMP.puce = puce;

  ETAPE = "composants : lien de menu";
  const liens = [];
  for (const etat of ["Défaut", "Survol", "Actif"]) {
    const c = await cadre(`État=${etat}`, { composant: true, dir: "VERTICAL", gap: 4, pad: [4, 0, 4, 0], cross: "CENTER" });
    const coul = etat === "Défaut" ? "Texte secondaire" : (etat === "Survol" ? "Texte" : "Accent orange");
    mettre(c, await texte("Projets", "Label", coul, { nom: "Libellé" }));
    const p = figma.createEllipse(); p.name = "Point actif"; p.resize(4, 4);
    p.fills = [solide(COULEURS["Accent orange"], etat === "Actif" ? 1 : 0)];
    mettre(c, p);
    liens.push(c);
  }
  await survol(liens[0], liens[1]);
  COMP.lien = figma.combineAsVariants(liens, page);
  COMP.lien.name = "Lien de menu";
  ranger(COMP.lien);

  const filtres = [];
  for (const etat of ["Actif", "Inactif"]) {
    const c = await cadre(`État=${etat}`, { composant: true, dir: "HORIZONTAL", gap: 8, pad: [9, 16, 9, 16], cross: "CENTER", r: 999 });
    if (etat === "Actif") await c.setFillStyleIdAsync(PS["Texte"].id);
    else { await c.setStrokeStyleIdAsync(PS["Bordure"].id); c.strokeWeight = 1; c.strokeAlign = "INSIDE"; }
    mettre(c, await texte("Tous · 6", "Label petit", etat === "Actif" ? "Fond" : "Texte secondaire", { nom: "Libellé" }));
    filtres.push(c);
  }
  COMP.filtre = figma.combineAsVariants(filtres, page);
  COMP.filtre.name = "Filtre";
  ranger(COMP.filtre);

  ETAPE = "composants : carte projet";
  const cartes = {};
  for (const etat of ["Défaut", "Survol"]) {
    cartes[etat] = await carteProjet(etat);
  }
  await survol(cartes["Défaut"], cartes["Survol"]);
  COMP.carte = figma.combineAsVariants([cartes["Défaut"], cartes["Survol"]], page);
  COMP.carte.name = "Carte projet";
  ranger(COMP.carte);
  COMP.carteDefaut = cartes["Défaut"];
}

async function carteProjet(etat) {
  const L = 384;
  const c = await cadre(`État=${etat}`, { composant: true, dir: "VERTICAL", w: L, r: 20, fond: "Surface", trait: etat === "Survol" ? "Accent orange" : "Bordure", clip: true });
  c.layoutSizingVertical = "HUG";
  if (etat === "Survol") c.effects = [{ type: "DROP_SHADOW", color: { ...rgb(COULEURS["Accent orange"]), a: 0.18 }, offset: { x: 0, y: 16 }, radius: 48, spread: -8, visible: true, blendMode: "NORMAL" }];

  const couv = await cadre("Couverture", { w: L, h: 200, fond: "Surface 2", clip: true });
  mettre(c, couv, { fillW: true });
  const h = halo("Halo", 240, etat === "Survol" ? 0.55 : 0.32, 70);
  couv.appendChild(h); h.x = L - 190; h.y = -110; h.constraints = { horizontal: "MAX", vertical: "MIN" };
  const ch = await texte("~/projets/scraper-amazon", "Mono/Tag", "Texte secondaire", { nom: "Chemin" });
  couv.appendChild(ch); ch.x = 24; ch.y = 24;
  const fi = await texte("scraper.py", "Mono/Couverture", "Texte", { nom: "Fichier" });
  couv.appendChild(fi); fi.x = 24; fi.y = 200 - 24 - fi.height; fi.constraints = { horizontal: "MIN", vertical: "MAX" };
  const cur = rect("Curseur", 12, 24, COULEURS["Accent orange"], 1, 2);
  couv.appendChild(cur); cur.x = 24 + fi.width + 6; cur.y = fi.y + 3; cur.constraints = { horizontal: "MIN", vertical: "MAX" };

  const corps = await cadre("Contenu", { dir: "VERTICAL", gap: 14, pad: [24, 24, 24, 24] });
  mettre(c, corps, { fillW: true, grow: true });
  const badges = await cadre("Badges", { dir: "HORIZONTAL", gap: 8, wrap: true });
  mettre(corps, badges, { fillW: true });
  const st = COMP.badge.children.find((n) => n.name === "Statut=Terminé").createInstance();
  st.name = "Statut";
  mettre(badges, st);
  const ia = COMP.ia.createInstance(); ia.name = "IA";
  mettre(badges, ia);
  mettre(corps, await texte("Projet académique", "Mono/Petit", "Texte secondaire", { nom: "Type" }), { fillW: true });
  mettre(corps, await texte("Scraper Amazon", "Titre H3", etat === "Survol" ? "Accent orange" : "Texte", { nom: "Titre" }), { fillW: true });
  mettre(corps, await texte("Description du projet.", "Corps/Petit", "Texte secondaire", { nom: "Description" }), { fillW: true });
  const tags = await cadre("Tags", { dir: "HORIZONTAL", gap: 8, wrap: true });
  mettre(corps, tags, { fillW: true });
  for (let k = 1; k <= 4; k++) {
    const t = COMP.tag.createInstance(); t.name = "Tag " + k;
    mettre(tags, t);
  }
  const ressort = await cadre("Espace", { dir: "VERTICAL" });
  mettre(corps, ressort, { fillW: true, grow: true });
  ressort.minHeight = 0;
  mettre(corps, rect("Séparateur", 100, 1, COULEURS["Bordure"]), { fillW: true });
  const ligne = await cadre("Pied de carte", { dir: "HORIZONTAL", main: "SPACE_BETWEEN", cross: "CENTER" });
  mettre(corps, ligne, { fillW: true });
  mettre(ligne, await texte("Voir le projet", "Label petit", etat === "Survol" ? "Texte" : "Texte secondaire", { nom: "Lien" }));
  mettre(ligne, await texte("↗", "Label", etat === "Survol" ? "Accent orange" : "Texte secondaire", { nom: "Flèche" }));
  return c;
}

function bouton(type, libelle) {
  const v = COMP.bouton.children.find((n) => n.name === `Type=${type}, État=Défaut`);
  const i = v.createInstance();
  i.name = "Bouton " + libelle;
  changerTexte(i, "Libellé", libelle);
  return i;
}

function puce(libelle) {
  const i = COMP.puce.createInstance();
  i.name = libelle;
  changerTexte(i, "Libellé", libelle);
  return i;
}

function carte(p) {
  const i = COMP.carteDefaut.createInstance();
  i.name = "Carte — " + p.titre;
  changerTexte(i, "Fichier", p.fichier);
  changerTexte(i, "Chemin", p.chemin);
  changerTexte(i, "Type", p.type);
  changerTexte(i, "Titre", p.titre);
  changerTexte(i, "Description", p.desc);
  changerTexte(i, "Lien", p.lien);
  const st = i.findOne((n) => n.type === "INSTANCE" && n.name === "Statut");
  st.setProperties({ "Statut": p.statut });
  i.findOne((n) => n.type === "INSTANCE" && n.name === "IA").visible = p.ia;
  for (let k = 1; k <= 4; k++) {
    const t = i.findOne((n) => n.type === "INSTANCE" && n.name === "Tag " + k);
    if (p.tags[k - 1]) changerTexte(t, "Libellé", p.tags[k - 1]);
    else t.visible = false;
  }
  // le curseur suit la longueur du nom de fichier
  const fi = i.findOne((n) => n.name === "Fichier");
  const cur = i.findOne((n) => n.name === "Curseur");
  if (fi && cur) cur.x = fi.x + fi.width + 6;
  return i;
}

// ---------- Sections ----------
async function section(nom, m, o = {}) {
  const px = m ? 20 : 120;
  const py = m ? 72 : 120;
  const s = await cadre(nom, { dir: "VERTICAL", gap: m ? 36 : 56, pad: [o.haut != null ? o.haut : py, px, py, px], fond: o.fond, clip: !!o.clip });
  return s;
}

async function entete(num, surTitre, titre, m, intro, largeur) {
  const h = await cadre("En-tête", { dir: "VERTICAL", gap: m ? 14 : 18 });
  mettre(h, await texte(`${num} — ${surTitre}`, "Mono/Petit", "Accent orange", { nom: "Sur-titre" }));
  const t = await texte(titre, m ? "Titre H2/Téléphone" : "Titre H2/Ordinateur", "Texte", { nom: "Titre" });
  mettre(h, t, { fillW: true });
  if (intro) mettre(h, await texte(intro, m ? "Corps" : "Corps/Grand", "Texte secondaire", { nom: "Intro" }), { fillW: true });
  if (largeur && !m) { h.layoutSizingHorizontal = "FIXED"; h.resize(largeur, h.height); }
  return h;
}

function bordureBas(f) {
  f.strokeTopWeight = 0; f.strokeLeftWeight = 0; f.strokeRightWeight = 0; f.strokeBottomWeight = 1;
}

async function logo() {
  const l = await cadre("Logo", { dir: "HORIZONTAL", gap: 10, cross: "CENTER" });
  const carre = await cadre("Monogramme", { dir: "HORIZONTAL", w: 38, h: 38, r: 10, fond: "Accent orange", main: "CENTER", cross: "CENTER" });
  mettre(carre, await texte("EO", "Logo", "Texte sur accent"));
  mettre(l, carre);
  mettre(l, await texte("portfolio", "Mono/Tag", "Texte secondaire"));
  return l;
}

async function navigation(m) {
  const n = await cadre("Navigation", { dir: "HORIZONTAL", pad: m ? [14, 20, 14, 20] : [22, 120, 22, 120], main: "SPACE_BETWEEN", cross: "CENTER", fond: "Fond", trait: "Bordure" });
  bordureBas(n);
  mettre(n, await logo());
  if (m) {
    const b = await cadre("Bouton menu", { dir: "VERTICAL", w: 44, h: 44, r: 12, gap: 5, main: "CENTER", cross: "CENTER", trait: "Bordure" });
    for (let k = 0; k < 3; k++) mettre(b, rect("Trait", 18, 2, COULEURS["Texte"], 1, 1));
    mettre(n, b);
  } else {
    const liens = await cadre("Liens", { dir: "HORIZONTAL", gap: 36, cross: "CENTER" });
    const defaut = COMP.lien.children.find((x) => x.name === "État=Défaut");
    for (const l of LIENS_NAV) {
      const i = defaut.createInstance(); i.name = l;
      changerTexte(i, "Libellé", l);
      mettre(liens, i);
    }
    mettre(n, liens);
    mettre(n, bouton("Principal", "Me contacter"));
  }
  return n;
}

async function hero(m) {
  const s = await cadre("Accueil", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: m ? 40 : 64, pad: m ? [48, 20, 64, 20] : [96, 120, 112, 120], cross: m ? "MIN" : "CENTER", clip: true });
  const g = halo("Halo de fond", m ? 380 : 620, 0.16, m ? 120 : 180);
  s.appendChild(g); g.layoutPositioning = "ABSOLUTE"; g.x = m ? 120 : 760; g.y = m ? 360 : -120;

  const gauche = await cadre("Texte d’accueil", { dir: "VERTICAL", gap: m ? 20 : 28 });
  mettre(s, gauche, { fillW: true, grow: !m });
  mettre(gauche, await texte("Étudiant en L2 Génie Logiciel — Abidjan, Côte d’Ivoire", "Mono/Petit", "Accent orange", { nom: "Sur-titre" }), { fillW: true });
  const nom = await texte(NOM, m ? "Hero/Téléphone" : "Hero/Ordinateur", "Texte", { nom: "Nom" });
  mettre(gauche, nom, { fillW: true });
  await colorerMot(nom, NOM_ACCENT, "Accent orange");
  mettre(gauche, await texte("Étudiant en génie logiciel · Développeur en formation", m ? "Sous-titre/Téléphone" : "Sous-titre/Ordinateur", "Texte", { nom: "Titre de profil" }), { fillW: true });
  const accroche = await texte("Développeur en devenir, orienté projets et solutions numériques. J’apprends en construisant : exercices de cours, applications et sites pour de vrais clients.", m ? "Corps" : "Corps/Grand", "Texte secondaire", { nom: "Accroche" });
  mettre(gauche, accroche, { fillW: true });
  if (!m) { accroche.layoutSizingHorizontal = "FIXED"; accroche.resize(600, accroche.height); }
  const btns = await cadre("Boutons", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: 12 });
  mettre(gauche, btns, { fillW: m });
  const b1 = bouton("Principal", "Voir mes projets");
  const b2 = bouton("Secondaire", "Me contacter");
  mettre(btns, b1, { fillW: m });
  mettre(btns, b2, { fillW: m });

  // Photo
  const lp = m ? 350 : 380;
  const hp = m ? 380 : 460;
  const zone = await cadre("Photo", { w: lp, h: hp + (m ? 0 : 0) });
  mettre(s, zone, { fillW: m });
  const photo = figma.createRectangle();
  photo.name = "Photo d’Enosh";
  photo.resize(lp, hp);
  photo.cornerRadius = 28;
  const img = figma.createImage(figma.base64Decode(PHOTO_B64));
  photo.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: img.hash }];
  photo.strokes = [solide(COULEURS["Bordure"])];
  photo.strokeWeight = 1;
  zone.appendChild(photo);
  photo.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
  const etiquette = await cadre("Étiquette", { dir: "HORIZONTAL", gap: 10, pad: [10, 16, 10, 12], cross: "CENTER", r: 999, fond: "Surface", trait: "Bordure" });
  const pt = figma.createEllipse(); pt.name = "Point"; pt.resize(8, 8); pt.fills = [solide(COULEURS["Accent orange"])];
  mettre(etiquette, pt);
  mettre(etiquette, await texte("Licence 2 · IIT Abidjan", "Label petit", "Texte", { nom: "Libellé" }));
  zone.appendChild(etiquette);
  etiquette.x = 16; etiquette.y = hp - etiquette.height - 16;
  etiquette.constraints = { horizontal: "MIN", vertical: "MAX" };
  return s;
}

async function bandeau(m) {
  const b = await cadre("Bandeau compétences", { dir: "HORIZONTAL", pad: m ? [16, 20, 16, 20] : [20, 120, 20, 120], cross: "CENTER", fond: "Surface", trait: "Bordure" });
  b.strokeLeftWeight = 0; b.strokeRightWeight = 0;
  const mots = ["Python", "Java", "HTML / CSS", "JavaScript", "SQL", "Selenium", "Flutter / Dart", "C"];
  const t = await texte(mots.join("   ✦   "), "Mono/Tag", "Texte secondaire", { nom: "Défilant" });
  mettre(b, t, { fillW: true });
  let i = t.characters.indexOf("✦");
  while (i >= 0) { await t.setRangeFillStyleIdAsync(i, i + 1, PS["Accent orange"].id); i = t.characters.indexOf("✦", i + 1); }
  return b;
}

async function aPropos(m) {
  const s = await section("À propos", m);
  const ligne = await cadre("Deux colonnes", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: m ? 32 : 80 });
  mettre(s, ligne, { fillW: true });
  mettre(ligne, await entete("01", "À propos", "Apprendre en construisant.", m, null, 420), { fillW: m });
  const droite = await cadre("Contenu", { dir: "VERTICAL", gap: 28 });
  mettre(ligne, droite, { fillW: true, grow: !m });
  mettre(droite, await texte("Je suis étudiant en deuxième année de Licence Génie Logiciel (Computer Science) à l’Institut Ivoirien de Technologie, à Abidjan. J’apprends en réalisant des projets concrets : exercices de cours, applications, et sites pour de vraies marques.", m ? "Corps" : "Corps/Grand", "Texte", { nom: "Paragraphe 1" }), { fillW: true });
  mettre(droite, await texte("J’utilise aussi l’intelligence artificielle comme outil de travail, et je l’indique clairement sur chaque projet concerné.", m ? "Corps" : "Corps/Grand", "Texte secondaire", { nom: "Paragraphe 2" }), { fillW: true });

  const citation = await cadre("Objectif", { dir: "HORIZONTAL", gap: 20, pad: m ? [20, 20, 20, 20] : [28, 32, 28, 28], r: 20, fond: "Surface", trait: "Bordure" });
  mettre(droite, citation, { fillW: true });
  mettre(citation, rect("Barre", 3, 60, COULEURS["Accent orange"], 1, 2), { fillH: true });
  const cv = await cadre("Texte objectif", { dir: "VERTICAL", gap: 10 });
  mettre(citation, cv, { fillW: true, grow: true });
  mettre(cv, await texte("Mon objectif", "Mono/Petit", "Accent orange"), { fillW: true });
  mettre(cv, await texte("« Construire des solutions numériques utiles, modernes et impactantes tout en devenant un développeur reconnu pour sa créativité, sa rigueur et sa capacité à résoudre des problèmes complexes. »", m ? "Corps" : "Sous-titre/Téléphone", "Texte", { nom: "Citation" }), { fillW: true });

  const infos = await cadre("Infos", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: 16 });
  mettre(droite, infos, { fillW: true });
  for (const [label, valeur] of [["Formation", "L2 Génie Logiciel · IIT"], ["Ville", "Abidjan, Côte d’Ivoire"], ["Langues", "Français courant · Anglais (notions)"]]) {
    const c = await cadre(label, { dir: "VERTICAL", gap: 8, pad: [20, 20, 20, 20], r: 16, trait: "Bordure" });
    mettre(infos, c, { fillW: true, grow: !m });
    mettre(c, await texte(label, "Mono/Petit", "Texte secondaire"), { fillW: true });
    mettre(c, await texte(valeur, "Label", "Texte"), { fillW: true });
  }
  const q = await cadre("Qualités", { dir: "VERTICAL", gap: 14 });
  mettre(droite, q, { fillW: true });
  mettre(q, await texte("Qualités", "Mono/Petit", "Texte secondaire"));
  const qp = await cadre("Puces", { dir: "HORIZONTAL", gap: 10, wrap: true });
  mettre(q, qp, { fillW: true });
  for (const x of QUALITES) mettre(qp, puce(x));
  return s;
}

async function competences(m) {
  const s = await section("Compétences", m, { fond: "Surface" });
  mettre(s, await entete("02", "Compétences", "Ce que je sais faire — honnêtement.", m, "Chaque compétence a un niveau réel. Les outils découverts avec l’aide de l’IA sont indiqués à part.", 720), { fillW: m });
  const grille = await cadre("Niveaux", { dir: "VERTICAL", gap: m ? 16 : 24 });
  mettre(s, grille, { fillW: true });
  let rangee = null;
  for (let k = 0; k < NIVEAUX.length; k++) {
    if (m || k % 2 === 0) {
      rangee = await cadre("Rangée", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: m ? 16 : 24 });
      mettre(grille, rangee, { fillW: true });
    }
    const n = NIVEAUX[k];
    const c = await cadre("Niveau — " + n.nom, { dir: "VERTICAL", gap: 18, pad: m ? [24, 20, 24, 20] : [28, 28, 28, 28], r: 20, fond: "Fond", trait: "Bordure" });
    mettre(rangee, c, { fillW: true, grow: !m });
    if (!m) c.layoutSizingVertical = "FILL";
    const haut = await cadre("Haut", { dir: "HORIZONTAL", main: "SPACE_BETWEEN", cross: "CENTER" });
    mettre(c, haut, { fillW: true });
    mettre(haut, await texte(n.nom, "Titre H3", "Texte", { nom: "Niveau" }));
    const barres = await cadre("Jauge", { dir: "HORIZONTAL", gap: 4, cross: "CENTER" });
    for (let b = 1; b <= 4; b++) mettre(barres, rect("Barre " + b, 18, 6, b <= n.barres ? COULEURS["Accent orange"] : COULEURS["Bordure"], 1, 3));
    mettre(haut, barres);
    mettre(c, await texte(n.desc, "Corps/Petit", "Texte secondaire", { nom: "Description" }), { fillW: true });
    const p = await cadre("Puces", { dir: "HORIZONTAL", gap: 10, wrap: true });
    mettre(c, p, { fillW: true });
    for (const x of n.items) mettre(p, puce(x));
  }
  const o = await cadre("Outils", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: m ? 16 : 32, pad: m ? [24, 20, 24, 20] : [24, 28, 24, 28], r: 20, cross: m ? "MIN" : "CENTER", trait: "Bordure" });
  mettre(grille, o, { fillW: true });
  mettre(o, await texte("Outils", "Titre H3", "Texte"));
  const op = await cadre("Puces", { dir: "HORIZONTAL", gap: 10, wrap: true });
  mettre(o, op, { fillW: true, grow: !m });
  for (const x of OUTILS) mettre(op, puce(x));
  return s;
}

async function projets(m) {
  const s = await section("Projets", m);
  mettre(s, await entete("03", "Projets", "Projets", m, "Six projets, avec leur statut réel : terminé ou en cours.", 720), { fillW: m });
  const f = await cadre("Filtres", { dir: "HORIZONTAL", gap: 10, wrap: true });
  mettre(s, f, { fillW: m });
  const actif = COMP.filtre.children.find((x) => x.name === "État=Actif");
  const inactif = COMP.filtre.children.find((x) => x.name === "État=Inactif");
  const nbTermines = PROJETS.filter((p) => p.statut === "Terminé").length;
  const nbEnCours = PROJETS.filter((p) => p.statut === "En cours").length;
  for (const [lib, a] of [[`Tous · ${PROJETS.length}`, true], [`Terminés · ${nbTermines}`, false], [`En cours · ${nbEnCours}`, false]]) {
    const i = (a ? actif : inactif).createInstance(); i.name = lib;
    changerTexte(i, "Libellé", lib);
    mettre(f, i);
  }
  const grille = await cadre("Grille", { dir: "VERTICAL", gap: m ? 20 : 24 });
  mettre(s, grille, { fillW: true });
  let rangee = null;
  for (let k = 0; k < PROJETS.length; k++) {
    if (m || k % 3 === 0) {
      rangee = await cadre("Rangée", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: m ? 20 : 24 });
      mettre(grille, rangee, { fillW: true });
    }
    const c = carte(PROJETS[k]);
    mettre(rangee, c, { fillW: true, grow: !m });
    if (!m) c.layoutSizingVertical = "FILL";
  }
  return s;
}

async function parcours(m) {
  const s = await section("Parcours", m, { fond: "Surface" });
  const ligne = await cadre("Deux colonnes", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: m ? 32 : 80 });
  mettre(s, ligne, { fillW: true });
  mettre(ligne, await entete("04", "Parcours", "Mon parcours.", m, "De l’école à la Licence 2 : les étapes importantes.", 420), { fillW: m });
  const frise = await cadre("Frise", { dir: "VERTICAL" });
  mettre(ligne, frise, { fillW: true, grow: !m });
  for (let k = 0; k < PARCOURS.length; k++) {
    const e = PARCOURS[k];
    const item = await cadre(e.titre, { dir: "HORIZONTAL", gap: m ? 18 : 28 });
    mettre(frise, item, { fillW: true });
    const repere = await cadre("Repère", { dir: "VERTICAL", gap: 0, cross: "CENTER", w: 16 });
    mettre(item, repere, { fillH: true });
    const point = figma.createEllipse(); point.name = "Point"; point.resize(16, 16);
    point.fills = [solide(k === 0 ? COULEURS["Accent orange"] : COULEURS["Surface 2"])];
    point.strokes = [solide(k === 0 ? COULEURS["Accent orange"] : COULEURS["Bordure"])];
    point.strokeWeight = 2;
    mettre(repere, point);
    if (k < PARCOURS.length - 1) {
      const trait = rect("Trait", 2, 40, COULEURS["Bordure"]);
      mettre(repere, trait, { fillH: true });
    }
    const contenu = await cadre("Contenu", { dir: "VERTICAL", gap: 8, pad: [0, 0, k < PARCOURS.length - 1 ? (m ? 32 : 40) : 0, 0] });
    mettre(item, contenu, { fillW: true, grow: true });
    const tete = await cadre("Période", { dir: "HORIZONTAL", gap: 12, cross: "CENTER", wrap: true });
    mettre(contenu, tete, { fillW: true });
    mettre(tete, await texte(e.periode, "Mono/Petit", k === 0 ? "Accent orange" : "Texte secondaire"));
    if (e.enCours) {
      const b = COMP.badge.children.find((n) => n.name === "Statut=En cours").createInstance();
      b.name = "Statut";
      mettre(tete, b);
    }
    mettre(contenu, await texte(e.titre, "Titre H3", "Texte", { nom: "Diplôme" }), { fillW: true });
    mettre(contenu, await texte(e.lieu, "Corps", "Texte secondaire", { nom: "Lieu" }), { fillW: true });
  }
  return s;
}

async function contact(m) {
  const s = await section("Contact", m);
  const c = await cadre("Carte contact", { dir: "VERTICAL", gap: m ? 28 : 40, pad: m ? [32, 20, 32, 20] : [64, 64, 64, 64], r: m ? 24 : 32, fond: "Surface", traitHex: COULEURS["Accent orange"], traitA: 0.35, clip: true });
  mettre(s, c, { fillW: true });
  const g = halo("Halo", m ? 300 : 520, 0.22, m ? 100 : 160);
  c.appendChild(g); g.layoutPositioning = "ABSOLUTE"; g.x = m ? 140 : 820; g.y = m ? -160 : -260;
  mettre(c, await entete("05", "Contact", "Une question, une idée de projet ?", m, "Écrivez-moi : je réponds par e-mail ou sur WhatsApp.", 720), { fillW: m });
  const grille = await cadre("Moyens de contact", { dir: "VERTICAL", gap: 16 });
  mettre(c, grille, { fillW: true });
  let rangee = null;
  for (let k = 0; k < CONTACTS.length; k++) {
    if (m || k % 2 === 0) {
      rangee = await cadre("Rangée", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: 16 });
      mettre(grille, rangee, { fillW: true });
    }
    const x = CONTACTS[k];
    const l = await cadre(x.label, { dir: "HORIZONTAL", gap: 16, pad: [18, 20, 18, 18], r: 16, cross: "CENTER", fond: "Fond", trait: "Bordure" });
    mettre(rangee, l, { fillW: true, grow: !m });
    const ic = await cadre("Icône", { dir: "HORIZONTAL", w: 44, h: 44, r: 12, main: "CENTER", cross: "CENTER", fond: "Surface 2" });
    mettre(ic, await texte(x.icone, "Label", "Accent orange"));
    mettre(l, ic);
    const t = await cadre("Texte", { dir: "VERTICAL", gap: 4 });
    mettre(l, t, { fillW: true, grow: true });
    mettre(t, await texte(x.label, "Mono/Petit", "Texte secondaire"), { fillW: true });
    mettre(t, await texte(x.valeur, "Label", "Texte", { nom: "Valeur" }), { fillW: true });
    mettre(l, await texte("↗", "Label", "Texte secondaire", { nom: "Flèche" }));
  }
  const btns = await cadre("Boutons", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: 12 });
  mettre(c, btns, { fillW: m });
  mettre(btns, bouton("Principal", "Écrire un e-mail"), { fillW: m });
  mettre(btns, bouton("Secondaire", "Discuter sur WhatsApp"), { fillW: m });
  return s;
}

async function pied(m) {
  const f = await cadre("Pied de page", { dir: m ? "VERTICAL" : "HORIZONTAL", gap: m ? 28 : 40, pad: m ? [40, 20, 40, 20] : [48, 120, 48, 120], main: "SPACE_BETWEEN", cross: m ? "MIN" : "CENTER", trait: "Bordure" });
  f.strokeBottomWeight = 0; f.strokeLeftWeight = 0; f.strokeRightWeight = 0;
  const g = await cadre("Signature", { dir: "VERTICAL", gap: 14 });
  mettre(f, g, { fillW: m });
  mettre(g, await logo());
  mettre(g, await texte(NOM, "Label", "Texte"), { fillW: m });
  mettre(g, await texte("© 2026 · Conçu dans Figma, codé en HTML, CSS et JavaScript.", "Corps/Petit", "Texte secondaire"), { fillW: m });
  const liens = await cadre("Liens", { dir: "HORIZONTAL", gap: m ? 16 : 28, wrap: m, cross: "CENTER" });
  mettre(f, liens, { fillW: m });
  for (const l of LIENS_NAV) mettre(liens, await texte(l, "Label petit", "Texte secondaire"));
  mettre(liens, await texte("Haut de page ↑", "Label petit", "Accent orange"));
  return f;
}

async function maquette(page, m) {
  const W = m ? 390 : 1440;
  const p = await cadre(m ? "Portfolio — Téléphone 390" : "Portfolio — Ordinateur 1440", { dir: "VERTICAL", w: W, fond: "Fond", clip: true });
  p.layoutSizingVertical = "HUG";
  page.appendChild(p);
  if (!m) {
    p.layoutGrids = [{ pattern: "COLUMNS", alignment: "CENTER", count: 12, gutterSize: 24, sectionSize: 78, visible: false, color: { r: 1, g: 0.3, b: 0, a: 0.08 } }];
  } else {
    p.layoutGrids = [{ pattern: "COLUMNS", alignment: "STRETCH", count: 4, gutterSize: 16, offset: 20, visible: false, color: { r: 1, g: 0.3, b: 0, a: 0.08 } }];
  }
  ETAPE = "navigation"; mettre(p, await navigation(m), { fillW: true });
  ETAPE = "accueil"; mettre(p, await hero(m), { fillW: true });
  ETAPE = "bandeau"; mettre(p, await bandeau(m), { fillW: true });
  ETAPE = "à propos"; mettre(p, await aPropos(m), { fillW: true });
  ETAPE = "compétences"; mettre(p, await competences(m), { fillW: true });
  ETAPE = "projets"; mettre(p, await projets(m), { fillW: true });
  ETAPE = "parcours"; mettre(p, await parcours(m), { fillW: true });
  ETAPE = "contact"; mettre(p, await contact(m), { fillW: true });
  ETAPE = "pied de page"; mettre(p, await pied(m), { fillW: true });
  return p;
}

async function menuMobile(page) {
  ETAPE = "menu téléphone";
  const f = await cadre("Téléphone — menu ouvert", { dir: "VERTICAL", w: 390, h: 844, fond: "Fond", clip: true });
  page.appendChild(f);
  const n = await cadre("Navigation", { dir: "HORIZONTAL", pad: [14, 20, 14, 20], main: "SPACE_BETWEEN", cross: "CENTER", trait: "Bordure" });
  bordureBas(n);
  mettre(f, n, { fillW: true });
  mettre(n, await logo());
  const x = await cadre("Bouton fermer", { dir: "HORIZONTAL", w: 44, h: 44, r: 12, main: "CENTER", cross: "CENTER", trait: "Accent orange" });
  mettre(x, await texte("✕", "Label", "Accent orange"));
  mettre(n, x);
  const l = await cadre("Liens", { dir: "VERTICAL", gap: 4, pad: [32, 20, 32, 20] });
  mettre(f, l, { fillW: true, grow: true });
  for (let k = 0; k < LIENS_NAV.length; k++) {
    const r = await cadre(LIENS_NAV[k], { dir: "HORIZONTAL", gap: 16, pad: [16, 0, 16, 0], cross: "CENTER", trait: "Bordure" });
    bordureBas(r);
    mettre(l, r, { fillW: true });
    mettre(r, await texte("0" + (k + 1), "Mono/Petit", "Accent orange"));
    mettre(r, await texte(LIENS_NAV[k], "Menu mobile", k === 2 ? "Accent orange" : "Texte"), { fillW: true, grow: true });
  }
  const bas = await cadre("Bas", { dir: "VERTICAL", gap: 12, pad: [0, 20, 32, 20] });
  mettre(f, bas, { fillW: true });
  mettre(bas, bouton("Principal", "Me contacter"), { fillW: true });
  mettre(bas, await texte("enoshouattara@gmail.com", "Corps/Petit", "Texte secondaire", { align: "CENTER" }), { fillW: true });
  return f;
}

async function planches(page) {
  ETAPE = "planche des styles";
  const titre = await texte("Styles et composants — Portfolio Enosh Ouattara", "Titre H2/Ordinateur", "Texte");
  page.appendChild(titre); titre.x = 0; titre.y = -260;
  const sous = await texte("Couleurs, typographies et composants réutilisables (avec variantes et états de survol).", "Corps/Grand", "Texte secondaire");
  page.appendChild(sous); sous.x = 0; sous.y = -190;

  const coul = await cadre("Couleurs", { dir: "HORIZONTAL", gap: 16, pad: [32, 32, 32, 32], r: 16, fond: "Surface", wrap: true, w: 1200 });
  page.appendChild(coul); coul.x = 0; coul.y = -120;
  coul.layoutSizingVertical = "HUG";
  for (const [nom, hex] of Object.entries(COULEURS)) {
    const c = await cadre(nom, { dir: "VERTICAL", gap: 10, w: 210 });
    mettre(coul, c);
    const sw = rect("Pastille", 210, 80, hex, 1, 12);
    await sw.setFillStyleIdAsync(PS[nom].id);
    sw.strokes = [solide("#FFFFFF", 0.08)];
    mettre(c, sw, { fillW: true });
    mettre(c, await texte(nom, "Label", "Texte"));
    mettre(c, await texte(hex, "Mono/Tag", "Texte secondaire"));
  }
  const typo = await cadre("Typographies", { dir: "VERTICAL", gap: 18, pad: [32, 32, 32, 32], r: 16, fond: "Surface", w: 1200 });
  page.appendChild(typo); typo.x = 0; typo.y = coul.y + coul.height + 40;
  typo.layoutSizingVertical = "HUG";
  for (const nom of Object.keys(TS)) {
    const r = await cadre(nom, { dir: "HORIZONTAL", gap: 24, cross: "CENTER" });
    mettre(typo, r, { fillW: true });
    const lab = await texte(nom, "Mono/Tag", "Texte secondaire", { w: 220 });
    mettre(r, lab);
    mettre(r, await texte(nom.startsWith("Hero") ? "Enosh Ouattara" : "Apprendre en construisant", nom, "Texte"), { fillW: true, grow: true });
  }
  // composants rangés sous les planches
  let y = typo.y + typo.height + 60;
  const ordre = [COMP.bouton, COMP.badge, COMP.ia, COMP.tag, COMP.puce, COMP.lien, COMP.filtre, COMP.carte];
  let x = 0, hauteurLigne = 0;
  for (const n of ordre) {
    if (x + n.width > 1300) { x = 0; y += hauteurLigne + 40; hauteurLigne = 0; }
    n.x = x; n.y = y;
    x += n.width + 40;
    hauteurLigne = Math.max(hauteurLigne, n.height);
  }
}

async function obtenirPage(nom, index) {
  let p = figma.root.children.find((x) => x.name === nom);
  if (!p) {
    if (index === 0 && figma.root.children.length >= 1 && /^(Page 1|Page 1 )$/.test(figma.root.children[0].name)) {
      p = figma.root.children[0];
      p.name = nom;
    } else {
      p = figma.createPage();
      p.name = nom;
    }
  }
  await p.loadAsync();
  for (const n of [...p.children]) n.remove();
  p.backgrounds = [solide("#08080B")];
  return p;
}

async function principal() {
  ETAPE = "styles de couleur"; await stylesCouleur();
  ETAPE = "styles de texte"; await stylesTexte();
  ETAPE = "pages";
  const pComp = await obtenirPage("🎨 Styles & composants", 0);
  const pOrdi = await obtenirPage("🖥 Ordinateur — 1440", 1);
  const pTel = await obtenirPage("📱 Téléphone — 390", 2);

  await figma.setCurrentPageAsync(pComp);
  await composants(pComp);
  await planches(pComp);

  await figma.setCurrentPageAsync(pOrdi);
  const ordi = await maquette(pOrdi, false);
  ordi.x = 0; ordi.y = 0;
  try { pOrdi.flowStartingPoints = [{ nodeId: ordi.id, name: "Portfolio — ordinateur" }]; } catch (e) {}

  await figma.setCurrentPageAsync(pTel);
  const tel = await maquette(pTel, true);
  tel.x = 0; tel.y = 0;
  const menu = await menuMobile(pTel);
  menu.x = 470; menu.y = 0;
  try { pTel.flowStartingPoints = [{ nodeId: tel.id, name: "Portfolio — téléphone" }]; } catch (e) {}

  await figma.setCurrentPageAsync(pOrdi);
  figma.viewport.scrollAndZoomIntoView([ordi]);
  figma.closePlugin("✅ Maquette du portfolio créée : 3 pages (styles & composants, ordinateur, téléphone).");
}

principal().catch((e) => {
  console.error(e);
  figma.closePlugin("❌ Erreur à l’étape « " + ETAPE + " » : " + (e && e.message ? e.message : e));
});
