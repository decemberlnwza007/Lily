import { NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const auth = new GoogleAuth({
  keyFile: "C:/api_lily/lily-467814-04ce967c84ed.json",
  scopes: "https://www.googleapis.com/auth/generative-language",
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );





    if (!res.ok) {
      const err = await res.json();
      console.error("Gemini API error:", err);
      return NextResponse.json(
        { reply: "เกิดข้อผิดพลาดจาก Gemini API" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "ไม่มีคำตอบ";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { reply: "เกิดข้อผิดพลาดในการเรียก API" },
      { status: 500 }
    );
  }
}
