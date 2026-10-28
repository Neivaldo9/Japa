(() => {
  const WHATSAPP_NUMBER = '258851971086';
  const MUSICS = [
    { name: 'Música 1', file: 'audio/musica1.mp3' },
    { name: 'Música 2', file: 'audio/musica3.mp3' }
  ];
  const WHATSAPP_MSG = 'Oi! Vi a história que fizeste para mim ✨ O que achei foi: ';
  const screens = [...document.querySelectorAll('.screen')];
  const progressFill = document.getElementById('progressFill');
  const pageCount = document.getElementById('pageCount');
  const secretBox = document.getElementById('secretBox');
  const choiceResult = document.getElementById('choiceResult');
  const toast = document.getElementById('toast');
  let current = 0;
  let audioContext = null;
  let musicOn = false;
  let musicTimer = null;

  const secrets = [
    'Uma conversa boa vale mais do que ganhar uma partida. ♡',
    'Suspeita de impostora: quem diz que ganha sempre… mas ainda não apresentou provas. 🕵️😂',
    'Rainha do lobby: muita confiança, muita provocação… e as provas da vitória a aguardar. 🎮'
  ];
  const choices = {
    fire: 'Missão selecionada: Free Fire, melhor de três. Regra oficial: nada de celebrar a vitória antes do resultado. 😂🔥',
    chess: 'Missão selecionada: xadrez. Que vença a melhor estratégia… e que ninguém vire o tabuleiro quando perder. ♟️😉',
    among: 'Missão selecionada: Among Us. A suspeita principal é quem está a rir demasiado enquanto nega tudo. 🕵️😂'
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function goTo(index) {
    if (index < 0 || index >= screens.length || index === current) return;
    const old = screens[current];
    old.classList.add('leaving');
    setTimeout(() => {
      old.classList.remove('active', 'leaving');
      current = index;
      screens[current].classList.add('active');
      progressFill.style.width = `${((current + 1) / screens.length) * 100}%`;
      pageCount.textContent = `${current + 1} / ${screens.length}`;
      if (current === 2) showToast('Psst… toca nas três flores ✨');
      if (current === 5) showToast('Escolhe o teu desafio, campeã 😉');
      if (current === 7) showToast('Última decisão… pensa bem 😏');
      if (current === 8) runLetter();
    }, 210);
  }

  document.querySelectorAll('[data-next]').forEach(button => {
    button.addEventListener('click', () => goTo(Math.min(current + 1, screens.length - 1)));
  });

  document.querySelectorAll('[data-secret]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-secret]').forEach(item => item.classList.remove('found'));
      button.classList.add('found');
      softReveal(secretBox, secrets[Number(button.dataset.secret)]);
      secretBox.animate([{opacity: .2, transform: 'translateY(6px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 400, easing: 'ease-out'});
    });
  });

  document.querySelectorAll('[data-choice]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-choice]').forEach(item => item.classList.remove('selected'));
      button.classList.add('selected');
      const [icon, title, text, rule] = cuteData[button.dataset.choice];
      document.getElementById('cuteRule').textContent = rule;
      document.getElementById('cuteIcon').textContent = icon;
      document.getElementById('cute-title').textContent = title;
      softReveal(document.getElementById('cuteText'), text);
      setTimeout(() => document.getElementById('choiceNext').click(), 450);
    });
  });

  document.getElementById('replay').addEventListener('click', () => {
    screens[current].classList.remove('active');
    current = 0;
    screens.forEach((screen, i) => screen.classList.toggle('active', i === 0));
    progressFill.style.width = `${100 / screens.length}%`;
    pageCount.textContent = `1 / ${screens.length}`;
    secretBox.textContent = 'Escolhe uma flor para revelar uma mensagem ✨';
    choiceResult.textContent = '';
    resetDuel(); resetProof();
    document.querySelectorAll('.found, .selected').forEach(item => item.classList.remove('found', 'selected'));
    showToast('A história começa outra vez ♡');
  });

  progressFill.style.width = `${100 / screens.length}%`;
  pageCount.textContent = `1 / ${screens.length}`;

  // Painel do desafio: "Aceito" ou o botão que foge.
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const duelResult = document.getElementById('duelResult');
  const afterDuel = document.getElementById('afterDuel');
  const nopeLines = ['Ups, escorregou 😂', 'Ninguém recusa duelos aqui 😌', 'Quase! Tenta outra vez 👀', 'Esse botão tem medo de perder 🏃', 'Já percebeste a resposta certa 😏', 'Desiste, Japa… aceita 😂'];
  let dodges = 0;

  function dodge(event) {
    if (event && event.cancelable) event.preventDefault();
    const r = noBtn.getBoundingClientRect();
    if (!noBtn.classList.contains('fleeing')) {
      noBtn.style.left = `${r.left}px`; noBtn.style.top = `${r.top}px`;
      noBtn.classList.add('fleeing'); void noBtn.offsetWidth;
    }
    const pad = 12, maxX = innerWidth - r.width - pad, maxY = innerHeight - r.height - pad;
    let x, y, tries = 0;
    do { x = pad + Math.random() * maxX; y = pad + Math.random() * maxY; tries++; }
    while (tries < 15 && Math.hypot(x - r.left, y - r.top) < 140);
    noBtn.style.left = `${x}px`; noBtn.style.top = `${y}px`;
    showToast(nopeLines[dodges++ % nopeLines.length]);
  }
  ['pointerenter', 'pointerdown', 'mousedown', 'touchstart', 'focus', 'click'].forEach(ev => noBtn.addEventListener(ev, dodge, { passive: false }));

  function burst() {
    const r = yesBtn.getBoundingClientRect();
    for (let i = 0; i < 16; i++) {
      const h = document.createElement('span');
      h.className = 'float-heart';
      h.textContent = ['♡', '✦', '♥'][i % 3];
      h.style.left = `${r.left + r.width / 2}px`; h.style.top = `${r.top + r.height / 2}px`;
      h.style.setProperty('--dx', `${Math.random() * 280 - 140}px`);
      h.style.setProperty('--dy', `${-(70 + Math.random() * 170)}px`);
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1500);
    }
  }

  yesBtn.addEventListener('click', () => {
    yesBtn.disabled = true; yesBtn.textContent = 'Desafio aceito ✓';
    softReveal(duelResult, 'Sabia que ias aceitar. 😌 Que comece a melhor de três… mas já sabes quem vai ganhar. 🏆');
    afterDuel.classList.remove('is-hidden');
    burst();
  });

  function resetDuel() {
    noBtn.dataset.done = ''; noBtn.className = 'nope';
    noBtn.style.left = noBtn.style.top = '';
    yesBtn.disabled = false; yesBtn.textContent = 'Aceito o desafio 🔥';
    duelResult.textContent = ''; afterDuel.classList.add('is-hidden'); dodges = 0;
  }

  const cuteData = {
    fire: ['🔥', 'Free Fire, então!', 'Melhor de três, boa energia e muitos risos. Prometo ser um bom perdedor… se perder. 😌', 'Regra de ouro: quem perder tem de dizer três coisas lindas sobre o outro. 💗'],
    chess: ['♟️', 'Xadrez, então!', 'Já sabes como acabou da última vez, mas vamos fingir que a história está em aberto. 🌷', 'Regra de ouro: quem perder escolhe a música da próxima partida. 🎶'],
    among: ['🕵️', 'Among Us, então!', 'Vamos descobrir quem é a impostora. Dica: quem está a rir demasiado. 🌸', 'Regra de ouro: quem for apanhada como impostora conta um segredo fofo. 🌷']
  };
  const petals = document.querySelector('.petals');
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('span');
    p.textContent = ['🌸', '♡', '✿'][i % 3];
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${-Math.random() * 12}s`;
    p.style.animationDuration = `${9 + Math.random() * 7}s`;
    p.style.fontSize = `${0.9 + Math.random() * 0.9}rem`;
    petals.appendChild(p);
  }

  document.querySelectorAll('.letter p').forEach((p, i) => p.style.setProperty('--i', i));

  function softReveal(el, text, delay = 0) {
    el.textContent = '';
    const words = text.split(' ');
    words.forEach((word, i) => {
      const s = document.createElement('span');
      s.className = 'w'; s.textContent = word;
      s.style.animationDelay = `${delay + i * 0.07}s`;
      el.appendChild(s);
      el.appendChild(document.createTextNode(' '));
    });
    return delay + words.length * 0.07;
  }
  function runLetter() {
    let t = 0.2;
    const paragraphs = document.querySelectorAll('.letter p');
    paragraphs.forEach(p => { p.dataset.full = p.dataset.full || p.textContent; t = softReveal(p, p.dataset.full, t) + 0.4; });
    const btn = document.querySelector('.letter-screen > .primary');
    btn.style.animationDelay = `${t}s`;
    document.querySelector('.letter').onclick = () => {
      document.querySelectorAll('.letter .w').forEach(w => { w.style.animationDelay = '0s'; });
      btn.style.animationDelay = '0s';
    };
  }

  const palette = ['#ffb7d6', '#d9b3ff', '#ffe08a', '#9ee7ff', '#ff8fc7', '#b8f0cf'];
  const flowerLayer = document.createElement('div');
  flowerLayer.className = 'flower-layer';
  document.body.appendChild(flowerLayer);
  for (let i = 0; i < 18; i++) {
    const f = document.createElement('span');
    const g = document.createElement('i');
    f.className = 'flower';
    g.textContent = ['✿', '❀', '✾'][i % 3];
    g.style.color = palette[i % palette.length];
    f.appendChild(g);
    f.style.left = `${Math.random() * 96}%`;
    f.style.fontSize = `${16 + Math.random() * 16}px`;
    f.style.animationDuration = `${12 + Math.random() * 10}s`;
    f.style.animationDelay = `${-Math.random() * 20}s`;
    f.style.setProperty('--sway', `${Math.random() * 80 - 40}px`);
    flowerLayer.appendChild(f);
  }
  document.addEventListener('pointerdown', e => {
    flowerLayer.querySelectorAll('.flower').forEach(f => {
      const r = f.getBoundingClientRect(), pad = 14;
      if (e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad) {
        const g = f.firstChild;
        g.style.color = palette[Math.floor(Math.random() * palette.length)];
        g.classList.remove('pop'); void g.offsetWidth; g.classList.add('pop');
      }
    });
  }, { passive: true });

  const proofResult = document.getElementById('proofResult');
  const afterProof = document.getElementById('afterProof');
  const polaroid = document.getElementById('polaroid');
  const proofLines = {
    me: 'Sabia que eras justa. 😌 Xeque-mate é xeque-mate. ♟️',
    her: 'Ah sim? “Deixei-te ganhar”… ninguém acredita, mas deixo-te ficar com essa versão. 😌 Resultado oficial: Programador 1 – Japa 0. 😂'
  };
  document.querySelectorAll('[data-proof]').forEach(button => {
    button.addEventListener('click', () => {
      softReveal(proofResult, proofLines[button.dataset.proof]);
      afterProof.classList.remove('is-hidden');
      if (button.dataset.proof === 'her') { polaroid.classList.remove('shake'); void polaroid.offsetWidth; polaroid.classList.add('shake'); }
    });
  });
  function resetProof() { proofResult.textContent = ''; afterProof.classList.add('is-hidden'); polaroid.classList.remove('shake'); }

  const waLink = document.getElementById('waLink');
  waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;
  waLink.addEventListener('click', e => {
    if (WHATSAPP_NUMBER.includes('X')) { e.preventDefault(); showToast('Falta pôr o número do WhatsApp no js/app.js'); }
  });

  const secretTitle = document.getElementById('secretTitle');
  let titleTaps = 0;
  let titleTapTimer = null;
  secretTitle.addEventListener('click', () => {
    titleTaps++;
    clearTimeout(titleTapTimer);
    titleTapTimer = setTimeout(() => { titleTaps = 0; }, 1800);
    if (titleTaps >= 5) {
      titleTaps = 0;
      showToast('Easter egg: o programador aceita a desforra… quando a campeã estiver pronta. 😂🏆');
      secretTitle.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}], {duration:500});
    }
  });
  secretTitle.style.cursor = 'pointer';
  secretTitle.title = 'Psst… toca aqui várias vezes 👀';

  const starLayer = document.getElementById('stars');
  for (let i = 0; i < 0; i++) {
    const star = document.createElement('span');
    star.className = 'sparkle';
    star.textContent = Math.random() > .5 ? '✦' : '·';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.fontSize = `${8 + Math.random() * 13}px`;
    star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
    star.style.animationDelay = `${Math.random() * 4}s`;
    starLayer.appendChild(star);
  }

  function playSoftTone() {
    if (!musicOn || !audioContext) return;
    const notes = [261.63, 329.63, 392.00, 329.63];
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = notes[Math.floor(Math.random() * notes.length)];
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.025, audioContext.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.1);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.15);
  }

  const musicToggle = document.getElementById('musicToggle');
  const picker = document.getElementById('musicPicker');
  let fileAudio = null;
  let currentTrack = 0;

  function setLabel() {
    musicToggle.textContent = musicOn ? '♫' : '♫ ✕';
    musicToggle.setAttribute('aria-pressed', String(musicOn));
  }
  function stopMusic() {
    if (fileAudio) fileAudio.pause();
    clearInterval(musicTimer);
    musicOn = false;
  }
  async function playTrack(i) {
    stopMusic();
    picker.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', Number(c.dataset.i) === i));
    if (i < 0) { setLabel(); return; }
    currentTrack = i;
    const track = MUSICS[i];
    fileAudio = new Audio(track.file);
    fileAudio.loop = true; fileAudio.volume = .6;
    try {
      await fileAudio.play();
      musicOn = true;
      showToast(`♫ ${track.name}`);
    } catch (_) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) { showToast('Este navegador não suporta áudio.'); setLabel(); return; }
      audioContext = audioContext || new Ctx();
      await audioContext.resume();
      musicOn = true; playSoftTone(); musicTimer = setInterval(playSoftTone, 1500);
    }
    setLabel();
  }
  [...MUSICS.map((t, i) => [t.name, i]), ['Sem música', -1]].forEach(([name, i]) => {
    const b = document.createElement('button');
    b.className = 'chip'; b.dataset.i = i; b.textContent = name;
    b.addEventListener('click', () => playTrack(i));
    picker.appendChild(b);
  });
  musicToggle.addEventListener('click', () => {
    if (musicOn) { stopMusic(); setLabel(); } else playTrack(currentTrack);
  });
})();
