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
const petitMontrougeClick = document.querySelector(".petitMontrouge");
petitMontrougeClick.addEventListener("click", event => {
    mapDiv.style.transition = "opacity 1s ease-out"
    mapDiv.style.opacity = 0
    console.log()
})


// Petit montrouge
const petitMontrouge = document.querySelector(".montrougeDiv")

const templateRowsSmallMap = ((window.innerHeight + 180) / 9)
const gridTemplateRowsSmallMap = `${templateRowsSmallMap / 2}px ${templateRowsSmallMap / 2}px repeat(5, ${templateRowsSmallMap}px) ${templateRowsSmallMap / 2}px ${templateRowsSmallMap / 2}px`

const templateColumnsSmallMap = ((window.innerWidth -110) / 7)
const gridTemplateColumnsSmallMap = `repeat(7, ${templateColumnsSmallMap}px)`

petitMontrouge.style.gridTemplateRows = gridTemplateRowsSmallMap
console.log(gridTemplateRowsSmallMap)
petitMontrouge.style.gridTemplateColumns = gridTemplateColumnsSmallMap
console.log(gridTemplateColumnsSmallMap)

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
function createParentDivPrez(titleRoom, locationRoom, depthRoom, srcImage, altImage) {
    const parentDivPrez = document.createElement("div");
    parentDivPrez.classList.add("parentDivPrezSecond");
    parentDivPrez.style.display = "grid"
  
    const titleRoomSmallDiv = document.createElement("div");
    titleRoomSmallDiv.classList.add("titleRoomSmallDiv");
    const title = document.createElement("h2");
    title.innerText = titleRoom;
    titleRoomSmallDiv.appendChild(title);
  
    const locationRoomSmallDiv = document.createElement("div");
    locationRoomSmallDiv.classList.add("locationRoomSmallDiv");
    const location = document.createElement("p");
    location.innerText = locationRoom;
    locationRoomSmallDiv.appendChild(location);
    const depth = document.createElement("p");
    depth.innerText = depthRoom;
    locationRoomSmallDiv.appendChild(depth);
  
    const imageRoomSmallDiv = document.createElement("div");
    imageRoomSmallDiv.classList.add("imageRoomSmallDiv");
    imageRoomSmallDiv.style.width = "53%";
    imageRoomSmallDiv.style.marginTop = "4px";
    imageRoomSmallDiv.style.margin = "auto";

    const image = document.createElement("img");
    image.setAttribute("src", srcImage);
    image.setAttribute("alt", altImage);
    image.style.width = "100%";
    imageRoomSmallDiv.appendChild(image);
  
    parentDivPrez.appendChild(titleRoomSmallDiv);
    parentDivPrez.appendChild(locationRoomSmallDiv);
    parentDivPrez.appendChild(imageRoomSmallDiv);
  
    return parentDivPrez;
}


// createParentDivPrez("Belier", "Location: testtesttest", "Depth: testM", "https://catacombes.xyz/Belier/Belier.png", "Image of the Belier room of the catacombes of paris")

function addChild(idDiv, child){
    const mainDiv = document.getElementById(idDiv)
    mainDiv.appendChild(child)
}
  
addChild("belierDiv", createParentDivPrez("Belier", "Location: testtesttest", "Depth: testM", "https://catacombes.xyz/Belier/Belier.png", "Image of the Belier room of the catacombes of paris"))

