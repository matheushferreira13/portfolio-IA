# Portfolio IA

Portfolio pessoal com chat de IA, projetos em carrossel, lightbox de midia e backend seguro para Gemini.

## Execucao local

1. Instale as dependencias:

```bash
npm install
```

2. Configure as variaveis em `.env`:

```env
GEMINI_API_KEY=sua_chave_aqui
PORT=3000
RESEND_API_KEY=sua_chave_resend_aqui
CONTACT_TO_EMAIL=seu_email_destino@dominio.com
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
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
- endpoint de contato em `functions/api/contact.js`
- configuracao em `wrangler.toml`

No Cloudflare Pages, use:

- Framework preset: `None`
- Build command: vazio
- Build output directory: `.`

Adicione as variaveis de ambiente:

- `GEMINI_API_KEY`
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

## Observacoes

- Localmente, chat e contato usam `server.js`.
- No Cloudflare, chat e contato usam `functions/api/chat.js` e `functions/api/contact.js`.
- O frontend continua chamando apenas `/api/chat` e `/api/contact`, sem expor chaves no navegador.