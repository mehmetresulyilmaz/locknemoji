// Emoji Kilit Ayarları
const EMOJIS = [
    // Meyveler
    "🍎","🍌","🍇","🍉","🍓","🍒","🍑","🍍","🥝","🥥","🍊","🍋","🍈","🍏","🍐",
    // Hayvanlar
    "🐱","🐶","🦄","🐻","🐼","🦊","🐸","🐵","🦁","🐯","🐷","🐰","🐨","🐙","🐢",
    // Hava Durumu
    "🌧️","☀️","🌞","⛈️","🌩️","🌦️","🌈","❄️","🌪️","🌤️","🌫️",
    // Nesneler
    "🎈","🎲","🎮","🎸","🎹","🎤","🎧","📚","📷","📱","💡","🕹️","🧩",
    // Yüz ifadeleri
    "😀","😂","😍","😎","🥳","😱","😭","😡","😴","🤔","😇","🥰","😜","🤩","😅",
    // Diğer
    "🚗","✈️","🚀","🏀","⚽","🏆","🎯","🛒","🎁","🍕","🍔","🍟","🍿","🍦","🍭"
];
let LOCK_SIZE = 3;
let MAX_ATTEMPTS = 5;
let secret = [];
let guess = [];
let attempts = 0;
let gameOver = false;
let hintCount = 0;
const MAX_HINTS = 2;
const HINT_AFTER_ATTEMPT = 3;

function showDifficultyScreen() {
    document.getElementById('difficulty-screen').style.display = '';
    document.getElementById('game-screen').style.display = 'none';
}

