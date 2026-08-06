const multer =
require("multer");

const {
 CloudinaryStorage
}
=
require(
"multer-storage-cloudinary"
);

const cloudinary =
require("../config/cloudinary");

// Single-file Cloudinary storage. Only ONE image per
// field is ever accepted (multer's single() below),
// and only the resulting secure URL string is stored
// in the database, same as the previous string-based
// behaviour.
const storage =
new CloudinaryStorage({
 cloudinary,
 params:{
   folder:"gym-app",
   allowed_formats:[
     "jpg",
     "jpeg",
     "png",
     "webp"
   ]
 }
});

const imageFileFilter =
(req,file,cb)=>{

 if(
   file.mimetype &&
   file.mimetype.startsWith("image/")
 ){
   return cb(null,true);
 }

 cb(
   new Error(
     "Only image files are allowed"
   )
 );

};

const upload =
multer({
 storage,
 fileFilter:imageFileFilter,
 limits:{
   fileSize:5 * 1024 * 1024 // 5MB
 }
});

// Single-file Cloudinary storage for videos. Only ONE
// video per field is ever accepted (multer's single()/
// fields() below), and only the resulting secure URL
// string is stored in the database, same as the
// existing string-based behaviour used for videoUrl.
const videoStorage =
new CloudinaryStorage({
 cloudinary,
 params:{
   folder:"gym-app/videos",
   resource_type:"video",
   allowed_formats:[
     "mp4",
     "mov",
     "avi",
     "mkv",
     "webm"
   ]
 }
});

const videoFileFilter =
(req,file,cb)=>{

 if(
   file.mimetype &&
   file.mimetype.startsWith("video/")
 ){
   return cb(null,true);
 }

 cb(
   new Error(
     "Only video files are allowed"
   )
 );

};

const uploadVideo =
multer({
 storage:videoStorage,
 fileFilter:videoFileFilter,
 limits:{
   fileSize:100 * 1024 * 1024 // 100MB
 }
});

// Combined Cloudinary storage that supports a request
// carrying BOTH an image field ("thumbnail") and a
// video field ("video") at the same time (e.g. Exercise
// create/update). Resource type/format/folder is picked
// per-file based on its fieldname, so the existing image
// upload behaviour above is left completely untouched
// and this is only used where a video field is involved.
const mediaStorage =
new CloudinaryStorage({
 cloudinary,
 params:(req,file)=>{

   if(file.fieldname === "video"){
     return{
       folder:"gym-app/videos",
       resource_type:"video",
       allowed_formats:[
         "mp4",
         "mov",
         "avi",
         "mkv",
         "webm"
       ]
     };
   }

   return{
     folder:"gym-app",
     allowed_formats:[
       "jpg",
       "jpeg",
       "png",
       "webp"
     ]
   };

 }
});

const mediaFileFilter =
(req,file,cb)=>{

 if(file.fieldname === "video"){

   if(
     file.mimetype &&
     file.mimetype.startsWith("video/")
   ){
     return cb(null,true);
   }

   return cb(
     new Error(
       "Only video files are allowed"
     )
   );

 }

 if(
   file.mimetype &&
   file.mimetype.startsWith("image/")
 ){
   return cb(null,true);
 }

 cb(
   new Error(
     "Only image files are allowed"
   )
 );

};

const uploadExerciseMedia =
multer({
 storage:mediaStorage,
 fileFilter:mediaFileFilter,
 limits:{
   fileSize:100 * 1024 * 1024 // 100MB
 }
});

// Attach the extra upload variants onto the existing
// `upload` export so every current
// `require("../middleware/upload.middleware")` call site
// keeps working unchanged (upload.single(...) etc.),
// while routes that need video support can opt in via
// upload.video / upload.exerciseMedia.
upload.video = uploadVideo;
upload.exerciseMedia = uploadExerciseMedia;

module.exports =
upload;
