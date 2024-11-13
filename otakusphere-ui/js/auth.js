// may need to update once backend is complete
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const authSection = document.querySelector('#app');
    
    if (token) {
        // logged in
        authSection.innerHTML = `
            <div class="dropdown">
            <button class="btn btn-link text-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-user-circle fa-lg"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                <li><a class="dropdown-item" href="settings.html">Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" onclick="logout()">Sign Out</a></li>
            </ul>
        </div>
    `;
    } else {
        // not logged in
        authSection.innerHTML = `
            <button onclick="window.location.href='login.html'" class="btn btn-outline-light me-2 custom-signin-btn">Sign In</button>
            <button onclick="window.location.href='register.html'" class="btn btn-primary custom-signup-btn">Sign Up</button>
            `;
            // UNCOMMENT AND COMMENT OUT ABOVE CODE TO SEE DROPDOWN MENU
            
    //         <div class="dropdown">
    //         <button class="btn btn-link text-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
    //             <i class="fas fa-user-circle fa-lg"></i>
    //         </button>
    //         <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
    //             <li><a class="dropdown-item" href="profile.html">Profile</a></li>
    //             <li><a class="dropdown-item" href="settings.html">Settings</a></li>
    //             <li><hr class="dropdown-divider"></li>
    //             <li><a class="dropdown-item" href="#" onclick="logout()">Sign Out</a></li>
    //         </ul>
    //     </div>
    // `;
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', updateAuthUI);
