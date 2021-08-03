const jwt = require("jsonwebtoken");
const config = require("../config/authJwt.js");
const db = require('../models');
const Restaurant = db.restaurant;

let verifyToken = (req, res, next) => {
    let cookies = req.cookies;
    let headers = req.headers;
    
    /* On vérifie que le JWT est présent dans les cookies de la requête */
    if (!cookies || !cookies.access_token_Restaurant) {
      return res.status(401).json({ message: 'Missing token in cookie' });
    }
    const accessToken = cookies.access_token_Restaurant;

     /* On vérifie que le token CSRF est présent dans les en-têtes de la requête */
     if (!headers || !headers['x-xsrf-token']) {
      return res.status(401).json({ message: 'Missing XSRF token in headers' });
    }
    const xsrfToken = headers['x-xsrf-token'];

    
    const decodedToken = jwt.verify(accessToken, config.secret, {
      algorithm: 'HS256'
    });

    /* On vérifie que le token CSRF correspond à celui présent dans le JWT  */
    if (xsrfToken !== decodedToken.xsrfToken) {
      return res.status(401).json({ message: 'Bad xsrf token' });
    }
    Restaurant.findOne({
        where: {
          restaurant_id: decodedToken.id
        }
      }).then(restaurant=> {
      req.restaurant = JSON.stringify(restaurant);
      console.log(req.cookies)
      next();
      }).catch(err => {
        res.send('error: ' + err)
      })
    
};

  const authJwt = {
    verifyToken: verifyToken,
  };
  module.exports = authJwt;