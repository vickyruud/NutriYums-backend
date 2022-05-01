const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()


const client = new OAuth2Client('314086644675-a82vonng714fusuuotog2780t6plapo9.apps.googleusercontent.com')

const {
   createJWT,
} = require("../utils/auth");
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
exports.signup = (req, res, next) => {
  let { username, email, password, password_confirmation, id } = req.body;
  let errors = [];
  if (!username) {
    errors.push({ username: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
     password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "mismatch" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }
 User.findOne({email: email})
    .then(user=>{
       if(user){
          return res.status(422).json({ errors: [{ user: "email already exists" }] });
       }else {
         const user = new User({
           username: username,
           email: email,
           password: password,
           id :id
         });
         bcrypt.genSalt(10, function (err, salt) {
           bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
              user.password = hash;
              user.save()
              .then(response => {
                res.status(200).json({
                  success: true,
                  result: response
                })
             })
             .catch(err => {
               res.status(500).json({
                  errors: [{ error: err }]
               });
            });
         });
      });
     }
  }).catch(err =>{
      res.status(500).json({ erros: err })
      
  })
}

exports.signin = (req, res) => {
     let { email, password } = req.body;
     let errors = [];
     if (!email) {
       errors.push({ email: "required" });
     }
     if (!emailRegexp.test(email)) {
       errors.push({ email: "invalid email" });
     }
     if (!password) {
       errors.push({ passowrd: "required" });
     }
     if (errors.length > 0) {
      return res.status(422).json({ errors: errors });
     }
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({
        errors: [{ user: "not found" }],
      });
    } else {
      
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({
            errors: [{
              password: "incorrect"
            }] 
          });
        }
        let access_token = createJWT(
          user.email,
          user.id,
          3600
        );
          jwt.verify(access_token, process.env.TOKEN, (err,
            decoded) => {
              if (err) {
                res.status(500).json({ erros: err });
              }
              if (decoded) {
                return res.status(200).json({
                  success: true,
                  token: access_token,
                  message: user
                });
              }
            });
          }).catch(err => {
            res.status(500);
            console.log(err);
          });
          }
        }).catch(err => {
      res.status(500).json({ erros: err });
   });
}

exports.googlelogin = (req, res) => {
  const {tokenId} = req.body;
  
  client.verifyIdToken({ idToken: tokenId, audience: '314086644675-a82vonng714fusuuotog2780t6plapo9.apps.googleusercontent.com' })
  .then(response => {
    const { email_verified, name, email } = response.payload;
    if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({
              error: 'Something went wrong...'
            })
          } else {
            if (user) {
          let access_token = createJWT(
            user.email,
            user.id,
            3600
          );
          jwt.verify(access_token, process.env.TOKEN, (err,
            decoded) => {
              if (err) {
                res.status(500).json({ erros: err });
              }
              if (decoded) {
                return res.status(200).json({
                  success: true,
                  token: access_token,
                  message: user
                });
              }
            });
            } else {

              let password = email+process.env.TOKEN
              const user = new User({
                username: name,
                email: email,
                password: password,
                id : uuidv4()
              });
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                  if (err) throw err;
                  user.password = hash;
                  user.save().then(response => {
                    res.status(200).json({
                      success: true,
                      result: response
                    })
                  })
                    .catch(err => {
                      res.status(500).json({
                      errors: [{error: err}]
                    })
                  })

                })
              })
              

            }
          }
        })
      }
    })
    .catch(err => {
      res.status(500).json({ erros: err })
    
  })

}