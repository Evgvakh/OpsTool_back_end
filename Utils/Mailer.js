import nodemailer from 'nodemailer'
import mjml from 'mjml'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL_USER,
        pass: process.env.AUTH_EMAIL_PASSWORD
    },
}, {
    from: `IC OpsTool <${process.env.AUTH_EMAIL_SENDER}>`,
});

const mailer = (message, res) => {
    try {
        transporter.sendMail(message, (err, info) => {
            if (err) {
                res.send(err)
            }
            res.send(info)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
    try {
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

const setFilePath = (file) => {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const mjmlFilePath = path.join(currentDir, 'mjml', file);
    return mjmlFilePath
}
const defineMessage = (email, subject, htmlTemplate) => {
    return {
        to: email,
        subject: subject,
        html: htmlTemplate
    }
}

export const assignCallNotification = (req, res) => {
    try {        
        fs.readFile(setFilePath('AssignCall.mjml'), 'utf-8', (err, mjmlTemplate) => {
            if (err) {
                return res.status(500).send('Failed to read template');
            }
            const finalTemplate = mjmlTemplate
                .replace('{{user}}', req.body.user)
                .replace('{{date}}', new Date(req.body.date).toDateString())
                .replace('{{company}}', req.body.company)
                .replace('{{ship}}', req.body.ship)
                .replace('{{port}}', req.body.port)
                .replace('{{type}}', req.body.type)
            
            const htmlOutput = mjml(finalTemplate).html            

            mailer(defineMessage(req.body.email, 'A new call has been assigned to you', htmlOutput), res)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const sendResetPasswordLink = (req, res, user, link, email) => {
    try {        
        fs.readFile(setFilePath('ResetPassword.mjml'), 'utf-8', (err, mjmlTemplate) => {
            if (err) {
                return res.status(500).send('Failed to read template');
            }
            const finalTemplate = mjmlTemplate
                .replace('{{user}}', user)
                .replace('{{link}}', link)                
            
            const htmlOutput = mjml(finalTemplate).html            

            mailer(defineMessage(email, 'Reset your password', htmlOutput), res)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}