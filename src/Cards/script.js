const div_display_card_main = document.querySelector(".div_display_card_main")
const text_explication_card = document.querySelector(".text_explication_card")
const display_all_tracts_div = document.querySelector(".display_all_tracts_div")
const show_image_verso_main_div = document.querySelector(".show_image_verso_main_div")

const button_verso_track = document.querySelector(".button_verso_track")

const see_card_bigger_image = document.querySelector(".see_card_bigger_image")

div_display_card_main.addEventListener("click", () => {

    text_explication_card.style.opacity = 0
    display_all_tracts_div.style.opacity = 0 

    show_image_verso_main_div.style.opacity = 1 
    show_image_verso_main_div.style.display = "block"

    setTimeout(() => {
        text_explication_card.style.display = "none"; 
        display_all_tracts_div.style.display = "none";
    }, 500);

});

button_verso_track.addEventListener("click", () => {
    console.log(see_card_bigger_image.classList)
    if(see_card_bigger_image.classList.contains("recto")){
        see_card_bigger_image.setAttribute("src", "https://catacombes.xyz/assets/images/verso_tracts_v1.png")
        button_verso_track.innerHTML = "Voir verso"
    }
})