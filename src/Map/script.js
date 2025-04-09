import * as NameRooms from "../roomInfo.js";

function displayMobileOrMap() {
    const petitMontrouge = document.getElementById("petitMontrouge")
    if (window.matchMedia("(orientation: portrait)").matches) {
        // L'appareil est en mode portrait
        document.querySelector(".displayMobile").style.display = "block";
        document.querySelector(".parentMap").style.display = "none";

        if(petitMontrouge){
            petitMontrouge.style.display = "none"
        }
    } else {
        // L'appareil est en mode paysage
        document.querySelector(".displayMobile").style.display = "none";
        document.getElementById("parentDiv").style.display = "grid"
        document.querySelector(".parentMap").style.display = "grid";
        if(petitMontrouge){
            petitMontrouge.style.display = "grid"
        }
    }
}
  
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    displayMobileOrMap();
  
    window.addEventListener("resize", function() {
      setTimeout(displayMobileOrMap, 100);
    });
}

function refreshPage() {
    location.reload();
}

window.addEventListener('resize', refreshPage);

// Height grid ( in pixels)
let mapDiv = document.querySelector(".parentMap");
/*
// Old template
const heightMap = `${window.innerHeight - 110}px`
const templateRow = ((window.innerHeight - 110) / 12)
const gridTemplateRows = `repeat(12, ${templateRow}px)`
const templateColumns = (window.innerWidth / 12)
const gridTemplateColumns = `repeat(12, ${templateColumns - 30}px)`
*/
const body = document.querySelector("body");
body.style.height = `${window.innerHeight}px`;

const gridTemplateRows = `repeat(30, 21.94px)`;
const gridTemplateColumns = `repeat(30, 36px)`;

mapDiv.style.gridTemplateRows = gridTemplateRows
mapDiv.style.gridTemplateColumns = gridTemplateColumns

const petitMontrougeClick = document.querySelector(".petitMontrouge");
const montparnasseClick = document.querySelector(".montparnasse");
const notreDameDesChampsClick = document.querySelector(".notreDameDesChamps");
const valDeGraceClick = document.querySelector(".valDeGrace");
const salpetriere = document.querySelector(".salpetriere");
const gare = document.querySelector(".gare");
const maisonBlanche = document.querySelector(".maisonBlanche");

const montrougeDiv = document.querySelector(".montrougeDiv");

function clickOnDivDistrict(areaDistrict, areaName){

    areaDistrict.addEventListener("click", event => {
        mapDiv.style.opacity = 0;
        setTimeout(() => {
            mapDiv.style.transition = "opacity 1s ease-out";
            mapDiv.style.display = "none";
            montrougeDiv.style.display = "grid";
    
            setTimeout(() => {
                montrougeDiv.style.transition = "opacity 1s ease-out"
                montrougeDiv.style.opacity = 1;

                const imagePreci = document.querySelector(".imageMapMontrouge")
                if(areaName === "Montparnasse"){
                    imagePreci.style.backgroundImage = "url('https://catacombes.xyz/assets/images/montparnasseMap.png')"
                } else if (areaName === "Notre Dame des Champs"){
                    imagePreci.style.backgroundImage = "url('https://catacombes.xyz/assets/images/notreDameDesChampsMap.png')"
                } else if(areaName === "Val de Grace"){
                    imagePreci.style.backgroundImage = "url('https://catacombes.xyz/assets/images/valDeGraceMap.png')"
                } else if(areaName === "Salpetriere"){
                    imagePreci.style.backgroundImage = "url('https://catacombes.xyz/assets/images/salpetriereMap.png')"
                } else if(areaName === "Gare"){
                    imagePreci.style.backgroundImage = "url('https://catacombes.xyz/assets/images/gareMap.png')"
                } else if(areaName === "Petit Montrouge"){
                    imagePreci.style.backgroundImage = "url('https://catacombes.xyz/assets/images/petitMontrouge.png')"
                } else if(areaName === "Maison Blanche"){
                    imagePreci.style.backgroundImage = "url('https://catacombes.xyz/assets/images/maisonBlancheMap.png')"
                }

                displayRooms(areaName)
            }, 50);
        }, 200);
    });   
} 
// }


