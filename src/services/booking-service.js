const { BookingRepository } = require("../repositories");
const bookingRepository = new BookingRepository();
const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const db = require("../models");
const { AppError } = require("../utils/errors");
const { Enums } = require("../utils/helpers");
const { BOOKED, CANCELLED, PENDING, INITIATED } = Enums.BookingStatus;

// Create a booking
async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`http://localhost:5000/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;

        if (data.noOfSeats > flightData.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = flightData.price * data.noOfSeats;
        const payload = { ...data, totalCost: totalBillingAmount };

        const booking = await bookingRepository.create(payload, transaction);

        // Reserve seats
        await axios.patch(`http://localhost:5000/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats
        });

        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

// Make payment for a booking
async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);

        const dt = new Date(bookingDetails.createdAt);
        let curr = new Date();
        curr = new Date(curr.getTime() - ((5 * 60 + 30) * 60 * 1000)); // Adjust to UTC

        if (bookingDetails.status === CANCELLED) {
            throw new AppError("The booking has already been cancelled.", StatusCodes.BAD_REQUEST);
        }

        const diff = curr - dt; // in milliseconds
        if (diff > 20 * 60 * 1000) { // > 20 minutes
            await cancelBooking(bookingDetails.id);
            throw new AppError("Times up, try booking sometime later", StatusCodes.GATEWAY_TIMEOUT);
        }

        if (data.totalCost !== bookingDetails.totalCost) {
            throw new AppError("The total cost doesn't match", StatusCodes.BAD_GATEWAY);
        }

        if (data.userId !== bookingDetails.userId) {
            throw new AppError("The user ID doesn't match", StatusCodes.BAD_GATEWAY);
        }

        // Payment successful → mark as booked
        await bookingRepository.update(
            data.bookingId,
            { status: BOOKED },
            transaction
        );

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

// Cancel booking
async function cancelBooking(bookingId) {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);

        if (bookingDetails.status === CANCELLED) {
            await transaction.commit();
            return true;
        }

        // Release seats
        await axios.patch(`http://localhost:5000/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: 0
        });

        await bookingRepository.update(
            bookingId,
            { status: CANCELLED },
            transaction
        );

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
async function cancelOldBookings(){
       try{
          const dt = new Date(Date.now() - 300000) ;
         const response = await bookingRepository.cancelOldBookings(dt) ;
         return response
       } catch(err){
        console.log("Printing this err = ",error)
       }
}

module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings
};
