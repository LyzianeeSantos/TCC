export function loadModalAvaliacao() {
    const Avaliacao = document.getElementById('modal-Avaliacao')
  
    fetch('./components/modals/cadastroAvaliacao.html')
      .then(response => response.text())
      .then(data => {
        Avaliacao.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar modal Avaliacao:', error))
  }