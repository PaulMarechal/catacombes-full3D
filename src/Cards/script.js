const text_explication_card = document.querySelector(".text_explication_card")
const display_all_tracts_div = document.querySelector(".display_all_tracts_div")
const explication_video = document.querySelector(".explication_video")

function setupCardClickHandlers(version) {
    const div_display_card_main = document.querySelector(`#display_card_${version}`);
    const show_image_verso_main_div = document.querySelector(`.show_image_verso_main_div_${version}`);
    const many_cards_display = document.querySelector(`.many_cards_display_${version}`);
    const cards = document.querySelectorAll(`.card_${version}`);
    const close_card_viewer = document.querySelector(`.close_card_viewer_${version}`);

    div_display_card_main.addEventListener("click", () => {
        text_explication_card.style.opacity = 0;
        display_all_tracts_div.style.opacity = 0;
        explication_video.style.opacity = 0;

        setTimeout(() => {
            text_explication_card.style.display = "none";
            display_all_tracts_div.style.display = "none";
            explication_video.style.display = "none";

            show_image_verso_main_div.style.opacity = 1;
            show_image_verso_main_div.style.display = "block";

            many_cards_display.style.display = "block";

            setTimeout(() => {
                many_cards_display.style.opacity = 1;

                cards.forEach((card, index) => {
                    const rotationAngle = index * 20;

                    setTimeout(() => {
                        card.style.transform = `rotate(${rotationAngle}deg)`;
                    }, (index - 1) * 200);
                });
            }, 650);
        }, 1000);
    });

    close_card_viewer.addEventListener("click", () => {
        show_image_verso_main_div.style.opacity = 0;
        many_cards_display.style.opacity = 0;

        setTimeout(() => {
            show_image_verso_main_div.style.display = "none";
            many_cards_display.style.display = "none";

            text_explication_card.style.display = "block";
            display_all_tracts_div.style.display = "inline-flex";
            explication_video.style.display = "block";
        }, 500);

        setTimeout(() => {
            cards.forEach(card => {
                card.style.transform = "rotate(0deg)";
            });

            text_explication_card.style.opacity = 1;
            display_all_tracts_div.style.opacity = 1;
            explication_video.style.opacity = 1;
        }, 1000);
    });
}

setupCardClickHandlers('v1');
setupCardClickHandlers('v2');

console.log("Make with 🍔 by Paul Maréchal")
console.log("Cards designed by Paloma & Paul, coded in Paris by DevXR")
console.log("https://devxr.fr")
