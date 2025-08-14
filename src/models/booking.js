'use strict';
const { Model } = require('sequelize');
const { Enums } = require("../utils/helpers");
const { BOOKED, CANCELLED, PENDING, INITIATED } = Enums.BookingStatus;

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // define association here
    }
  }

  Booking.init({
    flightId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: [BOOKED, CANCELLED, PENDING, INITIATED],
      defaultValue:INITIATED,
     // allowNull:false
    },
    noOfSeats: { // number of seats needed
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue:1
    },
    totalCost: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
