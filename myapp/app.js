const http = require('http');
const url = require('url');
const dbFunctions = require('./models/db.js');
const pug = require('pug');
const fs = require('fs');

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

const compiledFunction = pug.compileFile('views/pug/index.pug');

function getDataFromFileSync(path){
    const contents = fs.readFileSync(path).toString();
    return contents;
}

const jsScripts = getDataFromFileSync('views/js/main.js');
const cssStyle = getDataFromFileSync('views/css/main.css');
const trashIcon = getDataFromFileSync('views/images/trash.svg');

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

async function getRespondData(req, res, callback) {
    try {
        let requestData = await getRequestedData(req);
        let callbackFunction = callback.bind(dbFunctions.todo);
        let result = await callbackFunction(requestData);
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
            getRespondData(req, res, dbFunctions.todo.addTask);
            break;
        case '/update':
            getRespondData(req, res, dbFunctions.todo.updateTask);
            break;
        case '/delete':
            getRespondData(req, res, dbFunctions.todo.deleteTask);
            break;
        case '/get':
            dbFunctions.todo.getTask()
                .then(result => res.end(result))
                .catch(err => res.end(err))
            break;
        case '/views/js/main.js':
            res.setHeader('Content-Type', 'text/javascript; charset=UTF-8');
            res.end(jsScripts);
            break;
        case '/views/css/main.css':
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
            res.end(cssStyle);
            break;
        case '/views/images/trash.svg':
            res.setHeader('Content-Type', 'image/svg+xml; charset=UTF-8');
            res.end(trashIcon);
            break;    
        default:
            res.setHeader('Content-Type', 'text/html; charset=UTF-8');
            res.end(compiledFunction({ name: "Czy chcesz dodać zadanie?" }));
            break;
    }
});

server.listen(port, hostname, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`Server running at http://${hostname}:${port}/`);
});

