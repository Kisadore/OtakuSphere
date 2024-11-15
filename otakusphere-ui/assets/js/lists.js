// Get references to the DOM elements
const newButton = document.getElementById('newButton');
const animeFormModal = document.getElementById('animeFormModal');
const closeFormButton = document.getElementById('closeFormButton');
const animeForm = document.getElementById('animeForm');
const starIcons = document.querySelectorAll('#starRating i');
const likeBox = document.getElementById('likeBox');
const dateWatched = document.getElementById('animeDate');
let rating = 0;

// ----------------------------- Helper Functions -----------------------------

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
    const description = document.getElementById('animeDescription').value;
    const dateAdded = document.getElementById('animeDate').value;

    // Log the form data
    console.log({
        title,
        description,
        dateAdded,
        rating,
        liked: likeBox.querySelector('i').classList.contains('fa-heart')
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
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('d-none'));

    // Show the selected content section
    document.getElementById(section + 'Content').classList.remove('d-none');

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
