const nav_menu_display = document.querySelector(".nav_menu_display");
const nav = document.querySelector("nav");

export function customCursor() {
    document.addEventListener("DOMContentLoaded", () => {
        let cursor = document.querySelector(".custom-cursor");

        if (!cursor) {
            const div = document.createElement("div");
            div.classList.add("custom-cursor");
            div.id = "cursor";
            document.body.appendChild(div);
            cursor = document.querySelector(".custom-cursor");
        }
        
        if (!cursor) return;

        let initCursor = false;

        const HOVER_SELECTOR = [
            "a",
            "label",
            ".icon-tabler-chevron-left",
            ".icon-tabler-chevron-right",
            ".icon-tabler-square-rounded-x",
            ".div_display_card_main",
            ".close_card_viewer_v1",
            ".close_card_viewer_v2",
            ".close_card_viewer_v3",
            ".display_v1_video",
            ".display_v2_video",
            ".display_infos_button",
            ".display_all_rooms_button",
            ".button_return_site",
            ".div_sms_ios_share_link",
            ".div_twitter_share_links",
            ".div_facebook_share_links",
            ".div_whatsapp_share_link",
            ".partager_div_header_menu", 
            ".contact_div_header_menu"
        ].join(",");

        function isInteractiveFromEvent(evt) {
            const path = evt.composedPath ? evt.composedPath() : [evt.target];
            for (const el of path) {
                if (
                    el &&
                    el.nodeType === 1 &&
                    el.matches?.(HOVER_SELECTOR) &&
                    !el.classList?.contains("webXRDontWork")
                ) {
                    return true;
                }
            }
            return false;
        }

        window.addEventListener("pointermove", (e) => {
        if (!initCursor) {
            TweenLite.to(cursor, 0.1, { opacity: 1, display: "block" });
            initCursor = true;
        }
        TweenLite.to(cursor, 0, { top: e.clientY + "px", left: e.clientX + "px" });

        const hoveringInteractive = isInteractiveFromEvent(e);
        cursor.classList.toggle("custom-cursor--link", hoveringInteractive);
        }, { passive: true });

        window.addEventListener("mouseout", () => {
            TweenLite.to(cursor, 0.4, { opacity: 0, display: "none" });
            initCursor = false;
            if (nav_menu_display) nav_menu_display.style.display = "block";
        });
    });
}

customCursor();