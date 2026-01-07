import axios from "axios"

const FRONTEND_URL = "https://recruitment-client-git-dev-anshu-pandeys-projects.vercel.app"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

// Test Result Email //

export async function sendTestResultEmail(data) {
  try {
    const payload = {
      sender: { name: "Sheriyans Team", email: "anshur9608837@gmail.com" },
      to: [{ email: data.to, name: data.name || "Candidate" }],
      subject: `Your Test Result – ${data.testTitle}`,
      htmlContent: `
        <div style="font-family: Arial; padding: 20px; background: #f4f4f4; border-radius: 10px;">
          <h2 style="color: #1a73e8;">Hi ${data.name || "Candidate"} 👋</h2>

          <p>Your result for <strong>${data.testTitle}</strong> has been published.</p>

          <table style="margin-top: 15px;">
            <tr>
              <td><strong>Score:</strong></td>
              <td>${data.score}</td>
            </tr>
            <tr>
              <td><strong>Percentage:</strong></td>
              <td>${data.percentage}%</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td>
                ${
                  data.isPassed
                    ? "<span style='color:green;'>Passed ✅</span>"
                    : "<span style='color:red;'>Failed ❌</span>"
                }
              </td>
            </tr>
          </table>

          <div style="margin: 25px 0;">
            <a
              href="${data.resultLink}"
              style="
                background-color:#1a73e8;
                color:#ffffff;
                padding:12px 20px;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;
              "
            >
              View Result
            </a>
          </div>

          <hr />
          <small>© ${new Date().getFullYear()} Sheriyansh</small>
        </div>
      `,
      textContent: `Your result for ${data.testTitle} is published. Score: ${data.score}, Percentage: ${data.percentage}%`,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("TEST RESULT EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "Brevo test result email failed:",
      error.response?.data || error.message
    );
  }
}