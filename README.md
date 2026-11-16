# Gustavo Milhomem Cursos — Plataforma de Cursos Online

Aplicação web para gestão de uma plataforma de cursos online.
O **frontend** em React consome uma **API REST em NestJS**, com dados persistidos em **PostgreSQL** via **Prisma**,
autenticação **JWT** e documentação **Swagger**.

## Tecnologias

| Camada   | Tecnologias |
|----------|-------------|
| Frontend | React 19 + TypeScript, Vite, Bootstrap 5, React Router DOM 7 |
| Backend  | NestJS 11, Prisma 7 (adapter `pg`), class-validator, Swagger |
| Segurança| Passport + JWT (`@nestjs/jwt`, `passport-jwt`), bcrypt para hash de senha |
| Banco    | PostgreSQL 16 (via Docker) |

## Estrutura do projeto

```
plataforma-cursos-nestjs/
├── backend/                  # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma     # Modelagem das 15 tabelas
│   │   ├── migrations/       # Migrations geradas pelo Prisma
│   │   ├── seed.ts           # Popula o banco com os dados iniciais
│   │   └── dados-iniciais.json
│   ├── src/
│   │   ├── auth/             # Login, JwtStrategy, LoginDto
│   │   ├── prisma/           # PrismaService / PrismaModule
│   │   ├── common/           # Filtro que traduz erros do Prisma em HTTP
│   │   ├── usuarios/         # CRUD + hash de senha + findByEmail
│   │   └── categorias/ cursos/ modulos/ aulas/ trilhas/ trilhas-cursos/
│   │       matriculas/ progresso-aulas/ avaliacoes/ certificados/
│   │       planos/ assinaturas/ pagamentos/   # module, controller, service, dto
│   ├── docker-compose.yml    # Banco PostgreSQL
│   └── .env.example
└── frontend/                 # Aplicação React
    └── src/
        ├── components/       # Componentes reutilizáveis
        ├── models/           # Interfaces das entidades
        ├── services/         # ApiService genérica (envia o token JWT) + auth.service
        ├── hooks/            # Hook useCrud
        ├── pages/            # Uma página por módulo + Login e Cadastro
        ├── routers/          # Rotas + PrivateRoute (proteção por token)
        └── utils/            # Formatadores (data dd/mm/aaaa, moeda R$)
```

## Como executar

Pré-requisitos: **Node.js** e **Docker Desktop** (ou um PostgreSQL instalado localmente).

### 1. Banco de dados e Kafka

```bash
cd backend
docker compose up -d   # sobe o PostgreSQL e o Kafka
```

### 2. Backend (NestJS) — porta 3000

```bash
cd backend
npm install
cp .env.example .env            # ajuste o JWT_SECRET
npx prisma migrate dev          # cria as tabelas
npx prisma generate             # gera o Prisma Client
npx prisma db seed              # (opcional) insere os dados de exemplo
npm run start:dev
```

- API: `http://localhost:3000`
- **Swagger:** `http://localhost:3000/api`

### 3. Frontend (React) — porta 5173

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

**Login de exemplo** (criado pelo seed): `ana.souza@email.com` / `123456`
(todos os usuários do seed usam a senha `123456`). Também é possível criar uma conta em **Cadastre-se**.

## Autenticação (JWT)

1. `POST /usuarios` é **público**: cria o usuário e salva a senha como hash bcrypt.
2. `POST /auth/login` recebe `{ email, senha }` e devolve `access_token` (validade de 1h).
3. As demais rotas exigem o cabeçalho `Authorization: Bearer <token>`; sem ele a API responde `401 Unauthorized`.
4. No frontend, o token fica no `localStorage`, é enviado em todas as requisições pela `ApiService`
   e, se expirar, o usuário volta automaticamente para a tela de login.

### Testando pelo Swagger

1. Abra `http://localhost:3000/api`.
2. Execute `POST /auth/login` com o e-mail e a senha e copie o `access_token`.
3. Clique em **Authorize**, cole o token e confirme.
4. Teste qualquer rota protegida (ex.: `GET /cursos`). Sem o token, a resposta é `401`.

## Rotas da API

Todas seguem o padrão `POST /recurso`, `GET /recurso`, `GET /recurso/:id`, `PATCH /recurso/:id`, `DELETE /recurso/:id`:

`usuarios`, `categorias`, `cursos`, `modulos`, `aulas`, `trilhas`, `trilhas-cursos`, `matriculas`,
`progresso-aulas`, `avaliacoes`, `certificados`, `planos`, `assinaturas`, `pagamentos` — além de
`POST /auth/login` e `GET /auth/perfil`.

### Área do aluno (app mobile)

Usadas pelo [app mobile](https://github.com/gustavin10/app-mobile-TCS). O aluno é identificado pelo token JWT.

| Rota | Descrição |
|---|---|
| `GET /aluno/trilhas` | Trilhas com os cursos em ordem |
| `GET /aluno/cursos` | Catálogo com categoria e instrutor |
| `GET /aluno/cursos/:id` | Curso com módulos e aulas, se o aluno está matriculado e a assinatura ativa |
| `GET /aluno/aulas/:id` | Aula (somente matriculados, senão `403`) |
| `GET /aluno/meus-cursos` | Cursos em que o aluno está matriculado |
| `POST /aluno/matriculas` | Matricula no curso. Sem assinatura ativa, exige `idPlano` + `metodoPagamento` e cria Assinatura + Pagamento |
| `GET /notificacoes` / `PATCH /notificacoes/:id/lida` | Notificações do usuário logado |

## Mensageria (Kafka)

Sempre que um usuário é cadastrado (`POST /usuarios`, pelo site ou pelo app):

1. O `UsuariosService` (**produtor**) publica no tópico `usuario-cadastrado`.
2. O `NotificacoesConsumer` (**consumidor**, grupo `servico-notificacoes`) recebe a mensagem e grava a
   notificação de boas-vindas na tabela `notificacoes`.
3. O app mostra a notificação ao usuário.

Código em `backend/src/kafka/` e `backend/src/notificacoes/`. Se o Kafka estiver fora do ar, a API continua
funcionando e tenta reconectar a cada 5s. Endereço do broker: `KAFKA_BROKER` no `.env` (padrão `localhost:9092`).

## Persistência e regras do banco

- 15 tabelas relacionadas por chaves estrangeiras (ver `backend/prisma/schema.prisma`).
- `email` do usuário, `codigoVerificacao` do certificado e `idTransacaoGateway` do pagamento são únicos.
- Exclusão em cascata onde faz sentido (curso → módulos → aulas; trilha → vínculos; assinatura → pagamentos).
- Os erros do banco viram respostas amigáveis: e-mail duplicado → `409`, registro em uso → `409`, não encontrado → `404`.
- Os DTOs validam os dados de entrada (`class-validator`); dados inválidos → `400`.
