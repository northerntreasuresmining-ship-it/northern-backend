const transporter = require('../config/mailer');

const brandColor = '#C5A059';
const brandName = 'Northern Treasures';

const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName}</title>
</head>
<body style="margin:0;padding:0;background-color:#0B0B0B;font-family:'Helvetica Neue',Arial,sans-serif;color:#ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" style="max-width:560px;" cellspacing="0" cellpadding="0" border="0">
          <!-- Header -->
          <tr>
            <td align="center" style="background:#1A1A1A;border-radius:2px 2px 0 0;padding:40px 40px;border-bottom:1px solid #C5A059;">
              <h1 style="margin:0;color:#C5A059;font-size:24px;font-weight:900;letter-spacing:4px;text-transform:uppercase;">${brandName}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#111111;padding:40px;border-radius:0 0 2px 2px;box-shadow:0 10px 40px rgba(0,0,0,0.5);">
              ${content}
              <!-- Footer -->
              <hr style="border:none;border-top:1px solid rgba(197,160,89,0.1);margin:40px 0 32px;">
              <p style="margin:0;color:#444444;font-size:10px;text-align:center;line-height:1.6;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
                © ${new Date().getFullYear()} ${brandName}. All rights reserved.<br>
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * @desc    Send verification email
 */
exports.sendVerificationEmail = async (email, verificationToken) => {
    const verificationUrl = `${process.env.CLIENT_URL}/#/verify-email?token=${verificationToken}`;

    const content = `
      <div style="text-align:center;margin-bottom:40px;">
        <h2 style="margin:0 0 12px;color:#C5A059;font-size:20px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Account Verification</h2>
        <p style="margin:0;color:#888888;font-size:14px;line-height:1.6;">Welcome to the collection. Activate your access below.</p>
      </div>
      <div style="text-align:center;margin:40px 0;">
        <a href="${verificationUrl}"
           style="display:inline-block;background:#C5A059;color:#000000;text-decoration:none;padding:18px 48px;border-radius:2px;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">
          Verify Identity
        </a>
      </div>
      <p style="color:#444444;font-size:11px;text-align:center;margin:0;line-height:1.6;">
        This link expires in 24 hours.<br>
        If the button fails, visit:<br>
        <a href="${verificationUrl}" style="color:#C5A059;word-break:break-all;text-decoration:none;">${verificationUrl}</a>
      </p>
    `;

    const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Verify your ${brandName} account`,
        html: emailWrapper(content)
    };

    await transporter.sendMail(mailOptions);
};

/**
 * @desc    Send password reset email
 */
exports.sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/#/reset-password?token=${resetToken}`;

    const content = `
      <div style="text-align:center;margin-bottom:40px;">
        <h2 style="margin:0 0 12px;color:#C5A059;font-size:20px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Identity Reset</h2>
        <p style="margin:0;color:#888888;font-size:14px;line-height:1.6;">Click below to establish a new password for your account.</p>
      </div>
      <div style="text-align:center;margin:40px 0;">
        <a href="${resetUrl}"
           style="display:inline-block;background:#C5A059;color:#000000;text-decoration:none;padding:18px 48px;border-radius:2px;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">
          Reset Password
        </a>
      </div>
      <p style="color:#444444;font-size:11px;text-align:center;margin:0;line-height:1.6;">
        This request expires in 1 hour.<br>
        If you didn't request this, please ignore this email.<br><br>
        <a href="${resetUrl}" style="color:#C5A059;word-break:break-all;text-decoration:none;">${resetUrl}</a>
      </p>
    `;

    const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Reset your ${brandName} password`,
        html: emailWrapper(content)
    };

    await transporter.sendMail(mailOptions);
};

/**
 * @desc    Send order confirmation email
 */
exports.sendOrderConfirmationEmail = async (email, order) => {
    const content = `
      <div style="text-align:center;margin-bottom:40px;">
        <h2 style="margin:0 0 12px;color:#C5A059;font-size:20px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Order Received</h2>
        <p style="margin:0;color:#888888;font-size:14px;line-height:1.6;">Thank you for choosing the collection. Your order is being processed.</p>
      </div>
      <div style="background:#1A1A1A;border-radius:2px;padding:32px;margin:24px 0;border-left:4px solid #C5A059;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="color:#C5A059;font-[10px];font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Order Reference</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:16px;font-weight:700;padding-bottom:24px;">${order._id}</td>
          </tr>
          <tr>
            <td style="color:#C5A059;font-[10px];font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Total Investment</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:24px;font-weight:900;">$${order.totalPrice}</td>
          </tr>
        </table>
      </div>
      <p style="color:#444444;font-size:11px;text-align:center;line-height:1.6;">
        We will notify you once your selection has been dispatched.
      </p>
    `;

    const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Confirmation — ${brandName} Order ${order._id}`,
        html: emailWrapper(content)
    };

    await transporter.sendMail(mailOptions);
};

