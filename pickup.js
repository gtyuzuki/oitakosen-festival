// ホームの「協賛企業ピックアップ」「企画・模擬店ピックアップ」
// sponsor.csv を読み込み、自動で横スライドするカルーセルを作る

const AUTO_SLIDE_INTERVAL = 1800; // ミリ秒

function startAutoSlide(track) {
  let timer = null;

  function step() {
    const firstCard = track.children[0];
    if (!firstCard) return;
    const gap = 20;
    const cardWidth = firstCard.getBoundingClientRect().width + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (track.scrollLeft >= maxScroll - 5) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }

  function start() { timer = setInterval(step, AUTO_SLIDE_INTERVAL); }
  function stop() { clearInterval(timer); }

  // カーソルを乗せている間・スマホでタッチしている間は自動送りを止める
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);
  track.addEventListener('touchstart', stop, { passive: true });
  track.addEventListener('touchend', start);

  start();
}

function loadSponsorPickup() {
  const track = document.getElementById('sponsorCarouselTrack');
  if (!track) return;

  fetch('sponsor.csv')
    .then(res => { if (!res.ok) throw new Error(); return res.text(); })
    .then(text => {
      const rows = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
      if (rows.length === 0) throw new Error();

      track.innerHTML = rows.map(row => {
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

      startAutoSlide(track);
    })
    .catch(() => {
      track.innerHTML = '<p class="list-status">協賛企業情報を読み込めませんでした。sponsor.csvを確認してください。</p>';
    });
}

loadSponsorPickup();

// 既存の「企画・模擬店ピックアップ」も横スライドにする（静的カードなのでCSV読み込み不要）
const highlightsTrack = document.getElementById('cardGrid');
if (highlightsTrack) startAutoSlide(highlightsTrack);
