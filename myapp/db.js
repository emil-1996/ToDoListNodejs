const { MongoClient, ObjectId } = require('mongodb');
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
            return JSON.stringify({ message: "No documents found!" });
        }

        let result = [];
        await cursor.forEach(element => result.push(element));
        return JSON.stringify(result);
    }

    async addTask(task) {
        try {
            await validator.validateToDoUpsert(task);
            const todoCollection = this.client.db(this.dbName).collection(this.collection);
            const result = await todoCollection.insertOne(task);
            return JSON.stringify({ message: `Successfully inserted item with _id: ${result.insertedId}` });
        } catch (err) {
            throw JSON.stringify({ error: `Failed to insert item: ${err}` });
        }
    }

    async updateTask(task) {
        try {
            //await validator.validateToDoUpsert(task);
            const todoCollection = this.client.db(this.dbName).collection(this.collection);
            if (!task._id) {
                throw new Error("Object task doesn't have '_id' property");
            }
            const query = { "_id": ObjectId(task._id) };
            const options = { "upsert": false };
            let updateObject = {};
            for (const [key, value] of Object.entries(task)) {
                if (key === '_id') {
                    continue;
                }
                updateObject[key] = value;
            }
            const update = { $set: updateObject };
            const result = await todoCollection.updateOne(query, update, options);
            console.log(result);
            if (result.matchedCount || result.upsertedId) {
                return JSON.stringify({ message: { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, upsertedId: result.upsertedId, upsertedCount: result.upsertedCount } });
            }
        } catch (err) {
            throw JSON.stringify({ error: err.message });
        }
    }

    async deleteTask(query) {
        try {
            await validator.validateToDoDelete(query);
            const todoCollection = this.client.db(this.dbName).collection(this.collection);
            let result = {};
            if (query._id) {
                result = await todoCollection.deleteOne({ "_id": ObjectId(query._id) });
            } else {
                result = await todoCollection.deleteOne(query)
            }
            return JSON.stringify({ message: `Deleted ${result.deletedCount} item.` });
        } catch (err) {
            throw JSON.stringify({ error: `Delete failed with error: ${err}` });
        }
    }
}

const configTodo = { collectionName: "todo", dbName: "todo" };
const todo = new ObjectCollection(configTodo);

module.exports = {
    todo,
}