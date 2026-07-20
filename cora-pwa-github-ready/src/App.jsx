import { useState, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  // marca — executivo luxo
  ink: "#0C1A18",
  ink2: "#12211F",
  ink3: "#183029",
  gold: "#C9A96A",
  goldHi: "#EAD6A6",
  goldLo: "#9C7C42",
  cream: "#F5F1E7",
  cardLine: "#E7DFCC",
  greige: "#A99F8A",
  inkText: "#1c2b28",
  // superfícies
  bg: "#F5F1E7",
  white: "#ffffff",
  fieldBg: "#FAF6EC",
  // semânticas (preservadas — usadas por condutas, blocos e alertas)
  teal: "#2d7a74",
  tealLight: "#e8f4f3",
  tealDark: "#2d6b66",
  red: "#c0392b",
  redSoft: "#fbeeec",
  orange: "#c47a3a",
  amber: "#c08a2e",
  green: "#3f8f5f",
  gray: "#8a8375",
  grayLight: "#a79d88",
  dark: "#2c3e50",
  purple: "#7d5a9e",
  blue: "#2f6f8f",
  cyan: "#2e8b86",
  border: "#E7DFCC",
};

const SERIF = "'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, 'Times New Roman', serif";
const GOLD_GRAD = "linear-gradient(120deg, #EAD6A6, #C9A96A 46%, #9C7C42)";

// Emblema CORA — anéis concêntricos + equilíbrio ⇌ (meia-flecha)
function Emblem({ size = 64, color = "#C9A96A", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ display: "block", ...style }} aria-hidden="true">
      <g fill="none" stroke={color}>
        <circle cx="60" cy="60" r="48" strokeWidth="1.4" />
        <circle cx="60" cy="60" r="40" strokeWidth="3.2" />
        <path d="M42 53 H75" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M75 53 L69 49.4" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M78 67 H45" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M45 67 L51 70.6" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <circle cx="60" cy="60" r="2.3" fill={color} />
    </svg>
  );
}

function Wordmark({ size = 20, spacing = 4 }) {
  return (
    <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, letterSpacing: spacing, background: GOLD_GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", display: "inline-block", lineHeight: 1 }}>CORA</span>
  );
}

