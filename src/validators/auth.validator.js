const Joi =
require("joi");

exports.registerSchema =
Joi.object({

 fullName:
 Joi.string()
 .required(),

 email:
 Joi.string()
 .email()
 .required(),

 mobile:
 Joi.string()
 .required(),

 password:
 Joi.string()
 .min(6)
 .required()

});