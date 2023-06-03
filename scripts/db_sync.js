const dotenv = require('dotenv')
dotenv.config({path: `${__dirname}/../config.env`})
const mongoose = require('mongoose')
const fs = require('fs')

const Product = require(`${__dirname}/../models/ProductModel`)
const db_url = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD)
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(conn => {
    console.log("DB connection established!")
}).catch(err => {
    console.log(`An error occurred: ${err.message}`)
})

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'))

const initDb = async () => {
    try {
        await Product.create(products)
        console.log("DB init successful!")
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

const nukeDb = async () => {
    try {
        await Product.deleteMany()
        console.log("DB nuked successfully!")
    } catch (err) {
        console.log(err)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    initDb()
} else if (process.argv[2] === '--nuke') {
    nukeDb()
}