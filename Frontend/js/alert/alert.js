export function showAlert(message, type = 'success', timeout = 3000) {
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