// ─── BIBLIOTECA DE CONDUTAS ───────────────────────────────────────────────────
const CONDUTAS = {
  acidose_respiratoria: {
    titulo: "Acidose Respiratória",
    cor: C.red, icone: "🫁",
    referencia: "GOLD 2024 · ATS/ERS 2017-18 · SBPT 2022",
    blocos: [
      { letra: "A", nivel: "A", titulo: "Ventilação Mecânica Não Invasiva",
        fonte: "GOLD 2024",
        itens: [
          "Indicação: DPOC com hipercapnia aguda e pH < 7,35",
          "BiPAP — IPAP 8–12 cmH₂O / EPAP 4–6 cmH₂O, ajuste gradual",
          "Duração ≥ 6h/dia, com pausas para alimentação e higiene",
          "Gasometria de controle após 1h para avaliar resposta",
        ] },
      { letra: "B", nivel: "B", titulo: "Higiene Brônquica",
        fonte: "ERS 2019",
        itens: [
          "DPOC/Asma: ACBT + PEP (Pressão Expiratória Positiva)",
          "Hipersecreção: ELTGOL em decúbito lateral",
          "Neuromusculares: MI-E (Insuflação-Exsuflação Mecânica)",
        ] },
      { letra: "C", nivel: "A", titulo: "Treinamento Muscular Inspiratório",
        fonte: "ATS/ERS 2018",
        itens: [
          "Threshold IMT a 30–40% da PImáx",
          "2x/dia, 30 respirações por sessão",
        ] },
    ],
  },

  alcalose_respiratoria: {
    titulo: "Alcalose Respiratória",
    cor: C.blue, icone: "🌬️",
    referencia: "ATS/ERS 2022 · Cochrane 2020",
    blocos: [
      { letra: "A", nivel: "B", titulo: "Controle Ventilatório com Capnometria",
        fonte: "ERS 2022",
        itens: [
          "Biofeedback para manter ETCO₂ entre 35–45 mmHg",
          "Padrão 4-4-4: 4s inspiração – 4s pausa – 4s expiração",
          "Respiração lenta 6–8 rpm com pausa expiratória",
        ] },
      { letra: "B", nivel: "A", titulo: "Manejo de Ansiedade",
        fonte: "Cochrane 2020",
        itens: [
          "Respiração diafragmática + mindfulness — 10 min, 2x/dia",
          "Posicionamento semielevado para reduzir náuseas",
          "Encaminhar à psicoterapia se ansiedade predominante",
        ] },
    ],
  },

  acidose_metabolica_ag_alto: {
    titulo: "Acidose Metabólica · AG Aumentado",
    cor: C.orange, icone: "⚗️",
    referencia: "KDIGO 2023 · Surviving Sepsis 2023",
    blocos: [
      { letra: "A", nivel: "B", titulo: "Priorizar Oxigenação Tecidual",
        fonte: "Surviving Sepsis 2023",
        itens: [
          "Ajuste de FiO₂ e PEEP para otimizar entrega de O₂",
          "Monitorar SpO₂ e lactato sérico continuamente",
          "EVITAR exercícios intensos — elevam produção de lactato",
        ] },
      { letra: "B", nivel: "B", titulo: "Mobilização Criteriosa",
        fonte: "KDIGO 2023",
        itens: [
          "Mobilização precoce PASSIVA só se estável hemodinamicamente",
          "Evitar exercícios resistidos — risco de piora do lactato",
        ] },
      { letra: "C", nivel: "C", titulo: "Suporte Ventilatório",
        fonte: "Consenso",
        itens: [
          "BiPAP se houver fadiga muscular respiratória",
          "Expansão pulmonar (inspiração sustentada) contra atelectasias",
        ] },
    ],
  },

  acidose_metabolica_ag_normal: {
    titulo: "Acidose Metabólica · AG Normal",
    cor: C.amber, icone: "⚗️",
    referencia: "SBPT 2021",
    blocos: [
      { letra: "A", nivel: "C", titulo: "Exercícios Adaptados",
        fonte: "SBPT 2021",
        itens: [
          "Caminhada assistida 2–5 min/hora se normovolêmico",
          "Fortalecimento muscular progressivo",
          "Evitar posições que aumentem pressão abdominal",
        ] },
      { letra: "B", nivel: "C", titulo: "Cinesioterapia Respiratória",
        fonte: "SBPT 2021",
        itens: [
          "Prevenir atelectasias secundárias a dor abdominal",
          "Monitorar PA — risco de hipotensão por hipovolemia",
          "Apoiar equipe na correção da desidratação",
        ] },
    ],
  },

  acidose_metabolica_ag_baixo: {
    titulo: "Ânion Gap Diminuído",
    cor: C.purple, icone: "📉",
    referencia: "ESICM 2023",
    blocos: [
      { letra: "A", nivel: "C", titulo: "Manejo da Hipoalbuminemia",
        fonte: "ESICM 2023",
        itens: [
          "Elevação de MMII (antigravitacional) para reduzir edemas",
          "Exercícios de baixo impacto (ex.: hidroterapia)",
          "Evitar percussão torácica se risco de sangramento",
        ] },
      { letra: "B", nivel: "C", titulo: "Prevenção de Complicações",
        fonte: "ESICM 2023",
        itens: [
          "Deambulação precoce para prevenir TVP",
          "Monitorar edema de forma contínua",
          "Encaminhar à nutrição/nefrologia para correção da albumina",
        ] },
    ],
  },

  alcalose_metabolica: {
    titulo: "Alcalose Metabólica",
    cor: C.cyan, icone: "🧪",
    referencia: "ESICM 2023",
    blocos: [
      { letra: "A", nivel: "B", titulo: "Exercícios Ativos Leves",
        fonte: "ESICM 2023",
        itens: [
          "Evitar perdas adicionais de K⁺ e Cl⁻",
          "Exercícios ativos leves, não resistidos",
          "Monitorar eletrólitos durante a sessão",
        ] },
    ],
  },

  misto_ac_resp_ac_met: {
    titulo: "Misto · Acidose Resp. + Acidose Met.",
    cor: C.red, icone: "🚨",
    referencia: "ATS/ERS · GOLD 2024",
    critico: true,
    blocos: [
      { letra: "A", nivel: "A", titulo: "Suporte Ventilatório Imediato",
        fonte: "GOLD 2024",
        itens: [
          "Ventilação invasiva ou não invasiva (BiPAP/CPAP)",
          "Ajuste de FiO₂ para SpO₂ > 92%",
          "Evitar decúbito plano prolongado",
        ] },
      { letra: "B", nivel: "B", titulo: "Otimização da Perfusão",
        fonte: "Consenso",
        itens: [
          "Mobilização passiva/ativo-assistida se estável",
          "Observar fadiga muscular e taquipneia paradoxal",
        ] },
    ],
  },

  misto_alc_resp_alc_met: {
    titulo: "Misto · Alcalose Resp. + Alcalose Met.",
    cor: C.blue, icone: "⚠️",
    referencia: "ERS 2022 · ESICM 2023",
    blocos: [
      { letra: "A", nivel: "B", titulo: "Controle da Hiperventilação",
        fonte: "ERS 2022",
        itens: [
          "Técnicas de reinalação controlada para elevar PaCO₂",
          "Respiração lenta 6–8 rpm com pausa expiratória",
          "Posicionamento semielevado para reduzir náuseas",
        ] },
      { letra: "B", nivel: "C", titulo: "Correção dos Fatores",
        fonte: "Consenso",
        itens: [
          "Encaminhar à psicoterapia se ansiedade predominante",
          "Corrigir causas de vômito junto à equipe médica",
        ] },
    ],
  },

  misto_ac_resp_alc_met: {
    titulo: "Misto · Acidose Resp. + Alcalose Met.",
    cor: C.orange, icone: "🔄",
    referencia: "GOLD 2024 · ESICM 2023",
    blocos: [
      { letra: "A", nivel: "B", titulo: "Melhora da Ventilação",
        fonte: "GOLD 2024",
        itens: [
          "Inspiração sustentada com hold inspiratório",
          "BiPAP com ajuste de EPAP contra atelectasias",
          "Evitar sedação excessiva — piora hipoventilação",
        ] },
      { letra: "B", nivel: "C", titulo: "Equilíbrio Hidroeletrolítico",
        fonte: "ESICM 2023",
        itens: [
          "Exercícios leves para evitar perda de K⁺ e Cl⁻",
          "Coordenar revisão de diuréticos com equipe médica",
        ] },
    ],
  },

  misto_alc_resp_ac_met: {
    titulo: "Misto · Alcalose Resp. + Acidose Met.",
    cor: C.purple, icone: "🔄",
    referencia: "Surviving Sepsis 2023 · ERS 2022",
    critico: true,
    blocos: [
      { letra: "A", nivel: "B", titulo: "Priorizar Oxigenação Tecidual",
        fonte: "Surviving Sepsis 2023",
        itens: [
          "Ventilação protetora (VC reduzido) se em suporte mecânico",
          "Mobilização precoce passiva para melhorar circulação",
        ] },
      { letra: "B", nivel: "C", titulo: "Redução do Esforço Respiratório",
        fonte: "ERS 2022",
        itens: [
          "Padrão 4-4-4: 4s inspiração – 4s pausa – 4s expiração",
          "Monitorar lactato e SpO₂ continuamente",
        ] },
    ],
  },
};

