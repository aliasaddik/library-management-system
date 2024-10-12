const db = require('./connection');
const { DBRetrievalError } = require('../services/errors');


function getAll(isbn, title, author) {
  return new Promise((resolve, reject) => {
      db.all('SELECT * FROM book where 1=1 and isbn LIKE (?) and title LIKE (?) and author LIKE (?)', `%${isbn}%`, `%${title}%`, `%${author}%`,  (err, rows) => {
          if(err)
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
          else
            resolve(rows);
      });
  });
}

function getBorrowedByUser(userId) {
    return new Promise((resolve, reject) => {
        db.all('SELECT book.* FROM book INNER JOIN borrowing on book.id = borrowing.book_id WHERE borrowing.returned = 0 and borrowing.user_id = (?)',userId ,  (err, rows) => {
            if(err)
                reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
            else
                resolve(rows);
        });
    });
  }

  function getOverDue() {
    return new Promise((resolve, reject) => {
        db.all('SELECT book.* FROM book  INNER JOIN borrowing  on book.id = borrowing.book_id WHERE borrowing.returned = 0  AND  borrowing.due_date < DATETIME(\'now\');',  (err, rows) => {
            if(err)
                reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
            else
                resolve(rows);
        });
    });
  }
function addBook(title, author, isbn, availableQty, shelfLocation) {
  return new Promise((resolve, reject) => {
      db.run('INSERT INTO book (title, author, isbn, available_qty, shelf_location) VALUES (?, ?, ?, ?, ?)', title, author, isbn, availableQty, shelfLocation, (err) => {
          if(err){
                reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
          }
          else
                resolve();
      });
  })
}

function updateBook(id, title, author, isbn, availableQty, shelfLocation) {
  return new Promise((resolve, reject) => {
      db.run('UPDATE book SET title = (?), author= (?),isbn =(?), available_qty =(?), shelf_location=(?) where id = (?)', [title, author, isbn, availableQty, shelfLocation, id], (err) => {
          if(err)
                reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
          else
                resolve();
      });
  });
}

function changeQty(id,qty) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE book SET  available_qty = (select available_qty from book where id = (?) )+(?) where id = (?)', id, qty,id, (err) => {
            if(err)
                reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
            else
                resolve();
        });
    });
  }


function getBook(id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM book where id=(?)',id, (err, rows) => {
        if(err)
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

        else
            resolve(rows);
    });
});

}

function deleteBook(id) {
  return new Promise((resolve, reject) => {
      db.run('DELETE FROM book WHERE id = (?)', id, (err) => {
          if(err)
                reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
          else
                resolve();
      });
  });
}

function getQuantity(id) {
    return new Promise((resolve, reject) => {
        db.run('SELECT book.available_qty from book where id =(?)', id, (err) => {
            if(err)
                  reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
            else
                  resolve();
        });
    });
  }

module.exports = {
  getAll,
  addBook,
  updateBook,
  changeQty,
  getBook,
  deleteBook,
  getOverDue,
  getBorrowedByUser,
  getQuantity
  
}