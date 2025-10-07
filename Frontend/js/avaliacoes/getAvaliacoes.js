
document.addEventListener('DOMContentLoaded', async function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()
            const targetId = this.getAttribute('href')
            const targetElement = document.querySelector(targetId)
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                })
            }
        })
    })

    const avaliacoes = await fetchAvaliacoes()
    if (avaliacoes.length > 0) {
        initTestimonialCarousel(avaliacoes.slice(-3))
    }
})

async function fetchAvaliacoes() {
    try {
        const res = await fetch('http://localhost:3000/avaliacoes')
        const data = await res.json()
        return data
    } catch (err) {
        console.error('Erro ao buscar avaliações:', err)
        return []
    }
}

function initTestimonialCarousel(avaliacoes) {
    const carouselContainer = document.querySelector('.testimonial-carousel')
    if (!carouselContainer) return

    carouselContainer.innerHTML = ''

    const dotsContainer = document.createElement('div')
    dotsContainer.classList.add('testimonial-dots')

    avaliacoes.forEach((avaliacao, index) => {
        const card = document.createElement('div')
        card.classList.add('testimonial-card')
        if (index === 0) card.classList.add('active')

        card.innerHTML = `
        <h4 class="testimonial-name">${avaliacao.usuario.nome}</h4>
        <p class="testimonial-text">"${avaliacao.comentario}"</p>
      `
        carouselContainer.appendChild(card)

        const dot = document.createElement('div')
        dot.classList.add('dot')
        if (index === 0) dot.classList.add('active')
        dot.dataset.slide = index
        dotsContainer.appendChild(dot)
    })

    carouselContainer.appendChild(dotsContainer)

    const testimonialCards = carouselContainer.querySelectorAll('.testimonial-card')
    const dots = carouselContainer.querySelectorAll('.dot')
    let currentSlide = 0
    let slideInterval

    function showSlide(index) {
        testimonialCards.forEach(card => card.classList.remove('active'))
        dots.forEach(dot => dot.classList.remove('active'))
        testimonialCards[index].classList.add('active')
        dots[index].classList.add('active')
        currentSlide = index
    }

    function nextSlide() {
        let nextIndex = currentSlide + 1
        if (nextIndex >= testimonialCards.length) nextIndex = 0
        showSlide(nextIndex)
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval)
            showSlide(index)
            startAutoSlide()
        })
    })

    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval)
        slideInterval = setInterval(nextSlide, 5000)
    }

    showSlide(0)
    startAutoSlide()

    carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval))
    carouselContainer.addEventListener('mouseleave', startAutoSlide)
}
