module.exports = (sequelize, DataTypes) => {
  const Reserved_deal = sequelize.define("reserved_deal", {
    time: {
      type: DataTypes.STRING
    },
    nbre_coupons: {
      type: DataTypes.INTEGER
    },
    payement: {
      type: DataTypes.STRING,
    },
    type:{
      type: DataTypes.STRING,
    },
    PriceAfterDiscount: {
      type: DataTypes.REAL
    },
    earned_money: {
      type: DataTypes.REAL
    },
    timepickup: {
      type: DataTypes.DATE
    },
    motif: {
      type: DataTypes.STRING
    },
    foodQR: {
      type: DataTypes.STRING
    },
    reduce: {
      type: DataTypes.BOOLEAN
    },
    commission_rate:{
      type: DataTypes.REAL
    }
  });

  return Reserved_deal;
};