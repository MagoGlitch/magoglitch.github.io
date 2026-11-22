# Como editar este portfólio

O site é publicado pelo GitHub Pages direto da pasta raiz (branch `main`).

## Onde fica cada coisa

- `src/app.jsx`: todo o código React do site (hero, galerias, modais, Sobre, contato). **Edite aqui.**
- `index.html`: estrutura da página, `<head>`, fontes e o CSS próprio (bloco `<style>`). Não tem mais o JSX dentro.
- `projects-data.js`: lista dos projetos (títulos, clientes, imagens).
- `app.js` e `styles.css`: **arquivos gerados**. Não edite à mão; são recriados pelo build.
- `tailwind.config.js`: fontes e breakpoints do Tailwind.
- `DESIGN.md` e `PRODUCT.md`: regras de design e de conteúdo.

## Depois de qualquer mudança em `src/app.jsx`, `index.html` ou classes do Tailwind

```bash
npm install      # só na primeira vez
npm run build    # gera app.js e styles.css e atualiza a versão no index.html
```

Commite junto: `src/app.jsx`, `index.html`, `app.js` e `styles.css`. Se esquecer o build, o site publicado não muda.

## Por que tem build

Antes o navegador baixava o Babel (≈2,7 MB) e o Tailwind CDN e compilava o site a cada visita. No celular isso levava vários segundos. Agora o site chega pronto.

## Cuidados no código

- Declare `useState`/`useRef` antes de usar a variável em qualquer lista de dependências de `useEffect`. Usar antes de declarar quebra a página inteira.
- No celular (`pointer: coarse`) a rolagem é nativa (Lenis desligado). Use `window.lenis` sempre com alternativa `window.scrollTo`.
- Eventos de `resize` no celular disparam quando a barra do navegador aparece/some; use `onWidthResize(fn)` para só reagir a mudanças de largura.
