const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendContactEmail = async ({
    name,
    email,
    subject,
    message,
}) => {
    const mailOptions = {
        from: `"Portfolio Website" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TO,
        replyTo: email,
        subject: `New Portfolio Contact: ${subject}`,
        text: `
New message received from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `.trim(),

        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
        <h2>New Portfolio Contact</h2>

        <p>
          You received a new message from your portfolio website.
        </p>

        <hr />

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <h3>Message</h3>

        <p style="white-space: pre-line;">
          ${message}
        </p>

        <hr />

        <p>
          You can reply directly to this email to contact ${name}.
        </p>
      </div>
    `,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendContactEmail;