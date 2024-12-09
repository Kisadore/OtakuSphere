// may need to update once backend is complete
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authSection = document.querySelector('#app');
    
    if (user) {
        // logged in
        authSection.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-link text-light dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://api.dicebear.com/6.x/adventurer/svg?seed=${user.username}" class="rounded-circle me-2" width="32" height="32" alt="Profile Avatar">
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">Sign Out</a></li>
                </ul>
            </div>
        `;
                // <li><a class="dropdown-item" href="settings.html">Settings</a></li>
    }
     else {
        // not logged in
        authSection.innerHTML = `
            <button onclick="window.location.href='login.html'" class="btn btn-outline-light me-2 custom-signin-btn">Sign In</button>
            <button onclick="window.location.href='register.html'" class="btn btn-primary custom-signup-btn">Sign Up</button>
            `;
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', updateAuthUI);
