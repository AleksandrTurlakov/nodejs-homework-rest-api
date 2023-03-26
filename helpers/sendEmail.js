//---------Sendgrid-------------------------------------//
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendEmail = async (data) => {
//   const email = { ...data, from: "aturlakov@ukr.net" };
//   await sgMail.send(email);
//   return true;
// };

// module.exports = sendEmail;
//------------------------------------------------------//

//-------Nodemailer-------------------------------------//
const nodemailer = require("nodemailer");

const { META_PASSWORD } = process.env;

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "aturlakov@meta.ua",
    pass: META_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const email = { ...data, from: "aturlakov@meta.ua" };
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;
