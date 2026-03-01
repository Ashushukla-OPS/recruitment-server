import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

const FRONTEND_URL = "http://localhost:3000"

/**
 * Send Blog Published Email
 */
export async function sendBlogPublishedEmail(data) {

  const blogLink = `${FRONTEND_URL}/blog/${data.blogSlug}`

  const payload = {
    sender: {
      name: "InsightfulBlog",
      email: "hr@sheryians.com"
    },

    to: [
      {
        email: data.to,
        name: "Reader"
      }
    ],

    subject: `New Blog Published: ${data.blogTitle}`,

    htmlContent: `
<div style="font-family:Arial;padding:40px;background:#f6f7fb">

<div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:10px">

<h2 style="margin:0;color:#111">
InsightfulBlog
</h2>

<h1 style="margin-top:10px">
🚀 New Blog Published
</h1>

<p>
A new article has been published.
</p>

<div style="background:#f1f5f9;padding:15px;border-radius:8px;margin:20px 0">

<b>Blog Title:</b><br>
${data.blogTitle}

</div>

<a href="${blogLink}"
style="
display:inline-block;
padding:12px 25px;
background:black;
color:white;
text-decoration:none;
border-radius:6px;
margin-top:10px
">
Read Article
</a>

<p style="margin-top:20px;font-size:12px;color:gray">

${blogLink}

</p>

</div>
</div>
`,

    textContent: `
New Blog Published

Title: ${data.blogTitle}

Read here:
${blogLink}
`
  }

  const response = await axios.post(BREVO_URL, payload, {

    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json"
    }

  })

  console.log("BLOG EMAIL SENT:", response.data.messageId)

}