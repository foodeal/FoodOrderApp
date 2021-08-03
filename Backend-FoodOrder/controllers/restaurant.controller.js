const db = require('../models');
const Restaurant = db.restaurant;
const config = require("../config/authJwt.js");
const multer = require('multer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dealtemp = db.dealtemp;
const deal = db.deal;
const dealScheduled = db.dealScheduled;
const monthlubilling = db.monthlubilling;
const Coupon = db.coupon;
const Reserveddeal = db.reserveddeal;
const crypto = require('crypto')
const User = db.user;
const Billingdeal = db.billingdeal;
var moment = require('moment');

require('dotenv').config({ path: '.env' })


exports.findAllRestaurant = (req, res, next) => {
  Restaurant.findAll({
    include: [
      {
        model: deal,
        as: "deal"
      },
      {
        model: monthlubilling,
        as: "monthlubilling"
      }
    ]
  })
    .then(restaurants => {
      return res.json(restaurants)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
// Get Restaurant by Id
exports.findById = (req, res, next) => {
  Restaurant.findOne({
    where: {
      restaurant_id: req.params.restaurantId
    },
    include: [
      {
        model: monthlubilling,
        as: "monthlubilling"
      },
      {
        model: dealScheduled,
        as: "dealScheduled",
        include: {
          model: deal,
          as: "deals"
        }
      },
      {
        model: Coupon,
        as: "coupon",
        include: {
          model: dealScheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals"
          }
        }
      }
    ]
  })
    .then(restaurant => {
      if (restaurant) {
        res.json(restaurant)
      } else {
        res.send('restaurant does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
// Get Restaurant by Id reserved
exports.findByIdreserved = (req, res, next) => {
  Restaurant.findOne({
    where: {
      restaurant_id: req.params.restaurantId
    },
    include: [
      {
        model: Reserveddeal,
        as: "reserveddeal",
        include: {
          model: dealScheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals"
          }
        }
      }
    ]
  })
    .then(async (restaurant) => {
      if (restaurant) {
        res.json(restaurant)
      } else {
        res.send('restaurant does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
// Get Restaurant by Id active
exports.findByIdActivedeal = (req, res, next) => {
  Restaurant.findOne({
    where: {
      restaurant_id: req.params.restaurantId
    },
    include: [
      {
        model: dealScheduled,
        as: "dealScheduled",
        where: {
          active: "active"
        },
        include: {
          model: deal,
          as: "deals"
        }
      },
    ]
  })
    .then(async (restaurant) => {
      moment.locale('ar-tn');
      let date = moment().format();
      await restaurant.dealScheduled.filter(async (item) => {
        // const datenow = moment(date).format("YYYY-MM-DD")
        await dealScheduled.findOne({
          where: {
            id: item.id
          },
          include: [
            {
              model: deal,
              as: "deals"
            }
          ]
        })
          .then(async (dealScheduleds) => {
            moment.locale('ar-tn');
            let date = moment().format();
            const datenow = moment(date).format("YYYY-MM-DD")
            const createtiame = moment(dealScheduleds.deals.expirydate).format("YYYY-MM-DD")
            const samee = moment(datenow).isAfter(createtiame)
            console.log(dealScheduleds.deals.expirydate)
            if (!samee) {
              return dealScheduleds
            } else {
              dealScheduleds.active = "inactive";
              await dealScheduleds.save();
            }
          })
      })
      await Restaurant.findOne({
        where: {
          restaurant_id: req.params.restaurantId
        },
        include: [
          {
            model: dealScheduled,
            as: "dealScheduled",
            where: {
              active: "active"
            },
            include: {
              model: deal,
              as: "deals"
            }
          },
        ]
      })
        .then(restaurant => {
          if (restaurant) {
            res.json(restaurant)
          } else {
            res.send('restaurant does not exist')
          }
        })
        .catch(err => {
          res.send('error: ' + err)
        })
    })
}
// Get Restaurant by Id inactive
exports.findByIdinActivedeal = (req, res, next) => {
  Restaurant.findOne({
    where: {
      restaurant_id: req.params.restaurantId
    },
    include: [
      {
        model: dealScheduled,
        as: "dealScheduled",
        where: {
          active: "inactive"
        },
        include: {
          model: deal,
          as: "deals"
        }
      },
    ]
  })
    .then(restaurant => {
      if (restaurant) {
        res.json(restaurant)
      } else {
        res.send('restaurant does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

// delete Restaurant
exports.deleteRestaurant = (req, res, next) => {
  Restaurant.destroy({
    where: {
      restaurant_id: req.params.restaurantId
    }
  })
    .then(() => {
      res.json({ status: 'Restaurant Deleted!' })
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
//Ajouter Restaurant
exports.create = (req, res) => {
  const RestaurantData = (req.body)
  Restaurant.findOne({
    where: {
      mail: req.body.mail
    }
  })
    .then(restaurant => {
      if (!restaurant) {
        const hash = crypto.createHash('sha1');
        const data = hash.update(req.body.password, 'utf-8');
        const gen_hash = data.digest('hex');
        RestaurantData.password = gen_hash
        Restaurant.create(RestaurantData)
          .then(restaurant => {
            res.json("Restaurant Succefuly registered")
          })
          .catch(err => {
            res.send('error: ' + err.message)
          })

      } else {
        res.send({ error: 'Restaurant already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
};
// Update partner
exports.updatePartner = (req, res, next) => {
  const PartnerData = (req.body)
  Restaurant.update(
    PartnerData,
    { where: { restaurant_id: req.params.restaurantId } }
  )
    .then(() => {
      res.json('Parnter Updated!')
    })
    .error(err => handleError(err))
  // }
};
exports.updatepass = (req, res) => {
  const hash = crypto.createHash('sha1');
  const data = hash.update(req.body.password, 'utf-8');
  const gen_hash = data.digest('hex');
  Restaurant.update(
    { password: gen_hash },
    { where: { restaurant_id: req.params.restaurantId } }
  )
    .then(() => {
      res.json('coupon reserved updated!')
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
  // Restaurant.save()
}
//login restaurant
exports.login = (req, res) => {
  Restaurant.findOne({
    where: {
      mail: req.body.mail
    }
  })
    .then(restaurants => {
      if (!restaurants) {
        return res.status(300).send({ msg: 'fail' });
      }
      const hashh = crypto.createHash('sha1');
      const hashpass = hashh.update(req.body.password, 'utf-8');
      const gen_hashh = hashpass.digest('hex');
      const compare = gen_hashh == restaurants.password
      var passwordIsValid = compare;
      if (!passwordIsValid) {
        return res.send("Invalid Password!")
      }

      if (restaurants.reset) {
        return res.json("reset password")
      } else {
        /* On créer le token CSRF */
        const xsrfToken = crypto.randomBytes(64).toString('hex');

        const accessToken = jwt.sign({ id: restaurants.restaurant_id, name: restaurants.name, mail: restaurants.mail, xsrfToken }, config.secret, {
          algorithm: 'HS256',
          expiresIn: 3600000 * 2 / 1000,
          subject: restaurants.restaurant_id.toString()
        });
        /* On créer le refresh token et on le stocke en BDD */
        const refreshToken = crypto.randomBytes(128).toString('base64');
        const restaurantdata = {
          logging_time: new Date(Date.now()),
          refreshToken: refreshToken,
          accessToken: accessToken,
          reset: false
        }
        restaurants.update(restaurantdata)
        res.cookie('access_token_Restaurant', accessToken, { httpOnly: true, secure: false, maxAge: 3600000 * 2 })
        res.cookie('refresh_token_Restaurant', refreshToken, { httpOnly: true, secure: false, maxAge: 2592000000 })
        console.log('Cookies: ', req.cookies)
        res.send({
          id: restaurants.restaurant_id,
          name: restaurants.name,
          discount: restaurants.discount,
          image: restaurants.image,
          access_Token: accessToken,
          reset: restaurants.reset,
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
//creation du dealtemp de la part du partenaire
exports.dealtemp = (req, res, next) => {

  // aws.config.update({
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS,
  //   accessKeyId: process.env.AWS_ACCESS_KEY,
  //   region: 'eu-west-3'
  // });

  // const s3 = new aws.S3({
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS,
  //   accessKeyId: process.env.AWS_ACCESS_KEY,
  //   region: 'eu-west-3'
  // });

  // const fileFilter = (req, file, cb) => {
  //   if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  //   }
  // };
  // const upload = multer({
  //   fileFilter,
  //   storage: multerS3({
  //     s3,
  //     bucket: process.env.AWS_BUCKET_NAME,
  //     limits: { fileSize: 30000000 }, // In bytes: 30000000 bytes = 30 MB
  //     metadata: (req, file, cb) => {
  //       cb(null, { fieldName: file.fieldname });
  //     },
  //     key: (req, file, cb) => {
  //       const ext = file.mimetype.split('/').pop();
  //       const fileName = `${Date.now().toString()}.${ext}`;
  //       cb(null, fileName);
  //     },
  //   }),
  // });

  // const singleUpload = upload.single('image')
  // const uploadImage = async (req, res) => {
  //   singleUpload(req, res, (error) => {
  //     if (error) {
  //       return res.status(422).send({ errors: [{ title: 'File Upload Error', detail: error.message }] });
  //     }
  //     return res.status(201).json({ imageUrl: req.file.location }); // The only field we need at the moment
  //   });
  // };

  // let msg = uploadImage()
  // console.log(msg)
  // return res.send(msg)
};

exports.dealtempp = (req, res, next) => {
  const DealtempData = (req.body)
  dealtemp.create(DealtempData)
    .then(dealtemp => {
      return res.json("dealtemp Succefuly created")
    })
    .catch(err => {
      return res.send('error: ' + err.message)
    })
}
//rating update
exports.updaterating = (req, res, next) => {
  const ratingdata = (req.body)
  const Coupondata = {
    noter: req.body.noter
  }
  Restaurant.update(
    ratingdata,
    { where: { restaurant_id: req.body.restaurantId } }
  )
    .then(() => {
      Coupon.update(
        Coupondata,
        { where: { coupon_id: req.body.coupon_id } }
      )
        .then(() => {
          res.json('rating updated!')
        })
        .error(err => handleError(err))
      // res.json('rating updated!')
    })
    .error(err => handleError(err))
  // }
};

exports.verifyQRcode = (req, res, next) => {
  const prefix = req.body.foodQR.split('-')[0];
  if (prefix === "foodr") {
    Reserveddeal.findOne({
      where: {
        foodQR: req.body.foodQR
      },
      include: [
        {
          model: User,
          as: "user"
        },
        {
          model: dealScheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals"
          }
        }
      ]
    })
      .then(data => {
        if (data) {
          if (data.restaurant_id == req.body.id) {
            res.json(data)
          } else {
            res.send('Coupon not valid for this partner')
          }
        } else {
          res.send('data does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  } else {
    Coupon.findOne({
      where: {
        foodQR: req.body.foodQR
      },
      include: [
        {
          model: User,
          as: "user"
        },
        {
          model: dealScheduled,
          as: "deal_scheduled",
          include: {
            model: deal,
            as: "deals"
          }
        }
      ]
    })
      .then(data => {
        if (data) {
          if (data.restaurant_id == req.body.id) {
            res.json(data)
          } else {
            res.send('Coupon not valid for this partner')
          }
        } else {
          res.send('data does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  }

}

exports.confimerCommande = (req, res, next) => {
  const typee = req.body.status;

  if (typee === "Sur place") {
    Reserveddeal.findOne({
      where: {
        id: req.body.id
      }
    })
      .then(async (reservedDeal) => {
        const postfix = reservedDeal.foodQR.split('-')[1];
        const Qrcode = `foodp-${postfix}`
        const donner = {
          nbre_coupons: reservedDeal.nbre_coupons,
          user_id: reservedDeal.user_id,
          restaurant_id: reservedDeal.restaurant_id,
          payement: "Déja payé",
          dealScheduled_id: reservedDeal.deal_scheduled_id,
          PriceAfterDiscount: req.body.PriceAfterDiscount,
          status_user: "confirmed",
          status_restaurant: "confirmed",
          earned_money: reservedDeal.earned_money,
          foodQR: Qrcode,
          reduce: reservedDeal.reduce,
          commission_rate: reservedDeal.commission_rate
        }
        await Coupon.create(donner)
          .then(async (coupon) => {
            const data = {
              commission_rate: reservedDeal.commission_rate,
              Price: reservedDeal.PriceAfterDiscount * reservedDeal.nbre_coupons,
              money_due: ((reservedDeal.PriceAfterDiscount * reservedDeal.nbre_coupons) * reservedDeal.commission_rate).toFixed(2),
              coupon_id: coupon.coupon_id,
              restaurant_id: reservedDeal.restaurant_id
            }
            await Billingdeal.create(data);
            await dealScheduled.findOne({
              where: { id: reservedDeal.deal_scheduled_id }
            })
              .then((res) => {
                if (res.nbre_redeemed_deal == null) {
                  res.nbre_redeemed_deal = parseInt(reservedDeal.nbre_coupons)
                } else {
                  res.nbre_redeemed_deal = parseInt(res.nbre_redeemed_deal) + parseInt(reservedDeal.nbre_coupons)
                }
                res.save()
              })
            await reservedDeal.destroy({ where: { id: reservedDeal.id } })
            return res.json("done")
          })

      })
      .catch(err => {
        res.send('error: ' + err)
      })
  } else {
    Coupon.findOne({
      where: {
        coupon_id: req.body.id
      }
    })
      .then(async (coupons) => {
        const data = {
          status_restaurant: "confirmed",
          payement: "Déja payé"
        }
        if (coupons.payement == "Déja payé") {
          return res.json("Coupon déja utilisé")
        } else {
          await coupons.update(data);
          return res.json("done")
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  }
};

// multiinvendu add partner
exports.MultiAdd = (req, res, next) => {
  const PartnerData = (req.body)
  PartnerData.forEach((partner) => {
    const hash = crypto.createHash('sha1');
    const dataa = hash.update(partner.password, 'utf-8');
    const gen_hash = dataa.digest('hex');
    const data = {
      name: partner.name,
      mail: partner.mail,
      password: gen_hash,
      description: partner.description,
      address: partner.address,
      url: partner.url,
      phone: partner.phone,
      latitude: partner.latitude,
      longitude: partner.longitude,
      type: partner.type,
      commission_rate: partner.commission_rate,
      startinghours: partner.startinghours,
      expiryhours: partner.expiryhours,
      rating: 0,
      image: partner.image,
      logourl: partner.logourl,
    }
    Restaurant.create(data)
      .then(() => {
        res.end("done")
        next();
      })
  })
};

// Update onesignal partner
exports.updatePartnerOnesignal = (req, res, next) => {

  // const PartnerData = (req.body)
  Restaurant.findOne({
    where: {
      restaurant_id: req.params.restaurantId
    }
  })
    .then(restaurant => {
      let onesignaldata = null;
      if (restaurant.OnesignalId == null) {
        onesignaldata = req.body.OnesignalId
      } else {
        const n = restaurant.OnesignalId.includes(req.body.OnesignalId);
        if (n) {
          onesignaldata = restaurant.OnesignalId
        } else {
          onesignaldata = `${restaurant.OnesignalId},${req.body.OnesignalId}`
        }
      }

      Restaurant.update(
        { OnesignalId: onesignaldata },
        { where: { restaurant_id: req.params.restaurantId } }
      )
        .then(() => {
          res.json('Parnter Updated!')
        })
        .error(err => handleError(err))
      // }
    })
    .catch(err => {
      res.send('error: ' + err)
    })

};
