const { dealScheduled, deal } = require('../models');
const db = require('../models');
const Reserved_deal = db.reserveddeal;
const DealScheduled = db.dealScheduled;
const Deal = db.deal;
const Restaurant = db.restaurant;
var moment = require('moment');
require('dotenv').config({ path: '.env' })
const async = require('async')
const nodemailer = require('nodemailer');


// Get All deals
exports.findAllDeal = async (req, res, next) => {
  Promise.all([
    DealScheduled.findAll({
      include: [
        {
          model: Deal,
          as: "deals",
          include: {
            model: Restaurant,
            as: "restaurant"
          }
        }
      ]
    })
      .then(async (dealScheduleds) => {
        moment.locale('ar-tn');
        let date = moment().format();
        await dealScheduleds.filter(async (item) => {
          const datenow = moment(date).format("YYYY-MM-DD")
          const startingdatee = moment(item.deals.startingdate).format("YYYY-MM-DD")
          const expirydatee = moment(item.deals.expirydate).format("YYYY-MM-DD")
          const after = moment(datenow).isSameOrAfter(startingdatee)
          const before = moment(datenow).isSameOrBefore(expirydatee)
          const diffrstart = moment.duration(moment(datenow).diff(moment(startingdatee)));
          const diffrend = moment.duration(moment(expirydatee).diff(moment(datenow)));
          const daysstart = parseInt(diffrstart.asDays())
          const daysend = parseInt(diffrend.asDays())
          const startingdate = moment(item.deals.startingdate).add(daysstart, 'days')
          const expitydate = moment(item.deals.expirydate).subtract(daysend, 'days')
          const qt = item.quantity - item.nbre_redeemed_deal > 0 ? true:false; 
          const result = after && before
          if (result && qt) {
            item.startingdate = startingdate;
            item.expirydate = expitydate;
            await item.save();
            return item
          } else {
            item.active = "inactive";
            await item.save();
          }
        })
        // return res.json(array)
        await DealScheduled.findAll({
          where: {
            active: "active"
          },
          include: [
            {
              model: Deal,
              as: "deals",
              include: {
                model: Restaurant,
                as: "restaurant"
              }
            }
          ]
        }).then(dealScheduleds => {
          return res.json(dealScheduleds)
        })
          .catch(err => {
            res.send('error: ' + err)
          })
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  ])
};
// // Get deals by id
exports.findDeal = (req, res, next) => {
  DealScheduled.findAll({
    where: {
      id: req.params.deal_id
    }, include: [
      {
        model: Deal,
        as: "deals",
      }
    ]
  })
    .then(dealScheduleds => {
      return res.json(dealScheduleds)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
// // Get active deals
exports.findactiveDeal = (req, res, next) => {
  Deal.findAll()
    .then(deals => {
      return res.json(deals)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
//create new dealScheduled
exports.createdealscheduled = (req, res) => {
  const Dealdata = (req.body)

  DealScheduled.create(Dealdata)
    .then(deal => {
      return res.json("dealScheduled Succefuly created")
    })
    .catch(err => {
      return res.send('error: ' + err.message)
    })
};
//create new deal
exports.createdeal = (req, res) => {
  const Dealdata = (req.body)
  var start = moment(req.body.startingdate);
  var hourssta = req.body.startinghours.split(':')[0]
  var minussta = req.body.startinghours.split(':')[1]
  start.set({ h: hourssta, m: minussta, s: 00 })
  var end = moment(req.body.expirydate);
  var hoursend = req.body.expiryhours.split(':')[0]
  var minusend = req.body.expiryhours.split(':')[1]
  end.set({ h: hoursend, m: minusend, s: 00 })
  let data = {
    description: req.body.description,
    discount: req.body.discount,
    deal_description: req.body.deal_description,
    PriceAfterDiscount: req.body.PriceAfterDiscount,
    PriceBeforeDiscount: req.body.PriceBeforeDiscount,
    startingdate: start.format(),
    expirydate: end.format(),
    restaurant_id: req.body.restaurant_id,
    imageurl: req.body.imageurl
  }
  Deal.create(data)
    .then(deal => {
      return res.json("deal Succefuly created")
    })
    .catch(err => {
      return res.send('error: ' + err.message)
    })
};
//create new multi-deal
exports.createMultiDeal = async (req, res, next) => {
  const PanierData = (req.body)
  Promise.all([
    PanierData.forEach(async (panier) => {
      let description = ''
      let PriceBeforeDiscount = panier.PriceBeforeDiscount
      description = `${panier.name}`
      let PriceAfterDiscount = panier.PriceAfterDiscoun
      await Restaurant.findOne({
        where: {
          restaurant_id: panier.partnerId
        }
      })
        .then(async (restaurant) => {
          var start = moment(panier.startingDat);
          var hourssta = restaurant.startinghours.split(':')[0]
          var minussta = restaurant.startinghours.split(':')[1]
          start.set({ h: hourssta, m: minussta, s: 00 })
          var end = moment(panier.expiryDat);
          var hoursend = restaurant.expiryhours.split(':')[0]
          var minusend = restaurant.expiryhours.split(':')[1]
          end.set({ h: hoursend, m: minusend, s: 00 })
          var enddealschedu = moment(panier.startingDat);
          enddealschedu.set({ h: hoursend, m: minusend, s: 00 })
          console.log(start.format())
          let data = {
            description: description,
            discount: `${panier.discount}%`,
            deal_description: panier.description,
            PriceAfterDiscount: PriceAfterDiscount,
            PriceBeforeDiscount: PriceBeforeDiscount,
            startingdate: start.format(),
            expirydate: end.format(),
            restaurant_id: panier.partnerId,
            imageurl: panier.image
          }
                await Deal.create(data)
                  .then(async (deal) => {
                    const dataa = ({
                      deal_id: deal.deal_id,
                      quantity: panier.qt,
                      nbre_redeemed_deal: 0,
                      active: "active",
                      startingdate: start.format(),
                      expirydate: enddealschedu.format(),
                      startingdate_hours: restaurant.startinghours,
                      expirydate_hours: restaurant.expiryhours,
                      restaurant_id: panier.partnerId,
                    })
                    DealScheduled.create(dataa).then(() => {
                      res.end("done")
                      next();
                    })

                  })
      })
        .catch(err => {
          res.status(400).json({ error: err.message })
        })
    })
  ])
};

exports.updatedealScheduled = (req, res, next) => {
  const dealdata = (req.body)
  dealScheduled.update(
    dealdata,
    { where: { id: req.params.id } }
  )
    .then(() => {
      res.json('deal updated!')
    })
    .error(err => handleError(err))
  // }
};
exports.updatedeal = (req, res, next) => {
  const dealdata = (req.body)
  Deal.update(
    dealdata,
    { where: { deal_id: req.params.id } }
  )
    .then(() => {
      res.json('deal updated!')
    })
    .error(err => handleError(err))
  // }
};

exports.deletedeals = (req, res, next) => {
  DealScheduled.update(
    {active: "inactive"},
    {where: {
      id: req.params.dealsId
    }
  })
    .then(() => {
      res.json('dealscheduled Deleted!')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
exports.deletedealss = (req, res, next) => {
  Deal.destroy({
    where: {
      deal_id: req.params.deals_Id
    }
  })
    .then(() => {
      res.json('deals Deleted!')
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};
exports.reservedDeal = (req, res, next) => {
  const reservedData = {
    time: req.body.heure,
    nbre_coupons: req.body.nbre_coupons,
    earned_money: req.body.earned_money,
    payement: req.body.payement,
    type: req.body.type,
    user_id: req.body.user_id,
    timepickup: req.body.createtime,
    deal_scheduled_id: req.body.dealScheduled_id,
    restaurant_id: req.body.restaurant_id,
    PriceAfterDiscount: req.body.PriceAfterDiscount,
    foodQR: req.body.foodQR,
    reduce: req.body.reduce,
    commission_rate: req.body.commission_rate
  }
  Reserved_deal.create(reservedData)
    .then(async(reserved_deal) => {
      // var transporter = nodemailer.createTransport({
      //   host: 'smtp.gmail.com',
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
      //   subject: 'Nouvelle Commande Réserver ID' + reserved_deal.id,
      //   html:
      //     '<b>Nouvelle commande: </b>' + reserved_deal.id +'\n\n<br>'+
      //     '<b>Nom et prénom: </b>' + req.body.username +'\n\n<br>'+
      //     '<b>Numéro: </b>' + req.body.numero +' \n\n<br>'+
      //     '<b>Description: </b>'  + req.body.description +'\n\n<br>'+
      //     '<b>Détails de la commande: </b>'  + req.body.detail +'\n\n<br>'+
      //     '<b>Qté: </b>'  +  req.body.nbre_coupons +' \n\n<br>'+
      //     '<b>Prix: </b>'  + req.body.PriceAfterDiscount*req.body.nbre_coupons +'\n\n<br>'+
      //     '<b>Partenaire: </b>' + req.body.nomPartner +' \n\n<br>'+
      //     '<b>Type: </b>' + req.body.typee +' \n\n<br>'
      // };
      // await new Promise((rsv, rjt) => {
      //   transporter.sendMail(mailOptions, function (error, info) {
      //     if (error) {
      //       res.log(error)
      //       next(err);
      //     } else {
      //       console.log('Email sent: ' + info.response);
      //       res.json("Reserved coupon added Succefuly")
      //       next();
      //     }
      //   })
      // });
                  res.json("Reserved coupon added Succefuly")

    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
}
//change active coupon to expired coupon if time finiched
exports.updatetypereservedcoupon = (req, res, next) => {
  const reservedData = (req.body)
  Reserved_deal.update(
    reservedData,
    { where: { id: req.params.id } }
  )
    .then(() => {
      res.json('coupon reserved updated!')
    })
    .catch(err => {
      res.send('error: ' + err.message)
    })
}
