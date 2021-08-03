module.exports = (sequelize, DataTypes) => {
    const Monthlybilling = sequelize.define("monthlybilling", {
      monthly_invoice: {
        type: DataTypes.REAL,
      },
      month: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.STRING,
      },
      
    });
  
    return Monthlybilling;
  };