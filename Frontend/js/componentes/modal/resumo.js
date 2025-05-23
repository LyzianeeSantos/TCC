export function loadResumo() {
    const resumo = document.getElementById('modal-resumo')
  
    fetch('./components/modals/resumo')
      .then(response => response.text())
      .then(data => {
        resumo.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar modal resumo:', error))
  }