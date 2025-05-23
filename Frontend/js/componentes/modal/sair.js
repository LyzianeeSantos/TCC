export function loadSair() {
    const sair = document.getElementById('modal-sair')
  
    fetch('./components/modals/sair')
      .then(response => response.text())
      .then(data => {
        sair.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar modal sair:', error))
  }