console.log("Developed by 🍔 by Paul Maréchal")

function display_text_histoire(title_div, text_div){
    const title = document.getElementById(title_div)
    const text = document.getElementById(text_div)

    const main_text_infos_div = document.querySelectorAll("#main_text_infos_div div")

    title.addEventListener("mouseover", ()=>{

        main_text_infos_div.forEach((main_text) => {
            main_text.style.opacity = "0"
            setTimeout(() => {
                main_text.style.display = "none"
            }, 490);
        })

        setTimeout(() => {
            text.style.display = "block"
        }, 500);
        
        setTimeout(() => {
            text.style.opacity = "1"
        }, 510);
    })
}

display_text_histoire("formation_geologique_title", "formation_geologique_div")
display_text_histoire("exploitation_carriere_title", "exploitation_carrieres")
display_text_histoire("techniques_creusement_title", "techniques_creusement")
display_text_histoire("inspection_general_carrieres_title", "inspection_general_carrieres_div")
display_text_histoire("carrieres_en_catacombes_title", "carrieres_en_catacombes_div")
display_text_histoire("geographie_souterraine_titre", "geographie_souterraine_div")
display_text_histoire("cataphile_title", "cataphile_div")

