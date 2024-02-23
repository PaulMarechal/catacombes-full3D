var height_window = (window.innerHeight) - 90;

const parent_lost_page = document.querySelector('.parent_lost_page');
const button_return_site = document.querySelector('.button_return_site');

parent_lost_page.style.height = `${height_window}px`

button_return_site.addEventListener('click', () => {
    window.location = "https://catacombes.xyz"
});



