import * as NameRooms from "../roomInfo.js";

var roomNumber = 0;

function addButtonDiv(elem, idElem, link, textButton, newDiv){
    var elemCreated = document.createElement(elem); 
    elemCreated.setAttribute("id", idElem);
    elemCreated.classList.add(idElem); 
    elemCreated.classList.add("buttonRedirect3D");
    elemCreated.setAttribute("href", link);
    // elemCreated.setAttribute("target", "_blank");
    elemCreated.textContent = textButton;
    newDiv.appendChild(elemCreated);

    const elemToTest = document.getElementById(idElem);

    function isWebXRSupported() {
        return 'xr' in navigator && 'isSessionSupported' in navigator.xr;
    }

    if(idElem === "buttonAR"){
        elemCreated.setAttribute("title", "Augmented Reality for phones");
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
            elemCreated.setAttribute("href", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/AR`)
        } else {
            elemCreated.style.background = "#00000050"
            elemCreated.setAttribute("href", "#");
            elemCreated.style.cursor = "not-allowed"
            elemCreated.style.opacity = "0.2"
            elemCreated.classList.add("webXRDontWork")
        }
    } else if(idElem === "buttonVR"){
        elemCreated.setAttribute("title", "Virtual Reality for VR headset");
        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
                if (supported) {
                    elemCreated.setAttribute("href", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/AR`)
                } else {
                    elemCreated.setAttribute('href', '#');
                    elemCreated.style.backgroundColor = "#00000050" 
                    elemCreated.style.cursor = "not-allowed"
                    elemCreated.style.opacity = "0.2"
                    elemCreated.classList.add("webXRDontWork")
                    elemCreated.addEventListener('click', (event) => {
                        event.preventDefault();
                    });
                }
            });
        } else {
            elemCreated.setAttribute('href', '#');
            elemCreated.style.backgroundColor = "#00000050" 
            elemCreated.style.cursor = "not-allowed!important"
            elemCreated.style.opacity = "0.2"
            elemCreated.classList.add("webXRDontWork")
            elemCreated.addEventListener('click', (event) => {
                event.preventDefault();
            });
        }
    } 
}

function addElement(roomNumber, language) {
    var newDiv = document.createElement("div");
    const language_site = document.querySelector("#language_site");

    newDiv.classList.add('parentDivRoomInfo');

    // Title
    var title = document.createElement("h2");
    title.classList.add('titleRoom');
    title.textContent = `${NameRooms.roomInfos[roomNumber][1]}`
    newDiv.appendChild(title);
    
    // Body
    var img = document.createElement("img");
    img.setAttribute("src", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/${NameRooms.roomInfos[roomNumber][0]}.webp`);
    img.setAttribute("alt", `${NameRooms.roomInfos[roomNumber][1]}`)
    img.setAttribute("id", "imgRoom")
    img.classList.add('imgRoom')
    newDiv.appendChild(img);

    // Room info
    var text = document.createElement("p");
    text.classList.add('textRoom');
    text.textContent = `${NameRooms.roomInfos[roomNumber][language]}`

    newDiv.appendChild(text);

    // Location
    var location = document.createElement("p");
    location.classList.add('adressRoom');
    location.textContent = `Location : \n ${NameRooms.roomInfos[roomNumber][3]}\n\n Depth: ${NameRooms.roomInfos[roomNumber][4]}`
    newDiv.appendChild(location);

    addButtonDiv("a", "buttonVR", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/3D`, "VR", newDiv)
    addButtonDiv("a", "button3D", `/3D/3D.html?room=${NameRooms.roomInfos[roomNumber][0]}`, "3D", newDiv)
    addButtonDiv("a", "buttonAR", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/AR`, "AR", newDiv)
    

    var currentDiv = document.querySelector('.displayRooms');
    currentDiv.appendChild(newDiv);
}
function create_search_bar() {
    var searchContainer = document.createElement("div");
    searchContainer.classList.add("searchContainer");

    var search_bar = document.createElement("input");
    search_bar.setAttribute("type", "text");
    search_bar.setAttribute("placeholder", "Rechercher une salle");
    search_bar.classList.add("search_bar");
    search_bar.addEventListener("input", filterRooms);

    var searchIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    searchIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    searchIcon.setAttribute("width", "24");
    searchIcon.setAttribute("height", "24");
    searchIcon.setAttribute("viewBox", "0 0 24 24");
    searchIcon.setAttribute("fill", "none");
    searchIcon.setAttribute("stroke", "currentColor");
    searchIcon.setAttribute("stroke-width", "2");
    searchIcon.setAttribute("stroke-linecap", "round");
    searchIcon.setAttribute("stroke-linejoin", "round");
    searchIcon.classList.add("icon", "icon-tabler", "icons-tabler-outline", "icon-tabler-search");

    var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("stroke", "none");
    path1.setAttribute("d", "M0 0h24v24H0z");
    path1.setAttribute("fill", "none");

    var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0");

    var path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", "M21 21l-6 -6");

    searchIcon.appendChild(path1);
    searchIcon.appendChild(path2);
    searchIcon.appendChild(path3);

    searchContainer.appendChild(search_bar);
    searchContainer.appendChild(searchIcon);

    var displayRooms = document.querySelector(".displayRooms");
    displayRooms.insertAdjacentElement("beforebegin", searchContainer);
}


function filterRooms() {
    var query = document.querySelector(".search_bar").value.toLowerCase();
    var rooms = document.querySelectorAll(".parentDivRoomInfo");

    rooms.forEach(room => {
        var title = room.querySelector(".titleRoom").textContent.toLowerCase();
        if (title.includes(query)) {
            room.style.display = "inline-grid"; 
            requestAnimationFrame(() => { 
                room.style.opacity = "1"; 
            });
        } else {
            room.style.opacity = "0"; 
            setTimeout(() => {
                room.style.display = "none"; 
            }, 500);
        }
    });
}

function initializeRooms() {
    for (let i = 0; i < NameRooms.roomInfos.length; i++) {
        addElement(i, 2);
        roomNumber++;
    }

    const language_site = document.querySelector("#language_site");
    language_site.addEventListener("click", function() {
        const textRoom = document.querySelectorAll(".textRoom");
        for(let i = 0; i < textRoom.length; i++) {
            if(language_site.innerText === "FR"){
                textRoom[i].textContent = `${NameRooms.roomInfos[i][9]}`;
            } else {
                textRoom[i].textContent = `${NameRooms.roomInfos[i][2]}`;
            }
        }
        language_site.innerText = (language_site.innerText === "FR") ? "EN" : "FR";
    });
    
    create_search_bar();
}

initializeRooms();

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.addEventListener("resize", function() {
        window.location.reload();
    });
}

console.log("Developed by 🍔 by Paul Maréchal");
