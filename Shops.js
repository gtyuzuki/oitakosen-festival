// 模擬店一覧: shops.csv を読み込んでカード表示する
// CSVの列: クラス, 出し物, 店番号, 画像ファイル名

const CSV_PATH = 'shops.csv';

const grid = document.getElementById('shopGrid');
const searchInput = document.getElementById('shopSearch');
const countEl = document.getElementById('shopCount');

let allShops = [];

function renderShops(shops) {
  if (shops.length === 0) {
    grid.innerHTML = '<p class="shop-status">該当する模擬店が見つかりませんでした。</p>';
    countEl.textContent = '0件';
    return;
  }

  grid.innerHTML = shops.map(shop => {
    const cls = (shop['クラス'] || '').trim();
    const item = (shop['出し物'] || '').trim();
    const number = (shop['店番号'] || '').trim();
    const image = (shop['画像ファイル名'] || '').trim();

    return `
      <div class="shop-card">
        <div class="shop-img-wrap">
          <img src="${image}" alt="${item}" loading="lazy"
               onerror="this.parentElement.classList.add('img-missing')">
        </div>
        <div class="shop-info">
          <span class="shop-number mono">No.${number}</span>
          <h4>${item}</h4>
          <span class="shop-class">${cls}</span>
        </div>
      </div>`;
  }).join('');

  countEl.textContent = `${shops.length}件`;
}

function filterShops(keyword) {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return allShops;
  return allShops.filter(shop =>
    (shop['クラス'] || '').toLowerCase().includes(kw) ||
    (shop['出し物'] || '').toLowerCase().includes(kw) ||
    (shop['店番号'] || '').toLowerCase().includes(kw)
  );
}

function loadShops() {
  grid.innerHTML = '<p class="shop-status">読み込み中…</p>';

  fetch(CSV_PATH)
    .then(res => {
      if (!res.ok) throw new Error('CSVの取得に失敗しました');
      return res.text();
    })
    .then(text => {
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      allShops = parsed.data;
      renderShops(allShops);
    })
    .catch(() => {
      grid.innerHTML = `
        <p class="shop-status">
          shops.csv を読み込めませんでした。<br>
          index.html と同じフォルダに shops.csv があるか確認してください。<br>
          また、ファイルをダブルクリックで直接開いている場合は読み込めないことがあります。<br>
          VSCodeの「Live Server」拡張機能などでローカルサーバー経由で開いてください。
        </p>`;
      countEl.textContent = '';
    });
}

searchInput.addEventListener('input', (e) => {
  renderShops(filterShops(e.target.value));
});

loadShops();