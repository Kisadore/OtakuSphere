import { generateStarRating } from './homepage.js';
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        alert("Anime ID not found in the URL!");
        return;
    }

    const apiUrl = `https://api.jikan.moe/v4/anime/${animeId}/reviews?page=1`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                displayReviews(data.data.slice(0, 10));
            } else {
                console.log("No reviews found.");
            }
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
        });

    function displayReviews(reviews) {
        const reviewsContainer = document.getElementById("reviews");
        
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = "<p>No reviews found.</p>";
            return;
        }
        
        reviews.forEach(review => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review-card");
        
            const username = review.user.username; // Fetching username
            const userImageUrl = review.user.images.jpg.image_url; // Fetching the user profile image URL
            let content = review.review;
            const charLimit = 300;
            const truncatedContent = content.length > charLimit ? content.substring(0, charLimit) + '...' : content;
        
            reviewElement.innerHTML = `
            <div class="review-header">
                <img src="${userImageUrl}" alt="${username}'s profile picture" class="user-profile-image"> <!-- Profile image -->
                <div class="user-info">
                    <h4>${username}</h4>
                    <div class="stars">${generateStarRating(review.score / 2)}</div>
                </div>
            </div>
            <p class="review-content truncated">${truncatedContent}</p>
            ${content.length > charLimit ? `
                <p class="review-content full" style="display: none;">${content}</p>
                <button class="read-more-btn">
                    <i class="fas fa-chevron-down"></i> Read More
                </button>
                <button class="show-less-btn" style="display: none;">
                    <i class="fas fa-chevron-up"></i> Show Less
                </button>
            ` : ''}
        `;
        
        
            reviewsContainer.appendChild(reviewElement);
        
            const truncatedReview = reviewElement.querySelector('.review-content.truncated');
            const fullReview = reviewElement.querySelector('.review-content.full');
            const readMoreBtn = reviewElement.querySelector('.read-more-btn');
            const showLessBtn = reviewElement.querySelector('.show-less-btn');
        
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', function () {
                    truncatedReview.style.display = 'none';
                    fullReview.style.display = 'block';
                    readMoreBtn.style.display = 'none';
                    showLessBtn.style.display = 'inline';
                });
            }
        
            if (showLessBtn) {
                showLessBtn.addEventListener('click', function () {
                    truncatedReview.style.display = 'block';
                    fullReview.style.display = 'none';
                    readMoreBtn.style.display = 'inline';
                    showLessBtn.style.display = 'none';
                });
            }
        });
    }        
});

