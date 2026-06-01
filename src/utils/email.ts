import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = env.EMAIL_ENABLED
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null

export async function sendEmail(options: {
  to: string
  subject: string
  text?: string
  html?: string
}) {
  if (!env.EMAIL_ENABLED || !transporter) {
    console.info('Email disabled - skipping message', { to: options.to, subject: options.subject })
    return
  }

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM ?? 'no-reply@example.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })
  } catch (error) {
    console.error('Failed to send email', { error, to: options.to, subject: options.subject })
  }
}
