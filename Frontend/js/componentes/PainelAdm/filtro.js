export function loadAdm() {
    const adm = document.getElementById('container-adm')
  
    fetch('./components/PainelAdm/painel.html')
      .then(response => response.text())
      .then(data => {
        adm.innerHTML = data

        document.dispatchEvent(new Event('painelCarregado'))
      })
      .catch(error => console.error('Erro ao carregar painel administrador:', error))
  }