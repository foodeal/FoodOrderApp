module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    mail: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    reset: {
      type: DataTypes.BOOLEAN
    },
    new: {
      type: DataTypes.BOOLEAN
    },
    id: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    },
    OnesignalId: {
      type: DataTypes.STRING
    },
    active: {
      type: DataTypes.STRING
    },
    vcode: {
      type: DataTypes.STRING
    },
    dcode: {
      type: DataTypes.STRING
    },
    accessToken: {
      type: DataTypes.STRING
    },
    refreshToken: {
      type: DataTypes.STRING
    },
    birthday: {
      type: DataTypes.DATE
    },
    age: {
      type: DataTypes.INTEGER
    },
    logging_time:{
      type: DataTypes.DATE
    },
    phone:{
      type: DataTypes.INTEGER
    },
    pays: {
      type: DataTypes.STRING
    },
    ville: {
      type: DataTypes.STRING
    },
    sexe:{
      type: DataTypes.STRING
    },
    hearAboutUs:{
      type: DataTypes.STRING
    }
  });

  return User;
};