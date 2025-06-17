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
                  showAlert('✅ Login realizado com sucesso!', 'success')
                  modal.classList.remove('show')
                  flipCard.classList.remove('show-back')
                  
                } else {
                  showAlert('❌ Email ou senha incorretos.', 'danger')
                }
              } catch (err) {
                console.error(err)
                showAlert('❌ Erro ao tentar logar. Tente novamente mais tarde.', 'danger')
              }
            })

            // 📌 CADASTRO
            const formCadastro = modal.querySelector('#formCadastro')
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

function showAlert(message, type = 'success', timeout = 3000) {
  const alertContainer = document.getElementById('alert-container')

  const wrapper = document.createElement('div')
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `

  alertContainer.append(wrapper)

  // Remove automaticamente depois do timeout
  setTimeout(() => {
      const alert = bootstrap.Alert.getOrCreateInstance(wrapper.querySelector('.alert'))
      alert.close()
  }, timeout)
}