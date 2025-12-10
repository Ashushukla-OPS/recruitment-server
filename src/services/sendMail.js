
import axios from "axios";


const BREVO_API_KEY = process.env.BREVO_API_KEY;

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";


export async function sendWelcomeEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheriyansh", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name }],
      subject: `We received your application for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.name || "Candidate"}!</h1>
          <p>Thank you for applying to <strong>${data.jobTitle}</strong> at <strong>Sheriyansh</strong>.</p>
          <p>Your application has been received and is under review.</p>
          <br />
          <p>We'll get back to you soon!</p>
          <hr />
          <small>Applied on: ${new Date(data.appliedAt).toLocaleString()}</small>
        </div>
      `,
      textContent: `Hi ${data.name}, thank you for applying to ${data.jobTitle}!`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });
     
    console.log("WELCOME EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo email failed:");
  }
}











export async function sendVerificationEmail(user) {
  const verificationLink = `https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app/user-verification/${user.id}`;
    console.log(user)
  try {
    const payload = {
      sender: { name: "Sheriyansh Team", email: "anshur9608837@gmail.com" },
      to: [{ email: user.email, name: user.name }],
      subject: "Verify Your Email Address",
      htmlContent: `
        <div style="font-family: Arial; max-width: 600px; padding: 20px;">
          <h2 style="color: #1a73e8;">Welcome, ${user.name || "there"}!</h2>
          <p>Please verify your email by clicking below:</p>
          
          <a href="${verificationLink}"
            style="background:#1a73e8;color:white;padding:12px 25px;
                   text-decoration:none;border-radius:6px;display:inline-block;margin:20px 0;">
            Verify Email
          </a>

          <p>Or copy this link:</p>
          <p style="word-wrap: break-word; color: #1a73e8;">${verificationLink}</p>

          <hr />
          <small>If you didn’t sign up, ignore this email.</small>
        </div>
      `,
      textContent: `Verify your email: ${verificationLink}`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("VERIFICATION EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo email failed:", error.response?.data || error.message);
    throw error;
  }
}


