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

export function addBook(book) {
  const newBook = {
    id: book.id || new Date().getTime(),
    title: book.title,
    author: book.author,
    year: book.year,
    isComplete: book.isComplete,
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
}

export function editBook(bookId, updatedBook) {
  const bookIndex = books.findIndex((b) => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
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
    book.title.toLowerCase().includes(query.toLowerCase()),
  );

  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  if (filteredBooks.length === 0) {
    searchResults.innerHTML = '<p id="resultInfo">Buku tidak ditemukan</p>';
  } else {
    searchResults.innerHTML =
      '<p id="resultInfo">Hasil Pencarian Buku : "' + query + '"</p>';
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
    <h3 data-testid="bookItemTitle" part="book-item-title book-item-content">${
      this._book.title
    }</h3>
    <p data-testid="bookItemAuthor" part="book-item-author book-item-content">Penulis: ${
      this._book.author
    }</p>
    <p data-testid="bookItemYear" part="book-item-year book-item-content">Tahun: ${
      this._book.year
    }</p>
    <div>
      <button data-testid="bookItemIsCompleteButton" part="book-item-button">${
        this._book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'
      }</button>
      <button data-testid="bookItemDeleteButton" part="book-item-button">Hapus Buku</button>
      <button data-testid="bookItemEditButton" part="book-item-button">Edit Buku</button>
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
            console.log(
              '🚀 ~ BookItem ~ button.addEventListener ~ book:',
              book,
            );
            document.getElementById('editBookTitle').value = book.title;
            document.getElementById('editBookAuthor').value = book.author;
            document.getElementById('editBookYear').value = book.year;

            const editBookModal = new bootstrap.Modal(
              document.getElementById('editBookModal'),
            );
            editBookModal.show();

            document
              .getElementById('saveEditBook')
              .addEventListener('click', () => {
                const newTitle = document.getElementById('editBookTitle').value;
                const newAuthor =
                  document.getElementById('editBookAuthor').value;
                const newYear = parseInt(
                  document.getElementById('editBookYear').value,
                  10,
                );

                if (!newTitle || !newAuthor || !newYear) {
                  alert('Field title, author, dan year harus diisi!');
                  return;
                }

                if (isNaN(newYear)) {
                  alert('Tahun harus berupa angka.');
                  return;
                }

                const updatedBook = {
                  id: bookId,
                  title: newTitle,
                  author: newAuthor,
                  year: newYear,
                };

                editBook(bookId, updatedBook);
                editBookModal.hide();
              });
          }
        });
      });

    // Menambahkan event listener untuk tombol hapus
    this.shadowRoot
      .querySelectorAll('[data-testid="bookItemDeleteButton"]')
      .forEach((button) => {
        button.addEventListener('click', () => {
          if (confirm('Anda yakin ingin menghapus buku ini?')) {
            const bookId = +this.dataset.bookid;
            deleteBook(bookId);
          }
        });
      });
  }
}

customElements.define('book-item', BookItem);