/**
 * @desc    Send shipping update email
 */
exports.sendShippingUpdateEmail = async (email, order) => {
    const content = `
      <div style="text-align:center;margin-bottom:40px;">
        <h2 style="margin:0 0 12px;color:#C5A059;font-size:20px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">Package Dispatched</h2>
        <p style="margin:0;color:#888888;font-size:14px;line-height:1.6;">Excellent news. Your ${brandName} selection is currently in transit.</p>
      </div>
      <div style="background:#1A1A1A;border-radius:2px;padding:32px;margin:24px 0;border-left:4px solid #C5A059;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="color:#C5A059;font-[10px];font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Order Reference</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:14px;font-weight:700;padding-bottom:24px;">${order._id}</td>
          </tr>
          <tr>
            <td style="color:#C5A059;font-[10px];font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Tracking Number</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:18px;font-weight:900;letter-spacing:1px;">${order.trackingNumber || 'PENDING'}</td>
          </tr>
        </table>
      </div>
      <p style="color:#444444;font-size:11px;text-align:center;line-height:1.6;">
        We anticipate you will be pleased with your new acquisition.
      </p>
    `;

    const mailOptions = {
        from: `"${brandName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Dispatched — ${brandName} Order ${order._id}`,
        html: emailWrapper(content)
    };

    await transporter.sendMail(mailOptions);
};

/**
 * @desc    Send contact/support email to admin
 */
exports.sendSupportEmail = async (name, email, subject, message) => {
    const adminEmail = 'northerntreasuresmining@gmail.com'; // Admin destination
    
    const content = `
      <div style="text-align:center;margin-bottom:40px;">
        <h2 style="margin:0 0 12px;color:#C5A059;font-size:20px;font-weight:900;letter-spacing:2px;text-transform:uppercase;">New Support Inquiry</h2>
        <p style="margin:0;color:#888888;font-size:14px;line-height:1.6;">A new message was submitted via the contact form.</p>
      </div>
      <div style="background:#1A1A1A;border-radius:2px;padding:32px;margin:24px 0;border-left:4px solid #C5A059;">
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="color:#C5A059;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Name</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:14px;font-weight:700;padding-bottom:16px;">${name}</td>
          </tr>
          <tr>
            <td style="color:#C5A059;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Email Address</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:14px;font-weight:700;padding-bottom:16px;"><a style="color:#ffffff;" href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="color:#C5A059;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Subject</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:14px;font-weight:700;padding-bottom:16px;">${subject}</td>
          </tr>
          <tr>
            <td style="color:#C5A059;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;">Message</td>
          </tr>
          <tr>
            <td style="color:#ffffff;font-size:14px;font-weight:400;line-height:1.5;white-space:pre-wrap;">${message}</td>
          </tr>
        </table>
      </div>
    `;

    const mailOptions = {
        from: `"${brandName} System" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        replyTo: email,
        subject: `Support Inquiry: ${subject}`,
        html: emailWrapper(content)
    };

    await transporter.sendMail(mailOptions);
};
