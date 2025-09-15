import { roomInfos } from "../roomInfo.js";

const hasLatLng = r => {
  const lat = parseFloat(r[10]);
  const lng = parseFloat(r[11]);
  return !isNaN(lat) && !isNaN(lng);
};
const toImg = slug => `https://catacombes.xyz/${slug}/${slug}.webp`;

// --- Carte ---
const map = L.map("map", { zoomControl: true });
map.setView([48.83622741699219,2.33797287940979], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 21
}).addTo(map);

map.whenReady(() => {
  // laisse le layout se poser, puis corrige la taille
  requestAnimationFrame(() => map.invalidateSize());
});

// 2) au chargement complet de la page (fonts, images, etc.)
window.addEventListener('load', () => map.invalidateSize());

// 3) si ta colonne / wrapper change de taille (grille responsive, sidebar, etc.)
const wrapper = document.getElementById('map').parentElement;
if (window.ResizeObserver && wrapper) {
    new ResizeObserver(() => map.invalidateSize()).observe(wrapper);
}

// 4) au resize de la fenêtre
window.addEventListener('resize', () => map.invalidateSize());

// Regroupement des marqueurs
const markers = L.layerGroup().addTo(map);

// --- UI ---
const listEl = document.getElementById("list");
const searchEl = document.getElementById("search");
const districtEl = document.getElementById("district");

// Index en mémoire pour filtrage
let currentItems = roomInfos.map((r, i) => ({ i, data: r }));

function render() {
    // Filtre texte + quartier
    const q = (searchEl.value || "").toLowerCase().trim();
    const d = districtEl.value;

    const filtered = currentItems.filter(({ data: r }) => {
        const text = [r[0], r[1], r[3], r[6]].join(" ").toLowerCase();
        const okText = !q || text.includes(q);
        const okDistrict = !d || r[6] === d;
        return okText && okDistrict;
    });

    // Liste
    listEl.innerHTML = "";
    filtered.forEach(({ data: r }) => {
        const card = document.createElement("article");
        card.className = "card" + (hasLatLng(r) ? "" : " no-geo");
        card.dataset.slug = r[0];

        const img = document.createElement("img");
        img.className = "thumb";
        img.src = toImg(r[0]);
        img.alt = `Salle ${r[1]}`;

        const right = document.createElement("div");
        const title = document.createElement("h3");
        title.className = "title";
        title.textContent = r[1];

        const meta = document.createElement("p");
        meta.className = "meta";
        meta.textContent = `${r[3] || "—"}\nProfondeur : ${r[4] || "—"}\nQuartier : ${r[6] || "—"}`;

        right.appendChild(title);
        right.appendChild(meta);
        card.appendChild(img);
        card.appendChild(right);
        card.setAttribute("title", `Voir l'emplacement de ${r[1]} sur la carte`)

        // Interaction liste → carte
        card.addEventListener("click", () => focusRoom(r));

        listEl.appendChild(card);
    });

    // Marqueurs
    markers.clearLayers();
    filtered.forEach(({ data: r }) => {
        if (!hasLatLng(r)) return;

        const m = L.marker([r[10], r[11]], { title: r[1] });
        m.bindPopup(`
        <h3 class="popup-title">${r[1]}</h3>
        <p class="popup-meta">${r[3] || "—"}<br/>Profondeur : ${r[4] || "—"}<br/>Quartier : ${r[6] || "—"}</p>
        <div class="popup-actions">
            <a href="https://catacombes.xyz/3D/?room=${r[0]}" rel="noopener">Voir en 3D ↗</a>
        </div>
        `);

        m.on("click", () => scrollToCard(r[0]));
        markers.addLayer(m);
    });
}

function focusRoom(r) {
    if (hasLatLng(r)) {
        map.setView([r[10], r[11]], 16, { animate: true });
        // Ouvre le popup correspondant
        markers.eachLayer(layer => {
        const { lat, lng } = layer.getLatLng();
        if (Math.abs(lat - r[10]) < 1e-6 && Math.abs(lng - r[11]) < 1e-6) {
            layer.openPopup();
        }
        });
    } else {
        alert("A toi de trouver cette salle 🤫");
    }
}

function scrollToCard(slug) {
  const card = [...document.querySelectorAll(".card")].find(c => c.dataset.slug === slug);
  if (!card) return;
  card.scrollIntoView({ block: "center", behavior: "smooth" });
  card.animate([{ background: "#fff" }, { background: "#fff7" }, { background: "#fff" }], { duration: 700 });
}

// Écouteurs
searchEl.addEventListener("input", render);
districtEl.addEventListener("change", render);

// 1er rendu
render();

// Astuce: recentrer gentiment sur les marqueurs visibles
if (roomInfos.some(hasLatLng)) {
    const bounds = [];
    markers.eachLayer(l => bounds.push(l.getLatLng()));
    if (bounds.length) map.fitBounds(bounds, { padding: [40, 40] });
}