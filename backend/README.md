# Backend de candidaturas

Esta pasta contém o servidor do formulário. O Netlify publica `functions/candidaturas.js` como uma Function em `/api/candidaturas`. A configuração fica no `netlify.toml` da raiz; as dependências ficam no `package.json` da raiz.

## Fluxo

1. O front-end envia JSON para `/api/candidaturas`.
2. `handler.js` verifica método, origem, formato, tamanho e campo antispam.
3. `validation.js` valida os dados e remove campos não previstos.
4. A função grava um JSON no Netlify Blobs, com identificador aleatório e data UTC.
5. Somente depois da gravação retorna `201` com `{ "success": true }`.

Em produção, o store é **`turing-candidaturas`**. Previews e testes usam **`turing-candidaturas-testes`**, sem misturar com candidaturas reais. Os registros de produção continuam disponíveis após novos deploys.

## Consultar candidaturas

Na conta do Netlify que hospeda o site, abra **Data & Storage → Blobs**, selecione `turing-candidaturas` e abra ou baixe os registros JSON. As chaves seguem `AAAA-MM-DD/identificador`. Esse acesso depende das permissões da equipe na conta Netlify.

Não existe rota pública para listar ou baixar candidaturas. A API somente recebe envios. Não há envio automático de e-mail.

## Contrato

```http
POST /api/candidaturas
Content-Type: application/json
```

```json
{
  "nome": "Pessoa de Teste",
  "matricula": "2025012345",
  "email": "teste@example.com",
  "celular": "(84) 9 9999-9999",
  "periodoIngresso": "2025.1",
  "curso": "sistemas-de-informacao",
  "github": "github.com/usuario-teste",
  "area": "front-end",
  "website": ""
}
```

`github` é opcional. `website` é um campo antispam e deve ficar vazio; não é armazenado. Os demais campos são obrigatórios. O período aceita ano e semestre 1 ou 2 (`2025.1`, `2025/1` ou `2025-1`). O celular precisa de 10 a 15 dígitos, com DDD. Perfis GitHub são normalizados para HTTPS.

Cursos: `sistemas-de-informacao`, `licenciatura-em-informatica`.

Áreas: `rh`, `back-end`, `front-end`, `ui-ux`, `marketing`, `consultoria`, `financeiro`.

| Status    | Significado                                                   |
| --------- | ------------------------------------------------------------- |
| 201       | Candidatura salva                                             |
| 400 / 422 | JSON, antispam ou campos inválidos                            |
| 403       | Origem de outro site                                          |
| 405       | Método diferente de POST                                      |
| 413       | Corpo maior que 8 KiB                                         |
| 415       | Formato diferente de JSON                                     |
| 429       | Limite do Netlify: 10 requisições por minuto por IP e domínio |
| 503       | Não foi possível persistir o registro                         |

Erros retornam `{ "success": false, "message": "..." }`. A interface mantém os campos quando o envio falha. A função não registra dados pessoais nem credenciais nos logs.

## Manutenção

- Altere vagas e cursos em `lib/site-config.js`: front-end e validação usam as mesmas listas.
- Altere regras dos campos em `backend/validation.js`.
- Para trocar Blobs por outro banco, substitua apenas a função de gravação passada a `handleApplication` em `backend/functions/candidaturas.js`.
- Segredos de uma futura integração devem ficar nas variáveis do Netlify com escopo de Functions, nunca no navegador ou GitHub.
- A equipe deve definir o prazo de retenção e excluir os registros que não precisam mais ser mantidos.

## Testes

Na raiz, execute `pnpm test`. Os testes verificam sucesso após gravação, falha de armazenamento, validação, origem, métodos e tamanho. O armazenamento é simulado; não há envio de candidaturas reais.

Use `pnpm dlx netlify-cli dev` e a porta `8888` para o ambiente completo. Depois do deploy inicial, envie um registro fictício pelo formulário e confirme a gravação no store de produção.

Referências oficiais: [Functions](https://docs.netlify.com/build/functions/api/), [Blobs e consulta no painel](https://docs.netlify.com/build/data-and-storage/netlify-blobs/), [limite de requisições](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/).
