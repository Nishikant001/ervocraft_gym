const mongoose =
require("mongoose");

const auditSchema =
new mongoose.Schema({

 userId:{
  type:
  mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 action:String,

 module:String,

 payload:Object

},{
 timestamps:true
});

module.exports =
mongoose.model(
"AuditLog",
auditSchema
);