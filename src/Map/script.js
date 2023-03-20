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