const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const path = require('path')
const accountRouter = require('./routes/account');

app.use(cors());
app.use(express.json());
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("MongoDB has been connected"))
.catch((err) => console.log(err));

app.use('/account', accountRouter);


if(process.env.NODE_ENV === 'production') {
  app.use(express.static('../build'));
  app.use(express.static(path.resolve(__dirname, "../build")));
  app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "..", 'build', "index.html"));
  });

}

app.listen(PORT, () =>{
    console.log("Server is running on Port: " + PORT);
})