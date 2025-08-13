export function loadFooter() {
    const footer = document.getElementById('footer-placeholder')
  
    fetch('./components/footer.html')
      .then(response => response.text())
      .then(data => {
        footer.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar footer:', error))
  }