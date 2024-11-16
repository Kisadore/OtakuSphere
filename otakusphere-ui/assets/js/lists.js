// Get references to the DOM elements
const newButton = document.getElementById('newButton');
const animeFormModal = document.getElementById('animeFormModal');
const closeFormButton = document.getElementById('closeFormButton');
const animeForm = document.getElementById('animeForm');
const starIcons = document.querySelectorAll('#starRating i');
const likeBox = document.getElementById('likeBox');
const dateWatched = document.getElementById('animeDate');
let rating = 0;
const animeTitleInput = document.getElementById('animeTitle');
const suggestionsList = document.getElementById('suggestions');

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
    clearSuggestions(); // Clear any previous suggestions
    animeList.forEach(anime => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item list-group-item-action';
        listItem.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="img-thumbnail me-2" style="width: 50px;">
            ${anime.title} <small class="text-muted">(${anime.type || 'N/A'}, Score: ${anime.score || 'N/A'})</small>
        `;
        listItem.addEventListener('click', () => {
            selectAnime(anime); // Handle selection
        });
        suggestionsList.appendChild(listItem);
    });
    suggestionsList.classList.remove('d-none'); // Show the suggestions dropdown
}

// Function to clear suggestions
function clearSuggestions() {
    suggestionsList.innerHTML = '';
    suggestionsList.classList.add('d-none');
}

// Function to handle anime selection
function selectAnime(anime) {
    // Populate the form with selected anime details
    animeTitleInput.value = anime.title;
    document.getElementById('animeDescription').value = anime.synopsis || 'No description available.';
    clearSuggestions(); // Hide the suggestions
}

// Function to create and display an anime card
function createAnimeCard(anime) {
    const cardContainer = document.getElementById('animeCardContainer'); // Ensure this container exists in your HTML

    // Create the card HTML
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

    // Append the card to the container
    cardContainer.innerHTML += cardHTML;
}

function updateStars() {
    starIcons.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');  // Add gold color
        } else {
            star.classList.remove('filled'); // Remove gold color
        }
    });
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const title = document.getElementById('animeTitle').value;

    // Fetch anime data from Jikan API
    fetch(`https://api.jikan.moe/v4/anime?q=${title}&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                const anime = data.data[0]; // Take the first match
                createAnimeCard(anime);    // Display the anime card
            } else {
                alert('No anime found with that title. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching anime:', error);
            alert('Failed to fetch anime details. Please try again later.');
        });

    // Clear form after submission
    animeForm.reset();
    resetForm(); // Reset the stars and like box

    // Close the form
    animeFormModal.classList.add('d-none');
}

// Reset form fields (stars and like box)
function resetForm() {
    // Reset stars to unfilled state
    starIcons.forEach(star => {
        star.classList.remove('filled'); // Remove gold color
    });
    
    // Reset like box to unliked state
    const heartIcon = likeBox.querySelector('i');
    heartIcon.classList.remove('bi-heart-fill'); // Remove filled heart class
    heartIcon.classList.add('bi-heart');        // Add unfilled heart class
    
    // Reset rating to 0
    rating = 0;
}


// ----------------------------- Event Listeners -----------------------------

// Event listener for input field
animeTitleInput.addEventListener('input', () => {
    const query = animeTitleInput.value.trim();
    if (query.length > 2) { // Fetch suggestions if query is at least 3 characters
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

// Event listener for the "NEW" button to open the form
newButton.addEventListener('click', () => {
    animeFormModal.classList.remove('d-none'); // Show the form
});

// Event listener for the "Cancel" button to close the form
closeFormButton.addEventListener('click', () => {
    animeFormModal.classList.add('d-none'); // Hide the form
});


// Like Box functionality (heart icon)
likeBox.addEventListener('click', () => {
    const heartIcon = likeBox.querySelector('i');
    if (heartIcon.classList.contains('fa-heart-o')) {
        heartIcon.classList.remove('fa-heart-o');
        heartIcon.classList.add('fa-heart'); // Filled heart when liked
    } else {
        heartIcon.classList.remove('fa-heart');
        heartIcon.classList.add('fa-heart-o'); // Empty heart when unliked
    }
});

starIcons.forEach((star, index) => {
    star.addEventListener('click', () => {
        rating = index + 1; // Update rating based on clicked star
        updateStars();      // Update the star display
    });
});

// Form submission handling
animeForm.addEventListener('submit', handleFormSubmission);

// ----------------------------- Initialization -----------------------------

// Function to show the selected content and hide others
function showContent(section) {
    // Remove 'active' from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add 'active' to the clicked nav link
    const activeLink = document.querySelector(`[onclick="showContent('${section}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('d-none'));

    // Show the selected content section
    const selectedSection = document.getElementById(section + 'Content');
    if (selectedSection) {
        selectedSection.classList.remove('d-none');
    }

    // Store the selected section in localStorage
    localStorage.setItem('selectedSection', section);
}


// Check if there's a selected section in localStorage and show it
window.onload = function () {
    const selectedSection = localStorage.getItem('selectedSection');

    if (selectedSection) {
        // Show the previously selected section
        showContent(selectedSection);
    } else {
        // Default to showing the "likes" section if nothing is stored
        showContent('likes');
    }
};
