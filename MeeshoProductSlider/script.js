
function slide(direction){
    let viewPort = document.querySelector('.view-port');
    let cardWidth = document.querySelector(".card").offsetWidth + 8;

    if(direction == 'next'){
        viewPort.scrollBy({left : cardWidth, behavior : 'smooth'})
    }else{
        viewPort.scrollBy({left: -cardWidth, behavior: 'smooth'})
    }
}