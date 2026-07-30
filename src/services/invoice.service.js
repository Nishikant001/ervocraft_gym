const { Readable } =
require("stream");

const PDFDocument =
require("pdfkit");

const cloudinary =
require("../config/cloudinary");

const transporter =
require("../config/mailer");

const Counter =
require("../models/Counter");

const Invoice =
require("../models/Invoice");

const SubscriptionPlan =
require("../models/SubscriptionPlan");

const UserDiet =
require("../models/UserDiet");

const round2 =
(num)=>{

 return Math.round(
   (num + Number.EPSILON) * 100
 ) / 100;

};

// GST rate is configurable via env so finance can
// change it without a code deploy. Falls back to 18%
// (standard Indian GST slab for services) if unset.
const getGstPercent =
()=>{

 const configured =
 Number(
   process.env.INVOICE_GST_PERCENT
 );

 return Number.isFinite(configured) ?
 configured :
 18;

};

// Atomically reserves the next sequence number for the
// given calendar year so two concurrent payments can
// never receive the same invoice number. Accepts an
// optional Mongo session so the reservation can be part
// of the caller's transaction.
const getNextInvoiceNumber =
async(year, session)=>{

 const key =
 `invoice-${year}`;

 const counter =
 await Counter.findOneAndUpdate(

   { key },

   { $inc:{ seq:1 } },

   {
     upsert:true,
     new:true,
     session
   }

 );

 const padded =
 String(counter.seq)
 .padStart(6,"0");

 return `INV-${year}-${padded}`;

};

// Best-effort resolution of diet plan + trainer for the
// invoice snapshot. Neither Payment nor User currently
// stores these relations directly, so we fall back to
// the user's most recent UserDiet assignment (already
// links to a DietTemplate and the staff member who
// assigned it).
const resolveDietAndTrainer =
async(userId, session)=>{

 const dietAssignment =
 await UserDiet
 .findOne({ userId })
 .sort({ createdAt:-1 })
 .populate("dietTemplateId")
 .populate("assignedBy")
 .session(session || null);

 const dietPlan = {
   userDietId:null,
   dietTemplateId:null,
   title:null
 };

 const trainer = {
   trainerId:null,
   name:null
 };

 if(dietAssignment){

   dietPlan.userDietId =
   dietAssignment._id;

   if(dietAssignment.dietTemplateId){

     dietPlan.dietTemplateId =
     dietAssignment.dietTemplateId._id;

     dietPlan.title =
     dietAssignment.dietTemplateId.title ||
     null;

   }

   if(
     dietAssignment.assignedBy &&
     dietAssignment.assignedBy.role === "trainer"
   ){

     trainer.trainerId =
     dietAssignment.assignedBy._id;

     trainer.name =
     dietAssignment.assignedBy.fullName;

   }

 }

 return { dietPlan, trainer };

};

