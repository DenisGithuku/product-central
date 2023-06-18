const dotenv = require('dotenv')
dotenv.config({path: `${__dirname}/config.env`})
const app = require(`${__dirname}/api/index`)
const port = process.env.PORT || 3000
const mongoose = require('mongoose')

const db_uri = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD)
mongoose.connect(db_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(conn => {
    console.log("DB connection established....")
}).catch(err => {
    console.log(`DB ERROR 💥: ${err}`)
})

app.listen(port, () => {
    console.log(`Server responding at port ${port}....`)
})