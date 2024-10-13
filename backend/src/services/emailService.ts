import nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

// Create a transporter using SMTP
const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export const sendOtpEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: 'Your OTP for WorkWay Login',
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Optional: Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error with email transporter:', error);
  } else {
    console.log('Email transporter is ready to send emails');
  }
});