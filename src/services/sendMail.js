import axios from "axios"

const FRONTEND_URL = "https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

/**
 * Send welcome email after job application
 */
export async function sendWelcomeEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheriyansh", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name }],
      subject: `We received your application for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.name || "Candidate"}!</h1>
          <p>Thank you for applying to <strong>${data.jobTitle
        }</strong> at <strong>Sheriyansh</strong>.</p>
          <p>Your application has been received and is under review.</p>
          <br />
          <p>We'll get back to you soon!</p>
          <hr />
          <small>Applied on: ${new Date(data.appliedAt).toLocaleString()}</small>
        </div>
      `,
      textContent: `Hi ${data.name || "Candidate"}, thank you for applying to ${data.jobTitle}!`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("WELCOME EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo welcome email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error // Re-throw to let caller handle it
  }
}

/**
 * Send interview email to candidate
 */
export async function sendInterviewEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians", email: "anshur9608837@gmail.com" },
      to: [{ email: data.candidateEmail, name: data.candidateName }],
      subject: `Interview Scheduled for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.candidateName || "Candidate"}!</h1>
          <p>Your interview for <strong>${data.jobTitle
        }</strong> at <strong>Sheryians</strong> has been scheduled.</p>
          <p><strong>Date & Time:</strong> ${new Date(data.Timing).toLocaleString()}</p>
          <p><strong>Meeting Link:</strong></p>
          <a href="${data.meetingLink}" target="_blank">${data.meetingLink}</a>
          <br /><br />
          <p>Please join on time and ensure a stable internet connection.</p>
          <hr />
          <small>Best of luck!</small>
        </div>
      `,
      textContent: `Hi ${data.candidateName || "Candidate"}, your interview for ${data.jobTitle
        } is scheduled on ${new Date(data.Timing).toLocaleString()}. Meeting link: ${data.meetingLink
        }`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("INTERVIEW EMAIL SENT (Candidate):", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo interview email (candidate) failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}

/**
 * Send interview notification to interviewer
 */
export async function sendInterviewerEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians", email: "anshur9608837@gmail.com" },
      to: [{ email: data.interviewer }],
      subject: `Interview Scheduled for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Dear Interviewer,</h1>
          <p>I hope this email finds you well.</p>
          <p>This is to inform you that an interview has been scheduled for the following candidate:</p>
          <p><strong>Candidate Name:</strong> ${data.candidateName}</p>
          <p><strong>Position:</strong> ${data.jobTitle}</p>
          <p><strong>Date & Time:</strong> ${new Date(data.Timing).toLocaleString()}</p>
          <p><strong>Meeting Link:</strong></p>
          <a href="${data.meetingLink}" target="_blank">${data.meetingLink}</a>
          <br /><br />
          <p>Kindly let us know if the scheduled time works for you or if any adjustments are required.</p>
          <p>Please feel free to reach out if you have any questions or need further information.</p>
          <p>Thank you for your time and cooperation.</p>
          <hr />
          <small>Best regards,<br />Sheryians Team</small>
        </div>
      `,
      textContent: `Dear Interviewer, an interview has been scheduled for candidate ${data.candidateName
        } for the position ${data.jobTitle} on ${new Date(
          data.Timing
        ).toLocaleString()}. Meeting link: ${data.meetingLink}`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("INTERVIEW EMAIL SENT (Interviewer):", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo interviewer email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}

/** Rescheduled interview for candidate */
export async function sendRescheduledInterviewEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians", email: "anshur9608837@gmail.com" },
      to: [{ email: data.candidateEmail, name: data.candidateName }],
      subject: `Interview is Rescheduled for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.candidateName || "Candidate"}!</h1>
          <p>Your interview for <strong>${data.jobTitle
        }</strong> at <strong>Sheryians</strong> has been Rescheduled.</p>
          <p><strong>Date & Time:</strong> ${new Date(data.Timing).toLocaleString()}</p>
          <p><strong>Meeting Link:</strong></p>
          <a href="${data.meetingLink}" target="_blank">${data.meetingLink}</a>
          <br /><br />
          <p>Please join on time and ensure a stable internet connection.</p>
          <hr />
          <small>Best of luck!</small>
        </div>
      `,
      textContent: `Hi ${data.candidateName || "Candidate"}, your interview for ${data.jobTitle
        } is rescheduled on ${new Date(data.Timing).toLocaleString()}. Meeting link: ${data.meetingLink
        }`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("INTERVIEW EMAIL SENT (Candidate):", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo interview email (candidate) failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}

