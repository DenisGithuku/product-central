const dotenv = require('dotenv')
dotenv.config({path: `${__dirname}/config.env`})
const app = require(`${__dirname}/app`)
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server responding at port ${port}....`)
})