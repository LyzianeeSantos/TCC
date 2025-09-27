import { showAlert } from '../alert/alert.js'

document.addEventListener('DOMContentLoaded', function () {

    // ----------- Variáveis iniciais -----------
    const dadosSalvos = JSON.parse(localStorage.getItem('servicoSelecionado'))
    const calendarDays = document.getElementById('calendarDays')
    const calendarMonth = document.querySelector('.calendar-month')
    const timeSlots = document.querySelectorAll('.time-slot')
    const prevMonthBtn = document.getElementById('prevMonth')
    const nextMonthBtn = document.getElementById('nextMonth')
    const availabilityText = document.querySelector('.availability-text')
    const btnConfirm = document.querySelector('.btn-confirm')

    const currentDate = new Date()
    let currentYear = currentDate.getFullYear()
    let currentMonth = currentDate.getMonth()
    let selectedDay = currentDate.getDate()
    let selectedMonth = currentMonth
    let selectedYear = currentYear
    let selectedTime = '13:00'

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

    // ----------- Inicializa info do serviço -----------
    if (dadosSalvos) {
        document.querySelector('.service-name').textContent = dadosSalvos.servico
        document.querySelector('.service-duration').textContent = dadosSalvos.duracao
        document.querySelector('.service-price').textContent = dadosSalvos.preco
        document.querySelector('.service-location').textContent = `Loc: ${dadosSalvos.unidade}`
    }

    // ----------- Função para gerar calendário -----------
    function generateCalendar(month, year) {
        calendarDays.innerHTML = ''
        calendarMonth.textContent = `${monthNames[month]} ${year}`

        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Dias vazios do início do mês
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div')
            emptyDay.className = 'day empty'
            calendarDays.appendChild(emptyDay)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('button')
            dayElement.className = 'day'
            dayElement.textContent = day

            if (day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayElement.classList.add('today')
            }
            if (day === selectedDay && month === selectedMonth && year === selectedYear) {
                dayElement.classList.add('selected')
            }

            dayElement.addEventListener('click', () => {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'))
                dayElement.classList.add('selected')

                selectedDay = day
                selectedMonth = month
                selectedYear = year

                const selectedDate = new Date(selectedYear, selectedMonth, selectedDay)
                const dayOfWeek = dayNames[selectedDate.getDay()]
                const formattedDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

                availabilityText.textContent = `Disponibilidade para ${dayOfWeek.toLowerCase()}, ${formattedDate}`
                document.querySelector('.service-date').textContent = `${formattedDate} às ${selectedTime}`

                marcarHorariosIndisponiveis(formattedDate, dadosSalvos.unidade)
            })

            calendarDays.appendChild(dayElement)
        }
    }

    generateCalendar(currentMonth, currentYear)

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--
        if (currentMonth < 0) { currentMonth = 11; currentYear-- }
        generateCalendar(currentMonth, currentYear)
    })

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++
        if (currentMonth > 11) { currentMonth = 0; currentYear++ }
        generateCalendar(currentMonth, currentYear)
    })

    // ----------- Seleção de horários -----------
    timeSlots.forEach(slot => {
        if (slot.dataset.time === selectedTime) slot.classList.add('selected')

        slot.addEventListener('click', function () {
            timeSlots.forEach(s => s.classList.remove('selected'))
            this.classList.add('selected')
            selectedTime = this.dataset.time

            const formattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`
            document.querySelector('.service-date').textContent = `${formattedDate} às ${selectedTime}`
        })
    })

    document.querySelector('.show-all-btn').addEventListener('click', () => {
        alert('Mostrar todos os horários não implementado nesta demonstração')
    })

    // ----------- Função confirmar agendamento -----------
    async function confirmarAgendamento() {
        try {
            const usuarioStorage = localStorage.getItem('usuario')
            const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null
            console.log("session do usuario:", localStorage)
            const token = usuario?.token
            if (!token) { showAlert('Erro: token não encontrado. Faça login novamente.', 'error'); return }
            if (!dadosSalvos) { showAlert('Erro: nenhum serviço selecionado.', 'error'); return }

            const dataISO = new Date(selectedYear, selectedMonth, selectedDay).toISOString().split('T')[0]
            const dataHora = `${dataISO}T${selectedTime}:00`

            const body = {
                dataHora,
                status: "aguardando confirmação",
                clienteId: usuario.id,
                servicoId: dadosSalvos.id,
                localizacao: dadosSalvos.unidade
            }

            console.log("Enviando body:", body)

            const response = await fetch('http://localhost:3000/agendamentos', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const erro = await response.json()
                console.error("Erro:", erro)
                showAlert(erro.error || response.statusText, 'error')
                return
            }

            const resultado = await response.json()
            console.log("Agendamento cadastrado com sucesso:", resultado)
            showAlert("Agendamento confirmado com sucesso!", 'success')

            setTimeout(() => window.location.href = 'index.html', 1800)

        } catch (err) {
            console.error("Erro inesperado:", err)
            showAlert("Erro inesperado ao cadastrar agendamento.", 'error')
        }
    }

    btnConfirm.addEventListener('click', confirmarAgendamento)

    // ----------- Função marcar horários indisponíveis -----------
    async function marcarHorariosIndisponiveis(dataSelecionada, localizacao) {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuario'))
            const token = usuario?.token
            if (!token) return

            const response = await fetch(
                `http://localhost:3000/agendamentos?data=${dataSelecionada}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            )
            
            if (!response.ok) throw new Error('Erro ao buscar horários')

            const agendamentos = await response.json()

            console.log("horarios marcados:", agendamentos)

            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('ocupado')
                slot.disabled = false
            })

            agendamentos.forEach(a => {
                const dateObj = new Date(a.dataHora) // Converte string ISO para Date
                const agendamentoHora = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // HH:MM local
                const slot = document.querySelector(`.time-slot[data-time="${agendamentoHora}"]`)
                if (slot) {
                    slot.classList.add('ocupado')
                    slot.disabled = true
                }
            })

        } catch (err) {
            console.error("Erro ao buscar horários:", err)
        }
    }

    // ----------- Estado inicial da data selecionada -----------
    const initialDate = new Date(selectedYear, selectedMonth, selectedDay)
    const initialDayOfWeek = dayNames[initialDate.getDay()]
    const initialFormattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`
    availabilityText.textContent = `Disponibilidade para ${initialDayOfWeek.toLowerCase()}, ${initialFormattedDate}`
    document.querySelector('.service-date').textContent = `${initialFormattedDate} às ${selectedTime}`

    // Carrega horários ocupados iniciais
    marcarHorariosIndisponiveis(`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`, dadosSalvos.unidade)
})
