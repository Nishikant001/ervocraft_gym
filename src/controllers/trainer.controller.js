const Trainer =
require("../models/Trainer");
const Branch = require("../models/Branch");

exports.createTrainer =
async(req,res)=>{

 try{

   const trainer =
   await Trainer.create(
     req.body
   );

   await Branch.findByIdAndUpdate(
  trainer.branchId,
  {
    $inc: {
      totalTrainers: 1,
    },
  }
);

   res.status(201).json({
     success:true,
     trainer
   });

 }catch(error){

   res.status(500).json({
     success:false,
     message:error.message
   });

 }

};

exports.getTrainers =
async(req,res)=>{

 try{

   const trainers =
   await Trainer.find()
   .populate("branchId");

   res.status(200).json({
      success:true,
      trainers
   });

 }catch(error){

   res.status(500).json({
      success:false,
      message:error.message
   });

 }

};

exports.updateTrainer = async (req, res) => {
  try {
    const oldTrainer = await Trainer.findById(req.params.id);

    if (!oldTrainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Branch change hua to count update
    if (
      req.body.branchId &&
      oldTrainer.branchId.toString() !== req.body.branchId
    ) {
      await Branch.findByIdAndUpdate(
        oldTrainer.branchId,
        {
          $inc: {
            totalTrainers: -1,
          },
        }
      );

      await Branch.findByIdAndUpdate(
        req.body.branchId,
        {
          $inc: {
            totalTrainers: 1,
          },
        }
      );
    }

    const trainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      trainer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Branch count kam karo
    await Branch.findByIdAndUpdate(
      trainer.branchId,
      {
        $inc: {
          totalTrainers: -1,
        },
      }
    );

    // Trainer delete
    await Trainer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Trainer deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};