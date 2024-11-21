import AnimeBackground from './animeBackground.js';
const API_ENDPOINTS = {
    TRENDING: 'https://api.jikan.moe/v4/top/anime',
    REVIEWS: 'https://api.jikan.moe/v4/anime'
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize anime background
    const background = new AnimeBackground();
    const background2 = new AnimeBackground();
    // const background3 = new AnimeBackground();
    background.initialize('animeBackgroundContainer');
    background2.initialize('animeBackgroundContainer2');
    // background3.initialize('animeBackgroundContainer3');
    initializeHomepage();
    new AnimeSearch();
});

async function initializeHomepage() {
    try {
        await Promise.all([
            fetchTrendingAnime(),
            fetchRecentReviews(),
            new TopRankedAnime().initialize()
        ]);
    } catch (error) {
        console.error('Error initializing homepage:', error);
    }
}

// Trending Anime Section
async function fetchTrendingAnime() {
    try {
        const response = await fetch(API_ENDPOINTS.TRENDING);
        const data = await response.json();
        displayTrendingAnime(data.data.slice(0, 4));
    } catch (error) {
        console.error('Error fetching trending anime:', error);
        displayError('trendingAnime', 'Unable to load trending anime');
    }
}

function displayTrendingAnime(animes) {
    const container = document.getElementById('trendingAnime');
    if (!container) return;

    container.innerHTML = animes.map(anime => createAnimeCard(anime)).join('');
    // 
    const cards = container.querySelectorAll('.anime-card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            window.location.href = `anime-detail.html?id=${animes[index].mal_id}`;
        });
    });
}

function createAnimeCard(anime) {
    const title = anime.title_english || anime.title;

    return `
        <div class="col">
            <div class="anime-card card h-100">
                <img src="${anime.images.jpg.image_url}" 
                     class="card-img-top" 
                     alt="${anime.title}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">
                        <small">${anime.score ? generateStarRating(anime.score/2) : 'No Ratings'}</small>
                    </p>
                    <div class="card-genres">
                            ${anime.genres.slice(0, 3).map(genre => 
                                `<span class="genre-tag">${genre.name}</span>`
                            ).join('')}
                        </div>
                </div>
            </div>
        </div>
    `;
}

