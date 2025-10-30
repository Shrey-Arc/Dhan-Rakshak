import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dhanrakshak-backend.onrender.com/"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token = req.headers.get("authorization") || ""

    // Conditionally include ngrok header only when targeting ngrok
    const isNgrok = API_BASE_URL.includes("ngrok")

    const res = await fetch(`${API_BASE_URL}/user/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
        ...(isNgrok ? { "ngrok-skip-browser-warning": "true" } : {}),
      },
      body: JSON.stringify(body),
    })

    // Pass through JSON
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(
      { success: res.ok, ...(res.ok ? data : { error: data.error || res.statusText }) },
      { status: res.status },
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to submit user details" },
      { status: 500 },
    )
  }
}
