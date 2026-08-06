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

module.exports =
upload;
