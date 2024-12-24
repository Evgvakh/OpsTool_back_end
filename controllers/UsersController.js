import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import User from "../DB/Models/User.js";

export const addUser = async (req, res) => {
    try {
        const isExistingUser = await User.findOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        })

        if (isExistingUser) {
            throw new Error('This user exists!!')
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role,
            password: hashPassword
        })
        await user.save()
        res.status(200).send(user)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
}

export const getUsers = async (req, res) => {
    try {
        const data = await User.find({})
        res.status(200).send(data)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
}

export const userLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            throw new Error('Wrong credentials!')
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password)
        if (!isValidPassword) {
            throw new Error('Wrong credentials!')
        } else {
            const token = jwt.sign(
                {
                    id: user._id,                    
                    role: user.role,
                    callAccess: user?.callsPermissons || ''
                },
                process.env.SECRET_TOKEN_KEY,
                { expiresIn: '3h' }
            )
            res.status(200).send({
                userData: {
                    id: user._id,
                    role: user.role,
                    user: user.firstName,
                    access: user?.callsPermissons || ''
                },
                token: token
            })
        }
    } catch (err) {
        console.log(err)
        res.status(401).json({message: err.message, data: null})
    }
}

export const addUserRole = async (req, res) => {
    try {
        const ifExist = await Role.findOne({name: req.body.name})
        if(ifExist) {
            throw new Error('This role already exists')
        }
        const data = new Role({
            name: req.body.name            
        })
        await data.save()
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, data: null})
    }
}

export const getRoles = async (req, res) => {
    try {
        const data = await Role.find({}).sort({name: 1})
        res.json(data)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message, data: null})
    }
}