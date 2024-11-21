// Get references to the DOM elements
const animeFormModal = document.getElementById('animeFormModal');
const closeFormButton = document.getElementById('closeFormButton');
const animeForm = document.getElementById('animeForm');
const starIcons = document.querySelectorAll('#starRating i');
const likeBox = document.getElementById('likeBox');
const animeTitleInput = document.getElementById('animeTitle');
const suggestionsList = document.getElementById('suggestions');
let rating = 0;
let currentSection = 'archive'; // Default section

// ----------------------------- Helper Functions -----------------------------

// Function to fetch suggestions from Jikan API
function fetchAnimeSuggestions(query) {
    fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5`)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                displaySuggestions(data.data);
            } else {
                clearSuggestions();
            }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
            clearSuggestions();
        });
}

// Function to display suggestions in the dropdown
function displaySuggestions(animeList) {
    clearSuggestions();
    animeList.forEach(anime => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-action';
        listItem.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="img-thumbnail me-2" style="width: 50px;">
            ${anime.title} <small class="text-muted">(${anime.type || 'N/A'}, Score: ${anime.score || 'N/A'})</small>
        `;
        listItem.addEventListener('click', () => {
            selectAnime(anime);
        });
        suggestionsList.appendChild(listItem);
    });
    suggestionsList.classList.remove('d-none');
}

// Function to clear suggestions
function clearSuggestions() {
    suggestionsList.innerHTML = '';
    suggestionsList.classList.add('d-none');
}

// Function to handle anime selection
function selectAnime(anime) {
    animeTitleInput.value = anime.title;
    document.getElementById('animeDescription').value = anime.synopsis || 'No description available.';
    clearSuggestions();
}

// Function to create and display an anime card in the correct section
function createAnimeCard(anime) {
    const containerId = currentSection === 'archive' ? 'archiveContainer' : 'watchlistContainer';
    const cardContainer = document.getElementById(containerId);

    const cardHTML = `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${anime.images.jpg.image_url}" class="img-fluid rounded-start" alt="${anime.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${anime.title}</h5>
                        <p class="card-text">${anime.synopsis || 'No synopsis available.'}</p>
                        <p class="card-text"><small class="text-muted">Score: ${anime.score || 'N/A'}</small></p>
                    </div>
                </div>
            </div>
        </div>
    `;
    cardContainer.innerHTML += cardHTML;
}

// Function to update the stars
function updateStars() {
    starIcons.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();

    const title = document.getElementById('animeTitle').value;

    fetch(`https://api.jikan.moe/v4/anime?q=${title}&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                const anime = data.data[0];
                createAnimeCard(anime);
            } else {
                alert('No anime found with that title. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching anime:', error);
            alert('Failed to fetch anime details. Please try again later.');
        });

    animeForm.reset();
    resetForm();
    animeFormModal.classList.add('d-none');
}

// Function to reset the form
function resetForm() {
    starIcons.forEach(star => star.classList.remove('filled'));
    const heartIcon = likeBox.querySelector('i');
    heartIcon.classList.remove('fa-heart');
    heartIcon.classList.add('fa-heart-o');
    rating = 0;
}

// ----------------------------- Event Listeners -----------------------------

// Event listener for input field
animeTitleInput.addEventListener('input', () => {
    const query = animeTitleInput.value.trim();
    if (query.length > 2) {
        fetchAnimeSuggestions(query);
    } else {
        clearSuggestions();
    }
});

// Close suggestions if clicked outside
document.addEventListener('click', (e) => {
    if (!animeTitleInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        clearSuggestions();
    }
});

// Event listener for the "ADD" button to open the form
document.querySelectorAll('.btn-success').forEach(button => {
    button.addEventListener('click', (e) => {
        const section = e.target.textContent.includes('WATCHLIST') ? 'watchlist' : 'archive';
        currentSection = section;
        animeFormModal.classList.remove('d-none');
    });
});

// Event listener for the "Cancel" button to close the form
closeFormButton.addEventListener('click', () => {
    animeFormModal.classList.add('d-none');
});

// Like Box functionality
likeBox.addEventListener('click', () => {
    const heartIcon = likeBox.querySelector('i');
    heartIcon.classList.toggle('fa-heart-o');
    heartIcon.classList.toggle('fa-heart');
});

// Star rating functionality
starIcons.forEach((star, index) => {
    star.addEventListener('click', () => {
        rating = index + 1;
        updateStars();
    });
});

// Form submission handling
animeForm.addEventListener('submit', handleFormSubmission);

// ----------------------------- Initialization -----------------------------

function showContent(section) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.querySelector(`[onclick="showContent('${section}')"]`).classList.add('active');
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('d-none'));
    document.getElementById(section + 'Content').classList.remove('d-none');
    localStorage.setItem('selectedSection', section);
}

window.onload = function () {
    const selectedSection = localStorage.getItem('selectedSection') || 'archive';
    showContent(selectedSection);
};
