const { MongoClient } = require('mongodb');
const login = 'root';
const pass = 'mongodb';
const mongoUrl = `mongodb://${login}:${pass}@mongodb_container:27017/`;
const validator = require('./validator.js');

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}


async function call(method, additionalParams = false) {
    try {
        const options = { useUnifiedTopology: true };
        const client = await MongoClient.connect(mongoUrl, options);
        if (additionalParams) {
            await method(client, additionalParams);
        } else {
            await method(client);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function getDatabasesList() {
    await call(listDatabases);
}

async function addTasksFunctionToDb(client, task) {
    const todoCollection = client.db("todo").collection("todo");
    todoCollection.insertOne(task)
        .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
        .catch(err => console.error(`Failed to insert item: ${err}`))
}

async function validateSchemaTask(task) {

    validator.validateSchemaToDoInsert(task)
        .then(result => console.log(result))
        .catch(err => console.log(err));
}

async function addTasksFunction(task) {
    try {
        const correctlySchema = validateSchemaTask(task);
        await call(addTasksFunctionToDb, task);
    } catch (err) {
        console.error(err.message);
    }
}

async function adTask() {
    await call(addTasksFunction);
}

module.exports = {
    getDatabasesList: getDatabasesList,
    addTasksFunction: addTasksFunction,
}