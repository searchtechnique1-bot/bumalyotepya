// Bumal YotePya - Main JavaScript
let comicsData = [];

// Website စတင်လာရင်
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Bumal YotePya Website Started!');
    loadComicsFromStorage();
    updateStats();
});

// localStorage ကနေ comics ဖတ်မယ်
function loadComicsFromStorage() {
    const savedComics = localStorage.getItem('bumalYotePyaComics');
    
    if (savedComics) {
        comicsData = JSON.parse(savedComics);
        console.log('📚 Loaded comics:', comicsData.length);
    } else {
        // Sample comics ထည့်ပေးမယ်
        comicsData = [
            {
                id: 1,
                title: "မြန်မာ့ဒဏ္ဍာရီများ",
                description: "ရှေးဟောင်းမြန်မာ့ဒဏ္ဍာရီပုံပြင်များ",
                coverImage: "📖",
                pdfUrl: "https://drive.google.com/file/d/your-file-id/view",
                pages: 45,
                uploadDate: "2024-01-15"
            },
            {
                id: 2,
                title: "ကျေးလက်ဘဝဇာတ်လမ်းများ",
                description: "မြန်မာကျေးလက်ဒေသများမှ စိတ်ဝင်စားဖွယ်ဇာတ်လမ်းများ",
                coverImage: "🏞️",
                pdfUrl: "https://drive.google.com/file/d/your-file-id/view",
                pages: 32,
                uploadDate: "2024-01-10"
            }
        ];
        saveComicsToStorage();
    }
    
    displayComics();
}

// Comics data သိမ်းမယ်
function saveComicsToStorage() {
    localStorage.setItem('bumalYotePyaComics', JSON.stringify(comicsData));
    console.log('💾 Comics saved to storage');
}

// Comics တွေကိုပြမယ်
function displayComics() {
    const comicsList = document.getElementById('comics-list');
    
    if (comicsData.length === 0) {
        comicsList.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 5rem; margin-bottom: 1rem;">📚</div>
                <h3>မည်သည့်ရုပ်ပြမှ မတွေ့ရှိသေးပါ</h3>
                <p>Admin panel မှ ရုပ်ပြများတင်ပြီးပါက ဤနေရာတွင်ပေါ်လာပါမည်</p>
                <a href="admin/upload.html" class="empty-state-btn">
                    📖 စာအုပ်အသစ်တင်ရန်
                </a>
            </div>
        `;
        return;
    }
    
    comicsList.innerHTML = '';
    
    comicsData.forEach(comic => {
        const comicCard = createComicCard(comic);
        comicsList.appendChild(comicCard);
    });
}

// Comic card ဖန်တီးမယ်
function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.innerHTML = `
        <div class="comic-cover">
            ${comic.coverImage || '📖'}
        </div>
        <div class="comic-info">
            <div class="comic-title">${comic.title}</div>
            <div class="comic-description">${comic.description}</div>
            <div class="comic-meta">
                <span>📄 ${comic.pages || 0} မျက်နှာ</span>
                <span>📅 ${comic.uploadDate || 'မသိ'}</span>
            </div>
            <button class="read-btn" onclick="readComic(${comic.id})">
                📖 ဖတ်ရန်
            </button>
        </div>
    `;
    return card;
}

// စာအုပ်ဖတ်မယ့် function
function readComic(comicId) {
    const comic = comicsData.find(c => c.id === comicId);
    if (comic) {
        if (comic.pdfUrl) {
            // Google Drive PDF ကိုဖွင့်မယ်
            window.open(comic.pdfUrl, '_blank');
        } else {
            // Local PDF viewer သုံးမယ်
            window.open(`comic-reader.html?id=${comic.id}`, '_blank');
        }
    } else {
        alert('❌ စာအုပ်မတွေ့ပါ!');
    }
}

// Statistics update
function updateStats() {
    const totalComics = comicsData.length;
    const totalPages = comicsData.reduce((sum, comic) => sum + (comic.pages || 0), 0);
    
    document.getElementById('totalComics').textContent = totalComics;
    document.getElementById('totalPages').textContent = totalPages;
}

// Global function for admin
window.addNewComic = function(newComic) {
    comicsData.push(newComic);
    saveComicsToStorage();
    displayComics();
    updateStats();
    console.log('✅ New comic added:', newComic);
};