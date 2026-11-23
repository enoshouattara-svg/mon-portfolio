// Exporte la maquette : PDF (une page haute) + capture PNG, en version ordinateur (1440) et téléphone (390).
// Lancer : node outils/exporter.mjs   (depuis le dossier portfolio)
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const racine = resolve(import.meta.dirname, "..");
const page = pathToFileURL(join(racine, "site", "index.html")).href;
const sortie = join(racine, "maquette");
mkdirSync(sortie, { recursive: true });

const profil = mkdtempSync(join(tmpdir(), "chrome-maquette-"));
const port = 9333;
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
let cible;
for (let i = 0; i < 50 && !cible; i++) {
  try { cible = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { await attendre(200); }
}
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const enAttente = new Map(); const erreurs = [];
ws.addEventListener("message", (m) => {
  const d = JSON.parse(m.data);
  if (d.id && enAttente.has(d.id)) { enAttente.get(d.id)(d); enAttente.delete(d.id); }
  if (d.method === "Runtime.exceptionThrown") erreurs.push(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text);
});
const cdp = (method, params = {}) => new Promise((r) => { const n = ++id; enAttente.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

await cdp("Runtime.enable");
await cdp("Page.enable");
await cdp("Emulation.setEmulatedMedia", { media: "screen", features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

for (const [nom, largeur, mobile] of [["ordinateur-1440", 1440, false], ["telephone-390", 390, true]]) {
  await cdp("Emulation.setDeviceMetricsOverride", { width: largeur, height: mobile ? 844 : 900, deviceScaleFactor: mobile ? 1.25 : 1, mobile });
  await cdp("Page.navigate", { url: page });
  await attendre(3500);
  await cdp("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
  const mesure = await cdp("Runtime.evaluate", { expression: "JSON.stringify({h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth})", returnByValue: true });
  const { h, w } = JSON.parse(mesure.result.result.value);
  console.log(`${nom} : ${w} x ${h} px${w > largeur ? "  ⚠ débordement horizontal" : ""}`);
  // la barre de navigation reste en haut dans l'export
  await cdp("Runtime.evaluate", { expression: "document.querySelector('.nav').style.position='relative'; document.querySelectorAll('.nav__links a').forEach(a => a.classList.remove('is-active'))" });
  await cdp("Emulation.setDeviceMetricsOverride", { width: largeur, height: h, deviceScaleFactor: mobile ? 1.25 : 1, mobile });
  await attendre(600);
  const png = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  writeFileSync(join(sortie, `${nom}.png`), Buffer.from(png.result.data, "base64"));
  const pdf = await cdp("Page.printToPDF", { printBackground: true, paperWidth: largeur / 96, paperHeight: h / 96 + 0.05, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, preferCSSPageSize: false });
  writeFileSync(join(sortie, `${nom}.pdf`), Buffer.from(pdf.result.data, "base64"));
}
console.log(erreurs.length ? "Erreurs JS : " + erreurs.join(" | ") : "0 erreur JavaScript");
ws.close();
chrome.kill();
