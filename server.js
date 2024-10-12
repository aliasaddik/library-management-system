require('dotenv').config();
const express = require('express');
const app = express();
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');



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
const books = require('./routes/books');
const borrowing = require('./routes/borrowing');
const users = require('./routes/users');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Use routes
app.use('/books', books);
app.use('/borrowing', borrowing);
app.use('/users', users);




const port = process.env.PORT || 8002 ;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});