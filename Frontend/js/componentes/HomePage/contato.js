export function loadContato() {
    const contato = document.getElementById('contato-placeholder')
  
    fetch('./components/contato.html')
      .then(response => response.text())
      .then(data => {
        contato.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar contato:', error))
  }