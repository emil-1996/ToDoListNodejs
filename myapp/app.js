const http = require('http');
const url = require('url');
const dbFunctions = require('./db.js');

const hostname = '0.0.0.0';
const port = process.env.PORT;

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function insertData(req, res) {
    let buffer = '';
    req.on('data', chunk => buffer += chunk.toString('utf-8'));
    req.on('end', () => {
        if (IsJsonString(buffer)) {
            dbFunctions.todo.addTaskFunction(JSON.parse(buffer))
                .then(result => res.end(result))
                .catch(err => res.end(err))
        } else {
            res.end(JSON.stringify({ error: `Invalid json` }));
        }
    });
}

function deleteData(req, res) {
    let buffer = '';
    req.on('data', chunk => buffer += chunk.toString('utf-8'));
    req.on('end', () => {
        if (IsJsonString(buffer)) {
            dbFunctions.todo.deleteTask(JSON.parse(buffer))
                .then(result => res.end(result))
                .catch(err => res.end(err))
        } else {
            res.end(JSON.stringify({ error: `Invalid json` }));
        }
    });
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    const lowerCaseUrl = req.url.toLowerCase();
    switch (lowerCaseUrl) {
        case '/add':
            insertData(req, res);
            break;
        case '/update':
            //incomingData(req, res);
            res.end('UPDATE\n');
            break;
        case '/delete':
            deleteData(req, res);
            break;
        case '/get':
            dbFunctions.todo.getTask()
                .then(result => res.end(result))
                .catch(err => res.end(err))
            break;
        case '/list':
            dbFunctions.todo.getDatabasesList();
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

