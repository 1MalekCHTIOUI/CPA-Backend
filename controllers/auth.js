const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/account');
exports.test = (req, res, next) => {
  res.send("TEST API")
}

exports.signup = (req, res, next) => {
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      isConfirmed: false
    });
            user.save()
                .then(() => res.status(201).json({
                  message: 'User created !',
                  status: 201
                }))
                .catch(error => {
                  res.status(400).json({"error": error.message});
                });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) {
      return res.status(400).json({msg: "Veuillez saisir tous les champs"})
  }
  User.findOne({email})
      .then(user => {
          if(!user) res.status(400).json({msg: "L'utilisateur n'existe pas"})
          bcrypt.compare(password, user.password)
          .then(isMatch => {
              if(!isMatch) return res.status(400).json({msg: "Les informations d'identification sont incorrect"});
              jwt.sign(
                  { id: user.id },
                  'jwt_secret',
                  (err, token) => {
                      if(err) throw err;
                      res.json({
                          token,
                          user: {
                              id: user.id,
                              name: user.name,
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