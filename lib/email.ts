import { Resend } from 'resend';

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export type EmailSendResult = {
  ok: boolean;
  skipped?: boolean;
  messageId?: string;
  to: string;
  subject: string;
  message: string;
};

const emailGlobals = globalThis as typeof globalThis & {
  __batteryStoreResendClient?: Resend;
};

export function getEmailConfig() {
  return {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL,
    fromName: process.env.RESEND_FROM_NAME ?? 'Battery Store',
  };
}

export function isEmailConfigured() {
  const config = getEmailConfig();
  return Boolean(config.apiKey && config.fromEmail);
}

function getResendClient() {
  if (emailGlobals.__batteryStoreResendClient) {
    return emailGlobals.__batteryStoreResendClient;
  }

  const config = getEmailConfig();

  if (!isEmailConfigured()) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.');
  }

  emailGlobals.__batteryStoreResendClient = new Resend(config.apiKey);
  return emailGlobals.__batteryStoreResendClient;
}

export async function sendEmail(payload: EmailPayload): Promise<EmailSendResult> {
  if (!isEmailConfigured()) {
    return {
      ok: false,
      skipped: true,
      to: payload.to,
      subject: payload.subject,
      message: 'Resend is not configured.',
    };
  }

  const resend = getResendClient();
  const config = getEmailConfig();
  const { data, error } = await resend.emails.send({
    from: `${config.fromName} <${config.fromEmail}>`,
    to: [payload.to],
    subject: payload.subject,
    html: payload.html,
  });

  if (error) {
    return {
      ok: false,
      to: payload.to,
      subject: payload.subject,
      message: error.message,
    };
  }

  return {
    ok: true,
    to: payload.to,
    subject: payload.subject,
    messageId: data?.id,
    message: 'Email sent successfully.',
  };
}
