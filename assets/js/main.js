// main.js

import {
  addBook,
  editBook,
  deleteBook,
  searchBooks,
  deleteAllBooks,
  renderBooks,
} from './book.js';

document.getElementById('bookForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (!title || !author || !year) {
    alert('Semua field harus diisi.');
    return;
  }

  if (isNaN(year)) {
    alert('Tahun harus berupa angka.');
    return;
  }

  addBook(title, author, year, isComplete);
  event.target.reset(); // Reset form setelah submit
});

document.getElementById('searchBook').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('searchBookTitle').value;
  searchBooks(query);
});

document
  .getElementById('deleteAllBooks')
  .addEventListener('click', deleteAllBooks);

document.addEventListener('DOMContentLoaded', () => {
  renderBooks();
});

document.body.addEventListener('click', (event) => {
  if (event.target.matches('[data-testid="bookItemEditButton"]')) {
    const bookId = +event.target.closest('[data-bookid]').dataset.bookid;
    const book = books.find((b) => b.id === bookId);

    if (book) {
      document.getElementById('editBookTitle').value = book.title;
      document.getElementById('editBookAuthor').value = book.author;
      document.getElementById('editBookYear').value = book.year;

      const editBookModal = new bootstrap.Modal(
        document.getElementById('editBookModal')
      );
      editBookModal.show();

      document.getElementById('saveEditBook').addEventListener('click', () => {
        const newTitle = document.getElementById('editBookTitle').value;
        const newAuthor = document.getElementById('editBookAuthor').value;
        const newYear = document.getElementById('editBookYear').value;

        if (newTitle && newAuthor && newYear) {
          editBook(bookId, newTitle, newAuthor, newYear);
          editBookModal.hide();
        }
      });
    }
  } else if (event.target.matches('[data-testid="bookItemDeleteButton"]')) {
    const bookId = +event.target.closest('[data-bookid]').dataset.bookid;
    deleteBook(bookId);
  }
});

