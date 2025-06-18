import * as NameRooms from "../roomInfo.js";
import Masonry from 'masonry-layout';

const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function disableLink(a) {
    a.style.background = "#00000050";
    a.style.cursor = "not-allowed";
    a.style.opacity = "0.2";
    a.classList.add("webXRDontWork");
    a.addEventListener("click", e => e.preventDefault());
}

function createButton(id, templateHref, text, title, roomId) {
    const a = document.createElement("a");
    a.id = id;
    a.classList.add(id, "buttonRedirect3D");
    if (title) a.setAttribute("title", title);
    a.textContent = text;

    const href = templateHref.replace("{room}", roomId);
    if (id === "buttonAR") {
        if (mobileRegex.test(navigator.userAgent)) {
            a.href = href;
        } else {
            disableLink(a);
        }
    } else if (id === "buttonVR") {
        if ('xr' in navigator && navigator.xr.isSessionSupported) {
            navigator.xr.isSessionSupported('immersive-vr').then(supported => {
                if (supported) a.href = href;
                else disableLink(a);
            });
        } else disableLink(a);
    } else {
        // 3D always available
        a.href = href;
    }
    return a;
}

function createRoomCard(room, langIndex) {
    const [roomId, titleText, descEN, locationText, depthValue] = room;
    const newDiv = document.createElement("div");
    newDiv.classList.add("parentDivRoomInfo_new");

    // Background 
    newDiv.style.backgroundImage = `url(https://catacombes.xyz/${roomId}/${roomId}.webp)`;

    // Title
    const h2 = document.createElement("h2");
    h2.classList.add("titleRoom_new");
    h2.textContent = titleText;
    newDiv.appendChild(h2);

    // Location
    const pLoc = document.createElement("p");
    pLoc.classList.add("location_room");
    pLoc.setAttribute("title", "Emplacement");
    pLoc.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-map"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13"/><path d="M9 4v13"/><path d="M15 7v13"/></svg>
        ${locationText.replace(/\n/g, "<br/>")}
    `;
    newDiv.appendChild(pLoc);

    // Depth
    const pDepth = document.createElement("p");
    pDepth.classList.add("deepth_room");
    pDepth.setAttribute("title", "Profondeur approximative");
    pDepth.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-viewport-tall"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 10v-7l3 3"/><path d="M9 6l3 -3"/><path d="M12 14v7l3 -3"/><path d="M9 18l3 3"/><path d="M18 3h1a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-1"/><path d="M6 3h-1a2 2 0 0 0 -2 2v14a2 2 0 0 0 2 2h1"/></svg>
        ${depthValue}
    `;
    newDiv.appendChild(pDepth);

    // Info & Buttons
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("display_text_div_infos");

    const pText = document.createElement("p");
    pText.classList.add("textRoom_new");
    pText.textContent = room[langIndex];
    infoDiv.appendChild(pText);

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("display_buttons");
    btnContainer.appendChild(createButton("buttonVR", "https://catacombes.xyz/3D/?room={room}", "VR", "Virtual Reality for VR headset", roomId));
    btnContainer.appendChild(createButton("button3D", "/3D/?room={room}", "3D", null, roomId));
    btnContainer.appendChild(createButton("buttonAR", "https://catacombes.xyz/AR/?room={room}", "AR", "Augmented Reality for phones", roomId));

    infoDiv.appendChild(btnContainer);
    newDiv.appendChild(infoDiv);
    return newDiv;
}

function createSearchBar() {
    const container = document.createElement("div");
    container.classList.add("searchContainer");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Rechercher une salle";
    input.classList.add("search_bar");
    input.addEventListener("input", filterRooms);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("icon", "icon-tabler", "icon-tabler-search");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M0 0h24v24H0z");
    path1.setAttribute("fill", "none");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0");
    const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", "M21 21l-6 -6");

    svg.append(path2, path3);
    container.append(input, svg);

    const roomsContainer = document.querySelector(".displayRooms");
    roomsContainer.insertAdjacentElement("beforebegin", container);
}

function filterRooms() {
    const query = document.querySelector(".search_bar").value.toLowerCase();
    document.querySelectorAll(".parentDivRoomInfo_new").forEach(room => {
        const title = room.querySelector(".titleRoom_new").textContent.toLowerCase();
        if (title.includes(query)) {
            room.style.display = "inline-grid";
            requestAnimationFrame(() => room.style.opacity = "1");
        } else {
            room.style.opacity = "0";
            setTimeout(() => room.style.display = "none", 500);
        }
    });
}

function initializeRooms() {
    const container = document.querySelector(".displayRooms");
    NameRooms.roomInfos.forEach((room, idx) => {
        container.appendChild(createRoomCard(room, 2));
    });
    
    createSearchBar();
}

document.addEventListener("DOMContentLoaded", initializeRooms);

const langBtn = document.querySelector("#language_site");
langBtn.addEventListener("click", () => {
    document.querySelectorAll(".textRoom_new").forEach((p, idx) => {
        p.textContent = langBtn.innerText === "FR" ? NameRooms.roomInfos[idx][9] : NameRooms.roomInfos[idx][2];
    });
    langBtn.innerText = langBtn.innerText === "FR" ? "EN" : "FR";
});