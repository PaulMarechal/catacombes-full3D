import * as NameRooms from "../roomInfo.js";

// Height grid ( in pixels)
let mapDiv = document.querySelector(".parentMap");
const heightMap = `${window.innerHeight - 110}px`

const templateRow = ((window.innerHeight - 110) / 12)
const gridTemplateRows = `repeat(12, ${templateRow}px)`

const templateColumns = (window.innerWidth / 12)
const gridTemplateColumns = `repeat(12, ${templateColumns}px)`

mapDiv.style.gridTemplateRows = gridTemplateRows
mapDiv.style.gridTemplateColumns = gridTemplateColumns
mapDiv.style.height = heightMap

// Click on distrit
// const petitMontrougeClick = document.querySelector(".petitMontrouge");
// petitMontrougeClick.addEventListener("click", event => {
//     mapDiv.style.transition = "opacity 1s ease-out"
//     mapDiv.style.opacity = 0

//     montrougeDiv.style.display = "block"
//     montrougeDiv.style.transition = "opacity 1s ease-out"
//     montrougeDiv.style.opacity = 1
// })
const petitMontrougeClick = document.querySelector(".petitMontrouge");
const montparnasseClick = document.querySelector(".montparnasse");
const notreDameDesChampsClick = document.querySelector(".notreDameDesChamps");
const valDeGraceClick = document.querySelector(".valDeGrace");

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
                }

                displayRooms(areaName)
            }, 50);
        }, 200);
    });    
}

clickOnDivDistrict(petitMontrougeClick, "Petit Montrouge")
clickOnDivDistrict(montparnasseClick, "Montparnasse")
clickOnDivDistrict(notreDameDesChampsClick, "Notre Dame des Champs")
clickOnDivDistrict(valDeGraceClick, "Val de Grace")

// petitMontrougeClick.addEventListener("click", event => {
//     mapDiv.style.opacity = 0;
//     setTimeout(() => {
//         mapDiv.style.transition = "opacity 1s ease-out";
//         mapDiv.style.display = "none";
//         montrougeDiv.style.display = "grid";

//         setTimeout(() => {
//             montrougeDiv.style.transition = "opacity 1s ease-out"
//             montrougeDiv.style.opacity = 1;
//             displayRooms("Petit Montrouge")
//         }, 50);
//     }, 200);
// });



// Petit montrouge
const petitMontrouge = document.querySelector(".montrougeDiv")

const templateRowsSmallMap = ((window.innerHeight + 190) / 12)
const gridTemplateRowsSmallMap = `repeat(2, ${templateRowsSmallMap / 6}px) repeat(8, ${(templateRowsSmallMap*0.97)}px) repeat(2, ${templateRowsSmallMap / 4}px)`

const templateColumnsSmallMap = ((window.innerWidth -110) / 7)
const gridTemplateColumnsSmallMap = `${templateRowsSmallMap / 2}px repeat(7, ${(templateColumnsSmallMap*0.97)}px) ${templateRowsSmallMap/2}px`

petitMontrouge.style.gridTemplateRows = gridTemplateRowsSmallMap
petitMontrouge.style.gridTemplateColumns = gridTemplateColumnsSmallMap


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
  
    const imageRoomSmallDiv = document.createElement("div");
    imageRoomSmallDiv.classList.add("imageRoomSmallDiv");

    const image = document.createElement("img");
    image.setAttribute("src", `https://catacombes.xyz/${NameRooms.roomInfos[roomNumber][0]}/${NameRooms.roomInfos[roomNumber][0]}.png`);
    image.setAttribute("alt", `Image of the ${NameRooms.roomInfos[roomNumber][0]} room placed in the forbidden catacombs of Paris`);
    image.style.width = "98%";
    image.style.borderRadius = "8px"
    imageRoomSmallDiv.appendChild(image);
  
    parentDivPrez.appendChild(titleRoomSmallDiv);
    parentDivPrez.appendChild(locationRoomSmallDiv);
    parentDivPrez.appendChild(imageRoomSmallDiv);
    parentDivPrez.appendChild(depth);

    parentDivPrez.style.gridArea = gridAreaRoom[numberToDisplayGrid]
    console.log(gridAreaRoom[numberToDisplayGrid])

    document.querySelector(".retourButton").style.display = "grid"

    const firstDiv = document.createElement("div")
    firstDiv.classList.add("firstDiv")
    firstDiv.style.gridArea = `${NameRooms.roomInfos[roomNumber][7]}`

    const preciseDiv = document.createElement("div")
    preciseDiv.classList.add("gridAreaPrecise")

    const preciseDivSecond = document.createElement("div")
    preciseDivSecond.classList.add("gridAreaPreciseSecond")
    preciseDivSecond.style.gridArea = `${NameRooms.roomInfos[roomNumber][8]}`
    console.log(`${NameRooms.roomInfos[roomNumber][0]} - ${NameRooms.roomInfos[roomNumber][7]} - ${NameRooms.roomInfos[roomNumber][8]}`)
    
    const smallPoint = document.createElement("p")
    smallPoint.classList.add("pointRoom")
    smallPoint.setAttribute("id", `${NameRooms.roomInfos[roomNumber][0]}`)
    smallPoint.innerText = "✴"

    firstDiv.appendChild(preciseDiv)
    preciseDiv.appendChild(preciseDivSecond)
    preciseDivSecond.appendChild(smallPoint)

    document.getElementById("petitMontrouge").appendChild(firstDiv)


    if (parentDivPrez) {
        parentDivPrez.addEventListener('mouseover', function() {
            var classe = this.classList;
        
            console.log(classe[1]);
            console.log(classe);
        
            const point = document.getElementById(`${classe[1]}`)
            point.innerHTML = "☉"
        });
    
        parentDivPrez.addEventListener('mouseout', function() {
            var classe = this.classList;
            console.log(classe)
        
            const point = document.getElementById(`${classe[1]}`)
            point.innerHTML = "✴"
        });

        parentDivPrez.addEventListener('click', function(event) {
            var classe = this.classList;
            console.log(classe)
        
            const point = document.getElementById(`${classe[1]}`)
            window.location.href = `https://catacombes.xyz/${classe[1]}/3D`
        });
    }

    return parentDivPrez;
}




// createParentDivPrez("Belier", "Location: testtesttest", "Depth: testM", "https://catacombes.xyz/Belier/Belier.png", "Image of the Belier room of the catacombes of paris")

function addChild(child){
    const mainDiv = document.getElementById("petitMontrouge")
    console.log(child)
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
    // console.log(districtName)
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


