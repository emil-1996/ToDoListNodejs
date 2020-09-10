const {MongoClient} = require('mongodb');
const login = 'root';
const pass = 'mongodb';
const mongoUrl = `mongodb://${login}:${pass}@mongodb_container:27017/`;

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function getDatabasesList() {
    try {
        const options = {useUnifiedTopology: true};
        const client = await MongoClient.connect(mongoUrl, options);
        await listDatabases(client);
        await client.close();
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    getDatabasesList: getDatabasesList
}