module.exports = (sequelize, DataTypes) => {
  const Deal_scheduled = sequelize.define("deal_scheduled", {
    quantity: {
      type: DataTypes.INTEGER
    },
    nbre_redeemed_deal: {
      type: DataTypes.INTEGER
    },
    startingdate: {
      type: DataTypes.DATE
    },
    expirydate: {
      type: DataTypes.DATE
    },
    startingdate_hours: {
      type: DataTypes.STRING
    },
    expirydate_hours: {
      type: DataTypes.STRING
    },
    active: {
      type: DataTypes.STRING
    },
  });

  return Deal_scheduled;
};