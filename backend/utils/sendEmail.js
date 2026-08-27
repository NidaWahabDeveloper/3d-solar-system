// Reusable email-sending function -- built on Nodemailer, using Gmail as the SMTP provider.
// Any controller that needs to send an email (verification, password reset, etc.) can import this.

import nodemailer from "nodemailer";

// transporter = the actual "mail-sending engine", configured once with our Gmail credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // tells Nodemailer to use Gmail's SMTP settings automatically
  auth: {
    user: process.env.EMAIL_USER, // my Gmail address, from .env
    pass: process.env.EMAIL_PASS, // the App Password, from .env (never the real Gmail password)
  },
});

// sendEmail: a small helper so callers don't need to know Nodemailer's API directly --
// they just call sendEmail({ to, subject, html }) and it handles the rest.
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"3d Solar System" <${process.env.EMAIL_USER}>`, // shown as the sender name
    to,      // recipient's email address
    subject, // email subject line
    html,    // the email body, written as HTML (so we can style the verification link/button)
  });
};

export default sendEmail;