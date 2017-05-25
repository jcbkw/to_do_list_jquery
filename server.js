/* global __dirname */

var express     = require('express'),
    bodyParser  = require("body-parser"),
    entries     = require('./server/entries'),
    port        = (process.argv[2] && Number(process.argv[2])) || 3000,
    app         = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/entries', entries);
app.put('/entries', entries);
app.post('/entries', entries);
app.patch('/entries', entries);
app.delete('/entries', entries);

app.use('/', express.static(__dirname));

app.listen(port, function () {

    console.log('Server running at', 'http://localhost:' + port);
    console.log('Press Ctrl + C to stop');
    
});