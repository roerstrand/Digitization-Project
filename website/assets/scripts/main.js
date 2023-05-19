let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("gallery");
    let dots = document.getElementsByClassName("indicator");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

function displayIframe1() {
    document.getElementById("iframeDisplay").innerHTML = "<iframe src=\"../collection/metadata_images/metadata_baltictower.xml\" height=\"200\" width=\"300\"> xslt=\"../website/assets/xsl/baltictower.xsl\"></iframe>";
}

function displayIframe2() {
    document.getElementById("iframeDisplay").innerHTML = "<iframe src=\"../collection/metadata_images/metadata_danishexhibitionbuilding.xml\" height=\"200\" width=\"300\"> xslt=\"../website/assets/xsl/danishbuilding.xsl\"></iframe>";

}

function displayIframe3() {
    document.getElementById("iframeDisplay").innerHTML = "<iframe src=\"../collection/metadata_images/metadata_germanexhibitionbuilding.xml\" height=\"200\" width=\"300\"> xslt=\"../website/assets/xsl/germanbuilding.xsl\"></iframe>";

}