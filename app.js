const express = require('express');
const path = require('path');
const app = express();
// set the path of view location
app.set('views', path.join(__dirname, '/views'));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index');
})

app.listen(3000);
console.log("Server is listening on port 3000.");