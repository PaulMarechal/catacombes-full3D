const divs = document.querySelectorAll('.marginPageimages');
const arrow = document.querySelector('.arrow');
const body = document.querySelector('body');
const arrowLeft = document.querySelector('.icon-tabler-chevron-left');
const arrowRight = document.querySelector('.icon-tabler-chevron-right');
const imageOnClick = document.querySelector('.imageOnClick');
const popupImage = document.querySelector('#popupImage');
const closeButton = document.querySelector(".icon-tabler-xbox-x");
let imageDiv = document.querySelector(".parentTextExplications");

const heightImg = `${window.innerHeight - 90}px`;
imageDiv.style.height = heightImg;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.addEventListener("resize", function () {
        window.location.reload();
    });
}

let currentIndex = 0;

function updateImage(index) {
    const url = getImageUrl(index);
    const tempImage = new Image();
    tempImage.onload = () => {
        popupImage.src = url;
    };
    tempImage.src = url;
}


function getImageUrl(index) {
    return `https://catacombes.xyz/assets/images/${popupImageNames[index - 1]}`;
}

function displayImageOnClick() {
    divs.forEach((div, i) => {
        div.addEventListener('click', () => {
            currentIndex = i + 1;

            updateImage(currentIndex);

            imageOnClick.style.display = "block";
            arrow.style.display = "block";
            closeButton.style.display = "block";
            arrowLeft.style.display = "block";
            arrowRight.style.display = "block";

            imageOnClick.style.transition = "opacity 0.3s ease-out, width 0.5s ease-out, height .5s ease-out, box-shadow .5s ease-out";
            arrow.style.transition = "opacity 0.3s ease-out, width 0.5s ease-out, height .5s ease-out, box-shadow .5s ease-out";

            body.style.background = "rgb(106, 106, 106)";
            imageOnClick.style.opacity = "0";
            arrow.style.opacity = "0";

            setTimeout(() => {
                imageOnClick.style.opacity = "1";
                arrow.style.opacity = "1";
            }, 100);
        });
    });

    arrowLeft.addEventListener('click', () => {
        currentIndex = currentIndex === 1 ? popupImageNames.length : currentIndex - 1;

        popupImage.style.transform = "translateX(-10%)";

        setTimeout(() => {
            updateImage(currentIndex);
            popupImage.style.transform = "translateX(0)";
        }, 400);
    });

    arrowRight.addEventListener('click', () => {
        currentIndex = currentIndex === popupImageNames.length ? 1 : currentIndex + 1;

        popupImage.style.transform = "translateX(10%)";

        setTimeout(() => {
            updateImage(currentIndex);
            popupImage.style.transform = "translateX(0)";
        }, 400);
    });


    closeButton.addEventListener("click", () => {
        body.style.background = "rgb(231 231 231)";

        imageOnClick.style.transition = "opacity .5s ease-out";
        arrow.style.transition = "opacity .5s ease-out, width 0.5s ease-out, height .5s ease-out, box-shadow .5s ease-out";
        imageOnClick.style.opacity = "0";
        arrow.style.opacity = "0";

        setTimeout(() => {
            imageOnClick.style.display = "none";
            arrow.style.display = "none";
            closeButton.style.display = "none";
            arrowLeft.style.display = "none";
            arrowRight.style.display = "none";
            popupImage.src = "";
        }, 500);
    });
}

const popupImageNames = [
    "porteClose_ruePinel_catacombes.jpg",
    "crypte_atlasCatacombes_catacombes.jpg",
    "salleDesRadios_ValDeGrace_catacombes.jpg",
    "escalierCimetiereMontparnasseEtageInferieur_catacombes.jpg",
    "acqueducArcueil_catacombes.jpg",
    "bunker_catacombes.png",
    "doubleEscalier_CabinetMineralogieLHuillier_catacombes.jpg",
    "salleSolcarlus_catacombes.jpg",
    "tombePhilibertAspairt_catacombes.jpg",
    "acqueducArcueil_catacombes.jpg",
    "couloirCatacombes_catacombes.jpg",
    "salleApero_chauxAssas_catacombes.jpg",
    "rueHonoreChevalierCatacombes_catacombes.jpg",
    "salleCube_catacombes.jpg",
    "fontaineDesChartreux_catacombes.jpg",
    "tombePhilibertAspairt_catacombes.jpg",
    "passeMuraille_catacombes.jpg",
    "SalleSarko_catacombes.jpg",
    "salleApero_chauxAssas_catacombes.jpg",
    "archeValDeGrace_catacombes.jpg",
    "SalleChateau_catacombes.jpg",
    "reservoirEauVanne_catacombes.jpg",
    "passeMuraille_catacombes.jpg",
    "salleSolcarlus_catacombes.jpg",
    "salleSolcarlus_catacombes.jpg"
];

displayImageOnClick();

console.log("Developed by 🍔 by Paul Maréchal");
