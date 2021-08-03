const restaurants = require("../controllers/restaurant.controller.js");

module.exports = function (app, limit) {

// Get All restaurants
app.get("/restaurants", restaurants.findAllRestaurant, limit);
// Get restaurants by Id
app.get("/restaurants/:restaurantId", restaurants.findById, limit);
// Get restaurants by Id reserved
app.get("/restaurants-reserved-deal/:restaurantId", restaurants.findByIdreserved, limit);
// Get restaurants by Id active deal
app.get("/ActiveDealRestaurant/:restaurantId", restaurants.findByIdActivedeal, limit);
// Get restaurants by Id inactive deal
app.get("/InactiveDealRestaurant/:restaurantId", restaurants.findByIdinActivedeal, limit);
// delete restaurants
app.delete("/restaurants/:restaurantId", restaurants.deleteRestaurant, limit);
//Ajouter Restaurant
app.post("/restaurants/register", restaurants.create, limit);
//login Restaurant
app.post("/restaurants/login", restaurants.login, limit);
//creation du dealtemp de la part du partenaire
app.post("/restaurants/dealtemp", restaurants.dealtempp, limit);
//rating update
app.put("/rating", restaurants.updaterating, limit);
app.put("/updatepass/:restaurantId", restaurants.updatepass, limit);
app.post("/restaurants/dealtempp", restaurants.dealtemp, limit);
//Update Partner
app.put("/restaurants/:restaurantId", restaurants.updatePartner, limit);
//Update Onesignal Partner
app.put("/restaurants/Onesignal/:restaurantId", restaurants.updatePartnerOnesignal, limit);
//voucherverifier
app.post("/verifyQRcode", restaurants.verifyQRcode, limit);
//confimercomande
app.post("/ConfirmedCom", restaurants.confimerCommande, limit);
//multiPartner 
app.post("/restaurants/MultiAdd", restaurants.MultiAdd, limit);
}