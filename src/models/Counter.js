const mongoose =
require("mongoose");

// Generic atomic counter, reused wherever a
// gapless/duplicate-safe running sequence is needed
// (currently: yearly invoice numbering).
const counterSchema =
new mongoose.Schema({

  key:{
    type:String,
    required:true,
    unique:true
  },

  seq:{
    type:Number,
    default:0
  }

},{
  timestamps:true
});

module.exports =
mongoose.model(
"Counter",
counterSchema
);
