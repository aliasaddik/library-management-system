require('dotenv').config();
const bookModel = require('../models/books');
const userModel = require('../models/users');
const model = require('../models/borrowing');
const helpers = require ('./helpers')
const { NotFoundError, WrongInputError, BusinessValidationError} = require('./errors');

async function checkout(userId, bookId) {
    if (!userId || !bookId) {
        throw new WrongInputError('User and book IDs are required.');
    }

  
    // Fetch the book and user details
    const book = await bookModel.getBook(bookId);
    const user = await userModel.getUser(userId);
    const borrowing = await model.getBorrowingByBookAndUser(userId, bookId);
    
    // Set up due date
    const daysToAdd = parseInt(process.env.DAYS_TO_ADD, 10) || 15;
    const currentDate = new Date();
    const dueDate = helpers.formatDate(new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000));

    // Check if the book or user exists
    if (!book || book.length === 0) { // Check for book existence
        throw new NotFoundError('Book does not exist.');
    }
    if (!user || user.length === 0) { // Check for user existence
        throw new NotFoundError('User does not exist.');
    }
    if (borrowing.length !== 0) { // Check if the book is already borrowed
        throw new WrongInputError('Book is already borrowed by user.');
    }
    // check if available qty greater than 0
    if (book.available_qty<=0)
        throw new BusinessValidationError('No available quantity of this book');


    await model.addBorrowing(userId, bookId, dueDate);  
    await bookModel.changeQty(bookId, -1);

}


async function returnBook(userId, bookId) {
    if (!userId || !bookId) {
        throw new WrongInputError('user and book ids are required' );
    }
   
    const book = await bookModel.getBook(bookId);
    const user = await userModel.getUser(userId);
    const borrowing = await model.getBorrowingByBookAndUser(userId,bookId);

    // Check if the book or user exists
    if (!book || book.length === 0) { // Check for book existence
        throw new NotFoundError('Book does not exist.');
    }
    if (!user || user.length === 0) { // Check for user existence
        throw new NotFoundError('User does not exist.');
    }
    if ( borrowing.length === 0) {
        throw new WrongInputError('book is not currently borrowed by user');
    }

    await model.returnBorrowing(userId, bookId );
    await bookModel.changeQty(bookId,1);


    
  }
 


async function getAllBorrowedByUser(userId) {

   
    const user = await userModel.getUser(userId);

    if (user.length === 0) {
        throw new NotFoundError('User not found');
    }
    return bookModel.getBorrowedByUser(userId);
   
}

function getAllOverDue() {
    return bookModel.getOverDue();
}

   

  module.exports = {
    checkout,
    returnBook,
    getAllBorrowedByUser,
    getAllOverDue
  }