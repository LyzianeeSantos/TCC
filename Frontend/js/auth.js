import { showAlert } from './alert/alert.js'

export function atualizarNavbar() {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const btnAgendamento = document.getElementById('btnAgendamento')
    const userMenu = document.getElementById('userMenu')
    const userName = document.getElementById('userName')
    const logoutBtn = document.getElementById('logoutBtn')

    const navAgendamento = document.getElementById('navAgendamento')
    const navAdministrar = document.getElementById('navAdministrar')

    if (!btnAgendamento || !userMenu || !userName || !logoutBtn) {
        // Se a navbar não existe nessa página, não faz nada
        return
    }

    if (usuario) {
        // Mostrar menu usuário e ocultar botão acessar
        btnAgendamento.classList.add('d-none')
        userMenu.classList.remove('d-none')
        userName.textContent = usuario.nome

        // Controle dos links da navbar
        if (usuario.tipo === 'adm') {
            navAgendamento?.classList.remove('d-none')
            navAdministrar?.classList.remove('d-none')
        } else if (usuario.tipo === 'cliente') {
            navAgendamento?.classList.remove('d-none')
            navAdministrar?.classList.add('d-none')
        }
    } else {
        // Usuário não logado
        btnAgendamento.classList.remove('d-none')
        userMenu.classList.add('d-none')
        userName.textContent = ''

        navAgendamento?.classList.add('d-none')
        navAdministrar?.classList.add('d-none')
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
