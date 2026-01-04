# Contributing Guide

## Automated Releases

Este projeto utiliza **versionamento automático** baseado em **Conventional Commits**. Você **não precisa** atualizar manualmente a versão no `package.json`.

### Como Funciona

1. Faça commits seguindo a convenção de commits
2. Ao fazer push para `main`, o sistema automaticamente:
   - Analisa os commits desde a última versão
   - Determina o tipo de incremento de versão
   - Atualiza `package.json` e `CHANGELOG.md`
   - Cria uma tag Git
   - Cria um GitHub Release
   - Faz deploy automático para GitHub Pages

### Conventional Commits

Use o seguinte formato para seus commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

#### Types (Tipos)

| Type | Descrição | Incremento de Versão |
|------|-----------|---------------------|
| `feat` | Nova funcionalidade | **MINOR** (0.X.0) |
| `fix` | Correção de bug | **PATCH** (0.0.X) |
| `docs` | Mudanças apenas em documentação | Nenhum |
| `style` | Formatação, ponto e vírgula, etc | Nenhum |
| `refactor` | Refatoração de código | Nenhum |
| `perf` | Melhorias de performance | **PATCH** (0.0.X) |
| `test` | Adição ou correção de testes | Nenhum |
| `chore` | Tarefas de manutenção | Nenhum |
| `ci` | Mudanças em CI/CD | Nenhum |

#### Breaking Changes

Para indicar uma mudança que quebra compatibilidade (MAJOR version):

```bash
feat!: remove suporte para formato de dados antigo

BREAKING CHANGE: O formato de dados antigo não é mais suportado.
```

Isso resultará em um incremento **MAJOR** (X.0.0).

### Exemplos Práticos

```bash
# Nova funcionalidade → versão 1.2.0 → 1.3.0
git commit -m "feat: adiciona sincronização em tempo real"

# Correção de bug → versão 1.3.0 → 1.3.1
git commit -m "fix: corrige cálculo de dano de área"

# Breaking change → versão 1.3.1 → 2.0.0
git commit -m "feat!: muda estrutura do formato de campanha

BREAKING CHANGE: Campanhas antigas precisam ser migradas manualmente."

# Múltiplas linhas
git commit -m "feat(dice): adiciona dados customizados

Agora é possível criar dados com número personalizado de faces.
Suporta d2, d3, d30, d100, etc."

# Sem incremento de versão
git commit -m "docs: atualiza README com instruções de instalação"
git commit -m "chore: atualiza dependências"
```

### Scope (Escopo) - Opcional

O escopo ajuda a categorizar a mudança:

- `dice` - Sistema de dados
- `sync` - Sincronização
- `ui` - Interface do usuário
- `i18n` - Internacionalização
- `3d` - Renderização 3D

Exemplos:
```bash
git commit -m "feat(sync): adiciona sincronização peer-to-peer"
git commit -m "fix(dice): corrige física dos dados 3D"
git commit -m "feat(i18n): adiciona tradução em espanhol"
```

## Fluxo de Trabalho

1. **Desenvolvimento local**
   ```bash
   git checkout -b minha-feature
   # faça suas mudanças
   git commit -m "feat: minha nova feature"
   ```

2. **Push e PR**
   ```bash
   git push origin minha-feature
   # Crie um Pull Request para main
   ```

3. **Merge para main**
   - Quando o PR for mergeado, o sistema automaticamente cria uma release
   - A versão é atualizada conforme os commits
   - Deploy é feito automaticamente

## Verificando Releases

- Releases: https://github.com/patrickporto/weird-wizard-vault/releases
- Tags: https://github.com/patrickporto/weird-wizard-vault/tags
- Changelog: [CHANGELOG.md](./CHANGELOG.md)

## Dicas

✅ **Bom:**
```bash
git commit -m "feat: adiciona modo escuro"
git commit -m "fix: corrige bug no cálculo de iniciativa"
git commit -m "docs: adiciona exemplos de uso"
```

❌ **Evite:**
```bash
git commit -m "updates"
git commit -m "fix stuff"
git commit -m "WIP"
```

## Links Úteis

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Semantic Release](https://semantic-release.gitbook.io/)
