# Portfolio — lucascodev

Portfólio profissional de Lucas Pereira dos Reis. Monorepo Turborepo + pnpm com Next.js 16 App Router, Clean Architecture e sistema de edição inline via painel admin.

## Stack

- **Frontend:** Next.js 16.2.4 (App Router), React, Tailwind CSS v4
- **Design System:** `@portfolio/design-system` (componentes base + tokens)
- **Banco de dados:** PostgreSQL via Prisma 7 + `@prisma/adapter-pg`
- **Auth:** iron-session v8 (cookie HTTP-only criptografado)
- **Estado:** React Query v5 (server state) + Zustand v5 (UI state)
- **Infra:** Turborepo, pnpm workspaces

## Requisitos

- Node.js 20+
- pnpm 9+
- PostgreSQL (local via Docker ou Neon/Supabase)

## Setup

**1. Instalar dependências**

```bash
pnpm install
```

**2. Subir o banco de dados localmente (opcional — usa Docker)**

```bash
docker-compose up -d
```

Isso inicia um PostgreSQL na porta `5432` com usuário/senha/db `portfolio`.

**3. Configurar variáveis de ambiente**

```bash
cp apps/web/.env.example apps/web/.env
```

Edite `apps/web/.env` e preencha os valores (veja a tabela abaixo).

**4. Gerar o Prisma Client, executar migrações e seed**

```bash
pnpm --filter web exec prisma generate
pnpm --filter web exec prisma migrate dev
pnpm --filter web exec prisma db seed
```

**5. Iniciar o servidor de desenvolvimento**

```bash
pnpm dev
```

## Variáveis de ambiente (`apps/web/.env`)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://user:pass@host:5432/db`) |
| `SESSION_SECRET` | Senha do cookie iron-session (mín. 32 chars, qualquer string aleatória) |
| `ADMIN_EMAIL` | E-mail do usuário admin criado pelo seed |
| `ADMIN_PASSWORD` | Senha do usuário admin criado pelo seed |

O Docker Compose local já usa `postgresql://portfolio:portfolio@localhost:5432/portfolio`.

## Comandos

```bash
pnpm dev                                    # Todos os apps em paralelo
pnpm build                                  # Build de produção (Turborepo)
pnpm typecheck                              # TypeScript em todos os packages
pnpm lint                                   # ESLint em todos os packages

pnpm --filter web dev                       # Apenas o Next.js
pnpm --filter web exec prisma studio        # Abrir Prisma Studio
pnpm --filter web exec prisma migrate dev   # Nova migração
pnpm --filter web exec prisma db seed       # Re-executar seed
```

## Estrutura do Monorepo

```
portfolio-lucascodev-profile/
├── apps/
│   └── web/                  # Next.js 16 App Router
├── packages/
│   ├── design-system/        # Tokens + componentes base
│   ├── tsconfig/             # tsconfig base compartilhado
│   └── eslint-config/        # ESLint config compartilhado
├── docker-compose.yml        # PostgreSQL local
```

## Arquitetura (Clean Architecture)

```
domain → use-cases → infrastructure → presentation → app
```

- **domain:** Entidades e interfaces de repositório (sem dependências externas)
- **use-cases:** Lógica de negócio (depende só do domain)
- **infrastructure:** Implementações Prisma dos repositórios
- **presentation:** React components, hooks React Query, Zustand stores
- **app:** Next.js App Router (pages, API routes, layout)

## Painel Admin

Acesse `/login` com as credenciais definidas em `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env`. Após o login, a `AdminToolbar` aparece na parte inferior da tela — ative o modo de edição para ver os botões de lápis em cada seção e editar os dados do portfólio diretamente na página.
