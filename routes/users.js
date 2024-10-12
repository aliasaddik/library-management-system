const express = require('express');
const router = express.Router();
const service = require('../services/users')
const { NotFoundError, WrongInputError, DBRetrievalError} = require('../services/errors');


var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


/**
 * @swagger
 * /users:
 *   get:
 *     description: Retrieves all users from the system.
 *     responses:
 *       200:
 *         description: A list of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user's ID.
 *                         example: 2
 *                       first_name:
 *                         type: string
 *                         description: The user's first name.
 *                         example: "Alia"
 *                       last_name:
 *                         type: string
 *                         description: The user's last name.
 *                         example: "Saddik"
 *                       email:
 *                         type: string
 *                         description: The user's email address.
 *                         example: "alia.a.saddik@gmail.com"
 *                       registered_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the user registered.
 *                         example: "2024-10-11 11:18:24"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: When the user's information was last updated.
 *                         example: "2024-10-11 11:18:24"
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
router.get('/',async function(req, res) {

  try {
    const allUsers = await service.getAllUsers();
    res.send({ users: allUsers });
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
 * /users:
 *   post:
 *     description: Adds a new user to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: "Alia"
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: "Saddik"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "alia.a.saddik@gmail.com"
 *     responses:
 *       201:
 *         description: User added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "User added successfully"
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
router.post('/', async function (req, res) {
  const { firstName, lastName, email } = req.body;

    try {
      await service.addUser(firstName, lastName, email);
      res.status(201).send({ message: 'User added successfully' });
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
      statusres.send({ error: error.message });    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     description: Updates an existing user's information in the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: "Sherif"
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: "Gabr"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "sherif.gabr@gmail.com"
 *     responses:
 *       204:
 *         description: User updated successfully. No content is returned.
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
 *         description: User not found.
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
router.put('/:id', async function (req, res) {
  const { firstName, lastName, email } = req.body;

    try {
      await service.updateUser(req.params.id,firstName, lastName, email);
      res.status(204).send({ message: 'User updated successfully' });
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
 * /users/{id}:
 *   delete:
 *     description: Deletes a user from the system by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete.
 *     responses:
 *       204:
 *         description: User deleted successfully. No content is returned.
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
 *         description: User not found.
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
router.delete('/:id',async function (req, res) {
  try {
    await service.deleteUser(req.params.id);
    res.status(204).send({ message: 'User deleted successfully' });
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