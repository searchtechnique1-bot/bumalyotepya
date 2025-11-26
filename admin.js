// Admin JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentComics();
    setupForm();
});

// လက်ရှိစာအုပ်တွေပြမယ်
function loadCurrentComics() {
    const savedComics = localStorage.getItem('bumalYotePyaComics');
    const comicsList = document.getElementById('currentComics');
    
    if (!savedComics) {
        comicsList.innerHTML = '<p>မည်သည့်စာအုပ်မှ မတွေ့ရှိသေးပါ</p>';
        return;
    }
    
    const comics = JSON.parse(savedComics);
    
    if (comics.length === 0) {
        comicsList.innerHTML = '<p>မည်သည့်စာအုပ်မှ မတွေ့ရှိသေးပါ</p>';
        return;
    }
    
    let html = '';
    comics.forEach(comic => {
        html += `
            <div class="comic-item">
                <strong>${comic.coverImage || '📖'} ${comic.title}</strong>
                <button class="delete-btn" onclick="deleteComic(${comic.id})">🗑️ ဖျက်ရန်</button>
                <br>
                <small>${comic.description || 'အကြောင်းအရာမရှိပါ'}</small>
                <br>
                <small>📄 ${comic.pages || 0} မျက်နှာ • 📅 ${comic.uploadDate || 'မသိ'}</small>
                <br>
                <small style="color: #667eea;">🔗 ${comic.pdfUrl ? 'PDF Link ပါရှိပါသည်' : 'PDF Link မရှိပါ'}</small>
            </div>
        `;
    });
    
    comicsList.innerHTML = html;
}

// စာအုပ်ဖျက်မယ့် function
function deleteComic(comicId) {
    if (confirm('ဒီစာအုပ်ကို ဖျက်မှာသေချာပါသလား?')) {
        const savedComics = localStorage.getItem('bumalYotePyaComics');
        if (savedComics) {
            let comics = JSON.parse(savedComics);
            comics = comics.filter(comic => comic.id !== comicId);
            localStorage.setItem('bumalYotePyaComics', JSON.stringify(comics));
            
            loadCurrentComics();
            alert('✅ စာအုပ်ဖျက်ပြီးပါပြီ!');
            
            // Main website ကိုလည်း update လုပ်ခိုင်းမယ်
            if (window.opener) {
                window.opener.location.reload();
            }
        }
    }
}

// Form setup
function setupForm() {
    const form = document.getElementById('uploadForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('comicTitle').value;
        const description = document.getElementById('comicDescription').value;
        const pdfUrl = document.getElementById('pdfUrl').value;
        const pageCount = parseInt(document.getElementById('pageCount').value) || 1;
        const coverEmoji = document.getElementById('coverEmoji').value || '📖';
        
        if (!title || !pdfUrl) {
            alert('❌ စာအုပ်ခေါင်းစဉ်နဲ့ PDF Link ထည့်ပေးပါ!');
            return;
        }

        // Google Drive link format check
        if (!pdfUrl.includes('drive.google.com')) {
            alert('❌ ကျေးဇူးပြု၍ Google Drive link သာထည့်ပါ!');
            return;
        }

        // Create new comic
        const newComic = {
            id: Date.now(),
            title: title,
            description: description,
            coverImage: coverEmoji,
            pdfUrl: pdfUrl,
            pages: pageCount,
            uploadDate: new Date().toLocaleDateString('my-MM')
        };

        // Save to localStorage
        const savedComics = localStorage.getItem('bumalYotePyaComics');
        let comics = savedComics ? JSON.parse(savedComics) : [];
        comics.push(newComic);
        localStorage.setItem('bumalYotePyaComics', JSON.stringify(comics));

        // Show success
        successMessage.style.display = 'block';
        successMessage.innerHTML = `
            🎉 <strong>"${title}"</strong> စာအုပ်အောင်မြင်စွာတင်ပြီးပါပြီ!<br>
            <small>စာမျက်နှာ ${pageCount} မျက်နှာ • Main Website သို့သွားကြည့်ပါ</small>
        `;

        // Update list
        loadCurrentComics();

        // Reset form
        form.reset();
        document.getElementById('coverEmoji').value = '📖';

        // Hide message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        console.log('✅ New comic added:', newComic);
        
        // Update main website
        if (window.opener) {
            window.opener.location.reload();
        }
    });
}

// Global function
window.deleteComic = deleteComic;