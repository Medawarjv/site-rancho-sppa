// Cálculo do simulador de preços (sem DOM: dá pra testar isolado).
// Datas sempre como "AAAA-MM-DD"; as contas usam UTC pra não sofrer com fuso/horário de verão.
import precos from "../data/precos.json";
import feriados from "../data/feriados.json";

export type Grupo = { adultos: number; meia: number; gratis: number };
export type Oferta = {
  nome: string;
  pct: number;
  limpezaGratis: boolean;
  validaAte: string; // último dia (AAAA-MM-DD) desta fase da oferta
};
export type Estimativa = {
  diarias: number;
  comuns: number;
  especiais: number;
  pessoasEquivalentes: number; // adultos + meia/2 (é o que define a faixa)
  valorComum: number; // custo de 1 diária comum para este grupo
  valorEspecial: number; // custo de 1 diária especial para este grupo
  limpezaDiaria: number;
  limpeza: number; // faxina cobrada (0 com a oferta de faxina grátis)
  subtotalDiarias: number; // diárias sem desconto
  desconto: number; // valor abatido das diárias
  totalCheio: number; // sem oferta nenhuma
  total: number; // o que a pessoa paga
  oferta: Oferta | null;
  porPessoa: number; // total ÷ pessoas equivalentes (criança de 6–14 = meia pessoa)
};

const DIA = 86_400_000;
const paraMs = (k: string) => Date.parse(k + "T00:00:00Z");
const paraChave = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const diaSemana = (ms: number) => new Date(ms).getUTCDay(); // 0 = domingo

/** Hoje no horário de Brasília (AAAA-MM-DD), independente do fuso do aparelho. */
export const hojeBrasilia = () => {
  // Só na versão local (npm run dev): ?hoje=AAAA-MM-DD finge outra data, pra ver as ofertas.
  if (import.meta.env.DEV && typeof location !== "undefined") {
    const fake = new URLSearchParams(location.search).get("hoje");
    if (fake && /^\d{4}-\d{2}-\d{2}$/.test(fake)) return fake;
  }
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
};

/** Noites (pela data da noite) cobradas com tarifa especial: feriados + feriadões. */
export function noitesEspeciais(): Set<string> {
  const folgas = new Set<number>(); // dias sem trabalho por causa de feriado (inclui emendas)
  const uteis: number[] = []; // feriados que caem de segunda a sexta
  const sempre: number[] = []; // Natal e Ano-Novo: especiais mesmo no fim de semana
  for (const f of feriados.feriados as { data: string; sempre?: boolean }[]) {
    const ms = paraMs(f.data);
    const d = diaSemana(ms);
    if (f.sempre) sempre.push(ms);
    if (d === 0 || d === 6) continue; // no fim de semana não muda nada
    folgas.add(ms);
    uteis.push(ms);
    if (d === 4) folgas.add(ms + DIA); // quinta → emenda a sexta
    if (d === 2) folgas.add(ms - DIA); // terça → emenda a segunda
  }
  const livre = (ms: number) => {
    const d = diaSemana(ms);
    return d === 0 || d === 6 || folgas.has(ms);
  };
  const noites = new Set<string>(feriados.noitesExtras as string[]);
  for (const ms of sempre) {
    noites.add(paraChave(ms - DIA)); // véspera (24/12, 31/12)
    noites.add(paraChave(ms)); // a noite do próprio dia
  }
  for (const ms of uteis) {
    let ini = ms;
    let fim = ms;
    while (livre(ini - DIA)) ini -= DIA;
    while (livre(fim + DIA)) fim += DIA;
    // da véspera do 1º dia livre até a noite anterior ao último dia livre
    for (let n = ini - DIA; n < fim; n += DIA) noites.add(paraChave(n));
  }
  return noites;
}

/** Índice da faixa pelo nº de pessoas equivalentes. */
const faixaDe = (eq: number) => Math.max(0, precos.faixas.findIndex((f) => eq <= f.ate));

