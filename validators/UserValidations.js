import Joi from 'joi';

export const userValidationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email adress'
    }),
    password: Joi.string().required(),
    role: Joi.string().required()
}) 