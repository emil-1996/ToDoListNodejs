const http = require('http');
const url = require('url');
const dbFunctions = require('./db.js');

const hostname = '0.0.0.0';
const port = process.env.PORT;

const task = {name: 'Bill', desc: 'Miotłaaa'};

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const lowerCaseUrl = req.url.toLowerCase();
    switch (lowerCaseUrl) {
        case '/add':
            dbFunctions.addTasksFunction(task);
            res.end('ADD\n');
            break;
        case '/update':
            res.end('UPDATE\n');
            break;
        case '/delete':
            res.end('DELETE\n');
            break;
        case '/list':
            dbFunctions.getDatabasesList();
            res.end('getDatabasesList\n');
            break;
        default:
            res.end('Hello World\n');
            break;
    }
});

server.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`Server running at http://${hostname}:${port}/`);
});

