const Joi = require('joi');

function validateToDoUpsert(task) {
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
            .valid('low', 'medium', 'high')
    });
    return schemaToDoUpsert.validateAsync(task);
}

function validateToDoDelete(task) {
    const schemaToDoDelete = Joi.object({
        _id: Joi.allow(),
        name: Joi.string()
            .min(3)
            .max(30)
    });
    return schemaToDoDelete.validateAsync(task);
}

module.exports = {
    validateToDoUpsert,
    validateToDoDelete
}
