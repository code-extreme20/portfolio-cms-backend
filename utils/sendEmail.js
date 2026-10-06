const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured"
      );
    }

    const recipient =
      process.env.MAIL_TO;

    if (!recipient) {
      throw new Error(
        "MAIL_TO is not configured"
      );
    }

    const sender =
      process.env.RESEND_FROM ||
      "onboarding@resend.dev";

    const { data, error } =
      await resend.emails.send({
        from: sender,

        to: [recipient],

        replyTo: email,

        subject:
          `Portfolio Contact: ${subject}`,

        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <title>New Portfolio Contact</title>
            </head>

            <body
              style="
                margin: 0;
                padding: 0;
                background: #f1f5f9;
                font-family:
                  Arial,
                  Helvetica,
                  sans-serif;
              "
            >
              <div
                style="
                  max-width: 650px;
                  margin: 40px auto;
                  padding: 0 16px;
                "
              >
                <div
                  style="
                    background: #ffffff;
                    border-radius: 14px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                  "
                >
                  <div
                    style="
                      padding: 24px;
                      background: #0f172a;
                      color: #ffffff;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        font-size: 22px;
                      "
                    >
                      New Portfolio Message
                    </h1>

                    <p
                      style="
                        margin: 8px 0 0;
                        color: #94a3b8;
                        font-size: 14px;
                      "
                    >
                      Someone submitted the contact
                      form on your portfolio.
                    </p>
                  </div>

                  <div
                    style="
                      padding: 24px;
                    "
                  >
                    <div
                      style="
                        margin-bottom: 18px;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 12px;
                          font-weight: bold;
                          color: #64748b;
                          text-transform: uppercase;
                        "
                      >
                        Name
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                          color: #0f172a;
                        "
                      >
                        ${escapeHtml(name)}
                      </p>
                    </div>

                    <div
                      style="
                        margin-bottom: 18px;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 12px;
                          font-weight: bold;
                          color: #64748b;
                          text-transform: uppercase;
                        "
                      >
                        Email
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                        "
                      >
                        <a
                          href="mailto:${escapeAttribute(
                            email
                          )}"
                          style="
                            color: #2563eb;
                            text-decoration: none;
                          "
                        >
                          ${escapeHtml(email)}
                        </a>
                      </p>
                    </div>

                    <div
                      style="
                        margin-bottom: 18px;
                      "
                    >
                      <p
                        style="
                          margin: 0 0 6px;
                          font-size: 12px;
                          font-weight: bold;
                          color: #64748b;
                          text-transform: uppercase;
                        "
                      >
                        Subject
                      </p>

                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                          color: #0f172a;
                        "
                      >
                        ${escapeHtml(subject)}
                      </p>
                    </div>

                    <div>
                      <p
                        style="
                          margin: 0 0 8px;
                          font-size: 12px;
                          font-weight: bold;
                          color: #64748b;
                          text-transform: uppercase;
                        "
                      >
                        Message
                      </p>

                      <div
                        style="
                          padding: 16px;
                          background: #f8fafc;
                          border: 1px solid #e2e8f0;
                          border-radius: 10px;
                        "
                      >
                        <p
                          style="
                            margin: 0;
                            white-space: pre-line;
                            line-height: 1.7;
                            font-size: 15px;
                            color: #334155;
                          "
                        >
                          ${escapeHtml(message)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style="
                      padding: 18px 24px;
                      background: #f8fafc;
                      border-top: 1px solid #e2e8f0;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        font-size: 12px;
                        color: #94a3b8;
                      "
                    >
                      This notification was generated
                      automatically by your Portfolio CMS.
                    </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      });

    if (error) {
      console.error(
        "Resend API error:",
        error
      );

      throw new Error(
        error.message ||
          "Failed to send contact email"
      );
    }

    console.log(
      "Contact email sent successfully:",
      data?.id
    );

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error(
      "Contact email sending failed:",
      error.message
    );

    throw error;
  }
};

// =========================
// HTML ESCAPING
// =========================

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const escapeAttribute = (value = "") => {
  return escapeHtml(value);
};

module.exports = sendContactEmail;