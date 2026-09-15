# Site Rancho SPPA

Site institucional do Rancho SPPA (Sítio do Pica Pau Amarelo) — aluguel por temporada em Indianópolis-MG.

Feito em **Astro + Tailwind**. Site estático, sem WordPress, sem painel, sem banco de dados.

---

## Para desenvolver no seu computador

```bash
npm install     # só na primeira vez
npm run dev     # abre em http://localhost:4321
```

---

## Como mexer no conteúdo (sem ser programador)

> Ainda estamos montando o site. Esta seção cresce a cada etapa.

### Trocar o número do WhatsApp
Abra `src/data/site.json` e mude o campo `"whatsapp"`.
Use só números, com o código do país: `55` + DDD + número. Sem espaços, sem `+`, sem traço.
Exemplo: `553498765432`.

### Trocar uma foto
*(chega na etapa das fotos)* As fotos ficam em `public/fotos/`, separadas por ambiente.

### Trocar um texto
*(chega nas próximas etapas)* Os textos ficam em `src/content/`.

### Ativar / trocar o calendário de disponibilidade
O site lê os dias ocupados de um Google Calendar. **Enquanto a URL não for configurada, o site mostra só o botão de WhatsApp** (nunca marca "disponível" por engano).

Para ativar:
1. No Google Calendar → **Configurações** → clique no calendário das reservas → **"Integrar agenda"** → copie o **"Endereço secreto no formato iCal"** (termina em `.ics`).
2. No painel da **Vercel** → projeto → **Settings → Environment Variables** → adicione:
   - **Name:** `ICAL_URL`
   - **Value:** a URL secreta do iCal
3. **Redeploy** (Deployments → ⋯ → Redeploy). Pronto, o calendário passa a mostrar os dias ocupados.

A Lorena só precisa marcar cada reserva como **evento de dia inteiro** (do check-in ao check-out). A URL secreta fica só na Vercel — **nunca aparece no site**.

---

## Status das etapas

- [x] **Etapa 1** — Esqueleto + deploy funcionando
- [x] **Etapa 2** — Hero (foto da propriedade + frase + CTA)
- [x] **Etapa 3** — Os 6 blocos do rancho (fotos + texto)
- [x] **Etapa 4** — Galeria (15 fotos) + lightbox, responsivo no celular
- [x] **Etapa 5** — Calendário de disponibilidade (infra pronta; falta plugar a URL do iCal — ver abaixo)
- [x] **Etapa 6** — Regras principais + Como chegar (mapa)
- [x] **Etapa 7** — Avaliações (Google 4,7★) + CTA final
- [ ] Etapa 8 — Páginas /faq e /politicas
- [ ] Etapa 9 — SEO, schema.org, revisão final
