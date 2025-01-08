import Joi from 'joi';

export const callValidationSchema = Joi.object({
    date: Joi.string().required(),
    type: Joi.string().valid('SHX', 'TRN').required().messages({
        'any.only': 'Type must be one of the following values: SHX or TRN'
    }),
    port: Joi.string().required(),
    company: Joi.string().required(),
    ship: Joi.string().required(),
    arrival: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/).required().messages({
        'string.pattern.base': 'Time must be in the format HH:mm, where HH is between 00 and 23, and mm is between 00 and 59'
    }),
    departure: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/).required().messages({
        'string.pattern.base': 'Time must be in the format HH:mm, where HH is between 00 and 23, and mm is between 00 and 59'
    })
})

export const editCallSchemaParams = Joi.object({
    field: Joi.string().required()
})

export const editCallSchemaBody = Joi.object({
    callId: Joi.string().length(24).required().messages({
        'string.length': 'Call ID must be 24 characters long'
    }),
    value: Joi.string().when('field', {
        is: Joi.valid('ship'),
        then: Joi.allow('').optional(),
        otherwise: Joi.required()
    })
})