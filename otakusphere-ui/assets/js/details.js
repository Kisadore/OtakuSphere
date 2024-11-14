// anime-detail.js
document.addEventListener('DOMContentLoaded', () => {
    // Get anime ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    // Initialize review system
    let currentUserRating = 0;
    initializeRatingSystem();

    // Fetch and display anime details
    fetchAnimeDetails(animeId);

    async function fetchAnimeDetails(id) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
            const data = await response.json();
            const anime = data.data;

            // Set background image
            document.getElementById('animeHeader').style.backgroundImage = `url(${anime.images.jpg.large_image_url})`;
            
            // Set basic information
            document.getElementById('animeImage').src = anime.images.jpg.large_image_url;
            document.getElementById('animeImage').alt = anime.title;
            document.getElementById('animeTitle').textContent = anime.title_english || anime.title;
            document.getElementById('animeSynopsis').textContent = anime.synopsis;
            
            // Set rating
            const rating = anime.score || 0;
            document.getElementById('ratingValue').textContent = `${rating} / 10`;
            document.getElementById('averageRating').innerHTML = generateStarRating(rating / 2);
            
            // Set genres
            document.getElementById('animeGenres').innerHTML = anime.genres
                .map(genre => `<span class="badge bg-secondary me-2">${genre.name}</span>`)
                .join('');
            
            // Set status
            document.getElementById('animeStatus').innerHTML = `
                <span class="badge ${getStatusBadgeClass(anime.status)}">${anime.status}</span>
            `;
            
            // Set information panel
            document.getElementById('animeType').textContent = anime.type;
            document.getElementById('episodeCount').textContent = anime.episodes || 'Unknown';
            document.getElementById('animeDuration').textContent = anime.duration;
            document.getElementById('airedDate').textContent = `${anime.aired.string}`;
            document.getElementById('animeStudios').textContent = anime.studios.map(studio => studio.name).join(', ');
            document.getElementById('animeScore').textContent = anime.score || 'N/A';
            document.getElementById('animeRank').textContent = anime.rank ? `#${anime.rank}` : 'N/A';
            document.getElementById('animePopularity').textContent = anime.popularity ? `#${anime.popularity}` : 'N/A';
            
            // Set trailer if available
            if (anime.trailer && anime.trailer.youtube_id) {
                document.getElementById('trailerContainer').innerHTML = `
                    <iframe
                        src="https://www.youtube.com/embed/${anime.trailer.youtube_id}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                `;
            } else {
                document.getElementById('trailerContainer').innerHTML = '<p>No trailer available</p>';
            }

            // Load reviews from localStorage or initialize empty array
            loadReviews(id);

        } catch (error) {
            console.error('Error fetching anime details:', error);
        }
    }

    function initializeRatingSystem() {
        const stars = document.querySelectorAll('.rating-input .fas');
        const ratingInput = document.getElementById('ratingInput');

        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                highlightStars(rating);
            });

            star.addEventListener('mouseout', function() {
                highlightStars(currentUserRating);
            });

            star.addEventListener('click', function() {
                currentUserRating = this.dataset.rating;
                ratingInput.value = currentUserRating;
                highlightStars(currentUserRating);
            });
        });
    }

    function highlightStars(rating) {
        const stars = document.querySelectorAll('.rating-input .fas');
        stars.forEach(star => {
            const starRating = star.dataset.rating;
            star.style.color = starRating <= rating ? 'gold' : 'gray';
        });
    }

    // Handle review submission
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const review = {
            animeId: animeId,
            rating: document.getElementById('ratingInput').value,
            text: document.getElementById('reviewText').value,
            date: new Date().toISOString(),
            // In a real app, you'd get this from your auth system
            username: 'User' + Math.floor(Math.random() * 1000)
        };

        saveReview(review);
        loadReviews(animeId);
        
        // Reset form
        this.reset();
        currentUserRating = 0;
        highlightStars(0);
    });

    function saveReview(review) {
        const reviews = JSON.parse(localStorage.getItem(`animeReviews_${review.animeId}`) || '[]');
        reviews.push(review);
        localStorage.setItem(`animeReviews_${review.animeId}`, JSON.stringify(reviews));
    }

    function loadReviews(animeId) {
        const reviews = JSON.parse(localStorage.getItem(`animeReviews_${animeId}`) || '[]');
        const reviewsList = document.getElementById('reviewsList');
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
            return;
        }

        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${review.username}</strong>
                    <div class="rating-stars">${generateStarRating(review.rating)}</div>
                </div>
                <p>${review.text}</p>
                <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
            </div>
        `).join('');
    }

    function generateStarRating(rating) {
        return Array(5).fill().map((_, index) => {
            const starClass = index < Math.round(rating) ? 'fas' : 'far';
            return `<i class="${starClass} fa-star"></i>`;
        }).join('');
    }

    function getStatusBadgeClass(status) {
        const statusMap = {
            'Airing': 'bg-success',
            'Completed': 'bg-primary',
            'Upcoming': 'bg-warning',
            'Not yet aired': 'bg-warning'
        };
        return statusMap[status] || 'bg-secondary';
    }
});