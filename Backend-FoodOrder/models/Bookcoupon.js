module.exports = (sequelize, DataTypes) => {
    const Bookcoupon = sequelize.define("bookcoupon", {
      coupon_date: {
        type: DataTypes.DATE,
      },
    });
  
    return Bookcoupon;
  };