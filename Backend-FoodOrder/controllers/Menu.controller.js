const db = require('../models');
const Restaurant = db.restaurant;
const config = require("../config/authJwt.js");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Invendu = db.invendu;

exports.findAllInvendu = (req, res, next) => {
  Invendu.findAll().then(invendu => {
      return res.json(invendu)
    })
    .catch(err => {
      res.send('error: ' + err)
    })
};

// Get offres by Id
exports.findById = (req, res, next) => {
  Invendu.findAll({
      where: {
        restaurant_id: req.params.invenduId
      },
     
    })
      .then(invendu => {
        if (invendu) {
          res.json(invendu)
        } else {
          res.send('Invendu does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  };

// delete offres
exports.deleteInvendu = (req, res, next) => {
  Invendu.destroy({
      where: {
        id: req.params.invenduId
      }
    })
      .then(() => {
        res.json({ status: 'Invendu Deleted!' })
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  };
  
  //Ajouter offres
  exports.create = (req, res) => {
    const InvenduData = (req.body)
    Invendu.create(InvenduData)
      .then(() => {
        return res.json("Invendu ajouter avec success")
      })
      .catch(err => {
        res.send('error: ' + err.message)
      })
  };
  
// Update menu
exports.updateMenu = (req, res, next) => {
  const Menudata = (req.body)
  Invendu.update(
    Menudata,
    { where: { id: req.params.invenduId } }
  )
    .then(() => {
      res.json('Invendu Updated!')
    })
    .error(err => handleError(err))
  // }
};

// multiinvendu add menu
exports.MultiAdd = (req, res, next) => {
  const Menudata = (req.body)
  Menudata.forEach((menu)=>{
    const data = {
      nom: menu.nom,
      image: menu.image,
      PriceBeforeDiscount: parseFloat(menu.PriceBeforeDiscount),
      PriceAfterDiscoun: parseFloat(menu.PriceAfterDiscoun),
      discount: menu.discount,
      description: menu.description,
      restaurant_id: parseInt(menu.restaurant_id)
    }
    Invendu.create(data)
    .then(() => {
      res.end("done")
      next();
    })
  })
};