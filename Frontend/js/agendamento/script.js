import { showAlert } from '../alert/alert.js'

document.addEventListener('DOMContentLoaded', function () {

    const dadosSalvos = JSON.parse(localStorage.getItem('servicoSelecionado'))

    if (dadosSalvos) {
        document.querySelector('.service-name').textContent = dadosSalvos.servico
        document.querySelector('.service-duration').textContent = dadosSalvos.duracao
        document.querySelector('.service-price').textContent = dadosSalvos.preco
        document.querySelector('.service-location').textContent = `Loc: ${dadosSalvos.unidade}`
    }

    const calendarDays = document.getElementById('calendarDays')
    const calendarMonth = document.querySelector('.calendar-month')
    const timeSlots = document.querySelectorAll('.time-slot')
    const prevMonthBtn = document.getElementById('prevMonth')
    const nextMonthBtn = document.getElementById('nextMonth')
    const availabilityText = document.querySelector('.availability-text')

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

    function generateCalendar(month, year) {
        calendarDays.innerHTML = ''
        calendarMonth.textContent = `${monthNames[month]} ${year}`

        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div')
            emptyDay.className = 'day empty'
            calendarDays.appendChild(emptyDay)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('button')
            dayElement.className = 'day'
            dayElement.textContent = day

            if (day === currentDate.getDate() &&
                month === currentDate.getMonth() &&
                year === currentDate.getFullYear()) {
                dayElement.classList.add('today')
            }

            if (day === selectedDay &&
                month === selectedMonth &&
                year === selectedYear) {
                dayElement.classList.add('selected')
            }

            dayElement.addEventListener('click', function () {
                document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'))
                this.classList.add('selected')

                selectedDay = day
                selectedMonth = month
                selectedYear = year

                const selectedDate = new Date(selectedYear, selectedMonth, selectedDay)
                const dayOfWeek = dayNames[selectedDate.getDay()]
                const formattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`

                availabilityText.textContent = `Disponibilidade para ${dayOfWeek.toLowerCase()}, ${formattedDate}`
                document.querySelector('.service-date').textContent = `${formattedDate} às ${selectedTime}`
            })

            calendarDays.appendChild(dayElement)
        }
    }

    generateCalendar(currentMonth, currentYear)

    prevMonthBtn.addEventListener('click', function () {
        currentMonth--
        if (currentMonth < 0) {
            currentMonth = 11
            currentYear--
        }
        generateCalendar(currentMonth, currentYear)
    })

    nextMonthBtn.addEventListener('click', function () {
        currentMonth++
        if (currentMonth > 11) {
            currentMonth = 0
            currentYear++
        }
        generateCalendar(currentMonth, currentYear)
    })

    timeSlots.forEach(slot => {
        if (slot.dataset.time === selectedTime) {
            slot.classList.add('selected')
        }

        slot.addEventListener('click', function () {
            timeSlots.forEach(s => s.classList.remove('selected'))
            this.classList.add('selected')
            selectedTime = this.dataset.time

            const formattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`
            document.querySelector('.service-date').textContent = `${formattedDate} às ${selectedTime}`
        })
    })

    document.querySelector('.show-all-btn').addEventListener('click', function () {
        alert('Mostrar todos os horários não implementado nesta demonstração')
    })

    async function confirmarAgendamento() {
        try {
            const usuarioStorage = localStorage.getItem('usuario')
            const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null
            const token = usuario?.token

            if (!token) {
                showAlert('Erro: token não encontrado. Faça login novamente.', 'error')
                return
            }

            const dadosSalvos = JSON.parse(localStorage.getItem('servicoSelecionado'))
            if (!dadosSalvos) {
                showAlert('Erro: nenhum serviço selecionado.', 'error')
                return
            }

            const dataFormatada = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

            const body = {
                data: dataFormatada,
                hora: selectedTime,
                status: "aguardando confirmação",
                clienteId: usuario.id,
                servicoId: dadosSalvos.id,
                localizacao: dadosSalvos.unidade
            }

            console.log("Enviando body:", body)

            const response = await fetch('http://localhost:3000/agendamentos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const erro = await response.json()
                console.error("Erro:", erro)
                showAlert(`Erro ao cadastrar agendamento: ${erro.message || response.statusText}`, 'error')
                return
            }

            const resultado = await response.json()
            console.log("Agendamento cadastrado com sucesso:", resultado)
            showAlert("Agendamento confirmado com sucesso!", 'success')

        } catch (err) {
            console.error("Erro inesperado:", err)
            showAlert("Erro inesperado ao cadastrar agendamento.", 'error')
        }
    }

    document.querySelector('.btn-confirm').addEventListener('click', confirmarAgendamento)

    const initialDate = new Date(selectedYear, selectedMonth, selectedDay)
    const initialDayOfWeek = dayNames[initialDate.getDay()]
    const initialFormattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`
    availabilityText.textContent = `Disponibilidade para ${initialDayOfWeek.toLowerCase()}, ${initialFormattedDate}`
    document.querySelector('.service-date').textContent = `${initialFormattedDate} às ${selectedTime}`
})
