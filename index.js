document.addEventListener('DOMContentLoaded', () => {
    const duckImage = document.getElementById('duck-image');
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');
    const fetchDuckButton = document.getElementById('fetch-duck');
    const commentsList = document.getElementById('comments-list');
    const commentInput = document.getElementById('comment-input');
    const commentButton = document.getElementById('comment-button');

    let likes = 0;

    // Fetch a random duck image
    const fetchDuck = async () => {
        try {
            const response = await fetch('https://random-d.uk/api/v2/random');
            const data = await response.json();
            duckImage.src = data.url;
        } catch (error) {
            console.error('Error fetching duck:', error);
        }
    };

    // Like the duck
    likeButton.addEventListener('click', () => {
        likes += 1;
        likeCount.textContent = likes;
    });

    // Add a comment
    commentButton.addEventListener('click', () => {
        const comment = commentInput.value.trim();
        if (comment) {
            const listItem = document.createElement('li');
            listItem.textContent = comment;
            commentsList.appendChild(listItem);
            commentInput.value = ''; // Clear the input
        }
    });

    // Fetch a duck when the page loads
    fetchDuck();

    // Fetch another duck when button is clicked
    fetchDuckButton.addEventListener('click', fetchDuck);
});
