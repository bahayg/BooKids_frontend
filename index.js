let booksURL = "http://localhost:3000/books";
let usersURL = "http://localhost:3000/users";
let currentBookId = null;

createUser();
loginUser();

document.addEventListener("DOMContentLoaded", function () {
  const addBook = document.querySelector("#add-book");
  addBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const userId = localStorage.getItem("user_id");
    postBooks({
      title: event.target[0].value,
      author: event.target[1].value,
      img: event.target[2].value,
      status: event.target[3].value,
      date_finished: event.target[4].value,
      notes: event.target[5].value,
      user_id: userId,
    });
    event.target.reset();
  });
  document
    .querySelector("#content-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      modal.style.display = "none";
      updateBook({
        title: event.target[0].value,
        author: event.target[1].value,
        img: event.target[2].value,
        status: event.target[3].value,
        date_finished: event.target[4].value,
        notes: event.target[5].value,
        id: currentBookId,
      });
    });
});

document.querySelector("#delete-btn").addEventListener("click", function (e) {
  deleteBook(currentBookId);
});

function getBooks(userId) {
  fetch(`http://localhost:3000/books/${userId}`)
    .then((res) => res.json())
    .then((data) => {
      const bookIds = [];
      localStorage.setItem("bookIds", JSON.stringify(bookIds));
      data.forEach((book) => {
        appendBook(book);
        bookIds.push(book.id);
      });
      filterStatus(data);
    });
}

function appendBook(book) {
  const myBooks = document.getElementById("my-books");
  const div = bookCard(book);
  myBooks.appendChild(div);
  const books = JSON.parse(localStorage.getItem("bookIds"));
  books.push(book.id);
  localStorage.setItem("bookIds", JSON.stringify(books));
}

function bookCard(book) {
  const div = document.createElement("div");
  div.className = "book-card";
  div.id = `book${book.id}`;

  const h5 = document.createElement("h5");
  h5.textContent = book.title;

  const h6 = document.createElement("h6");
  h6.textContent = book.author;

  const pStatus = document.createElement("p");
  pStatus.id = "status";
  pStatus.textContent = book.status;

  const pDate = document.createElement("p");
  pDate.id = "date";
  pDate.textContent = book.date_finished;

  const pNotes = document.createElement("p");
  pNotes.id = "notes";
  pNotes.textContent = book.notes;

  const img = document.createElement("img");
  img.src = book.img;
  img.addEventListener("click", function () {
    modal.style.display = "block";
    populatedContentForm(book);
    updatedBook = div;
  });

  div.appendChild(img);

  return div;
}

function populatedContentForm(book) {
  const contentForm = document.querySelector("#content-form");
  contentForm.querySelector("#title").value = book.title;
  contentForm.querySelector("#author").value = book.author;
  contentForm.querySelector("#status").value = book.status;
  contentForm.querySelector("#date").value = book.date_finished;
  contentForm.querySelector("#notes").value = book.notes;
  contentForm.querySelector("#cover").value = book.img;
  currentBookId = book.id;
}

function postBooks(book) {
  fetch(booksURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((data) => appendBook(data));
}

function updateBook(book) {
  fetch(`http://localhost:3000/books/${book.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(book),
  })
    .then((res) => res.json())
    .then((data) => updatedBook.replaceWith(bookCard(data)));
}

function deleteBook(bookId) {
  // console.log(bookId)
  fetch(`http://localhost:3000/books/${bookId}`, {
    method: "DELETE",
  }).then(function () {
    document.getElementById(`book${bookId}`).remove();
  });
}

// Filter by Status

function filterStatus(books) {
  let filterBtn = document.getElementById("dropdown");
  filterBtn.style.display = "block";

  let readBooks = books.filter((book) => book.status === "Read");
  let notReadBooks = books.filter((book) => book.status === "Want to Read");
  const filterRead = document.getElementById("read");
  const filterNotRead = document.getElementById("not-read");
  const showAll = document.getElementById("all");

  showAll.addEventListener("click", function () {
    const bookList = document.getElementById("my-books");
    bookList.innerHTML = "";
    books.forEach((book) => {
      appendBook(book);
    });
  });
  filterRead.addEventListener("click", function () {
    const bookList = document.getElementById("my-books");
    bookList.innerHTML = "";
    readBooks.forEach((book) => {
      appendBook(book);
    });
  });
  filterNotRead.addEventListener("click", function () {
    const bookList = document.getElementById("my-books");
    bookList.innerHTML = "";
    notReadBooks.forEach((book) => {
      appendBook(book);
    });
  });
}

