document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userData = {
        username: user.username,
        email: user.email,
        avatar: user.avatar || `https://api.dicebear.com/6.x/adventurer/svg?seed=${user.username}`, // Default avatar
        stats: {
            watchlist: 0,
            reviews: 0
        }
    };

    displayUserProfile(userData);
    setupAvatarSelection();
});

function displayUserProfile(userData) {
    document.querySelector('.profile-avatar').src = userData.avatar;
    document.querySelector('.profile-username').textContent = userData.username;
    document.querySelector('.profile-email').textContent = userData.email;
}

function setupAvatarSelection() {
    const avatarButton = document.createElement('button');
    avatarButton.className = 'btn btn-outline-purple mt-2';
    avatarButton.innerHTML = '<i class="fas fa-image"></i> Change Avatar';
    avatarButton.onclick = showAvatarModal;

    document.querySelector('.profile-actions').appendChild(avatarButton);
}

function showAvatarModal() {
    const modal = document.createElement('div');
    modal.className = 'avatar-modal';
    modal.innerHTML = `
        <div class="avatar-modal-content">
            <h3>Choose Your Avatar</h3>
            <div class="avatar-options">
                <div class="avatar-tab-buttons">
                    <button class="active" data-tab="anime">Anime Characters</button>
                    <button data-tab="generated">Generated Avatar</button>
                </div>
                <div class="avatar-tab-content">
                    <div id="animeAvatars" class="avatar-grid">
                        <!-- Add popular anime character avatars here -->
                    </div>
                    <div id="generatedAvatars" class="avatar-grid" style="display: none;">
                        <div class="generator-controls">
                            <button onclick="regenerateAvatar()">Generate New</button>
                        </div>
                        <div id="generatedPreview"></div>
                    </div>
                </div>
            </div>
            <div class="avatar-modal-actions">
                <button onclick="closeAvatarModal()" class="btn btn-secondary">Cancel</button>
                <button onclick="saveAvatar()" class="btn btn-primary">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    loadAnimeAvatars();
    setupTabButtons();
}

function loadAnimeAvatars() {
    const popularCharacters = [
        {
            name: 'Yor',
            subtitle: 'Spy x Family',
            image: 'https://cdn.myanimelist.net/images/characters/10/470899.jpg'
        },
        {
            name: 'Zero Two',
            subtitle: 'Darling in the Franxx',
            image: 'https://cdn.myanimelist.net/images/characters/12/348873.jpg'
        },
        {
            name: 'Marin',
            subtitle: 'My Dress-Up Darling',
            image: 'https://cdn.myanimelist.net/images/characters/5/386222.jpg'
        },
        {
            name: 'Mikasa',
            subtitle: 'Attack on Titan',
            image: 'https://cdn.myanimelist.net/images/characters/9/215563.jpg'
        },
        {
            name: 'Ochaco',
            subtitle: 'My Hero Academia',
            image: 'https://cdn.myanimelist.net/images/characters/13/306621.jpg'
        },
        {
            name: 'Nezuko',
            subtitle: 'Demon Slayer',
            image: 'https://cdn.myanimelist.net/images/characters/2/378254.jpg'
        },
        {
            name: 'Tanjiro',
            subtitle: 'Demon Slayer',
            image: 'https://cdn.myanimelist.net/images/characters/5/384728.jpg'
        },
        {
            name: 'Gojo',
            subtitle: 'Jujutsu Kaisen',
            image: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg'
        },
        {
            name: 'Denji',
            subtitle: 'Chainsaw Man',
            image: 'https://cdn.myanimelist.net/images/characters/3/492407.jpg'
        },
        {
            name: 'Levi',
            subtitle: 'Attack on Titan',
            image: 'https://cdn.myanimelist.net/images/characters/2/241413.jpg'
        },
        {
            name: 'Naruto',
            subtitle: 'Naruto',
            image: 'https://cdn.myanimelist.net/images/characters/9/131317.jpg'
        },
        {
            name: 'Luffy',
            subtitle: 'One Piece',
            image: 'https://cdn.myanimelist.net/images/characters/9/310307.jpg'
        },
        {
            name: 'Eren',
            subtitle: 'Attack on Titan',
            image: 'https://cdn.myanimelist.net/images/characters/10/216895.jpg'
        },
        {
            name: 'Sukuna',
            subtitle: 'Jujutsu Kaisen',
            image: 'https://cdn.myanimelist.net/images/characters/12/528772.jpg'
        },
        {
            name: 'Zoro',
            subtitle: 'One Piece',
            image: 'https://cdn.myanimelist.net/images/characters/3/100534.jpg'
        },
        {
            name: 'Megumin',
            subtitle: 'KonoSuba',
            image: 'https://cdn.myanimelist.net/images/characters/14/349249.jpg'
        },
        {
            name: 'Killua',
            subtitle: 'Hunter x Hunter',
            image: 'https://cdn.myanimelist.net/images/characters/2/327920.jpg'
        },
        {
            name: 'Yuji',
            subtitle: 'Jujutsu Kaisen',
            image: 'https://cdn.myanimelist.net/images/characters/6/467646.jpg'
        },
        {
            name: 'Megumi',
            subtitle: 'Jujutsu Kaisen',
            image: 'https://cdn.myanimelist.net/images/characters/13/521627.jpg'
        },
        {
            name: 'Chika',
            subtitle: 'Kaguya-sama',
            image: 'https://cdn.myanimelist.net/images/characters/2/371542.jpg'
        },
        {
            name: 'Kaguya',
            subtitle: 'Kaguya-sama',
            image: 'https://cdn.myanimelist.net/images/characters/5/504013.jpg'
        },
        {
            name: 'Rengoku',
            subtitle: 'Demon Slayer',
            image: 'https://cdn.myanimelist.net/images/characters/11/487265.jpg'
        }
    ];


    const animeAvatars = document.getElementById('animeAvatars');
    
    popularCharacters.forEach(character => {
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'avatar-option';
        
        avatarContainer.innerHTML = `
            <img src="${character.image}" 
                 alt="${character.name}" 
                 class="avatar-preview"
                 loading="lazy">
            <span class="avatar-name">${character.name}</span>
        `;
        
        avatarContainer.onclick = () => selectAvatar(character.image);
        animeAvatars.appendChild(avatarContainer);
    });
}



function setupTabButtons() {
    const tabButtons = document.querySelectorAll('.avatar-tab-buttons button');
    tabButtons.forEach(button => {
        button.onclick = () => switchTab(button.dataset.tab);
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.avatar-tab-buttons button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    const animeTab = document.getElementById('animeAvatars');
    const generatedTab = document.getElementById('generatedAvatars');

    if (tabName === 'anime') {
        animeTab.style.display = 'grid';
        generatedTab.style.display = 'none';
    } else {
        animeTab.style.display = 'none';
        generatedTab.style.display = 'grid';
        generateNewAvatar();
    }
}

function regenerateAvatar() {
    generateNewAvatar();
}

function generateNewAvatar() {
    const styles = ['adventurer', 'avataaars', 'bottts', 'pixel-art'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const preview = document.getElementById('generatedPreview');
    const avatarUrl = `https://api.dicebear.com/6.x/${randomStyle}/svg?seed=${Math.random()}`;
    
    preview.innerHTML = `<img src="${avatarUrl}" class="generated-avatar">`;
    preview.dataset.currentAvatar = avatarUrl;
}

