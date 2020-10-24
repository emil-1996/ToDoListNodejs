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

function getRequestedData(req) {
    return new Promise((resolve, reject) => {
        let buffer = '';
        req.on('data', chunk => buffer += chunk.toString('utf-8'));
        req.on('end', () => {
            try {
                if (IsJsonString(buffer)) {
                    resolve(JSON.parse(buffer));
                } else {
                    reject("Invalid json");
                }
            } catch (parseError) {
                reject(parseError);
            }
        })
    });
}

async function insertData(req, res) {
    try {
        let requestData = await getRequestedData(req);
        let result = await dbFunctions.todo.addTask(requestData);
        res.end(result);
    } catch (Error) {
        res.end(JSON.stringify({ error: Error }));
        console.log(Error);
    }
}

async function deleteData(req, res) {
    try {
        let requestData = await getRequestedData(req);
        let result = await dbFunctions.todo.deleteTask(requestData);
        res.end(result);
    } catch (Error) {
        res.end(JSON.stringify({ error: Error }));
        console.log(Error);
    }
}

async function updateData(req, res) {
    try {
    let requestData = await getRequestedData(req);
    let result = await dbFunctions.todo.updateTask(requestData);
    res.end(result);
    } catch (Error) {
        res.end(JSON.stringify({ error: Error }));
        console.log(Error);
    }
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const lowerCaseUrl = req.url.toLowerCase();
    switch (lowerCaseUrl) {
        case '/add':
            insertData(req, res);
            break;
        case '/update':
            updateData(req, res);
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
            res.end(JSON.stringify({ error: `Incorrect method` }));
            break;
    }
});

server.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`Server running at http://${hostname}:${port}/`);
});

