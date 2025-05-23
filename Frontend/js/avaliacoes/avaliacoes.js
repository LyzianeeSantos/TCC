export function loadCarrosel() {
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault()

                const targetId = this.getAttribute('href')
                const targetElement = document.querySelector(targetId)

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for header
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Testimonial Carousel
        initTestimonialCarousel()
    })

    function initTestimonialCarousel() {
        const testimonialCards = document.querySelectorAll('.testimonial-card')
        const dots = document.querySelectorAll('.testimonial-dots .dot')
        let currentSlide = 0
        let slideInterval

        function showSlide(index) {
            testimonialCards.forEach(card => {
                card.classList.remove('active')
            });

            dots.forEach(dot => {
                dot.classList.remove('active')
            });

            testimonialCards[index].classList.add('active')
            dots[index].classList.add('active')

            currentSlide = index
        }

        function nextSlide() {
            let nextIndex = currentSlide + 1
            if (nextIndex >= testimonialCards.length) {
                nextIndex = 0
            }
            showSlide(nextIndex)
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval)
                showSlide(index)
                startAutoSlide()
            });
        });

        function startAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval)
            }

            slideInterval = setInterval(() => {
                nextSlide()
            }, 5000)
        }

        showSlide(0)
        startAutoSlide()

        const carousel = document.querySelector('.testimonial-carousel')
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                startAutoSlide()
            })
        }
    }

}