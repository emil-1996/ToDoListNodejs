const Joi = require('joi');

async function validateSchemaToDoInsert(task) {

    const schemaToDoInsert = Joi.object({
        _id:  Joi.allow(),
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
        return await schemaToDoInsert.validateAsync(task);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    validateSchemaToDoInsert: validateSchemaToDoInsert,
}