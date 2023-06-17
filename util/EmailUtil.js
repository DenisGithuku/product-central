const nodemailer = require(`nodemailer`)
const {createTransport} = require("nodemailer");

class EmailHandler {
    constructor(user) {
        this.from = `Product Central <${process.env.SERVICE_EMAIL}>`
        this.to = user.to
        this.subject = user.subject
        this.message = user.message
    }

    async SendMail() {
        try {
            /*
            create mail options
             */
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject: this.subject,
                html: this.message
            }

            /*
            send email
             */
            await this.createTransport().sendMail(mailOptions)
        } catch (e) {
            console.log(e)
        }
    }

    createTransport() {
        /*
        create transporter
         */
        let transport;
        if (process.env.NODE_ENV === 'development') {
            transport = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            })
        }
        if (process.env.NODE_ENV === 'production') {
            transport = nodemailer.createTransport({
                service: process.env.SERVICE,
                auth: {
                    user: process.env.SERVICE_EMAIL,
                    pass: process.env.SERVICE_PASSWORD
                }
            })
        }
        return transport
    }
}

module.exports = EmailHandler