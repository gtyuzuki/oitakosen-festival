// 協賛一覧: sponsor.csv を読み込んでロゴカード表示する
// CSVの列: 会社名, ロゴファイル名, URL

const CSV_PATH = 'sponsor.csv';

const grid = document.getElementById('sponsorGrid');
const countEl = document.getElementById('sponsorCount');

function renderItems(items) {
  if (items.length === 0) {
    grid.innerHTML = '<p class="list-status">協賛企業の情報がまだありません。</p>';
    if (countEl) countEl.textContent = '';
    return;
  }

  grid.innerHTML = items.map(row => {
    const name = (row['会社名'] || '').trim();
    const logo = (row['ロゴファイル名'] || '').trim();
    const url = (row['URL'] || '').trim() || '#';

    return `
      <a class="sponsor-card" href="${url}" target="_blank" rel="noopener">
        <div class="sponsor-logo-wrap">
          <img src="${logo}" alt="${name}" loading="lazy"
               onerror="this.parentElement.classList.add('img-missing')">
        </div>
        <div class="sponsor-name">${name}</div>
      </a>`;
  }).join('');

  if (countEl) countEl.textContent = `${items.length}社`;
}

function loadItems() {
  grid.innerHTML = '<p class="list-status">読み込み中…</p>';

  fetch(CSV_PATH)
    .then(res => {
      if (!res.ok) throw new Error('CSVの取得に失敗しました');
      return res.text();
    })
    .then(text => {
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      renderItems(parsed.data);
    })
    .catch(() => {
      grid.innerHTML = `
        <p class="list-status">
          sponsor.csv を読み込めませんでした。<br>
          index.html と同じフォルダに sponsor.csv があるか確認してください。<br>
          また、ファイルをダブルクリックで直接開いている場合は読み込めないことがあります。<br>
          VSCodeの「Live Server」拡張機能などでローカルサーバー経由で開いてください。
        </p>`;
      if (countEl) countEl.textContent = '';
    });
}

loadItems();
