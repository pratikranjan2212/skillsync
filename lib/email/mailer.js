import nodemailer from "nodemailer";

/**
 * Nodemailer transporter using Gmail SMTP with an app password.
 * The credentials are stored in environment variables for security.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

/**
 * Sends a branded OTP verification email to the given address.
 *
 * @param {string} to    - Recipient email address
 * @param {string} otp   - 6-digit OTP string
 * @param {string} name  - Recipient's display name (optional)
 * @returns {Promise<void>}
 */
export async function sendOtpEmail(to, otp, name = "Student") {
  const firstName = name?.split(" ")[0] || "Student";

  const mailOptions = {
    from: `"SkillSync" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `${otp} is your SkillSync verification code`,
    text: `Hi ${firstName},\n\nYour SkillSync email verification code is: ${otp}\n\nThis code expires in 10 minutes. Do not share it with anyone.\n\nIf you didn't create a SkillSync account, you can safely ignore this email.\n\n— The SkillSync Team`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkillSync Email Verification</title>
</head>
<body style="margin:0;padding:0;background:#F5F5F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F3;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:24px;border:1px solid rgba(0,0,0,0.06);overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(0,0,0,0.06);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:99px;padding:4px 14px;font-size:12px;font-weight:700;color:#065F46;letter-spacing:0.03em;">✦ SkillSync</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <h1 style="margin:0;font-size:22px;font-weight:800;color:#111111;letter-spacing:-0.02em;">Verify your email address</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 8px;font-size:14px;color:#494D4D;line-height:1.6;">Hi <strong>${firstName}</strong>,</p>
              <p style="margin:0 0 28px;font-size:14px;color:#494D4D;line-height:1.6;">
                Use the verification code below to confirm your email and activate your SkillSync account.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background:#F5F5F3;border-radius:16px;padding:28px 24px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#888888;letter-spacing:0.1em;text-transform:uppercase;">Your verification code</p>
                    <p style="margin:0;font-size:44px;font-weight:900;color:#111111;letter-spacing:0.18em;font-variant-numeric:tabular-nums;">${otp}</p>
                    <p style="margin:12px 0 0;font-size:12px;color:#999999;">Expires in <strong style="color:#111111;">10 minutes</strong></p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px;font-size:13px;color:#494D4D;line-height:1.6;">
                Enter this code on the verification page to complete your sign-up.
              </p>
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
                For your security, never share this code with anyone. SkillSync will never ask for your OTP via phone or chat.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid rgba(0,0,0,0.06);">
              <p style="margin:0;font-size:12px;color:#BBBBBB;line-height:1.6;">
                If you didn't create a SkillSync account, you can safely ignore this email.<br/>
                © ${new Date().getFullYear()} SkillSync. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };

  await transporter.sendMail(mailOptions);
}
