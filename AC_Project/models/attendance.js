'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    userId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    time: DataTypes.DATE
  }, {});
  Attendance.associate = function(models) {
    // associations can be defined here
  };
  return Attendance;
};