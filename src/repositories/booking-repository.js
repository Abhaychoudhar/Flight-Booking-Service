const CrudRepository = require("./crud-repository");
const {Booking} = require("../models") ;
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
}
module.exports = BookingRepository ;