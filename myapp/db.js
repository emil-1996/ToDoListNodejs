const {MongoClient} = require('mongodb');
const login = 'root';
const pass = 'mongodb';
const mongoUrl = `mongodb://${login}:${pass}@mongodb_container:27017/`;

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}


async function call(method, additionalParams = false) {
    try {
        const options = {useUnifiedTopology: true};
        const client = await MongoClient.connect(mongoUrl, options);
        if (additionalParams) {
            await method(client, additionalParams);
        } else {
            await method(client);
        }
        await client.close();
    } catch (e) {
        console.error(e);
}
}

async function getDatabasesList() {
    await call(listDatabases);
}

async function addTasksFunction(client, task) {
    const db = client.db("todo");
    db.collection('todo', function (err, collection) {
        collection.insertOne(task);
        db.collection('todo').countDocuments(function (err, count) {
            console.log('Total Rows: ' + count);
        });
    });
}

function validateSchemaTask(task) {
    return call(addTasksFunction, task);
}


async function adTask() {
    await call(addTasksFunction);
}

module.exports = {
    getDatabasesList: getDatabasesList,
    adTask: adTask,
    validateSchemaTask: validateSchemaTask
}