// Renders the invoice as a PDF and resolves a Buffer.
const renderInvoicePdf =
(invoice, user)=>{

 return new Promise((resolve,reject)=>{

   const doc =
   new PDFDocument({
     size:"A4",
     margin:50
   });

   const chunks = [];

   doc.on(
     "data",
     (chunk)=> chunks.push(chunk)
   );

   doc.on(
     "end",
     ()=> resolve(Buffer.concat(chunks))
   );

   doc.on("error",reject);

   doc
   .fontSize(20)
   .text("TAX INVOICE",{ align:"right" });

   doc
   .fontSize(10)
   .text(
     `Invoice No: ${invoice.invoiceNumber}`,
     { align:"right" }
   )
   .text(
     `Payment Date: ${new Date(invoice.paymentDate).toDateString()}`,
     { align:"right" }
   )
   .text(
     `Due Date: ${new Date(invoice.dueDate).toDateString()}`,
     { align:"right" }
   );

   doc.moveDown(2);

   doc
   .fontSize(12)
   .text("Billed To:");

   doc
   .fontSize(10)
   .text(user?.fullName || "N/A")
   .text(user?.email || "")
   .text(user?.mobile || "");

   doc.moveDown(1.5);

   doc
   .fontSize(12)
   .text("Details:");

   doc.fontSize(10);

   if(invoice.membership?.name){
     doc.text(
       `Membership Plan: ${invoice.membership.name}` +
       (
         invoice.membership.durationDays ?
         ` (${invoice.membership.durationDays} days)` :
         ""
       )
     );
   }

   if(invoice.dietPlan?.title){
     doc.text(
       `Diet Plan: ${invoice.dietPlan.title}`
     );
   }

   if(invoice.trainer?.name){
     doc.text(
       `Trainer: ${invoice.trainer.name}`
     );
   }

   doc.text(
     `Payment Method: ${invoice.paymentMethod || "N/A"}`
   );

   doc.text(
     `Transaction ID: ${invoice.transactionId || "N/A"}`
   );

   doc.moveDown(1.5);

   doc
   .fontSize(12)
   .text("Amount:");

   doc.fontSize(10);

   doc.text(
     `Subtotal: Rs. ${invoice.subtotal.toFixed(2)}`
   );

   doc.text(
     `Discount: Rs. ${invoice.discount.toFixed(2)}`
   );

   doc.text(
     `GST (${invoice.gstPercent}%): Rs. ${invoice.gstAmount.toFixed(2)}`
   );

   doc
   .fontSize(12)
   .text(
     `Grand Total: Rs. ${invoice.grandTotal.toFixed(2)}`,
     { underline:true }
   );

   doc.moveDown(2);

   doc
   .fontSize(9)
   .fillColor("gray")
   .text(
     `Status: ${invoice.status.toUpperCase()}`
   );

   doc.end();

 });

};

// Uploads the generated PDF buffer to Cloudinary (already
// configured/used by the project for asset storage) and
// returns { url, publicId }.
const uploadInvoicePdf =
(buffer, invoiceNumber)=>{

 return new Promise((resolve,reject)=>{

   const uploadStream =
   cloudinary.uploader.upload_stream(

     {
       resource_type:"raw",
       folder:"invoices",
       public_id:invoiceNumber,
       format:"pdf",
       overwrite:false
     },

     (error,result)=>{

       if(error){
         return reject(error);
       }

       resolve({
         url:result.secure_url,
         publicId:result.public_id
       });

     }

   );

   Readable.from(buffer)
   .pipe(uploadStream);

 });

};

// Builds the billing breakdown from the payment amount.
// Payment.amount is treated as the GST-exclusive subtotal;
// discount is 0 unless explicitly supplied (Payment/Offer
// currently has no linkage to store an applied discount).
const buildAmountBreakdown =
(baseAmount, discount = 0)=>{

 const subtotal =
 round2(baseAmount || 0);

 const safeDiscount =
 round2(
   Math.min(discount || 0, subtotal)
 );

 const gstPercent =
 getGstPercent();

 const taxableAmount =
 subtotal - safeDiscount;

 const gstAmount =
 round2(
   (taxableAmount * gstPercent) / 100
 );

 const grandTotal =
 round2(
   taxableAmount + gstAmount
 );

 return {
   subtotal,
   discount:safeDiscount,
   gstPercent,
   gstAmount,
   grandTotal
 };

};

// Renders + uploads the PDF for an already-created invoice
// and saves the resulting url/publicId onto it. This is
// external I/O (PDF render + Cloudinary upload), so it is
// always called OUTSIDE any Mongo transaction: it must
// never hold a transaction open, and its failure must
// never roll back the DB writes that already succeeded.
// Safe to call repeatedly (no-ops once pdfUrl is set).
const attachInvoicePdf =
async(invoice, user)=>{

 if(invoice.pdfUrl){
   return invoice;
 }

 const pdfBuffer =
 await renderInvoicePdf(invoice,user);

 const {
   url,
   publicId
 } = await uploadInvoicePdf(
   pdfBuffer,
   invoice.invoiceNumber
 );

 invoice.pdfUrl = url;
 invoice.pdfPublicId = publicId;

 await invoice.save();

 return invoice;

};

