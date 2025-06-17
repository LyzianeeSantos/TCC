import { showAlert } from './alert/alert.js'

export function atualizarNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const btnAgendamento = document.getElementById('btnAgendamento')
    const userMenu = document.getElementById('userMenu')
    const userName = document.getElementById('userName')
    const logoutBtn = document.getElementById('logoutBtn')

    if (!btnAgendamento || !userMenu || !userName || !logoutBtn) {
        // Se a navbar não existe nessa página, não faz nada
        return
    }

    if (usuario) {
        btnAgendamento.classList.add('d-none')
        userMenu.classList.remove('d-none')
        userName.textContent = usuario.nome
    } else {
        btnAgendamento.classList.remove('d-none')
        userMenu.classList.add('d-none')
        userName.textContent = ''
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('usuario')
        atualizarNavbar()
        showAlert('🚪 Logout realizado com sucesso.', 'info')

        setTimeout(() => {
            window.location.href = '/index.html'
          }, 1500)
    })
}
