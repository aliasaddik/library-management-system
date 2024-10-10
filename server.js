require('dotenv').config();
const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');

// Connecting Database
let db = new sqlite3.Database("mydb.db" , (err) => {
    if(err)
    {
        console.log("Error Occurred - " + err.message);
    }
    else
    {
        console.log("DataBase Connected");
    }
})

// Include route files
const folder1Route = require('./routes/folder1');
const folder2Route = require('./routes/folder2');

// Use routes
app.use('/folder1', folder1Route);
app.use('/folder2', folder2Route);

const port = process.env.PORT || 8002 ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});