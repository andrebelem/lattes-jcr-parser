let data = [];

const fileInput = document.getElementById("fileInput");
const processBtn = document.getElementById("processBtn");
const downloadBtn = document.getElementById("downloadBtn");

fileInput.addEventListener("change", () => {
  processBtn.disabled = !fileInput.files.length;
});

processBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = e => parseHTML(e.target.result);
  reader.readAsText(file);
});

function parseHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const artigos = doc.querySelectorAll("div.artigo-completo");
  data = [];

  artigos.forEach(div => {
    const ano = div.querySelector('span[data-tipo-ordenacao="ano"]')?.textContent?.trim();
    const ref = div.querySelector("span.transform")?.textContent?.replace(/\s+/g, " ");
    const img = div.querySelector("img.ajaxJCR");
    let jcrAno = "", jcrValor = "";

    if (img) {
      const ot = img.getAttribute("original-title");
      const m = ot?.match(/JCR (\d{4}).*?:\s*([\d.]+)/);
      if (m) {
        jcrAno = m[1];
        jcrValor = m[2];
      }
    }

    data.push({ Ano: ano, Referencia: ref, JCR_Ano: jcrAno, JCR_Valor: jcrValor });
  });

  render();
  downloadBtn.disabled = false;
}

function render() {
  const table = document.getElementById("preview");
  table.innerHTML = "";
  const header = table.insertRow();
  ["Ano", "Referencia", "JCR_Ano", "JCR_Valor"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    header.appendChild(th);
  });

  data.slice(0, 10).forEach(row => {
    const tr = table.insertRow();
    Object.values(row).forEach(v => {
      const td = tr.insertCell();
      td.textContent = v ?? "";
    });
  });
}

downloadBtn.addEventListener("click", () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Artigos");
  XLSX.writeFile(wb, "lattes_jcr.xlsx");
});