/** Rescheduled interview for interviewer */
export async function sendRescheduledInterviewerEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians Recruitment", email: "anshur9608837@gmail.com" },
      to: [{ email: data.interviewer }],
      subject: `Interview Rescheduled – ${data.jobTitle}`,
      htmlContent: `
      <div style="
  background:#f2f5f9;
  padding:40px 0;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
">

  <!-- MAIN CARD -->
  <div style="
    max-width:600px;
    margin:0 auto;
    background:#ffffff;
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 12px 30px rgba(0,0,0,0.08);
  ">

    <!-- HEADER -->
    <div style="
      background:linear-gradient(135deg,#1a73e8,#0b5ed7);
      padding:28px 24px;
      display:flex;
      align-items:center;
      gap:14px
    ">
      <img
        src="https://avatars.githubusercontent.com/u/69582226?v=4"
        alt="Sheryians Logo"
        style="
          height:48px;
          margin-right:14px;
          
          border-radius:10px;
        "
      />
       <!-- TEXT BLOCK -->
  <div>
    <div style="
      font-size:20px;
      font-weight:800;
      color:#ffffff;
      line-height:1.2;
    ">
      Interview Rescheduled
    </div>

    <div style="
      font-size:13px;
      color:#e3efff;
      margin-top:4px;
    ">
      Sheryians Recruitment Team
    </div>
  </div>

</div>

    <!-- BODY -->
    <div style="padding:28px 26px;color:#333;">
      <p style="margin-top:0;font-size:15px;">
        Dear Interviewer,
      </p>

      <p style="font-size:14.5px;line-height:1.7;">
        This is to inform you that the interview has been
        <strong>rescheduled</strong>. Please find the updated details below:
      </p>

      <!-- DETAILS CARD -->
      <div style="
        margin:22px 0;
        padding:18px 20px;
        background:#f8fbff;
        border-left:4px solid #1a73e8;
        border-radius:8px;
      ">
        <p style="margin:6px 0;"><strong>Candidate:</strong> ${data.candidateName}</p>
        <p style="margin:6px 0;"><strong>Position:</strong> ${data.jobTitle}</p>
        <p style="margin:6px 0;"><strong>Date & Time:</strong> ${new Date(
          data.Timing
        ).toLocaleString()}</p>

        <p style="margin:10px 0 0;">
          <strong>Meeting Link:</strong><br />
          <a
            href="${data.meetingLink}"
            target="_blank"
            style="
              display:inline-block;
              margin-top:8px;
              padding:10px 18px;
              background:#1a73e8;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-size:13px;
              font-weight:600;
            "
          >
            Join Meeting →
          </a>
          <p>if link doesn't work copy paste this: </p>
          <p style="word-break: break-all; color: #1a73e8;">${data.meetingLink}</p>
        </p>
      </div>

      <!-- NOTE -->
      <div style="
        background:#fff8e1;
        padding:14px 16px;
        border-radius:8px;
        font-size:13.5px;
        color:#6b5e00;
      ">
        ⚠️ If the rescheduled time does not work for you, please reply to this
        email so we can assist with further changes.
      </div>

      <p style="margin-top:26px;font-size:14px;">
        Thank you for your time and cooperation.
      </p>

      <p style="margin-bottom:0;">
        Best regards,<br />
        <strong>Sheryians Recruitment Team</strong>
      </p>
    </div>

    <!-- FOOTER -->
    <div style="
      background:#f6f8fb;
      padding:16px;
      text-align:center;
      font-size:12px;
      color:#777;
    ">
      © ${new Date().getFullYear()} Sheryians · All rights reserved
    </div>

  </div>
</div>

        
      `,
      textContent: `Dear Interviewer,

The interview has been rescheduled.

Candidate: ${data.candidateName}
Position: ${data.jobTitle}
Date & Time: ${new Date(data.Timing).toLocaleString()}
Meeting Link: ${data.meetingLink}

If this time does not work for you, please reply to this email.

Best regards,
Sheryians Recruitment Team`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("RESCHEDULE EMAIL SENT (INTERVIEWER):", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo reschedule interviewer email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}

