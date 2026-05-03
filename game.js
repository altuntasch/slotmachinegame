const symbols = [
  { icon: '⚡', name: 'Pulse', value: 12 },
  { icon: '◈', name: 'Shard', value: 10 },
  { icon: '⬢', name: 'Hex', value: 8 },
  { icon: '✶', name: 'Spark', value: 6 },
  { icon: '◎', name: 'Core', value: 14 }
];

const state = {
  round: 1,
  score: 0,
  goal: 120,
  credits: 50,
  spins: 0,
  spinLimit: 5,
  spinCost: 5,
  bonusMultiplier: 1,
  flatBonus: 0,
};

const el = {
  round: document.getElementById('round'),
  spins: document.getElementById('spins'),
  spinLimit: document.getElementById('spin-limit'),
  credits: document.getElementById('credits'),
  goal: document.getElementById('goal'),
  score: document.getElementById('score'),
  reels: document.getElementById('reels'),
  log: document.getElementById('log'),
  spinBtn: document.getElementById('spin-btn'),
  shopBtn: document.getElementById('shop-btn'),
  nextBtn: document.getElementById('next-btn'),
  shop: document.getElementById('shop'),
  shopCards: document.getElementById('shop-cards'),
  closeShop: document.getElementById('close-shop'),
};

const shopItems = [
  { id: 'mult', name: 'Neon Lens', text: '+0.25 çarpan', cost: 12, apply: () => state.bonusMultiplier += 0.25 },
  { id: 'flat', name: 'Data Cache', text: '+12 sabit puan', cost: 10, apply: () => state.flatBonus += 12 },
  { id: 'spin', name: 'Energy Cell', text: '+1 spin limiti', cost: 14, apply: () => state.spinLimit += 1 },
];

function drawReels(results = []) {
  el.reels.innerHTML = '';
  for (let i = 0; i < 5; i += 1) {
    const slot = document.createElement('div');
    slot.className = 'reel';
    slot.textContent = results[i]?.icon || '◇';
    slot.title = results[i] ? `${results[i].name} (${results[i].value})` : 'Boş';
    el.reels.appendChild(slot);
  }
}

function updateUI() {
  el.round.textContent = state.round;
  el.spins.textContent = state.spins;
  el.spinLimit.textContent = state.spinLimit;
  el.credits.textContent = state.credits;
  el.goal.textContent = state.goal;
  el.score.textContent = Math.floor(state.score);
  const canSpin = state.credits >= state.spinCost && state.spins < state.spinLimit;
  el.spinBtn.disabled = !canSpin;
  el.nextBtn.disabled = !(state.score >= state.goal);
}

function log(message, cls = '') {
  el.log.innerHTML = `<p class="${cls}">${message}</p>`;
}

function spin() {
  if (state.credits < state.spinCost || state.spins >= state.spinLimit) return;
  state.credits -= state.spinCost;
  state.spins += 1;

  const result = Array.from({ length: 5 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
  drawReels(result);

  const base = result.reduce((a, s) => a + s.value, 0);
  const counts = result.reduce((acc, s) => {
    acc[s.icon] = (acc[s.icon] || 0) + 1;
    return acc;
  }, {});

  const maxGroup = Math.max(...Object.values(counts));
  const chainBonus = maxGroup >= 3 ? maxGroup * 15 : 0;
  const gained = (base + chainBonus + state.flatBonus) * state.bonusMultiplier;
  state.score += gained;

  if (state.score >= state.goal) {
    log(`Hedef geçildi! +${Math.floor(gained)} puan. Sonraki rounda geçebilirsin.`, 'win');
  } else if (state.spins >= state.spinLimit) {
    log('Spin hakkı bitti. Mağazadan güç al veya run yeniden başlat.', 'lose');
  } else {
    log(`+${Math.floor(gained)} puan. Zincir bonusu: ${chainBonus}.`, '');
  }

  updateUI();
}

function openShop() {
  el.shop.classList.remove('hidden');
  el.shopCards.innerHTML = '';
  shopItems.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `<h3>${item.name}</h3><p>${item.text}</p><p>Maliyet: ${item.cost}</p>`;
    const btn = document.createElement('button');
    btn.textContent = 'Satın al';
    btn.disabled = state.credits < item.cost;
    btn.addEventListener('click', () => {
      if (state.credits < item.cost) return;
      state.credits -= item.cost;
      item.apply();
      log(`${item.name} alındı.`, 'win');
      openShop();
      updateUI();
    });
    card.appendChild(btn);
    el.shopCards.appendChild(card);
  });
}

function nextRound() {
  state.round += 1;
  state.spins = 0;
  state.score = 0;
  state.spinLimit += 1;
  state.goal = Math.floor(state.goal * 1.35);
  state.credits += 15;
  log(`Round ${state.round} başladı. Hedef ${state.goal}.`, '');
  updateUI();
}

el.spinBtn.addEventListener('click', spin);
el.shopBtn.addEventListener('click', openShop);
el.closeShop.addEventListener('click', () => el.shop.classList.add('hidden'));
el.nextBtn.addEventListener('click', nextRound);

drawReels();
updateUI();
log('Cyberpunk roguelike slot runı başlatmak için Spin butonuna tıkla.');
