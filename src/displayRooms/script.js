import * as NameRooms from "../roomInfo.js";

var roomNumber = 0;

function addButtonDiv(elem, idElem, link, textButton, newDiv){
    console.log(textButton)
    var elemCreated = document.createElement(elem); 
    elemCreated.setAttribute("id", idElem);
    elemCreated.classList.add(idElem); 
    elemCreated.classList.add("buttonRedirect3D");
    elemCreated.setAttribute("href", link);
    elemCreated.textContent = textButton;
    newDiv.appendChild(elemCreated);

    const elemToTest = document.getElementById(idElem);

    function isWebXRSupported() {
        return 'xr' in navigator && 'isSessionSupported' in navigator.xr;
    }

    if(idElem === "buttonAR"){
        elemCreated.setAttribute("title", "Augmented Reality for phones");
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
            // elemCreated.style.backgroundColor = "#FFF"
            elemCreated.setAttribute("href", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/AR`)
        } else {
            elemCreated.style.background = "#00000050"
            elemCreated.setAttribute("href", "#");
            elemCreated.style.cursor = "not-allowed"
            elemCreated.style.opacity = "0.2"
        }
    } else if(idElem === "buttonVR"){
        elemCreated.setAttribute("title", "Virtual Reality for VR headset");
        if ('xr' in navigator) {

            // If VR is supported
            navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        
            if (supported) {
                // VR is supported
                elemCreated.setAttribute("href", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/AR`)
            } else {
                // VR isn't supported 
                elemCreated.setAttribute('href', '#');
                elemCreated.style.backgroundColor = "#00000050" 
                elemCreated.style.cursor = "not-allowed"
                elemCreated.style.opacity = "0.2"

                elemCreated.addEventListener('click', (event) => {
                    event.preventDefault();
                });
            }
            });
        } else {
            // Navigator dont work with WebXR
            elemCreated.setAttribute('href', '#');
            elemCreated.style.backgroundColor = "#00000050" 
            elemCreated.style.cursor = "not-allowed"
            elemCreated.style.opacity = "0.2"

            elemCreated.addEventListener('click', (event) => {
                event.preventDefault();
            });
        }
        // if (isWebXRSupported() && navigator.xr.isSessionSupported('immersive-vr')) {
        //     elemCreated.setAttribute("href", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/3D`)
        //     // elemCreated.style.backgroundColor = "#FFF" 
        // } else {
        //     elemCreated.style.backgroundColor = "#00000050" 
        //     elemCreated.setAttribute("href", "#");
        //     elemCreated.style.cursor = "not-allowed"
        //     elemCreated.style.opacity = "0.2"
        // }
    } 
}

function addElement() {
    var newDiv = document.createElement("div");
    newDiv.classList.add('parentDivRoomInfo');

    // Title
    var title = document.createElement("h2");
    title.classList.add('titleRoom');
    title.textContent = `${NameRooms.roomInfos[roomNumber][0]}`
    newDiv.appendChild(title);
    
    // Body
    var img = document.createElement("img");
    img.setAttribute("src", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/${NameRooms.roomInfos[roomNumber][0]}.png`);
    img.setAttribute("alt", "test")
    img.setAttribute("id", "imgRoom")
    img.classList.add('imgRoom')
    newDiv.appendChild(img);

    // Room info
    var text = document.createElement("p");
    text.classList.add('textRoom');
    text.textContent = `${NameRooms.roomInfos[roomNumber][2]}`
    newDiv.appendChild(text);

    // Location
    var location = document.createElement("p");
    location.classList.add('adressRoom');
    location.textContent = `Location : \n ${NameRooms.roomInfos[roomNumber][3]}\n\n Depth: ${NameRooms.roomInfos[roomNumber][4]}`
    newDiv.appendChild(location);

    addButtonDiv("a", "buttonVR", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/3D`, "VR", newDiv)
    addButtonDiv("a", "button3D", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/3D`, "3D", newDiv)
    addButtonDiv("a", "buttonAR", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/AR`, "AR", newDiv)

    var currentDiv = document.querySelector('.displayRooms');
    currentDiv.appendChild(newDiv);
}

for (let i = 0; i < NameRooms.roomInfos.length; i++) {
    addElement(roomNumber)
    roomNumber++
}


function testElemWebXR(classDiv){
    const classElem = document.querySelector(classDiv);
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
        classElem.style.backgroundColor = ""
    } else {
        classElem.style.background = "#00000050"
    }
}


