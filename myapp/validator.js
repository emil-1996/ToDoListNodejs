const Joi = require('joi');

async function validateToDoUpsert(task) {

    const schemaToDoUpsert = Joi.object({
        _id: Joi.allow(),
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),

        desc: Joi.string()
            .min(15)
            .max(500)
            .required(),

        priority: Joi.string()
            .valid('low', 'medium', 'high'),
    });

    try {
        return schemaToDoUpsert.validateAsync(task);
    } catch (err) {
        throw err;
    }
}

async function validateToDoDelete(task) {

    const schemaToDoDelete = Joi.object({
        _id: Joi.allow(),
        name: Joi.string()
            .min(3)
            .max(30),
    });

    try {
        return schemaToDoDelete.validateAsync(task);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    validateToDoUpsert,
    validateToDoDelete,
}