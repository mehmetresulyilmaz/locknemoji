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

function showDifficultyScreen() {
    document.getElementById('difficulty-screen').style.display = '';
    document.getElementById('game-screen').style.display = 'none';
}

function startGame(level) {
    if (level === 'easy') {
        LOCK_SIZE = 3;
        MAX_ATTEMPTS = 5;
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

function randomSecret() {
    // EMOJIS listesinden rastgele LOCK_SIZE kadar farklı emoji seç, karışık türlerden olmasını garanti et
    // Kategorileri ayır
    const categories = [
        // Meyveler
        ["🍎","🍌","🍇","🍉","🍓","🍒","🍑","🍍","🥝","🥥","🍊","🍋","🍈","🍏","🍐"],
        // Hayvanlar
        ["🐱","🐶","🦄","🐻","🐼","🦊","🐸","🐵","🦁","🐯","🐷","🐰","🐨","🐙","🐢"],
        // Hava Durumu
        ["🌧️","☀️","🌞","⛈️","🌩️","🌦️","🌈","❄️","🌪️","🌤️","🌫️"],
        // Nesneler
        ["🎈","🎲","🎮","🎸","🎹","🎤","🎧","📚","📷","📱","💡","🕹️","🧩"],
        // Yüz ifadeleri
        ["😀","😂","😍","😎","🥳","😱","😭","😡","😴","🤔","😇","🥰","😜","🤩","😅"],
        // Diğer
        ["🚗","✈️","🚀","🏀","⚽","🏆","🎯","🛒","🎁","🍕","🍔","🍟","🍿","🍦","🍭"]
    ];
    let arr = [];
    let used = new Set();
    // Önce her kategoriden en az bir tane seç (eğer LOCK_SIZE yeterliyse)
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
    // Sıralamayı karıştır
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
            let idx = EMOJIS.indexOf(guess[i]);
            guess[i] = EMOJIS[(idx+1)%EMOJIS.length];
            renderLock();
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
    } else if (attempts >= MAX_ATTEMPTS) {
        document.getElementById('result').textContent = `Kaybettin! Doğru kombinasyon: ${secret.join(' ')} 😜`;
        document.getElementById('restartBtn').style.display = '';
        gameOver = true;
        document.getElementById('submitBtn').disabled = true;
    }
    document.getElementById('score').textContent = `Deneme: ${attempts} / ${MAX_ATTEMPTS}`;
}

function restartGame() {
    // Her oyun başında guess dizisini de random başlat
    secret = randomSecret();
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
    document.getElementById('feedback-list').innerHTML = '';
    document.getElementById('result').textContent = '';
    document.getElementById('score').textContent = `Deneme: 0 / ${MAX_ATTEMPTS}`;
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('submitBtn').disabled = false;
    renderLock();
}

// Başlangıçta zorluk ekranı göster
showDifficultyScreen();
