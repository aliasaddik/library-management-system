const db = require('./connection');
const { DBRetrievalError } = require('../services/errors');


function getAll() {
  return new Promise((resolve, reject) => {
      db.all('SELECT * FROM user', (err, rows) => {
          if(err)
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

          else
            resolve(rows);
      });
  });
}

function addUser(firstName, lastName, email) {
  return new Promise((resolve, reject) => {
      db.run('INSERT INTO user (first_name, last_name, email) VALUES (?, ?, ?)', firstName, lastName, email, (err) => {
          if(err){
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

          }
          else
            resolve();
      });
  })
}

function updateUser(id, firstName, lastName, email) {
  return new Promise((resolve, reject) => {
      db.run('UPDATE user SET first_name = (?), last_name = (?), email =(?) where id = (?)', [firstName, lastName, email, id], (err) => {
          if(err)
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

          else
            resolve();
      });
  });
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM user where id=(?)',id, (err, rows) => {
        if(err)
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));
        else
            resolve(rows);
    });
});

}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
      db.run('DELETE FROM user WHERE id = (?)', id, (err) => {
          if(err)
            reject(new  DBRetrievalError("Error retrieving data from the database:: "+err.message));

          else
            resolve();
      });
  });
}

module.exports = {
  getAll,
  addUser,
  updateUser,
  getUser,
  deleteUser
  
}