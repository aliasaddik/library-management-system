const db = require('./connection');
const { DBRetrievalError } = require('../services/errors');



function addBorrowing(userId, bookId, dueDate) {
  return new Promise((resolve, reject) => {
      db.run('INSERT INTO borrowing (user_id, book_id, due_date) VALUES (?, ?, ?)', userId, bookId, dueDate, (err) => {
          if(err){
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

          }
          else
                resolve();
      });
  })
}

function getBorrowingByBookAndUser(userId, bookId){
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM borrowing where returned = 0 AND user_id =(?) AND book_id=(?)',userId, bookId, (err, rows) => {
            if(err)
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

            else
                resolve(rows);
        });
    });
  }


function returnBorrowing(userId, bookId) {
  return new Promise((resolve, reject) => {
      db.run('UPDATE borrowing SET returned = 1 where user_id = (?) AND book_id = (?) ',userId, bookId, (err) => {
          if(err)
          reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

          else
            resolve();
      });
  });
}




module.exports = {
  addBorrowing,
  getBorrowingByBookAndUser,
  returnBorrowing
  
}