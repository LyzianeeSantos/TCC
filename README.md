# 💆‍♀️ Interface de Agendamento Automatizado de Depilação e Terapia Holística

Sistema web para facilitar o agendamento de atendimentos estéticos e terapias holísticas, com gerenciamento de clientes, serviços e agenda. Desenvolvido com foco em automatizar processos, melhorar a comunicação com o cliente e otimizar a organização do tempo da profissional.

## 📌 Funcionalidades Principais

- Cadastro, edição e exclusão de **clientes**
- Agendamento de **serviços** com data e hora
- Listagem e controle de **agendamentos**
- Interface web para clientes
- **Painel administrativo** para visualização de estatísticas
- Notificações (futuro)
- Validação de entrada dos dados

## 🚀 Tecnologias Utilizadas

### 🔧 Back-End
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- dotenv

### 🎨 Front-End
- HTML5 + CSS3 + JavaScript
- Bootstrap 5
- Fetch API

### 🧰 Ferramentas
- Visual Studio Code
- Postman (testes de rotas)
- DBeaver (gerenciamento do banco)
- Git e GitHub (versionamento)

## 🗃️ Estrutura de Diretórios (Back-End)

backend/
├── src/
│ ├── config/ # Configuração do banco
│ ├── controllers/ # Lógica de cada entidade
│ ├── models/ # Modelos Sequelize
│ ├── routes/ # Arquivos de rotas
│ ├── middlewares/ # Middlewares de autenticação e validação
│ └── server.js # Início da aplicação
├── .env
├── package.json


## ⚙️ Como Executar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/LyzianeeSantos/TCC.git

2. **Acesse a pasta e instale as depedências:**
    cd backend
    npm install

3. **Configure as variáveis do banco no arquivo .env:**
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=seu_usuario
    DB_PASSWORD=sua_senha
    DB_NAME=nome_do_banco

4. **Inicie o servidor:**

    node src/server.js

5. **Acesse no navegador:**

    http://localhost:3000


## 📖 Licença

Projeto desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso (TCC). Todos os direitos reservados à autora.

**Desenvolvido por Lyziane Santos – Engenharia de Software 💻**