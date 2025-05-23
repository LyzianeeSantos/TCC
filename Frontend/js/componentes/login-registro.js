export function loadLogin() {
    // Função para aguardar um elemento aparecer no DOM
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Timeout para evitar espera infinita
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Aguardar o botão aparecer no DOM
    waitForElement('#btnAgendamento')
        .then(btnAgendamento => {
            const loginContainer = document.getElementById('loginContainer');
            
            if (!loginContainer) {
                console.error('Login container not found');
                return;
            }

            btnAgendamento.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Se o modal já existe
                const existingModal = document.getElementById('loginModal');
                if (existingModal) {
                    existingModal.classList.add('show');
                    return;
                }
                
                // Carregar o HTML do modal
                fetch('/components/login-registro.html')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        loginContainer.innerHTML = html;
                        
                        const modal = document.getElementById('loginModal');
                        const flipCard = document.getElementById('flipCard');
                        const showRegister = document.getElementById('showRegister');
                        const showLogin = document.getElementById('showLogin');
                        const closeButtons = modal.querySelectorAll('.close');
                        
                        if (!modal || !flipCard || !showRegister || !showLogin) {
                            console.error('One or more required elements not found in the loaded HTML');
                            return;
                        }
                        
                        modal.classList.add('show');
                        
                        showRegister.addEventListener('click', e => {
                            e.preventDefault();
                            flipCard.classList.add('show-back');
                        });
                        
                        showLogin.addEventListener('click', e => {
                            e.preventDefault();
                            flipCard.classList.remove('show-back');
                        });
                        
                        closeButtons.forEach(btn => {
                            btn.addEventListener('click', () => {
                                modal.classList.remove('show');
                                flipCard.classList.remove('show-back');
                            });
                        });
                        
                        // Fechar modal ao clicar fora
                        window.addEventListener('click', function(event) {
                            if (event.target === modal) {
                                modal.classList.remove('show');
                                flipCard.classList.remove('show-back');
                            }
                        });
                    })
                    .catch(error => {
                        console.error('Error loading login:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Error waiting for login button:', error);
        });
}