/** Custo de UMA diária para o grupo: faixa pelo nº de pessoas equivalentes,
 *  mínimo da 1ª faixa e o total nunca menor que o teto da faixa anterior. */
export function custoDiaria(equivalentes: number, tipo: "comum" | "especial"): number {
  const faixas = precos.faixas;
  const i = faixaDe(equivalentes);
  const piso = i === 0 ? faixas[0].ate * faixas[0][tipo] : faixas[i - 1].ate * faixas[i - 1][tipo];
  return Math.max(equivalentes * faixas[i][tipo], piso);
}

/** Oferta de última hora, vista de "hoje", para uma estadia que inclua a noite de
 *  sexta ou de sábado (chegar na quinta também vale). Os dias contam até a sexta
 *  desse fim de semana; a oferta vale no máximo até o dia da chegada. */
export function ofertaUltimaHora(inicio: string, fim: string, hoje: string): Oferta | null {
  const cfg = precos.ultimaHora;
  if (!cfg.ativo) return null;
  const ms = paraMs(inicio);
  let sexta: number | null = null;
  for (let n = ms; n < paraMs(fim); n += DIA) {
    const d = diaSemana(n);
    if (d === 5 || d === 6) {
      sexta = d === 5 ? n : n - DIA;
      break;
    }
  }
  if (sexta === null) return null;
  const faltam = Math.round((sexta - paraMs(hoje)) / DIA);
  for (const f of cfg.fases) {
    if (faltam <= f.de && faltam >= f.ate) {
      // a fase acaba quando faltam "ate" dias (a última vai até o dia da chegada)
      const fim = Math.min(sexta - f.ate * DIA, ms);
      return { nome: f.nome, pct: f.pct, limpezaGratis: f.limpezaGratis, validaAte: paraChave(fim) };
    }
  }
  return null;
}

export function estimar(
  inicio: string,
  fim: string,
  g: Grupo,
  especiais: Set<string>,
  hoje: string = hojeBrasilia(),
): Estimativa {
  const diarias = Math.round((paraMs(fim) - paraMs(inicio)) / DIA);
  let especiaisN = 0;
  for (let i = 0; i < diarias; i++) {
    if (especiais.has(paraChave(paraMs(inicio) + i * DIA))) especiaisN++;
  }
  const comuns = diarias - especiaisN;
  const eq = g.adultos + g.meia / 2;
  const valorComum = custoDiaria(eq, "comum");
  const valorEspecial = custoDiaria(eq, "especial");
  const limpezaDiaria = precos.faixas[faixaDe(eq)].limpeza;
  const subtotalDiarias = comuns * valorComum + especiaisN * valorEspecial;
  const limpezaCheia = diarias * limpezaDiaria;
  const totalCheio = Math.round(subtotalDiarias + limpezaCheia);

  const oferta = diarias > 0 ? ofertaUltimaHora(inicio, fim, hoje) : null;
  const desconto = oferta ? Math.round((subtotalDiarias * oferta.pct) / 100) : 0;
  const limpeza = oferta?.limpezaGratis ? 0 : limpezaCheia;
  const total = Math.round(subtotalDiarias - desconto + limpeza);
  return {
    diarias,
    comuns,
    especiais: especiaisN,
    pessoasEquivalentes: eq,
    valorComum,
    valorEspecial,
    limpezaDiaria,
    limpeza,
    subtotalDiarias,
    desconto,
    totalCheio,
    total,
    oferta: oferta && total < totalCheio ? oferta : null,
    porPessoa: eq > 0 ? Math.round(total / eq) : total,
  };
}

export const reais = (v: number) =>
  "R$ " + Math.round(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 });

/** "sexta, 13/11" → para dizer até quando vale a oferta (espaço que não quebra). */
export const diaCurto = (k: string) => {
  const sem = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][diaSemana(paraMs(k))];
  return `${sem}, ${k.slice(8, 10)}/${k.slice(5, 7)}`;
};

export { precos };
