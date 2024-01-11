const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');


port = 3000;

/* Middlewares */
app.use(express.json());
app.use('/api/auth', authRouter);

/* Database connection */

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database connection succesfull...!"))
.catch((err) => {
    console.log(err);
});

/* Backend server connection */

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is up and running on port ${port}...`)
})