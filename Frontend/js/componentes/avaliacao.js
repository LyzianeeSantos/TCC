export function loadAvaliacao() {
    const avaliacao = document.getElementById('avaliacao-placeholder')
  
    fetch('./components/avaliacao.html')
      .then(response => response.text())
      .then(data => {
        avaliacao.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar avaliação:', error))
  }