const express = require('express')
const mongoose = require('mongoose')

const app = express()

//DB Config
const db = require('./config/keys').mongoURI

//Connect to Mongodb
mongoose
    .connect(db)
    .then( () => {
        console.log("Mongo Connected")
    })
    .catch( err => console.log(err))

app.get('/', (req, res) => {
    res.send("hello")
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})