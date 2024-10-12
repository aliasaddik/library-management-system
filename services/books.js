const model = require('../models/books');
const { NotFoundError, WrongInputError} = require('./errors');

function getAllBooks(isbn, title, author) {
   return model.getAll(isbn, title, author)
  }
  
function addBook(title, author, isbn, availableQty, shelfLocation) {
   try {
    
    if (!title || !author || !isbn || !availableQty || !shelfLocation) {
        throw new WrongInputError('All fields are required' );
    }
     
    if (!(isbn.length === 10 || isbn.length === 13) || !/^\d+$/.test(isbn)) {
        throw new WrongInputError('ISBN must be 10 or 13 digits and contain only numbers.');
    }

    return model.addBook(title, author, isbn, availableQty, shelfLocation);
}catch(error){
    throw error;
}
}


async function updateBook(id, title, author, isbn, availableQty, shelfLocation) {

    const book = await model.getBook(id);

    if ( book.length === 0) {
        throw new NotFoundError('Book not found');
    }

    if (!title || !author || !isbn || !availableQty || !shelfLocation) {
        throw new WrongInputError('All fields are required' );
    }
     
    if (!(isbn.length === 10 || isbn.length === 13) || !/^\d+$/.test(isbn)) {
        throw new WrongInputError('ISBN must be 10 or 13 digits and contain only numbers.');
    }
    return model.updateBook(id, title, author, isbn, availableQty, shelfLocation);
}  

async function deleteBook(id) {

    const book = await model.getBook(id);

    if ( book.length === 0) {
        throw new NotFoundError('Book not found');
    }

    return await model.deleteBook(id);
   
}

   

  module.exports = {
    getAllBooks,
    addBook, 
    updateBook,
    deleteBook
  }