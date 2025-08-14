'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Enums } = require("../utils/helpers");
const { BOOKED, CANCELLED, PENDING, INITIATED } = Enums.BookingStatus;
const dt = new Date() ;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
      type: Sequelize.ENUM,
      values: [BOOKED, CANCELLED, PENDING, INITIATED],
      defaultValue:INITIATED,
      allowNull:false
    },
      noOfSeats:{
        type : Sequelize.INTEGER,
        allowNull: false,
        defaultValue:1
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
       type: Sequelize.DATE,
        defaultValue : dt
         
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : dt
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};