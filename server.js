const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const authrouter = require('./controller/auth')
const surveyrouter = require('./controller/surveyRoutes')
require('dotenv').config();
const mongodbUrl = process.env.DBCON


app.use(bodyparser.json())
app.use(cors())
const connectDB = async () => {
    try {
        await mongoose.connect(mongodbUrl);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);

    }
};
connectDB()
app.use("/api", authrouter)
app.use('/api', surveyrouter)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
