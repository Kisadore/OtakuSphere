import { generateStarRating } from './homepage.js';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    if (!animeId) {
        alert("Anime ID not found in the URL!");
        return;
    }

    const animeTitle = document.getElementById('anime-title');
    const animeSynopsis = document.getElementById('anime-synopsis');
    const animeImage = document.getElementById('anime-image');
    const animeRating = document.getElementById('anime-rating');
    const animeStars = document.getElementById('anime-stars');
    const animeTrailer = document.getElementById('anime-trailer');
    const animeYear = document.getElementById('anime-year');
    const animeGenres = document.getElementById('genres-list');
    const favoritesCount = document.getElementById('favorites-count');
    const studiosList = document.getElementById('studios-list');
    const producersList = document.getElementById('producers-list');
    const themesList = document.getElementById('themes-list');
    const soundtrackList = document.getElementById('soundtrack-list'); // New element for soundtracks

    const apiUrl = `https://api.jikan.moe/v4/anime/${animeId}/full`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                const anime = data.data;
                const airingYear = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'Unknown';
                const genres = anime.genres.map(genre => genre.name).join(', ');
                const studios = anime.studios.map(studio => studio.name).join(', ');
                const producers = anime.producers.map(producer => producer.name).join(', ');
                const themes = anime.themes.map(theme => theme.name).join(', ');
                
                animeTitle.textContent = anime.title;
                animeSynopsis.textContent = anime.synopsis;
                animeImage.src = anime.images.jpg.large_image_url;
                animeRating.textContent = `Average Rating: ${anime.score || "No rating available"}`;
                animeStars.innerHTML = `${anime.score ? generateStarRating(anime.score / 2) : 'No Ratings'}`;
                animeYear.textContent = `Aired: ${airingYear}`;
                animeGenres.innerHTML = genres.split(', ').map(genre => `<li>${genre}</li>`).join('');
                studiosList.innerHTML = studios.split(', ').map(studio => `<li>${studio}</li>`).join('');
                producersList.innerHTML = producers.split(', ').map(producer => `<li>${producer}</li>`).join('');
                themesList.innerHTML = themes.split(', ').map(theme => `<li>${theme}</li>`).join('');
                favoritesCount.textContent = `${anime.favorites || 0}`;

                // Populate soundtrack list (openings and endings)
                if (anime.theme && (anime.theme.openings || anime.theme.endings)) {
                    const openings = anime.theme.openings || []; // Array of opening songs
                    const endings = anime.theme.endings || [];   // Array of ending songs
                
                    // Create sections for openings and endings
                    let output = '';
                
                    if (openings.length > 0) {
                        output += '<h6>Openings</h6>';
                        output += '<li>' + openings.map(track => `<li>${track}</li>`).join('') + '</li>';
                    }
                
                    if (endings.length > 0) {
                        output += '<h6>Endings</h6>';
                        output += '<li>' + endings.map(track => `<li>${track}</li>`).join('') + '</li>';
                    }
                
                    // Fallback if no soundtracks are available
                    soundtrackList.innerHTML = output || '<li>No soundtracks available</li>';
                } else {
                    // Fallback if the theme object or arrays are missing
                    console.warn('Theme object or soundtracks missing:', anime.theme);
                    soundtrackList.innerHTML = '<li>No soundtracks available</li>';
                }                

                if (anime.trailer && anime.trailer.youtube_id) {
                    displayYouTubeTrailer(anime.trailer.youtube_id);
                } else {
                    animeTrailer.innerHTML = 'No trailer available.';
                }
            } else {
                handleAnimeNotFound();
            }
        })
        .catch(error => {
            console.error('Error fetching anime info:', error);
            handleAnimeNotFound();
        });

    function displayYouTubeTrailer(youtubeId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&wmode=opaque&autoplay=1`;
        iframe.width = "1600";
        iframe.height = "500";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        animeTrailer.innerHTML = '';
        animeTrailer.appendChild(iframe);
    }

    function handleAnimeNotFound() {
        animeTitle.textContent = 'Anime not found.';
        animeSynopsis.textContent = '';
        animeImage.src = '';
        animeRating.textContent = '';
        animeStars.innerHTML = '';
        animeYear.textContent = '';
        animeGenres.textContent = '';
        animeTrailer.innerHTML = '';
        favoritesCount.textContent = '0';
        studiosList.innerHTML = '';
        producersList.innerHTML = '';
        themesList.innerHTML = '';
        soundtrackList.innerHTML = '';
    }

    const buttons = document.querySelectorAll('.detail-btn');
    const sections = document.querySelectorAll('.section');

    document.getElementById('genres').classList.add('active');
    document.getElementById('genres-btn').classList.add('active');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = document.getElementById(button.id.replace('-btn', ''));
            sections.forEach(section => section.classList.remove('active'));
            buttons.forEach(btn => btn.classList.remove('active'));
            targetSection.classList.add('active');
            button.classList.add('active');
        });
    });
});
