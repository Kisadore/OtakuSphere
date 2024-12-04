import { generateStarRating } from './homepage.js';

document.addEventListener('DOMContentLoaded', function() {
    const signInPrompt = document.getElementById('signIn-prompt');

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Create "Sign In" button
    const signInButton = document.createElement('button');
    signInButton.className = 'signIn-btn';
    signInButton.textContent = 'Sign In to Log, Rate, or Review';

    signInButton.addEventListener('click', function () {
        window.location.href = 'login.html';
    });

    // Create "Share" button
    const shareButton = document.createElement('button');
    shareButton.className = 'share-btn';
    shareButton.textContent = 'Share';

    let isTextBoxVisible = false;
    let revertTimeout; // Variable to store the timeout reference

    shareButton.addEventListener('click', function () {
        clearTimeout(revertTimeout); // Clear any existing timeout
        if (!isTextBoxVisible) {
            showShareTextBox(shareButton); // Show the text box
        }
    });

    // Append buttons to the container
    buttonContainer.appendChild(signInButton);
    buttonContainer.appendChild(shareButton);

    // Append the container to the "signIn-prompt" element
    signInPrompt.appendChild(buttonContainer);      

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
    const watchlistCount = document.getElementById('watchlist-count');
    const epCount = document.getElementById('ep-count');
    const animeType = document.getElementById('anime-type');

    const apiUrl = `https://api.jikan.moe/v4/anime/${animeId}/full`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.data) {
                const anime = data.data;
                const airingYear = anime.aired?.from 
                    ? new Date(anime.aired.from).getUTCFullYear() 
                    : 'Unknown';
                const genres = anime.genres.map(genre => genre.name).join(', ');
                const studios = anime.studios.map(studio => studio.name).join(', ');
                const producers = anime.producers.map(producer => producer.name).join(', ');
                const themes = anime.themes.map(theme => theme.name).join(', ');
                
                animeTitle.textContent = anime.title;
                animeSynopsis.textContent = anime.synopsis;
                animeImage.src = anime.images.jpg.large_image_url;
                animeRating.textContent = `${(Math.round((anime.score / 2) * 10) / 10) || "No ratings"}`;
                animeStars.innerHTML = `${anime.score ? generateStarRating(anime.score / 2) : generateStarRating(0)}`;
                animeYear.textContent = `${airingYear}`;
                epCount.textContent = `${anime.episodes}`;
                animeType.textContent = `${anime.type}`;

                animeGenres.innerHTML = genres 
                    ? genres.split(', ').map(genre => `<li>${genre}</li>`).join('')
                    : '<li>No genres available</li>';
                studiosList.innerHTML = studios 
                    ? studios.split(', ').map(studio => `<li>${studio}</li>`).join('')
                    : '<li>No studios available</li>';
                producersList.innerHTML = producers 
                    ? producers.split(', ').map(producer => `<li>${producer}</li>`).join('')
                    : '<li>No producers available</li>';
                themesList.innerHTML = themes 
                    ? themes.split(', ').map(theme => `<li>${theme}</li>`).join('')
                    : '<li>No themes available</li>';
                favoritesCount.textContent = `${formatNumberWithK(anime.favorites || 0)}`;
                watchlistCount.textContent = `${formatNumberWithK(anime.members || 0)}`;

                // Populate soundtrack list (openings and endings)
                if (anime.theme && (anime.theme.openings || anime.theme.endings)) {
                    const openings = anime.theme.openings || []; // Array of opening songs
                    const endings = anime.theme.endings || [];   // Array of ending songs
                
                    // Create sections for openings and endings
                    let output = '';
                
                    if (openings.length > 0) {
                        output += '<h5>Openings</h5>';
                        output += '<li>' + openings.map(track => `<li>${track}</li>`).join('') + '</li>';
                    }
                
                    if (endings.length > 0) {
                        output += '<h5>Endings</h5>';
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

    // Helper function: Show the share text box and copy functionality
    function showShareTextBox(shareButton) {
        const textBox = document.createElement('input');
        textBox.type = 'text';
        textBox.className = 'share-textbox';
        textBox.value = window.location.href;
        textBox.readOnly = true; // Prevent editing the URL

        // Add copy button/icon next to the text box
        const copyIcon = document.createElement('span');
        copyIcon.className = 'copy-icon';
        copyIcon.innerHTML = '📋'; // Simple clipboard icon
        copyIcon.title = 'Copy link';

        copyIcon.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent triggering the "Share" button click event
            navigator.clipboard.writeText(textBox.value);
            alert('Link copied to clipboard!');
            restartRevertTimer(shareButton); // Restart the revert timer
        });

        // Replace button content with the text box and copy icon
        shareButton.textContent = ''; // Clear the button text
        shareButton.appendChild(textBox);
        shareButton.appendChild(copyIcon);

        isTextBoxVisible = true;

        // Set timeout to revert back to "Share" button
        restartRevertTimer(shareButton);
    }

    // Helper function: Reset the "Share" button
    function resetShareButton(shareButton) {
        shareButton.textContent = 'Share';
        isTextBoxVisible = false;
    }

    // Helper function: Restart the revert timer
    function restartRevertTimer(shareButton) {
        clearTimeout(revertTimeout); // Clear any existing timeout
        revertTimeout = setTimeout(() => {
            resetShareButton(shareButton);
        }, 5000); // 5 seconds
    }

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
        watchlistCount.textContent = '0';
        epCount='';
        animeType='';
    }

    function formatNumberWithK(number) {
        if (number >= 1000000) {
            // Format to millions with one decimal place
            return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        } else if (number >= 1000) {
            // Format to thousands with one decimal place
            return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return number.toString();
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
