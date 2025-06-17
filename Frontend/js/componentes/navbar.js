export function loadNavbar() {
  const navbar = document.getElementById('navbar-placeholder')

  return fetch('./components/navbar.html')
    .then(response => response.text())
    .then(data => {
      navbar.innerHTML = data
    })
    .catch(error => console.error('Erro ao carregar navbar:', error))
}

