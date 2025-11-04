export function mascaraTelefone(valor) {
  if (!valor) return ''

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, '')

  // Aplica máscara conforme o tamanho
  if (valor.length <= 2) {
    // Apenas DDD
    return valor
  } else if (valor.length <= 6) {
    // DDD + início do número
    return valor.replace(/^(\d{2})(\d{0,4})/, '$1 $2')
  } else if (valor.length <= 10) {
    // DDD + número fixo (ex: 67 3341-1234)
    return valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '$1 $2-$3')
  } else {
    // DDD + número celular (ex: 67 99840-0232)
    return valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '$1 $2-$3')
  }
}

export function mascaraTelefoneDigita(valor) {
  if (!valor) return ''

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, '')

  // Limita a no máximo 11 dígitos (2 do DDD + 9 do número)
  valor = valor.substring(0, 11)

  // Aplica a máscara progressivamente
  if (valor.length > 2 && valor.length <= 7) {
    // (67) 9903
    valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2')
  } else if (valor.length > 7) {
    // (67) 99030-0132
    valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  } else if (valor.length > 0) {
    // (67
    valor = valor.replace(/^(\d{0,2})/, '($1')
  }

  return valor
}
