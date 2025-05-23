document.addEventListener('DOMContentLoaded', function() {
    // Get all elements we need
    const tabButtons = document.querySelectorAll('.tab-button');
    const cardContainers = document.querySelectorAll('.card-container');
    const bookButtons = document.querySelectorAll('.card-front .book-button');
    const flipBackButtons = document.querySelectorAll('.flip-back-button');
    const continueButtons = document.querySelectorAll('.continue-button');
    const checkboxes = document.querySelectorAll('.checkbox');
    
    // Add click event listeners to tab buttons for filtering
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the category to filter by
            const category = this.getAttribute('data-category');
            
            // Filter the service cards
            filterServiceCards(category);
            
            // Reset all flipped cards
            document.querySelectorAll('.card.flipped').forEach(card => {
                card.classList.remove('flipped');
            });
        });
    });
    
    // Add click event listeners to book buttons to flip the card
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the parent card and flip it
            const card = this.closest('.card');
            card.classList.add('flipped');
        });
    });
    
    // Add click event listeners to flip back buttons
    flipBackButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the parent card and flip it back
            const card = this.closest('.card');
            card.classList.remove('flipped');
        });
    });
    
    // Add click event listeners to continue buttons
    continueButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const cardContainer = card.closest('.card-container');
            const serviceName = cardContainer.querySelector('.card-front .service-title').textContent;
            const serviceSubtitle = cardContainer.querySelector('.card-front .service-subtitle');
            const serviceText = serviceSubtitle ? 
                `${serviceName} - ${serviceSubtitle.textContent}` : 
                serviceName;
            
            // Get selected location
            const selectedLocation = card.querySelector('.checkbox.checked');
            const locationText = selectedLocation ? 
                selectedLocation.closest('.location-option').querySelector('span').textContent : 
                'Unidade 2';
            
            alert(`Agendamento confirmado para ${serviceText} na ${locationText}!`);
            
            // Flip the card back after confirmation
            setTimeout(() => {
                card.classList.remove('flipped');
            }, 1000);
        });
    });
    
    // Add click event listeners to checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            // Find all checkboxes in this card
            const card = this.closest('.card');
            const cardCheckboxes = card.querySelectorAll('.checkbox');
            
            // Remove checked class from all checkboxes in this card
            cardCheckboxes.forEach(cb => {
                cb.classList.remove('checked');
                cb.innerHTML = '';
            });
            
            // Add checked class to clicked checkbox
            this.classList.add('checked');
            this.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
        });
    });
    
    // Function to filter service cards
    function filterServiceCards(category) {
        cardContainers.forEach(container => {
            if (category === 'todos' || container.getAttribute('data-category') === category) {
                container.classList.remove('hidden');
            } else {
                container.classList.add('hidden');
            }
        });
    }
});