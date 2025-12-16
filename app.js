// app.js — Lattes JCR Parser (client-side)
// - Lê HTML (preferencialmente “Página completa” salva via Firefox)
// - Corrige acentuação via TextDecoder (windows-1252)
// - Extrai Ano, Referência (limpa) e JCR (quando existir)
// - Preview configurável (10/50/200/todas)
// - Somatório de JCR por intervalo de anos (Ano inicial / Ano final)
// - Gráfico: JCR anual (soma) e JCR acumulado por ano (Chart.js)
// - Exporta Excel com todos os registros

let data = [];
let jcrChart = null;

const fileInput = document.getElementById("fileInput");
const processBtn = document.getElementById("processBtn");
const downloadBtn = document.getElementById("downloadBtn");
const previewLimit = document.getElementById("previewLimit");
const summaryDiv = document.getElementById("summary");

// Controles de intervalo de anos (no index.html)
const yearRangeBox = document.getElementById("yearRangeBox");
const yearFromInput = document.getElementById("yearFrom");
const yearToInput = document.getElementById("yearTo");
const calcBtn = document.getElementById("calcBtn");

// ----------------- Helpers -----------------
function toIntSafe(v) {
  const n = parseInt(String(v ?? "").trim(), 10);
  return Number.isFinite(n) ? n : null;
}

function toFloatSafe(v) {
  const s = String(v ?? "").trim().replace(",", ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Remove "metadados internos" do Lattes dentro de span.transform
 * Ex.: prefixos do tipo "SILVA, G. B. S.2025" que vêm de spans de ordenação.
 */
function getReferenceText(div) {
  const t = div.querySelector("span.transform");
  if (!t) return "";

  const clone = t.cloneNode(true);
  clone.querySelectorAll("span.informacao-artigo").forEach(el => el.remove());

  return (clone.textContent || "").replace(/\s+/g, " ").trim();
}

function destroyChartIfAny() {
  if (jcrChart) {
    jcrChart.destroy();
    jcrChart = null;
  }
}

function clearUI() {
  data = [];
  renderTable();
  renderSummary(); // limpa
  destroyChartIfAny();

  downloadBtn.disabled = true;

  if (yearRangeBox) yearRangeBox.style.display = "none";
  if (calcBtn) calcBtn.disabled = true;
  if (yearFromInput) yearFromInput.value = "";
  if (yearToInput) yearToInput.value = "";
}

// ----------------- UI events -----------------
fileInput?.addEventListener("change", () => {
  processBtn.disabled = !fileInput.files.length;
  clearUI();
});

previewLimit?.addEventListener("change", () => {
  renderTable();
});

processBtn?.addEventListener("click", () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  // Lê como binário para preservar encoding e corrigir acentos
  reader.onload = e => {
    const buf = e.target.result;

    // Lattes salvo como “Página completa” frequentemente usa windows-1252/latin1
    let html = new TextDecoder("windows-1252").decode(buf);

    // Fallback simples (se alguém salvou em UTF-8)
    // Observação: se a string vier com "�" e sem termos típicos, tenta UTF-8
    if (!html.includes("Currículo") && !html.includes("Artigos") && html.includes("�")) {
      html = new TextDecoder("utf-8").decode(buf);
    }

    parseHTML(html);
  };

  reader.readAsArrayBuffer(file);
});

calcBtn?.addEventListener("click", () => {
  renderSummary();     // recalcula com intervalo selecionado
  renderJcrChart();    // redesenha o gráfico com o mesmo intervalo
});

downloadBtn?.addEventListener("click", () => {
  if (!data.length) return;

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Artigos");
  XLSX.writeFile(wb, "lattes_IF_jcr.xlsx");
});

// ----------------- Core parsing -----------------
function parseHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const artigos = doc.querySelectorAll("div.artigo-completo");

  data = [];

  artigos.forEach(div => {
    const ano = div
      .querySelector('span.informacao-artigo[data-tipo-ordenacao="ano"]')
      ?.textContent?.trim() ?? "";

    const ref = getReferenceText(div);

    const img = div.querySelector("img.ajaxJCR");
    let jcrAno = "";
    let jcrValor = "";

    if (img) {
      const ot = img.getAttribute("original-title") || "";
      const m = ot.match(/JCR\s+(\d{4}).*?:\s*([\d.]+)/);
      if (m) {
        jcrAno = m[1];
        jcrValor = m[2];
      }
    }

    data.push({
      Ano: ano,
      Referencia: ref,
      IF_JCR_Ano: jcrAno,
      IF_JCR_Valor: jcrValor
    });
  });

  // Caso 1: nenhum artigo
  if (!data.length) {
    renderTable();       // limpa preview
    destroyChartIfAny(); // limpa gráfico
    downloadBtn.disabled = true;

    if (yearRangeBox) yearRangeBox.style.display = "none";
    if (calcBtn) calcBtn.disabled = true;

    if (summaryDiv) {
      summaryDiv.innerHTML = `
        <strong>Nenhum artigo com IF-JCR encontrado</strong><br>
        Este currículo não contém itens na seção “Artigos completos publicados em periódicos”
        (blocos <code>div.artigo-completo</code>). Se você esperava artigos, verifique se salvou o Lattes completo e se o currículo possui artigos cadastrados.
      `;
    }
    return;
  }

  // Ordena por ano desc (quando possível)
  data.sort((a, b) => (toIntSafe(b.Ano) ?? 0) - (toIntSafe(a.Ano) ?? 0));

  initYearRangeControls();

  renderTable();
  renderSummary();
  renderJcrChart();

  downloadBtn.disabled = false;

  // Caso 2: existem artigos, mas nenhum tem JCR no HTML
  const jcrCount = data
    .map(r => toFloatSafe(r.IF_JCR_Valor))
    .filter(Number.isFinite).length;

  if (jcrCount === 0 && summaryDiv) {
    summaryDiv.innerHTML = `
      <strong>Nenhum artigo com IF-JCR encontrado</strong><br>
      Foram encontrados ${data.length} artigo(s), mas nenhum contém valores de IF-JCR no HTML.
      Isso normalmente ocorre quando o arquivo foi salvo pelo Chrome (ou sem “Página completa”) e o tooltip do JCR não foi preservado.
      Salve pelo Firefox (Página completa) e tente novamente.
    `;
  }
}

