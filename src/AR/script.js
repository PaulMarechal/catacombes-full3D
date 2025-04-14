const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get("room");

if (!room) {
    document.body.innerHTML = "<h1>Erreur : aucune salle définie</h1>";
} else {
    const viewer = document.getElementById("arViewer");
    viewer.setAttribute("src", `https://catacombes.xyz/${room}/${room}.glb`);
    viewer.setAttribute("ios-src", `https://catacombes.xyz/${room}/${room}.usdz`);

    viewer.addEventListener("load", () => {
        setTimeout(() => {
            const loader = document.getElementById("loaderContainer");
            loader.classList.add("fade-out");

            const arButton = viewer.querySelector(".ar_button");
            // if (arButton) arButton.click();
        }, 500);
    });
}

console.log("Developed with 🍔 by Paul Maréchal")
