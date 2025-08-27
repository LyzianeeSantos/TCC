document.addEventListener('DOMContentLoaded', function () {
    const serviceGrid = document.querySelector('.service-grid')
    const tabButtons = document.querySelectorAll('.tab-button')


    function formatarDuracao(minutos) {
        if (!minutos && minutos !== 0) return 'Duração a definir'

        const h = Math.floor(minutos / 60)
        const m = minutos % 60

        if (h > 0 && m > 0) return `${h}h ${m}m`
        if (h > 0) return `${h}h`
        return `${m}m`
    }


    // Carrega os serviços da API
    fetch('http://localhost:3000/servicos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar os serviços')
            }
            return response.json()
        })
        .then(servicos => {
            serviceGrid.innerHTML = '' // Limpa cards anteriores

            servicos.forEach(servico => {
                const cardHTML = `
                <div class="card-container" data-category="${servico.categoria || 'todos'}">
                    <div class="card">
                        <div class="card-front">
                            <h3 class="service-title">${servico.nome}</h3>
                            <p class="service-subtitle">${servico.descricao}</p>
                            <p class="service-duration">${formatarDuracao(servico.duracaoMin) || 'Duração a definir'}</p>
                            <p class="service-price">R$ ${servico.preco.toFixed(2).replace('.', ',')}</p>
                            <button class="book-button">Agendar agora</button>
                        </div>
                        <div class="card-back">
                            <h3 class="service-title">Escolha a loc.</h3>
                            <div class="location-option">
                                <span>Unidade 1</span>
                                <div class="checkbox"></div>
                            </div>
                            <div class="location-option">
                                <span>Unidade 2</span>
                                <div class="checkbox checked">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            </div>
                            <button class="book-button continue-button">Continuar</button>
                            <button class="flip-back-button">Voltar</button>
                        </div>
                    </div>
                </div>
                `
                serviceGrid.insertAdjacentHTML('beforeend', cardHTML)
            })

            // Depois de gerar os cards, ativa as interações:
            ativarInteracoes()
            ativarTooltips()
        })

        .catch(error => {
            console.error('Erro:', error)
        })

    function ativarTooltips() {
        document.querySelectorAll('.location-option').forEach(option => {
            const endereco = option.dataset.endereco

            const tooltip = document.createElement('div')
            tooltip.className = 'location-tooltip'
            tooltip.textContent = endereco

            option.appendChild(tooltip) // adiciona fora do checkbox

            option.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block'
                setTimeout(() => { tooltip.style.opacity = '1' }, 0)
            })
            option.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0'
                setTimeout(() => { tooltip.style.display = 'none' }, 200)
            })
        })
    }

    document.querySelectorAll('.card-back').forEach(cardBack => {
        const locationOptions = cardBack.querySelectorAll('.location-option')

        locationOptions.forEach(option => {
            if (option.textContent.includes('Unidade 1')) {
                option.dataset.endereco = 'Rua Mozart Calheiros, 1600 - Izidro Pedroso'
            } else if (option.textContent.includes('Unidade 2')) {
                option.dataset.endereco = 'Rua Nely Todeschini, 1620 - Santa Maria'
            }
        })
    })



    // Função que ativa as interações (filtros, flip, seleção)
    function ativarInteracoes() {
        const cardContainers = document.querySelectorAll('.card-container')
        const bookButtons = document.querySelectorAll('.card-front .book-button')
        const flipBackButtons = document.querySelectorAll('.flip-back-button')
        const continueButtons = document.querySelectorAll('.continue-button')
        const checkboxes = document.querySelectorAll('.checkbox')

        // Filtro das categorias
        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                tabButtons.forEach(btn => btn.classList.remove('active'))
                this.classList.add('active')
                const category = this.getAttribute('data-category')
                filterServiceCards(category)
                document.querySelectorAll('.card.flipped').forEach(card => {
                    card.classList.remove('flipped')
                })
            })
        })

        // Flip frontal -> trás
        bookButtons.forEach(button => {
            button.addEventListener('click', function () {
                const card = this.closest('.card')
                card.classList.add('flipped')
            })
        })

        // Flip trás -> frontal
        flipBackButtons.forEach(button => {
            button.addEventListener('click', function () {
                const card = this.closest('.card')
                card.classList.remove('flipped')
            })
        })

        // Confirmar agendamento
        continueButtons.forEach(button => {
            button.addEventListener('click', function () {
                const card = this.closest('.card')
                const cardContainer = card.closest('.card-container')

                const serviceName = cardContainer.querySelector('.card-front .service-title').textContent
                const serviceSubtitle = cardContainer.querySelector('.card-front .service-subtitle')?.textContent || ''
                const serviceDuration = cardContainer.querySelector('.card-front .service-duration')?.textContent || ''
                const servicePrice = cardContainer.querySelector('.card-front .service-price')?.textContent || ''

                const serviceText = `${serviceName}${serviceSubtitle ? ' - ' + serviceSubtitle : ''}`


                const selectedLocation = card.querySelector('.checkbox.checked')
                const locationText = selectedLocation ?
                    selectedLocation.closest('.location-option').querySelector('span').textContent :
                    'Unidade 2'

                localStorage.setItem('servicoSelecionado', JSON.stringify({
                    servico: serviceText,
                    duracao: serviceDuration,
                    preco: servicePrice,
                    unidade: locationText
                }))

                window.location.href = 'agendamento.html'
            })
        })


        // Seleção de unidades (checkbox)
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', function () {
                const card = this.closest('.card')
                const cardCheckboxes = card.querySelectorAll('.checkbox')
                cardCheckboxes.forEach(cb => {
                    cb.classList.remove('checked')
                    cb.innerHTML = ''
                })

                this.classList.add('checked')
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `
            })
        })

        // Filtro de categorias
        function filterServiceCards(category) {
            cardContainers.forEach(container => {
                if (category === 'todos' || container.getAttribute('data-category') === category) {
                    container.classList.remove('hidden')
                } else {
                    container.classList.add('hidden')
                }
            })
        }
    }
})
