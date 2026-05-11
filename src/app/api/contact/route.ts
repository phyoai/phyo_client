import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = normalizeText(body?.fullName);
    const email = normalizeText(body?.email);
    const phoneNumber = normalizeText(body?.phoneNumber);
    const message = normalizeText(body?.message);

    if (!fullName || !email || !phoneNumber || !message) {
      return NextResponse.json(
        { message: "Please complete all contact form fields." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.EMAIL_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.EMAIL_PORT || 587);
    const smtpUser = process.env.EMAIL_USER;
    const smtpPass = process.env.EMAIL_PASS;
    const smtpFrom = process.env.CONTACT_FORM_FROM || smtpUser;
    const smtpTo = process.env.CONTACT_FORM_TO || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom || !smtpTo) {
      return NextResponse.json(
        { message: "Email is not configured for the contact form yet." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      replyTo: email,
      subject: "Phyo contact form submission",
      text: [
        `Full Name: ${fullName}`,
        `Email: ${email}`,
        `Phone Number: ${phoneNumber}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Phyo Contact Form Submission</h2>
          <p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone Number:</strong> ${escapeHtml(phoneNumber)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);

    return NextResponse.json(
      { message: "Something went wrong while sending your message." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
