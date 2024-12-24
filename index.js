import express from 'express'
import cors from 'cors'

import { connectToDB } from './DB/DB.js'

import { addNewGuide, addGuideBooking, findGuideByID, getAllGuides, removeGuideBooking, addGuideLanguage, addGuideTextField, addGuideWorkedHours, removeAllGuidesBookings } from './controllers/GuidesController.js';
import { addCompany, addLanguage, addPort, addResidence, addShip, getCompanies, getLanguages, getPorts, getResidences, getShips } from './controllers/Misc.js'
import { addCall, getCalls } from './controllers/CallsController.js';
import { addComment, editComment, getComments } from './controllers/CommentController.js';
import { addUser, getUsers, userLogin, getRoles, addUserRole } from './controllers/UsersController.js';
import { verifyToken } from './Utils/VerifyToken.js';

const app = express()
await connectToDB();
app.use(cors())
app.use(express.json())

app.get('/guides/get', getAllGuides)
app.get('guide/get/:id', findGuideByID)
app.get('/users/get', getUsers)
app.get('/users/get/role', getRoles)
app.post('/user/login', userLogin)
app.post('/user/check/token', verifyToken)
app.post('/guide/add', addNewGuide)
app.post('/guide/add/booking', addGuideBooking)
app.post('/guide/add/workedhours', addGuideWorkedHours)
app.post('/guides/bookings/removeAll', removeAllGuidesBookings)
app.post('/user/add', addUser)
app.post('/userrole/add', addUserRole)
app.patch('/guide/add/language', addGuideLanguage)
app.patch('/guide/add/textfield', addGuideTextField)
app.patch('/guide/remove/booking', removeGuideBooking)

app.post('/residence/add', addResidence)
app.post('/ship/add', addShip)
app.post('/company/add', addCompany)
app.post('/port/add', addPort)
app.post('/call/add', addCall)
app.patch('/language/add', addLanguage)

app.get('/residences/get', getResidences)
app.get('/calls/get', getCalls)
app.get('/companies/get', getCompanies)
app.get('/ports/get', getPorts)
app.get('/ships/get', getShips)
app.get('/languages/get', getLanguages)

app.post('/comment/add', addComment)
app.get('/comments/get', getComments)
app.put('/comment/edit', editComment)



app.listen(4040, (err) => {
    if (err) {
        console.log('Server down')
    } else {
        console.log('Server works!')
    }
})