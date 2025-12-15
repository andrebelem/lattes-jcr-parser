let data = [];

const fileInput = document.getElementById("fileInput");
const processBtn = document.getElementById("processBtn");
const downloadBtn = document.getElementById("downloadBtn");
const previewLimit = document.getElementById("previewLimit");
const summaryDiv = document.getElementById("summary");

fileInput.addEventListener("change", () => {
  processBtn.disabled = !fileInput.files.length;
  downloadBtn.disabled = true;
  data = [];
  render();
  renderSummary();
});

processBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  // Lê como binário para decodificar corretamente acentos
  reader.onload = e => {
    const buf = e.target.result;

    // Tenta Windows-1252 (comum no Lattes salvo via Firefox)
    let html = new TextDecoder("windows-1252").decode(buf);

    // Se quiser, você pode adicionar fallback:
    // if (!html.includes("Currículo") && !html.includes("Artigos")) {
    //   html = new TextDecoder("utf-8").decode(buf);
    // }

    parseHTML(html);
  };

  reader.readAsArrayBuffer(file);
});

previewLimit.addEventListener("change", () => {
  render();
  renderSummary();
});

function parseHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const artigos = doc.querySelectorAll("div.artigo-completo");
  data = [];

  artigos.forEach(div => {
    const ano = div
      .querySelector('span.informacao-artigo[data-tipo-ordenacao="ano"]')
      ?.textContent?.trim() ?? "";

    const ref = div
      .querySelector("span.transform")
      ?.textContent
      ?.replace(/\s+/g, " ")
      ?.trim() ?? "";

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

    data.push({ Ano: ano, Referencia: ref, JCR_Ano: jcrAno, JCR_Valor: jcrValor });
  });

  // Ordena por ano desc (quando possível)
  data.sort((a, b) => (parseInt(b.Ano || "0", 10) - parseInt(a.Ano || "0", 10)));

  render();
  renderSummary();
  downloadBtn.disabled = false;
}

function renderSummary() {
  if (!data.length) {
    summaryDiv.innerHTML = "";
    return;
  }

  const jcrNums = data
    .map(r => parseFloat(String(r.JCR_Valor).replace(",", ".")))
    .filter(v => Number.isFinite(v));

  const totalArtigos = data.length;
  const comJCR = jcrNums.length;
  const somaJCR = jcrNums.reduce((acc, v) => acc + v, 0);
  const mediaJCR = comJCR ? somaJCR / comJCR : 0;

  summaryDiv.innerHTML = `
    <strong>Resumo</strong><br>
    Artigos: ${totalArtigos}<br>
    Com JCR: ${comJCR}<br>
    Soma JCR: ${somaJCR.toFixed(2)}<br>
    Média JCR (apenas com JCR): ${mediaJCR.toFixed(2)}
  `;
}

function render() {
  const table = document.getElementById("preview");
  table.innerHTML = "";

  if (!data.length) return;

  const header = table.insertRow();
  ["Ano", "Referencia", "JCR_Ano", "JCR_Valor"].forEach(h => {
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
    ["Ano", "Referencia", "JCR_Ano", "JCR_Valor"].forEach(k => {
      const td = tr.insertCell();
      td.textContent = row[k] ?? "";
    });
  });
}

downloadBtn.addEventListener("click", () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Artigos");
  XLSX.writeFile(wb, "lattes_jcr.xlsx");
});
