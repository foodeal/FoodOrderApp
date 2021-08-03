const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../models');
const User = db.user;
const config = require("../config/authJwt.js");
const randtoken = require('rand-token');
const nodemailer = require('nodemailer');
const crypto = require('crypto')

const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config({ path: '.env' })


//Sign UP
exports.create = (event, context, callback) => {
  const userData = (event.body)
  const digcode = ("" + Math.random()).substring(2, 6);

  User.findOne({
    where: {
      mail: event.body.mail
    }
  })
    .then((user) => {
      if (!user) {
        const hash = crypto.createHash('sha1');
        const data = hash.update(event.body.password, 'utf-8');
        const gen_hash= data.digest('hex');
        userData.password = gen_hash
        userData.active = "active"
        userData.dcode = digcode
        userData.new = true
        User.create(userData)
          .then( (user) => {
              context.json("User Succefuly registered")
          })
          .catch(err => {
            callback('error: ' + err.message)
          })

      } else {
        context.json("User already exists")
      }
    })
    .catch(err => {
      context.json('error: ' + err.message)
    })
};
//Login
exports.login = (req, res) => {
  User.findOne({
    where: {
      mail: req.body.mail
    }
  })
    .then(user => {
      if (!user) {
        return res.status(300).send({ msg: 'fail' });
      }
      const hashh = crypto.createHash('sha1'); 
      const hashpass = hashh.update(req.body.password, 'utf-8');
      const gen_hashh= hashpass.digest('hex');
      const compare = gen_hashh == user.password
      var passwordIsValid = compare;
      if (!passwordIsValid) {
        return res.send("Invalid Password!")
      }

      if (user.reset) {
        const code = randtoken.generate(30);
        user.vcode = code
        user.save()
        res.cookie('code', code, { httpOnly: true, secure: false, maxAge: 3600000 * 2 })
        return res.send({"message": "reset password","code": code})
      } else {
        /* On créer le token CSRF */
        const xsrfToken = crypto.randomBytes(64).toString('hex');

        const accessToken = jwt.sign({ id: user.user_id, firstName: user.firstname, lastName: user.lastname, xsrfToken }, config.secret, {
          algorithm: 'HS256',
          expiresIn: 3600000 * 2 / 1000,
          subject: user.user_id.toString()
        });
        /* On créer le refresh token et on le stocke en BDD */
        const refreshToken = crypto.randomBytes(128).toString('base64');
        const userdata = {
          logging_time: new Date(Date.now()),
          refreshToken: refreshToken,
          accessToken: accessToken,
          reset: false
        }
        user.update(userdata)
        res.cookie('access_token', accessToken, { httpOnly: true, secure: false, maxAge: 3600000 * 2 })
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: false, maxAge: 2592000000 })
        res.send({
          id: user.user_id,
          message: "done",
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          phone: user.phone,
          new: user.new,
          access_Token: accessToken,
          active: user.active,
          reset: user.reset,
          accessTokenExpiresIn: 3600000,
          refresh_Token: refreshToken,
          refreshTokenExpiresIn: 2592000000,
          xsrfToken
        });
      }
    })
    .catch(err => {
      res.status(400).json({ error: err.message })
    })
};

exports.verify = (req, res) => {
  User.findOne({ where: { dcode: req.body.code } })
    .then(user => {
      user.dcode = "";
      user.active = "active";
      user.save()
      res.send('Account activated')
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
}

exports.fb = (req, res) => {
  User.findOne({
    where: {
      id: req.body.id
    }
  })
    .then(user => {
      if (!user) {
        const userData = {
          mail: req.body.email,
          id: req.body.id,
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          image: req.body.image,
          active: "active",
          new: true,
          logging_time: new Date(Date.now()),
        };
        User.create(userData)
          .then(user => {
            res.send({
              id: user.user_id,
              username: user.username,
              active: user.active,
              firstname: user.firstname,
              lastname: user.lastname,
              socialId: user.id,
              user: 'new',
              new: user.new,
            });
          })
      } else {
        res.send({
          id: user.user_id,
          username: user.username,
          active: user.active,
          firstname: user.firstname,
          lastname: user.lastname,
          socialId: user.id,
          user: 'found',
          phone: user.phone,
          new: user.new,
        });
      }
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
};