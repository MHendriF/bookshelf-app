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
    <link rel="stylesheet" href="assets/styles/styles.css">
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

    // Menambahkan event listener untuk tombol "Selesai dibaca" dan "Belum selesai dibaca"
    this.shadowRoot
      .querySelectorAll('[data-testid="bookItemIsCompleteButton"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const bookId = +this.dataset.bookid;
          const book = books.find((b) => b.id === bookId);

          if (book) {
            book.isComplete = !book.isComplete;
            saveBooks();
            renderBooks();
          }
        });
      });

    // Menambahkan event listener untuk tombol edit
    this.shadowRoot
      .querySelectorAll('[data-testid="bookItemEditButton"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const bookId = +this.dataset.bookid;
          const book = books.find((b) => b.id === bookId);

          if (book) {
            document.getElementById('editBookTitle').value = book.title;
            document.getElementById('editBookAuthor').value = book.author;
            document.getElementById('editBookYear').value = book.year;

            const editBookModal = new bootstrap.Modal(
              document.getElementById('editBookModal')
            );
            editBookModal.show();

            document
              .getElementById('saveEditBook')
              .addEventListener('click', () => {
                const newTitle = document.getElementById('editBookTitle').value;
                const newAuthor =
                  document.getElementById('editBookAuthor').value;
                const newYear = document.getElementById('editBookYear').value;

                if (newTitle && newAuthor && newYear) {
                  editBook(bookId, newTitle, newAuthor, newYear);
                  editBookModal.hide();
                }
              });
          }
        });
      });

    // Menambahkan event listener untuk tombol hapus
    this.shadowRoot
      .querySelectorAll('[data-testid="bookItemDeleteButton"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          const bookId = +this.dataset.bookid;
          deleteBook(bookId);
        });
      });
  }
}

customElements.define('book-item', BookItem);
