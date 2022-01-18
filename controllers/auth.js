const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/account');
exports.test = (req, res, next) => {
  res.send("TEST API")
}

exports.signup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  if(!username || !email || !password){
      return res.status(400).json({message: "Please fill all the fields!"})
  }
  User.findOne({email})
  .then(user => {
      if(user) return res.status(400).json({message: "This Email is already used!"})
  })

  const newUser = new User({
    username,
    email,
    password
  });

  bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(newUser.password, salt, (err, hash)=>{
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => res.status(200).json({msg: "Registration Success"}))
      })
  })
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
      return res.status(400).json({message: "Please fill all the fields!"})
  }
  User.findOne({email})
      .then(user => {
          if(!user) return res.status(400).json({message: "User does not exist!"})
          bcrypt.compare(password, user.password)
          .then(isMatch => {
              if(!isMatch) return res.status(400).json({message: "Wrong credentials!"});
              jwt.sign(
                  { id: user.id },
                  'jwt_secret',
                  (err, token) => {
                      if(err) throw err;
                      res.json({
                          token,
                          status: "success",
                          user: {
                              id: user.id,
                              username: user.username,
                              email: user.email
                          }
                      })
                  }
              )
          }).catch(e => console.log(e.message))
     }).catch(e => console.log(e.message))
};

exports.profile = (req, res, next) => {
  User.findById(req.user.id)
  .then(user => res.json(user)).catch(e => e.message);
};