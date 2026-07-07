import emailjs from "@emailjs/nodejs";

function getEmailConfig() {
  const serviceId = process.env.Emailjs_ServiceId;
  const templateId = process.env.Emailjs_TemplateId;
  const publicKey = process.env.Emailjs_PublicId;
  const privateKey = process.env.Emailjs_PrivateId;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error("Email config missing");
  }

  return { serviceId, templateId, publicKey, privateKey };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "unknown email";

  return `${name[0] ?? "*"}${name.length > 1 ? "***" : ""}@${domain}`;
}

export async function sendOtpEmail(email: string, otp: string) {
  try {
    const { serviceId, templateId, publicKey, privateKey } = getEmailConfig();
    const trimmedEmail = email.trim().toLowerCase();
    const recipientName = trimmedEmail.split("@")[0] || "LinkDeck user";
    const message = `Your LinkDeck verification code is ${otp}. It expires in 10 minutes.`;

    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        email: trimmedEmail,
        to_email: trimmedEmail,
        user_email: trimmedEmail,
        recipient_email: trimmedEmail,
        reply_to: trimmedEmail,
        to_name: recipientName,
        name: recipientName,
        from_name: "LinkDeck",
        otp,
        code: otp,
        otp_code: otp,
        passcode: otp,
        message,
        app_name: "LinkDeck",
        subject: "Your LinkDeck verification code",
      },
      { publicKey, privateKey }
    );

    const accepted = response.status >= 200 && response.status < 300;

    if (accepted) {
      console.info(
        `[email] EmailJS accepted OTP email for ${maskEmail(trimmedEmail)}. status=${response.status} text=${response.text}`
      );
      return true;
    }

    console.error(
      `[email] EmailJS rejected OTP email for ${maskEmail(trimmedEmail)}. status=${response.status} text=${response.text}`
    );
    return false;
  } catch (error) {
    console.error(`[email] Failed to send OTP email: ${getErrorMessage(error)}`);
    return false;
  }
}