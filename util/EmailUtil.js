const nodemailer = require(`nodemailer`)

const SendMail = async (options) => {
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

    /*
    create mail options
     */
    const mailOptions = {
        from: `Product Central <${process.env.SERVICE_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    }

    /*
    send email
     */
    await transport.sendMail(mailOptions)
}

module.exports = SendMail