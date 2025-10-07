const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function removerAvaliacoesDuplicadas(usuarioId) {
  try {
    // Pega todas as avaliações do usuário, ordenadas por data
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { usuarioId },
      orderBy: { data: 'asc' }
    })

    const vistos = new Set()
    const idsParaDeletar = []

    for (const av of avaliacoes) {
      // chave única para comparar duplicatas
      const chave = `${av.nota}-${av.comentario}`
      if (vistos.has(chave)) {
        idsParaDeletar.push(av.id)
      } else {
        vistos.add(chave)
      }
    }

    if (idsParaDeletar.length === 0) {
      console.log('Não há duplicatas para deletar')
      return
    }

    // Deleta as duplicatas
    const resultado = await prisma.avaliacao.deleteMany({
      where: { id: { in: idsParaDeletar } }
    })

    console.log(`Avaliações duplicadas deletadas: ${resultado.count}`)
  } catch (erro) {
    console.error('Erro ao deletar avaliações duplicadas:', erro)
  } finally {
    await prisma.$disconnect()
  }
}

// Coloque aqui o ID do usuário afetado
removerAvaliacoesDuplicadas(1)