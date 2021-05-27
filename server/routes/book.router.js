const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id', (req, res) => {
    const bookId = req.params.id;

    // Change the rank of the song by the user ...
    // expected values = 'up' OR 'down';
    let readIt = req.body.readIt;

    let queryString = '';

    if (readIt === false) {
        queryString = 'UPDATE "books" SET "isRead"=NOT "isRead" WHERE "books".id = $1;';
    } else if(readIt === true) {
        queryString = 'UPDATE "books" SET "isRead"=NOT "isRead" WHERE "books".id = $1;';
    } else {
        res.sendStatus(500);
        return; // early exit since it's an error!
    }

    pool.query(queryString, [bookId])
        .then(response => {
            console.log(response.rowCount);
            res.sendStatus(202);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
})

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/:id', (req, res) => {
  const itemToDelete = req.params.id;
  const queryString = `DELETE FROM "books" WHERE "books".id = $1;`;
   pool.query (queryString,[itemToDelete])       
        .then((response) => {
            console.log(`We deleted book with ID ${itemToDelete}`);
            res.sendStatus(200)
        })
        .catch (err => {
            console.log('You messed up', err);
            res.sendStatus(500);
        });   
})

module.exports = router;
