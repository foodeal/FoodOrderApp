module.exports = (sequelize, DataTypes) => {
    const Coupon = sequelize.define("coupon", {
          coupon_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          date: {
            type: DataTypes.DATE
          },
          PriceAfterDiscount: {
            type: DataTypes.REAL
          },
          earned_money: {
            type: DataTypes.REAL
          },
          status_user: {
            type: DataTypes.STRING
          },
          status_restaurant: {
            type: DataTypes.STRING
          },
          time: {
            type: DataTypes.STRING
          },
          nbre_coupons: {
            type: DataTypes.INTEGER
          },
          payement: {
            type: DataTypes.STRING,
          },
          noter: {
            type: DataTypes.BOOLEAN
          },
          foodQR: {
            type: DataTypes.STRING
          },
          reduce: {
            type: DataTypes.BOOLEAN
          },
        });
      
        return Coupon;
      };