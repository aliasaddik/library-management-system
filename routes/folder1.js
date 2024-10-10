const express = require('express');
const router = express.Router();

// Define a route
/* GET quotes listing. */
router.get('/', function(req, res, next) {
    try {
      res.json(quotes.getMultiple(req.query.page));
    } catch(err) {
      console.error(`Error while getting quotes `, err.message);
      next(err);
    }
  });
router.get('/101', (req, res) => {
    res.send('this is product 101 route');// this gets executed when user visit http://localhost:3000/product/101
});

router.get('/102', (req, res) => {
    res.send('this is product 102 route');// this gets executed when user visit http://localhost:3000/product/102
});

// export the router module so that server.js file can use it
module.exports = router;