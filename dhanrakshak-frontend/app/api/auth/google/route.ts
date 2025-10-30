import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const idToken = body?.id_token

    if (!idToken) {
      return NextResponse.json({ success: false, error: "Missing id_token" }, { status: 400 })
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dhanrakshak-backend.onrender.com/"

    const url = new URL("/auth/google", API_BASE_URL).toString()

    // Forward the request to the backend
    const isNgrok = API_BASE_URL.includes("ngrok")

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isNgrok ? { "ngrok-skip-browser-warning": "true" } : {}),
      },
      body: JSON.stringify({ id_token: idToken }),
    })

    const contentType = resp.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      const text = await resp.text().catch(() => "")
      return NextResponse.json(
        {
          success: false,
          error:
            text || `Unexpected response from backend (status ${resp.status}). Ensure /auth/google exists on your API.`,
        },
        { status: resp.status || 502 },
      )
    }

    const data = await resp.json()
    // Pass through backend response as-is to keep existing client logic working
    return NextResponse.json(data, { status: resp.status })
  } catch (err: any) {
    console.error("[v0] /api/auth/google proxy failed:", err?.message || err)
    return NextResponse.json(
      { success: false, error: "Auth proxy failed. Verify NEXT_PUBLIC_API_BASE_URL and backend /auth/google." },
      { status: 502 },
    )
  }
}