// Recent Reviews Section
async function fetchRecentReviews() {
    try {
        const reviews = getDummyReviews();
        displayRecentReviews(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        displayError('recentReviews', 'Unable to load reviews');
    }
}

function displayRecentReviews(reviews) {
    const container = document.getElementById('recentReviews');
    if (!container) return;

    container.innerHTML = reviews.map(review => createReviewCard(review)).join('');
}

function createReviewCard(review) {
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${review.userAvatar}" class="review-avatar me-2" alt="${review.userName}">
                        <div>
                            <h6 class="mb-0 fw-bold">${review.userName}</h6>
                            <small class="text-muted">${review.datePosted}</small>
                        </div>
                    </div>
                    <h5 class="card-title">${review.animeName}</h5>
                    <div class="star-rating mb-2">
                        ${generateStarRating(review.rating)}
                    </div>
                    <p class="review-text mb-3">${review.review_text}</p>
                    <div class="review-actions d-flex justify-content-between align-items-center">
                        <div>
                            <button class="btn btn-sm btn-outline-purple custom-purple me-2">
                                <i class="fas fa-thumbs-up custom-purple"></i> ${review.likes}
                            </button>
                            <button class="btn btn-sm btn-outline-secondary">
                                <i class="fas fa-comment"></i> ${review.comments}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

class TopRankedAnime {
    constructor() {
        this.topAnime = [];
    }

    async initialize() {
        try {
            await this.fetchTopAnime();
            await this.displayTopAnime();
        } catch (error) {
            console.error('Error initializing top ranked anime:', error);
            displayError('pickOfDayContent', 'Unable to load top ranked anime');
        }
    }

    async fetchTopAnime() {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=10');
        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid API response format');
        }

        this.topAnime = data.data;
    }

    generateStars(score) {
        if (!score) return '★★★★★';
        const fullStars = Math.floor(score / 2);
        const hasHalfStar = score % 2 >= 1;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(score / 2);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    async displayTopAnime() {
        const container = document.getElementById('pickOfDayContent');
        if (!container) return;

        let content = '';
        
        for (let i = 0; i < this.topAnime.length; i++) {
            const anime = this.topAnime[i];
            const rank = i + 1;
            
            content += `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <div class="anime-info p-4">
                                <div class="d-flex align-items-center mb-3">
                                    <div class="d-flex align-items-center gap-3 mb-3">
                                        <h3 class="mb-0">${anime.title}</h3>
                                        </div>
                                        </div>
                                        
                                <div class="anime-stats mb-3">
                                <span><i class="fas fa-users"></i>Ranked #${anime.rank}</span>
                                    <p class="lead mb-2">
                                        <p class="lead mb-3">${this.generateStars(anime.score)} </p>
                                        
                                    </p>
                                    <p class="rec-icons">
                                        <span><i class="fas fa-tv"></i> ${anime.type || 'N/A'}</span>
                                        <span class="ms-3"><i class="fas fa-calendar"></i> ${anime.year || 'N/A'}</span>
                                        <span class="ms-3"><i class="fas fa-clock"></i> ${anime.episodes || '?'} eps</span>
                                    </p>
                                </div>
                                <p class="mb-4">${anime.synopsis ? anime.synopsis.substring(0, 150) + '...' : 'No synopsis available.'}</p>
                                <div class="genres mb-4">
                                    ${anime.genres.map(genre => 
                                        `<span class="rec-genre-tag">${genre.name}</span>`
                                    ).join('')}
                                </div>
                                <a href="anime-detail.html?id=${anime.mal_id}" class="btn btn-outline-light btn-lg">View Details</a>
                            </div>
                        </div>
                        <div class="col-md-6">
                            ${this.createTrailerOrImage(anime)}
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = content;
    }

    createTrailerOrImage(anime) {
        if (anime.trailer?.embed_url) {
            const embedUrl = anime.trailer.embed_url
                .replace('youtube.com', 'youtube-nocookie.com')
                + '?autoplay=0&rel=0&origin=' + window.location.origin;

            return `
                <div class="ratio ratio-16x9 rounded overflow-hidden shadow position-relative">
                    <iframe 
                        src="${embedUrl}"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        title="${anime.title} Trailer">
                    </iframe>
                </div>
            `;
        } else {
            return `
                <div class="ratio ratio-16x9 rounded overflow-hidden shadow position-relative">
                    <img src="${anime.images.jpg.large_image_url}" class="img-fluid" alt="${anime.title}">
                </div>
            `;
 
        }
    }
}

// Utility Functions
function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">${message}</p>
            </div>
        `;
    }
}

function getDummyReviews() {
    return [
        {
            userName: "animeFan123",
            userAvatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=animeFan123",
            animeName: "Naruto",
            rating: 5,
            review_text: "Naruto is a classic with amazing character development.",
            datePosted: "2 hours ago",
            likes: 124,
            comments: 45
        },
        {
            userName: "otakuKing",
            userAvatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=otakuKing",
            animeName: "Attack on Titan",
            rating: 4,
            review_text: "Attack on Titan is intense and has an incredible storyline.",
            datePosted: "5 hours ago",
            likes: 89,
            comments: 32
        },
        {
            userName: "mangaLover",
            userAvatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=mangaLover",
            animeName: "My Hero Academia",
            rating: 4,
            review_text: "My Hero Academia is inspirational but could have faster pacing.",
            datePosted: "1 day ago",
            likes: 256,
            comments: 67
        }
    ];
}
class AnimeSearch {
    constructor() {
        this.searchInput = document.getElementById('navSearchInput');
        this.searchResults = document.getElementById('searchResults');
        this.debounceTimeout = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Listen for input changes
        this.searchInput.addEventListener('input', () => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.handleSearch();
            }, 300); // Debounce for 300ms
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.searchResults.style.display = 'none';
            }
        });

        // Show results when focusing on input
        this.searchInput.addEventListener('focus', () => {
            if (this.searchResults.children.length > 0) {
                this.searchResults.style.display = 'block';
            }
        });
    }

    async handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        
        if (searchTerm.length === 0) {
            this.searchResults.style.display = 'none';
            return;
        }
        try {
            const results = await this.fetchAnimeResults(searchTerm);
            this.displayResults(results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    async fetchAnimeResults(searchTerm) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchTerm)}&limit=5`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.data; // Jikan API returns results in data array
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    displayResults(results) {
        this.searchResults.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResults.style.display = 'none';
            return;
        }

        results.forEach(anime => {
            const resultItem = this.createResultItem(anime);
            this.searchResults.appendChild(resultItem);
        });

        this.searchResults.style.display = 'block';
    }

    createResultItem(anime) {
        const div = document.createElement('div');
        const title = anime.title_english || anime.title;
        div.className = 'search-result-item';
        div.innerHTML = `
            <img src="${anime.images.jpg.small_image_url}" alt="${title}">
            <div class="search-result-info">
                <div class="search-result-title">${title}</div>
                <div class="search-result-year">${anime.year || 'N/A'}</div>
            </div>
        `;

        div.addEventListener('click', () => {
            window.location.href = `anime-detail.html?id=${anime.mal_id}`;
        });

        return div;
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// Scroll Indicator functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.pick-of-day .scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const reviewsSection = document.querySelector('.reviews-section');
            if (reviewsSection) {
                const headerOffset = 80; // Adjust this value based on your header height
                const elementPosition = reviewsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});


// export default generateStars;