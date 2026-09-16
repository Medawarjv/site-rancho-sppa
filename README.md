# Site do Rancho SPPA — guia de manutenção

Site do **Rancho SPPA / Sítio do Pica Pau Amarelo** (Indianópolis-MG). Este guia é para quem
precisa trocar uma foto, um texto ou o número do WhatsApp **sem saber programar**.

- Site no ar: https://sppa.com.br (enquanto o domínio não entra: https://site-rancho-sppa.vercel.app)
- Código: https://github.com/Medawarjv/site-rancho-sppa
- Hospedagem: Vercel (publica sozinha a cada alteração enviada ao GitHub, em ~2 minutos)

---

## Como publicar uma alteração (vale para tudo abaixo)

Toda mudança segue o mesmo caminho: **alterar o arquivo → enviar para o GitHub → a Vercel publica sozinha**.

**Pelo site do GitHub (sem instalar nada):**
1. Abra o repositório no GitHub e navegue até o arquivo (ex.: `src/data/site.json`).
2. Clique no lápis ✏️ ("Edit this file"), faça a alteração.
3. Desça, clique em **Commit changes** (pode deixar a mensagem padrão).
4. Em ~2 minutos o site está atualizado. Se não aparecer, recarregue com Ctrl+F5.

**Para trocar fotos** pelo GitHub: entre na pasta, clique em **Add file → Upload files**, arraste a foto
com o **mesmo nome** da que quer substituir e confirme o commit.

---

## Trocar o número do WhatsApp

Arquivo: `src/data/site.json`

```json
"whatsapp": "553491533922",
```

Formato: **55 + DDD + número, só dígitos**, sem espaços, traços ou +. Esse número vale para o site
inteiro (todos os botões, o calendário e o botão flutuante).

Na mesma tela dá para trocar o Instagram (`"instagram"`) e a mensagem inicial do botão flutuante
(`"whatsappMensagem"`).

---

## Trocar textos

| O que | Arquivo |
|---|---|
| Perguntas frequentes (pergunta e resposta) | `src/data/faq.json` |
| Avaliações (nome, texto, data) e a nota/total do Google | `src/data/avaliacoes.json` |
| Regras principais (os 6 cards na home) | `src/components/Regras.astro` — lista `regras` no topo |
| Políticas completas (página /politicas) | `src/pages/politicas.astro` — lista no topo |
| Os 6 blocos "Tudo que o rancho oferece" | `src/pages/index.astro` — lista `blocos` |
| Frase e subtítulo do hero | `src/pages/index.astro` — procure "Seu refúgio" |
| Comodidades e parceiros | `src/components/Comodidades.astro` — listas `comodidades` e `parceiros` |
| Barra de fatos (Até 30 pessoas, 10 suítes…) | `src/components/BarraFatos.astro` |

Regras de ouro ao editar:
- Troque **só o texto entre aspas**. Não apague aspas, vírgulas nem chaves `{ }`.
- Se o texto tiver aspas dentro, use as curvas “ ” em vez de `"`.
- Em `.json`, o **último item da lista não leva vírgula** depois.

---

## Trocar fotos

Tamanho ideal: **lado maior entre 1600 e 2000 px**, formato JPG. O site gera sozinho as versões
menores e em WebP. Não precisa (nem deve) subir foto de 4000 px.

| Onde aparece | Arquivo |
|---|---|
| Foto grande do topo (hero) | `src/assets/hero.jpg` (horizontal, ~1920 px) |
| Os 6 cards da estrutura | `src/assets/bloco-piscina.jpg`, `bloco-quiosque.jpg`, `bloco-acomodacoes.jpg`, `bloco-esportes.jpg`, `bloco-natureza.jpg`, `bloco-represa.jpg` |
| Banner da seção de comodidades | `src/assets/comodidades.jpg` |
| Galeria | `src/assets/galeria/<tema>/01.jpg, 02.jpg…` (temas: `lazer`, `esportes`, `natureza`, `quiosque`, `acomodacoes`) |
| Imagem de compartilhamento (WhatsApp/redes) | `public/og.jpg` (1600×1200) |
| Fotos dos avaliadores | `public/avatars/nome.png` (96×96) |

**Galeria:** para trocar uma foto, substitua o arquivo mantendo o nome (ex.: `lazer/03.jpg`).
Para **adicionar**, crie o próximo número (`08.jpg`) e inclua a legenda em
`src/components/Galeria.astro`, na lista `legendas` (é uma linha por foto). Para **remover**, apague
o arquivo e a linha da legenda. A galeria corta as fotos em 4:3 — prefira fotos horizontais.

O acervo bruto de fotos (organizado por assunto) fica na pasta `imagens/` **só no computador** —
não vai para o GitHub. Tem um `imagens/README.md` explicando as pastas.

---

## Calendário de disponibilidade

O site **lê** uma agenda do Google Calendar chamada **"Reservas Rancho SPPA"** e mostra em cinza
os dias com evento. Só quem edita a agenda muda as datas — o site nunca marca nada sozinho.

**Rotina da atendente:** depois do pagamento, criar um evento **de dia inteiro**, do dia da chegada
**até** o dia da saída, com o nome do cliente, **na agenda "Reservas Rancho SPPA"** (não na
pessoal). O site atualiza em até 1 hora. Cancelou? Apaga o evento.

**Se o calendário sumir do site** e aparecer só "consultar pelo WhatsApp": a leitura da agenda
falhou. Verifique na Vercel (projeto → Settings → Environment Variables) se `ICAL_URL` existe e
contém o "Endereço secreto em formato iCal" da agenda (Google Calendar → configurações da agenda
→ Integrar agenda). Se o endereço foi redefinido no Google, cole o novo e faça **Redeploy**.

Esse endereço é uma senha: nunca coloque em arquivo do site nem mande para clientes.

---

## Se algo quebrar

- O site mostra a versão anterior até um novo envio dar certo, então uma edição errada não derruba
  o site — ela simplesmente não publica. Na Vercel, aba **Deployments**, o envio aparece com ❌ e
  o motivo (quase sempre uma vírgula ou aspas a mais/a menos em um `.json`).
- Para desfazer: no GitHub, no histórico do arquivo ("History"), abra a versão anterior e restaure.

---

## O que o site tem

Home (página única): hero com marca e WhatsApp · barra de fatos · 6 blocos da estrutura · galeria
por tema com lightbox · calendário de disponibilidade (Google Calendar → iCal) com seleção de
período e pedido pelo WhatsApp · regras principais · como chegar (mapa) · comodidades e parceiros
indicados · avaliações do Google · CTA final. Páginas de apoio: `/faq`, `/politicas`, `/404`.
Botão flutuante de WhatsApp em todas. SEO: title/description, Open Graph, schema.org
(LodgingBusiness, FAQPage, BreadcrumbList), sitemap, robots. Sem cookies, sem rastreamento.

## Para quem programa

Astro 5 + Tailwind CSS 4, hospedado na Vercel (`@astrojs/vercel` v8 — não subir para v11, exige
Astro 7). `npm install` → `npm run dev` (http://127.0.0.1:4321). Crie um `.env` com `ICAL_URL=...`
para o calendário funcionar localmente. `npm run build` gera `dist/`. Endpoint serverless:
`src/pages/api/disponibilidade.ts`. Fontes self-hosted via `@fontsource` (import em `global.css`).
