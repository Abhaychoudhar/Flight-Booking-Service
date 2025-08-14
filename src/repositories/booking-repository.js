const CrudRepository = require("./crud-repository");
const {Booking} = require("../models") ;
const { AppError } = require("../utils/errors");
const {StatusCodes}  = require("http-status-codes")
/*
 Now just extend that general crud-repository class
 import you model and call the parents' constructor with that model
*/
class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking) ;
    }
    // here we will create booking 
    async  create(data, transaction){
           const response = await Booking.create(data ,{transaction : transaction} ) ;
           return response
    }
    async get(data,transaction) {
            const response = await Booking.findByPk(data ,{transaction : transaction} ) ;
            if( !response ){
                throw new AppError("Booking not found" ,StatusCodes.BAD_REQUEST)
            }
            return response ;
         
     }
       async update(id , data, transaction) {
            const response = await Booking.update(data,{
                where : {
                    id : id
                }
            } ,{transaction : transaction} ) ;
            return response ;
         
     }
}
module.exports = BookingRepository ;