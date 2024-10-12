const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(path.resolve("mydb.db") , (err) => {
    if(err)
    {
        console.log("Error Occurred - " + err.message);
    }
    else
    {
        console.log("DataBase Connected");
    }
})
// function query(sql, params) {
//   return db.prepare(sql).all(params);
// }

module.exports = db;