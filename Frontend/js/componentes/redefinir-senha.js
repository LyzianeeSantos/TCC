import { showAlert } from '../alert/alert.js' // opcional se quiser usar o mesmo alerta

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resetForm');
  const mensagem = document.getElementById('mensagem');

  // Extrai o token da URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    mensagem.textContent = "❌ Link inválido ou expirado.";
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (novaSenha !== confirmarSenha) {
      mensagem.textContent = "⚠️ As senhas não coincidem.";
      mensagem.classList.add('erro');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/usuarios/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha })
      });

      const data = await res.json();

      if (res.ok) {
        mensagem.textContent = "✅ Senha redefinida com sucesso! Você já pode fazer login.";
        mensagem.classList.remove('erro');
        mensagem.style.color = "green";
        setTimeout(() => {
          window.location.href = '/index.html'; // ou a página de login
        }, 2000);
      } else {
        mensagem.textContent = `❌ ${data.error || 'Erro ao redefinir senha.'}`;
      }
    } catch (err) {
      console.error(err);
      mensagem.textContent = "❌ Erro de conexão com o servidor.";
    }
  });
});
