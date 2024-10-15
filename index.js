const baseUrl = "http://localhost:5501"
document.addEventListener('DOMContentLoaded', () => {
    async function getData(){
        try {
            let response = await fetch(baseUrl)
            let data =  await response.json()
            data.forEach(duck => {
                displayDuck(duck)
        })
        }catch(err){
            console.log(err)
        }
    }
    const duckImage = document.getElementById('duck-image');
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');
    const fetchDuckButton = document.getElementById('fetch-duck');
    const commentsList = document.getElementById('comments-list');
    const commentInput = document.getElementById('comment-input');
    const commentButton = document.getElementById('comment-button');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let likes = 0;

    // Fetch and display a random duck image
    const fetchDuck = async () => {
        try {
            const response = await fetch('https://random-d.uk/api/v2/random');
            const data = await response.json();
            duckImage.src = "${duck.image_url}"
        } catch (error) {
            console.error('Error fetching duck:', error);
        }
    };

    // Increment like count
    likeButton.addEventListener('click', () => {
        likes++;
        likeCount.textContent = likes; // Update displayed like count
    });

    // Add a comment
    commentButton.addEventListener('click', () => {
        const comment = commentInput.value.trim();
        if (comment) {
            const listItem = document.createElement('li');
            listItem.textContent = comment; // Create new comment
            commentsList.appendChild(listItem); // Add comment to list
            commentInput.value = ''; // Clear input field
        }
    });

    // Fetch a duck on page load
    fetchDuck();

    // Fetch another duck
    fetchDuckButton.addEventListener('click', fetchDuck);

    // Toggle dark/light mode
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});

let addForm = document.getElementById("add-form")
addForm.addEventListener("submit",(e) =>{
    e.preventDefault()
    let formData = new FormData(e.target)
    let foodObj = {
        name:formData.get("name"),
        image_url: formData.get("image")
    }
   
    fetch(baseUrl,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(duckObj)
    })
    .then(res => res.json())
    .then(data => {
        alert(`${data.name} created successfully`)
    })
    .catch(err => console.log(err))
})