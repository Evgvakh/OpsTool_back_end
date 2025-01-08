import Joi from 'joi';

export const userValidationSchema = Joi.object({
    station: Joi.string().pattern(/^[A-Z]{3}$/).required().messages({
        'string.pattern.base': 'The string must be in the format XX_XXX (2 letters, underscore, 3 letters)',
    }),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email adress'
    }),
    password: Joi.string().required(),
    role: Joi.string().required()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email adress'
    }),
    password: Joi.string().required()
})

export const assignCallSchema = Joi.object({
    callId: Joi.string().length(24).required(),
    userId: Joi.string().length(24).required()
})