const nodemailer =
require("nodemailer");

// SMTP_* env vars follow the same convention as the
// rest of src/config (RAZORPAY_*, CLOUDINARY_*).
const transporter =
nodemailer.createTransport({

  host:
  process.env.SMTP_HOST,

  port:
  Number(process.env.SMTP_PORT) || 587,

  secure:
  process.env.SMTP_SECURE === "true",

  auth:{

    user:
    process.env.SMTP_USER,

    pass:
    process.env.SMTP_PASS

  }

});

module.exports =
transporter;
