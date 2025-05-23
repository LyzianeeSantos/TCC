export function loadServicos() {
  const servicos = document.getElementById('servicos-placeholder')

  fetch('./components/servicos.html')
    .then(response => response.text())
    .then(data => {
      servicos.innerHTML = data
    })
    .catch(error => console.error('Erro ao carregar cards serviços:', error))
}