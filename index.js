import express from 'express'
import cors from 'cors'

import { connectToDB } from './DB/DB.js'

import { addNewGuide, addGuideBooking, findGuideByID, getAllGuides, removeGuideBooking, addGuideLanguage, addGuideTextField, addGuideWorkedHours, removeAllGuidesBookings } from './controllers/GuidesController.js';
import { addCompany, addLanguage, addPort, addResidence, addShip, getCompanies, getLanguages, getPorts, getResidences, getShips } from './controllers/Misc.js'
import { addCall, editCallField, getCalls } from './controllers/CallsController.js';
import { addComment, editComment, getComments } from './controllers/CommentController.js';
import { addUser, getUsers, userLogin, getRoles, addUserRole, assignCallToUser, removeCallFromUser } from './controllers/UsersController.js';
import { verifyToken } from './Utils/VerifyToken.js';
import { checkIfAdmin } from './Utils/CheckIsAdmin.js';
import { celebrate, errors } from 'celebrate';
import { userValidationSchema } from './validators/UserValidations.js';

const app = express()
await connectToDB();
app.use(cors())
app.use(express.json())

app.get('/guides/get', getAllGuides)
app.get('guide/get/:id', findGuideByID)
app.post('/guide/add', checkIfAdmin, addNewGuide)
app.post('/guide/add/booking', addGuideBooking)
app.post('/guide/add/workedhours', addGuideWorkedHours)
app.post('/guides/bookings/removeAll', removeAllGuidesBookings)
app.patch('/guide/add/language', checkIfAdmin, addGuideLanguage)
app.patch('/guide/add/textfield', checkIfAdmin, addGuideTextField)
app.patch('/guide/remove/booking', removeGuideBooking)

app.get('/users/get', getUsers)
app.get('/users/get/role', getRoles)
app.post('/user/login', userLogin)
app.post('/user/check/token', verifyToken)
app.post('/user/add', checkIfAdmin, celebrate({body: userValidationSchema}), addUser)
app.patch('/users/remove_call_permission', checkIfAdmin, removeCallFromUser)

app.get('/calls/get', getCalls)
app.patch('/calls/assign_user', assignCallToUser)
app.post('/call/add', checkIfAdmin, addCall)
app.patch('/call/edit_one_field/:field', editCallField)

app.post('/residence/add', checkIfAdmin, addResidence)
app.post('/ship/add', checkIfAdmin, addShip)
app.post('/company/add', checkIfAdmin, addCompany)
app.post('/port/add', checkIfAdmin, addPort)
app.post('/userrole/add', checkIfAdmin, addUserRole)
app.patch('/language/add', checkIfAdmin, addLanguage)

app.get('/residences/get', getResidences)
app.get('/companies/get', getCompanies)
app.get('/ports/get', getPorts)
app.get('/ships/get', getShips)
app.get('/languages/get', getLanguages)

app.post('/comment/add', addComment)
app.get('/comments/get', getComments)
app.put('/comment/edit', editComment)

app.use(errors())
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send({ errorMessage: err.message || 'Internal Server Error', data: null });
});

app.listen(4040, (err) => {
    if (err) {
        console.log('Server down')
    } else {
        console.log('Server works!')
    }
})