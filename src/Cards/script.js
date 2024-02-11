const div_display_card_main = document.querySelector(".div_display_card_main")
const text_explication_card = document.querySelector(".text_explication_card")
const display_all_tracts_div = document.querySelector(".display_all_tracts_div")
const show_image_verso_main_div = document.querySelector(".show_image_verso_main_div")
const close_card_viewer = document.querySelector(".close_card_viewer")
const explication_video = document.querySelector(".explication_video")
const many_cards_display = document.querySelector(".many_cards_display")

div_display_card_main.addEventListener("click", () => {

    text_explication_card.style.display = "none"; 
    display_all_tracts_div.style.display = "none";
    explication_video.style.display = "none";

    text_explication_card.style.opacity = 0;
    display_all_tracts_div.style.opacity = 0;
    explication_video.style.opacity = 0;

    setTimeout(() => {
        show_image_verso_main_div.style.opacity = 1;
        show_image_verso_main_div.style.display = "block";

        many_cards_display.style.opacity = 1;
        many_cards_display.style.display = "block"
    }, 500);

});


close_card_viewer.addEventListener("click", () => {
    show_image_verso_main_div.style.opacity = 0;
    show_image_verso_main_div.style.display = "none";

    many_cards_display.style.opacity = 0;
    many_cards_display.style.display = "none";

    setTimeout(() => {
        text_explication_card.style.opacity = 1;
        display_all_tracts_div.style.opacity = 1;
        explication_video.style.opacity = 1;
    
        text_explication_card.style.display = "block"; 
        display_all_tracts_div.style.display = "block";
        explication_video.style.display = "block";
    }, 500);
}); 

