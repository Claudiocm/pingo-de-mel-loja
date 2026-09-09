# Pingo de Mel — Mini Loja Virtual

Mini loja virtual estática com catálogo, filtros, busca, carrinho e envio do pedido pelo WhatsApp.

## Publicação no GitHub Pages

1. Crie um repositório chamado **`pingo-de-mel-loja`** no GitHub.
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório, incluindo a pasta `.github`.
3. Faça o primeiro push para a branch `main`.
4. No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** como origem, caso o GitHub ainda não tenha detectado o workflow.
5. O workflow `Deploy static site to GitHub Pages` fará a publicação automaticamente.

### URL esperada

`https://claudiocm.github.io/pingo-de-mel-loja/`

## Atualizações

Depois da configuração inicial, basta fazer `git add`, `git commit` e `git push` na branch `main`. Cada push dispara uma nova publicação.

## Estrutura

- `index.html` — página principal
- `styles.css` — estilos
- `assets/` — logo e ícones do Pingo de Mel
- `.github/workflows/pages.yml` — deploy automático
- `.nojekyll` — evita processamento desnecessário do Jekyll

> **Importante:** esta versão é uma loja frontend. O GitHub Pages hospeda o catálogo e o carrinho, mas não fornece banco de dados, painel administrativo, checkout com pagamento ou backend. Esses recursos podem ser adicionados futuramente com uma API/backend separado.
