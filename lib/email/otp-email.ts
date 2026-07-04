import emailjs from "@emailjs/nodejs";

export async function sendOtpEmail(email: string, otp: string) {
  const serviceId = process.env.Emailjs_ServiceId;
  const templateId = process.env.Emailjs_TemplateId;
  const publicKey = process.env.Emailjs_PublicId;
  const privateKey = process.env.Emailjs_PrivateId;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error("Email config missing");
  }

  const response = await emailjs.send(
    serviceId,
    templateId,
    { email, otp },
    { publicKey, privateKey }
  );

  return response.status === 200;
}