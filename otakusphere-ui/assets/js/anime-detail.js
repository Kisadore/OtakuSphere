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

    
     // Construct API URL
     const apiUrl = `https://api.jikan.moe/v4/anime/${animeId}`;
    
     fetch(apiUrl)
         .then(response => response.json())
         .then(data => {
             if (data.data) {
                 const anime = data.data;
                 animeTitle.textContent = anime.title;
                 animeSynopsis.textContent = anime.synopsis;
                 animeImage.src = anime.images.jpg.large_image_url;
                 animeRating.textContent = `Rating: ${anime.score || "No rating available"}`; // Display rating
                 
                 // Render star rating
                 renderStarRating(anime.score);
                 document.title = anime.title;
             } else {
                 animeTitle.textContent = 'Anime not found.';
                 animeSynopsis.textContent = '';
                 animeImage.src = '';
                 animeRating.textContent = '';  // Clear rating if no data
                 animeStars.innerHTML = '';     // Clear stars if no data
             }
         })
         .catch(error => {
             console.error('Error fetching anime info:', error);
             animeTitle.textContent = 'Error loading anime info.';
             animeSynopsis.textContent = '';
             animeImage.src = '';
             animeRating.textContent = '';  // Clear rating if error
             animeStars.innerHTML = '';     // Clear stars if error
         });
 
     // Function to render star rating with partial stars
     function renderStarRating(score) {
         let fullStars = Math.floor(score / 2);  // Number of full stars (out of 5)
         let halfStars = (score % 2 >= 1) ? 1 : 0; // 1 half-star if there's a remainder
         let emptyStars = 5 - fullStars - halfStars; // Empty stars to fill the remaining spots
 
         let starsHTML = '';
 
         // Add full stars
         for (let i = 0; i < fullStars; i++) {
             starsHTML += '<span class="full">★</span>';
         }
 
         // Add half stars (if any)
         for (let i = 0; i < halfStars; i++) {
             starsHTML += '<span class="half">★</span>';
         }
 
         // Add empty stars
         for (let i = 0; i < emptyStars; i++) {
             starsHTML += '<span class="empty">☆</span>';
         }
 
         // Update the HTML to display the stars
         animeStars.innerHTML = starsHTML;
     }
});