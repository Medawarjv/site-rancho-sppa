# Site Rancho SPPA — escopo para o Claude Code

## 1. Situação

O Rancho SPPA (Sítio do Pica Pau Amarelo) é um rancho de aluguel por temporada em Indianópolis-MG, às margens da Represa de Miranda, a ~60 km de Uberlândia. Opera desde 2001. Pertence ao meu pai; a Lorena faz o atendimento e fecha as reservas por WhatsApp.

Uma agência começou um site novo em WordPress + Elementor + plugin WP Booking System, mas está atrasada há meses e a entrega está ruim. Estou assumindo e vou **refazer do zero**, sem WordPress. O site antigo (também WordPress) está em `sppa.com.br` e será substituído.

Referência do que a agência fez (só pra ver estrutura e textos, não copiar layout): https://solutionsdigitaloficial.com.br/

## 2. Objetivo do site

Um site institucional simples que faz três coisas:

1. Mostrar a estrutura do rancho (fotos + texto) e convencer a pessoa a chamar no WhatsApp
2. Mostrar a **disponibilidade por período** (não por horário) para reduzir mensagens inúteis
3. Responder as dúvidas básicas (FAQ) para a Lorena não repetir sempre a mesma coisa

Prioridade absoluta: **zero manutenção técnica**. Meu pai não vai entrar em painel nenhum. A única pessoa que atualiza algo é a Lorena, e só no Google Calendar.

## 3. Decisões já tomadas (não reabrir)

- **Nenhum preço no site.** Quem informa valor é a Lorena. Regras sem valor podem aparecer (mínimo de diárias, horário, sinal de 50%).
- **Não existe reserva online.** O botão principal é "Consultar disponibilidade" e leva pro WhatsApp com mensagem pré-preenchida. Nunca "Reservar agora".
- **Disponibilidade vem de um Google Calendar** público (modo "somente ocupado/livre") que a Lorena mantém. O site lê o iCal e renderiza um calendário mensal com os dias ocupados. Se a leitura falhar, mostra só o botão de WhatsApp — nunca mostra "disponível" por engano.
- **Stack:** site estático. Astro + Tailwind, deploy na Vercel ou Cloudflare Pages, domínio `sppa.com.br` (Registro.br, já é nosso). Sem CMS, sem banco, sem plugin. Conteúdo em arquivos Markdown/JSON no repositório.
- **Sem serviços de parceiros com preço.** Cozinheira, churrasqueiro, lancha etc. aparecem só como "indicamos contato".
- Idioma: pt-BR. Mobile first — quase todo acesso vem do Instagram/WhatsApp no celular.

## 4. Estrutura do site (uma página longa + 2 páginas de apoio)

**Home (página única, rolagem):**
1. Hero — foto forte + frase + botão WhatsApp
2. O rancho em 6 blocos: piscina aquecida (solar) / quiosque com churrasqueira, fogão a lenha e forno de pizza / acomodações (10 suítes com ar, até 30 pessoas) / esportes (campo, quadra de beach tennis, quadra de tênis, sinuca, ping-pong) / natureza (7 ha, trilhas, riacho, cachoeira, pomar) / represa (450 m de margem, píer, tablado de pesca, redutor para lancha)
3. Galeria de fotos (lightbox simples)
4. Calendário de disponibilidade (Google Calendar → iCal)
5. Regras principais (sem valores): diária por pessoa, mínimo de 2 diárias para pernoite, sinal de 50% via PIX, caução na chegada, check-in/check-out, pets permitidos com regras
6. Como chegar — mapa embed + texto (BR-365 via Indianópolis, ~4,5 km de terra no final, ~1h de Uberlândia)
7. Prova social — avaliações (temos página no Facebook com 94% de recomendação; textos das avaliações eu forneço)
8. CTA final — WhatsApp

**/faq** — 10 perguntas, texto já pronto (eu forneço).
**/politicas** — regras completas de reserva, cancelamento e uso, texto do contrato adaptado (eu forneço).

Botão flutuante de WhatsApp em todas as páginas.

## 5. Calendário de disponibilidade — como funciona

- Lorena cria um evento no Google Calendar para cada reserva fechada (dia inteiro, do check-in ao check-out).
- O calendário é publicado como "ver apenas disponível/ocupado" e o site usa a URL iCal secreta.
- O site busca o iCal **no build** (revalidação a cada X horas via cron do deploy) ou no cliente via função serverless que faz proxy — decidir pelo mais simples que funcione na Vercel/Cloudflare. Não expor a URL do iCal no HTML.
- Renderiza mês atual + 5 seguintes, dia ocupado em cinza, livre em verde. Legenda: "Ocupado / Disponível — confirme no WhatsApp".
- Clique em um dia livre → abre WhatsApp com a mensagem "Olá, quero consultar disponibilidade para [data]".

## 6. O que eu forneço

- Fotos em alta resolução (vou organizar em pastas por ambiente)
- Textos: descrição, FAQ (10 perguntas), regras/políticas, avaliações
- Número do WhatsApp da Lorena
- URL iCal do Google Calendar
- Logo (se não houver em vetor, o site usa só tipografia com o nome)

## 7. Fora de escopo (v1)

Reserva/pagamento online, painel administrativo, blog, área de eventos com orçamento, multi-idioma, integração com Airbnb/Booking.

## 8. Critérios de pronto

- Lighthouse mobile ≥ 90 em performance
- Funciona sem JavaScript exceto o calendário e o lightbox
- Deploy automático via git push
- README com: como trocar uma foto, como trocar um texto, como trocar o número do WhatsApp — em linguagem que uma pessoa não técnica consiga seguir
- SEO básico: title/description, Open Graph, schema.org `LodgingBusiness` + `FAQPage`, sitemap

---

## Prompt de pontapé (colar no Claude Code)

```
Leia o arquivo ESCOPO_SITE_RANCHO_SPPA.md nesta pasta. Ele descreve um site estático para um rancho de aluguel por temporada. Todas as decisões de produto já estão tomadas lá — não proponha reserva online, CMS ou WordPress.

Antes de escrever código, faça o seguinte e me mostre para aprovação:
1. Estrutura de pastas do projeto Astro + Tailwind, com onde ficam fotos, textos (Markdown/JSON) e configuração (número do WhatsApp, URL iCal).
2. Como você pretende implementar o calendário de disponibilidade a partir do iCal do Google Calendar, com a opção mais simples de hospedar na Vercel, e o comportamento de fallback se o iCal falhar.
3. Lista de tudo que você precisa de mim para começar (fotos, textos, chaves).

Só depois da minha aprovação, inicialize o projeto. Trabalhe em etapas pequenas: primeiro o esqueleto com conteúdo placeholder e deploy funcionando, depois seção por seção. A cada etapa, me mostre o que fez e o que vem a seguir. Não avance duas etapas sem eu aprovar.

Contexto sobre mim: sou "vibe coder", sei o básico, prefiro explicações curtas e diretas. Se algo no escopo for tecnicamente ruim, diga e proponha alternativa — não implemente calado.
```
