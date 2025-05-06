backend/
├── src/
│   ├── config/                # Arquivos de configuração (ex: banco de dados, .env)
│   │   └── database.js
│   │   └── dotenv.js
│
│   ├── controllers/           # Lógica dos controladores (regras de negócio)
│   │   └── ClienteController.js
│   │   └── AgendamentoController.js
│   │   └── ServicoController.js
│
│   ├── models/                # Modelos (representam tabelas do banco de dados)
│   │   └── Cliente.js
│   │   └── Agendamento.js
│   │   └── Servico.js
│
│   ├── routes/                # Rotas da aplicação
│   │   └── cliente.routes.js
│   │   └── agendamento.routes.js
│   │   └── servico.routes.js
│   │   └── index.js           # Junta todas as rotas
│
│   ├── services/              # Lógica de serviços reutilizáveis (ex: envio de e-mail)
│   │   └── EmailService.js
│
│   ├── middlewares/          # Middlewares (ex: validação, autenticação)
│   │   └── errorHandler.js
│   │   └── validateInput.js
│
│   ├── validations/          # Schemas de validação com Joi ou Yup
│   │   └── clienteValidation.js
│   │   └── agendamentoValidation.js
│
│   ├── database/
│   │   ├── migrations/       # Scripts de criação/alteração de tabelas
│   │   ├── seeders/          # Dados iniciais de testes
│   │   └── connection.js     # Conexão com o banco (PostgreSQL via knex ou sequelize)
│
│   ├── utils/                # Funções auxiliares (ex: formatação de datas)
│   │   └── formatDate.js
│
│   ├── app.js                # Arquivo principal da aplicação Express
│   └── server.js             # Inicia o servidor
│
├── .env                      # Variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
