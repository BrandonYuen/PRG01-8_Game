require('module-alias/register')

// Options
const port = process.env.port || 80;

// Dependencies
const express = require('express')
	path = require('path');
	bodyParser = require('body-parser');

// Express App
const app = express();

// support json encoded bodies
app.use(bodyParser.json());

// support (other) encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// static directory for client files
app.use('/', express.static(path.join(__dirname, './docs')));

// Initialize front-end (one pager) routes
app.use('*', function (req, res, next) {
	res.sendFile('docs/index.html', { root: '.' });
});

//Listen for requests
app.listen(port, function(){
	console.log("Now listening for requests. ("+port+")");
});
