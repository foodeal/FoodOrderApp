const config = require("../db/db.js");

const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    port: config.PORT,
    dialect: config.dialect,
    operatorsAliases: false,
  
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
    },
  });
const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

//Administrateur
db.admin = require("./Admin.js")(sequelize, Sequelize);

//user
db.user = require("./User.js")(sequelize, Sequelize);
db.location = require("./Location.js")(sequelize, Sequelize);
db.restaurant = require("./Restaurant.js")(sequelize, Sequelize);
db.user_restaurant_preferences = require("./User_restau_preferences.js")(sequelize, Sequelize);
db.coupon_history = require("./Coupon_History.js")(sequelize, Sequelize);
db.bookcoupon = require("./Bookcoupon.js")(sequelize, Sequelize);
db.coupon = require("./Coupon.js")(sequelize, Sequelize);

//restaurant
db.restaurant = require("./Restaurant.js")(sequelize, Sequelize);
db.dealtemp = require("./Dealtemp.js")(sequelize, Sequelize);
db.monthlubilling = require("./Monthlybilling.js")(sequelize, Sequelize);
db.deal = require("./Deal.js")(sequelize,Sequelize);
db.invendu = require("./Invendu.js")(sequelize, Sequelize);



//deal
db.dealScheduled = require("./Deal_scheduled.js")(sequelize,Sequelize);
db.reserveddeal = require("./Reserved_deal.js")(sequelize, Sequelize);


//coupon
db.billingdeal = require("./Billingdeal.js")(sequelize,Sequelize);


/*######################################################*/
//user
// db.user_restaurant_preferences.belongsToMany(db.user, {
//   through: "user_restau_preferences_user",
//   as: "users",
//   foreignKey: "user_restau_preferences_id",
// });
// db.user.belongsToMany(db.user_restaurant_preferences, {
//   through: "user_restau_preferences_user",
//   as: "preferences",
//   foreignKey: "user_id",
// });
db.user.hasMany(db.user_restaurant_preferences, { foreignKey: "user_id", sourceKey: "user_id", as: "user_restaurant_preferences" });
db.user_restaurant_preferences.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
  targetKey: "user_id",
});

db.user.hasMany(db.coupon, { foreignKey: "user_id", sourceKey: "user_id", as: "coupon" });
db.coupon.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
  targetKey: "user_id",
});

db.user.hasMany(db.coupon_history, { foreignKey: "user_id", sourceKey: "user_id", as: "coupon_history" });
db.coupon_history.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
  targetKey: "user_id",
});

db.user.hasMany(db.location, { foreignKey: "user_id", sourceKey: "user_id", as: "location" });
db.location.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
  targetKey: "user_id",
});

/*######################################################*/
//restaurant
db.restaurant.hasMany(db.user_restaurant_preferences, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "user_restaurant_preferences" });
db.user_restaurant_preferences.belongsTo(db.restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
  targetKey: "restaurant_id",
});

db.restaurant.hasMany(db.dealScheduled, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "dealScheduled" });
db.dealScheduled.belongsTo(db.restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
  targetKey: "restaurant_id",
});

db.restaurant.hasMany(db.monthlubilling, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "monthlubilling" });
db.monthlubilling.belongsTo(db.restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
  targetKey: "restaurant_id",
});


db.monthlubilling.hasMany(db.billingdeal, { foreignKey: "monthlubilling_id", sourceKey: "id", as: "billingdeal" });
db.billingdeal.belongsTo(db.monthlubilling, {
  foreignKey: "monthlubilling_id",
  as: "monthlubilling",
  targetKey: "id",
});

// db.restaurant.hasMany(db.billingdeal, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "billingdeal" });
// db.billingdeal.belongsTo(db.restaurant, {
//   foreignKey: "restaurant_id",
//   as: "restaurant",
//   targetKey: "restaurant_id",
// });

db.restaurant.hasMany(db.deal, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "deal" });
db.deal.belongsTo(db.restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
  targetKey: "restaurant_id",
});

db.restaurant.hasMany(db.coupon, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "coupon" });
db.coupon.belongsTo(db.restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
  targetKey: "restaurant_id",
});

db.restaurant.hasMany(db.reserveddeal, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "reserveddeal" });
db.reserveddeal.belongsTo(db.restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
  targetKey: "restaurant_id",
});

db.restaurant.hasMany(db.invendu, { foreignKey: "restaurant_id", sourceKey: "restaurant_id", as: "Menu" });
db.invendu.belongsTo(db.restaurant, {
  foreignKey: "restaurant_id",
  as: "partner",
  targetKey: "restaurant_id",
});

/*#####################################################*/
//deal
db.deal.hasMany(db.dealScheduled, { foreignKey: "deal_id", sourceKey: "deal_id", as: "DealScheduled" });
db.dealScheduled.belongsTo(db.deal, {
  foreignKey: "deal_id",
  as: "deals",
  targetKey: "deal_id",
});

db.bookcoupon.belongsTo(db.dealScheduled, {foreignKey: 'dealScheduled_id', targetKey: 'id'});
db.dealScheduled.hasOne(db.bookcoupon, {foreignKey: 'dealScheduled_id', targetKey: 'id'});

db.user.hasMany(db.reserveddeal, { foreignKey: "user_id", sourceKey: "user_id", as: "reserved_deal" });
db.reserveddeal.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "user",
  targetKey: "user_id",
});

db.dealScheduled.hasMany(db.reserveddeal, { foreignKey: "deal_scheduled_id", sourceKey: "id", as: "deal_scheduled" });
db.reserveddeal.belongsTo(db.dealScheduled, {
  foreignKey: "deal_scheduled_id",
  as: "deal_scheduled",
  targetKey: "id",
});


/*#####################################################*/
//coupon
db.coupon.hasMany(db.billingdeal, { foreignKey: "coupon_id", sourceKey: "coupon_id", as: "billingdeal" });
db.billingdeal.belongsTo(db.coupon, {
  foreignKey: "coupon_id",
  as: "coupons",
  targetKey: "coupon_id",
});

db.coupon.belongsTo(db.dealScheduled, {foreignKey: 'dealScheduled_id', targetKey: 'id',as: "deal_scheduled"});
db.dealScheduled.hasOne(db.coupon, {foreignKey: 'dealScheduled_id', targetKey: 'id'});



module.exports = db