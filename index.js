const baseUrl = "http://localhost:3000/Ducks";

document.addEventListener('DOMContentLoaded', () => {
    const duckDiv = document.getElementById('duck-div');
    const form = document.querySelector('#add-form');
    const toggleThemeButton = document.getElementById('toggle-theme');

    // Fetch and display ducks
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(duck => {
                displayDuck(duck);
            });
        })
        .catch(error => console.error(error));

    // Handle form submission to add a new duck using POST
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Retrieve form data
        const formData = new FormData(form);
        const duckObj = {
            name: formData.get('name'),
            image_url: formData.get('image'),
            comment: formData.get('comment'),
            likes: 0 // Initialize with 0 likes
        };

        // POST request to add new duck
        fetch(baseUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(duckObj)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add duck');
            }
            return response.json();
        })
        .then(data => {
            alert(`${data.name} created successfully`);
            displayDuck(data); // Display the newly added duck
            form.reset(); // Reset the form
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding duck. Please try again.');
        });
    });

    // Toggle dark/light mode
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Display duck function
    function displayDuck(duck) {
        const duckContainer = document.createElement("div");
        duckContainer.classList.add("duck-div");
        duckContainer.setAttribute('data-id', duck.id);
        duckContainer.innerHTML = `
            <img src="${duck.image_url}" alt="${duck.name}" />
            <p>Name: ${duck.name}</p>
            <div class="like-section">
                <button class="like-button">Like</button>
                <span class="like-count">${duck.likes}</span> Likes
            </div>
            <form class="edit-form">
                <label for="name">Name: </label>
                <input type="text" name="name" value="${duck.name}" required><br>
                <label for="image">Image: </label>
                <input type="url" name="image" value="${duck.image_url}" required><br>
                <button type="submit">Edit Duck</button>
            </form>
            <button class="delete-duck">Delete</button>
            <div class="comments-section">
                <ul class="comments-list">
                    <!-- Existing comments can be displayed here -->
                </ul>
                <input type="text" class="comment-input" placeholder="Add a comment..." />
                <button class="comment-button">Add Comment</button>
            </div>
        `;
        duckDiv.appendChild(duckContainer);

        // Add event listeners for edit, delete, like, and comment buttons
        const editForm = duckContainer.querySelector('.edit-form');
        const deleteButton = duckContainer.querySelector('.delete-duck');
        const likeButton = duckContainer.querySelector('.like-button');
        const commentButton = duckContainer.querySelector('.comment-button');

        editForm.addEventListener('submit', (e) => editDuck(e, duck.id));
        deleteButton.addEventListener('click', () => deleteDuck(duck.id, duckContainer));
        likeButton.addEventListener('click', () => likeDuck(duck, duckContainer));
        commentButton.addEventListener('click', () => addComment(duckContainer));
    }

    // Delete duck function
    function deleteDuck(id, element) {
        fetch(`${baseUrl}/${id}`, {
            method: "DELETE",
        })
        .then(res => {
            if (res.ok) {
                alert("Duck Deleted Successfully");
                element.remove(); // Remove the duck from the UI
            }
        })
        .catch(err => console.error(err));
    }

    // Edit duck function
    function editDuck(e, id) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const duckObject = {
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
            form.parentElement.querySelector('p').textContent = `Name: ${data.name}`;
            form.parentElement.querySelector('img').src = data.image_url;
        })
        .catch(err => console.error(err));
    }

    // Add comment function
    function addComment(duckContainer) {
        const commentInput = duckContainer.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        if (commentText) {
            const commentsList = duckContainer.querySelector('.comments-list');
            const listItem = document.createElement('li');
            listItem.textContent = commentText; // Create new comment
            commentsList.appendChild(listItem); // Add comment to specific duck's list
            commentInput.value = ''; // Clear input field
        } else {
            alert("Please enter a comment!");
        }
    }

    // Like duck function
    function likeDuck(duck, duckContainer) {
        duck.likes += 1; // Increment the like count
        fetch(`${baseUrl}/${duck.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ likes: duck.likes })
        })
        .then(res => res.json())
        .then(updatedDuck => {
            const likeCountSpan = duckContainer.querySelector('.like-count');
            likeCountSpan.textContent = updatedDuck.likes; // Update displayed like count
        })
        .catch(err => console.error(err));
    }
});
