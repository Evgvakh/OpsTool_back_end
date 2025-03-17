import express from 'express'
import cors from 'cors'
import http from 'http'


import { connectToDB } from './DB/DB.js'

import { addNewGuide, addGuideBooking, findGuideByID, getAllGuides, removeGuideBooking, addGuideLanguage, addGuideTextField, addGuideWorkedHours, removeAllGuidesBookings } from './controllers/GuidesController.js';
import { addCompany, addLanguage, addPort, addResidence, addShip, addUserRole, getCompanies, getLanguages, getPorts, getResidences, getShips, getRoles, addGuideInvoicing, getGuideInvoicings, addStation, getStations } from './controllers/Misc.js'
import { addCall, editCallField, getCalls } from './controllers/CallsController.js';
import { addComment, editComment, getComments } from './controllers/CommentController.js';
import { addUser, getUsers, userLogin, assignCallToUser, removeCallFromUser, createAndSendResetPasswordLink, resetUserPassword } from './controllers/UsersController.js';
import { verifyToken } from './Utils/VerifyToken.js';
import { checkIfAdmin } from './Utils/CheckIsAdmin.js';
import { celebrate, errors } from 'celebrate';
import { assignCallSchema, userLoginSchema, userValidationSchema } from './validators/UserValidations.js';
import { callValidationSchema, editCallSchemaBody, editCallSchemaParams } from './validators/CallsValidations.js';
import { assignCallNotification } from './Utils/Mailer.js';
import { addBookingSchema, addWorkedHoursSchema, guideValidationSchema } from './validators/GuideValidations.js';
import { initIOConnection } from './Socket.io/index.js';

const app = express()
app.use(cors())
app.use(express.json())
const server = http.createServer(app)
const io = initIOConnection(server)
await connectToDB();


app.get('/guides/get', getAllGuides)
app.get('guide/get/:id', findGuideByID)
app.post('/guide/add', checkIfAdmin, celebrate({body: guideValidationSchema}), addNewGuide)
app.post('/guide/add/booking', celebrate({body: addBookingSchema}), addGuideBooking)
app.post('/guide/add/workedhours', celebrate({body: addWorkedHoursSchema}), addGuideWorkedHours)
app.post('/guides/bookings/removeAll', removeAllGuidesBookings)
app.patch('/guide/add/language', checkIfAdmin, addGuideLanguage)
app.patch('/guide/add/textfield', checkIfAdmin, addGuideTextField)
app.patch('/guide/remove/booking', removeGuideBooking)

app.get('/users/get', getUsers)
app.get('/users/get/role', getRoles)
app.post('/user/login', celebrate({body: userLoginSchema}), userLogin)
app.post('/user/check/token', verifyToken)
app.post('/user/add', checkIfAdmin, celebrate({ body: userValidationSchema }), addUser)
app.patch('/users/remove_call_permission', checkIfAdmin, removeCallFromUser)
app.post('/users/send_reset_password_link', createAndSendResetPasswordLink)
app.post('/user/reset_password', resetUserPassword)

app.get('/calls/get', getCalls)
app.patch('/user/assign_call', celebrate({body: assignCallSchema}), assignCallToUser)
app.post('/call/add', checkIfAdmin, celebrate({body: callValidationSchema}), addCall)
app.patch('/call/edit_one_field/:field', celebrate({params: editCallSchemaParams, body: editCallSchemaBody}), editCallField)

app.post('/residence/add', checkIfAdmin, addResidence)
app.post('/ship/add', checkIfAdmin, addShip)
app.post('/company/add', checkIfAdmin, addCompany)
app.post('/port/add', checkIfAdmin, addPort)
app.post('/userrole/add', checkIfAdmin, addUserRole)
app.post('/language/add', checkIfAdmin, addLanguage)
app.post('/invoicing/add', checkIfAdmin, addGuideInvoicing)
app.post('/station/add', checkIfAdmin, addStation)

app.get('/residences/get', getResidences)
app.get('/companies/get', getCompanies)
app.get('/ports/get', getPorts)
app.get('/ships/get', getShips)
app.get('/languages/get', getLanguages)
app.get('/invoicings/get', getGuideInvoicings)
app.get('/stations/get', getStations)

app.post('/comment/add', addComment)
app.get('/comments/get', getComments)
app.put('/comment/edit', editComment)

app.post('/mail/call_assign/send', assignCallNotification)



app.use(errors())
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ errorMessage: err.message || 'Internal Server Error', data: null });
});

server.listen(4040, (err) => {
    if (err) {
        console.log('Server down')
    } else {
        console.log('Server works!')
    }
})