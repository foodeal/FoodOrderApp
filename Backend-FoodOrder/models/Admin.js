module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define("admin", {
      firstname: {
        type: DataTypes.STRING
      },
      lastname: {
        type: DataTypes.STRING
      },
      username: {
        type: DataTypes.STRING
      },
      mail: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      logging_time:{
        type: DataTypes.DATE
      },
      accessToken: {
        type: DataTypes.STRING
      },
      refreshToken: {
        type: DataTypes.STRING
      },
    });
  
    return Admin;
  };