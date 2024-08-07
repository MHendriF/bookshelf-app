// book.js

const BOOKS_KEY = 'books';

let books = JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];

export function saveBooks() {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function renderBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookList');
  const completeBookshelfList = document.getElementById('completeBookList');

  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  books.forEach((book) => {
    const bookItem = document.createElement('book-item');
    bookItem.dataset.bookid = book.id;
    bookItem.dataset.testid = 'bookItem';
    bookItem.book = book;

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });
}

export function addBook(title, author, year, isComplete) {
  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
}

export function editBook(bookId, title, author, year) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.title = title;
    book.author = author;
    book.year = year;
    saveBooks();
    renderBooks();
  }
}

export function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooks();
  renderBooks();
}

export function searchBooks(query) {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  if (filteredBooks.length === 0) {
    searchResults.innerHTML = '<p>Buku tidak ditemukan.</p>';
  } else {
    filteredBooks.forEach((book) => {
      const bookItem = document.createElement('book-item');
      bookItem.dataset.bookid = book.id;
      bookItem.dataset.testid = 'bookItem';
      bookItem.book = book;
      searchResults.appendChild(bookItem);
    });
  }
}

export function deleteAllBooks() {
  if (confirm('Anda yakin ingin menghapus semua buku?')) {
    books = [];
    saveBooks();
    renderBooks();
  }
}

class BookItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set book(book) {
    this._book = book;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: white;
          padding: 1rem;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        :host(:hover) {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        h3 {
          font-size: 1.2em;
          font-weight: bold;
        }
        p {
          color: #666;
        }
        button {
          background-color: #4CAF50;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        button:hover {
          background-color: #45a049;
          transform: scale(1.05);
        }
      </style>
      <h3>${this._book.title}</h3>
      <p>Penulis: ${this._book.author}</p>
      <p>Tahun: ${this._book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          this._book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;
  }
}

customElements.define('book-item', BookItem);
