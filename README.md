# Turing Tecnologia

Site institucional com React, JavaScript e Vinext/Vite. Inclui front-end responsivo e backend separado para receber candidaturas no Netlify.

O código está em JavaScript: `.js` para lógica e backend, `.jsx` para os componentes visuais React. Não é necessário configurar TypeScript.

## Publicar pelo GitHub no Netlify

1. Extraia o ZIP e envie **o conteúdo da pasta `turing-tecnologia`** para a raiz do repositório GitHub. `package.json` e `netlify.toml` devem ficar na raiz.
2. No Netlify, importe esse repositório pela opção de criar um projeto a partir do Git.
3. O arquivo `netlify.toml` informa o comando `pnpm run build`, a pasta publicada `dist/client`, Node 22 e as funções em `backend/functions`.
4. Após a publicação, faça uma candidatura de teste e confira o registro em **Data & Storage → Blobs → turing-candidaturas**. Depois remova esse registro de teste pelo painel.

Não é necessário cadastrar tokens no front-end. O Netlify fornece à função as credenciais do armazenamento. O endereço local do front-end, sozinho, não executa o backend.

**Use a importação pelo Git.** Enviar apenas `dist/client` por arrastar e soltar publica o visual, mas não instala as funções do formulário.

## Rodar e verificar

Use Node.js **22.23.2** (`.nvmrc`) e pnpm **11.19.0** (`packageManager`).

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Front-end: `http://localhost:3000`.

```sh
pnpm test
pnpm lint
pnpm build
```

Para executar também as funções localmente, use o CLI oficial do Netlify:

```sh
pnpm dlx netlify-cli dev
```

Acesse `http://localhost:8888`. O Netlify Dev usa armazenamento local; não testa a gravação na conta de produção.

## Organização do código

| Pasta / arquivo                     | Responsabilidade                                              |
| ----------------------------------- | ------------------------------------------------------------- |
| `app/`                              | Página, metadados e estilos                                   |
| `components/landing/`               | Seções, menu, equipe e formulário                             |
| `lib/site-config.js`                | Contatos, logos, projetos, vagas, cursos e endpoint           |
| `lib/team-data.js`                  | Nomes, cargos, fotos, hierarquia e perfis individuais         |
| `lib/social-links.js`               | Normalização dos links das redes sociais                      |
| `lib/applications.js`               | Requisição do front-end para o formulário                     |
| `backend/functions/candidaturas.js` | Endpoint POST `/api/candidaturas` e gravação no Netlify Blobs |
| `backend/handler.js`                | Tratamento HTTP, limites e respostas                          |
| `backend/validation.js`             | Validação dos campos no servidor                              |
| `backend/tests/`                    | Testes do formulário sem utilizar dados reais                 |
| `public/`                           | Logos, fotos e fontes locais                                  |
| `netlify.toml`                      | Build, funções e ambiente local do Netlify                    |

O [guia do backend](backend/README.md) explica os dados recebidos, onde consultar as candidaturas e como trocar o armazenamento. O [guia de manutenção](docs/BACKEND.md) explica os pontos de edição do front-end.

## Conteúdo e interações

- 17 membros em **uma faixa horizontal**, com cada diretor antes da sua equipe. Os nomes exibem o primeiro e o segundo nome.
- Passagem automática: **10 segundos no desktop**, **6 no tablet** e **3 no celular**. Cinco cartões no desktop, dois no tablet e um no celular; setas e gesto de deslizar também funcionam.
- 33 links individuais configurados a partir das capturas e confirmações. Canais ausentes abrem **Contato em breve**.
- Fale Conosco abre o Instagram da Turing; o e-mail oficial fica no rodapé.
- Ver Serviços, Candidate-se e navegação interna têm rolagem suave. Serviços, membros e portfólio têm borda e zoom animados.
- Menu mobile sem Fale Conosco, campos com foco roxo e sete áreas de candidatura.
- Fotos originais enquadradas por CSS. Logos da Turing, SOMA e COVOL-19 incluídas.

Referência visual: [Figma da Turing](https://www.figma.com/design/LHJnQdYMGFV2Nf1GK9wOw6/Turing-Tecnologia?node-id=329-199&p=f). Consulte a [origem das imagens](docs/IMAGENS.md).

O projeto não inclui notificações por e-mail nem painel administrativo próprio. A equipe consulta as candidaturas no painel autorizado do Netlify. Os testes locais usam armazenamento simulado; a gravação na conta deve ser conferida após o primeiro deploy.
