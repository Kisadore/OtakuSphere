document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userData = {
        username: user.username,
        email: user.email,
        stats: {
            watchlist: 0,  // We can update this later
            reviews: 0     // We can update this later
        }
    };

    displayUserProfile(userData);
});

function displayUserProfile(userData) {
    // Generate avatar using username for consistency
    const avatarUrl = `https://api.dicebear.com/6.x/adventurer/svg?seed=${userData.username}`;
    
    document.querySelector('.profile-avatar').src = avatarUrl;
    document.querySelector('.profile-username').textContent = userData.username;
    document.querySelector('.profile-email').textContent = userData.email;
}
