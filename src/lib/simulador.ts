// Cálculo do simulador de preços (sem DOM: dá pra testar isolado).
// Datas sempre como "AAAA-MM-DD"; as contas usam UTC pra não sofrer com fuso/horário de verão.
import precos from "../data/precos.json";
import feriados from "../data/feriados.json";

export type Grupo = { adultos: number; meia: number; gratis: number };
export type Estimativa = {
  diarias: number;
  comuns: number;
  especiais: number;
  pessoasEquivalentes: number; // adultos + meia/2 (é o que define a faixa)
  valorComum: number; // custo de 1 diária comum para este grupo
  valorEspecial: number; // custo de 1 diária especial para este grupo
  limpeza: number;
  total: number;
  porPessoa: number; // total ÷ pessoas equivalentes (criança de 6–13 = meia pessoa)
};

const DIA = 86_400_000;
const paraMs = (k: string) => Date.parse(k + "T00:00:00Z");
const paraChave = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const diaSemana = (ms: number) => new Date(ms).getUTCDay(); // 0 = domingo

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

/** Custo de UMA diária para o grupo: faixa pelo nº de pessoas equivalentes,
 *  mínimo da 1ª faixa e o total nunca menor que o teto da faixa anterior. */
export function custoDiaria(equivalentes: number, tipo: "comum" | "especial"): number {
  const faixas = precos.faixas;
  const i = Math.max(0, faixas.findIndex((f) => equivalentes <= f.ate));
  const piso = i === 0 ? faixas[0].ate * faixas[0][tipo] : faixas[i - 1].ate * faixas[i - 1][tipo];
  return Math.max(equivalentes * faixas[i][tipo], piso);
}

export function estimar(inicio: string, fim: string, g: Grupo, especiais: Set<string>): Estimativa {
  const diarias = Math.round((paraMs(fim) - paraMs(inicio)) / DIA);
  let especiaisN = 0;
  for (let i = 0; i < diarias; i++) {
    if (especiais.has(paraChave(paraMs(inicio) + i * DIA))) especiaisN++;
  }
  const comuns = diarias - especiaisN;
  const eq = g.adultos + g.meia / 2;
  const valorComum = custoDiaria(eq, "comum");
  const valorEspecial = custoDiaria(eq, "especial");
  const limpeza = diarias * precos.limpezaPorDiaria;
  const total = Math.round(comuns * valorComum + especiaisN * valorEspecial + limpeza);
  return {
    diarias,
    comuns,
    especiais: especiaisN,
    pessoasEquivalentes: eq,
    valorComum,
    valorEspecial,
    limpeza,
    total,
    porPessoa: eq > 0 ? Math.round(total / eq) : total,
  };
}

export const reais = (v: number) =>
  "R$ " + Math.round(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 });

export { precos };
