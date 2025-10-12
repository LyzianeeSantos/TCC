import { showAlert } from '../alert/alert.js'
import { loadLogin } from '../componentes/login-registro.js'

document.addEventListener('DOMContentLoaded', function () {

  // ---------------------------
  // 📱 Menu Mobile
  // ---------------------------
  const mobileMenuButton = document.querySelector('.mobile-menu-button')
  const closeMenuButton = document.getElementById('close-menu-btn')
  const mobileMenu = document.getElementById('mobile-menu')

  if (mobileMenuButton && mobileMenu && closeMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden')
    })
    closeMenuButton.addEventListener('click', () => {
      mobileMenu.classList.add('hidden')
    })
  }

  // ---------------------------
  // 🗂️ Tabs (abas de conteúdo)
  // ---------------------------
  const tabButtons = document.querySelectorAll('.tab-button')
  const tabPanes = document.querySelectorAll('.tab-pane')

  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', function () {
        const tabId = this.getAttribute('data-tab')
        tabButtons.forEach(btn => btn.classList.remove('active'))
        tabPanes.forEach(pane => pane.classList.remove('active'))
        this.classList.add('active')
        document.getElementById(`${tabId}-content`)?.classList.add('active')
      })
    })
  }

  // ---------------------------
  // 🎁 Seleção de pacotes
  // ---------------------------
  const packageCards = document.querySelectorAll('.package-card[data-package]')
  if (packageCards.length > 0) {
    packageCards.forEach(card => {
      card.addEventListener('click', function () {
        packageCards.forEach(c => c.classList.remove('selected'))
        this.classList.add('selected')
      })
    })
  }

  // ---------------------------
  // 📅 Agendamento / Serviços
  // ---------------------------
  const botoesAgendar = document.querySelectorAll('.book-button, #cta-booking-btn')
  botoesAgendar.forEach(botao => {
    botao.addEventListener('click', (event) => {
      event.preventDefault()

      const usuario = JSON.parse(localStorage.getItem('usuario'))
      if (!usuario || !usuario.token) {
        showAlert('Você precisa estar logado para agendar um serviço.', 'info')
        loadLogin()
        return
      }

      window.location.href = './servicos.html'
    })
  })

  // ---------------------------
  // 🧾 Modal de Agendamento (se existir)
  // ---------------------------
  const bookingModal = document.getElementById('booking-modal')
  const closeModalButton = document.getElementById('close-modal-btn')
  const bookingForm = document.getElementById('booking-form')

  if (bookingModal) {
    const bookingButtons = document.querySelectorAll('.booking-button, .mobile-booking-button, .cta-button')

    bookingButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation()
        bookingModal.classList.remove('hidden')
      })
    })

    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        bookingModal.classList.add('hidden')
      })
    }

    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.add('hidden')
      }
    })

    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = new FormData(bookingForm)
        const bookingData = Object.fromEntries(formData.entries())

        console.log('Dados de agendamento:', bookingData)
        showAlert('Agendamento solicitado! Entraremos em contato para confirmar.', 'success')
        bookingModal.classList.add('hidden')
      })
    }
  }
})