// Princípios gerais para distúrbios mistos (exibidos como rodapé quando aplicável)
const PRINCIPIOS_MISTOS = [
  "Hierarquia de correção: tratar primeiro o distúrbio que mais ameaça a vida",
  "Gasometrias seriadas para monitorar resposta às intervenções",
  "Alinhar condutas com a equipe médica (bicarbonato, eletrólitos)",
  "Personalizar conforme a causa de base (DPOC vs. renal vs. séptico)",
];

// ─── CAMPOS ───────────────────────────────────────────────────────────────────
const FIELDS = [
  { key: "ph", label: "pH", unit: "", ph: "7.35 – 7.45", req: true, min: 6.5, max: 8.0 },
  { key: "pco2", label: "pCO₂", unit: "mmHg", ph: "35 – 45", req: true, min: 5, max: 150 },
  { key: "hco3", label: "HCO₃⁻", unit: "mmol/L", ph: "22 – 26", req: true, min: 2, max: 60 },
  { key: "na", label: "Na⁺", unit: "mmol/L", ph: "135 – 145", req: false, min: 90, max: 190 },
  { key: "cl", label: "Cl⁻", unit: "mmol/L", ph: "98 – 106", req: false, min: 60, max: 160 },
  { key: "albumina", label: "Albumina", unit: "g/dL", ph: "~4.0", req: false, min: 0.5, max: 7 },
  { key: "pao2", label: "PaO₂", unit: "mmHg", ph: "80 – 100", req: false, min: 20, max: 600 },
  { key: "fio2", label: "FiO₂", unit: "%", ph: "21 (ar amb.)", req: false, min: 21, max: 100 },
];

