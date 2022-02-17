function changeImg(element, src){
    let imgElement = document.getElementById("bigimg");
    imgElement.src=src;
    let thumb = element.querySelector(".thumbnail");
    thumb.style.visibility = "visible";
}
function hideImg(element){
    let thumb = element.querySelector(".thumbnail");
    thumb.style.visibility = "hidden";
}