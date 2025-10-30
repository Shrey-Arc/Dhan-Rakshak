import { generateText, embed } from "ai"
import fs from "node:fs/promises"
import path from "node:path"

type Embedding = number[]

interface Chunk {
  id: string
  text: string
  embedding: Embedding
}

interface RagIndex {
  chunks: Chunk[]
  builtAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var __RAG_INDEX__: RagIndex | undefined
}

const EMBEDDING_MODEL = "openai/text-embedding-3-small" // AI Gateway-supported, no extra key needed
const GENERATION_MODEL = "groq/llama-3.1-70b-versatile" // Use Groq via AI Gateway with GROQ_API_KEY

function cosineSimilarity(a: Embedding, b: Embedding): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8)
}

async function readDataTxt(): Promise<string> {
  const filePath = path.join(process.cwd(), "data", "data.txt")
  const content = await fs.readFile(filePath, "utf-8")
  return content
}

function splitIntoChunks(text: string, chunkSize = 800, overlap = 200): string[] {
  // Simple paragraph-first split, then merge to chunkSize with overlap
  const paras = text.split(/\n{2,}/)
  const chunks: string[] = []
  let current = ""

  const pushCurrent = () => {
    if (current.trim().length > 0) {
      chunks.push(current.trim())
      current = ""
    }
  }

  for (const p of paras) {
    const paragraph = p.trim()
    if (!paragraph) continue
    if ((current + "\n\n" + paragraph).length <= chunkSize) {
      current = current ? current + "\n\n" + paragraph : paragraph
    } else {
      // push current, then start a new chunk likely with overlap
      pushCurrent()
      // Overlap from previous end if possible
      const tail = current.slice(Math.max(0, current.length - overlap))
      current = tail ? tail + "\n\n" + paragraph : paragraph
      // If still too large, hard-split
      while (current.length > chunkSize) {
        chunks.push(current.slice(0, chunkSize))
        current = current.slice(chunkSize - overlap)
      }
    }
  }
  pushCurrent()

  // Final pass to enforce size/overlap if any large remains
  const final: string[] = []
  for (const c of chunks) {
    if (c.length <= chunkSize) {
      final.push(c)
    } else {
      let i = 0
      while (i < c.length) {
        const end = Math.min(i + chunkSize, c.length)
        final.push(c.slice(i, end))
        i = end - overlap
        if (i < 0) i = 0
        if (i >= c.length) break
      }
    }
  }
  return final
}

async function embedText(text: string): Promise<Embedding> {
  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: text,
  })
  return embedding
}

async function buildIndex(): Promise<RagIndex> {
  const data = await readDataTxt()
  const rawChunks = splitIntoChunks(data, 800, 200)

  const chunks: Chunk[] = []
  // Embed sequentially to minimize rate-limit issues
  for (let i = 0; i < rawChunks.length; i++) {
    const text = rawChunks[i]
    const embedding = await embedText(text)
    chunks.push({ id: `chunk-${i}`, text, embedding })
  }

  return { chunks, builtAt: Date.now() }
}

async function getIndex(): Promise<RagIndex> {
  if (globalThis.__RAG_INDEX__) {
    return globalThis.__RAG_INDEX__
  }
  const idx = await buildIndex()
  globalThis.__RAG_INDEX__ = idx
  return idx
}

export async function retrieve(query: string, k = 5): Promise<Chunk[]> {
  const idx = await getIndex()
  const qEmb = await embedText(query)
  const scored = idx.chunks
    .map((c) => ({ c, score: cosineSimilarity(qEmb, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.c)
  return scored
}

function buildPrompt(context: string, question: string): string {
  return `You are an expert Indian Income Tax consultant. Answer using ONLY the provided context.

Context:
${context}

Question: ${question}

Instructions:
- Provide clear, readable answers (8-12 lines)
- Use line breaks between different points for better readability
- Mention key deductions with section numbers when relevant
- End with the final result clearly stated
- Use simple language, avoid jargon
- If asked anything outside of ITR-related topics, respond exactly with: "I don't know about this sorry"

Answer:`
}

export async function generateAnswer(question: string): Promise<string> {
  const top = await retrieve(question, 5)
  const context = top.map((t, i) => `[#${i + 1}] ${t.text}`).join("\n\n---\n\n")

  // Note: GROQ_API_KEY must be set in Connect > Vars. We don't hardcode secrets.
  const { text } = await generateText({
    model: GENERATION_MODEL,
    prompt: buildPrompt(context, question),
    // temperature: 0.3, // Optional; defaults are fine
  })

  return text.trim()
}
