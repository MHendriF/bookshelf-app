// main.js

const BOOKS_KEY = 'books';

let books = JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];

function saveBooks() {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

function renderBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookList');
  const completeBookshelfList = document.getElementById('completeBookList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  books.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.dataset.bookid = book.id;
    bookItem.dataset.testid = 'bookItem';
    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });

  attachEventListeners();
}

function addBook(title, author, year, isComplete) {
  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
}

function moveBook(bookId, isComplete) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = isComplete;
    saveBooks();
    renderBooks();
  }
}

function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooks();
  renderBooks();
}

function searchBooks(query) {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  const incompleteBookshelfList = document.getElementById('incompleteBookList');
  const completeBookshelfList = document.getElementById('completeBookList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  filteredBooks.forEach((book) => {
    const bookItem = document.createElement('div');
    bookItem.dataset.bookid = book.id;
    bookItem.dataset.testid = 'bookItem';
    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });

  attachEventListeners();
}

function editBook(bookId, title, author, year) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.title = title;
    book.author = author;
    book.year = year;
    saveBooks();
    renderBooks();
  }
}

function attachEventListeners() {
  document.querySelectorAll('[data-testid="bookForm"]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = form.querySelector(
        '[data-testid="bookFormTitleInput"]'
      ).value;
      const author = form.querySelector(
        '[data-testid="bookFormAuthorInput"]'
      ).value;
      const year = form.querySelector(
        '[data-testid="bookFormYearInput"]'
      ).value;
      const isComplete = form.querySelector(
        '[data-testid="bookFormIsCompleteCheckbox"]'
      ).checked;
      addBook(title, author, year, isComplete);
    });
  });

  document
    .querySelectorAll('[data-testid="searchBookForm"]')
    .forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = form.querySelector(
          '[data-testid="searchBookFormTitleInput"]'
        ).value;
        searchBooks(query);
      });
    });

  document
    .querySelectorAll('[data-testid="bookItemIsCompleteButton"]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const bookId = +button.closest('[data-bookid]').dataset.bookid;
        const isComplete = button.textContent === 'Selesai dibaca';
        moveBook(bookId, isComplete);
      });
    });

  document
    .querySelectorAll('[data-testid="bookItemDeleteButton"]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const bookId = +button.closest('[data-bookid]').dataset.bookid;
        deleteBook(bookId);
      });
    });

  document
    .querySelectorAll('[data-testid="bookItemEditButton"]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const bookId = +button.closest('[data-bookid]').dataset.bookid;
        const title = prompt('Masukkan judul baru:');
        const author = prompt('Masukkan penulis baru:');
        const year = prompt('Masukkan tahun baru:');
        if (title && author && year) {
          editBook(bookId, title, author, year);
        }
      });
    });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBooks();
});