clickOnDivDistrict(petitMontrougeClick, "Petit Montrouge")
clickOnDivDistrict(montparnasseClick, "Montparnasse")
clickOnDivDistrict(notreDameDesChampsClick, "Notre Dame des Champs")
clickOnDivDistrict(valDeGraceClick, "Val de Grace")
clickOnDivDistrict(salpetriere, "Salpetriere")
clickOnDivDistrict(gare, "Gare")
clickOnDivDistrict(maisonBlanche, "Maison Blanche")

// Petit montrouge
const petitMontrouge = document.querySelector(".montrougeDiv")

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
    const templateRowsSmallMap = ((window.innerHeight) / 12)
    const gridTemplateRowsSmallMap = `repeat(2, ${templateRowsSmallMap / 6}px) repeat(8, ${(templateRowsSmallMap*0.95)}px) repeat(2, ${templateRowsSmallMap / 4}px)`

    const templateColumnsSmallMap = ((window.innerWidth -110) / 7)
    const gridTemplateColumnsSmallMap = `${templateRowsSmallMap / 2}px repeat(7, ${(templateColumnsSmallMap*0.97)}px) ${templateRowsSmallMap/2}px`

    petitMontrouge.style.gridTemplateRows = gridTemplateRowsSmallMap
    petitMontrouge.style.gridTemplateColumns = gridTemplateColumnsSmallMap
} else {
    // const templateRowsSmallMap = ((window.innerHeight + 190) / 12)
    // const gridTemplateRowsSmallMap = `repeat(2, ${templateRowsSmallMap / 6}px) repeat(8, ${(templateRowsSmallMap*0.97)}px) repeat(2, ${templateRowsSmallMap / 4}px)`

    // const templateColumnsSmallMap = ((window.innerWidth -110) / 7)
    // const gridTemplateColumnsSmallMap = `${templateRowsSmallMap / 2}px repeat(7, ${(templateColumnsSmallMap*0.97)}px) ${templateRowsSmallMap/2}px`

    const gridTemplateRowsSmallMap = "repeat(2, 15px) repeat(8, 77px) repeat(2, 10px)"
    const gridTemplateColumnsSmallMap = "40px repeat(7, 200px) 40px"

    petitMontrouge.style.gridTemplateRows = gridTemplateRowsSmallMap
    petitMontrouge.style.gridTemplateColumns = gridTemplateColumnsSmallMap
}


/**
 * Crete presentation div for small map
 * @param {
 *  title, 
 *  location,
 *  depth,
 *  src image, 
 *  alt image
 * }
 */
