import Joi from 'joi';

export const guideValidationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    residence: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    languages: Joi.array().items(
        Joi.string().min(1)
    ),
    fullAdress: Joi.string(),
    invoicing: Joi.string(),
    station: Joi.string().required()
})

export const addBookingSchema = Joi.object({
    callID: Joi.string().length(24).required(),
    id: Joi.string().length(24).required(),
    callDate: Joi.string().required()
})

export const addWorkedHoursSchema = Joi.object({
    callID: Joi.string().length(24).required(),
    hours: Joi.string().valid('HD', '2HD', 'FD', 'N/A').required().messages({
        'any.only': 'Type must be one of the following values: HD, 2HD, FD, N/A'
    }),
    id: Joi.string().length(24).required()
})

