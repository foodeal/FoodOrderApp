module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("location", {
    Date: {
      type: DataTypes.DATE,
    },
    latitude: {
      type: DataTypes.REAL,
    },
    longitude: {
      type: DataTypes.REAL,
    },
    address: {
      type: DataTypes.STRING
    }
  });

  return Location;
};