const template = document.createElement('template');
template.innerHTML = `
    <style>
        #mobile_menu, #desktop_menu{
            display: none; 
        }

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

        #main_title_catacombes span {
            text-transform: none;
            opacity: .8;
            font-weight: 300;
            color: #ffffff;
            font-size: 1.75rem;
            letter-spacing: 0.65px;
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: #dbdbdb;
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
            grid-template-columns: repeat(2, 0.9fr) repeat(5, 0.7fr ) repeat(4, 1fr) repeat(2, 0.6fr) 0.1fr;
            grid-template-rows: 1fr;
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            position: fixed;
            top: -1px;
            // padding: 6px 10px;
            width: 100%;

            background: rgb(37 37 37 / 50%);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 0px;
            box-shadow: 0 0 12px -1px rgb(0 0 0 / 21%);
            // border: 0.5px solid rgba(255, 255, 255, 0.3);
            user-select: none;
            left: 0; 
            border: 1px solid #ffffff;
        }

        .div_logo_box{
            grid-area:1 / 1 / 2 / 3;
            border-right: 1px solid #fff!important;
        }
        .logo_div_header_menu { 
            grid-area: 1 / 1 / 2 / 3;
            // padding: 4px 10px 0 10px;
            padding: 6px 10px;
            z-index:2;
        }
        .salles_div_header_menu { grid-area: 1 / 3 / 2 / 4;  }
        .histoire_div_header_menu { grid-area: 1 / 4 / 2 / 5;}
        .images_div_header_menu { grid-area: 1 / 5 / 2 / 6; }
        .plan_div_header_menu { grid-area: 1 / 6 / 2 / 7; }
        .tracts_div_header_menu {grid-area: 1 / 7 / 2 / 8; }
        .partager_div_header_menu {grid-area: 1 / 12 / 2 / 13; }
        .contact_div_header_menu {grid-area: 1 / 13 / 2 / 14; }
        .language_div_header_menu {grid-area: 1 / 14 / 2 / 15; }

        .display_center{
            display: flex;
            justify-content: center; 
            align-items: center;
        }

        .language_button_header_menu_div { grid-area: 1 / 12 / 2 / 13; }

        .link_style_header_menu{
            font-family: 'Alumni Sans Pinstripe', sans-serif;
            font-size: 25px;
            color: #fff;
            margin: auto;
            transition: font-size .5s ease-out, color .5s ease-out;
        }

        .display_infos_menu{
            width: 600px;
            height: 215px;
            position: fixed;
            background: rgba(255, 255, 255, 0);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid #fff;
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

        .parent_header_menu > div {
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
            background: rgb(71 71 71 / 0%);
            transition: background 0.5s ease-out, border .5s ease-out;
            padding: 8px 12px;
            border-right: 1px solid transparent;
            border-left: 1px solid transparent;

            background: transparent;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
        }


        .parent_header_menu > div:hover {
            background-color: rgba(255, 255, 255, 0.3);
            border-right: 1px solid  #ffffff;
            border-left: 1px solid  #ffffff;
        }

        .display_links_page{
            position: fixed;
            text-orientation: mixed;
            z-index: 1;
            padding: 0px 4.5px;
            border-radius: 10px 0 0 10px;
            text-transform: uppercase;
            opacity: 1;
            -moz-user-select: none; 
            -webkit-user-select: none;
            -ms-user-select: none; 
            user-select: none; 
            width: fit-content;;
            width: 590px;
            height: 185px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            grid-column-gap: 6px;
            grid-row-gap: 6px;
            transition: 0.8s right ease-out, 0.7s opacity ease-out;
        }

        .div_facebook_share_links { grid-area: 1 / 1 / 2 / 2; }
        .div_twitter_share_links { grid-area: 1 / 2 / 2 / 3; }
        .div_sms_ios_share_link { grid-area: 2 / 1 / 3 / 2; }
        .div_whatsapp_share_link { grid-area: 2 / 2 / 3 / 3; }

        .display_links_page div a {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 70px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            background: rgb(142 142 142 / 30%);
            border: 1px solid #fff; 
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            margin: auto; 
            position: relative;
            overflow: hidden;
            color: #fff; 
            transition: transform 0.2s ease, box-shadow 0.2s ease, background .5s ease-out;
        }

        .display_links_page div a svg{
            position: absolute;
            top: -5px;
            left: -7px;
            background: #ffffff50;
            padding: 10px;
            border-radius: 0 25px 30px 25px;
            border: 1px solid #fff; 
            transition: padding .5s ease-out, border .5s ease-out;
        }

        .display_links_page div a svg:hover{
            padding: 5px; 
            border: 1px solid #000; 
        }

        .div_facebook_share_links, .div_twitter_share_links, 
        .div_sms_ios_share_link, .div_whatsapp_share_link{
            padding: 6px 0;
            color: #000000!important;
            flex: 1;
            margin: auto;
            text-align: center;
        }

        .display_links_page > div {
            border-radius: 12px;
            padding: 8px;
            width: 94%;
            transition: background-color 0.3s ease;
        }

        /* Facebook */
        .icon-tabler-brand-facebook:hover{
            border-radius: 0 20px 30px 20px;
            stroke: #000;
            fill: #000;
            background: #b09c69; 
            stroke-width: 0.2px;
        }

        .div_facebook_share_links:has(a:hover) a {
            background-color: #3b599850;
        }

        /* Twitter / X */
        .icon-tabler-brand-x:hover{
            border-radius: 0 20px 30px 20px;
            stroke: #fff; 
            background: #000;
        }

        .div_twitter_share_links:has(a:hover) a {
            background-color: #00000050;
        }

        /* SMS iMessage */
        .icon-tabler-message-circle-2:hover{
            border-radius: 0 20px 30px 20px; 
            background: #a30d8d; 
            stroke: #000; 
            stroke-width: 0.2px;
            fill: #000;
        }

        .div_sms_ios_share_link:has(a:hover) a {
            background-color: #00c80050; 
        }

        /* WhatsApp */
        .icon-tabler-brand-whatsapp:hover{
            border-radius: 0 20px 30px 20px; 
            background: #f350e8!important;
        }

        .div_whatsapp_share_link:has(a:hover) a {
            background-color: #25d36650; 
        }

        #mobile_menu{
            position: relative;
            z-index: 2; 
            display: block;
            z-index: 2;
            position: absolute;
            top: 0;
            width: -webkit-fill-available;
            left: 0;
            background: rgb(37 37 37 / 50%);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 0px;
            box-shadow: 0 0 12px -1px rgb(0 0 0 / 21%);
            // border: 0.5px solid rgba(255, 255, 255, 0.3);
            user-select: none;
            left: 0; 
            padding: 10px 15px;
            // border: 1px solid #ffffff;
        }

        #logo_div_header_menu_mobile{
            position: absolute; 
            top: 4px; 
            left: 4px;
        }

        #burger_menu_mobile{
            position: absolute;
            top: 10px;
            right: 14px;
        }

        #display_div_menu_mobile{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0;
            display: none;
            background: rgb(86 86 86 / 50%);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            // background: #fff; 
            z-index: 1000; 
            padding: 70px 20px; 
        }

        #close_mobile_menu{
            position: absolute;
            top: 0;
            right: 40px;
            border-bottom: 1px solid #000;
            border-left: 1px solid #000;
            padding: 7px;
            background: #fff; 
        }

        #div_link_mobile_menu {
            height: 70%;
            width: 70%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(4, 1fr);
            grid-gap: 1vw;
            margin: auto; 
        }

        #div_link_mobile_menu a, #div_link_mobile_menu p{
            color: #333; 
            font-size: 3vw;
            background: #fff; 
        }

        .elem_menu_mobile {
            display: flex;               
            justify-content: center;    
            align-items: center;         
            border: 1px solid #000;
            text-align: center;           
        }

        .homepage_mobile_menu { grid-area: 1 / 1 / 2 / 2; }
        .display_rooms_mobile_menu { grid-area: 1 / 2 / 2 / 3; }
        .histoire_mobile_menu { grid-area: 2 / 1 / 3 / 2; }
        .image_mobile_menu { grid-area: 2 / 2 / 3 / 3; }
        .map_mobile_menu { grid-area: 3 / 1 / 4 / 2; }
        .cards_mobile_menu { grid-area: 3 / 2 / 4 / 3; }
        .share_mobile_menu { grid-area: 4 / 1 / 5 / 3; }
    </style>

    <!-- Desktop menu -->
    <div id="desktop_menu" class="parent_header_menu">
        <div class="logo_div_header_menu">
            <a href="/" class="link_style_header_menu" title="Retourner sur la homepage">
                <h1 id="main_title_catacombes" title="Catacombes Interdites"><b>Catacombes</b> <span>  INTERDITES</span></h1>
            </a>
        </div>
        <div class="div_logo_box"></div>
        <div class="salles_div_header_menu display_center">
            <a href="../displayRooms/" class="link_style_header_menu" title="Affiche l'ensemble des salles des catacombes et leurs infos">Salles</a>
        </div>
        <div class="histoire_div_header_menu display_center">
            <a href="../Histoire/" class="link_style_header_menu" title="Aller vers la page Photos des catacombes">Histoire</a>
        </div>
        <div class="images_div_header_menu display_center">
            <a href="../Images/" class="link_style_header_menu" title="Aller vers la page Photos des catacombes">Images</a>
        </div>
        <div class="plan_div_header_menu display_center">
            <a href="../Map/" class="link_style_header_menu" title="Affiche les salles des catacombes sur une carte">Plan</a>
        </div>
        <div class="tracts_div_header_menu display_center">
            <a href="../Cards/" class="link_style_header_menu" title="Aller vers la page qui affiche les tracts en realite virtuelle des catacombes interdites">Cartes</a>
        </div>
        <div class="partager_div_header_menu display_center">
            <p class="link_style_header_menu" title="Partager cette page sur differentes plateformes">Partager</p>
        </div>
        <div class="contact_div_header_menu display_center">
            <p class="link_style_header_menu" title="N'hésitez pas à me contacter">Contact</p>
        </div>
        <!--
        <div class="language_div_header_menu display_center">
            <label id="language_site" title="Changer la langue du site Catacombes Interdites en Anglais">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#fff"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-language"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5h7" /><path d="M9 3v2c0 4.418 -2.239 8 -5 8" /><path d="M5 9c0 2.144 2.952 3.908 6.7 4" /><path d="M12 20l4 -9l4 9" /><path d="M19.1 18h-6.2" /></svg>
            </label>
        </div>
        -->
    </div>

    <div id="mobile_menu">
        <div class="logo_div_header_menu_mobile">
            <a href="/" class="link_style_header_menu" title="Retourner sur la homepage">
                <h1 id="main_title_catacombes" title="Catacombes Interdites"><b>Catacombes</b> <span>  INTERDITES</span></h1>
            </a>
        </div>
        <div id="burger_menu_mobile">
            <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="#fff"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
        </div>
    </div>

    <!-- Mobile menu -->
    <div id="display_div_menu_mobile">
        <svg id="close_mobile_menu" xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        
        <div id="div_link_mobile_menu">
            <a href="/" class="homepage_mobile_menu elem_menu_mobile" title="Retourner sur la homepage">Home</a>

            <a href="../displayRooms/" class="display_rooms_mobile_menu elem_menu_mobile" title="Affiche l'ensemble des salles des catacombes et leurs infos">Salles</a>

            <a href="../Histoire/" class="histoire_mobile_menu elem_menu_mobile" title="Aller vers la page Photos des catacombes">Histoire</a>

            <a href="../Images/" class="image_mobile_menu elem_menu_mobile" title="Aller vers la page Photos des catacombes">Images</a>

            <a href="../Map/" class="map_mobile_menu elem_menu_mobile" title="Affiche les salles des catacombes sur une carte">Plan</a>

            <a href="../Cards/" class="cards_mobile_menu elem_menu_mobile" title="Aller vers la page qui affiche les tracts en realite virtuelle des catacombes interdites">Cartes</a>

            <p class="share_mobile_menu elem_menu_mobile" title="Partager cette page sur differentes plateformes">Partager</p>

            <!--
            <p class="" title="N'hésitez pas à me contacter">Contact</p>
            -->
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
        <div class="infos_to_display_div" id="partager_infos_div">
            <div class="display_links_page">
                <div class="div_facebook_share_links" title="Partager sur FaceBook">
                    <!-- Bouton de partage Facebook -->
                    <a href="https://www.facebook.com/sharer/sharer.php?u=https://catacombes.xyz/Soleil/3D" class="link_facebook" target="_blank" rel="noopener noreferrer" data-action="share/facebook/share" title="Partager sur Facebook">
                        <svg class="icon icon-tabler icon-tabler-brand-facebook" width="35" height="35" viewBox="0 0 24 24" stroke-width=".5" stroke="#FFF" fill="#c5c5c5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
                        <p>Facebook</p>
                    </a>
                </div>

                <div class="div_twitter_share_links" title="Partager sur Twitter | X">
                    <!-- Bouton de partage Twitter / X -->
                    <a href="https://twitter.com/intent/tweet?url=https://catacombes.xyz&text=Visite%20les%20catacombes%20interdites%20depuis%20ton%20salon%20en%203D%20/%20AR%20/%20VR%20:" class="link_twitter" target="_blank" rel="noopener noreferrer" data-action="share/twitter-x/share" title="Partager sur Twitter | X">
                        <svg class="icon icon-tabler icon-tabler-brand-x" width="35" height="35" viewBox="0 0 24 24" stroke-width=".5" stroke="#FFF" fill="#c5c5c5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                        <p>X</p>
                        </a>
                </div>

                <div class="div_sms_ios_share_link" title="Partager par SMS">
                    <!-- Bouton de partage via SMS IOS-->
                    <a href="sms:&body=Visite%20les%20catacombes%20interdites%20depuis%20ton%20salon%20en%203D%20/%20AR%20/%20VR%20:%0Ahttps://catacombes.xyz" class="link_message_ios" target="_blank" rel="noopener noreferrer" data-action="share/sms/share" title="Partager par SMS">
                        <svg class="icon icon-tabler icon-tabler-message-circle-2" width="35" height="35" viewBox="0 0 24 24" stroke-width=".5" stroke="#FFF" fill="#c5c5c5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" /></svg>
                        <p>SMS</p>
                    </a>
                </div>

                <div class="div_whatsapp_share_link" title="Partager sur WhatsApp">
                    <!-- Bouton de partage via WhatsApp-->
                    <a href="https://api.whatsapp.com/send?text=Visite%20les%20catacombes%20interdites%20depuis%20ton%20salon%20en%203D%20/%20AR%20/%20VR%20:%20https://catacombes.xyz" target="_blank" rel="noopener noreferrer" title="Partager avec WhatsApp">
                        <svg class="icon icon-tabler icon-tabler-brand-whatsapp" width="35" height="35" viewBox="0 0 24 24" stroke-width=".5" stroke="#FFF" fill="#c5c5c5" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                            <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
                        </svg>
                        <p>WhatsApp</p>
                    </a>
                </div>

                <!-- AJouter copy link  -->
            </div>
        </div>
    </div>
`;

class HeaderMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
        this._onResize = null;
    }

    connectedCallback() {
        const shadow = this.shadowRoot;

        const show = (selectorLink, selectorInfo) => {
            const link = shadow.querySelector(selectorLink);
            const infos = shadow.querySelectorAll('.infos_to_display_div');
            const menu  = shadow.querySelector('.display_infos_menu');
            const target = shadow.querySelector(selectorInfo);

            link.addEventListener('click', () => {
                infos.forEach(div => {
                    div.style.opacity = '0';
                    setTimeout(() => div.style.display = 'none', 510);
                });
                menu.style.top = '175px';
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

        // show('.salles_div_header_menu',  '#salles_infos_div');
        // show('.histoire_div_header_menu','#histoire_infos_div');
        // show('.images_div_header_menu', '#images_infos_div');
        // show('.plan_div_header_menu',   '#plan_infos_div');
        // show('.tracts_div_header_menu', '#cartes_infos_div');
        show('.partager_div_header_menu', '#partager_infos_div');

        function display_all_room_div(shadow){
            const partager_div_header_menu = shadow.querySelector(".partager_div_header_menu");
            const display_infos_menu       = shadow.querySelector(".display_infos_menu");

            // Éléments dans le DOCUMENT (light DOM, hors composant)
            const display_all_rooms_small   = document.querySelector(".display_all_rooms_small"); 
            const display_all_rooms_button  = document.querySelector(".display_all_rooms_button");
            const display_infos_button      = document.querySelector(".display_infos_button");
            const div_infos_catacombes      = document.querySelector(".div_infos_catacombes");
            const display_links_page        = document.querySelector(".display_links_page");
            // const text_fr                   = document.querySelector(".text_fr");
            // const text_en                   = document.querySelector(".text_en");

            // if (!partager_div_header_menu) {
            //     console.warn('[header-menu] .partager_div_header_menu introuvable dans le shadow');
            // }
            // if (!display_links_page) {
            //     console.warn('[header-menu] .display_links_page introuvable dans le document');
            // }

            let timeoutId;

            if (display_all_rooms_button && display_all_rooms_small) {
                display_all_rooms_button.addEventListener("click", () => {
                    display_all_rooms_small.style.right = "10px"; 
                    display_all_rooms_small.style.opacity = "1";

                    display_all_rooms_button.style.right = "-40px";
                    display_all_rooms_button.style.opacity = "0";

                    display_all_rooms_small.addEventListener("mouseleave", () => {
                        timeoutId = setTimeout(() => {
                            display_all_rooms_small.style.right = "-180px";
                            display_all_rooms_small.style.opacity = "0";
                            display_all_rooms_button.style.right = "0px";
                            display_all_rooms_button.style.opacity = "1";
                        }, 4000);
                    }, { once: true });
                });
            }

            if (partager_div_header_menu && display_links_page) {
                partager_div_header_menu.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    display_links_page.style.right = "0px";

                    display_links_page.addEventListener("mouseleave", () => {
                        setTimeout(() => {
                            display_links_page.style.right = "-50px";
                        }, 2500);
                    }, { once: true });
                });
            }
        }
        
        display_all_room_div(shadow);

        const isMobileUA = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        const menuMobile  = shadow.querySelector('#mobile_menu');
        const menuDesktop = shadow.querySelector('#desktop_menu');
        const display_div_menu_mobile = shadow.getElementById('display_div_menu_mobile');
        const burger_menu_mobile = shadow.getElementById('burger_menu_mobile');
        const close_mobile_menu = shadow.getElementById('close_mobile_menu')

        const setMenu = () => {
            const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
            const mobile = isSmallScreen || isMobileUA();

            if (mobile) {
                if (menuMobile)  menuMobile.style.display  = 'block';
                if (menuDesktop) menuDesktop.style.display = 'none';
            } else {
                if (menuMobile)  menuMobile.style.display  = 'none';
                if (menuDesktop) menuDesktop.style.display = 'grid'; 
            }
        };

        burger_menu_mobile.addEventListener("click", ()=>{
            display_div_menu_mobile.style.display = "block";

            close_mobile_menu.addEventListener("click", ()=>{
                display_div_menu_mobile.style.display = "none";
            })
        })

        // première exécution
        setMenu();

        // réagir aux changements de taille
        this._onResize = setMenu;
        window.addEventListener('resize', this._onResize);

    } 
    disconnectedCallback() {
        if (this._onResize) {
            window.removeEventListener('resize', this._onResize);
            this._onResize = null;
        }
    }
}

customElements.define('header-menu', HeaderMenu);
