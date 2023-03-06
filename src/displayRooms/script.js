import * as NameRooms from "../roomInfo.js";

var roomNumber = 0;

function addButtonDiv(elem, idElem, link, textButton, newDiv){
    var elemCreated = document.createElement(elem); 
    elemCreated.setAttribute("id", idElem);
    elemCreated.classList.add(idElem); 
    elemCreated.classList.add("buttonRedirect3D");
    elemCreated.setAttribute("href", link);
    elemCreated.textContent = textButton;
    newDiv.appendChild(elemCreated);
}

function addElement() {
    var newDiv = document.createElement("div");
    newDiv.classList.add('parentDivRoomInfo');

    // Title
    var title = document.createElement("h2");
    title.classList.add('titleRoom');
    title.textContent = `Name : ${NameRooms.roomInfos[roomNumber][0]}`
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
    location.textContent = `Location : \n ${NameRooms.roomInfos[roomNumber][3]}`
    newDiv.appendChild(location);

    addButtonDiv("a", "buttonVR", `${NameRooms.roomInfos[roomNumber][5]}`, "VR", newDiv)
    addButtonDiv("a", "button3D", `${NameRooms.roomInfos[roomNumber][5]}`, "3D", newDiv)
    addButtonDiv("a", "buttonAR", `${NameRooms.roomInfos[roomNumber][5]}`, "AR", newDiv)

    var newContent = document.createTextNode('Hi there and greetings!');


    var currentDiv = document.querySelector('.displayRooms');
    currentDiv.appendChild(newDiv);
}

for (let i = 0; i < NameRooms.roomInfos.length; i++) {
    addElement(roomNumber)
    roomNumber++
}
