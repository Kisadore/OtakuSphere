import { generateStarRating } from './homepage.js';
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id'); // Retrieves the value of 'id' parameter

    if (!animeId) {
        alert("Anime ID not found in the URL!");
        return;
    }

    const animeTitle = document.getElementById('anime-title');
    const animeSynopsis = document.getElementById('anime-synopsis');
    const animeImage = document.getElementById('anime-image');
    const animeRating = document.getElementById('anime-rating');
    const animeStars = document.getElementById('anime-stars');  // For displaying stars
    const animeTrailer = document.getElementById('anime-trailer');  // For displaying the trailer

    
     // Construct API URL
     const apiUrl = `https://api.jikan.moe/v4/anime/${animeId}`;
    
     fetch(apiUrl)
         .then(response => response.json())
         .then(data => {
            console.log(data);
             if (data.data) {
                 const anime = data.data;
                 animeTitle.textContent = anime.title;
                 animeSynopsis.textContent = anime.synopsis;
                 animeImage.src = anime.images.jpg.large_image_url;
                 animeRating.textContent = `Average Rating: ${anime.score || "No rating available"}`; // Display rating
                 animeStars.innerHTML= `${anime.score ? generateStarRating(anime.score/2) : 'No Ratings'}`;
                 
                 document.title = anime.title;

                // Check if trailer exists and embed it
                if (anime.trailer && anime.trailer.youtube_id) {
                    displayYouTubeTrailer(anime.trailer.youtube_id);  // Pass the youtube_id directly
                } else {
                    animeTrailer.innerHTML = 'No trailer available.';
                }

             } else {
                 animeTitle.textContent = 'Anime not found.';
                 animeSynopsis.textContent = '';
                 animeImage.src = '';
                 animeRating.textContent = '';  // Clear rating if no data
                 animeStars.innerHTML = '';     // Clear stars if no data
                 animeTrailer.innerHTML = '';   // Clear trailer if no data
             }
         })
         .catch(error => {
             console.error('Error fetching anime info:', error);
             animeTitle.textContent = 'Error loading anime info.';
             animeSynopsis.textContent = '';
             animeImage.src = '';
             animeRating.textContent = '';  // Clear rating if error
             animeStars.innerHTML = '';     // Clear stars if error
             animeTrailer.innerHTML = '';   // Clear trailer if error
         });

    // Function to display YouTube trailer using the video ID
    function displayYouTubeTrailer(youtubeId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&wmode=opaque&autoplay=1`;
        iframe.width = "1600";
        iframe.height = "500";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;

        // Clear any previous content and append the new iframe
        animeTrailer.innerHTML = '';  // Clear existing trailer content
        animeTrailer.appendChild(iframe);  // Add the new iframe with the trailer
    }
});