// ----------------- Year range controls -----------------
function initYearRangeControls() {
  if (!yearFromInput || !yearToInput || !calcBtn || !yearRangeBox) return;

  const anos = data
    .map(d => toIntSafe(d.Ano))
    .filter(Number.isFinite);

  if (!anos.length) {
    yearRangeBox.style.display = "none";
    yearFromInput.value = "";
    yearToInput.value = "";
    calcBtn.disabled = true;
    return;
  }

  const minY = Math.min(...anos);
  const maxY = Math.max(...anos);

  yearFromInput.value = String(minY);
  yearToInput.value = String(maxY);

  // opcional: restringe o input
  yearFromInput.min = String(minY);
  yearFromInput.max = String(maxY);
  yearToInput.min = String(minY);
  yearToInput.max = String(maxY);

  calcBtn.disabled = false;
  yearRangeBox.style.display = "block";
}

// ----------------- Summary (sum of JCR by year range) -----------------
function renderSummary() {
  if (!summaryDiv) return;

  if (!data.length) {
    summaryDiv.innerHTML = "";
    return;
  }

  let from = yearFromInput ? toIntSafe(yearFromInput.value) : null;
  let to = yearToInput ? toIntSafe(yearToInput.value) : null;

  // Se usuário inverter (from > to), ajusta automaticamente
  if (from !== null && to !== null && from > to) {
    const tmp = from;
    from = to;
    to = tmp;
    if (yearFromInput) yearFromInput.value = String(from);
    if (yearToInput) yearToInput.value = String(to);
  }

  const filtered = data.filter(d => {
    const y = toIntSafe(d.Ano);
    if (y === null) return false;
    if (from !== null && y < from) return false;
    if (to !== null && y > to) return false;
    return true;
  });

  const jcrNums = filtered
    .map(r => toFloatSafe(r.IF_JCR_Valor))
    .filter(Number.isFinite);

  const totalArtigos = filtered.length;
  const comJCR = jcrNums.length;
  const somaJCR = jcrNums.reduce((acc, v) => acc + v, 0);
  const mediaJCR = comJCR ? somaJCR / comJCR : 0;

  const labelFrom = from !== null ? from : "?";
  const labelTo = to !== null ? to : "?";

  summaryDiv.innerHTML = `
    <strong>Resumo (${labelFrom}–${labelTo})</strong><br>
    Artigos no intervalo: ${totalArtigos}<br>
    Com IF-JCR: ${comJCR}<br>
    Soma do IF-JCR: ${somaJCR.toFixed(2)}<br>
    Média do IF-JCR (apenas com JCR): ${mediaJCR.toFixed(2)}
  `;
}

