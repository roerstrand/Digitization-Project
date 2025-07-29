let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("gallery");
    let dots = document.getElementsByClassName("indicator");

    // Abort if no slides
    if (!slides || slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Remove 'active' from all dots (only if dots exist)
    if (dots && dots.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
    }

    // Show current slide
    slides[slideIndex - 1].style.display = "block";

    // Add 'active' to corresponding dot
    if (dots && dots.length >= slideIndex) {
        dots[slideIndex - 1].classList.add("active");
    }
}

// Dark mode toggle (fallback for id or legacy toggle)
const toggle = document.getElementById('darkmode-toggle') || document.getElementById('darkToggle');
if (toggle) {
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}
