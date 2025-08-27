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

  export function loadServicoAdm() {
    const admServico = document.getElementById('container-admServico')
  
    fetch('./components/PainelAdm/servicosAdm.html')
      .then(response => response.text())
      .then(data => {
        admServico.innerHTML = data

        document.dispatchEvent(new Event('servicosCarregado'))
      })
      .catch(error => console.error('Erro ao carregar painel de servicos administrador:', error))
  }