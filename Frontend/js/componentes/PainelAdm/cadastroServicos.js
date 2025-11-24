import { showAlert } from '../../alert/alert.js'

document.addEventListener('servicosCarregado', () => {

  const newServiceBtn = document.getElementById('newServiceBtn')
  const serviceModal = document.getElementById('serviceModal')
  const confirmModal = document.getElementById('confirmModal')
  const closeModalBtn = document.getElementById('closeModal') // <- renomeado
  const cancelBtn = document.getElementById('cancelBtn')
  const serviceForm = document.getElementById('serviceForm')
  const modalTitle = document.getElementById('modalTitle')
  const servicesTableBody = document.getElementById('servicesTableBody')
  const servicesCount = document.getElementById('servicesCount')
  const emptyState = document.getElementById('emptyState')
  const servicesTable = document.getElementById('servicesTable')
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn')
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn')

  let editingServiceId = null
  let serviceToDelete = null

  async function fetchServices() {
    const res = await fetch('http://localhost:3000/servicos')
    return res.json()
  }

  async function renderServices() {
    const services = await fetchServices()
    servicesTableBody.innerHTML = ''

    if (!services.length) {
      servicesTable.style.display = 'none'
      emptyState.style.display = 'block'
    } else {
      servicesTable.style.display = 'table'
      emptyState.style.display = 'none'
      services.forEach(s => {
        const row = document.createElement('tr')
        row.innerHTML = `
          <td><div class="service-name">${s.nome}</div></td>
          <td><div class="service-description">${s.descricao || ''}</div></td>
          <td><div class="service-price">R$ ${s.preco.toFixed(2).replace('.', ',')}</div></td>
          <td><div class="service-duration">${s.duracaoMin} min</div></td>
          <td>
            <div class="service-actions">
              <button class="btn btn-success" data-id="${s.id}">Editar</button>
              <button class="btn btn-danger" data-id="${s.id}">Excluir</button>
            </div>
          </td>
        `
        servicesTableBody.appendChild(row)
      })
    }

    servicesCount.textContent = `${services.length} ${services.length === 1 ? 'serviço' : 'serviços'} cadastrados`
  }

  // Funções para modal
  function openModal(m) {
    m.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function closeModal(m) {
    m.classList.remove('active')
    document.body.style.overflow = 'auto'
  }

  newServiceBtn.addEventListener('click', () => openModal(serviceModal))
  closeModalBtn.addEventListener('click', () => closeModal(serviceModal))
  cancelBtn.addEventListener('click', () => closeModal(serviceModal))

  // Salvar serviço
  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const data = {
      nome: serviceForm.serviceName.value,
      descricao: serviceForm.serviceDescription.value,
      preco: parseFloat(serviceForm.servicePrice.value),
      duracaoMin: parseInt(serviceForm.serviceDuration.value, 10)
    }

    const url = editingServiceId
      ? `http://localhost:3000/servicos/${editingServiceId}`
      : 'http://localhost:3000/servicos'

    const method = editingServiceId ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    closeModal(serviceModal)
    
    renderServices()

    if (editingServiceId) {
      showAlert('Serviço atualizado com sucesso!', 'success')
    } else {
      showAlert('Serviço cadastrado com sucesso!', 'success')
    }

    editingServiceId = null
  })


  // Editar / Excluir
  servicesTableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-success')) {
      const id = e.target.dataset.id
      const res = await fetch(`http://localhost:3000/servicos/${id}`)
      const service = await res.json()
      editingServiceId = service.id
      modalTitle.textContent = 'Editar Serviço'
      serviceForm.serviceName.value = service.nome
      serviceForm.serviceDescription.value = service.descricao || ''
      serviceForm.servicePrice.value = service.preco
      serviceForm.serviceDuration.value = service.duracaoMin
      openModal(serviceModal)
    }

    if (e.target.classList.contains('btn-danger')) {
      serviceToDelete = e.target.dataset.id
      openModal(confirmModal)
    }
  })

  confirmDeleteBtn.addEventListener('click', async () => {
    if (serviceToDelete) {
      await fetch(`http://localhost:3000/servicos/${serviceToDelete}`, {
        method: 'DELETE'
      })
      serviceToDelete = null
      closeModal(confirmModal)
      renderServices()
      showAlert('Serviço excluído com sucesso!', 'success')
    }
  })

  cancelDeleteBtn.addEventListener('click', () => {
    serviceToDelete = null
    closeModal(confirmModal)
  })

  renderServices()
})
