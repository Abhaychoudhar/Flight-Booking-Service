const express = require('express') ;
const router = express.Router() ;
const v1routes = require('./v1')  ;
// now every request on router and we can also further modularise the request based on api versions

// here mounting routes for version v1 
router.use("/v1",v1routes) ;

module.exports = router ;