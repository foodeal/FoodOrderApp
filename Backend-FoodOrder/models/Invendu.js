module.exports = (sequelize, DataTypes) => {
    const Invendu = sequelize.define("invendu", {
          nom: {
            type: DataTypes.STRING
          },
          image: {
            type: DataTypes.STRING
          },
          PriceBeforeDiscount:{
            type: DataTypes.REAL
          },
          PriceAfterDiscoun:{
            type: DataTypes.REAL
          },
          discount: {
            type: DataTypes.STRING
          },
          description: {
            type: DataTypes.STRING
          },
        });
      
        return Invendu;
      };

