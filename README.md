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

---

## Status das etapas

- [x] **Etapa 1** — Esqueleto + deploy funcionando
- [ ] Etapa 2 — Hero
- [ ] Etapa 3 — Os 6 blocos do rancho
- [ ] Etapa 4 — Galeria + lightbox
- [ ] Etapa 5 — Calendário de disponibilidade (iCal)
- [ ] Etapa 6 — Regras + Como chegar
- [ ] Etapa 7 — Prova social + CTA
- [ ] Etapa 8 — Páginas /faq e /politicas
- [ ] Etapa 9 — SEO, schema.org, revisão final
