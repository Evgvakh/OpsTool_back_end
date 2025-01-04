import jwt from 'jsonwebtoken';
import User from '../DB/Models/User.js';

export const checkIfAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            throw new Error('You have no right for this operation')
        }

        const checkToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY)

        const user = await User.findById(checkToken.id)
        if (user.role === 'ADMIN') {
            next()
        } else {
            throw new Error('You have no right for this operation')
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
}