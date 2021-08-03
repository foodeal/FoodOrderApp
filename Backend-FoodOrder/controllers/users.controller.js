const bcrypt = require('bcryptjs')
const async = require('async')
const db = require('../models');
const User = db.user;
const Location = db.location;
const Coupon_history = db.coupon_history;
const Coupon = db.coupon;
const Billingdeal = db.billingdeal;
const Restaurant = db.restaurant;
const User_restaurant_preferences = db.user_restaurant_preferences;
const nodemailer = require('nodemailer');
var generator = require('generate-password');
const { coupon, deal } = require('../models');
const Reserved_deal = db.reserveddeal;
const location = db.location;
const deal_scheduled = db.dealScheduled;
require('dotenv').config({ path: '.env' })
var moment = require('moment');
const crypto = require('crypto')

exports.findAllUser = (req, res, next) => {
  User.findAll({
    include: [
      {
        model: Location,
        as: "location",
      },
      {
        model: coupon,
        as: "coupon",
      },
      {
        model: User_restaurant_preferences,
        as: "user_restaurant_preferences",
        include: {
          model: Restaurant,
          as: "restaurant"
        }
      },
      {
        model: Reserved_deal,
        as: "reserved_deal",
        include: {
          model: deal_scheduled,
          as: "deal_scheduled"
        }
      }
    ]
  })
    .then(users => {
      return res.json(users)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
// Get User by Id
exports.findById = (req, res, next) => {
  User.findOne({
    where: {
      user_id: req.params.userId
    },
    include: [
      {
        model: Location,
        as: "location",
      },
      {
        model: coupon,
        as: "coupon",
      },
      {
        model: User_restaurant_preferences,
        as: "user_restaurant_preferences",
        include: {
          model: Restaurant,
          as: "restaurant"
        }
      },
      {
        model: Reserved_deal,
        as: "reserved_deal",
        include: {
          model: deal_scheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals",
            include: {
              model: Restaurant,
              as: "restaurant"
            }
          }
        }
      }
    ]
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('user does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
exports.findByIdreserved = (req, res, next) => {
  User.findOne({
    where: {
      user_id: req.params.userId
    },
    include: [
      {
        model: Reserved_deal,
        as: "reserved_deal",
        include: {
          model: deal_scheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals",
            include: {
              model: Restaurant,
              as: "restaurant"
            }
          }
        }
      },
      {
        model: Location,
        as: "location",
      },
    ]
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('user does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

//get users, coupons
exports.findByIdcoupons = (req, res, next) => {
  User.findOne({
    where: {
      user_id: req.params.userId
    },
    include: [
      {
        model: coupon,
        as: "coupon",
        where: {
          status_restaurant: ""
        },
        include: {
          model: deal_scheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals",
            include: {
              model: Restaurant,
              as: "restaurant"
            }
          }
        }
      }
    ]
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('user does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

//get users, coupons confirmed
exports.findByIdcouponsCon = (req, res, next) => {
  User.findOne({
    where: {
      user_id: req.params.userId
    },
    include: [
      {
        model: coupon,
        as: "coupon",
        where: {
          status_restaurant: "confirmed"
        },
        include: {
          model: deal_scheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals",
            include: {
              model: Restaurant,
              as: "restaurant"
            }
          }
        }
      }
    ]
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('user does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

//get users data,reserved , favorite
exports.findByIdfavoritereserved = (req, res, next) => {
  User.findOne({
    where: {
      user_id: req.params.userId
    },
    include: [
      {
        model: User_restaurant_preferences,
        as: "user_restaurant_preferences",
        include: {
          model: Restaurant,
          as: "restaurant"
        }
      },
      {
        model: Reserved_deal,
        as: "reserved_deal",
      },
      {
        model: Location,
        as: "location",
      },
    ]
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('user does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
// delete User
exports.deleteUser = (req, res, next) => {
  User.destroy({
    where: {
      user_id: req.params.userId
    }
  })
    .then(() => {
      res.json('User Deleted!')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

// Update coupontable
exports.updateCoupon = (req, res, next) => {
  const Coupondata = (req.body)
  Coupon.update(
    Coupondata,
    { where: { coupon_id: req.params.couponId } }
  )
    .then(() => {
      res.json('Coupon Updated!')
    })
    .error(err => handleError(err))
  // }
};

// Update User
exports.updateUser = (req, res, next) => {
  const userdata = (req.body)
  User.update(
    userdata,
    { where: { user_id: req.params.userId } }
  )
    .then(() => {
      res.json('User Updated!')
    })
    .error(err => handleError(err))
  // }
};

//Forget_password
exports.forgotPassword = (event, context, callback) => {
  async.waterfall([
    function (done) {
      var password = generator.generate({
        length: 10,
        numbers: true
      });
      done(null, password);
    },
    function (password, done) {
      User.findOne({ where: { mail: event.body.mail } }).then(user => {
        if (!user) {
          context.send("No account with that email address exists.");
        } else {
          const hash = crypto.createHash('sha1');
          const data = hash.update(password, 'utf-8');
          const gen_hash = data.digest('hex');
          user.password = gen_hash;
          user.reset = true
          user.save()
          // res.send({
          //   message: "check your mail"
          // });
          done(null, password, user);
        }
      });
    },
    async function (password, user, done) {
      // var transporter = nodemailer.createTransport({
      //   host: 'mail.foodOrder.com',
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASS
      //   },
      // });
      // var mailOptions = {
      //   from: process.env.EMAIL,
      //   to: user.mail,
      //   subject: 'FoodOrder Password Reset',
      //   html: '<h4>Vous recevez ceci parce que vous avez demandé la réinitialisation du mot de passe de votre compte.</h4>\n\n <br><br>' +
      //     '<b>                Mot de passe temporaire: </b>' + password + '\n\n<br><br>' +
      //     '<h4>Connectez vous avec ce mot de passe temporaire pour pouvoir créer un nouveau mot de passe</h4>\n'
      // };

      // await new Promise((rsv, rjt) => {
      //   transporter.sendMail(mailOptions, function (error, info) {
      //     if (error) {
      //       console.log(error);
      //       callback(error)
      //     } else {
      //       console.log('Email sent: ' + info.response);
      //       context.json("check your mail")
      //       callback()
      //       done(error, done);
      //     }
      //   })
      // })
      context.json("check your mail")
      callback()
      done(null, done);
    }

  ], function (err) {
    if (err) return callback(err);
  });
}

// Reset password
exports.resetPassword = (event, context, callback) => {
  async.waterfall([
    function (done) {
      User.findOne({ where: { vcode: event.body.code } }).then(user => {
        if (!user) {
          context.send('Password reset token is invalid or has expired.');
        }
        const hash = crypto.createHash('sha1');
        const data = hash.update(event.body.password, 'utf-8');
        const gen_hash = data.digest('hex');
        user.password = gen_hash;
        user.reset = false

        user.save()
        done(null, user);
      });
    },
    async function (user, done) {
      // var transporter = nodemailer.createTransport({
      //   host: 'mail.foodOrder.com',
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASS
      //   },
      // });
      // var mailOptions = {
      //   from: process.env.EMAIL,
      //   to: user.mail,
      //   subject: 'Your password has been changed',
      //   text: 'Hello,\n\n' +
      //     'Ceci est une confirmation que le mot de passe de votre compte' + user.mail + ' a été bien changé.\n'
      // };
      // await new Promise((rsv, rjt) => {
      //   transporter.sendMail(mailOptions, function (error, info) {
      //     if (error) {
      //       console.log(error);
      //       callback(error)
      //     } else {
      //       console.log('Email sent: ' + info.response);
      //       context.json("Password reset succesfuly")
      //       callback()
      //       done(error, done);
      //     }
      //   });
      // })
      context.json("Password reset succesfuly")
      callback()
      done(null, done);
    }
  ])
};
//add to favorite list
exports.addfavorite = (req, res, next) => {
  User_restaurant_preferences.findOne({
    where: {
      restaurant_id: req.body.restaurant_id,
      user_id: req.body.user_id
    }
  })
    .then(favorite => {
      if (!favorite) {
        const User_restaurant_preferencesData = (req.body)
        User_restaurant_preferences.create(User_restaurant_preferencesData)
          .then(User_restaurant_preferences => {
            res.json("favorite added Succefuly created")
          })
          .catch(err => {
            res.send('error: ' + err.message)
          })
      }
      else {
        res.json("favorite already exists")
      }
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
};
exports.deletefavorite = (req, res, next) => {
  User_restaurant_preferences.destroy({
    where: {
      restaurant_id: req.body.restaurant_id,
      user_id: req.body.user_id
    }
  })
    .then(() => {
      res.json('favorite Deleted!')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
//location history
exports.addloacalisation = (req, res, next) => {
  const locationdata = (req.body)
  location.create(locationdata)
    .then(location => {
      res.json("location added Succefuly")
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
};
//reserved coupon
exports.addreservedcoupon = (req, res, next) => {
  const Reserved_dealdata = (req.body)
  Reserved_deal.create(Reserved_dealdata)
    .then(reserved_deal => {
      res.json("Reserved coupon added Succefuly")
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
};
//coupon
exports.coupon = (event, context, callback) => {
  const CouponData = (event.body)
  Coupon.create(CouponData)
    .then(async (CouponData) => {
      const data = {
        commission_rate: event.body.commission_rate,
        Price: event.body.PriceAfterDiscount * event.body.nbre_coupons,
        money_due: ((event.body.PriceAfterDiscount * event.body.nbre_coupons) * event.body.commission_rate).toFixed(2),
        coupon_id: CouponData.coupon_id,
        restaurant_id: event.body.restaurant_id
      }
      await Billingdeal.create(data);
      // var transporter = nodemailer.createTransport({
      //   host: 'mail.foodOrder.com',
      //   port: 465,
      //   secure: true,
      //   auth: {
      //     user: process.env.EMAIL,
      //     pass: process.env.PASS
      //   },
      // });
      // const mailOptions = {
      //   to: process.env.SUPPORTMAIL,
      //   from: process.env.EMAIL,
      //   subject: 'Nouvelle Commande Achetée ID ' + CouponData.coupon_id,
      //   html:
      //     '<b>Nouvelle commande: </b>' + CouponData.coupon_id + '\n\n<br>' +
      //     '<b>Nom et prénom: </b>' + event.body.username + '\n\n<br>' +
      //     '<b>Numéro: </b>' + event.body.numero + ' \n\n<br>' +
      //     '<b>Description: </b>' + event.body.description + '\n\n<br>' +
      //     '<b>Détails de la commande: </b>' + event.body.detail + '\n\n<br>' +
      //     '<b>Qté: </b>' + event.body.nbre_coupons + ' \n\n<br>' +
      //     '<b>Prix: </b>' + event.body.PriceAfterDiscount * event.body.nbre_coupons + '\n\n<br>' +
      //     '<b>Partenaire: </b>' + event.body.nomPartner + ' \n\n<br>' +
      //     '<b>Type: </b>' + event.body.typee + ' \n\n<br>'

      // };
      // await new Promise((rsv, rjt) => {
      //   transporter.sendMail(mailOptions, function (error, info) {
      //     if (error) {
      //       console.log(error)
      //       callback(err);
      //     } else {
      //       console.log('Email sent: ' + info.response);
      //       context.json("Coupon added Succefuly")
      //       callback();
      //     }
      //   })
      // });
      context.json("Coupon added Succefuly")
      callback();
    })
    .catch(err => {
      context.send('error: ' + err.message)
    })
};
//user with active reserved couffins
exports.ActiveResCou = (req, res, next) => {
  User.findOne({
    where: {
      user_id: req.params.userId
    },
    include: [
      {
        model: Reserved_deal,
        as: "reserved_deal",
        where: {
          type: 'active'
        },
      },
    ]
  })
    .then(async (user) => {
      if (user) {
        moment.locale('ar-tn');
        let date = moment().format();
        await user.reserved_deal.forEach(async (item) => {
          if (item.type == 'active') {
            const datenow = moment(date).format("YYYY-MM-DD")
            const createdtime = moment(item.timepickup).format("YYYY-MM-DD")
            const compare = moment(datenow).isSame(createdtime)
            if (!compare) {
              const data = ({
                type: 'expire',
                motif: 'Panier expiré'
              })
              await Reserved_deal.update(
                data,
                { where: { id: item.id } }
              );
            }
          }
        })
        User.findOne({
          where: {
            user_id: req.params.userId
          },
          include: [
            {
              model: Reserved_deal,
              as: "reserved_deal",
              where: {
                type: 'active'
              },
              include: {
                model: deal_scheduled,
                as: "deal_scheduled",
                include: {
                  model: deal,
                  as: "deals",
                  include: {
                    model: Restaurant,
                    as: "restaurant"
                  }
                }
              }
            },
          ]
        })
          .then(async (user) => {
            return res.json(user)
          })
      } else {
        res.json([])
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
//user with expired reserved couffins
exports.ExpiredResCou = (req, res, next) => {
  User.findOne({
    where: {
      user_id: req.params.userId
    },
    include: [
      {
        model: Reserved_deal,
        as: "reserved_deal",
        where: {
          type: 'expire'
        },
        include: {
          model: deal_scheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals",
            include: {
              model: Restaurant,
              as: "restaurant"
            }
          }
        }
      },
      {
        model: Location,
        as: "location",
      },
    ]
  })
    .then(user => {
      return res.json(user)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};


