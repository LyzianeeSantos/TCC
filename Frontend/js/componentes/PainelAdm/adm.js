document.addEventListener('DOMContentLoaded', function () {
  const btnConsultar = document.getElementById('btn-consultar')
  const btnLimpar = document.getElementById('btn-limpar')
  const clientNameInput = document.getElementById('client-name')
  const dateFilterInput = document.getElementById('date-filter')
  const unitInput = document.getElementById('unit')
  const appointmentsTable = document.getElementById('appointments-table')
  const tableContainer = document.getElementById('table-container')
  const loading = document.getElementById('loading')
  const tabs = document.querySelectorAll('.tab')

  let originalRows = []

  // Buscar dados reais do backend
  async function fetchAppointments() {
    showLoading()
    try {
      const token = localStorage.getItem('token') || 'SEU_TOKEN_AQUI'
      const response = await fetch('http://localhost:3000/agendamentos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Erro ao buscar agendamentos')
      const data = await response.json()
      renderAppointments(data)
      console.log('passando aqui', data)
    } catch (error) {
      console.error(error)
      appointmentsTable.innerHTML = `<tr><td colspan="6">Erro ao carregar dados.</td></tr>`
    } finally {
      hideLoading()
    }
  }



  // Montar tabela
  function renderAppointments(appointments) {
    appointmentsTable.innerHTML = ''
    let total = 0

    appointments.forEach(agendamento => {
      const row = document.createElement('tr')

      const dataFormatada = new Date(agendamento.data).toLocaleDateString('pt-BR')
      const horaFormatada = agendamento.hora
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
          <button class="action-btn btn btn-success btn-sm"><i class="bi bi-check"></i></button>
          <button class="action-btn btn btn-danger btn-sm"><i class="bi bi-x"></i></button>
        </td>
      `

      appointmentsTable.appendChild(row)
    })

    // Atualiza total saldo
    const totalBalance = document.getElementById('total-balance')
    if (totalBalance) totalBalance.textContent = `Saldo total: R$ ${total.toFixed(2).replace('.', ',')}`

    // Atualiza lista original para filtros
    originalRows = Array.from(appointmentsTable.querySelectorAll('tr'))
    attachActionButtonListeners()
  }

  // Filtros continuam funcionando como antes
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
        const filterDate = new Date(dateFilter).toLocaleDateString('pt-BR')
        const rowDateOnly = rowDate.split(' ')[0] // só a parte da data na célula
        if (rowDateOnly !== filterDate) matches = false
      }
      if (unit && !rowUnit.includes(unit)) matches = false

      return matches
    })

    appointmentsTable.innerHTML = ''
    filteredRows.forEach(row => {
      appointmentsTable.appendChild(row.cloneNode(true))
    })

    attachActionButtonListeners()

    if (filteredRows.length === 0) {
      showNoResults()
    }
  }

  function resetTable() {
    appointmentsTable.innerHTML = ''
    originalRows.forEach(row => {
      appointmentsTable.appendChild(row.cloneNode(true))
    })
    attachActionButtonListeners()
  }

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

  function attachActionButtonListeners() {
    const actionButtons = document.querySelectorAll('.action-btn')
    actionButtons.forEach(button => {
      button.addEventListener('click', function () {
        const isConfirm = this.querySelector('.bi-check')
        const isCancel = this.querySelector('.bi-x')

        if (isConfirm) {
          alert('Agendamento confirmado!')
        } else if (isCancel) {
          if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            alert('Agendamento cancelado!')
            this.closest('tr').remove()
          }
        }
      })
    })
  }

  // Botões ativados
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

  // Busca inicial no carregamento da página
  fetchAppointments()
})
