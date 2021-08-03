module.exports = (sequelize, DataTypes) => {
    const Coupon_history = sequelize.define("coupon_history", {
      date: {
        type: DataTypes.DATE,
      },
    });
  
    return Coupon_history;
  };