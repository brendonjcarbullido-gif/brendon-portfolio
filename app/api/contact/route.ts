import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY ?? '')

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'brendonjcarbullido@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `<div style="font-family:Georgia,serif;max-width:600px;padding:40px;"><h2 style="color:#C9A84C;font-weight:400;font-size:13px;letter-spacing:2px;text-transform:uppercase;">New message from your portfolio</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><hr/><p style="white-space:pre-wrap;line-height:1.8;">${message}</p></div>`,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
