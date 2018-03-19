const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
        }
      }
    }
  );

  User.associate = function(models) {
    models.User.hasMany(models.Post);
  };

  return User;
};
