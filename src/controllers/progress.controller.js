const ProgressLog =
require("../models/ProgressLog");

const BodyMeasurement =
require("../models/BodyMeasurement");

const ProgressPhoto =
require("../models/ProgressPhoto");

exports.addProgress =
async(req,res)=>{

 try{

   const progress =
   await ProgressLog.create({

      userId:
      req.user._id,

      ...req.body

   });

   res.status(201).json({

      success:true,

      progress

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.getProgressHistory =
async(req,res)=>{

 try{

   const history =
   await ProgressLog.find({

      userId:
      req.user._id

   }).sort({
      date:-1
   });

   res.status(200).json({

      success:true,

      history

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.addMeasurement =
async(req,res)=>{

 try{

   const measurement =
   await BodyMeasurement.create({

      userId:
      req.user._id,

      ...req.body

   });

   res.status(201).json({

      success:true,

      measurement

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.getMeasurements =
async(req,res)=>{

 try{

   const measurements =
   await BodyMeasurement.find({

      userId:
      req.user._id

   }).sort({
      date:-1
   });

   res.status(200).json({

      success:true,

      measurements

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.addProgressPhoto =
async(req,res)=>{

 try{

   const photo =
   await ProgressPhoto.create({

      userId:
      req.user._id,

      imageUrl:
      req.body.imageUrl,

      note:
      req.body.note

   });

   res.status(201).json({

      success:true,

      photo

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};

exports.getProgressPhotos =
async(req,res)=>{

 try{

   const photos =
   await ProgressPhoto.find({

      userId:
      req.user._id

   }).sort({
      date:-1
   });

   res.status(200).json({

      success:true,

      photos

   });

 }catch(error){

   res.status(500).json({

      success:false,

      message:error.message

   });

 }

};