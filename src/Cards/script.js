const display_all_cards_v3 = document.getElementById("display_all_cards_v3")

display_all_cards_v3.addEventListener("click", ()=>{
    const explication_text_cards = document.getElementById("explication_text_cards")
    const explication_video_cards = document.getElementById("explication_video_cards")
    const display_all_tracts = document.getElementById("display_all_tracts")
    const tracts_v3 = document.getElementById("tracts_v3")
 
    try {
        const displayAllBtn = document.querySelector('#display_all_cards_v3');
        const displayAllTracts = document.querySelector('#display_all_tracts');
        const tractsV3 = document.querySelector('#tracts_v3');

        if (displayAllBtn && displayAllTracts && tractsV3) {
            displayAllBtn.addEventListener('click', () => {
            displayAllTracts.style.display = 'block';
            requestAnimationFrame(() => {
                displayAllTracts.style.opacity = '1';
                tractsV3.style.opacity = '1';
            });
            displayAllBtn.style.display = 'none';
            try { displayAllTracts.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch(e) {}
            });
        }
    } catch(e) { console.warn('Show-all-cards init failed:', e); }

    explication_text_cards.style.opacity = 0
    explication_video_cards.style.opacity = 0
    
    setTimeout(() => {
        display_all_tracts.style.display = 'block'
        explication_text_cards.style.display = "none"
        explication_video_cards.style.display = "none"
    }, 490);

    setTimeout(() => {

        display_all_tracts.style.opacity = 1
        tracts_v3.style.opacity = 1
    }, 490);


    (function(){
        try{
            const dimmer = document.createElement('div');
            dimmer.className = 'hover_dimmer';
            document.body.appendChild(dimmer);

            function wireHover(){
                const imgs = document.querySelectorAll('#tracts_v3 img');
                imgs.forEach(img => {
                    img.addEventListener('mouseenter', () => dimmer.classList.add('active'));
                    img.addEventListener('mouseleave', () => dimmer.classList.remove('active'));

                    img.addEventListener('touchstart', () => dimmer.classList.add('active'), {passive:true});
                    img.addEventListener('touchend', () => dimmer.classList.remove('active'));
                    img.addEventListener('touchcancel', () => dimmer.classList.remove('active'));
                });
            }

            // images déjà présentes
            wireHover();
            
            // si ça affiches la grille après le clic 
            document.addEventListener('click', (e)=>{
                if (e.target && e.target.closest && e.target.closest('#display_all_cards_v3')) {
                    setTimeout(wireHover, 50);
                }
            });
        }catch(e){ console.warn('Hover dimmer not initialized:', e); }
    })();

    // --- Close button restores initial view ---
    try {
        const closeBtn = document.querySelector('#close_display_cards');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const explication_text_cards = document.getElementById("explication_text_cards");
            const explication_video_cards = document.getElementById("explication_video_cards");
            const display_all_tracts = document.getElementById("display_all_tracts");
            const tracts_v3 = document.getElementById("tracts_v3");

            // Masquer les cartes
            display_all_tracts.style.opacity = 0;
            tracts_v3.style.opacity = 0;

            setTimeout(() => {
                display_all_tracts.style.display = 'none';

                // Réafficher texte + vidéo
                explication_text_cards.style.display = 'block';
                explication_video_cards.style.display = 'block';

                requestAnimationFrame(() => {
                explication_text_cards.style.opacity = 1;
                explication_video_cards.style.opacity = 1;
                });

                // Réafficher le bouton "Afficher toutes les cartes"
                const displayAllBtn = document.querySelector('#display_all_cards_v3');
                if (displayAllBtn) {
                    displayAllBtn.style.display = 'block';
                    displayAllBtn.style.opacity = 1;
                }
            }, 400);
        });
    }
    } catch(e) {
    console.warn('Close button init failed:', e);
    }
    // --- end close button code ---
})




// const text_explication_card = document.querySelector(".text_explication_card")
// const display_all_tracts_div = document.querySelector(".display_all_tracts_div")
// const explication_video = document.querySelector(".explication_video")
// const display_v1_video = document.querySelector(".display_v1_video")
// const display_v2_video = document.querySelector(".display_v2_video")
// const display_v3_video = document.querySelector(".display_v3_video")
// const video_card_v1 = document.querySelector("#video_card_v1")
// const video_card_v2 = document.querySelector("#video_card_v2")
// const video_card_v3 = document.querySelector("#video_card_v3")
// const change_source_video = document.querySelector("#change_source_video")
// const exemple_nfc_tag_card = document.querySelector('.exemple_nfc_tag_card')

// video_card_v3.addEventListener("loadeddata", (event) => {
//     exemple_nfc_tag_card.style.display = 'block'
//     setTimeout(() => {
//         exemple_nfc_tag_card.style.top = '-30vh'
//     }, 900);

//     setTimeout(() => {
//         exemple_nfc_tag_card.style.top = '-70vh'
//         setTimeout(() => {
//             exemple_nfc_tag_card.style.display = 'none'
            
//         }, 600);
//     }, 5000);
// });


// function displayVideoTract(version){
//     const explication_video = document.getElementsByClassName('explication_video')
//     const video_version_id = document.getElementById(`video_card_${version}`)
    
//     Array.from(explication_video).forEach(video => {
//         video.style.opacity = 0
//         setTimeout(() => {
//             video.style.display = 'none'
//         }, 510);
//     });