function createParentDivPrez(roomNumber, numberToDisplayGrid) {
    const parentDivPrez = document.createElement("div");
    parentDivPrez.classList.add("parentDivPrezSecond");
    parentDivPrez.classList.add(`${NameRooms.roomInfos[roomNumber][0]}`);
    parentDivPrez.style.display = "grid"
  
    const titleRoomSmallDiv = document.createElement("div");
    titleRoomSmallDiv.classList.add("titleRoomSmallDiv");
    const title = document.createElement("h2");
    title.innerText = `${NameRooms.roomInfos[roomNumber][1]}`;
    titleRoomSmallDiv.appendChild(title);
  
    const locationRoomSmallDiv = document.createElement("div");
    locationRoomSmallDiv.classList.add("locationRoomSmallDiv");
    const location = document.createElement("p");
    location.innerText = `${NameRooms.roomInfos[roomNumber][3]}`;
    locationRoomSmallDiv.appendChild(location);
    const depth = document.createElement("p");
    depth.classList.add("depthSmallRoom");
    depth.innerText = `Depth : \n ${NameRooms.roomInfos[roomNumber][4]}`;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
        locationRoomSmallDiv.style.display = "none"
        depth.style.display = "none"
    }
  
    const imageRoomSmallDiv = document.createElement("div");
    imageRoomSmallDiv.classList.add("imageRoomSmallDiv");

    const image = document.createElement("img");
    image.setAttribute("src", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/${NameRooms.roomInfos[roomNumber][0]}.webp`);
    image.setAttribute("alt", `Image of the ${NameRooms.roomInfos[roomNumber][0]} room placed in the forbidden catacombs of Paris`);
    image.style.width = "90%";
    image.style.borderRadius = "8px"
    imageRoomSmallDiv.appendChild(image);
    
    parentDivPrez.appendChild(titleRoomSmallDiv);
    parentDivPrez.appendChild(locationRoomSmallDiv);
    parentDivPrez.appendChild(imageRoomSmallDiv);
    parentDivPrez.appendChild(depth);
    
    parentDivPrez.style.gridArea = gridAreaRoom[numberToDisplayGrid]
    parentDivPrez.setAttribute("title", "Clic pour voir la salle en 3D")

    
    document.querySelector(".retourButton").style.display = "grid"
    
    const firstDiv = document.createElement("div")
    firstDiv.classList.add("firstDiv")
    firstDiv.style.gridArea = `${NameRooms.roomInfos[roomNumber][7]}`
    
    const preciseDiv = document.createElement("div")
    preciseDiv.classList.add("gridAreaPrecise")
    
    const preciseDivSecond = document.createElement("div")
    preciseDivSecond.classList.add("gridAreaPreciseSecond")
    preciseDivSecond.style.gridArea = `${NameRooms.roomInfos[roomNumber][8]}`
    
    const smallPoint = document.createElement("p")
    smallPoint.classList.add("pointRoom")
    if(NameRooms.roomInfos[roomNumber][7]){
        smallPoint.setAttribute("id", `${NameRooms.roomInfos[roomNumber][0]}`)
        smallPoint.innerText = "📍"
    }

    firstDiv.appendChild(preciseDiv)
    preciseDiv.appendChild(preciseDivSecond)
    preciseDivSecond.appendChild(smallPoint)

    document.getElementById("petitMontrouge").appendChild(firstDiv)


    if (parentDivPrez) {
        const mouse = document.querySelector(".custom-cursor")

        parentDivPrez.addEventListener('mouseover', function() {
            var classe = this.classList;

            mouse.classList.add("custom-cursor--link")
        
            const point = document.getElementById(`${classe[1]}`)
            if(point){point.innerHTML = "🔴"}
        });
    
        parentDivPrez.addEventListener('mouseout', function() {
            var classe = this.classList;

            mouse.classList.remove("custom-cursor--link")

            const point = document.getElementById(`${classe[1]}`)
            if(point){point.innerHTML = "📌"}
            
        });

        parentDivPrez.addEventListener('click', function(event) {
            var classe = this.classList[1];
            // const point = document.getElementById(`${classe}`)
            window.location.href = `../3D/?room=${classe}`
        });
    }

    window.addEventListener("resize", function() {
        setTimeout(displayMobileOrMap, 100);
    });

    return parentDivPrez;
}




// createParentDivPrez("Belier", "Location: testtesttest", "Depth: testM", "https://catacombes.xyz/Belier/Belier.png", "Image of the Belier room of the catacombes of paris")

function addChild(child){
    const mainDiv = document.getElementById("petitMontrouge")
    mainDiv.appendChild(child)
}

const gridAreaRoom = [
    "3 / 2 / 4 / 4",
    "4 / 2 / 5 / 4", 
    "5 / 2 / 6 / 4", 
    "6 / 2 / 7 / 4", 
    "7 / 2 / 8 / 4", 
    "8 / 2 / 9 / 4", 
    "9 / 2 / 10 / 4", 
    "10 / 2 / 11 / 4", 
    "3 / 7 / 4 / 9", 
    "4 / 7 / 5 / 9", 
    "5 / 7 / 6 / 9", 
    "6 / 7 / 7 / 9", 
    "7 / 7 / 8 / 9", 
    "8 / 7 / 9 / 9", 
    "9 / 7 / 10 / 9", 
    "10 / 7 / 11 / 9",   
]

function displayRooms(districtName) {
    var roomNumber = 0
    var displayGrid = 0;
    for (let i = 0; i < NameRooms.roomInfos.length; i++) {
        if(NameRooms.roomInfos[roomNumber][6] === districtName){
            addChild(createParentDivPrez(roomNumber, displayGrid))
            displayGrid++
        }
        roomNumber++
    }
}

console.log("Developed with 🍔 by Paul Maréchal")



