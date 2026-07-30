const AuditLog =
require("../models/AuditLog");

exports.auditLog =
async({

 userId,
 action,
 module,
 payload,
 session

})=>{

 const docs =
 await AuditLog.create(
   [{
     userId,
     action,
     module,
     payload
   }],
   session ? { session } : {}
 );

 return docs[0];

};