const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.item-card');
  const highlightsTrackEl = document.getElementById('cardGrid');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
      });
      if (highlightsTrackEl) highlightsTrackEl.scrollTo({ left: 0, behavior: 'smooth' });
    });
  });
