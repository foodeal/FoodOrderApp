module.exports = (sequelize, DataTypes) => {
  const Deal = sequelize.define("deal", {
    deal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    imageurl: {
      type: DataTypes.STRING
    },
    discount: {
      type: DataTypes.STRING
    },
    PriceAfterDiscount: {
      type: DataTypes.REAL
    },
    PriceBeforeDiscount: {
      type: DataTypes.REAL
    },
    description: {
      type: DataTypes.STRING
    },
    deal_description: {
      type: DataTypes.STRING
    },
    startingdate: {
      type: DataTypes.DATE
    },
    expirydate: {
      type: DataTypes.DATE
    },
  });

  return Deal;
};