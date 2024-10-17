const baseUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent("https://random-d.uk/api/v2/random");


document.addEventListener('DOMContentLoaded', () => {
    const duckImage = document.getElementById('duck-image');
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');
    const fetchDuckButton = document.getElementById('fetch-duck');
    const commentsList = document.getElementById('comments-list');
    const commentInput = document.getElementById('comment-input');
    const commentButton = document.getElementById('comment-button');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const addForm = document.getElementById("add-form");

    let likes = 0;

    // Fetch and display a random duck image
    const fetchDuck = async () => {
        try {
            const response = await fetch(baseUrl);
            const data = await response.json();
            const duckData = JSON.parse(data.contents); // Parse the inner JSON
            duckImage.src = duckData.url; // Use duckData.url
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
    document.addEventListener('DOMContentLoaded', () => {
        const addDuckButton = document.getElementById('add-duck-button');
        addDuckButton.addEventListener('click', () => {
            alert('Add Duck button clicked!');
        });
    
    
    });
    
    // Add a new duck
    addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let duckObj = {
            name: formData.get("name"),
            image_url: formData.get("image")
        };

        fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(duckObj)
        })
        .then(res => res.json())
        .then(data => {
            alert(`${data.name} created successfully`);
            fetchDuck(); // Optionally fetch a new duck image after creation
        })
        .catch(err => console.log(err));
    });

    function displayDuck(duck) {
        const ducksDiv = document.getElementById("duck-div");
        const duckDiv = document.createElement("div");
        duckDiv.classList.add("duck-div");
        duckDiv.innerHTML = `
            <img src="${duck.image_url}" />
            <p>Name: ${duck.name}</p>
            <form id="edit-form" onsubmit="editDuck(event, this, ${duck.id})">
                <label for="name">Name: </label>
                <input type="text" name="name" required><br>
                <label for="image">Image: </label>
                <input type="url" name="image" required><br>
                <button>Edit Duck</button>
            </form>
            <button onclick="deleteDuck(${duck.id})">Delete</button>
        `;
        ducksDiv.appendChild(duckDiv);
    }

    function deleteDuck(id) {
        fetch(`${baseUrl}/${id}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then(() => {
            alert("Duck Deleted Successfully");
        })
        .catch(err => console.log(err));
    }

    function editDuck(e, form, id) {
        e.preventDefault();
        let formData = new FormData(form);
        let duckObject = {
            name: formData.get("name"),
            image_url: formData.get("image"),
        };
        fetch(`${baseUrl}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(duckObject)
        })
        .then(res => res.json())
        .then(data => {
            alert(`${data.name} updated successfully`);
        })
        .catch(err => console.log(err));
    }
});
