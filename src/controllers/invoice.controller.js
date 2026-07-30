const mongoose =
require("mongoose");

const https =
require("https");

const Invoice =
require("../models/Invoice");

const User =
require("../models/User");

const invoiceService =
require("../services/invoice.service");

// Mirrors the STAFF_ROLES / canAccessUser pattern already
// used in dietProgress.controller.js.
const STAFF_ROLES = [
  "admin",
  "trainer"
];

const isValidId =
(id)=>{

 return (
   mongoose.Types.ObjectId
   .isValid(id)
 );

};

const canAccessUser =
(req,targetUserId)=>{

 if(
   STAFF_ROLES.includes(
     req.user.role
   )
 ){
   return true;
 }

 return (
   String(req.user._id) ===
   String(targetUserId)
 );

};

const parsePagination =
(req)=>{

 let page =
 parseInt(req.query.page,10);

 let limit =
 parseInt(req.query.limit,10);

 if(!Number.isInteger(page) || page < 1){
   page = 1;
 }

 if(
   !Number.isInteger(limit) ||
   limit < 1
 ){
   limit = 10;
 }

 if(limit > 100){
   limit = 100;
 }

 return {
   page,
   limit,
   skip:(page - 1) * limit
 };

};

// Shared filter builder for the listing endpoints.
const buildFilter =
(req, userId)=>{

 const filter = {};

 if(userId){
   filter.userId = userId;
 }

 if(
   req.query.status &&
   [
     "paid",
     "pending",
     "cancelled",
     "refunded"
   ].includes(req.query.status)
 ){
   filter.status = req.query.status;
 }

 if(
   req.query.userId &&
   isValidId(req.query.userId)
 ){
   filter.userId = req.query.userId;
 }

 if(
   req.query.startDate ||
   req.query.endDate
 ){

   filter.createdAt = {};

   if(req.query.startDate){

     const start =
     new Date(req.query.startDate);

     if(!isNaN(start)){
       filter.createdAt.$gte = start;
     }

   }

   if(req.query.endDate){

     const end =
     new Date(req.query.endDate);

     if(!isNaN(end)){
       filter.createdAt.$lte = end;
     }

   }

   if(
     Object.keys(filter.createdAt)
     .length === 0
   ){
     delete filter.createdAt;
   }

 }

 if(
   req.query.search &&
   String(req.query.search).trim()
 ){

   const term =
   String(req.query.search).trim();

   filter.$or = [
     {
       invoiceNumber:{
         $regex:term,
         $options:"i"
       }
     },
     {
       transactionId:{
         $regex:term,
         $options:"i"
       }
     }
   ];

 }

 return filter;

};

// GET /api/invoices/:id
exports.getInvoice =
async(req,res)=>{

 try{

   const { id } = req.params;

   if(!isValidId(id)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid invoice id"
     });

   }

   const invoice =
   await Invoice.findById(id)
   .populate("userId")
   .populate(
     "membership.subscriptionPlanId"
   )
   .populate(
     "dietPlan.dietTemplateId"
   )
   .populate(
     "trainer.trainerId"
   );

   if(!invoice){

     return res.status(404)
     .json({
       success:false,
       message:"Invoice not found"
     });

   }

   if(!canAccessUser(req,invoice.userId._id)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   res.status(200).json({

     success:true,

     invoice

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// GET /api/invoices/:id/download
exports.downloadInvoice =
async(req,res)=>{

 try{

   const { id } = req.params;

   if(!isValidId(id)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid invoice id"
     });

   }

   const invoice =
   await Invoice.findById(id);

   if(!invoice){

     return res.status(404)
     .json({
       success:false,
       message:"Invoice not found"
     });

   }

   if(!canAccessUser(req,invoice.userId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   if(!invoice.pdfUrl){

     return res.status(404)
     .json({
       success:false,
       message:"Invoice PDF not available"
     });

   }

   res.setHeader(
     "Content-Type",
     "application/pdf"
   );

   res.setHeader(
     "Content-Disposition",
     `attachment; filename="${invoice.invoiceNumber}.pdf"`
   );

   // Proxy the Cloudinary-hosted PDF through our own
   // authenticated route rather than exposing/redirecting
   // to the raw asset URL directly.
   https.get(invoice.pdfUrl,(pdfRes)=>{

     if(pdfRes.statusCode !== 200){

       return res.status(502)
       .json({
         success:false,
         message:"Failed to fetch invoice PDF"
       });

     }

     pdfRes.pipe(res);

   }).on("error",(error)=>{

     res.status(500).json({
       success:false,
       message:error.message
     });

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// POST /api/invoices/:id/email
exports.emailInvoice =
async(req,res)=>{

 try{

   const { id } = req.params;

   if(!isValidId(id)){

     return res.status(400)
     .json({
       success:false,
       message:"Invalid invoice id"
     });

   }

   const invoice =
   await Invoice.findById(id);

   if(!invoice){

     return res.status(404)
     .json({
       success:false,
       message:"Invoice not found"
     });

   }

   if(!canAccessUser(req,invoice.userId)){

     return res.status(403)
     .json({
       success:false,
       message:"Permission denied"
     });

   }

   const user =
   await User.findById(invoice.userId);

   if(!user){

     return res.status(404)
     .json({
       success:false,
       message:"User not found"
     });

   }

   await invoiceService
   .sendInvoiceEmail(invoice,user);

   res.status(200).json({

     success:true,

     message:
     `Invoice emailed to ${user.email}`

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// GET /api/invoices/admin
exports.adminInvoiceList =
async(req,res)=>{

 try{

   const {
     page,
     limit,
     skip
   } = parsePagination(req);

   const filter =
   buildFilter(req,null);

   const [
     invoices,
     total
   ] = await Promise.all([

     Invoice
     .find(filter)
     .sort({ createdAt:-1 })
     .skip(skip)
     .limit(limit)
     .populate("userId")
     .populate(
       "membership.subscriptionPlanId"
     ),

     Invoice
     .countDocuments(filter)

   ]);

   res.status(200).json({

     success:true,

     invoices,

     pagination:{
       total,
       page,
       limit,
       totalPages:
       Math.ceil(total / limit) || 1
     }

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};

// GET /api/invoices/my
exports.myInvoiceHistory =
async(req,res)=>{

 try{

   const {
     page,
     limit,
     skip
   } = parsePagination(req);

   const filter =
   buildFilter(req,req.user._id);

   const [
     invoices,
     total
   ] = await Promise.all([

     Invoice
     .find(filter)
     .sort({ createdAt:-1 })
     .skip(skip)
     .limit(limit)
     .populate(
       "membership.subscriptionPlanId"
     ),

     Invoice
     .countDocuments(filter)

   ]);

   res.status(200).json({

     success:true,

     invoices,

     pagination:{
       total,
       page,
       limit,
       totalPages:
       Math.ceil(total / limit) || 1
     }

   });

 }catch(error){

   res.status(500).json({

     success:false,

     message:error.message

   });

 }

};
