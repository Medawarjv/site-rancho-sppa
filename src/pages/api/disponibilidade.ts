import type { APIRoute } from "astro";

// Roda como função serverless na Vercel (não é pré-renderizado).
export const prerender = false;

/**
 * Lê o iCal secreto do Google Calendar (URL na env ICAL_URL) e devolve
 * apenas a lista de dias OCUPADOS (YYYY-MM-DD). Nunca expõe a URL nem os
 * detalhes dos eventos. Se algo falhar, devolve { ok: false } — o site então
 * esconde o calendário e mostra só o WhatsApp (nunca marca "livre" por engano).
 */
export const GET: APIRoute = async () => {
  const url = import.meta.env.ICAL_URL ?? process.env.ICAL_URL;

  const semDados = (motivo: string) =>
    json({ ok: false, motivo }, 60); // cache curto quando não há dados

  if (!url) return semDados("sem-url");

  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) return semDados("http-" + res.status);

    const texto = await res.text();
    const ocupados = parseOcupados(texto);
    return json({ ok: true, ocupados }, 3600); // cache de 1h no edge
  } catch {
    return semDados("erro-fetch");
  }
};

function json(data: unknown, maxAge: number) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, s-maxage=${maxAge}, stale-while-revalidate=86400`,
    },
  });
}

/** Extrai o conjunto de dias ocupados a partir do texto iCal. */
function parseOcupados(ical: string): string[] {
  // Desdobra linhas continuadas (que começam com espaço/tab).
  const linhas = ical.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);

  const dias = new Set<string>();
  let dentro = false;
  let dtstart = "";
  let dtend = "";
  let allDay = false;
  let cancelado = false;

  for (const linha of linhas) {
    if (linha === "BEGIN:VEVENT") {
      dentro = true;
      dtstart = dtend = "";
      allDay = false;
      cancelado = false;
      continue;
    }
    if (linha === "END:VEVENT") {
      if (dentro && dtstart && !cancelado) adicionarDias(dias, dtstart, dtend, allDay);
      dentro = false;
      continue;
    }
    if (!dentro) continue;

    const nome = linha.split(/[:;]/, 1)[0];
    const valor = linha.slice(linha.indexOf(":") + 1).trim();

    if (nome === "DTSTART") {
      dtstart = valor;
      allDay = /VALUE=DATE(?!-TIME)/.test(linha) || /^\d{8}$/.test(valor);
    } else if (nome === "DTEND") {
      dtend = valor;
    } else if (nome === "STATUS" && valor.toUpperCase() === "CANCELLED") {
      cancelado = true;
    }
  }

  return [...dias].sort();
}

/** Converte "20260115" ou "20260115T090000Z" em Date (UTC, meio-dia). */
function paraData(v: string): Date | null {
  const m = v.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12, 0, 0));
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function adicionarDias(dias: Set<string>, dtstart: string, dtend: string, allDay: boolean) {
  const inicio = paraData(dtstart);
  if (!inicio) return;
  let fim = dtend ? paraData(dtend) : null;
  if (!fim) fim = new Date(inicio);

  // Em eventos de dia inteiro o DTEND é exclusivo (o dia do check-out fica livre).
  if (allDay) fim.setUTCDate(fim.getUTCDate() - 1);
  if (fim < inicio) fim = new Date(inicio);

  const cursor = new Date(inicio);
  let guarda = 0;
  while (cursor <= fim && guarda < 400) {
    dias.add(fmt(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    guarda++;
  }
}
