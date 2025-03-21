import Port from "../DB/Models/Port.js";
import Company from "../DB/Models/Company.js";
import Ship from "../DB/Models/Ship.js";
import Language from '../DB/Models/Language.js'
import GuidesResidence from "../DB/Models/GuidesResidence.js";
import Role from "../DB/Models/Role.js";
import Invoicing from '../DB/Models/GuideInvoicing.js'
import Station from "../DB/Models/Station.js";

export const addPort = async (req, res) => {
    try {
        const ifExist = await Port.findOne({name: req.body.name})
        if(ifExist) {
            throw new Error('This port already exists')
        }
        const data = new Port({
            name: req.body.name,
            code: req.body.code
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, data: null})
    }
}

export const getPorts = async (req, res) => {
    try {
        const data = await Port.find({}).sort({name: 1})
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(404).send({ errorMessage: err }) 
    }
}

export const addCompany = async (req, res) => {
    try {
        const ifExist = await Company.findOne({name: req.body.name})
        if(ifExist) {
            throw new Error('This company already exists')
        }
        const data = new Company({
            name: req.body.name
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, data: null})
    }
}

export const getCompanies = async (req, res) => {
    try {
        const data = await Company.find({}).sort({name: 1})
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: err })
    }
}

export const addShip = async (req, res) => {
    try {
        const ifExist = await Ship.findOne({name: req.body.name})
        if(ifExist) {
            throw new Error('This ship already exists')
        }
        const data = new Ship({
            name: req.body.name,
            company: req.body.company,
            code: req.body.code
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, data: null})
    }
}

export const getShips = async (req, res) => {
    try {
        const data = await Ship.find({}).sort({name: 1})
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, data: null}) 
    }
}

export const addLanguage = async (req, res) => {
    try {
        const ifExist = await Language.findOne({name: req.body.name.toUpperCase()})
        if(ifExist) {
            throw new Error('This language already exists')
        }
        const data = new Language({
            name: req.body.name.toUpperCase()
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(400).send({ errorMessage: err })
    }
}

export const getLanguages = async (req, res) => {
    try {
        const data = await Language.find({}).sort({name: 1})
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(404).send({ errorMessage: err }) 
    }
}

export const addResidence = async (req, res) => {
    try {
        const ifExist = await GuidesResidence.findOne({name: req.body.name})
        if(ifExist) {
            throw new Error('This Residence already exists')
        }
        const data = new GuidesResidence({
            residenceTown: req.body.name.toUpperCase()
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, data: null})
    }
}

export const getResidences = async (req, res) => {
    try {
        const data = await GuidesResidence.find({}).sort({name: 1})
        res.json(data)
    } catch (err) {
        console.log(err);
        res.status(404).send({ errorMessage: err })
    }
}

export const addUserRole = async (req, res) => {
    try {
        const ifExist = await Role.findOne({ name: req.body.name })
        if (ifExist) {
            throw new Error('This role already exists')
        }
        const data = new Role({
            name: req.body.name
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const getRoles = async (req, res) => {
    try {
        const data = await Role.find({}).sort({ name: 1 })
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const addGuideInvoicing = async (req, res) => {
    try {
        const ifExist = await Invoicing.findOne({ name: req.body.name })
        if (ifExist) {
            throw new Error('This invoicing type already exists')
        }
        const data = new Invoicing({
            name: req.body.name
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const getGuideInvoicings = async (req, res) => {
    try {
        const data = await Invoicing.find({}).sort({ name: 1 })
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const addStation = async (req, res) => {
    try {
        const ifExist = await Station.findOne({ name: req.body.name })
        if (ifExist) {
            throw new Error('This station already exists')
        }
        const data = new Station({
            name: req.body.name
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const getStations = async (req, res) => {
    try {
        const data = await Station.find({}).sort({ name: 1 })
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}