// ----------------- Chart: annual and accumulated JCR -----------------
function buildJcrAccumulatedSeries(fromYear = null, toYear = null) {
  const annual = new Map();

  data.forEach(r => {
    const y = toIntSafe(r.Ano);
    const j = toFloatSafe(r.IF_JCR_Valor);
    if (y === null || j === null) return;

    if (fromYear !== null && y < fromYear) return;
    if (toYear !== null && y > toYear) return;

    annual.set(y, (annual.get(y) || 0) + j);
  });

  const years = Array.from(annual.keys()).sort((a, b) => a - b);

  let acc = 0;
  const accumulated = years.map(y => {
    acc += annual.get(y);
    return Number(acc.toFixed(4));
  });

  const perYear = years.map(y => Number((annual.get(y) || 0).toFixed(4)));

  return { years, perYear, accumulated };
}

function renderJcrChart() {
  const canvas = document.getElementById("jcrChart");
  if (!canvas) return;                 // não desenha se você não incluiu o canvas no index.html
  if (typeof Chart === "undefined") {  // Chart.js não carregou
    destroyChartIfAny();
    return;
  }

  if (!data.length) {
    destroyChartIfAny();
    return;
  }

  let from = yearFromInput ? toIntSafe(yearFromInput.value) : null;
  let to = yearToInput ? toIntSafe(yearToInput.value) : null;

  if (from !== null && to !== null && from > to) {
    const tmp = from;
    from = to;
    to = tmp;
  }

  const { years, perYear, accumulated } = buildJcrAccumulatedSeries(from, to);

  if (!years.length) {
    destroyChartIfAny();
    return;
  }

  destroyChartIfAny();

  jcrChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: "IF-JCR acumulado",
          data: accumulated,
          tension: 0.2
        },
        {
          label: "IF-JCR anual (soma)",
          data: perYear,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: { title: { display: true, text: "Ano" } },
        y: { title: { display: true, text: "IF-JCR (soma / acumulado)" } }
      }
    }
  });
}

// ----------------- Preview table -----------------
function renderTable() {
  const table = document.getElementById("preview");
  if (!table) return;

  table.innerHTML = "";
  if (!data.length) return;

  const header = table.insertRow();
  ["Ano", "Referencia", "IF_JCR_Ano", "IF_JCR_Valor"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    header.appendChild(th);
  });

  let rows = data;
  const lim = previewLimit?.value ?? "10";

  if (lim !== "all") {
    const n = parseInt(lim, 10);
    if (Number.isFinite(n)) rows = data.slice(0, n);
  }

  rows.forEach(row => {
    const tr = table.insertRow();
    ["Ano", "Referencia", "IF_JCR_Ano", "IF_JCR_Valor"].forEach(k => {
      const td = tr.insertCell();
      td.textContent = row[k] ?? "";
    });
  });
}
