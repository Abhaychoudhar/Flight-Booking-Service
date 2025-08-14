const {BookingRepository } = require("../repositories")
const bookingRepository =  new  BookingRepository() ;
const axios = require("axios")
const {StatusCodes}  =require("http-status-codes")
const db = require("../models") ;
const { SuccessResponse, ErrorResponse } = require('../utils/common');
const {AppError} = require("../utils/errors")
async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`http://localhost:5000/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        //console.log(flight.data)
        if (data.noofSeats > flightData.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = flightData.price * data.noOfSeats ;
        const payload = {...data, totalCost : totalBillingAmount }
        console.log(payload)
        // this way we have created a booking in the DB with 'initiated' status
        // and that too we have done in the same transaction
        const booking = await bookingRepository.create(payload,transaction)
         // now we have updated (or we can say we have reserved seats) for the particular booking 
         // if anything throws error the whole transaction will rollback and no change to DB will persist
        await axios.patch(`http://localhost:5000/api/v1/flights/${data.flightId}/seats`,{
            seats : data.noOfSeats
        })
         
        await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error ;
    }
}



module.exports = {
    createBooking
}