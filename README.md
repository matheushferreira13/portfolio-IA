# Portfolio IA

Portfolio pessoal com chat de IA, projetos em carrossel, lightbox de midia e backend seguro para Gemini.

## Execucao local

1. Instale as dependencias:

```bash
npm install
```

2. Configure a chave em `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
PORT=3000
```

3. Inicie o servidor local:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Deploy no Cloudflare Pages

Este projeto ja esta preparado para Cloudflare Pages com Functions:

- arquivos estaticos na raiz do projeto
- endpoint seguro em `functions/api/chat.js`
- configuracao em `wrangler.toml`

No Cloudflare Pages, use:

- Framework preset: `None`
- Build command: vazio
- Build output directory: `.`

Adicione a variavel de ambiente:

- `GEMINI_API_KEY`

## Observacoes

- Localmente, o chat usa `server.js`.
- No Cloudflare, o chat usa `functions/api/chat.js`.
- O frontend continua chamando apenas `/api/chat`, sem expor chave no navegador.