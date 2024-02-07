const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async (email, subject, text) => {
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASS,
            },
        });
        
    
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("Email has been sent to user succesfully");
    } catch (err) {
        console.log("Email failed to send");
        console.log(err);
    }
};

module.exports = sendEmail;