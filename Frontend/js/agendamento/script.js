document.addEventListener('DOMContentLoaded', function () {

    const dadosSalvos = JSON.parse(localStorage.getItem('servicoSelecionado'))

    if (dadosSalvos) {
        document.querySelector('.service-name').textContent = dadosSalvos.servico
        document.querySelector('.service-duration').textContent = dadosSalvos.duracao
        document.querySelector('.service-price').textContent = dadosSalvos.preco
        document.querySelector('.service-location').textContent = `Loc: ${dadosSalvos.unidade}`
    }

    // Calendar functionality
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonth = document.querySelector('.calendar-month');
    const timeSlots = document.querySelectorAll('.time-slot');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const availabilityText = document.querySelector('.availability-text');

    // Get current date
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth(); // 0-11

    // Selected date (default to current date)
    let selectedDay = currentDate.getDate();
    let selectedMonth = currentMonth;
    let selectedYear = currentYear;
    let selectedTime = '13:00'; // Default selected time

    // Month names in Portuguese
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Day names in Portuguese
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    // Generate calendar for a specific month and year
    function generateCalendar(month, year) {
        calendarDays.innerHTML = '';

        // Update month and year display
        calendarMonth.textContent = `${monthNames[month]} ${year}`;

        // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
        const firstDay = new Date(year, month, 1).getDay();

        // Get the number of days in the month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarDays.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('button');
            dayElement.className = 'day';
            dayElement.textContent = day;

            // Check if this day is today
            const isToday = day === currentDate.getDate() &&
                month === currentDate.getMonth() &&
                year === currentDate.getFullYear();

            if (isToday) {
                dayElement.classList.add('today');
            }

            // Check if this day is selected
            const isSelected = day === selectedDay &&
                month === selectedMonth &&
                year === selectedYear;

            if (isSelected) {
                dayElement.classList.add('selected');
            }

            // Add click event
            dayElement.addEventListener('click', function () {
                // Remove selected class from all days
                document.querySelectorAll('.day').forEach(d => {
                    d.classList.remove('selected');
                });

                // Add selected class to clicked day
                this.classList.add('selected');

                // Update selected date
                selectedDay = day;
                selectedMonth = month;
                selectedYear = year;

                // Get day of week for the selected date
                const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
                const dayOfWeek = dayNames[selectedDate.getDay()];

                // Format date in Portuguese
                const formattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`;

                // Update availability text
                availabilityText.textContent = `Disponibilidade para ${dayOfWeek.toLowerCase()}, ${formattedDate}`;

                // Update appointment info
                document.querySelector('.service-date').textContent =
                    `${formattedDate} às ${selectedTime}`;
            });

            calendarDays.appendChild(dayElement);
        }
    }

    // Initialize calendar with current month and year
    generateCalendar(currentMonth, currentYear);

    // Month navigation
    prevMonthBtn.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    // Time slot selection
    timeSlots.forEach(slot => {
        // Set default selected time slot
        if (slot.dataset.time === selectedTime) {
            slot.classList.add('selected');
        }

        slot.addEventListener('click', function () {
            // Remove selected class from all time slots
            timeSlots.forEach(s => {
                s.classList.remove('selected');
            });

            // Add selected class to clicked time slot
            this.classList.add('selected');
            selectedTime = this.dataset.time;

            // Format date in Portuguese
            const formattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`;

            // Update appointment info
            document.querySelector('.service-date').textContent =
                `${formattedDate} às ${selectedTime}`;
        });
    });

    // Show all times button
    document.querySelector('.show-all-btn').addEventListener('click', function () {
        alert('Mostrar todos os horários não implementado nesta demonstração');
    });

    async function confirmarAgendamento() {
        try {
            // Pegar token salvo no localStorage (ajuste se estiver em sessionStorage ou secureStorage)
            const usuarioStorage = localStorage.getItem('usuario')
            const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null
            const token = usuario?.token

            if (!token) {
                alert('Erro: token não encontrado. Faça login novamente.');
                return;
            }

            // Pegar dados salvos do serviço
            const dadosSalvos = JSON.parse(localStorage.getItem('servicoSelecionado'));
            if (!dadosSalvos) {
                alert('Erro: nenhum serviço selecionado.');
                return;
            }

            // Montar data no formato YYYY-MM-DD (sem UTC)
            const dataFormatada = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

            // Montar o body conforme a API espera
            const body = {
                data: dataFormatada,
                hora: selectedTime,
                status: "aguardando confirmação",
                clienteId: usuario.id,  
                servicoId: dadosSalvos.id,
                localizacao: dadosSalvos.unidade
            };

            console.log("Enviando body:", body);

            // Fazer a requisição POST
            const response = await fetch('http://localhost:3000/agendamentos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const erro = await response.json();
                console.error("Erro:", erro);
                alert(`Erro ao cadastrar agendamento: ${erro.message || response.statusText}`);
                return;
            }

            const resultado = await response.json();
            console.log("Agendamento cadastrado com sucesso:", resultado);
            alert("Agendamento confirmado com sucesso!");

        } catch (err) {
            console.error("Erro inesperado:", err);
            alert("Erro inesperado ao cadastrar agendamento.");
        }
    }

    // Evento do botão confirm
    document.querySelector('.btn-confirm').addEventListener('click', confirmarAgendamento);

    // Set initial availability text
    const initialDate = new Date(selectedYear, selectedMonth, selectedDay);
    const initialDayOfWeek = dayNames[initialDate.getDay()];
    const initialFormattedDate = `${selectedDay} de ${monthNames[selectedMonth].toLowerCase()} de ${selectedYear}`;
    availabilityText.textContent = `Disponibilidade para ${initialDayOfWeek.toLowerCase()}, ${initialFormattedDate}`;

    // Set initial appointment info
    document.querySelector('.service-date').textContent =
        `${initialFormattedDate} às ${selectedTime}`;
});