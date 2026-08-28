import nodemailer from "nodemailer";
// sendEmail: transporter ab function ke ANDAR banta hai, file load hote hi nahi --
// isse guarantee hota hai ke jab tak ye function call hoga, .env pehle se load ho chuki hogi
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  await transporter.sendMail({
    from: `"Solar System Explorer" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;