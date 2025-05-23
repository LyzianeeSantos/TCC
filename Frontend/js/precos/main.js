document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    const packageCards = document.querySelectorAll('.package-card[data-package]');
    
    const bookingButtons = document.querySelectorAll('.book-button, .booking-button, .mobile-booking-button, .cta-button');
    const closeModalButton = document.getElementById('close-modal-btn');
    const bookingModal = document.getElementById('booking-modal');
    const bookingForm = document.getElementById('booking-form');
    
    // Toggle Menu Mobile
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.remove('hidden');
        });
    }
    
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    }
    
    // Tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remover classe active de todos os botões e painéis
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Adicionar classe active ao botão e painel clicados
            this.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // Seleção de pacotes
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            const packageId = this.getAttribute('data-package');
            
            // Toggle da classe selected
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
            } else {
                // Remover selected de todos os cards
                packageCards.forEach(c => c.classList.remove('selected'));
                // Adicionar selected ao card clicado
                this.classList.add('selected');
            }
        });
    });
    
    // Modal de agendamento
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar propagação para o card
            bookingModal.classList.remove('hidden');
        });
    });
    
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            bookingModal.classList.add('hidden');
        });
    }
    
    // Fechar modal ao clicar fora
    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            bookingModal.classList.add('hidden');
        }
    });
    
    // Envio do formulário
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(this);
            const bookingData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                date: formData.get('date'),
                time: formData.get('time')
            };
            
            // Aqui você implementaria a lógica para enviar os dados para um servidor
            console.log('Dados de agendamento:', bookingData);
            
            // Exibir mensagem de sucesso
            alert('Agendamento solicitado! Entraremos em contato para confirmar.');
            
            // Fechar o modal
            bookingModal.classList.add('hidden');
        });
    }
});