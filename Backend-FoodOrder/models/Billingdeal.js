module.exports = (sequelize, DataTypes) => {
    const Billingdeal = sequelize.define("billingdeal", {
        commission_rate: {
            type: DataTypes.REAL
          },
        Price: {
            type: DataTypes.REAL
          },
        money_due: {
            type: DataTypes.REAL
          },
        error_pourcentage: {
            type: DataTypes.REAL
          },    
    });
  
    return Billingdeal;
  };