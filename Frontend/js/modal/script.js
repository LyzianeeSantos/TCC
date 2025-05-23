// Funções para mostrar os modais
function showResumoModal() {
    const modal = document.getElementById('resumoModal');
    modal.classList.add('show');
}

function showServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.add('show');
}

function showExitModal() {
    const modal = document.getElementById('exitModal');
    modal.classList.add('show');
}

// Funções para esconder os modais
function hideResumoModal() {
    const modal = document.getElementById('resumoModal');
    modal.classList.remove('show');
}

function hideServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('show');
}

function hideExitModal() {
    const modal = document.getElementById('exitModal');
    modal.classList.remove('show');
}

// Função para esconder todos os modais
function hideAllModals() {
    hideResumoModal();
    hideServiceModal();
    hideExitModal();
}

// Event listeners para funcionalidades adicionais
document.addEventListener('DOMContentLoaded', function() {
    
    // Fechar modal clicando fora dele
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAllModals();
        }
    });

    // Funcionalidade do botão "Adicionar serviço"
    const addServiceBtn = document.querySelector('.add-service-btn');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', function() {
            hideResumoModal();
            showServiceModal();
        });
    }

    // Funcionalidade do botão "Voltar"
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            hideServiceModal();
            showResumoModal();
        });
    }

    // Funcionalidade dos itens de serviço
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('click', function() {
            // Aqui você pode adicionar a lógica para selecionar o serviço
            console.log('Serviço selecionado:', item.querySelector('.service-name').textContent);
        });
    });

    // Funcionalidade do botão "Agendar"
    const scheduleBtn = document.querySelector('.schedule-btn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function() {
            // Aqui você pode adicionar a lógica para finalizar o agendamento
            console.log('Agendamento realizado!');
            hideAllModals();
        });
    }

    // Funcionalidade dos botões do modal de saída
    const exitBtn = document.querySelector('.exit-btn');
    const continueBtn = document.querySelector('.continue-btn');
    
    if (exitBtn) {
        exitBtn.addEventListener('click', function() {
            // Aqui você pode adicionar a lógica para sair
            console.log('Usuário saiu sem agendar');
            hideAllModals();
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            hideExitModal();
            showResumoModal();
        });
    }

    // Funcionalidade de busca
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const serviceItems = document.querySelectorAll('.service-item');
            
            serviceItems.forEach(item => {
                const serviceName = item.querySelector('.service-name').textContent.toLowerCase();
                if (serviceName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

// Funções utilitárias adicionais
function addServiceToBooking(serviceName, price) {
    // Função para adicionar serviço ao agendamento
    console.log(`Adicionando serviço: ${serviceName} - ${price}`);
}

function removeServiceFromBooking(serviceName) {
    // Função para remover serviço do agendamento
    console.log(`Removendo serviço: ${serviceName}`);
}

function updateBookingSummary() {
    // Função para atualizar o resumo do agendamento
    console.log('Atualizando resumo do agendamento');
}

// Exportar funções para uso global
window.showResumoModal = showResumoModal;
window.showServiceModal = showServiceModal;
window.showExitModal = showExitModal;
window.hideResumoModal = hideResumoModal;
window.hideServiceModal = hideServiceModal;
window.hideExitModal = hideExitModal;
window.hideAllModals = hideAllModals;