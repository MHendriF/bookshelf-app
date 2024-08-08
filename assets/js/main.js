import { addBook, searchBooks, deleteAllBooks, renderBooks } from './book.js';

document.getElementById('bookForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value, 10);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (!title || !author || !year) {
    alert('Field title, author, dan year harus diisi!');
    return;
  }

  if (isNaN(year)) {
    alert('Tahun harus berupa angka.');
    return;
  }

  addBook({ title, author, year, isComplete });
  event.target.reset();
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
