# Cursor Rules e MDC para o Case Técnico (PDP E-commerce)

Este diretório define as regras de projeto (Cursor Rules) e os artefatos MDC (Model-Driven Code) para orientar a implementação futura do case técnico de uma Página de Produto (PDP) de e-commerce de móveis.

Importante: neste momento NÃO implemente código; use estes documentos como fonte única de verdade para decisões técnicas, arquitetura, nomencluras e convenções ao iniciar o desenvolvimento.

## Como usar no Cursor

1. Antes de começar qualquer tarefa, abra os arquivos em `.cursor/rules/` e leia `guardrails.mdc` por completo.
2. Ao pedir implementações para a IA no Cursor, referencie explicitamente os artefatos `.mdc` (ex.: "seguir `project.mdc` e `supabase.mdc`").
3. Se houver divergência entre requisitos e código existente, priorize as Rules e MDC; proponha ajustes no código em vez de flexibilizar as regras.
4. Mantenha estes documentos atualizados conforme o escopo evolui. Alterações devem ser pequenas, incrementais e coesas.

Dica: use `index.mdc` como ponto de entrada canônico para a IA.

Nota: a API Nest é a única fonte de verdade para dados/autenticação; o Next chama apenas a API.

### Como pedir automações ao Cursor

- "Aplicar scaffold_monorepo conforme `index.mdc` (automations)"
- "Aplicar configure_http_client e seo_setup seguindo `http-client.mdc` e `seo-cache.mdc`"
- "Aplicar enforce_backend_boundary e nest_auth_setup conforme `guardrails.mdc` e `supabase.mdc`"

## Arquivos

- Todos os arquivos possuem bloco `metadata` com status/enforcement/version/last_updated
- Interpretação dos campos:
  - status: canonical | authoritative | reference
  - enforcement: required | recommended | optional
  - version: semântico simples (major.minor)
  - last_updated: ISO date

- `guardrails.mdc`: Regras comportamentais, arquiteturais e de qualidade (pt-BR).
- `project.mdc`: Escopo do monorepo (Turborepo), domínios, contratos de alto nível e limites.
- `seo-cache.mdc`: Estratégias obrigatórias de SEO, SSR/SSG, cache e consistência de preço.
- `supabase.mdc`: Esquema de dados, autenticação, RLS e diretrizes de acesso a preço atual.
- `tech-choices.md`: Versões, stack, constraints e ferramentas obrigatórias.
- `http-client.mdc`: Regras de Axios e React Query, alinhadas a SSR e cache.
- `types.mdc`: Estratégia de tipagens/DTOs/schemas compartilhados entre web e api.
- `index.mdc`: Índice canônico que referencia e orquestra os artefatos acima.

## Princípios

- Separação clara de fronteiras: front (Next.js + React + Tailwind v4) e back (Next app dedicada para API) em monorepo com Turborepo.
- Banco e auth: Supabase (PostgreSQL + Auth). Nunca expor `service_role` ao cliente.
- PDP sempre respeita o preço atual. Renderização server-side para preço, sem stale perigoso.
- Cache com segurança: dados de preço têm regras mais restritivas que metadados e mídia.
- Foco em SSR, performance, SEO, Web Vitals, responsividade e reuso de componentes.

## Convenções de trabalho com a IA

- Especifique sempre a fonte: quando pedir geração de código, cite os arquivos `.mdc` relevantes.
- Solicite justificativas curtas para escolhas arquiteturais; respostas devem ser objetivas e rastreáveis a estas Rules.
- A IA deve propor alternativas quando identificar trade-offs, sem desviar dos limites impostos.

## Escopo atual

Este repositório contém apenas as Rules/MDC. A implementação será feita posteriormente respeitando estes documentos.
