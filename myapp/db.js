const {MongoClient} = require('mongodb');
const login = 'root';
const pass = 'mongodb';
const mongoUrl = `mongodb://${login}:${pass}@mongodb_container:27017/`;

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}


async function call(method) {
    try {
        const options = {useUnifiedTopology: true};
        const client = await MongoClient.connect(mongoUrl, options);
        await method(client);
        await client.close();
    } catch (e) {
        console.error(e);
    }
}

async function getDatabasesList() {
    await call(listDatabases);
}

async function addTasksFunction(client) {
    client.db.collection('tasks', function (err, collection) {
        collection.insert({id: 1, firstName: 'Steve', lastName: 'Jobs'});
        collection.insert({id: 2, firstName: 'Bill', lastName: 'Gates'});
        collection.insert({id: 3, firstName: 'James', lastName: 'Bond'});
        client.db.collection('tasks').count(function (err, count) {
            if (err)
                throw err;

            console.log('Total Rows: ' + count);
        });
    });
}

async function adTask() {
    await call(addTasksFunction);
}

module.exports = {
    getDatabasesList: getDatabasesList,
    adTask: adTask
}