# Imagens do site

## Equipe

As 17 fotos ficam em `public/images/membros`. Os arquivos originais foram preservados. As 14 fotos da pasta de respostas do formulário foram associadas pelos nomes dos arquivos; Pedro Augusto, Francisco e Wellington usam os anexos enviados na conversa. Os enquadramentos ficam em `photoFocus`, no cadastro `lib/team-data.js`, sem recortar ou modificar os arquivos.

## Portfólio

- `public/images/projetos/covol-19.jpg`: logo original de 256 × 112 pixels do [repositório da Turing](https://github.com/Turing-Tecnologia/COVOL-19/blob/master/public/logo.jpg). A apresentação limita a largura para evitar ampliar desnecessariamente uma imagem pequena.
- `public/images/projetos/soma-reference.jpg`: captura de referência de 872 × 552 pixels, também disponível no [site anterior da Turing](https://turing.netlify.app/assets/img/portfolio/soma.jpg).
- `public/images/projetos/soma-logo.png`: versão de 2172 × 724 pixels melhorada com a ferramenta integrada `image_gen`, a partir da captura enviada. É uma reconstrução da imagem raster, não um arquivo vetorial oficial. Usa fundo azul-marinho para combinar com o cartão. Se a empresa disponibilizar o arquivo original da marca, substitua este PNG e mantenha o caminho configurado.

Prompt inicial usado na ferramenta integrada:

> Extract ONLY the existing SOMA logo at the top left (the small white geometric four-arm symbol and the exact white uppercase word SOMA beside it). Improve its resolution and sharpen clean edges faithfully, preserving the existing letter shapes, symbol geometry, proportions and spacing. Make it a standalone horizontal logo with an actually transparent background, suitable for display on a dark navy website project card. Output the logo large and centered with modest transparent padding; no website screenshot, no navigation, no slogan, no extra text, no invented brand details, no shadows, no new symbol, no redesign. Exact text: SOMA. Preserve the source identity as closely as possible.

O primeiro resultado não tinha transparência utilizável. A versão final usa esta correção de fundo:

> Keep the existing SOMA white logo lettering and four-arm symbol in the exact same positions and proportions. Change ONLY the background and surface cleanliness: replace ALL checkerboard pattern and ALL scratches/scribbles/textures with one perfectly uniform solid dark navy color #1B264B. Make the white symbol and letters perfectly flat solid white with sharp clean edges and no texture or shadows. This is a flat logo asset on navy, not transparent, not a mockup. No checkerboard anywhere. Do not add anything or redesign the logo. Preserve exact text SOMA.

## Marca Turing

`public/images/logo-gradiente.png` e `public/images/logo-branca.png` são os PNGs originais enviados, de 536 × 600 pixels, preservados com transparência. A marca gradiente também é usada como ícone da aba.
