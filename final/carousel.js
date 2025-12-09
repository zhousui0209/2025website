document.addEventListener('DOMContentLoaded', () => {

    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.hero-control.prev');
    const nextBtn = document.querySelector('.hero-control.next');

    let index = 0;

    function updateSlide(i) {
        slides.forEach((slide, n) => {
            slide.classList.toggle('active', n === i);
        });
        indicators.forEach((dot, n) => {
            dot.classList.toggle('active', n === i);
        });
    }

    nextBtn.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        updateSlide(index);
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlide(index);
    });

    indicators.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            index = i;
            updateSlide(i);
        });
    });

    // 自動輪播
    setInterval(() => {
        index = (index + 1) % slides.length;
        updateSlide(index);
    }, 5000);

});
