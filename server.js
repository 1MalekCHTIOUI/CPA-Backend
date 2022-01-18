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

//REMOTE MONGO URI
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("MongoDB has been connected"))
.catch((err) => console.log("MongoDB Not Connected"))

//LOCAL
// mongoose.connect("mongodb://127.0.0.1:27017/cpa", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("MongoDB has been connected"))
// .catch((err) => console.log("MongoDB Not Connected"))

app.use('/api/auth', authRouter);

app.listen(PORT, () =>{
    console.log("Server is running on Port: " + PORT);
})