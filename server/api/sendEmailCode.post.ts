import nodemailer, { Transporter } from 'nodemailer'
import {replyFailure, replySuccess} from '~/server/scripts/utils'
import Mail from 'nodemailer/lib/mailer'
import {EmailCode} from "~/server/models/emailCode";

let transporter: Transporter | null = null

const createTransporter = () => {
  transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST, // 主机
    port: Number(process.env.SMTP_PORT), // SMTP 端口
    secure: JSON.parse(process.env.SMTP_SECURE || 'false'), // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  });
}

const sendEmail = async (mailOptions: Mail.Options) => {
  console.log(mailOptions)
  if (!transporter) {
    createTransporter()
  }
  if (!transporter) {
    return
  }
  const info = await transporter.sendMail({
    from: 'cleveryun@163.com', // sender address
    // to: "bar@example.com, baz@example.com", // list of receivers
    // subject: "Hello ✔", // Subject line
    // text: "Hello world?", // plain text body
    // html: "<b>Hello world?</b>", // html body
    ...mailOptions,
  })
  console.log("Message sent: %s", info.messageId);
}


export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}

  const email = body.email

  if (!email) {
    return replyFailure('请输入邮箱地址')
  }

  const code = String(Math.round(Math.random() * 1000))
  const [emailCode, created] = await EmailCode.findOrCreate({
    where: {
      email,
    },
    defaults: {
      email,
      code,
    }
  })
  if (!created) {
    await emailCode.update({ code })
  }
  const { siteTitle } = useRuntimeConfig().public
  await sendEmail({
    to: email,
    subject: `${siteTitle} validation`,
    text: `您的邮箱验证码是${code}`,
    html: [
      '<h2>您的邮箱验证码是</h2>',
      `<p>${code}</p>`
    ].join('')
  })

  return replySuccess('验证码已发送到您的邮箱，请留意查收', email)
})