//     setTimeout(() => {   
//         if(version === 'v3'){
//             video_card_v3.addEventListener("loadeddata", (event) => {
//                 exemple_nfc_tag_card.style.display = 'block'
//                 setTimeout(() => {
//                     exemple_nfc_tag_card.style.top = '-30vh'
//                 }, 900);
            
//                 setTimeout(() => {
//                     exemple_nfc_tag_card.style.top = '-60vh'
//                 }, 5000);
//             });
//         }
        
//         video_version_id.style.display = 'block'
//         video_version_id.style.opacity = '1'
//     }, 560);
// }

// function eventListenerVideo(version){
//     document.querySelector(`.display_${version}_video`).addEventListener('click', () => {
//         displayVideoTract(version);
//     });
// }

// ['v1', 'v2', 'v3'].forEach(version => {eventListenerVideo(version)});


// function setupCardClickHandlers(version) {
//     const div_display_card_main = document.querySelector(`#display_card_${version}`);
//     const show_image_verso_main_div = document.querySelector(`.show_image_verso_main_div_${version}`);
//     const many_cards_display = document.querySelector(`.many_cards_display_${version}`);
//     const cards = document.querySelectorAll(`.card_${version}`);
//     const close_card_viewer = document.querySelector(`.close_card_viewer_${version}`);
//     const explication_cards_text_div = document.querySelector(".explication_cards_text_div")
//     const explication_cards_video_div = document.querySelector(".explication_cards_video_div")

//     div_display_card_main.addEventListener("click", () => {
//         explication_cards_text_div.style.width = "100%"

//         explication_cards_video_div.style.gridArea = "1 / 1 / 4 / 11"
//         explication_cards_video_div.style.width = "94%"
//         explication_cards_video_div.style.margin = "3%"

//         text_explication_card.style.opacity = 0;
//         display_all_tracts_div.style.opacity = 0;

//         display_v1_video.style.opacity = 0;
//         display_v2_video.style.opacity = 0;
//         display_v3_video.style.opacity = 0;

//         video_card_v1.style.opacity = 0;
//         video_card_v2.style.opacity = 0;
//         video_card_v3.style.opacity = 0;

//         video_card_v1.style.display = "none";
//         video_card_v2.style.display = "none";
//         video_card_v3.style.display = "none";

//         close_card_viewer.style.display = "block"

//         setTimeout(() => {
//             text_explication_card.style.display = "none";
//             display_all_tracts_div.style.display = "none";
//             explication_video.style.display = "none";

//             show_image_verso_main_div.style.opacity = 1;
//             show_image_verso_main_div.style.display = "block";

//             many_cards_display.style.display = "block";
            

//             setTimeout(() => {
//                 many_cards_display.style.opacity = 1;

//                 // cards.forEach((card, index) => {
//                 //     const rotationAngle = index * 20;
                    
                    
//                 //     setTimeout(() => {
//                 //         card.style.transform = `rotate(${rotationAngle}deg)`;
//                 //     }, (index - 1) * 200);
//                 // });
//             }, 650);
//         }, 1000);
//     });

//     close_card_viewer.addEventListener("click", () => {
//         show_image_verso_main_div.style.opacity = 0;
//         many_cards_display.style.opacity = 0;

//         setTimeout(() => {
//             show_image_verso_main_div.style.display = "none";
//             many_cards_display.style.display = "none";

//             text_explication_card.style.display = "block";
//             display_all_tracts_div.style.display = "inline-flex";
//             display_all_tracts_div.style.margin = "0 5%";
//             explication_video.style.display = "block";
//             video_card_v2.style.position = "absolute";
//             video_card_v1.style.position = "absolute";
//             display_v2_video.style.opacity = 0;
//             video_card_v1.style.opacity = 0;
//             video_card_v2.style.opacity = 0;
//             video_card_v3.style.opacity = 1;


//             video_card_v3.style.display = "block";
//         }, 500);

//         setTimeout(() => {
//             cards.forEach(card => {
//                 card.style.transform = "rotate(0deg)";
//             });

//             text_explication_card.style.opacity = 1;
//             display_all_tracts_div.style.opacity = 1;
//             display_v1_video.style.opacity = 1;
//             display_v2_video.style.opacity = 1;
//             display_v3_video.style.opacity = 1;
//             video_card_v2.style.opacity = 1;
//         }, 1000);
//     });
// }

// function toggleVideos(showCard, hideCard, showButton, hideButton) {
//     hideCard.style.opacity = 0;
//     showCard.style.opacity = 1;

//     hideButton.style.display = "none";
//     hideButton.style.opacity = "0";

//     showButton.style.display = "block";
//     showButton.style.position = "relative";
//     showButton.style.opacity = "1";
// }

// // display_v1_video.addEventListener('click', () => {
// //     toggleVideos(video_card_v1, video_card_v2, display_v2_video, display_v1_video);
// // });

// // display_v2_video.addEventListener('click', () => {
// //     toggleVideos(video_card_v2, video_card_v1, display_v1_video, display_v2_video);
// // });

// // display_v3_video.addEventListener('click', () => {
// //     toggleVideos(video_card_v3, video_card_v2, display_v2_video, display_v3_video);
// // });

// ['v1', 'v2', 'v3'].forEach(version => setupCardClickHandlers(version));



// console.log("Make with 🍔 by Paul Maréchal")
// console.log("Cards designed by Paloma & Paul, coded in Paris by DevXR")
// console.log("https://devxr.fr")
