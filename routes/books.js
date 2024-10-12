const express = require('express');
const router = express.Router();
const service = require('../services/books')
const { NotFoundError, WrongInputError, DBRetrievalError} = require('../services/errors');


var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * @swagger
 * /books:
 *   get:
 *     description: Gets and filters all the books in the system by ISBN, title, and author.
 *     parameters:
 *      - in: query
 *        name: title
 *        type: string
 *        description: The title of the book to filter by.
 *      - in: query
 *        name: author
 *        type: string
 *        description: The author of the book to filter by.
 *      - in: query
 *        name: isbn
 *        type: string
 *        description: The ISBN of the book to filter by.
 *     responses:
 *       200:
 *         description: Returns the filtered books.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The book ID.
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                       author:
 *                         type: string
 *                         description: The author of the book.
 *                       isbn:
 *                         type: string
 *                         description: The ISBN of the book.
 *                       available_qty:
 *                         type: integer
 *                         description: The available quantity of the book.
 *                       shelf_location:
 *                         type: string
 *                         description: The shelf location of the book.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the book entry was created.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the book entry was last updated.
 *       500:
 *         description: Something went wrong.
 */


router.get('/', async(req, res) => {
  const isbn = req.query.isbn || "";
  const title = req.query.title || "";
  const author = req.query.author || "";
    try {
        const allBooks = await service.getAllBooks(isbn, title, author);
        res.send({ books: allBooks });
      } catch (error) {
        switch (true) {
        case error instanceof DBRetrievalError:
          statusres =  res.status(500);
          break;
        default: statusres =  res.status(500);
      }
      statusres.send({ error: error.message });
      }
      
});

/**
 * @swagger
 * /books:
 *   post:
 *     description: Adds a new book to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *                 example: "Thinking Fast and Slow"
 *               author:
 *                 type: string
 *                 description: The author of the book.
 *                 example: "Daniel Kahneman"
 *               isbn:
 *                 type: string
 *                 description: The ISBN number of the book.
 *                 example: "1234567890123"
 *               availableQty:
 *                 type: integer
 *                 description: The available quantity of the book.
 *                 example: 13
 *               shelfLocation:
 *                 type: string
 *                 description: The shelf location of the book.
 *                 example: "2D"
 *     responses:
 *       201:
 *         description: Book added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Book Added Successfully"
 *       400:
 *         description: Wrong input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating wrong input.
 *                   example: "Invalid input data"
 *       500:
 *         description: Database retrieval error or other internal errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating a server error.
 *                   example: "Database error occurred"
 */

router.post('/', async(req, res) => {
  const { title, author, isbn, availableQty, shelfLocation} = req.body;

  try {
    await service.addBook(title, author, isbn, availableQty, shelfLocation);
    res.status(201).send({ message: 'Book Added Successfully' });
  } catch (error) {
    switch (true) {
      case error instanceof WrongInputError:
        statusres =  res.status(400);
        break;
      case error instanceof DBRetrievalError:
        statusres =  res.status(500);
        break;
      default: statusres =  res.status(500);
    }
    statusres.send({ error: error.message });
  }
}
);


/**
 * @swagger
 * /books/{id}:
 *   put:
 *     description: Updates an existing book in the system.
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the book to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book.
 *                 example: "Thinking Fast and Slow"
 *               author:
 *                 type: string
 *                 description: The author of the book.
 *                 example: "Daniel Kahneman"
 *               isbn:
 *                 type: string
 *                 description: The ISBN number of the book.
 *                 example: "1234567890123"
 *               availableQty:
 *                 type: integer
 *                 description: The available quantity of the book.
 *                 example: 13
 *               shelfLocation:
 *                 type: string
 *                 description: The shelf location of the book.
 *                 example: "2D"
 *     responses:
 *       204:
 *         description: Book updated successfully. No content is returned.
 *       400:
 *         description: Wrong input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating wrong input.
 *                   example: "Invalid input data"
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the book was not found.
 *                   example: "Book not found"
 *       500:
 *         description: Database retrieval error or other internal errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating a server error.
 *                   example: "Database error occurred"
 */

router.put('/:id', async(req, res) => {
  const { title, author, isbn, availableQty, shelfLocation} = req.body;

    try {
      await service.updateBook(req.params.id, title, author, isbn, availableQty, shelfLocation);
      res.status(204).send({ message: 'book updated successfully' });
    } catch (error) {
      switch (true) {
        case error instanceof NotFoundError:
          statusres =  res.status(404);
          break;
        case error instanceof WrongInputError:
          statusres =  res.status(400);
          break;
        case error instanceof DBRetrievalError:
          statusres =  res.status(500);
          break;
        default: statusres =  res.status(500);
      }
      statusres.send({ error: error.message });
    }
  });

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     description: Deletes a book from the system by ID.
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: The ID of the book to delete.
 *     responses:
 *       204:
 *         description: Book deleted successfully. No content is returned.
 *       400:
 *         description: Wrong input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating wrong input.
 *                   example: "Invalid input data"
 *       404:
 *         description: Book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the book was not found.
 *                   example: "Book not found"
 *       500:
 *         description: Database retrieval error or other internal errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating a server error.
 *                   example: "Database error occurred"
 */

router.delete('/:id',async function (req, res) {
  try {
    await service.deleteBook(req.params.id);
    res.status(204).send({ message: 'book deleted successfully' });
  } catch (error) {
    switch (true) {
      case error instanceof NotFoundError:
        statusres =  res.status(404);
        break;
      case error instanceof WrongInputError:
        statusres =  res.status(400);
        break;
      case error instanceof DBRetrievalError:
        statusres =  res.status(500);
        break;
      default: statusres =  res.status(500);
    }
    statusres.send({ error: error.message });
  }
});

module.exports = router;