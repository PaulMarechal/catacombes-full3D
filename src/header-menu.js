const template = document.createElement('template');
template.innerHTML = `
    <style>
        #main_title_catacombes {
            /* position: fixed; */
            /* top: 8px; */
            /* left: 50px; */
            z-index: 6;
            font-size: 2rem;
            font-weight: 900;
            text-transform: uppercase;
            user-select: none;
            color: #fff;
        }
        a {
            text-decoration: none;
        }
        h1, h2, h3, a {
            font-family: 'Bebas Neue', cursive;
            font-weight: 300 !important;
        }
        #main_title_catacombes span {
            text-transform: none;
            opacity: .8;
            font-weight: 300;
            color: #ffffff;
            font-size: 1.75rem;
            letter-spacing: 0.65px;
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: #020304;
        }
        #title_main_page{
            margin: 0;
            line-height: 24px;
            top: 20px;
            position: fixed;
            left: 20px;
        }

        #links_header_menu{
            position: fixed; 
            top: 15px;
            width: 40%;
            left: 30%;

            padding: 10px 14px;
            border-radius: 20px;

            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            background: linear-gradient(180deg, rgb(255 255 255 / 50%) 0%, rgb(199 199 199 / 0%) 100%);
        }

        #links_header_menu a{
            color: #fff;
            font-size: 1.2vw;
            user-select: none;
            transition: font-size .5s ease-out;
        }
        #links_header_menu a:hover{
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            background: linear-gradient(180deg, rgb(191 191 191 / 50%) 0%, rgb(255 255 255 / 0%) 100%);
            font-size: 1.35vw;
        }
        * {
            margin: 0;
            padding: 0;
            cursor: none !important;
        }
        .parent_header_menu {
            display: grid;
            z-index:999;
            grid-template-columns: repeat(11, 1fr) 0.5fr;
            grid-template-rows: 1fr;
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            position: fixed;
            top: -1px;
            padding: 6px 10px;
            width: 100%;

            background: rgba( 255, 255, 255, 0);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 0px;
            box-shadow: 0 0 12px 4px rgb(0 0 0 / 21%);
            // border: 0.5px solid rgba(255, 255, 255, 0.3);
            user-select: none;
            left: 0; 
        }
        .logo_div_header_menu { 
            grid-area: 1 / 1 / 2 / 3;
            padding: 4px 10px 0 10px;
        }
        .salles_div_header_menu { grid-area: 1 / 5 / 2 / 6;  margin: auto;}
        .histoire_div_header_menu { grid-area: 1 / 6 / 2 / 7;margin: auto;}
        .images_div_header_menu { grid-area: 1 / 7 / 2 / 8; margin: auto;}
        .plan_div_header_menu { grid-area: 1 / 8 / 2 / 9; margin: auto;}
        .tracts_div_header_menu {grid-area: 1 / 9 / 2 / 10; margin: auto;}

        .language_button_header_menu_div { grid-area: 1 / 12 / 2 / 13; }

        .link_style_header_menu{
            font-size: 25px;
            color: #fff;
            margin: auto;
            transition: font-size .5s ease-out, color .5s ease-out;
        }

        .display_infos_menu{
            width: 600px;
            height: 400px;
            position: fixed;
            background: rgba(255, 255, 255, 0);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            user-select: none;
            top: -405px;
            z-index: 99;
            opacity: 0; 
            opacity: 0;
            left: 50%;
            top: -405px;
            transform: translate(-50%, -50%);
            z-index: 999;
            transition: top .8s ease-out, opacity 1s ease-out;
        }

        #salles_infos_div, #histoire_infos_div, 
        #images_infos_div, #plan_infos_div, 
        #cartes_infos_div{
            display: none;
            opacity: 0; 
            width: 100%;
            transition: opacity .5s ease-out;
        }

        #salles_infos_div div, #histoire_infos_div div, 
        #images_infos_div div, #plan_infos_div div,
        #cartes_infos_div div {
            flex: 1; 
            width: 290px;
            height: 380px;
            margin: 5px;
            border-radius: 10px;
            background: rgb(171 171 171 / 33%);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 5px 8px;
        }
    </style>
    <div class="parent_header_menu">
        <div class="logo_div_header_menu">
            <a href="/" class="link_style_header_menu" title="Retourner sur la homepage">
                <h1 id="main_title_catacombes" title="Catacombes Interdites">Catacombes <span>  UNOFFICIAL</span></h1>
            </a>
        </div>
        <div class="salles_div_header_menu">
            <a href="../displayRooms/" class="link_style_header_menu" title="Affiche l'ensemble des salles des catacombes et leurs infos">Salles</a>
        </div>
        <div class="histoire_div_header_menu">
            <a href="../Histoire/" class="link_style_header_menu" title="Aller vers la page Photos des catacombes">Histoire</a>
        </div>
        <div class="images_div_header_menu">
            <a href="../Images/" class="link_style_header_menu" title="Aller vers la page Photos des catacombes">Images</a>
        </div>
        <div class="plan_div_header_menu">
            <a href="../Map/" class="link_style_header_menu" title="Affiche les salles des catacombes sur une carte">Plan</a>
        </div>
        <div class="tracts_div_header_menu">
            <a href="../Cards/" class="link_style_header_menu" title="Aller vers la page qui affiche les tracts en realite virtuelle des catacombes interdites">Cartes</a>
        </div>
        <div class="language_button_header_menu_div">
        </div>
    </div>

    <div class="display_infos_menu">
        <div class="infos_to_display_div" id="salles_infos_div">
            <div>
                <p>Découvrez les salles des catacombes avec leur histoire, un plan de niveau et la salle visible en 3D.</p>
            </div>
            <div>
                Image de la page 
            </div>
        </div>
        <div class="infos_to_display_div" id="histoire_infos_div">
            <div>
                <p>Découvrez l'histoire des carrières de Paris a travers leurs histoire d'hier et d'aujourd'hui.</p>
            </div>
            <div>
                Image de la page 
            </div>
        </div>
        <div class="infos_to_display_div" id="images_infos_div">
            <div>
                <p>Découvrez des images des catacombes interdites de Paris mais aussi d'anciennes carrières en France ou ailleurs. </p>
            </div>
            <div>
                Images des carrieres 
            </div>
        </div>
        <div class="infos_to_display_div" id="plan_infos_div">
            <div>
                <p>Découvrez les l'emplacement des salles emblématiques des catacombes interdites dans Paris</p>
            </div>
            <div>
                Image du plan de paris
            </div>
        </div>
        <div class="infos_to_display_div" id="cartes_infos_div">
            <div>
                <p>Découvrez les tracts des catacombes de la V1 à la V3 avec leurs puces NFC a collectionner</p>
            </div>
            <div>
                Image des tracts
            </div>
        </div>
    </div>
`;

class HeaderMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const shadow = this.shadowRoot;

        const show = (selectorLink, selectorInfo) => {
            const link = shadow.querySelector(selectorLink);
            const infos = shadow.querySelectorAll('.infos_to_display_div');
            const menu  = shadow.querySelector('.display_infos_menu');
            const target = shadow.querySelector(selectorInfo);

            link.addEventListener('mouseover', () => {
                infos.forEach(div => {
                div.style.opacity = '0';
                setTimeout(() => div.style.display = 'none', 510);
                });
                menu.style.top = '260px';
                menu.style.opacity = '1';
                setTimeout(() => {
                target.style.display = 'inline-flex';
                setTimeout(() => target.style.opacity = '1', 20);
                }, 520);
            });

            menu.addEventListener('mouseleave', () => {
                menu.style.opacity = '0';
                menu.style.top     = '-405px';
                target.style.display = 'none';
            });
        };

        show('.salles_div_header_menu',  '#salles_infos_div');
        show('.histoire_div_header_menu','#histoire_infos_div');
        show('.images_div_header_menu', '#images_infos_div');
        show('.plan_div_header_menu',   '#plan_infos_div');
        show('.tracts_div_header_menu', '#cartes_infos_div');
    }
}

customElements.define('header-menu', HeaderMenu);
