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

## Import script .json do Postman

{
  "info": {
    "_postman_id": "c9f39d2e-3d4b-4d4e-a4b6-86be79f29b35",
    "name": "TCC - Agendamento e Clientes",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Clientes",
      "item": [
        {
          "name": "Criar Cliente",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nome\": \"João da Silva\",\n  \"email\": \"joao@email.com\",\n  \"telefone\": \"11999999999\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/clientes",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["clientes"]
            }
          }
        },
        {
          "name": "Listar Clientes",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:3000/clientes",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["clientes"]
            }
          }
        },
        {
          "name": "Buscar Cliente por ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:3000/clientes/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["clientes", "1"]
            }
          }
        },
        {
          "name": "Atualizar Cliente",
          "request": {
            "method": "PUT",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"nome\": \"João Atualizado\",\n  \"email\": \"joaoatualizado@email.com\",\n  \"telefone\": \"11988888888\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/clientes/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["clientes", "1"]
            }
          }
        },
        {
          "name": "Excluir Cliente",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "http://localhost:3000/clientes/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["clientes", "1"]
            }
          }
        }
      ]
    },
    {
      "name": "Agendamentos",
      "item": [
        {
          "name": "Criar Agendamento",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cliente_id\": 1,\n  \"servico\": \"Depilação\",\n  \"data\": \"2025-05-15\",\n  \"hora\": \"10:00\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/agendamentos",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["agendamentos"]
            }
          }
        },
        {
          "name": "Listar Agendamentos",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:3000/agendamentos",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["agendamentos"]
            }
          }
        },
        {
          "name": "Buscar Agendamento por ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:3000/agendamentos/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["agendamentos", "1"]
            }
          }
        },
        {
          "name": "Atualizar Agendamento",
          "request": {
            "method": "PUT",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"cliente_id\": 1,\n  \"servico\": \"Terapia Holística\",\n  \"data\": \"2025-05-16\",\n  \"hora\": \"14:30\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/agendamentos/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["agendamentos", "1"]
            }
          }
        },
        {
          "name": "Excluir Agendamento",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "http://localhost:3000/agendamentos/1",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["agendamentos", "1"]
            }
          }
        }
      ]
    }
  ]
}



## 📖 Licença

Projeto desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso (TCC). Todos os direitos reservados à autora.

**Desenvolvido por Lyziane Santos – Engenharia de Software 💻**