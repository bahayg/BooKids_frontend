let booksURL = "http://localhost:3000/books"

document.addEventListener("DOMContentLoaded", function() {
    
})



getBooks()

function getBooks() {
  fetch(booksURL)
  .then(resp => resp.json())
  .then(data => {
    data.forEach(book => {
      appendBook(book);
    })
    })
}

function appendBook(book) {
  const myBooks = document.getElementById("my-books");
  const div = bookCard(book);
  myBooks.appendChild(div);
}

function bookCard(book) {
  const div = document.createElement("div");
  div.className = "book-card";
  
  const img = document.createElement("img");
  img.src = book.img;

  const h3 = document.createElement("h3");
  h3.textContent = book.title;

  const h5 = document.createElement("h5");
  h5.textContent = book.author;

  const p1 = document.createElement("p");
  p1.textContent = book.status;

  const p2 = document.createElement("p");
  p2.textContent = book.date_finished;

  const p3 = document.createElement("p");
  p3.textContent = book.notes;


  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(h5);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(p3);

  return div;
}


// function postUser () {
//     fetch('', {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         "username": username.value,
//         "email": email.value
//       })
//     }).then(res => res.json())
//     .then(user => createUserId(user))
//   }

//   function createUserId(user) {
//     currentUser = user.id
//   }