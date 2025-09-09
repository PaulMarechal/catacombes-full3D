const display_all_cards_v3 = document.getElementById("display_all_cards_v3")

display_card_exemple() 

display_all_cards_v3.addEventListener("click", ()=>{
    const explication_text_cards = document.getElementById("explication_text_cards")
    const explication_video_cards = document.getElementById("explication_video_cards")
    const display_all_tracts = document.getElementById("display_all_tracts")
    const tracts_v3 = document.getElementById("tracts_v3")
 
    try {
        const displayAllBtn = document.querySelector('#display_all_cards_v3');
        const displayAllTracts = document.querySelector('#display_all_tracts');
        const tractsV3 = document.querySelector('#tracts_v3');

        exemple_scan_card.style.top = '-300px'


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
                display_card_exemple() 

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
})

function display_card_exemple(){
    const exemple_scan_card = document.querySelector(".exemple_scan_card")
    setTimeout(() => {
        exemple_scan_card.style.top = '-100px'
    }, 300);
    setTimeout(() => {
        exemple_scan_card.style.top = '-300px'
    }, 5000);
}

console.log("Make with 🍔 by Paul Maréchal")
console.log("Designed and coded in Paris by DevXR")
console.log("https://devxr.fr")
