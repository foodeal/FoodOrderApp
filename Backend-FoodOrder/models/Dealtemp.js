module.exports = (sequelize, DataTypes) => {
  const Dealtemp = sequelize.define("dealtemp", {
    discount: {
      type: DataTypes.STRING
    },
    PriceAfterDiscount: {
      type: DataTypes.REAL
    },
    PriceBeforeDiscount: {
      type: DataTypes.REAL
    },
    imageurl: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    startingdate: {
      type: DataTypes.DATE
    },
    expirydate: {
      type: DataTypes.DATE
    },
    pack_deal: {
      type: DataTypes.STRING
    },
  });

  return Dealtemp;
};