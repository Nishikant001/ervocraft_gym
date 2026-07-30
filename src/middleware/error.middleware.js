const logger =
require("../utils/logger");

module.exports =
(err,req,res,next)=>{

 logger.error({

   message:err.message,

   stack:err.stack

 });

 res.status(500).json({

   success:false,

   message:err.message

 });

};