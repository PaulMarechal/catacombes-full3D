const burger_checkbox = document.querySelector("#burger")
const nav_menu_display = document.querySelector(".nav_menu_display");
const iconeBurgerMenu = document.querySelector(".iconeBurgerMenu")
const nav = document.querySelector("nav");

export function customCursor(){
    document.addEventListener("DOMContentLoaded", function(event) {
        if(document.querySelector(".custom-cursor")){
            var cursor = document.querySelector(".custom-cursor");
        } else  {
            var div = document.createElement("div");
            div.classList.add("custom-cursor")
            div.setAttribute("id", "cursor")
            document.querySelector("body").appendChild(div)
            var cursor = document.querySelector(".custom-cursor");
        }

        const links = document.querySelectorAll("a");
        const labelElem = document.querySelectorAll("label");
        const arrowLeft = document.getElementsByClassName("icon-tabler-chevron-left"); 
        const arrowRight = document.getElementsByClassName("icon-tabler-chevron-right");
        const closeButton = document.getElementsByClassName("icon-tabler-square-rounded-x");
        const div_display_card_main = document.getElementsByClassName("div_display_card_main")
        const close_card_viewer = document.getElementsByClassName("close_card_viewer_v1");
        const close_card_viewer_v2 = document.getElementsByClassName("close_card_viewer_v2");
        const close_card_viewer_v3 = document.getElementsByClassName("close_card_viewer_v3");
        const display_v1_video = document.getElementsByClassName("display_v1_video")
        const display_v2_video = document.getElementsByClassName("display_v2_video")
        const display_infos_button = document.getElementsByClassName("display_infos_button");
        const display_all_rooms_button = document.getElementsByClassName("display_all_rooms_button");
        const button_return_site = document.getElementsByClassName("button_return_site");

        var body = document.getElementById("body");
        var initCursor = false;

        const linksHover = [ 
            links, labelElem, 
            arrowLeft, arrowRight, 
            closeButton, div_display_card_main, 
            close_card_viewer, close_card_viewer_v2, 
            display_v2_video, close_card_viewer_v3, 
            display_v1_video, display_infos_button, 
            display_all_rooms_button, button_return_site 
        ]

        for (var i = 0; i < linksHover.length; i++) {
            var list = linksHover[i];

            for (var j = 0; j < list.length; j++) {
                var selfLink = list[j];
                // console.log(selfLink)
                if (!selfLink.classList.contains("webXRDontWork")){
                    selfLink.addEventListener("mouseover", function() {
                        cursor.classList.add("custom-cursor--link");
                    });
                    selfLink.addEventListener("mouseout", function() {
                        cursor.classList.remove("custom-cursor--link");
                    });
                } 
            }
        }
      
        window.onmousemove = function(e) {
            var mouseX = e.clientX;
            var mouseY = e.clientY;
      
            if (!initCursor) {
                TweenLite.to(cursor, 0.2, {
                    opacity: 1, 
                    display: "block",
                });

                initCursor = true;
            }
      
            TweenLite.to(cursor, 0, {
                top: mouseY + "px",
                left: mouseX + "px"
            });
        };
      
        window.onmouseout = function(e) {
            TweenLite.to(cursor, 0.3, {
                opacity: 0, 
                display: "none"
            });
            initCursor = false;
            if(nav_menu_display){
                nav_menu_display.style.display = "block";
            }

        };
    });
}

window.addEventListener("click", () => {
    setTimeout(() => {
        if( nav.offsetHeight > 50){
            if(nav_menu_display){
                nav_menu_display.style.display = "block";
            }
            iconeBurgerMenu.style.display = "inline-flex";
        } 
    }, 200);

    setTimeout(() => {  
        if( nav.offsetHeight < 51){
            if(nav_menu_display){
                nav_menu_display.style.display = "none";
            }
            iconeBurgerMenu.style.display = "none";
        } 
    }, 1250);
});






customCursor()