const mongoose =
require("mongoose");

// Payment holds the CURRENT state of a single order
// (created/success/failed). PaymentHistory is an
// append-only ledger of every event that happened to a
// payment, so admins/reports can see the full timeline
// (create -> success/failed -> refunded etc.) even after
// Payment has moved on to its latest status.
const paymentHistorySchema =
new mongoose.Schema({

  paymentId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"Payment",
    required:true
  },

  userId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  orderId:{
    type:String,
    required:true
  },

  transactionId:{
    type:String
  },

  amount:{
    type:Number,
    required:true
  },

  status:{
    type:String,
    enum:[
      "created",
      "success",
      "failed"
    ],
    required:true
  },

  event:{
    type:String,
    required:true
  },

  gateway:{
    type:String,
    default:"razorpay"
  },

  // Free-form details for the event (error message on
  // failure, ip/device on success, etc.)
  meta:{
    type:Object
  }

},{
  timestamps:true
});

paymentHistorySchema.index({
  paymentId:1,
  createdAt:-1
});

paymentHistorySchema.index({
  userId:1,
  createdAt:-1
});

module.exports =
mongoose.model(
"PaymentHistory",
paymentHistorySchema
);
