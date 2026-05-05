# Portfolio — lucascodev

Portfólio profissional de Lucas Pereira dos Reis. Monorepo Turborepo + pnpm com Next.js 15 App Router, Clean Architecture e sistema de edição inline via painel admin.

## Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS v4
- **Design System:** `@portfolio/design-system` (componentes base + tokens)
- **Banco de dados:** PostgreSQL via Prisma 7 + `@prisma/adapter-pg`
- **Auth:** iron-session v8 (cookie HTTP-only criptografado)
- **Estado:** React Query v5 (server state) + Zustand v5 (UI state)
- **Infra:** Turborepo, pnpm workspaces

## Requisitos

- Node.js 20+
- pnpm 9+
- PostgreSQL (local ou Neon/Supabase)

## Setup

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp apps/web/.env.example apps/web/.env
# Editar DATABASE_URL com a connection string PostgreSQL
# Editar SESSION_PASSWORD com uma string aleatória >= 32 chars

# Executar migrações e seed
pnpm --filter web exec prisma migrate dev
pnpm --filter web exec prisma db seed

# Iniciar desenvolvimento
pnpm dev
```

## Variáveis de ambiente (`apps/web/.env`)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://user:pass@host:5432/db`) |
| `SESSION_PASSWORD` | Senha do cookie iron-session (mín. 32 chars) |

## Comandos

```bash
pnpm dev                          # Todos os apps em paralelo
pnpm build                        # Build de produção (Turborepo)
pnpm typecheck                    # TypeScript em todos os packages
pnpm lint                         # ESLint em todos os packages

pnpm --filter web dev             # Apenas o Next.js
pnpm --filter web exec prisma studio   # Abrir Prisma Studio
pnpm --filter web exec prisma migrate dev  # Nova migração
pnpm --filter web exec prisma db seed     # Re-executar seed
```

## Estrutura do Monorepo

```
portfolio-lucascodev-profile/
├── apps/
│   └── web/                  # Next.js 15 App Router
├── packages/
│   ├── design-system/        # Tokens + componentes base
│   ├── tsconfig/             # tsconfig base compartilhado
│   └── eslint-config/        # ESLint config compartilhado
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

## Admin

Acesse `/login` com as credenciais do seed para ativar o modo de edição inline. A `AdminToolbar` aparece na parte inferior da tela e permite editar todos os dados do portfólio sem sair da página.
