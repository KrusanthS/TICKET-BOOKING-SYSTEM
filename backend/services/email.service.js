const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {}
  };

  // Use OAuth2 if credentials are available
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN) {
    config.auth = {
      type: 'OAuth2',
      user: process.env.SMTP_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN
    };
    console.log('📡 Email Service: Using OAuth2 for authentication');
  } else {
    config.auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    };
    console.log('📡 Email Service: Using SMTP Password for authentication');
  }

  transporter = nodemailer.createTransport(config);
  return transporter;
};

const sendOtpEmail = async ({ to, otp }) => {
  const transport = getTransporter();
  if (!transport) throw new Error('Email transporter not available');
  await transport.sendMail({
    from: `"VDart VDesk" <${process.env.FROM_EMAIL || process.env.SUPPORT_EMAIL}>`,
    to,
    subject: `🔐 ${otp} is your VDesk Verification Code`,
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background-color: #f4f7f9; padding: 40px 20px;">
          <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;">
            <div style="background-color: #1E40AF; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px;">VDesk</h1>
              <p style="color: #bfdbfe; margin: 10px 0 0; font-size: 14px;">Technical Support Portal</p>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #111827; margin: 0 0 16px; font-size: 20px; font-weight: 700; text-align: center;">Verification Code</h2>
              <p style="color: #4b5563; margin: 0 0 32px; font-size: 16px; line-height: 1.6; text-align: center;">Enter the 6-digit code below to securely sign in to your account. This code is valid for <strong>5 minutes</strong>.</p>
              
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; display: inline-block;">
                  <span style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #1E40AF; font-family: 'Courier New', Courier, monospace;">${otp}</span>
                </div>
              </div>
              
              <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin-bottom: 32px;">
                <p style="color: #92400e; margin: 0; font-size: 13px; line-height: 1.5;"><strong>Security Tip:</strong> Never share this code with anyone. VDesk Support will never ask for your verification code.</p>
              </div>
              
              <p style="color: #9ca3af; margin: 0; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email or contact support if you're concerned.</p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="color: #6b7280; margin: 0; font-size: 12px;">© 2024 VDart Inc. Technical Support Division</p>
            </div>
          </div>
        </div>
      `
  });
  console.log(`📧 Branded OTP email sent to ${to}`);
};

const sendVerificationEmail = async ({ to, verifyUrl }) => {
  const transport = getTransporter();
  if (!transport) throw new Error('Email transporter not available');
  await transport.sendMail({
    from: `"TicketDesk" <${process.env.FROM_EMAIL || process.env.SUPPORT_EMAIL}>`,
    to,
    subject: 'Verify your TicketDesk email',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1E40AF; color: white; padding: 24px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Verify your email address</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
            <p>Hi there,</p>
            <p>Someone requested to register this email address on <strong>TicketDesk</strong>. Click the button below to verify your email.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #1E40AF; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 1rem;">Verify My Email</a>
            </div>
            <p style="font-size: 0.85rem; color: #6c757d;">This link expires in <strong>24 hours</strong>. If you did not request this, ignore this email.</p>
            <p style="font-size: 0.75rem; color: #adb5bd; margin-top: 20px;">Or copy this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
          </div>
        </div>
      `
  });
  console.log(`📧 Verification email sent to ${to}`);
};

