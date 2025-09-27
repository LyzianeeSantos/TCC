// import { showAlert } from '../alert/alert.js'

document.addEventListener('painelCarregado', function () {
  const btnConsultar = document.getElementById('btn-consultar')
  const btnLimpar = document.getElementById('btn-limpar')
  const clientNameInput = document.getElementById('client-name')
  const dateFilterInput = document.getElementById('date-filter')
  const unitInput = document.getElementById('unit')
  const appointmentsTable = document.getElementById('appointments-table')
  const tableContainer = document.getElementById('table-container')
  const loading = document.getElementById('loading')
  const tabs = document.querySelectorAll('.tab')

  let originalAppointments = []
  let originalRows = []

  // ======== Função para buscar agendamentos ========
  async function fetchAppointments() {
    showLoading()
    try {
      const usuarioStorage = localStorage.getItem('usuario')
      const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null
      const token = usuario?.token
      if (!token) throw new Error('Token não encontrado')

      const response = await fetch('http://localhost:3000/agendamentos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Erro ao buscar agendamentos')

      const data = await response.json()
      originalAppointments = data
      console.log('Dados recebidos do backend:', data)
      renderAppointments(data)
    } catch (error) {
      console.error(error)
      appointmentsTable.innerHTML = `<tr><td colspan="6">Erro ao carregar dados.</td></tr>`
    } finally {
      hideLoading()
    }
  }

  // ======== Renderizar tabela ========
  function renderAppointments(appointments) {
    appointmentsTable.innerHTML = ''
    let total = 0

    appointments.forEach(agendamento => {
      const row = document.createElement('tr')

      const dataHoraObj = new Date(agendamento.dataHora)
      const dataFormatada = dataHoraObj.toLocaleDateString('pt-BR')
      const horaFormatada = dataHoraObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      const servicoCompleto = `${agendamento.servico.nome} - ${agendamento.servico.descricao}`
      const preco = agendamento.servico.preco
      const precoFormatado = `R$ ${preco.toFixed(2).replace('.', ',')}`

      total += preco

      row.innerHTML = `
        <td>${agendamento.cliente.nome}</td>
        <td>${servicoCompleto}</td>
        <td>${dataFormatada} ${horaFormatada}</td>
        <td>${agendamento.localizacao}</td>
        <td>${precoFormatado}</td>
        <td>
          <button class="action-btn btn btn-success btn-sm" data-id="${agendamento.id}" data-action="confirm"><i class="bi bi-check"></i></button>
          <button class="action-btn btn btn-danger btn-sm" data-id="${agendamento.id}" data-action="cancel"><i class="bi bi-x"></i></button>
        </td>
      `
      appointmentsTable.appendChild(row)
    })

    // Atualiza total
    const totalBalance = document.getElementById('total-balance')
    if (totalBalance) totalBalance.textContent = `Saldo total: R$ ${total.toFixed(2).replace('.', ',')}`

    // Armazena linhas originais
    originalRows = Array.from(appointmentsTable.querySelectorAll('tr'))
    attachActionButtonListeners()
  }

  // ======== Filtros ========
  function filterAppointments() {
    const clientName = clientNameInput.value.toLowerCase().trim()
    const dateFilter = dateFilterInput.value
    const unit = unitInput.value.toLowerCase().trim()

    let filteredRows = originalRows.filter(row => {
      const rowClientName = row.cells[0].textContent.toLowerCase()
      const rowDate = row.cells[2].textContent
      const rowUnit = row.cells[3].textContent.toLowerCase()

      let matches = true

      if (clientName && !rowClientName.includes(clientName)) matches = false
      if (dateFilter) {
        const filterDate = new Date(dateFilter).toDateString()
        const rowDateOnly = new Date(rowDate.split(' ')[0]).toDateString()
        if (rowDateOnly !== filterDate) matches = false
      }
      if (unit && !rowUnit.includes(unit)) matches = false

      return matches
    })

    appointmentsTable.innerHTML = ''
    filteredRows.forEach(row => appointmentsTable.appendChild(row.cloneNode(true)))
    attachActionButtonListeners()

    if (filteredRows.length === 0) showNoResults()
  }

  function resetTable() {
    appointmentsTable.innerHTML = ''
    originalRows.forEach(row => appointmentsTable.appendChild(row.cloneNode(true)))
    attachActionButtonListeners()
  }

  // ======== Loading e mensagens ========
  function showLoading() {
    loading.classList.remove('hidden')
    tableContainer.style.opacity = '0.5'
  }
  function hideLoading() {
    loading.classList.add('hidden')
    tableContainer.style.opacity = '1'
  }
  function showNoResults() {
    const noResultsRow = document.createElement('tr')
    noResultsRow.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 2rem; color: #99805b;">
        <i class="bi bi-search"></i><br>
        Nenhum agendamento encontrado com os filtros aplicados.
      </td>
    `
    appointmentsTable.appendChild(noResultsRow)
  }

  // ======== Botões de ação ========
  function attachActionButtonListeners() {
    const actionButtons = document.querySelectorAll('.action-btn')
    actionButtons.forEach(button => {
      button.addEventListener('click', async function () {
        const id = this.dataset.id
        const action = this.dataset.action

        if (action === 'confirm') {
          // Aqui você pode chamar PATCH para atualizar status
          alert('Agendamento confirmado!')
        } else if (action === 'cancel') {
          if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            try {
              const usuario = JSON.parse(localStorage.getItem('usuario'))
              const token = usuario?.token
              if (!token) throw new Error('Token não encontrado')

              const response = await fetch(`http://localhost:3000/agendamentos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              })
              if (!response.ok) throw new Error('Erro ao cancelar agendamento')

              this.closest('tr').remove()
              alert('Agendamento cancelado com sucesso!')
            } catch (err) {
              console.error(err)
              showAlert('Erro ao cancelar agendamento', 'error')
            }
          }
        }
      })
    })
  }

  // ======== Tabs ========
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault()
      tabs.forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      filterByTab(tab.dataset.filter)
    })
  })

  function filterByTab(filter) {
    const today = new Date()
    let filteredAppointments = []

    switch (filter) {
      case 'todos':
        filteredAppointments = originalAppointments
        break
      case 'mensal':
        filteredAppointments = originalAppointments.filter(a => {
          const date = new Date(a.dataHora)
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
        })
        break
      case 'semanal':
        filteredAppointments = originalAppointments.filter(a => {
          const date = new Date(a.dataHora)
          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() - today.getDay())
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6)
          return date >= startOfWeek && date <= endOfWeek
        })
        break
      case 'diario':
        filteredAppointments = originalAppointments.filter(a => {
          const date = new Date(a.dataHora)
          return date.toDateString() === today.toDateString()
        })
        break
    }

    renderAppointments(filteredAppointments)
  }

  // ======== Botões filtrar/limpar ========
  btnConsultar.addEventListener('click', function () {
    showLoading()
    setTimeout(() => {
      filterAppointments()
      hideLoading()
    }, 300)
  })
  btnLimpar.addEventListener('click', function () {
    clientNameInput.value = ''
    dateFilterInput.value = ''
    unitInput.value = ''
    resetTable()
  })

  // ======== Inicial ========
  fetchAppointments()
})
