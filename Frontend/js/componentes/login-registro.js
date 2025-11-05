import { showAlert } from '../alert/alert.js'
import { atualizarNavbar } from '../auth.js'
import { parseJwt } from '../global/token/extraiId.js'
import { mascaraTelefoneDigita } from '../mascara/telefone.js'

export function loadLogin() {
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector)
        if (element) {
          obs.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Element ${selector} not found within ${timeout}ms`))
      }, timeout)
    })
  }

  waitForElement('#btnAgendamento')
    .then(btnAgendamento => {
      const loginContainer = document.getElementById('loginContainer')

      if (!loginContainer) {
        console.error('Login container not found')
        return
      }

      btnAgendamento.addEventListener('click', function (e) {
        e.preventDefault()

        const existingModal = document.getElementById('loginModal')
        if (existingModal) {
          existingModal.classList.add('show')
          return
        }

        fetch('/components/login-registro.html')
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            return response.text()
          })
          .then(html => {
            loginContainer.innerHTML = html

            const modal = document.getElementById('loginModal')
            const flipCard = document.getElementById('flipCard')
            const showRegister = document.getElementById('showRegister')
            const showLogin = document.getElementById('showLogin')
            const closeButtons = modal.querySelectorAll('.close')

            modal.classList.add('show')

            showRegister?.addEventListener('click', e => {
              e.preventDefault()
              flipCard.classList.add('show-back')
            })

            showLogin?.addEventListener('click', e => {
              e.preventDefault()
              flipCard.classList.remove('show-back')
            })

            closeButtons.forEach(btn => {
              btn.addEventListener('click', () => {
                modal.classList.remove('show')
                flipCard.classList.remove('show-back')
              })
            })

            window.addEventListener('click', function (event) {
              if (event.target === modal) {
                modal.classList.remove('show')
                flipCard.classList.remove('show-back')
              }
            })

            const formLogin = modal.querySelector('#formLogin')
            formLogin?.addEventListener('submit', async e => {
              e.preventDefault()

              const email = modal.querySelector('#email').value
              const senha = modal.querySelector('#senha').value

              try {
                const res = await fetch('http://localhost:3000/usuarios/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, senha })
                })

                const data = await res.json()

                if (res.ok) {
                  const payload = parseJwt(data.token);
                  showAlert('✅ Login realizado com sucesso!', 'success')

                  // Salvar dados no localStorage
                  localStorage.setItem('usuario', JSON.stringify({
                    id: payload.id,
                    nome: data.nome,
                    tipo: payload.tipo,
                    token: data.token
                  }))

                  // Atualiza a navbar
                  atualizarNavbar()

                  modal.classList.remove('show')
                  flipCard.classList.remove('show-back')

                  setTimeout(() => {
                    window.location.href = '/servicos.html'
                  }, 1500)

                } else {
                  showAlert('❌ Email ou senha incorretos.', 'danger')
                }
              } catch (err) {
                console.error(err)
                showAlert('❌ Erro ao tentar logar. Tente novamente mais tarde.', 'danger')
              }
            })

            const formCadastro = modal.querySelector('#formCadastro')

            const inputCelular = modal.querySelector('#celular')
            if (inputCelular) {
              inputCelular.addEventListener('input', e => {
                e.target.value = mascaraTelefoneDigita(e.target.value)
              })
            }

            formCadastro?.addEventListener('submit', async e => {
              e.preventDefault()

              const nome = modal.querySelector('#nome').value
              const email = modal.querySelector('#cad-email').value
              const telefone = modal.querySelector('#celular').value
              const senha = modal.querySelector('#cad-senha').value

              try {
                const res = await fetch('http://localhost:3000/usuarios/registrar', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nome, email, telefone, senha })
                })

                const data = await res.json()

                if (res.ok) {
                  showAlert('✅ Cadastro realizado com sucesso! Faça seu login.', 'success')
                  flipCard.classList.remove('show-back')
                } else {
                  showAlert(`❌ Erro ao cadastrar:\n${data.mensagem || 'Verifique os dados preenchidos.'}`, 'warning')
                }
              } catch (err) {
                console.error(err)
                showAlert('❌ Erro ao tentar cadastrar. Tente novamente mais tarde.', 'danger')
              }
            })

            const forgotLink = modal.querySelector('.forgot')
            const forgotModal = document.getElementById('forgotModal')

            if (forgotLink && forgotModal) {
              const forgotClose = forgotModal.querySelector('.close')

              forgotLink.addEventListener('click', e => {
                e.preventDefault()
                modal.classList.remove('show')
                forgotModal.classList.add('show')
              })

              forgotClose.addEventListener('click', () => {
                forgotModal.classList.remove('show')
              })

              const formForgot = forgotModal.querySelector('#formForgot')
              formForgot.addEventListener('submit', async e => {
                e.preventDefault()
                const email = document.getElementById('forgotEmail').value

                try {
                  const res = await fetch('http://localhost:3000/usuarios/recuperar-senha', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                  })

                  const data = await res.json()
                  if (res.ok) {
                    showAlert('📨 Um e-mail de recuperação foi enviado!', 'success')
                    forgotModal.classList.remove('show')
                  } else {
                    showAlert(`⚠️ ${data.error || 'Erro ao enviar e-mail.'}`, 'warning')
                  }
                } catch (err) {
                  console.error(err)
                  showAlert('❌ Erro ao processar solicitação.', 'danger')
                }
              })
            }

          })
          .catch(error => {
            console.error('Error loading login:', error)
          })
      })
    })
    .catch(error => {
      console.error('Error waiting for login button:', error)
    })
}