const sendPasswordSetEmail = async ({ to, name, password }) => {
  try {
    const transport = getTransporter();
    if (!transport) return;
    await transport.sendMail({
      from: `"TicketDesk" <${process.env.FROM_EMAIL || process.env.SUPPORT_EMAIL}>`,
      to,
      subject: 'Your TicketDesk account is ready',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; color: white; padding: 24px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">✅ Your account is ready!</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your TicketDesk account has been activated by the admin. Here are your login details:</p>
            <div style="background: white; border: 1px solid #dee2e6; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Email:</strong> ${to}</p>
              <p style="margin: 0;"><strong>Password:</strong> <code style="background: #f1f3f5; padding: 2px 8px; border-radius: 4px;">${password}</code></p>
            </div>
            <p style="color: #dc3545; font-weight: 600;">⚠️ Please keep this password safe. If you forget it, raise a support ticket and the admin will reset it for you.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background: #1E40AF; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700;">Login Now</a>
            </div>
          </div>
        </div>
      `
    });
    console.log(`📧 Password set email sent to ${to}`);
  } catch (err) {
    console.error('❌ Password set email error:', err.message);
  }
};

const sendTicketConfirmation = async ({ to, name, ticket }) => {
  try {
    const transport = getTransporter();
    if (!transport) return;

    const mailOptions = {
      from: `"IT Support" <${process.env.SUPPORT_EMAIL}>`,
      to,
      subject: `[${ticket.ticketId}] Ticket Received: ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 20px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">🎫 Ticket Received</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your ticket has been successfully created and is being reviewed by our support team.</p>
            <div style="background: white; border: 1px solid #dee2e6; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
              <p style="margin: 0 0 8px;"><strong>Title:</strong> ${ticket.title}</p>
              <p style="margin: 0 0 8px;"><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
              <p style="margin: 0 0 8px;"><strong>Category:</strong> ${ticket.category}</p>
              <p style="margin: 0;"><strong>SLA Deadline:</strong> ${ticket.sla?.deadline ? new Date(ticket.sla.deadline).toLocaleString() : 'N/A'}</p>
            </div>
            <p>You will receive updates as your ticket progresses. You can also track your ticket status by logging into the support portal.</p>
            <p style="color: #6c757d; font-size: 13px; margin-top: 30px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    if (ticket.emailSource && ticket.emailSource.messageId) {
      mailOptions.inReplyTo = ticket.emailSource.messageId;
      mailOptions.references = [ticket.emailSource.messageId];
      // Keep the original subject if it was a reply? 
      // Actually keeping the ticket subject is better for tracking.
    }

    await transport.sendMail(mailOptions);
    console.log(`📧 Confirmation email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email send error:', err.message);
  }
};

const sendStatusUpdate = async ({ to, name, ticket, newStatus }) => {
  try {
    const transport = getTransporter();
    if (!transport) return;

    const statusColors = {
      in_progress: '#0d6efd',
      resolved: '#198754',
      closed: '#6c757d',
      pending_info: '#fd7e14'
    };

    await transport.sendMail({
      from: `"IT Support" <${process.env.SUPPORT_EMAIL}>`,
      to,
      subject: `[${ticket.ticketId}] Status Update: ${newStatus.replace('_', ' ').toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${statusColors[newStatus] || '#1a1a2e'}; color: white; padding: 20px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">📋 Ticket Status Update</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your ticket <strong>${ticket.ticketId}</strong> status has been updated to <strong>${newStatus.replace(/_/g, ' ').toUpperCase()}</strong>.</p>
            ${newStatus === 'resolved' ? `<p style="color: #198754;"><strong>✅ Your issue has been resolved!</strong></p>` : ''}
            <p style="color: #6c757d; font-size: 13px; margin-top: 30px;">Log in to the portal for full details and to provide feedback.</p>
          </div>
        </div>
      `
    });
    console.log(`📧 Status update email sent to ${to}`);
  } catch (err) {
    console.error('❌ Status email error:', err.message);
  }
};

const sendAckEmail = async ({ to, name, ticket }) => {
  try {
    const transport = getTransporter();
    if (!transport) return;

    await transport.sendMail({
      from: `"IT Support" <${process.env.FROM_EMAIL || process.env.SUPPORT_EMAIL}>`,
      to,
      subject: `[${ticket.ticketId}] We've received your request`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 20px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">✅ Request Acknowledged</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We have received your support request and our team is now working on it.</p>
            <div style="background: white; border: 1px solid #dee2e6; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
              <p style="margin: 0 0 8px;"><strong>Title:</strong> ${ticket.title}</p>
              <p style="margin: 0;"><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
            </div>
            <p style="color: #6c757d; font-size: 13px; margin-top: 30px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    });
    console.log(`📧 Ack email sent to ${to}`);
  } catch (err) {
    console.error('❌ Ack email error:', err.message);
  }
};

const sendResolveEmail = async ({ to, name, ticket }) => {
  try {
    const transport = getTransporter();
    if (!transport) return;

    await transport.sendMail({
      from: `"IT Support" <${process.env.FROM_EMAIL || process.env.SUPPORT_EMAIL}>`,
      to,
      subject: `[${ticket.ticketId}] Your request has been resolved`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #198754; color: white; padding: 20px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">✅ Issue Officially Resolved</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your support ticket has been officially closed following your confirmation.</p>
            <div style="background: white; border: 1px solid #dee2e6; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
              <p style="margin: 0 0 8px;"><strong>Title:</strong> ${ticket.title}</p>
              <p style="margin: 0;"><strong>Final Status:</strong> COMPLETED / CLOSED</p>
            </div>
            <p>Thank you for your feedback and for helping us maintain high support standards.</p>
            <p style="color: #6c757d; font-size: 13px; margin-top: 30px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    });
    console.log(`📧 Resolve email sent to ${to}`);
  } catch (err) {
    console.error('❌ Resolve email error:', err.message);
  }
};

const sendStatusChangeEmail = async ({ to, name, ticket, newStatus }) => {
  try {
    const transport = getTransporter();
    if (!transport) return;

    const statusMap = {
      assigned:        { label: '👤 Ticket Assigned',        color: '#6366F1', message: 'Your ticket has been assigned to a support agent who will begin working on it shortly.' },
      in_progress:     { label: '🔧 We are working on it',   color: '#2563EB', message: 'Good news! Our team has started working on your problem. We will keep you updated.' },
      almost_complete: { label: '🏁 Almost done!',           color: '#7C3AED', message: 'We are almost finished fixing your issue. It should be resolved very soon.' },
      resolved:        { label: '🔍 Fix Verification Requested', color: '#059669', message: 'The agent has finished their work and marked the issue as fixed. Please log in to verify the solution so we can officially close this ticket.' },
      pending_info:    { label: '❓ We need more info',      color: '#D97706', message: 'We need a bit more information from you to continue. Please check your ticket and reply.' },
      reopened:        { label: '🔄 Ticket Reopened',        color: '#EF4444', message: 'Your ticket has been reopened and is back in our queue.' },
      closed:          { label: '🔒 Ticket closed',          color: '#64748B', message: 'Your ticket has been closed. If the problem comes back, you can always open a new one.' },
    };

    const s = statusMap[newStatus] || { label: `Update on your ticket`, color: '#1a1a2e', message: `Your ticket status has been updated to ${newStatus.replace(/_/g, ' ')}.` };

    const mailOptions = {
      from: `"IT Support" <${process.env.FROM_EMAIL || process.env.SUPPORT_EMAIL}>`,
      to,
      subject: `[${ticket.ticketId}] ${s.label}: ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${s.color}; color: white; padding: 20px 30px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">${s.label}</h2>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>${s.message}</p>
            <div style="background: white; border: 1px solid #dee2e6; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 8px;"><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
              <p style="margin: 0 0 8px;"><strong>Problem:</strong> ${ticket.title}</p>
              <p style="margin: 0;"><strong>Current Status:</strong> ${newStatus.replace(/_/g, ' ').toUpperCase()}</p>
            </div>
            <p>You can check your ticket anytime by logging into the support portal.</p>
            <p style="color: #6c757d; font-size: 13px; margin-top: 30px;">This is an automatic update. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    // Threading support for email-originated tickets
    if (ticket.emailSource && ticket.emailSource.messageId) {
      mailOptions.inReplyTo = ticket.emailSource.messageId;
      mailOptions.references = [ticket.emailSource.messageId];
    }

    await transport.sendMail(mailOptions);
    console.log(`📧 Status change email (${newStatus}) sent to ${to}`);
  } catch (err) {
    console.error('❌ Status change email error:', err.message);
  }
};

module.exports = { sendOtpEmail, sendVerificationEmail, sendPasswordSetEmail, sendTicketConfirmation, sendStatusUpdate, sendAckEmail, sendResolveEmail, sendStatusChangeEmail };

