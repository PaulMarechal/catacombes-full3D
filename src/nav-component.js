const template = document.createElement('template');
template.innerHTML = `
<div class="top_menu">
  <div>
    <h1 title="Catacombes Interdites">Catacombes <span>  INTERDITES</span></h1>
  </div>

  <div>
    <li><a class="linkBurger" href="../Images/" title="Aller vers la page Photos des catacombes">Images</a></li>
    <li><a class="linkBurger" href="../Map/" title="Affiche les salles des catacombes sur une carte">Plan</a></li>
    <li><a class="linkBurger" href="../displayRooms/" title="Affiche l'ensemble des salles des catacombes et leurs infos">Salles</a></li>
    <li><a class="linkBurger" href="../Cards/" title="Aller vers la page qui affiche les tracts en realite virtuelle des catacombes interdites">Cartes</a></li>
  </div>
</div>

<label for="burger">
       
    </label>
    <label id="language_site" title="Changer la langue du site Catacombes Interdites en Anglais">FR</label>


    <input id="burger" type="checkbox" />

    <label for="burger" title="menu du site">
        <span></span>
        <span></span>
        <span></span>
    </label>

    <nav>    
        <ul class="nav_menu_display">

            <li class="iconeBurgerMenu">
                <!-- Git -->
                <!--
                <a href="https://github.com/PaulMarechal" target="_blank" id="iconeGit">
                    <svg class="icon icon-tabler icon-tabler-brand-github" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                    </svg>
                </a>
                -->

                <!-- Instagram -->
                <a href="https://www.instagram.com/v_ktas/?hl=fr" target="_blank" id="instagramVIcon" title="Aller sur l'Insta de -V-" aria-label="Aller sur l'Insta de -V-">
                    <svg class="icon icon-tabler icon-tabler-brand-instagram" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"></path>
                        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        <path d="M16.5 7.5l0 .01"></path>
                    </svg>
                </a>

                <!-- Site -->
                <a href="https://devxr.fr" target="_blank" id="iconeSite" title="Aller sur le side de DevXR.fr" aria-label="Aller sur le side de DevXR.fr">
                    <svg class="icon icon-tabler icon-tabler-world-www" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4"></path>
                        <path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4"></path>
                        <path d="M12.5 3a16.989 16.989 0 0 1 1.828 4"></path>
                        <path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4"></path>
                        <path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4"></path>
                        <path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4"></path>
                        <path d="M2 10l1 4l1.5 -4l1.5 4l1 -4"></path>
                        <path d="M17 10l1 4l1.5 -4l1.5 4l1 -4"></path>
                        <path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4"></path>
                    </svg>
                </a>

                <!-- Mail -->
                <a href="mailto:contact@paulmarechal.xyz" id="iconeMail" title="Pour me contacter par mail" aria-label="Pour me contacter par mail">
                    <svg class="icon icon-tabler icon-tabler-mail" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                        <path d="M3 7l9 6l9 -6"></path>
                    </svg>
                </a>

                <!-- LinkedIn -->
                <a href="https://www.linkedin.com/in/paul-marechal/" target="_blank" id="iconeLinkedin" title="Pour me contacter par LinkedIn" aria-label="Pour me contacter par LinkedIn">
                    <svg class="icon icon-tabler icon-tabler-brand-linkedin" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M8 11l0 5"></path>
                        <path d="M8 8l0 .01"></path>
                        <path d="M12 16l0 -5"></path>
                        <path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
                    </svg>
                </a>
            </li>
        </ul>  
    </nav>

`;

class NavBar extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('top-menu', NavBar);
