export function loadFooterSecundario() {
    const footerSecundario = document.getElementById('footer-secundario')
  
    fetch('./components/footer2.html')
      .then(response => response.text())
      .then(data => {
        footerSecundario.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar footer2:', error))
  }