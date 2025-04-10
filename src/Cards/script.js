const text_explication_card = document.querySelector(".text_explication_card")
const display_all_tracts_div = document.querySelector(".display_all_tracts_div")
const explication_video = document.querySelector(".explication_video")
const display_v1_video = document.querySelector(".display_v1_video")
const display_v2_video = document.querySelector(".display_v2_video")
const display_v3_video = document.querySelector(".display_v3_video")
const video_card_v1 = document.querySelector("#video_card_v1")
const video_card_v2 = document.querySelector("#video_card_v2")
const video_card_v3 = document.querySelector("#video_card_v3")
const change_source_video = document.querySelector("#change_source_video")


// video_card_v3 top: 0 left: 0
function displayVideoTract(version){
    const explication_video = document.getElementsByClassName('explication_video')
    const video_version_id = document.getElementById(`video_card_${version}`)
    
    Array.from(explication_video).forEach(video => {
        video.style.opacity = 0
        setTimeout(() => {
            video.style.display = 'none'
        }, 510);
    });

    setTimeout(() => {   
        video_version_id.style.display = 'block'
        video_version_id.style.opacity = '1'
    }, 560);
}

function eventListenerVideo(version){
    document.querySelector(`.display_${version}_video`).addEventListener('click', () => {
        displayVideoTract(version);
    });
}

['v1', 'v2', 'v3'].forEach(version => {eventListenerVideo(version)});


function setupCardClickHandlers(version) {
    const div_display_card_main = document.querySelector(`#display_card_${version}`);
    const show_image_verso_main_div = document.querySelector(`.show_image_verso_main_div_${version}`);
    const many_cards_display = document.querySelector(`.many_cards_display_${version}`);
    const cards = document.querySelectorAll(`.card_${version}`);
    const close_card_viewer = document.querySelector(`.close_card_viewer_${version}`);

    div_display_card_main.addEventListener("click", () => {
        text_explication_card.style.opacity = 0;
        display_all_tracts_div.style.opacity = 0;

        display_v1_video.style.opacity = 0;
        display_v2_video.style.opacity = 0;
        display_v3_video.style.opacity = 0;

        video_card_v1.style.opacity = 0;
        video_card_v2.style.opacity = 0;
        video_card_v3.style.opacity = 0;

        video_card_v1.style.display = "none";
        video_card_v2.style.display = "none";
        video_card_v3.style.display = "none";

        close_card_viewer.style.display = "block"

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
            video_card_v2.style.position = "relative";
            video_card_v1.style.position = "absolute";
            display_v2_video.style.opacity = 0;
            video_card_v1.style.opacity = 0;

            video_card_v2.style.display = "block";
        }, 500);

        setTimeout(() => {
            cards.forEach(card => {
                card.style.transform = "rotate(0deg)";
            });

            text_explication_card.style.opacity = 1;
            display_all_tracts_div.style.opacity = 1;
            display_v1_video.style.opacity = 1;
            video_card_v2.style.opacity = 1;
        }, 1000);
    });
}

function toggleVideos(showCard, hideCard, showButton, hideButton) {
    hideCard.style.opacity = 0;
    showCard.style.opacity = 1;

    hideButton.style.display = "none";
    hideButton.style.opacity = "0";

    showButton.style.display = "block";
    showButton.style.position = "relative";
    showButton.style.opacity = "1";
}

// display_v1_video.addEventListener('click', () => {
//     toggleVideos(video_card_v1, video_card_v2, display_v2_video, display_v1_video);
// });

// display_v2_video.addEventListener('click', () => {
//     toggleVideos(video_card_v2, video_card_v1, display_v1_video, display_v2_video);
// });

// display_v3_video.addEventListener('click', () => {
//     toggleVideos(video_card_v3, video_card_v2, display_v2_video, display_v3_video);
// });

// ['v1', 'v2', 'v3'].forEach(version => setupCardClickHandlers(version));



console.log("Make with 🍔 by Paul Maréchal")
console.log("Cards designed by Paloma & Paul, coded in Paris by DevXR")
console.log("https://devxr.fr")