/**
 * Send interview cancellation email to candidate
 */
export async function sendCancelledInterviewEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians", email: "anshur9608837@gmail.com" },
      to: [{ email: data.candidateEmail, name: data.candidateName }],
      subject: `Interview Cancelled for ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #e53935;">Hi ${data.candidateName || "Candidate"}!</h1>
          <p>We regret to inform you that your interview for 
            <strong>${data.jobTitle}</strong> at <strong>Sheryians</strong>
            has been <b>cancelled</b>.
          </p>

          <p>If this was unintentional or needs rescheduling, our recruitment team
          will reach out to you.</p>
          <p>Thank you for your time and interest.</p>

          <hr />
          <small>Best regards,<br />Sheryians Team</small>
        </div>
      `,
      textContent: `Hi ${data.candidateName}, your interview for ${data.jobTitle} has been cancelled.`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("CANCEL INTERVIEW EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo cancel interview email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}

/**
 * Send interview cancellation email to interviewer
 */
export async function sendCancelledInterviewerEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheryians", email: "anshur9608837@gmail.com" },
      to: [{ email: data.interviewer }],
      subject: `Interview Cancelled – ${data.jobTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h2 style="color: #e53935;">Interview Cancelled</h2>

          <p>The following interview has been <strong>cancelled</strong>:</p>

          <p><strong>Candidate:</strong> ${data.candidateName}</p>
          <p><strong>Position:</strong> ${data.jobTitle}</p>

          <p>No further action is required from your side.</p>

          <hr />
          <small>Sheryians Recruitment Team</small>
        </div>
      `,
      textContent: `Interview cancelled for candidate ${data.candidateName} – Position: ${data.jobTitle}`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("CANCEL INTERVIEW EMAIL SENT (INTERVIEWER):", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo cancel interview interviewer email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}


/**
 * Send password reset email
 */
export async function sendResetPasswordEmail(data) {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${data.token}`

    const payload = {
      sender: { name: "Sheriyansh", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name }],
      subject: "Reset your password",
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h1 style="color: #1a73e8;">Hi ${data.name || "User"}!</h1>

          <p>
            We received a request to reset your password.
            Click the button below to set a new password.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetLink}"
              style="
                background-color:#1a73e8;
                color:#ffffff;
                padding:12px 20px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
                font-weight:bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p style="font-size:14px; color:#555;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p style="font-size:14px; color:#555;">
            If you did not request this, you can safely ignore this email.
          </p>

          <hr />

          <small style="color:#888;">
            © ${new Date().getFullYear()} Sheriyansh
          </small>
        </div>
      `,
      textContent: `Hi ${data.name || "User"
        }, reset your password using this link: ${resetLink} (expires in 15 minutes)`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("RESET PASSWORD EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Reset password email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(user) {
  const verificationLink = `${FRONTEND_URL}/user-verification/${user.id}`

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
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("VERIFICATION EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo verification email failed:", error.response?.data || error.message)
    throw error
  }
}

/**
 * Send test assignment/enrollment email to candidate
 */
export async function sendEnrollEmail(data) {
  try {
    const testLink = `https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app/test/${data.testId}`

    const payload = {
      sender: { name: "Sheriyansh Team", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name || "Candidate" }],
      subject: "You Have Been Assigned a Test",
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h2 style="color: #1a73e8;">Hello ${data.name || "there"}!</h2>
          
          <p>You have been assigned a test on the <strong>Sheriyansh Recruitment Portal</strong>.</p>
          
          <p><strong>Test Title:</strong> ${data.testTitle || "Assessment Test"}</p>

          <a href="${testLink}"
            style="background:#1a73e8;color:white;padding:12px 25px;
                   text-decoration:none;border-radius:6px;display:inline-block;margin:20px 0;">
            Attempt Test
          </a>

          <p>If the button doesn’t work, copy this link:</p>
          <p style="word-break: break-all; color: #1a73e8;">
            ${testLink}
          </p>

          <hr />
          <small>Best of luck! 🍀</small>
        </div>
      `,
      textContent: `You have been assigned a test. Attempt it here: ${testLink}`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("ENROLL EMAIL SENT:", response.data.messageId)
    return response.data
  } catch (error) {
    console.error("Brevo enroll email failed:", error.response?.data || error.message)
    throw error
  }
}


export const sendApplicationStatusUpdateEmail = async ({ to, name, jobTitle, status }) => {
  try {
    const payload = {
      sender: {
        name: "Sheriyansh Recruitment Team",
        email: "anshur9608837@gmail.com",
      },
      to: [
        {
          email: to,
          name: name || "Candidate",
        },
      ],
      subject: `Update on your application for ${jobTitle}`,
      htmlContent: `
        <div style="
          background:#f4f4f4;
          padding:30px;
          font-family:Arial, Helvetica, sans-serif;
        ">
          <div style="
            max-width:600px;
            margin:0 auto;
            background:#ffffff;
            border-radius:8px;
            padding:30px;
          ">

            <h2 style="
              margin-top:0;
              color:#1a73e8;
              font-weight:600;
            ">
              Hello ${name || "Candidate"},
            </h2>

            <p style="
              font-size:15px;
              color:#444;
              line-height:1.6;
            ">
              We would like to inform you that the status of your application for the
              <strong>${jobTitle}</strong> position has been updated.
            </p>

            <!-- STATUS BLOCK -->
            <div style="
              margin:24px 0;
              padding:16px 18px;
              background:#f8f9fb;
              border-left:4px solid #1a73e8;
            ">
              <p style="
                margin:0;
                font-size:12px;
                color:#777;
                text-transform:uppercase;
                letter-spacing:0.4px;
              ">
                Current Status
              </p>

              <p style="
                margin:6px 0 0 0;
                font-size:17px;
                font-weight:600;
                color:#1a73e8;
                text-transform:capitalize;
              ">
                ${status}
              </p>
            </div>

            <p style="
              font-size:15px;
              color:#444;
              line-height:1.6;
            ">
              We truly appreciate the time and effort you invested in applying.
              Our recruitment team will reach out to you if there are further steps.
            </p>

            <!-- VISIT MORE JOBS -->
            <div style="
              margin:28px 0;
              padding:16px;
              background:#f1f7ff;
              border-radius:6px;
            ">
              <p style="
                margin:0 0 8px 0;
                font-size:14px;
                color:#333;
                font-weight:600;
              ">
                Looking for more opportunities?
              </p>

              <p style="
                margin:0;
                font-size:14px;
                color:#555;
                line-height:1.6;
              ">
                You can explore and apply for more job openings on our platform:
                <br />
                <a
                  href="${FRONTEND_URL}"
                  target="_blank"
                  style="
                    color:#1a73e8;
                    font-weight:600;
                    text-decoration:none;
                  "
                >
                  Visit available job openings →
                </a>
              </p>
            </div>

            <hr style="
              border:none;
              border-top:1px solid #e6e6e6;
              margin:30px 0;
            " />

            <p style="
              font-size:14px;
              color:#555;
            ">
              Best regards,<br />
              <strong>Sheriyansh Recruitment Team</strong>
            </p>

            <p style="
              font-size:12px;
              color:#888;
              margin-top:20px;
            ">
              © ${new Date().getFullYear()} Sheriyansh. All rights reserved.
            </p>

          </div>
        </div>
      `,
      textContent: `Hello ${name || "Candidate"},

We would like to inform you that the status of your application for the
"${jobTitle}" position has been updated.

Current Status: ${status}

Explore more job opportunities:
${FRONTEND_URL}

Best regards,
Sheriyansh Recruitment Team`,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log("APPLICATION STATUS UPDATE EMAIL SENT:", response.data?.messageId)

    return response.data
  } catch (error) {
    console.error(
      "Brevo application status update email failed:",
      error.response?.data || error.message
    )
    throw error
  }
}