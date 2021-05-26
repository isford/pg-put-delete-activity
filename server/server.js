const express = require('express');
const bodyParser = require('body-parser');
const booksRouter = require('./routes/book.router.js');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use('/books', booksRouter);

// Serve back static files by default
app.use(express.static('server/public'))

app.get('/books', (req, res) => {
    // retrieve all songs from the DB
    const queryText = `SELECT * FROM "books";`

    //send query to DB
    // promise
     pool.query(queryText)
    .then( (result) => {
        console.log(result.rows);
        res.send(result.rows);
    }).catch( (err) => {
        console.log(err);
        res.sendStatus(500);
    })
    //res.send(artistList);
});

app.post('/books', (req, res) => {
    // musicLibrary.push(req.body);

    console.log('req.body', req.body)
    // QUERY SANITIZED
    let queryText = `INSERT INTO "books" ("title", "author", "published", "isRead")
    VALUES ($1, $2, $3, $4);`

    let values = [req.body.title, req.body.author, req.body.published, req.body.isRead]
    
    pool.query(queryText, values)
    .then( (result) => {
        //only 100% sure that the query is done
        res.sendStatus(201);

    }).catch( err => {
        console.log(err);
        res.sendStatus(500);
    })

});




// Start listening for requests on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('listening on port', PORT);
});
