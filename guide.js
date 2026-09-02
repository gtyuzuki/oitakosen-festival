// 案内ページ: パンフレットPDFの有無を確認して表示を切り替える

const PDF_PATH = 'pamphlet.pdf';
const pdfFrame = document.getElementById('pdfFrame');
const pdfActions = document.getElementById('pdfActions');

fetch(PDF_PATH, { method: 'HEAD' })
  .then(res => {
    if (!res.ok) throw new Error('not found');
    // 存在する場合だけ iframe に読み込ませる
    const iframe = document.createElement('iframe');
    iframe.src = PDF_PATH;
    iframe.title = 'パンフレット';
    pdfFrame.appendChild(iframe);
  })
  .catch(() => {
    pdfFrame.classList.add('pdf-missing');
    if (pdfActions) pdfActions.style.display = 'none';
  });
