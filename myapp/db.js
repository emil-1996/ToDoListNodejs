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

module.exports = {
    getDatabasesList: getDatabasesList
}