function selectAvatar(avatarUrl) {
    document.querySelectorAll('.avatar-grid img').forEach(img => {
        img.classList.remove('selected');
    });
    event.target.classList.add('selected');
    document.querySelector('.profile-avatar').src = avatarUrl;
}

function closeAvatarModal() {
    document.querySelector('.avatar-modal').remove();
}

async function saveAvatar() {
    const selectedAvatar = document.querySelector('.avatar-grid img.selected');
    const generatedAvatar = document.querySelector('#generatedPreview img');
    let avatarUrl;

    if (document.querySelector('[data-tab="generated"]').classList.contains('active')) {
        avatarUrl = generatedAvatar.src;
    } else {
        avatarUrl = selectedAvatar ? selectedAvatar.src : document.querySelector('.profile-avatar').src;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
        // Make API call to update avatar in backend
        const response = await fetch('http://localhost:8080/updateAvatar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.user_id,
                avatar_url: avatarUrl
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update avatar');
        }

        // Update local storage after backend update
        user.avatar = avatarUrl;
        localStorage.setItem('user', JSON.stringify(user));

        // Update UI
        document.querySelector('.profile-avatar').src = avatarUrl;
        const headerAvatar = document.querySelector('#userDropdown img');
        if (headerAvatar) {
            headerAvatar.src = avatarUrl;
        }
        updateAuthUI();
        closeAvatarModal();

    } catch (error) {
        console.error('Error updating avatar:', error);
        alert('Failed to update avatar. Please try again.');
    }
}