// Core entry point, called right after a payment is
// marked "success". Idempotent: if an invoice already
// exists for this payment, it is returned as-is instead
// of generating a duplicate (unique index on paymentId is
// the hard guarantee; this check avoids even attempting
// a duplicate insert).
//
// options.session   - optional Mongo session; when passed,
//                      the Invoice record is written as
//                      part of that transaction.
// options.skipPdf    - when true, only creates/returns the
//                      Invoice DB record and skips the PDF
//                      render/upload (external I/O, not
//                      appropriate inside a transaction).
//                      Caller is expected to invoke
//                      attachInvoicePdf() afterwards, once
//                      the transaction has committed.
const generateInvoiceForPayment =
async(payment, user, options = {})=>{

 const { session, skipPdf } = options;

 const existing =
 await Invoice.findOne({
   paymentId:payment._id
 }).session(session || null);

 if(existing){

   // Self-heal: the Invoice record was created on a
   // previous attempt but the PDF upload step failed
   // before it could be attached. Retry just that step
   // instead of skipping it silently (never inside a
   // transaction, matching attachInvoicePdf's contract).
   if(!existing.pdfUrl && !skipPdf){
     return attachInvoicePdf(existing, user);
   }

   return existing;

 }

 const plan =
 payment.subscriptionPlanId ?
 await SubscriptionPlan
 .findById(payment.subscriptionPlanId)
 .session(session || null) :
 null;

 const {
   dietPlan,
   trainer
 } = await resolveDietAndTrainer(
   user._id,
   session
 );

 const amounts =
 buildAmountBreakdown(payment.amount);

 const year =
 new Date().getFullYear();

 const invoiceNumber =
 await getNextInvoiceNumber(year, session);

 const paymentDate =
 payment.updatedAt || new Date();

 let invoice;

 try{

   const created =
   await Invoice.create(
     [{

       invoiceNumber,

       paymentId:payment._id,

       userId:user._id,

       membership:{

         subscriptionPlanId:
         plan ? plan._id : null,

         name:
         plan ? plan.name : null,

         durationDays:
         plan ? plan.durationDays : null

       },

       dietPlan,

       trainer,

       discount:amounts.discount,

       gstPercent:amounts.gstPercent,

       gstAmount:amounts.gstAmount,

       subtotal:amounts.subtotal,

       grandTotal:amounts.grandTotal,

       paymentMethod:
       payment.paymentMethod,

       transactionId:
       payment.paymentId,

       paymentDate,

       // Payment already succeeded, so the invoice is
       // due/settled on the same date it was raised.
       dueDate:paymentDate,

       status:"paid"

     }],
     session ? { session } : {}
   );

   invoice = created[0];

 }catch(error){

   // Race condition guard: two requests generating the
   // same invoice concurrently will hit the unique
   // paymentId index; fall back to the winning record.
   if(error.code === 11000){

     return Invoice.findOne({
       paymentId:payment._id
     }).session(session || null);

   }

   throw error;

 }

 if(skipPdf){
   return invoice;
 }

 return attachInvoicePdf(invoice, user);

};

const sendInvoiceEmail =
async(invoice, user)=>{

 if(!invoice.pdfUrl){
   throw new Error(
     "Invoice PDF is not available yet"
   );
 }

 await transporter.sendMail({

   from:
   process.env.SMTP_FROM ||
   process.env.SMTP_USER,

   to:user.email,

   subject:
   `Invoice ${invoice.invoiceNumber}`,

   text:
   `Hi ${user.fullName || ""},\n\n` +
   `Please find attached your invoice ` +
   `${invoice.invoiceNumber} for Rs. ` +
   `${invoice.grandTotal.toFixed(2)}.\n\n` +
   `Thank you.`,

   attachments:[
     {
       filename:
       `${invoice.invoiceNumber}.pdf`,

       // nodemailer fetches remote attachments by URL
       path:invoice.pdfUrl
     }
   ]

 });

 invoice.emailSentAt = new Date();

 await invoice.save();

 return invoice;

};

module.exports = {
  round2,
  getGstPercent,
  getNextInvoiceNumber,
  buildAmountBreakdown,
  generateInvoiceForPayment,
  attachInvoicePdf,
  sendInvoiceEmail,
  renderInvoicePdf
};