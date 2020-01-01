let booksURL = "http://localhost:3000/books"
let usersURL = "http://localhost:3000/users"

getBooks()
createUser()
loginUser()

document.addEventListener("DOMContentLoaded", function() {
  const addBook = document.querySelector("#add-book")
  addBook.addEventListener("submit", function(e) {
    e.preventDefault()
    postBooks({
      "title": event.target[0].value,
      "author": event.target[1].value,
      "img": event.target[2].value,
      "status": event.target[3].value,
      "date_finished": event.target[4].value,
      "notes": event.target[5].value
    })
    event.target.reset();
  });  

})

function getBooks() {
  fetch(booksURL)
  .then(res => res.json())
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
  div.id = `book${book.id}`;
  
  const img = document.createElement("img");
  img.src = book.img;

  // const h5 = document.createElement("h5");
  // h5.textContent = book.title;

  // const h6 = document.createElement("h6");
  // h6.textContent = book.author;

  // const p1 = document.createElement("p");
  // p1.textContent = book.status;

  // const p2 = document.createElement("p");
  // p2.textContent = book.date_finished;

  // const p3 = document.createElement("p");
  // p3.textContent = book.notes;

  // const update = document.createElement("button");
  // update.textContent = "Update";
  // update.addEventListener("onclick", function() {
  //   modal.style.display = "block";
    
  //   const contentForm = document.querySelector("#content-form");
  //   editForm.title.value = book.title;
  //   editForm.author.value = book.author;
  //   editForm.cover.value = book.img;
  //   editForm.bookId.value = book.id;

  //     title: div.querySelector("h3").textContent,
  //     author: div.querySelector("p").textContent,
  //     img: div.querySelector("img").src,
  //     id: book.id



  div.appendChild(img);
  // div.appendChild(h5);
  // div.appendChild(h6);
  // div.appendChild(p1);
  // div.appendChild(p2);
  // div.appendChild(p3);
  // div.appendChild(update);

  return div;
}

function postBooks(book) {
  fetch(booksURL, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      body: JSON.stringify(book)
  })
  .then(res => res.json())
  .then(data => appendBook(data))
}

// function updateBook(book) {
//   fetch(`http://localhost:3000/books/${event.target.id}`, {
//     method: "PATCH",
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json"
//     },
//     body: JSON.stringify(book)
// })
// .then(res => res.json())
// .then(data => appendBook(data))
// }












function createUser () {
  const signUp = document.getElementById("create-user-btn")
  signUp.addEventListener("submit", function(e){
    e.preventDefault();
      fetch('usersURL', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username": e.target.username.value
        })
          .then(res => res.json())
          .then(json => {
            localStorage.setItem("user_id", json["id"]);
        })
      })
  })
}

      function loginUser () {
        const login = document.getElementById("login-user-btn")
        login.addEventListener("submit", function(e){
        e.preventDefault();
        fetch(`http://localhost:3000/users/${e.target[0].value}`)
        .then(resp => resp.json())
        .then(json => {
            localStorage.setItem("user_id", json["id"]);
        })
      })
    }

//     .then(user => createUserId(user))
//   }

//   function createUserId(user) {
//     currentUser = user.id
//   }

  // console.log(e.target.username.value)













// const addBtn = document.querySelector('#new-toy-btn')
//     const toyForm = document.querySelector('.container')
//     addBtn.addEventListener('click', () => {
//       // hide & seek with the form
//       addToy = !addToy
//       if (addToy) {
//         toyForm.style.display = 'block'
//       } else {
//         toyForm.style.display = 'none'
//       }