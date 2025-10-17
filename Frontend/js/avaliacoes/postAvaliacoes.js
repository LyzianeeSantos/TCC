import { showAlert } from '../alert/alert.js'

let modalInicializado = false

function inicializarModalAvaliacao() {

  if (modalInicializado) return true

  const modal = document.getElementById("modalAvaliacao")
  const btnAbrir = document.getElementById("abrirModalBtn")

  if (!modal || !btnAbrir) return false

  const btnFechar = modal.querySelector(".fechar")
  if (!btnFechar) return false

  const form = document.getElementById("formAvaliacao")
  if (!form) return false

  // Abre o modal
  btnAbrir.addEventListener("click", () => modal.style.display = "block")
  btnFechar.addEventListener("click", () => modal.style.display = "none")
  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none"
  })

  form.addEventListener("submit", async (e) => {
    e.preventDefault() // evita reload

    const usuario = JSON.parse(localStorage.getItem("usuario"))
    const token = usuario?.token
    if (!token) {
      showAlert("⚠️ Você precisa estar logado", 'warning')
      return
    }

    const usuarioId = usuario.id
    const nota = document.getElementById("estrelas").value
    const comentario = document.getElementById("comentario").value

    try {
      const resposta = await fetch("http://localhost:3000/avaliacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ usuarioId, nota: parseInt(nota), comentario })
      })

      const data = await resposta.json()
      if (!resposta.ok) throw new Error(data.error || "Erro ao enviar avaliação")

      showAlert("Avaliação enviada com sucesso!", 'success')
      form.reset()
      modal.style.display = "none"
    } catch (erro) {
      console.error("Erro ao enviar avaliação:", erro)
      showAlert("Não foi possível enviar a avaliação", 'error')
    }
  })

  modalInicializado = true
  return true
}

document.addEventListener("DOMContentLoaded", () => {

  const tentativa = setInterval(() => {
    if (inicializarModalAvaliacao()) {
      clearInterval(tentativa)
    }
  }, 500)
})