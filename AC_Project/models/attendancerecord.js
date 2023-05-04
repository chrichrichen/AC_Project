'use strict';
module.exports = (sequelize, DataTypes) => {
  const AttendanceRecord = sequelize.define('AttendanceRecord', {
    userId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    clockIn: DataTypes.TIME,
    clockOut: DataTypes.TIME
  }, {
    underscored: true,
  });
  AttendanceRecord.associate = function(models) {
    // associations can be defined here
  };
  return AttendanceRecord;
};