import { generateStarRating } from './homepage.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const statusSelect = document.getElementById('statusSelect');
    const genreSelect = document.getElementById('genreSelect');
    const typeFilters = document.getElementById('typeFilters');
    const animeList = document.getElementById('animeList');
    const loadingElement = document.getElementById('loading');
    const searchHistoryContainer = document.getElementById('searchHistoryContainer');
    const searchHistoryDiv = document.getElementById('searchHistory');
    const MAX_HISTORY_ITEMS = 10;

    let currentPage = 1;
    const itemsPerPage = 24;
    let isLoading = false;
    let hasMoreData = true;
    let activeType = 'all';

    // load search history from localStorage
    function loadSearchHistory() {
        const history = JSON.parse(localStorage.getItem('animeSearchHistory')) || [];
        displaySearchHistory(history);
    }

    // save search history to localStorage
    function saveSearchHistory(searchTerm) {
        if (!searchTerm.trim()) return;
        
        let history = JSON.parse(localStorage.getItem('animeSearchHistory')) || [];
        history = history.filter(item => item !== searchTerm);
        history.unshift(searchTerm);
        history = history.slice(0, MAX_HISTORY_ITEMS);
        
        localStorage.setItem('animeSearchHistory', JSON.stringify(history));
        displaySearchHistory(history);
    }

    // search history
    function displaySearchHistory(history) {
        // Clear both the header and search items
        searchHistoryContainer.querySelector('h5')?.remove(); // Remove existing header if any
        searchHistoryDiv.innerHTML = '';
        
        const headerContainer = document.createElement('h5');
        headerContainer.innerHTML = 'Recent Searches';
        
        if (history.length > 0) {
            const clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'btn btn-danger clear-all';
            clearAllBtn.textContent = 'Clear all';
            headerContainer.appendChild(clearAllBtn);
            
            clearAllBtn.addEventListener('click', () => {
                localStorage.removeItem('animeSearchHistory');
                displaySearchHistory([]);
            });
        }
        
        
        searchHistoryContainer.insertBefore(headerContainer, searchHistoryDiv);
        
        history.forEach(term => {
            const historyItemContainer = document.createElement('div');
            historyItemContainer.className = 'history-item-container';
            
            const historyItem = document.createElement('button');
            historyItem.className = 'btn btn-sm btn-outline-secondary';
            historyItem.textContent = term;
            historyItem.addEventListener('click', () => {
                searchInput.value = term;
                performSearch();
            });
    
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = 'Remove';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteFromHistory(term);
            });
    
            historyItemContainer.appendChild(historyItem);
            historyItemContainer.appendChild(deleteBtn);
            searchHistoryDiv.appendChild(historyItemContainer);
        });
        
        searchHistoryContainer.style.display = history.length ? 'block' : 'none';
    }
    
    

    // Function to delete single item from history
    function deleteFromHistory(term) {
        let history = JSON.parse(localStorage.getItem('animeSearchHistory')) || [];
        history = history.filter(item => item !== term);
        localStorage.setItem('animeSearchHistory', JSON.stringify(history));
        displaySearchHistory(history);
    }

    async function fetchAnime(query = '', sort = 'popularity', page = 1, append = false) {
        if (!hasMoreData || isLoading) return;

        try {
            isLoading = true;
            loadingElement.style.display = 'block';

            let url = `https://api.jikan.moe/v4/anime?q=${query}&order_by=${sort}&page=${page}&limit=${itemsPerPage}`;
            if (statusSelect.value !== 'all') {
                url += `&status=${statusSelect.value}`;
            }
            if (activeType !== 'all') {
                url += `&type=${activeType}`;
            }
            if (genreSelect.value !== 'all') {
                url += `&genres=${genreSelect.value}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (!append) {
                animeList.innerHTML = '';
            }
            if (data.data.length < itemsPerPage) {
                hasMoreData = false;
            }

            displayAnime(data.data);
            
        } catch (error) {
            console.error('Error fetching anime data:', error);
        } finally {
            isLoading = false;
            loadingElement.style.display = 'none';
        }
    }

    function performSearch() {
        currentPage = 1;
        hasMoreData = true;
        if (searchInput.value.trim()) {
            saveSearchHistory(searchInput.value.trim());
        }
        fetchAnime(searchInput.value, sortSelect.value, currentPage, false);
    }

    // Event Listeners
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    // Filter change listeners
    sortSelect.addEventListener('change', performSearch);
    statusSelect.addEventListener('change', performSearch);
    genreSelect.addEventListener('change', performSearch);

    // Type filter buttons
    typeFilters.addEventListener('click', (e) => {
        if (e.target.matches('button')) {
            typeFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeType = e.target.dataset.type;
            performSearch();
        }
    });


    function displayAnime(animes) {
        animes.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.addEventListener('click', () => {
                window.location.href = `anime-detail.html?id=${anime.mal_id}`;
            });
            animeCard.classList.add('anime-card');
            
            const title = anime.title_english || anime.title;
            
            animeCard.innerHTML = `
                <div class="card">
                    <img src="${anime.images.jpg.image_url}" class="card-img-top" alt="${title}">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${anime.score ? generateStarRating(anime.score/2) : 'No Ratings'}</p>
                        <div class="card-genres">
                            ${anime.genres.slice(0, 3).map(genre => 
                                `<span class="genre-tag">${genre.name}</span>`
                            ).join('')}
                        </div>
                        <p class="card-status">${anime.status}</p>
                    </div>
                </div>
            `;
            animeList.appendChild(animeCard);
        });
    }

    // Infinite scroll 
    const sentinel = document.createElement('div');
    sentinel.id = 'sentinel';
    document.body.appendChild(sentinel);

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMoreData) {
            currentPage++;
            fetchAnime(searchInput.value, sortSelect.value, currentPage, true);
        }
    }, {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    });

    //scroll to top 
    const scrollToTopBtn = document.getElementById('scrollToTop');

    // Show/hide scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top 
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    observer.observe(sentinel);

    loadSearchHistory();
    fetchAnime(); 
});
