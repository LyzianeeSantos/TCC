document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const btnConsultar = document.getElementById('btn-consultar');
    const btnLimpar = document.getElementById('btn-limpar');
    const clientNameInput = document.getElementById('client-name');
    const dateFilterInput = document.getElementById('date-filter');
    const unitInput = document.getElementById('unit');
    const appointmentsTable = document.getElementById('appointments-table');
    const tableContainer = document.getElementById('table-container');
    const loading = document.getElementById('loading');
    const tabs = document.querySelectorAll('.tab');

    // Store original table data
    const originalRows = Array.from(appointmentsTable.children);

    // Tab switching functionality
    tabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        console.log('Filtro selecionado:', filter);
      });
    });

    // Consultar button functionality
    btnConsultar.addEventListener('click', function() {
      // Show loading
      showLoading();

      // Simulate API call delay
      setTimeout(() => {
        filterAppointments();
        hideLoading();
      }, 1000);
    });

    // Limpar filtros button functionality
    btnLimpar.addEventListener('click', function() {
      // Clear all inputs
      clientNameInput.value = '';
      dateFilterInput.value = '';
      unitInput.value = '';

      // Reset table to show all appointments
      resetTable();
    });

    // Filter appointments function
    function filterAppointments() {
      const clientName = clientNameInput.value.toLowerCase().trim();
      const dateFilter = dateFilterInput.value;
      const unit = unitInput.value.toLowerCase().trim();

      let filteredRows = originalRows.filter(row => {
        const rowClientName = row.cells[0].textContent.toLowerCase();
        const rowDate = row.cells[2].textContent;
        const rowUnit = row.cells[3].textContent.toLowerCase();

        let matches = true;

        // Filter by client name
        if (clientName && !rowClientName.includes(clientName)) {
          matches = false;
        }

        // Filter by date (simplified - you could make this more sophisticated)
        if (dateFilter && !rowDate.includes('2025')) {
          // This is a simplified date filter - in a real app you'd parse dates properly
          matches = false;
        }

        // Filter by unit
        if (unit && !rowUnit.includes(unit)) {
          matches = false;
        }

        return matches;
      });

      // Clear table and add filtered rows
      appointmentsTable.innerHTML = '';
      filteredRows.forEach(row => {
        appointmentsTable.appendChild(row.cloneNode(true));
      });

      // Re-attach event listeners to new action buttons
      attachActionButtonListeners();

      // Show message if no results
      if (filteredRows.length === 0) {
        showNoResults();
      }
    }

    // Reset table to original state
    function resetTable() {
      appointmentsTable.innerHTML = '';
      originalRows.forEach(row => {
        appointmentsTable.appendChild(row.cloneNode(true));
      });
      attachActionButtonListeners();
    }

    // Show loading state
    function showLoading() {
      loading.classList.remove('hidden');
      tableContainer.style.opacity = '0.5';
    }

    // Hide loading state
    function hideLoading() {
      loading.classList.add('hidden');
      tableContainer.style.opacity = '1';
    }

    // Show no results message
    function showNoResults() {
      const noResultsRow = document.createElement('tr');
      noResultsRow.innerHTML = `
        <td colspan="6" style="text-align: center; padding: 2rem; color: #99805b;">
          <i class="bi bi-search"></i><br>
          Nenhum agendamento encontrado com os filtros aplicados.
        </td>
      `;
      appointmentsTable.appendChild(noResultsRow);
    }

    // Attach event listeners to action buttons
    function attachActionButtonListeners() {
      const actionButtons = document.querySelectorAll('.action-btn');
      
      actionButtons.forEach(button => {
        button.addEventListener('click', function() {
          const isConfirm = this.querySelector('.bi-check');
          const isCancel = this.querySelector('.bi-x');
          
          if (isConfirm) {
            alert('Agendamento confirmado!');
          } else if (isCancel) {
            if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
              alert('Agendamento cancelado!');
              // Remove the row
              this.closest('tr').remove();
            }
          }
        });
      });
    }

    // Initial setup
    attachActionButtonListeners();

    // Real-time search for client name (optional - you can remove this if you only want search on button click)
    clientNameInput.addEventListener('input', function() {
      // You can enable this for real-time search or keep only the button search
      // filterAppointments();
    });
  });