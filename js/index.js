document.addEventListener("DOMContentLoaded", () => {
  const BOOKS_URL = "http://localhost:3000/books";
  const currentUser = { id: 1, username: "pouros" };
  const bookList = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");

  // Fetch and render all books
  fetch(BOOKS_URL)
    .then(res => res.json())
    .then(books => {
      books.forEach(book => renderBookListItem(book));
    });

  function renderBookListItem(book) {
    const li = document.createElement("li");
    li.textContent = book.title;
    li.addEventListener("click", () => showBookDetails(book));
    bookList.appendChild(li);
  }

  function showBookDetails(book) {
    showPanel.innerHTML = `
      <h2>${book.title}</h2>
      <img src="${book.img_url}" alt="${book.title}" />
      <p>${book.description}</p>
      <h3>Liked by:</h3>
      <ul id="users-list">
        ${book.users.map(user => `<li>${user.username}</li>`).join("")}
      </ul>
      <button id="like-btn">${userHasLiked(book) ? "UNLIKE" : "LIKE"}</button>
    `;

    document.getElementById("like-btn").addEventListener("click", () => {
      toggleLike(book);
    });
  }

  function userHasLiked(book) {
    return book.users.some(user => user.id === currentUser.id);
  }

  function toggleLike(book) {
    const hasLiked = userHasLiked(book);
    const updatedUsers = hasLiked
      ? book.users.filter(user => user.id !== currentUser.id)
      : [...book.users, currentUser];

    fetch(`${BOOKS_URL}/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ users: updatedUsers })
    })
      .then(res => res.json())
      .then(updatedBook => {
        showBookDetails(updatedBook); // Re-render book detail panel
      })
      .catch(error => {
        alert("An error occurred while updating likes.");
        console.error(error);
      });
  }
});
