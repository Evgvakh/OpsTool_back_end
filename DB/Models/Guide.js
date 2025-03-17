import mongoose from "mongoose";
import Station from "./Station.js";
import Residence from './GuidesResidence.js'
import Language from "./Language.js";
import Invoicing from './GuideInvoicing.js'

const GuideSchema = new mongoose.Schema({
    station: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        set: (value) => {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    },
    lastName: {
        type: String,
        required: true,
        set: (value) => {
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    },
    fullName: {
        type: String,
        default: function () {
            return `${this.firstName} ${this.lastName}`
        }
    },
    residence: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        set: v => v.toLowerCase()
    },
    fullAdress: {
        type: String
    },
    invoicing: {
        type: String
    },
    bookings: [
        {
            callId: {
                type: String,
                required: true
            },
            callDate: {
                type: String,
                required: true
            }
        }
    ],
    languages: {
        type: [String],
        default: []
    },
    workedHours: [
        {
            callId: {
                type: String
            },
            hours: {
                type: String
            }
        }
    ]
})

GuideSchema.pre('save', async function (next) {
    try {
        console.log(this)
        const { station, languages, residence, invoicing } = this
        const stationExists = await Station.findOne({ name: station });
        if (!stationExists) {
            return next(new Error('Station does not exist in the database'));
        }

        const residenceExists = await Residence.findOne({ residenceTown: residence });
        if (!residenceExists) {
            return next(new Error('Residence does not exist in the database'));
        }

        const existingLanguages = await Language.find({ name: { $in: languages } });
        if (existingLanguages.length !== languages.length) {
            return next(new Error('Some languages do not exist in the database'));
        }

        const invoicingExists = await Invoicing.findOne({ name: invoicing });
        if (!invoicingExists) {
            return next(new Error('Type of invoicing does not exist in the database'));
        }

        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model("Guide", GuideSchema);