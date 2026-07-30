const mongoose =
require("mongoose");

const invoiceSchema =
new mongoose.Schema({

  invoiceNumber:{
    type:String,
    required:true,
    unique:true
  },

  // One invoice per payment. Unique index is the hard
  // guarantee against duplicate generation; the service
  // layer also checks before creating.
  paymentId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"Payment",
    required:true,
    unique:true
  },

  userId:{
    type:
    mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  // Snapshots are stored alongside the refs so the
  // invoice content never changes even if the plan /
  // diet template / trainer is edited or deleted later.
  membership:{

    subscriptionPlanId:{
      type:
      mongoose.Schema.Types.ObjectId,
      ref:"SubscriptionPlan"
    },

    name:String,

    durationDays:Number

  },

  dietPlan:{

    userDietId:{
      type:
      mongoose.Schema.Types.ObjectId,
      ref:"UserDiet"
    },

    dietTemplateId:{
      type:
      mongoose.Schema.Types.ObjectId,
      ref:"DietTemplate"
    },

    title:String

  },

  trainer:{

    trainerId:{
      type:
      mongoose.Schema.Types.ObjectId,
      ref:"User"
    },

    name:String

  },

  discount:{
    type:Number,
    default:0,
    min:0
  },

  gstPercent:{
    type:Number,
    default:0,
    min:0
  },

  gstAmount:{
    type:Number,
    default:0,
    min:0
  },

  subtotal:{
    type:Number,
    required:true,
    min:0
  },

  grandTotal:{
    type:Number,
    required:true,
    min:0
  },

  paymentMethod:{
    type:String
  },

  transactionId:{
    type:String
  },

  paymentDate:{
    type:Date,
    required:true
  },

  dueDate:{
    type:Date,
    required:true
  },

  status:{
    type:String,
    enum:[
      "paid",
      "pending",
      "cancelled",
      "refunded"
    ],
    default:"paid"
  },

  pdfUrl:{
    type:String
  },

  pdfPublicId:{
    type:String
  },

  emailSentAt:{
    type:Date
  }

},{
  timestamps:true
});

invoiceSchema.index({
  userId:1,
  createdAt:-1
});

invoiceSchema.index({
  invoiceNumber:1
});

module.exports =
mongoose.model(
"Invoice",
invoiceSchema
);
