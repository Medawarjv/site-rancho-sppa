# Site Rancho SPPA

Site do Rancho SPPA (Sítio do Pica Pau Amarelo) — aluguel por temporada em Indianópolis-MG, às margens da Represa de Miranda.

Feito em **Astro + Tailwind**. É um site estático (rápido e barato), **sem WordPress, sem painel e sem banco de dados**. Está publicado na **Vercel** e todo `git push` no GitHub **atualiza o site sozinho** em ~1 minuto.

- **Site no ar:** https://site-rancho-sppa.vercel.app (domínio final: `sppa.com.br`)
- **Código:** https://github.com/Medawarjv/site-rancho-sppa

---

## ✏️ Como mudar o conteúdo (sem ser programador)

O jeito mais fácil é **editar direto no GitHub**, pelo navegador — não precisa instalar nada:

1. Entre no repositório no GitHub e abra o arquivo que você quer mudar.
2. Clique no **lápis** (✏️ "Edit this file").
3. Faça a mudança e clique em **"Commit changes"** (botão verde).
4. Pronto: em ~1 minuto o site atualiza sozinho.

> Dica: sempre que mexer, mude **só o texto entre aspas** e não apague vírgulas, chaves `{ }` ou colchetes `[ ]`.

### 📞 Trocar o número do WhatsApp
Arquivo: **`src/data/site.json`** → campo `"whatsapp"`.
Use só números: `55` + DDD + número, **sem** espaços, `+` ou traço.
Exemplo: `553491533922`.

### 🖼️ Trocar uma foto
As fotos ficam em **`src/assets/`**. Para trocar, suba uma foto nova **com o mesmo nome** do arquivo atual (assim o site usa a nova no lugar):
- **Foto principal (topo):** `src/assets/hero.jpg`
- **Fotos dos 6 blocos:** `src/assets/bloco-piscina.jpg`, `bloco-quiosque.jpg`, `bloco-acomodacoes.jpg`, `bloco-esportes.jpg`, `bloco-natureza.jpg`, `bloco-represa.jpg`
- **Galeria:** `src/assets/galeria/g01.jpg` até `g15.jpg`

### 📝 Trocar textos
- **Perguntas frequentes (/faq):** `src/data/faq.json`
- **Avaliações:** `src/data/avaliacoes.json`
- **Regras principais:** `src/components/Regras.astro`
- **Endereço / link do mapa:** `src/data/site.json`
- **Textos dos 6 blocos e do topo:** `src/pages/index.astro`

### 📅 Ativar / trocar o calendário de disponibilidade
O site lê os dias ocupados de um Google Calendar. **Enquanto a URL não for configurada, o site mostra só o botão de WhatsApp** — nunca marca "disponível" por engano.

Para ativar:
1. No **Google Calendar** → **Configurações** → clique no calendário das reservas → **"Integrar agenda"** → copie o **"Endereço secreto no formato iCal"** (termina em `.ics`).
2. No painel da **Vercel** → projeto → **Settings → Environment Variables** → adicione:
   - **Name:** `ICAL_URL`
   - **Value:** a URL secreta do iCal
3. **Redeploy** (Deployments → ⋯ → Redeploy). Pronto.

A Lorena só precisa marcar cada reserva como **evento de dia inteiro** (do check-in ao check-out). A URL secreta fica **só na Vercel** — nunca aparece no site.

---

## 💻 Para mexer no computador (opcional, para quem programa)

```bash
npm install     # só na primeira vez
npm run dev     # abre em http://localhost:4321
npm run build   # gera o site final
```

---

## ✅ O que o site tem

- Página única com: topo, "O rancho" (6 blocos), galeria com lightbox, calendário de disponibilidade, regras, como chegar (mapa), avaliações do Google e chamada final.
- Páginas de apoio: **/faq** e **/politicas**.
- Botão flutuante de WhatsApp em todas as páginas.
- SEO: título/descrição, Open Graph (prévia bonita no WhatsApp/Instagram), dados do Google (`LodgingBusiness` + `FAQPage`), sitemap.
- Mobile-first, otimizado para celular.

## Status das etapas

- [x] **Etapa 1** — Esqueleto + deploy funcionando
- [x] **Etapa 2** — Hero (foto da propriedade + frase + CTA)
- [x] **Etapa 3** — Os 6 blocos do rancho (fotos + texto)
- [x] **Etapa 4** — Galeria (15 fotos) + lightbox, responsivo no celular
- [x] **Etapa 5** — Calendário de disponibilidade (infra pronta; falta plugar a URL do iCal — ver acima)
- [x] **Etapa 6** — Regras principais + Como chegar (mapa)
- [x] **Etapa 7** — Avaliações (Google 4,7★) + CTA final
- [x] **Etapa 8** — Páginas /faq (10 perguntas) e /politicas
- [x] **Etapa 9** — SEO, schema.org, sitemap e revisão final
