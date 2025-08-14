/*
Actual queries are always written in repositories
Although these queries are in object (ORM) form but we can even also write raw queries here
 */
const {AppError} = require("../utils/errors")
const {StatusCodes} = require("http-status-codes") ;
class CrudRepository{
    constructor(model){
        this.model  = model ;
     }
     async create(data) {
        //console.log("was here") ;
            const response = await this.model.create(data) ;
            return response ;
          
     }
     async destroy(data) {
          try{
            console.log("Came here") ;
            const r1 = await this.model.findByPk(data) ;
            if( !r1 ){
                throw new AppError("Not Found",StatusCodes.BAD_REQUEST)
            } 
            const response = await this.model.destroy({
                where : {
                    id : data
                }
            }) ;
            return response ;
          } catch(error){
              console.log("Something went wrong in CRU repo !") ;
              throw error ;
          }
     }
     async get(data) {
            const response = await this.model.findByPk(data) ;
            return response ;
         
     }
     async getAll(data) {
            const response = await this.model.findAll() ;
            return response ;
         
     }
     async update(id , data) {
            const response = await this.model.update(data,{
                where : {
                    id : id
                }
            }) ;
            return response ;
         
     }
}
module.exports = CrudRepository ;