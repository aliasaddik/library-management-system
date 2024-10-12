const express = require('express');
const router = express.Router();
const service = require('../services/borrowing')
const { NotFoundError, WrongInputError, DBRetrievalError, BusinessValidationError} = require('../services/errors');


var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * @swagger
 * /borrowing/checkout:
 *   post:
 *     description: Allows a customer to checkout a book by providing user and book IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user checking out the book.
 *                 example: 2
 *               bookId:
 *                 type: integer
 *                 description: The ID of the book being checked out.
 *                 example: 3
 *     responses:
 *       201:
 *         description: Customer borrowed the book successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Customer Borrowed the book successfully"
 *       409:
 *         description: business validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the business cannot proceed with request.
 *                   example: "Not enough quantity"
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid input.
 *                   example: "Invalid input data"
 *       404:
 *         description: User or book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user or book was not found.
 *                   example: "User not found"
 *       500:
 *         description: Database retrieval error or other internal server errors.
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
router.post('/checkout', async(req, res) => {
    const {userId, bookId} = req.body;
    try {
      await service.checkout(userId, bookId);
      res.status(201).send({ message: 'Customer Borrowed the book successfully' });
    } catch (error) {
        switch (true) {
            case error instanceof BusinessValidationError:
                statusres =  res.status(409);
                break;
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
  }
);

/**
 * @swagger
 * /borrowing/return:
 *   put:
 *     description: Allows a customer to return a book by providing user and book IDs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user returning the book.
 *                 example: 2
 *               bookId:
 *                 type: integer
 *                 description: The ID of the book being returned.
 *                 example: 3
 *     responses:
 *       204:
 *         description: Customer returned the book successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Customer returned the book successfully"
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid input.
 *                   example: "Invalid input data"
 *       404:
 *         description: User or book not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user or book or the borrowing was not found.
 *                   example: "User not found"
 *       500:
 *         description: Database retrieval error or other internal server errors.
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
router.put('/return', async(req, res) => {
    const {userId, bookId} = req.body;

    try {
      await service.returnBook(userId, bookId);
      res.status(204).send({ message: 'Customer returned the book successfully' });
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
 * /borrowing/overdue:
 *   get:
 *     description: Retrieves all books that are overdue.
 *     responses:
 *       200:
 *         description: A list of overdue books.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overdue:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the book.
 *                         example: 1
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                         example: "Moby Dick"
 *                       author:
 *                         type: string
 *                         description: The author of the book.
 *                         example: "Herman Melville"
 *                       isbn:
 *                         type: string
 *                         description: The ISBN of the book.
 *                         example: "9781503280786"
 *                       available_qty:
 *                         type: integer
 *                         description: The quantity of the book available.
 *                         example: 0
 *                       shelf_location:
 *                         type: string
 *                         description: The shelf location of the book.
 *                         example: "E5"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the book was created.
 *                         example: "2024-10-11T19:11:03Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the book was last updated.
 *                         example: "2024-10-11T19:11:03Z"
 *       500:
 *         description: Database retrieval error or other internal server errors.
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
router.get('/overdue', async(req, res) => {
    try {
        books= await service.getAllOverDue();
        res.send({ overdue: books });
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
 * /borrowing/borrowed/{id}:
 *   get:
 *     description: Retrieves all books borrowed by a user specified by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose borrowed books are to be retrieved.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of books borrowed by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 borrowed:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the book.
 *                         example: 1
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                         example: "Moby Dick"
 *                       author:
 *                         type: string
 *                         description: The author of the book.
 *                         example: "Herman Melville"
 *                       isbn:
 *                         type: string
 *                         description: The ISBN of the book.
 *                         example: "9781503280786"
 *                       available_qty:
 *                         type: integer
 *                         description: The quantity of the book available.
 *                         example: 0
 *                       shelf_location:
 *                         type: string
 *                         description: The shelf location of the book.
 *                         example: "E5"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the book was created.
 *                         example: "2024-10-11T19:11:03Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: The timestamp when the book was last updated.
 *                         example: "2024-10-11T19:11:03Z"
 *       404:
 *         description: User not found or no borrowed books available for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user was not found.
 *                   example: "User not found"
 *       500:
 *         description: Database retrieval error or other internal server errors.
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
router.get('/borrowed/:id', async(req, res) => {
    try {
        books= await service.getAllBorrowedByUser(req.params.id);
        res.send({ borrowed: books });
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
        statusres.send({ error: error.message });      }
    });


module.exports = router;