// ─── MOTOR DE ANÁLISE ─────────────────────────────────────────────────────────
function analyze(values, ctx) {
  const num = (k) => (values[k] === undefined || values[k] === "" ? NaN : parseFloat(values[k]));
  const ph = num("ph"), pco2 = num("pco2"), hco3 = num("hco3");
  const na = num("na"), cl = num("cl"), alb = num("albumina");
  const pao2 = num("pao2"), fio2 = num("fio2");

  if (isNaN(ph) || isNaN(pco2) || isNaN(hco3)) return null;

  const r = {
    disturbio: [], primario: [], compensacao: [], anionGap: [],
    oxigenacao: [], alertas: [], condutas: [], coerencia: [],
    isMisto: false, resumo: null,
  };

  // ── Coerência interna (Henderson-Hasselbalch) ──
  // [H+] = 24 × pCO2 / HCO3 ; pH_calc = 6.1 + log10(HCO3 / (0.03 × pCO2))
  const phCalc = 6.1 + Math.log10(hco3 / (0.03 * pco2));
  if (Math.abs(phCalc - ph) > 0.05) {
    r.coerencia.push(
      `pH informado (${ph.toFixed(2)}) diverge do pH calculado por Henderson-Hasselbalch (${phCalc.toFixed(2)}). Verifique erro de coleta, unidade ou digitação.`
    );
    r.alertas.push({ text: "Valores internamente inconsistentes — possível erro pré-analítico. Interprete com cautela.", level: "warning" });
  }

  // ── pH global ──
  const phStatus = ph < 7.35 ? "acido" : ph > 7.45 ? "alcalino" : "normal";
  if (phStatus === "acido") r.disturbio.push("Acidemia — pH < 7,35");
  else if (phStatus === "alcalino") r.disturbio.push("Alcalemia — pH > 7,45");
  else r.disturbio.push("pH dentro da faixa (7,35–7,45) — avaliar compensação ou distúrbio misto equilibrado");

  const respAcido = pco2 > 45, respAlc = pco2 < 35;
  const metAcido = hco3 < 22, metAlc = hco3 > 26;

  // ── Classificação primária ──
  let primary = "";
  if (phStatus === "acido") {
    if (respAcido && !metAcido) { primary = "ac_resp"; r.primario.push("Distúrbio primário: Acidose Respiratória (pCO₂ elevado)"); }
    else if (metAcido && !respAcido) { primary = "ac_met"; r.primario.push("Distúrbio primário: Acidose Metabólica (HCO₃⁻ reduzido)"); }
    else if (respAcido && metAcido) { primary = "misto_ac_resp_ac_met"; r.isMisto = true; r.primario.push("Distúrbio Misto: Acidose Respiratória + Metabólica"); }
    else { primary = "ac_met"; r.primario.push("Acidemia — componente metabólico provável; avaliar compensação"); }
  } else if (phStatus === "alcalino") {
    if (respAlc && !metAlc) { primary = "alc_resp"; r.primario.push("Distúrbio primário: Alcalose Respiratória (pCO₂ reduzido)"); }
    else if (metAlc && !respAlc) { primary = "alc_met"; r.primario.push("Distúrbio primário: Alcalose Metabólica (HCO₃⁻ elevado)"); }
    else if (respAlc && metAlc) { primary = "misto_alc_resp_alc_met"; r.isMisto = true; r.primario.push("Distúrbio Misto: Alcalose Respiratória + Metabólica"); }
    else { primary = "alc_met"; r.primario.push("Alcalemia — componente metabólico provável; avaliar compensação"); }
  } else {
    if (respAlc && metAcido) { primary = "misto_alc_resp_ac_met"; r.isMisto = true; r.primario.push("Distúrbio Misto com pH normal: Alcalose Resp. + Acidose Met. (ex.: sepse)"); }
    else if (respAcido && metAlc) { primary = "misto_ac_resp_alc_met"; r.isMisto = true; r.primario.push("Distúrbio Misto com pH normal: Acidose Resp. + Alcalose Met. (ex.: DPOC + diurético)"); }
    else r.primario.push("pH normal com gases normais — sem distúrbio evidente ou distúrbio compensado");
  }

  // ── Compensação esperada (todas as 4 primárias puras) ──
  if (primary === "ac_met") {
    const esp = 1.5 * hco3 + 8; // Winter
    const lo = esp - 2, hi = esp + 2;
    r.compensacao.push(`Fórmula de Winter — pCO₂ esperado: ${lo.toFixed(1)}–${hi.toFixed(1)} mmHg`);
    if (pco2 < lo) r.compensacao.push(`pCO₂ (${pco2}) ABAIXO do esperado → alcalose respiratória associada`);
    else if (pco2 > hi) r.compensacao.push(`pCO₂ (${pco2}) ACIMA do esperado → acidose respiratória associada (fadiga?)`);
    else r.compensacao.push(`pCO₂ (${pco2}) dentro do previsto → compensação respiratória adequada`);
  } else if (primary === "alc_met") {
    const esp = 0.7 * hco3 + 20;
    const lo = esp - 5, hi = esp + 5;
    r.compensacao.push(`pCO₂ esperado (0,7 × HCO₃⁻ + 20): ${lo.toFixed(1)}–${hi.toFixed(1)} mmHg`);
    if (pco2 < lo) r.compensacao.push(`pCO₂ (${pco2}) abaixo do esperado → alcalose respiratória associada`);
    else if (pco2 > hi) r.compensacao.push(`pCO₂ (${pco2}) acima do esperado → acidose respiratória associada`);
    else r.compensacao.push(`pCO₂ (${pco2}) dentro do previsto → compensação respiratória adequada`);
  } else if (primary === "ac_resp") {
    // HCO3 esperado: agudo +1 por 10 mmHg pCO2>40 ; crônico +3.5 (Δ/10)
    const dCO2 = (pco2 - 40) / 10;
    const hco3Agudo = 24 + 1 * dCO2;
    const hco3Cronico = 24 + 3.5 * dCO2;
    r.compensacao.push(`HCO₃⁻ esperado se AGUDO: ~${hco3Agudo.toFixed(1)} mmol/L`);
    r.compensacao.push(`HCO₃⁻ esperado se CRÔNICO: ~${hco3Cronico.toFixed(1)} mmol/L`);
    if (hco3 >= hco3Cronico - 2) r.compensacao.push(`HCO₃⁻ atual (${hco3}) sugere quadro CRÔNICO (compensação renal instalada)`);
    else if (hco3 <= hco3Agudo + 2) r.compensacao.push(`HCO₃⁻ atual (${hco3}) sugere quadro AGUDO`);
    else r.compensacao.push(`HCO₃⁻ atual (${hco3}) sugere quadro agudo sobre crônico`);
  } else if (primary === "alc_resp") {
    const dCO2 = (40 - pco2) / 10;
    const hco3Agudo = 24 - 2 * dCO2;
    const hco3Cronico = 24 - 5 * dCO2;
    r.compensacao.push(`HCO₃⁻ esperado se AGUDO: ~${hco3Agudo.toFixed(1)} mmol/L`);
    r.compensacao.push(`HCO₃⁻ esperado se CRÔNICO: ~${hco3Cronico.toFixed(1)} mmol/L`);
    if (hco3 <= hco3Cronico + 2) r.compensacao.push(`HCO₃⁻ atual (${hco3}) sugere quadro CRÔNICO`);
    else r.compensacao.push(`HCO₃⁻ atual (${hco3}) sugere quadro AGUDO`);
  }

  // ── Ânion Gap ──
  let agConduta = null;
  if (!isNaN(na) && !isNaN(cl)) {
    const ag = na - (cl + hco3);
    r.anionGap.push(`Ânion Gap = ${ag.toFixed(1)} mEq/L (ref: 8–12)`);
    let agCorr = ag;
    if (!isNaN(alb)) {
      agCorr = ag + (4 - alb) * 2.5;
      r.anionGap.push(`AG corrigido p/ albumina (${alb} g/dL) = ${agCorr.toFixed(1)} mEq/L`);
    }
    if (agCorr > 12) {
      r.anionGap.push("AG elevado → acúmulo de ácidos fixos: cetoacidose, uremia, acidose láctica, intoxicações");
      if (agCorr > 20) r.alertas.push({ text: "AG > 20 — alta probabilidade de cetoacidose, intoxicação ou acidose láctica grave.", level: "danger" });
      // Delta Ratio
      const dr = (agCorr - 12) / (24 - hco3);
      if (isFinite(dr)) {
        r.anionGap.push(`Delta Ratio (ΔAG/ΔHCO₃⁻) = ${dr.toFixed(2)}`);
        if (dr < 1) r.anionGap.push("DR < 1 → coexiste acidose metabólica hiperclorêmica (AG normal)");
        else if (dr <= 2) r.anionGap.push("DR 1–2 → acidose de alto AG pura");
        else r.anionGap.push("DR > 2 → coexiste alcalose metabólica ou acidose respiratória crônica compensada");
      }
      agConduta = "ag_alto";
    } else if (agCorr < 6) {
      r.anionGap.push("AG diminuído → hipoalbuminemia, intoxicação por brometo/lítio, mieloma múltiplo");
      agConduta = "ag_baixo";
    } else {
      r.anionGap.push("AG normal → acidose hiperclorêmica: diarreia, acidose tubular renal, perdas digestivas");
      agConduta = "ag_normal";
    }
  }

  // ── Oxigenação ──
  if (!isNaN(pao2)) {
    if (pao2 >= 80) r.oxigenacao.push(`PaO₂ ${pao2} mmHg → normal`);
    else if (pao2 >= 70) r.oxigenacao.push(`PaO₂ ${pao2} mmHg → hipoxemia leve`);
    else if (pao2 >= 60) r.oxigenacao.push(`PaO₂ ${pao2} mmHg → hipoxemia moderada`);
    else { r.oxigenacao.push(`PaO₂ ${pao2} mmHg → hipoxemia grave`); r.alertas.push({ text: "PaO₂ < 60 mmHg — hipoxemia grave. Avaliar suporte ventilatório/O₂.", level: "danger" }); }
    if (pao2 > 100 && (isNaN(fio2) || fio2 <= 21)) r.oxigenacao.push("PaO₂ > 100 em ar ambiente — hiperóxia; revisar se em O₂ suplementar");

    // Gradiente A-a se FiO2 disponível
    if (!isNaN(fio2)) {
      const fio2Frac = fio2 / 100;
      const pAO2 = fio2Frac * (760 - 47) - pco2 / 0.8; // ar ambiente nível do mar
      const aa = pAO2 - pao2;
      const aaEsp = ctx.idade ? (ctx.idade / 4) + 4 : 15; // esperado por idade, fallback 15
      r.oxigenacao.push(`Gradiente A–a = ${aa.toFixed(0)} mmHg (esperado ~${aaEsp.toFixed(0)})`);
      if (aa > aaEsp + 5) {
        r.oxigenacao.push("Gradiente A–a ALARGADO → doença parenquimatosa, V/Q, shunt ou difusão");
      } else {
        r.oxigenacao.push("Gradiente A–a normal → hipoventilação ou baixa FiO₂ como causa da hipoxemia");
      }
      // Relação P/F
      const pf = pao2 / fio2Frac;
      r.oxigenacao.push(`Relação PaO₂/FiO₂ = ${pf.toFixed(0)}`);
      if (pf < 100) r.oxigenacao.push("P/F < 100 → SDRA grave");
      else if (pf < 200) r.oxigenacao.push("P/F 100–200 → SDRA moderada");
      else if (pf < 300) r.oxigenacao.push("P/F 200–300 → SDRA leve");
    }
  }

  // ── Alertas de pH ──
  if (ph < 7.20) r.alertas.push({ text: "pH < 7,20 — risco cardiovascular crítico. Monitorização imediata.", level: "danger" });
  else if (ph < 7.35) r.alertas.push({ text: "pH < 7,35 — acidemia. Investigar e tratar a causa primária.", level: "warning" });
  if (ph > 7.60) r.alertas.push({ text: "pH > 7,60 — risco de arritmias graves.", level: "danger" });
  else if (ph > 7.45) r.alertas.push({ text: "pH > 7,45 — alcalemia. Investigar a causa primária.", level: "warning" });

  // ── Resumo de uma linha ──
  const nomes = {
    ac_resp: "Acidose Respiratória", alc_resp: "Alcalose Respiratória",
    ac_met: "Acidose Metabólica", alc_met: "Alcalose Metabólica",
    misto_ac_resp_ac_met: "Distúrbio Misto (acidose dupla)",
    misto_alc_resp_alc_met: "Distúrbio Misto (alcalose dupla)",
    misto_ac_resp_alc_met: "Distúrbio Misto (ac. resp. + alc. met.)",
    misto_alc_resp_ac_met: "Distúrbio Misto (alc. resp. + ac. met.)",
  };
  r.resumo = nomes[primary] || "Padrão indeterminado — correlacionar clinicamente";

  // ── Mapeamento de condutas ──
  const map = {
    ac_resp: [CONDUTAS.acidose_respiratoria],
    alc_resp: [CONDUTAS.alcalose_respiratoria],
    ac_met: agConduta === "ag_alto" ? [CONDUTAS.acidose_metabolica_ag_alto]
      : agConduta === "ag_baixo" ? [CONDUTAS.acidose_metabolica_ag_baixo]
      : agConduta === "ag_normal" ? [CONDUTAS.acidose_metabolica_ag_normal]
      : [CONDUTAS.acidose_metabolica_ag_alto, CONDUTAS.acidose_metabolica_ag_normal],
    alc_met: [CONDUTAS.alcalose_metabolica],
    misto_ac_resp_ac_met: [CONDUTAS.misto_ac_resp_ac_met],
    misto_alc_resp_alc_met: [CONDUTAS.misto_alc_resp_alc_met],
    misto_ac_resp_alc_met: [CONDUTAS.misto_ac_resp_alc_met],
    misto_alc_resp_ac_met: agConduta === "ag_alto"
      ? [CONDUTAS.misto_alc_resp_ac_met, CONDUTAS.acidose_metabolica_ag_alto]
      : [CONDUTAS.misto_alc_resp_ac_met],
  };
  r.condutas = map[primary] || [];

  return r;
}

