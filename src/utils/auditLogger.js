const AuditLog =
require("../models/AuditLog");

exports.auditLog =
async({

 userId,
 action,
 module,
 payload

})=>{

 await AuditLog.create({

   userId,
   action,
   module,
   payload

 });

};