function startGame(level) {
    if (level === 'easy') {
        LOCK_SIZE = 3; // Kolay modda 3 emoji
        MAX_ATTEMPTS = 7; // Kolay modda 7 deneme
    } else if (level === 'medium') {
        LOCK_SIZE = 4;
        MAX_ATTEMPTS = 7;
    } else if (level === 'hard') {
        LOCK_SIZE = 5;
        MAX_ATTEMPTS = 9;
    }
    document.getElementById('difficulty-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = '';
    restartGame();
}

function randomSecret(level) {
    // Kolay modda aynı kategoriden emoji seç
    const categories = [
        ["🍎","🍌","🍇","🍉","🍓","🍒","🍑","🍍","🥝","🥥","🍊","🍋","🍈","🍏","🍐"],
        ["🐱","🐶","🦄","🐻","🐼","🦊","🐸","🐵","🦁","🐯","🐷","🐰","🐨","🐙","🐢"],
        ["🌧️","☀️","🌞","⛈️","🌩️","🌦️","🌈","❄️","🌪️","🌤️","🌫️"],
        ["🎈","🎲","🎮","🎸","🎹","🎤","🎧","📚","📷","📱","💡","🕹️","🧩"],
        ["😀","😂","😍","😎","🥳","😱","😭","😡","😴","🤔","😇","🥰","😜","🤩","😅"],
        ["🚗","✈️","🚀","🏀","⚽","🏆","🎯","🛒","🎁","🍕","🍔","🍟","🍿","🍦","🍭"]
    ];
    let arr = [];
    let used = new Set();
    if (level === 'easy') {
        // Kolay modda tek bir kategoriden seç
        let catIdx = Math.floor(Math.random()*categories.length);
        let pool = categories[catIdx].slice();
        while (arr.length < LOCK_SIZE) {
            let idx = Math.floor(Math.random()*pool.length);
            let emoji = pool.splice(idx, 1)[0];
            arr.push(emoji);
        }
    } else {
        // Kategorileri ayır
        let catCount = Math.min(categories.length, LOCK_SIZE);
        let cats = [...Array(categories.length).keys()];
        for (let i = 0; i < catCount; i++) {
            let catIdx = cats.splice(Math.floor(Math.random()*cats.length), 1)[0];
            let pool = categories[catIdx].filter(e => !used.has(e));
            let emoji = pool[Math.floor(Math.random()*pool.length)];
            arr.push(emoji);
            used.add(emoji);
        }
        // Kalan slotlar için rastgele kategoriden, tekrar etmeyen emoji seç
        while (arr.length < LOCK_SIZE) {
            let catIdx = Math.floor(Math.random()*categories.length);
            let pool = categories[catIdx].filter(e => !used.has(e));
            if (pool.length === 0) continue;
            let emoji = pool[Math.floor(Math.random()*pool.length)];
            arr.push(emoji);
            used.add(emoji);
        }
    }
    // Sıralamayı karıştır
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Sıcaklık (yakınlık) hesaplama fonksiyonu
function getHotColdColor() {
    // Doğru yerdeki emoji sayısını bul
    let correct = 0;
    for (let i = 0; i < LOCK_SIZE; i++) {
        if (guess[i] === secret[i]) correct++;
    }
    // Oranla sıcaklık belirle
    const ratio = correct / LOCK_SIZE;
    // Mavi (soğuk) → Sarı → Turuncu → Kırmızı (sıcak)
    if (ratio === 1) return '#ff3b3b'; // Tam doğru: kırmızı
    if (ratio >= 0.66) return '#ff9800'; // turuncu
    if (ratio >= 0.33) return '#ffe066'; // sarı
    return '#43c6ac'; // soğuk (mavi-yeşil)
}

function openEmojiModal(slotIdx) {
    const modal = document.getElementById('emoji-modal');
    modal.innerHTML = '<div class="emoji-modal-content">' +
        EMOJIS.map(e => `<button class=\"emoji-choice\" onclick=\"selectEmoji('${e}',${slotIdx})\">${e}</button>`).join('') +
        '<button class="emoji-modal-close" onclick="closeEmojiModal()">Kapat</button>' +
        '</div>';
    modal.style.display = 'flex';
}

function closeEmojiModal() {
    const modal = document.getElementById('emoji-modal');
    modal.style.display = 'none';
    modal.innerHTML = '';
}

function selectEmoji(emoji, slotIdx) {
    guess[slotIdx] = emoji;
    closeEmojiModal();
    renderLock();
}

function renderLock() {
    const row = document.getElementById('lock-row');
    row.innerHTML = '';
    for (let i=0; i<LOCK_SIZE; i++) {
        const btn = document.createElement('button');
        btn.textContent = guess[i];
        btn.style.fontSize = '2rem';
        btn.style.width = '48px';
        btn.style.height = '48px';
        btn.style.borderRadius = '12px';
        btn.style.border = '2px solid #43c6ac';
        btn.style.background = '#f8ffae';
        btn.onclick = () => {
            if (gameOver) return;
            openEmojiModal(i);
        };
        row.appendChild(btn);
    }
}

function feedbackRow(guessArr) {
    let fb = [];
    let usedSecret = [...secret];
    let usedGuess = Array(LOCK_SIZE).fill(false);
    for (let i=0; i<LOCK_SIZE; i++) {
        if (guessArr[i] === secret[i]) {
            fb[i] = '🟢';
            usedSecret[i] = null;
            usedGuess[i] = true;
        }
    }
    for (let i=0; i<LOCK_SIZE; i++) {
        if (!usedGuess[i]) {
            let idx = usedSecret.indexOf(guessArr[i]);
            if (idx !== -1 && usedSecret[idx] !== null) {
                fb[i] = '🟡';
                usedSecret[idx] = null;
            } else {
                fb[i] = '🔴';
            }
        }
    }
    return fb;
}

function getShareText() {
    // Oyun numarası için bugünün tarihiyle basit bir sayı üretelim
    const today = new Date();
    const gameNumber = today.getFullYear()*10000 + (today.getMonth()+1)*100 + today.getDate();
    let text = `locknemoji ${gameNumber} ${gameOver && attempts <= MAX_ATTEMPTS ? attempts : 'X'}/${MAX_ATTEMPTS}\n`;
    // Sadece kutucuklardan oluşan tablo
    const feedbackDivs = document.getElementById('feedback-list').children;
    for (let i = 0; i < feedbackDivs.length; i++) {
        const row = feedbackDivs[i];
        let fb = row.querySelector('span:last-child')?.textContent || '';
        // 🟢 → 🟩, 🟡 → 🟨, 🔴 → ⬛
        fb = fb.replace(/🟢/g, '🟩').replace(/🟡/g, '🟨').replace(/🔴/g, '⬛');
        text += `${fb}\n`;
    }
    text += '\nlocknemoji.app';
    return text;
}

function showShareButton() {
    let shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) {
        shareBtn = document.createElement('button');
        shareBtn.id = 'shareBtn';
        shareBtn.textContent = 'Paylaş';
        shareBtn.onclick = () => {
            const shareText = getShareText();
            navigator.clipboard.writeText(shareText).then(() => {
                shareBtn.textContent = 'Kopyalandı!';
                setTimeout(() => { shareBtn.textContent = 'Paylaş'; }, 1500);
            });
        };
        document.getElementById('result').appendChild(shareBtn);
    }
}

function showHintButton() {
    let hintBtn = document.getElementById('hintBtn');
    if (!hintBtn && attempts >= HINT_AFTER_ATTEMPT && hintCount < MAX_HINTS && !gameOver) {
        hintBtn = document.createElement('button');
        hintBtn.id = 'hintBtn';
        hintBtn.textContent = `Hint (${MAX_HINTS - hintCount})`;
        hintBtn.onclick = giveHint;
        document.getElementById('result').appendChild(hintBtn);
    } else if (hintBtn) {
        hintBtn.textContent = `Hint (${MAX_HINTS - hintCount})`;
        if (hintCount >= MAX_HINTS || gameOver) hintBtn.disabled = true;
    }
}

function giveHint() {
    if (hintCount >= MAX_HINTS || gameOver) return;
    // Rastgele bir slot seç, daha önce gösterilmemiş olsun
    if (!window.hintedSlots) window.hintedSlots = [];
    let available = [];
    for (let i = 0; i < LOCK_SIZE; i++) {
        if (!window.hintedSlots.includes(i)) available.push(i);
    }
    if (available.length === 0) return;
    let slot = available[Math.floor(Math.random() * available.length)];
    window.hintedSlots.push(slot);
    hintCount++;
    // İpucunu göster
    let hintDiv = document.getElementById('hintDiv');
    if (!hintDiv) {
        hintDiv = document.createElement('div');
        hintDiv.id = 'hintDiv';
        hintDiv.style.marginTop = '8px';
        document.getElementById('result').appendChild(hintDiv);
    }
    hintDiv.innerHTML += `<div>${slot+1}. kutudaki emoji: <span style='font-size:1.3em'>${secret[slot]}</span></div>`;
    showHintButton();
}

function submitGuess() {
    if (gameOver) return;
    attempts++;
    const fb = feedbackRow(guess);
    const feedbackList = document.getElementById('feedback-list');
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '8px';
    for (let i=0; i<LOCK_SIZE; i++) {
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = guess[i];
        emojiSpan.style.fontSize = '1.5rem';
        div.appendChild(emojiSpan);
    }
    const fbSpan = document.createElement('span');
    fbSpan.textContent = fb.join('');
    fbSpan.style.marginLeft = '12px';
    div.appendChild(fbSpan);
    feedbackList.appendChild(div);
    if (fb.every(x=>x==='🟢')) {
        document.getElementById('result').textContent = `Tebrikler! Kilit açıldı! 🔓 (${attempts}. deneme)`;
        document.getElementById('restartBtn').style.display = '';
        gameOver = true;
        document.getElementById('submitBtn').disabled = true;
        showShareButton();
    } else if (attempts >= MAX_ATTEMPTS) {
        document.getElementById('result').textContent = `Kaybettin! Doğru kombinasyon: ${secret.join(' ')} 😜`;
        document.getElementById('restartBtn').style.display = '';
        gameOver = true;
        document.getElementById('submitBtn').disabled = true;
        showShareButton();
    }
    document.getElementById('score').textContent = `Deneme: ${attempts} / ${MAX_ATTEMPTS}`;
    showHintButton();
}

function restartGame() {
    // Her oyun başında guess dizisini de random başlat
    secret = randomSecret(window.currentLevel || 'easy');
    // guess dizisi de EMOJIS listesinden rastgele seçilsin, secret ile aynı olmasın
    let pool = [...EMOJIS];
    secret.forEach(e => {
        const i = pool.indexOf(e);
        if (i !== -1) pool.splice(i, 1);
    });
    guess = [];
    for (let i = 0; i < LOCK_SIZE; i++) {
        let idx = Math.floor(Math.random() * pool.length);
        guess.push(pool[idx]);
        pool.splice(idx, 1);
    }
    attempts = 0;
    gameOver = false;
    hintCount = 0;
    window.hintedSlots = [];
    let hintDiv = document.getElementById('hintDiv');
    if (hintDiv) hintDiv.innerHTML = '';
    let hintBtn = document.getElementById('hintBtn');
    if (hintBtn) hintBtn.remove();
    document.getElementById('feedback-list').innerHTML = '';
    document.getElementById('result').textContent = '';
    document.getElementById('score').textContent = `Deneme: 0 / ${MAX_ATTEMPTS}`;
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('submitBtn').disabled = false;
    renderLock();
}

// Başlangıçta zorluk ekranı göster
showDifficultyScreen();
