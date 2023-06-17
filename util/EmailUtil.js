const nodemailer = require(`nodemailer`)

const sendMail = async (options) => {
    /*
    create transporter
     */
    let transport;
    if (process.env.DEVELOPMENT) {
        transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    }
    if (process.env.PRODUCTION) {
        transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SERVICE_EMAIL,
                pass: process.env.SERVICE_PASSWORD
            }
        })
    }

    /*
    create mail options
     */
    const mailOptions = {
        from: `Product Central ${process.env.SERVICE_EMAIL}`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    /*
    send email
     */
    await transport.sendMail(mailOptions)
}

module.exports = sendMail