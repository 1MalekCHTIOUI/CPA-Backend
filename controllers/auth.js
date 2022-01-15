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
                  res.status(400).json({"error": error, "Data":user});
                });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'User not found !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Wrong password !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'jwt_secret',
                { expiresIn: '2h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

exports.profile = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(500).json({ error }));
};