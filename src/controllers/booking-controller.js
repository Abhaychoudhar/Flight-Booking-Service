const {BookingService} = require("../services")
const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
async function createBooking(req,res){
    try{ console.log("Req = ",req.body)
               const booking =   await BookingService.createBooking({
                    flightId : req.body.flightId ,
                    userId : req.body.userId ,
                    noOfSeats : req.body.noOfSeats
                 })
                 console.log(booking)
         SuccessResponse.message = booking;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
        throw error
    }
}
async function makePayment(req,res){
    try{    
         console.log(req.body)
               const booking =   await BookingService.makePayment({
                    bookingId : req.body.bookingId ,
                    userId : req.body.userId ,
                    totalCost : req.body.totalCost
                 })
                 console.log(booking)
         SuccessResponse.message = booking;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
        throw error
    }
}
module.exports = {
    createBooking,
    makePayment

}