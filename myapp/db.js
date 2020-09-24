const { MongoClient } = require('mongodb');
const validator = require('./validator.js');

class ObjectCollection {
    constructor(objectConfig) {
        this.login = 'root';
        this.pass = 'mongodb';
        this.mongoUrl = `mongodb://${this.login}:${this.pass}@mongodb_container:27017/`;
        this.collection = objectConfig.collectionName;
        this.dbName = objectConfig.dbName;
        this.configOptions = { useUnifiedTopology: true };

        MongoClient.connect(this.mongoUrl, this.configOptions)
            .then(db => this.client = db)
            .catch(err => console.log(err));
    }

    async getDatabasesList() {
        const databasesList = await this.client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    }

    async getTask() {
        const todoCollection = this.client.db(this.dbName).collection(this.collection);
        const cursor = todoCollection.find({});

        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        await cursor.forEach(element => console.log(element));
    }

    async addTasksFunctionToDb(task) {
        const todoCollection = this.client.db(this.dbName).collection(this.collection);
        todoCollection.insertOne(task)
            .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
            .catch(err => console.error(`Failed to insert item: ${err}`))
    }

    async addTasksFunction(task) {
        try {
            await validator.validateSchemaToDoInsert(task)
            await this.addTasksFunctionToDb(task);
        } catch (err) {
            console.error(err.message);
        }
    }
}

const configTodo = { collectionName: "todo", dbName: "todo" };
const todo = new ObjectCollection(configTodo);

module.exports = {
    todo: todo,
}