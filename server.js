const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const path = require('path')
const authRouter = require('./routes/auth');
app.use(cors());
app.options('*', cors());
app.use(express.json());
require("dotenv").config({ path: path.resolve(__dirname, './.env') })

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("MongoDB has been connected"))
.catch((err) => console.log(err));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api/auth', authRouter);

app.listen(PORT, () =>{
    console.log("Server is running on Port: " + PORT);
})