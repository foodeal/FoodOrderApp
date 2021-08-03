const jwt = require('jsonwebtoken')
const db = require('../models');
const Admin = db.admin;
const config = require("../config/authJwt.js");
const randtoken = require('rand-token');
const nodemailer = require('nodemailer');
const crypto = require('crypto')

require('dotenv').config({ path: '.env' })


//Sign UP
exports.create = (event, context, callback) => {
  const userData = (event.body)

  Admin.findOne({
    where: {
      mail: event.body.mail
    }
  })
    .then((admin) => {
      if (!admin) {
        const hash = crypto.createHash('sha1');
        const data = hash.update(event.body.password, 'utf-8');
        const gen_hash= data.digest('hex');
        userData.password = gen_hash
        Admin.create(userData)
          .then( (user) => {
              context.json("Admin Succefuly registered")
          })
          .catch(err => {
            callback('error: ' + err.message)
          })

      } else {
        context.json("Admin already exists")
      }
    })
    .catch(err => {
      context.json('error: ' + err.message)
    })
};
//Login
exports.login = (req, res) => {
    Admin.findOne({
    where: {
      mail: req.body.mail
    }
  })
    .then(admin => {
      if (!admin) {
        return res.status(300).send({ msg: 'fail' });
      }
      const hashh = crypto.createHash('sha1'); 
      const hashpass = hashh.update(req.body.password, 'utf-8');
      const gen_hashh= hashpass.digest('hex');
      const compare = gen_hashh == admin.password
      var passwordIsValid = compare;
      if (!passwordIsValid) {
        return res.send("Invalid Password!")
      }

        /* On créer le token CSRF */
        const xsrfToken = crypto.randomBytes(64).toString('hex');

        const accessToken = jwt.sign({ id: admin.id, firstName: admin.firstname, lastName: admin.lastname, xsrfToken }, config.secret, {
          algorithm: 'HS256',
          expiresIn: 3600000 * 2 / 1000,
          subject: admin.id.toString()
        });
        /* On créer le refresh token et on le stocke en BDD */
        const refreshToken = crypto.randomBytes(128).toString('base64');
        const userdata = {
          logging_time: new Date(Date.now()),
          refreshToken: refreshToken,
          accessToken: accessToken,
        }
        admin.update(userdata)
        res.cookie('access_token', accessToken, { httpOnly: true, secure: false, maxAge: 3600000 * 2 })
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: false, maxAge: 2592000000 })
        res.send({
          id: admin.id,
          firstname: admin.firstname,
          lastname: admin.lastname,
          username: admin.username,
          access_Token: accessToken,
          accessTokenExpiresIn: 3600000,
          refresh_Token: refreshToken,
          refreshTokenExpiresIn: 2592000000,
          xsrfToken
        });
    })
    .catch(err => {
      res.status(400).json({ error: err.message })
    })
};
