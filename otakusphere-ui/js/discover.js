document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const statusSelect = document.getElementById('statusSelect');
    const genreSelect = document.getElementById('genreSelect');
    const typeFilters = document.getElementById('typeFilters');
    const animeList = document.getElementById('animeList');
    const loadingElement = document.getElementById('loading');

    let currentPage = 1;
    const itemsPerPage = 24;
    let isLoading = false;
    let hasMoreData = true;
    let activeType = 'all';

    async function fetchAnime(query = '', sort = 'popularity', page = 1, append = true) {
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
                        <p class="card-text">Rating: ${anime.score || 'N/A'}</p>
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

    typeFilters.addEventListener('click', (e) => {
        if (e.target.matches('button')) {
            typeFilters.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            activeType = e.target.dataset.type;
            resetAndFetch();
        }
    });


    function resetAndFetch() {
        currentPage = 1;
        hasMoreData = true;
        fetchAnime(searchInput.value, sortSelect.value, currentPage, false);
    }

    // for infinite scroll
    const sentinel = document.createElement('div');
    sentinel.id = 'sentinel';
    sentinel.style.height = '20px';
    sentinel.style.marginTop = '20px';
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

    observer.observe(sentinel);

    // listeners for filters
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(resetAndFetch, 300);
    });

    sortSelect.addEventListener('change', resetAndFetch);
    statusSelect.addEventListener('change', resetAndFetch);
    genreSelect.addEventListener('change', resetAndFetch);

    fetchAnime();

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
});