// User Model

function createUser() {
  let name = null;
  const signUp = document.getElementById("create-user-form");
  signUp.addEventListener("submit", function (e) {
    name = e.target[0].value;
    e.preventDefault();
    fetch(usersURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target[0].value,
      }),
    }).then((res) => res.json());
    swal("Your account is created!", {
      icon: "success",
    }).then((json) => {
      localStorage.setItem("user_id", json["id"]);
      let signupField = document.getElementById("signup-field");
      signupField.value = "";
      let userContainer = document.getElementById("user-container");
      userContainer.style.display = "none";
      let addBookForm = document.getElementById("add-new-book");
      addBookForm.style.display = "block";
      currentUser(name);
      getBooks(localStorage.getItem("user_id"));
    });
  });
}

function loginUser() {
  let name = null;
  const login = document.getElementById("login-form");
  login.addEventListener("submit", function (e) {
    name = e.target[0].value;
    e.preventDefault();
    fetch(`http://localhost:3000/users/${name}`)
      .then((resp) => resp.json())
      .then((json) => {
        if (json) {
          localStorage.clear();
          localStorage.setItem("user_id", json["id"]);
          let loginField = document.getElementById("login-field");
          loginField.value = "";
          let userContainer = document.getElementById("user-container");
          userContainer.style.display = "none";
          let addBookForm = document.getElementById("add-new-book");
          addBookForm.style.display = "block";
          currentUser(name);
          getBooks(localStorage.getItem("user_id"));
        } else {
          swal("Try again...", {
            icon: "error",
          });
        }
      });
  });
}

function currentUser(name) {
  const currentUser = document.getElementById("active-user");
  currentUser.style.display = "block";
  welcome.style.display = "none";

  const div = document.createElement("div");
  div.id = "welcome-user";

  let nameArea = document.createElement("p");
  nameArea.textContent = `Welcome to BooKids, ${name}!`;

  let signOut = document.createElement("button");
  signOut.textContent = " Logout";
  signOut.id = "signOut-btn";
  signOut.className = "bi bi-box-arrow-right";

  let deleteUser = document.createElement("button");
  deleteUser.textContent = " Delete my Account";
  deleteUser.id = "delete-btn";
  deleteUser.className = "bi bi-trash";

  div.appendChild(nameArea);
  div.appendChild(signOut);
  div.appendChild(deleteUser);
  currentUser.appendChild(div);

  signOut.addEventListener("click", function () {
    localStorage.clear();
    currentUser.style.display = "none";
    let userContainer = document.getElementById("user-container");
    userContainer.style.display = "inline-table";
    div.remove();
    const bookList = document.getElementById("my-books");
    bookList.innerHTML = "";
    let addBookForm = document.getElementById("add-new-book");
    addBookForm.style.display = "none";
    welcome.style.display = "block";
    let filterBtn = document.getElementById("dropdown");
    filterBtn.style.display = "none";
  });

  deleteUser.addEventListener("click", function () {
    fetch(`http://localhost:3000/users/${localStorage.getItem("user_id")}`, {
      method: "DELETE",
    }).then(function () {
      currentUser.style.display = "none";
      let userContainer = document.getElementById("user-container");
      userContainer.style.display = "inline-table";
      div.remove();
      // const books = JSON.parse(localStorage.getItem("bookIds"));console.log(localStorage.getItem("bookIds"))
      // books.forEach(book => {
      //   deleteBook(book)
      // })
      const bookList = document.getElementById("my-books");
      bookList.innerHTML = "";
      let addBookForm = document.getElementById("add-new-book");
      addBookForm.style.display = "none";
      welcome.style.display = "block";
      let filterBtn = document.getElementById("dropdown");
      filterBtn.style.display = "none";
      localStorage.clear();
      swal("You account has been deleted!", {
        icon: "success",
      });
    });
  });
}
