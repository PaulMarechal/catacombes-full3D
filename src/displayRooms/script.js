import * as NameRooms from "../roomInfo.js";

function addElement () {
    var newDiv = document.createElement("div");
    newDiv.classList.add('displayRooms');

    // Title
    var title = document.createElement("h2");
    title.textContent = "Yo la miff"
    newDiv.appendChild(title);
    
    // Body
    var img = document.createElement("img");
    img.setAttribute("src", "test")
    img.setAttribute("alt", "test")
    img.setAttribute("id", "test")
    newDiv.appendChild(img);

    var text = document.createElement("p");
    text.textContent = "This is a test"
    newDiv.appendChild(text);

    var newContent = document.createTextNode('Hi there and greetings!');


    var currentDiv = document.querySelector('.displayRooms');
    currentDiv.appendChild(newDiv);
}

addElement()