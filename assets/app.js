/* ==========================================================
   설정
   ========================================================== */

// 인더멘탈 공식 홈페이지 주소 (비워두면 버튼이 안 보여요)
const HOMEPAGE = '';

// 향 정보 — 메인 목록은 향 넘버 순서
// src를 비워두면 videos/{slug}.mp4 파일을 재생해요.
// 다른 곳에 올린 영상을 쓰려면 src에 영상 주소를 넣으세요.
// 영상 대신 다른 페이지로 보내려면 assets/links.json에 주소를 넣으세요. (QR은 그대로)
const SCENTS = [
  { slug: 'bija',        name: 'Bija Forest',        ko: '비자 포레스트',   no: 'No.0574', time: '6:20 AM',  src: '' },
  { slug: 'helen',       name: 'Helen Aqua',         ko: '헬렌 아쿠아',     no: 'No.1510', time: '11:10 AM', src: '' },
  { slug: 'citrus',      name: 'Citrus Noble',       ko: '시트러스 노블',   no: 'No.1514', time: '7:40 AM',  src: '' },
  { slug: 'hemish',      name: 'Hemish Bloom',       ko: '헤미쉬 블룸',     no: 'No.1515', time: '4:20 PM',  src: '' },
  { slug: 'honeysuckle', name: 'Honey Suckle Fresh', ko: '허니써클 프레쉬', no: 'No.4035', time: '1:15 PM',  src: '' },
];

/* ========================================================== */

(function () {
  const body = document.body;
  const ROOT = new URL(body.dataset.base || '', location.href);
  const startSlug = body.dataset.scent || null;
  const bySlug = Object.fromEntries(SCENTS.map(s => [s.slug, s]));

  // 링크 설정은 매번 새로 받아와요 (바꾸면 휴대폰 캐시와 상관없이 바로 반영)
  let links = {};
  const linksReady = Promise.race([
    fetch(new URL('assets/links.json', ROOT).href, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : {}))
      .then(j => { links = j || {}; }),
    new Promise(resolve => setTimeout(resolve, 2500)),
  ]).catch(() => {});
  let openedFromMenu = false;
  let uiTimer = null;
  let hintTimer = null;

  /* ---------- 플레이어 ---------- */
  const player = document.createElement('section');
  player.className = 'player';
  player.setAttribute('aria-label', '향 영상');
  player.innerHTML = `
    <video playsinline loop preload="auto"></video>
    <p class="player-empty" hidden>영상을 준비하고 있어요.</p>
    <p class="tap-hint" hidden>화면을 터치하면 소리가 나와요</p>
    <div class="player-ui">
      <button class="pill sound" type="button" aria-pressed="false">소리 켜기</button>
      ${HOMEPAGE ? `<a class="pill" href="${HOMEPAGE}" target="_blank" rel="noopener">공식 홈페이지</a>` : ''}
    </div>`;
  body.appendChild(player);

  const video = player.querySelector('video');
  const empty = player.querySelector('.player-empty');
  const hint = player.querySelector('.tap-hint');
  const soundBtn = player.querySelector('.sound');

  function updateSound() {
    const on = !video.muted;
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.textContent = on ? '소리 끄기' : '소리 켜기';
  }

  function showUI() {
    player.classList.add('ui-visible');
    clearTimeout(uiTimer);
    uiTimer = setTimeout(() => player.classList.remove('ui-visible'), 3500);
  }

  function hideHint() {
    clearTimeout(hintTimer);
    hint.classList.add('is-gone');
  }

  function openScent(slug, { withSound = false, push = false } = {}) {
    const s = bySlug[slug];
    if (!s) return;
    const link = (links[slug] || '').trim();
    if (link) {
      // QR로 들어온 경우엔 뒤로가기에 이 페이지가 남지 않게 replace
      if (push) location.href = link; else location.replace(link);
      return;
    }
    document.title = `${s.name} ${s.no} | INTHEMENTAL`;

    player.classList.remove('is-empty', 'ui-visible');
    empty.hidden = true;
    video.src = s.src || new URL(`videos/${slug}.mp4`, ROOT).href;
    video.muted = !withSound;
    updateSound();
    player.classList.add('is-open');

    const p = video.play();
    if (p) p.catch(() => {
      video.muted = true; updateSound(); showHintIfMuted();
      video.play().catch(() => {});
    });
    showHintIfMuted();

    if (push) {
      openedFromMenu = true;
      history.pushState({ slug }, '', new URL(`${slug}/`, ROOT).href);
    }
  }

  function showHintIfMuted() {
    if (!video.muted) { hint.hidden = true; return; }
    hint.hidden = false;
    hint.classList.remove('is-gone');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(hideHint, 4000);
  }

  function closePlayer() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    player.classList.remove('is-open', 'ui-visible');
    document.title = 'INTHEMENTAL';
  }

  /* 영상 터치: 처음엔 소리 켜기, 그다음부턴 버튼 보이기/숨기기 */
  video.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      if (video.paused) video.play().catch(() => {});
      updateSound();
      hideHint();
      showUI();
    } else if (player.classList.contains('ui-visible')) {
      player.classList.remove('ui-visible');
    } else {
      showUI();
    }
  });

  soundBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.paused) video.play().catch(() => {});
    updateSound();
    hideHint();
    showUI();
  });

  video.addEventListener('error', () => {
    if (!video.getAttribute('src')) return;
    player.classList.add('is-empty');
    empty.hidden = false;
    hint.hidden = true;
    showUI();
  });

  window.addEventListener('popstate', e => {
    if (e.state && e.state.slug) openScent(e.state.slug);
    else { openedFromMenu = false; closePlayer(); }
  });

  /* ---------- 향 페이지 (QR로 바로 들어온 경우) ---------- */
  if (startSlug) { linksReady.then(() => openScent(startSlug)); return; }

  /* ---------- 메인 페이지 ---------- */
  const home = document.getElementById('home');
  const intro = document.getElementById('intro');
  const list = document.getElementById('scent-list');

  list.innerHTML = SCENTS.map(s => `
    <li>
      <button class="scent" type="button" data-slug="${s.slug}">
        <span class="scent-time">${s.time}</span>
        <span class="scent-name">${s.name}<span class="scent-ko">${s.ko}</span></span>
        <span class="scent-no">${s.no}</span>
      </button>
    </li>`).join('');

  intro.addEventListener('click', () => home.classList.add('is-open'));

  // 버튼을 누른 순간이라 소리와 함께 바로 재생
  list.addEventListener('click', e => {
    const btn = e.target.closest('.scent');
    if (btn) openScent(btn.dataset.slug, { withSound: true, push: true });
  });
})();
