// structure.js: locknemoji statik içerik ve HTML bölümlerini dinamik olarak ekler

document.addEventListener('DOMContentLoaded', function() {
    // Proje imzası
    document.getElementById('project-signature').innerHTML = `
        <div style="font-size:0.95em; color:#43c6ac; margin-bottom:8px; letter-spacing:1px;">
            <b>locknemoji</b> <span style="color:#888;">|</span> <span style="color:#888;">by</span> <b>mehmetresulyilmaz</b>
        </div>
    `;

    // Zorluk ve kurallar ekranı
    document.getElementById('difficulty-screen').innerHTML = `
        <button class="rules-toggle" onclick="toggleRules()" id="rulesBtn">Oyun Kurallarını Göster</button>
        <div class="rules-box" id="rulesBox">
            <b>Oyun Kuralları:</b><br>
            <ul style="margin:8px 0 0 18px; padding:0;">
                <li>Doğru emoji kombinasyonunu bulmaya çalış.</li>
                <li>Her kutuya tıklayarak emojileri değiştir, tahminini oluştur.</li>
                <li>"Tahmini Gönder" ile denemeni yap.</li>
                <li>Her denemede:<br>
                    <span style="font-size:1.1em;">🟢</span> Doğru emoji ve doğru sıra<br>
                    <span style="font-size:1.1em;">🟡</span> Doğru emoji, yanlış sıra<br>
                    <span style="font-size:1.1em;">🔴</span> Hiç yok
                </li>
                <li>Tüm emojileri doğru sırada bulunca kilit açılır!</li>
                <li>Deneme hakkın bitince oyun sona erer.</li>
            </ul>
        </div>
        <h2>🔒 Emoji Kilit</h2>
        <p>Zorluk seç:</p>
        <button onclick="startGame('easy')">Kolay<br><span style='font-size:0.9em'>(3 emoji, 5 deneme)</span></button>
        <button onclick="startGame('medium')">Orta<br><span style='font-size:0.9em'>(4 emoji, 7 deneme)</span></button>
        <button onclick="startGame('hard')">Zor<br><span style='font-size:0.9em'>(5 emoji, 9 deneme)</span></button>
    `;

    // Oyun ekranı (boş, app.js dolduracak)
    document.getElementById('game-screen').innerHTML = `
        <h2>🔒 Emoji Kilit</h2>
        <div id="lock-row"></div>
        <button id="submitBtn" onclick="submitGuess()">Tahmini Gönder</button>
        <div id="feedback-list"></div>
        <div class="score" id="score"></div>
        <div class="result" id="result"></div>
        <button onclick="restartGame()" style="display:none; margin-top:12px;" id="restartBtn">Tekrar Oyna</button>
        <button onclick="showDifficultyScreen()" style="margin-top:8px;">Zorluk Değiştir</button>
    `;

    // Footer
    document.getElementById('footer').innerHTML = `
        <span>locknemoji © 2025</span>
    `;

    // toggleRules fonksiyonunu global olarak ekle
    window.toggleRules = function() {
        const box = document.getElementById('rulesBox');
        const btn = document.getElementById('rulesBtn');
        if (box.style.display === 'block') {
            box.style.display = 'none';
            btn.textContent = 'Oyun Kurallarını Göster';
        } else {
            box.style.display = 'block';
            btn.textContent = 'Oyun Kurallarını Gizle';
        }
    };
    // Dark mode toggle fonksiyonunu global olarak ekle
    window.toggleDark = function() {
        document.body.classList.toggle('dark');
        const darkBtn = document.getElementById('darkBtn');
        if(document.body.classList.contains('dark')) {
            darkBtn.textContent = '☀️ Açık Tema';
        } else {
            darkBtn.textContent = '🌙 Koyu Tema';
        }
    };
    // Varsayılan olarak buton metni açık tema olsun
    const darkBtn = document.getElementById('darkBtn');
    if (darkBtn) darkBtn.textContent = '☀️ Açık Tema';
    // Oyun kuralları kutusu ilk başta gizli olsun
    const rulesBox = document.getElementById('rulesBox');
    if (rulesBox) rulesBox.style.display = 'none';
});
