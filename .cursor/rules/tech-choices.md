# Tech Choices e Constraints

## Stack

- Node.js: 20 LTS
- Package manager: pnpm 9+
- Monorepo: Turborepo
- Frontend: Next.js 14.2+ (React 18), Tailwind CSS v4
- Backend API: Nest.js (BFF/API) em `apps/api`
- Linguagem: TypeScript 5.5+
- Banco/Auth: Supabase (`@supabase/supabase-js` v2) — somente no backend
- ORM/DB Access: Prisma v5 (PostgreSQL Supabase)
- HTTP Client: Axios
- Data Fetching: TanStack React Query (v5)
- Shared Types: pacote `packages/types` (DTOs e schemas)

## Convenções

- TypeScript estrito em todos os pacotes.
- ESLint/Prettier centralizados em `packages/config` (a definir na fase de implementação).
- Import aliases consistentes por pacote (`tsconfig.json`).
- Variáveis de ambiente via `.env` por app; nunca commitar segredos.

## Backend (Nest.js)

- API é a autoridade de dados/autenticação. Front não acessa Supabase diretamente.
- CORS habilitado com `credentials=true` entre `apps/web` e `apps/api`.
- Cookies httpOnly/secure/sameSite=lax para sessão.
- Verificação de JWT do Supabase via JWKS; caching de chaves.
- SOLID: controllers finos; um UseCase por endpoint.
- Repository Pattern: interfaces em `packages/types`; implementações em `infra/prisma`.
- Integrations Pattern: usar `Adapters` sob `infra/**` (ex.: `SupabaseAdapter`, `SupabaseTokenAdapter`).
- Proibição de `Service`: não nomear classes com sufixo Service. Usar `Adapter` (integrações) e `Repository` (dados) conforme responsabilidade.
- Prisma: acesso apenas na camada de infra; sem Prisma em controllers/usecases.
- DTOs e contratos importados de `packages/types`.

## Frontend (Next.js)

- SSR chama somente a API Nest via Axios; sem rotas API do Next.
- `axios` com `withCredentials=true` e base URL da API.
- Tipagens de requests/responses importadas de `packages/types`.

## Renderização e SEO

- PDP: SSR por padrão (preço sempre atual) via API Nest.
- Metadados dinâmicos com Next (Open Graph, Twitter, JSON-LD Product).

## Cache

- Metadados de produto: revalidate curto (ex.: 60s) com SWR.
- Preço: TTL curto (ex.: 5–15s) e revalidação server-side na API; evitar servir preço stale ao cliente.
- Invalidar cache após mudanças de preço (gatilhos na API/backend).
- Alinhar `staleTime`/`gcTime` do React Query ao `seo-cache.mdc`.

## Supabase/Prisma

- DB via Prisma com `DATABASE_URL` do Supabase (pooling recomendado).
- RLS pode permanecer habilitado, mas a API é camada confiável; não expor acesso direto ao DB.
- Chaves públicas não usadas no client. `service_role` apenas no backend (se necessário para tarefas administrativas).

## Qualidade

- Web Vitals como critério (LCP, CLS, INP) na PDP.
- Logs estruturados e tratamento de erros padronizado.
- Backend (Nest.js): usar modificadores de acesso explícitos em todas as classes (métodos e propriedades), preferir `private readonly` para DI. Prisma restrito à camada `infra/**`.

## Observações

- Nesta fase não haverá código da aplicação; apenas Rules/MDC.

## Checklist de Enforcement (LLM)

- [ ] Proibir SDK do Supabase no front; substituir por chamadas à API Nest
- [ ] Configurar Axios (`baseURL`, `withCredentials`) e Provider do React Query
- [ ] Usar DTOs de `packages/types` em controllers/services (API) e no front
- [ ] Implementar `generateMetadata` e JSON-LD conforme `seo-cache.mdc`
- [ ] Aplicar SSR server-first para preço; evitar stale no client
- [ ] CORS com credenciais e cookies httpOnly na API
- [ ] UseCase por endpoint; repos via interfaces; Prisma apenas na infra
