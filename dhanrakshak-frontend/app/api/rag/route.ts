import { generateAnswer } from "@/lib/rag"

export async function POST(req: Request) {
  try {
    const { question } = await req.json()
    if (!question || typeof question !== "string" || !question.trim()) {
      return new Response(JSON.stringify({ error: "Question is required" }), { status: 400 })
    }

    const answer = await generateAnswer(question.trim())
    return new Response(JSON.stringify({ answer }), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (e: any) {
    console.error("[v0] RAG route error:", e?.message || e)
    return new Response(JSON.stringify({ error: "RAG processing failed" }), { status: 500 })
  }
}