// ─── COMPONENTES DE UI ────────────────────────────────────────────────────────
function NivelBadge({ nivel }) {
  const map = { A: C.green, B: C.orange, C: C.gray };
  const col = map[nivel] || C.gray;
  return (
    <span style={{
      background: col, color: C.white, borderRadius: 4, fontSize: 9,
      fontWeight: 800, padding: "2px 6px", letterSpacing: 0.5, flexShrink: 0,
    }}>NÍVEL {nivel}</span>
  );
}

function ResultBlock({ title, icon, color, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ background: color + "0d", border: `1px solid ${color}2e`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
      <div style={{ fontWeight: 700, color, fontSize: 13, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
        <span style={{ fontSize: 15 }}>{icon}</span> {title}
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ fontSize: 13.5, color: C.dark, marginBottom: 5, lineHeight: 1.5, display: "flex", gap: 7 }}>
          <span style={{ color, flexShrink: 0 }}>›</span><span>{it}</span>
        </div>
      ))}
    </div>
  );
}

function Alert({ text, level }) {
  const cols = { danger: C.red, warning: C.amber, ok: C.green };
  const ics = { danger: "🚨", warning: "⚠️", ok: "✅" };
  const c = cols[level] || C.gray;
  return (
    <div style={{ background: c + "14", border: `1px solid ${c}44`, borderRadius: 10, padding: "11px 14px", marginBottom: 8, display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: C.dark, lineHeight: 1.45 }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{ics[level]}</span><span>{text}</span>
    </div>
  );
}

function CondutaCard({ conduta, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const c = conduta.cor;
  return (
    <div style={{ border: `1.5px solid ${c}44`, borderRadius: 14, marginBottom: 12, overflow: "hidden", background: C.white, boxShadow: "0 1px 5px rgba(0,0,0,0.05)" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: c, border: "none", padding: "13px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, textAlign: "left" }}>
          <span style={{ fontSize: 17 }}>{conduta.icone}</span>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>{conduta.titulo}</div>
            <div style={{ color: "#ffffffcc", fontSize: 10, marginTop: 3 }}>{conduta.referencia}</div>
          </div>
        </div>
        <span style={{ color: C.white, fontSize: 13, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "14px 15px" }}>
          {conduta.blocos.map((b, i) => (
            <div key={i} style={{ marginBottom: i < conduta.blocos.length - 1 ? 15 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: c, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{b.letra}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: c, flex: 1, minWidth: 120 }}>{b.titulo}</div>
                <NivelBadge nivel={b.nivel} />
              </div>
              {b.itens.map((it, j) => (
                <div key={j} style={{ display: "flex", gap: 8, marginBottom: 5, paddingLeft: 2 }}>
                  <span style={{ color: c, fontSize: 13, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 13, color: C.dark, lineHeight: 1.5 }}>{it}</span>
                </div>
              ))}
              <div style={{ fontSize: 10, color: C.grayLight, marginTop: 4, paddingLeft: 2, fontStyle: "italic" }}>Fonte: {b.fonte}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [values, setValues] = useState({});
  const [idade, setIdade] = useState("");
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("resultado");

  const setV = (k, v) => { setValues(s => ({ ...s, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    FIELDS.forEach(f => {
      const raw = values[f.key];
      if (f.req && (raw === undefined || raw === "")) { e[f.key] = "Obrigatório"; return; }
      if (raw !== undefined && raw !== "") {
        const n = parseFloat(raw);
        if (isNaN(n)) e[f.key] = "Inválido";
        else if (n < f.min || n > f.max) e[f.key] = `Fora da faixa (${f.min}–${f.max})`;
      }
    });
    return e;
  };

  const handleAnalyze = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setResult(analyze(values, { idade: idade ? parseFloat(idade) : null }));
    setTab("resultado");
    setScreen("result");
  };

  const reset = () => { setValues({}); setIdade(""); setErrors({}); setResult(null); setScreen("input"); };

  const filled = FIELDS.filter(f => values[f.key] !== undefined && values[f.key] !== "");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: C.bg, position: "relative" }}>

        {screen === "splash" && <SplashScreen onEnter={() => setScreen("input")} />}
        {screen !== "splash" && (<>
        {/* HEADER */}
        <div style={{ background: `linear-gradient(135deg, ${C.ink2}, ${C.ink})`, padding: "0 16px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.35)", borderBottom: `1px solid ${C.gold}33` }}>
          {screen !== "input"
            ? <button onClick={() => setScreen("input")} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 26, padding: 4, lineHeight: 1, width: 30 }}>‹</button>
            : <div style={{ width: 30 }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Emblem size={26} color={C.gold} />
            <Wordmark size={19} spacing={4} />
          </div>
          <button onClick={() => setScreen(screen === "info" ? "input" : "info")} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 19, padding: 4, width: 30 }}>
            {screen === "info" ? "✕" : "ⓘ"}
          </button>
        </div>

        {/* ── INPUT ── */}
        {screen === "input" && (
          <div style={{ padding: "18px 15px 110px" }}>
            <div style={{ textAlign: "center", fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: C.goldLo, fontWeight: 700, marginBottom: 16 }}>Nova análise · Gasometria arterial</div>
            <div style={{ background: C.white, borderRadius: 16, padding: 18, boxShadow: "0 2px 14px rgba(12,26,24,0.06)", border: `1px solid ${C.cardLine}` }}>
              <SectionLabel>Parâmetros obrigatórios</SectionLabel>
              {FIELDS.filter(f => f.req).map(f => (
                <InputField key={f.key} f={f} value={values[f.key]} error={errors[f.key]} onChange={v => setV(f.key, v)} />
              ))}

              <Divider />
              <SectionLabel>Opcionais — ampliam a análise</SectionLabel>
              <HelpLine>Na⁺ e Cl⁻ liberam o Ânion Gap · Albumina corrige o AG · PaO₂ + FiO₂ liberam gradiente A–a e P/F</HelpLine>
              {FIELDS.filter(f => !f.req).map(f => (
                <InputField key={f.key} f={f} value={values[f.key]} error={errors[f.key]} onChange={v => setV(f.key, v)} />
              ))}

              <div style={{ marginTop: 6 }}>
                <label style={labelStyle}>Idade <span style={{ color: C.gray, fontWeight: 400 }}>(anos — refina o gradiente A–a)</span></label>
                <input type="number" inputMode="numeric" placeholder="opcional" value={idade} onChange={e => setIdade(e.target.value)} style={inputStyle(false)} />
              </div>
            </div>

            <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, padding: "14px 15px 22px", background: `linear-gradient(transparent, ${C.bg} 35%)`, zIndex: 15 }}>
              <button onClick={handleAnalyze} style={{ width: "100%", padding: 16, background: GOLD_GRAD, color: C.ink, border: "none", borderRadius: 13, fontSize: 15.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(201,169,106,0.35)", letterSpacing: 0.4 }}>
                Analisar Gasometria
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {screen === "result" && result && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 62px)" }}>
            {/* Resumo diagnóstico */}
            <div style={{ background: `linear-gradient(150deg, ${C.ink2}, ${C.ink})`, padding: "16px 16px 14px", borderBottom: `1px solid ${C.gold}33` }}>
              <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 5 }}>Diagnóstico Gasométrico</div>
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: C.cream, lineHeight: 1.25 }}>{result.resumo}</div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 12 }}>
                {filled.map(f => (
                  <div key={f.key} style={{ fontSize: 11, background: "rgba(201,169,106,0.12)", border: `1px solid ${C.gold}2e`, borderRadius: 5, padding: "3px 8px" }}>
                    <span style={{ color: C.greige }}>{f.label} </span>
                    <span style={{ fontWeight: 700, color: C.gold }}>{values[f.key]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.cardLine}`, position: "sticky", top: 0, zIndex: 10 }}>
              {[["resultado", "🔬 Resultado"], ["conduta", "🩺 Conduta"]].map(([t, lbl]) => (
                <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "13px 0", border: "none", background: "transparent", cursor: "pointer", fontWeight: tab === t ? 700 : 500, fontSize: 14, color: tab === t ? C.ink : C.gray, borderBottom: tab === t ? `3px solid ${C.gold}` : "3px solid transparent" }}>
                  {lbl}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 15px 40px" }}>
              {tab === "resultado" && (
                <>
                  {result.alertas.length > 0 && <div style={{ marginBottom: 10 }}>{result.alertas.map((a, i) => <Alert key={i} {...a} />)}</div>}
                  <ResultBlock title="Estado Ácido-Base" icon="⚖️" color={C.teal} items={result.disturbio} />
                  <ResultBlock title="Distúrbio Primário" icon="📋" color={C.blue} items={result.primario} />
                  <ResultBlock title="Compensação Esperada" icon="🔁" color={C.orange} items={result.compensacao} />
                  <ResultBlock title="Ânion Gap" icon="📐" color={C.purple} items={result.anionGap} />
                  <ResultBlock title="Oxigenação" icon="🫁" color={C.green} items={result.oxigenacao} />
                  {result.coerencia.length > 0 && <ResultBlock title="Coerência Interna" icon="🔎" color={C.amber} items={result.coerencia} />}
                  <Disclaimer />
                </>
              )}

              {tab === "conduta" && (
                <>
                  {result.condutas.length === 0 ? (
                    <EmptyConduta hasMet={result.resumo.includes("Metabólica")} />
                  ) : (
                    <>
                      <div style={{ fontSize: 10.5, color: C.gray, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Condutas baseadas em evidências</div>
                      {result.condutas.map((c, i) => <CondutaCard key={i} conduta={c} defaultOpen={i === 0} />)}

                      {result.isMisto && (
                        <div style={{ background: C.redSoft, border: `1px solid ${C.red}33`, borderRadius: 12, padding: "13px 15px", marginTop: 4, marginBottom: 12 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8 }}>⚕️ Princípios para Distúrbios Mistos</div>
                          {PRINCIPIOS_MISTOS.map((p, i) => (
                            <div key={i} style={{ fontSize: 12.5, color: C.dark, marginBottom: 5, display: "flex", gap: 7, lineHeight: 1.45 }}>
                              <span style={{ color: C.red }}>›</span><span>{p}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <SourcesFooter />
                    </>
                  )}
                </>
              )}

              <button onClick={reset} style={{ width: "100%", marginTop: 18, padding: 14, background: "transparent", color: C.goldLo, border: `1.5px solid ${C.gold}`, borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3 }}>
                ↺ Nova Análise
              </button>
            </div>
          </div>
        )}

        {/* ── INFO ── */}
        {screen === "info" && <InfoScreen />}
        </>)}
      </div>
    </div>
  );
}

// ─── SUBCOMPONENTES ───────────────────────────────────────────────────────────
const labelStyle = { fontSize: 12, fontWeight: 600, color: C.inkText, display: "block", marginBottom: 5 };
const inputStyle = (err) => ({ width: "100%", padding: "12px 13px", borderRadius: 10, border: `1.5px solid ${err ? C.red : C.cardLine}`, fontSize: 15, background: err ? C.redSoft : C.fieldBg, color: C.dark, outline: "none", boxSizing: "border-box" });

function InputField({ f, value, error, onChange }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={labelStyle}>{f.label} {f.unit && <span style={{ color: C.gray, fontWeight: 400 }}>({f.unit})</span>}</label>
      <input type="number" step="any" inputMode="decimal" placeholder={f.ph} value={value ?? ""} onChange={e => onChange(e.target.value)} style={inputStyle(error)} />
      {error && <div style={{ color: C.red, fontSize: 11, marginTop: 3 }}>{error}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 11 }}>
      <span style={{ width: 5, height: 5, background: C.gold, transform: "rotate(45deg)", display: "inline-block", flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: C.inkText, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{children}</span>
    </div>
  );
}
function HelpLine({ children }) {
  return <div style={{ fontSize: 11, color: C.gray, marginBottom: 12, lineHeight: 1.5, background: C.fieldBg, borderLeft: `3px solid ${C.gold}`, borderRadius: 6, padding: "8px 11px" }}>{children}</div>;
}
function Divider() { return <div style={{ height: 1, background: C.cardLine, margin: "16px 0" }} />; }

function Disclaimer() {
  return (
    <div style={{ background: "#f6f8f8", borderRadius: 10, padding: "11px 13px", marginTop: 4 }}>
      <div style={{ fontSize: 11, color: C.gray, lineHeight: 1.55 }}>⚠️ Ferramenta de apoio à decisão. Valores são referências gerais — sempre correlacione com o quadro clínico. Inconsistências podem indicar erro de coleta.</div>
    </div>
  );
}

function SourcesFooter() {
  return (
    <div style={{ background: "#f6f8f8", borderRadius: 10, padding: "11px 13px", marginTop: 4 }}>
      <div style={{ fontSize: 10.5, color: C.gray, lineHeight: 1.6 }}>📚 GOLD 2024 · ATS/ERS 2017–2022 · SBPT 2021–2022 · KDIGO 2023 · Surviving Sepsis 2023 · ESICM 2023 · Cochrane 2020</div>
    </div>
  );
}

function EmptyConduta({ hasMet }) {
  return (
    <div style={{ background: C.white, borderRadius: 14, padding: 26, textAlign: "center", color: C.gray, boxShadow: "0 1px 5px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 34, marginBottom: 10 }}>🔍</div>
      <div style={{ fontSize: 14, lineHeight: 1.5 }}>
        {hasMet
          ? "Para condutas específicas da acidose metabólica, informe Na⁺ e Cl⁻ para calcular o Ânion Gap."
          : "Sem conduta mapeada para este padrão. Verifique os valores ou correlacione clinicamente."}
      </div>
    </div>
  );
}

function InfoScreen() {
  const blocks = [
    { icon: "📌", title: "Obrigatórios", color: C.teal, items: ["pH: 7,35–7,45", "pCO₂: 35–45 mmHg", "HCO₃⁻: 22–26 mmol/L"] },
    { icon: "🔹", title: "Opcionais", color: C.blue, items: ["Na⁺: 135–145 · Cl⁻: 98–106", "Albumina: ~4,0 g/dL", "PaO₂: 80–100 mmHg · FiO₂: 21% (ar amb.)", "Idade: refina o gradiente A–a"] },
    { icon: "∑", title: "Cálculos", color: C.purple, items: ["Ânion Gap = Na⁺ − (Cl⁻ + HCO₃⁻) → ref 8–12", "AG corrigido = AG + (4 − Albumina) × 2,5", "Delta Ratio = (AG − 12) / (24 − HCO₃⁻)", "Gradiente A–a = FiO₂×(760−47) − pCO₂/0,8 − PaO₂", "P/F = PaO₂ / (FiO₂/100)"] },
    { icon: "🔁", title: "Compensações", color: C.orange, items: ["Ac. metabólica (Winter): pCO₂ ≈ 1,5×HCO₃⁻ + 8 (±2)", "Alc. metabólica: pCO₂ ≈ 0,7×HCO₃⁻ + 20 (±5)", "Ac. respiratória: HCO₃⁻ +1 (agudo) / +3,5 (crônico) por 10 de ΔpCO₂", "Alc. respiratória: HCO₃⁻ −2 (agudo) / −5 (crônico) por 10 de ΔpCO₂"] },
    { icon: "🫁", title: "Oxigenação / SDRA", color: C.green, items: ["PaO₂ normal 80–100 · leve 70–80 · moderada 60–70 · grave <60", "P/F <300 leve · <200 moderada · <100 grave (SDRA)"] },
    { icon: "🔎", title: "Coerência interna", color: C.amber, items: ["Henderson-Hasselbalch: pH ≈ 6,1 + log(HCO₃⁻ / 0,03×pCO₂)", "Divergência > 0,05 sugere erro pré-analítico"] },
    { icon: "🚨", title: "Alertas Críticos", color: C.red, items: ["pH < 7,20 → risco cardiovascular crítico", "pH > 7,60 → risco de arritmias graves", "AG > 20 → cetoacidose/intoxicação/lactato", "PaO₂ < 60 → hipoxemia grave"] },
  ];
  return (
    <div style={{ padding: "18px 15px 40px" }}>
      <div style={{ textAlign: "center", fontSize: 10.5, letterSpacing: 2.5, textTransform: "uppercase", color: C.goldLo, fontWeight: 700, marginBottom: 16 }}>Referências & Fórmulas</div>
      {blocks.map((b, i) => <ResultBlock key={i} title={b.title} icon={b.icon} color={b.color} items={b.items} />)}
      <Disclaimer />
    </div>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function SplashScreen({ onEnter }) {
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.ink2}, ${C.ink})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", textAlign: "center", position: "relative" }}>
      <style>{`
        @keyframes coraFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .cora-fade { animation: coraFade .7s ease both; }
        .cora-fade-2 { animation: coraFade .7s ease .12s both; }
        @media (prefers-reduced-motion: reduce) { .cora-fade, .cora-fade-2 { animation: none; } }
      `}</style>

      <div className="cora-fade" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ filter: "drop-shadow(0 10px 26px rgba(0,0,0,.5))" }}>
          <Emblem size={104} color={C.gold} />
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 600, letterSpacing: 12, marginTop: 26, marginLeft: 6, background: GOLD_GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>CORA</div>
        <div style={{ fontSize: 11, letterSpacing: 6, textTransform: "uppercase", color: C.greige, marginTop: 16, fontWeight: 500 }}>Motor de Contexto Ácido-base</div>
        <div style={{ width: 46, height: 1, background: C.gold, opacity: 0.7, margin: "30px auto 0" }} />
      </div>

      <button onClick={onEnter} className="cora-fade-2" style={{ marginTop: 42, padding: "14px 42px", background: GOLD_GRAD, color: C.ink, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer", boxShadow: "0 6px 22px rgba(201,169,106,0.30)" }}>
        Iniciar análise
      </button>

      <div style={{ position: "absolute", bottom: 22, fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", color: "#5c6b64" }}>Apoio à decisão em gasometria</div>
    </div>
  );
}
