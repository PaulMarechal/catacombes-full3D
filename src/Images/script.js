const divs = document.querySelectorAll('.marginPageimages');
const arrow = document.querySelector('.arrow');
const body = document.querySelector('body');
const arrowLeft = document.querySelector('.icon-tabler-chevron-left');
const arrowRight = document.querySelector('.icon-tabler-chevron-right');
const imageOnClick = document.querySelector('.imageOnClick')
const closeButton = document.querySelector(".icon-tabler-square-rounded-x")
let imageDiv = document.querySelector(".parentTextExplications");

const heightImg = `${window.innerHeight - 90}px`
imageDiv.style.height = heightImg

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.addEventListener("resize", function() {
        window.location.reload();
    });
}
        
function displayImageOnClick(){
    divs.forEach(div => {
        div.addEventListener('click', () => {

            const imageNumber = parseInt(div.classList[0].slice(5));
            var click = imageNumber
            imageOnClick.style.transition = "opacity 0.3s ease-out";
            arrow.style.transition = "opacity 0.3s ease-out";
            imageOnClick.style.opacity = "0";
            arrow.style.opacity = "0";

            arrow.style.display = "block";
            body.style.background = "rgb(106, 106, 106)";
            imageOnClick.classList.add(`image${imageNumber}`);
            imageOnClick.style.display = "block";
            closeButton.style.display = "block";
            arrowLeft.style.display = "block";
            arrowRight.style.display = "block";

            setTimeout(function(){
                imageOnClick.style.opacity = "1";
                arrow.style.opacity = "1"; 
            }, 100);

            // Click on left arrow
            arrowLeft.addEventListener('click', () => {
                click -= 1 
                var imageNumber = parseInt(div.classList[0].slice(5))
                                      
                var imageNumberDiv = imageNumber + click
              
                if(imageNumberDiv <= 1){
                    click = 23
                }
              
                imageOnClick.classList.remove(imageOnClick.classList[1]) 
                imageOnClick.classList.add(`image${imageNumberDiv}`)

                imageOnClick.style.transition = "transform 0.5s";
                closeButton.style.transition = "transform 0.5s";

                imageOnClick.style.transform = "translateX(-2%)";
                closeButton.style.transform = "translateX(-49%)";
                setTimeout(() => {
                    imageOnClick.style.transform = "translateX(0)";
                    closeButton.style.transform = "translateX(0)";
                }, 500);
            });

            // Click on right arrow
            arrowRight.addEventListener('click', () => {
                click += 1 
                var imageNumber = parseInt(div.classList[0].slice(5))
                var imageNumberDiv = imageNumber + click
              
                if(imageNumberDiv >= 24){
                    click = 0
                    imageNumberDiv = 1
                }
              
                imageOnClick.classList.remove(imageOnClick.classList[1]) 
                imageOnClick.classList.add(`image${imageNumberDiv}`)
              
                imageOnClick.style.transition = "transform 0.5s";
                closeButton.style.transition = "transform 0.5s";

                imageOnClick.style.transform = "translateX(2%)";
                closeButton.style.transform = "translateX(49%)";

                setTimeout(() => {
                    imageOnClick.style.transform = "translateX(0)";
                    closeButton.style.transform = "translateX(0)";
                }, 500);
            });

            closeButton.addEventListener("click", function(event){
                body.style.background = "rgb(231 231 231)"; 
                
                imageOnClick.style.transition = "opacity .5s ease-out";
                arrow.style.transition = "opacity .5s ease-out";
                imageOnClick.style.opacity = "0";
                arrow.style.opacity = "0"; 
                
                setTimeout(function(){
                    imageOnClick.style.display = "none";
                    arrow.style.diplay = "none"; 
                    closeButton.style.display = "none"
                    arrowLeft.style.display = "none"
                    arrowRight.style.display = "none"
                    imageOnClick.className = "imageOnClick";
                }, 500)
            })
        });
    });
}

displayImageOnClick()
        