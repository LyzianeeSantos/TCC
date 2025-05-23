export function loadAddServico() {
    const addServico = document.getElementById('modal-addServico')
  
    fetch('./components/modals/addServico')
      .then(response => response.text())
      .then(data => {
        addServico.innerHTML = data
      })
      .catch(error => console.error('Erro ao carregar modal serviços:', error))
  }