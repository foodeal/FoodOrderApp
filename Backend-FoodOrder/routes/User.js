const users = require("../controllers/users.controller");

module.exports = function (app, limit) {
  //favorite
  app.post("/users/favorite", users.addfavorite, limit);
  // Get All Users
  app.get("/users", users.findAllUser, limit);
  // Get User by Id
  app.get("/users/:userId", users.findById, limit);
  // Get User by Id reserved deal
  app.get("/reserveddealuser/:userId", users.findByIdreserved, limit);
  //Get User by Id coupons
  app.get("/couponsdealuser/:userId", users.findByIdcoupons, limit);
  //Get User by Id coupons confirmed
  app.get("/couponsConfi/:userId", users.findByIdcouponsCon, limit);
  // Get User by Id reserved deal favorite
  app.get("/finduserFavorite/:userId", users.findByIdfavoritereserved, limit);
  //Forget_password
  app.post("/forgot", users.forgotPassword, limit);
  //Reset_password
  app.post("/reset", users.resetPassword, limit);
  //Update User
  app.put("/users/:userId", users.updateUser, limit);
  // delete User
  app.delete("/users/:userId", users.deleteUser, limit);
  // delete favorite
  app.delete("/deleteFavorite", users.deletefavorite, limit);
  //coupon
  app.post("/coupon", users.coupon, limit);
  //add location
  app.post("/location", users.addloacalisation, limit)
  // update coupon table
  app.put("/coupondealupdate/:couponId", users.updateCoupon, limit)
  // Get User by Id reserved deal
  app.get("/ActiveResCou/:userId", users.ActiveResCou, limit);
  // Get User by Id reserved deal expire
  app.get("/ExpiredResCou/:userId", users.ExpiredResCou, limit);

}