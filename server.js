const express = require('express');
const { engine } = require('express-handlebars');
const app = express();

// mySQL server connection
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Erospass42.",
  database: "movies"
});

app.use(express.static('public'));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/api/data', (req, res) => {
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM actorcomplex", function (err, result, fields) {
          if (err) throw err;
          faszom = result
          console.log(faszom)
          return res.json(faszom)
        });
    });
});

app.listen(3000);