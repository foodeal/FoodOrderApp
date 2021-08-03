module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define("restaurant", {
          restaurant_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: DataTypes.STRING
          },
          mail: {
            type: DataTypes.STRING
          },
          password: {
            type: DataTypes.STRING
          },
          typePayment:{
            type: DataTypes.STRING
          },
          description: {
            type: DataTypes.STRING
          },
          address: {
            type: DataTypes.STRING
          },
          url: {
            type: DataTypes.STRING
          },
          phone: {
            type: DataTypes.INTEGER
          },
          latitude: {
            type: DataTypes.REAL,
          },
          longitude: {
            type: DataTypes.REAL,
          },
          type: {
            type: DataTypes.STRING
          },
          OnesignalId: {
            type: DataTypes.STRING
          },
          commission_rate:{
            type: DataTypes.REAL
          },
          logourl: {
            type: DataTypes.STRING
          },
          image: {
            type: DataTypes.STRING
          },
          accessToken: {
            type: DataTypes.STRING
          },
          refreshToken: {
            type: DataTypes.STRING
          },
          startinghours:{
            type: DataTypes.STRING
          },
          expiryhours: {
            type: DataTypes.STRING
          },
          discount: {
            type: DataTypes.STRING
          },
          rating: {
            type: DataTypes.REAL
          }
        });
      
        return Restaurant;
      };