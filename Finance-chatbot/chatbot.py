from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain.docstore.document import Document
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

# 🚀 Load Groq LLM (FREE & SUPER FAST!)
llm = ChatGroq(
    model="llama-3.3-70b-versatile",  # Latest & most accurate model
    temperature=0.3,
    max_tokens=1000
)

# 🔤 Embeddings (still local, very small model)
embedding = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

# 📄 Load ITR knowledge base
with open('data.txt', 'r', encoding='utf-8') as file:
    text_data = file.read()

# 🪜 Split markdown headers
headers_to_split_on = [
    ("#", "Header_1"),
    ("##", "Header_2"),
    ("###", "Header_3"),
    ("####", "Header_4"),
]
markdown_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=headers_to_split_on, 
    strip_headers=False)

header_split_data = markdown_splitter.split_text(text_data)

# ✂️ Split long content into smaller chunks
recursive_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=200,
    separators=["\n\n", "\n", ". ", " ", ""],
)

# 📦 Convert to LangChain Document objects
documents = []
for doc in header_split_data:
    if len(doc.page_content) > 800:
        for sub_chunk in recursive_splitter.split_text(doc.page_content):
            documents.append(
                Document(
                    page_content=sub_chunk, 
                    metadata=doc.metadata))
    else:
        documents.append(
            Document(
                page_content=doc.page_content, 
                metadata=doc.metadata))

vector_store = Chroma(
    persist_directory="Database", 
    embedding_function=embedding)


print(f"✅ Using vector store with {len(documents)} chunks")

# 🧩 Optimized Prompt for Readable Answers
prompt_template = """You are an expert Indian Income Tax consultant. Answer using ONLY the provided context.

Context:
{context}

Question: {question}

Instructions:
- Provide clear, readable answers (8-12 lines)
- Use line breaks between different points for better readability
- Add relevant emojis (💰📊✅❌) to make it engaging
- Mention key deductions with section numbers
- End with the final result clearly stated
- Use simple language, avoid jargon
- If asked anything outside of itr related stuff just say "I don't know about this sorry" don't say anything else only a single line not more then that

Answer:"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

# 🔗 Build RAG chain with Groq
rag = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vector_store.as_retriever(search_kwargs={"k": 5}),
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=False
)

print("\n" + "=" * 50)
print("💼 Hi! I'm your Finance Bot 🤖")
print("I'm here to help you with tax-related problems!")
print("Ask me anything about ITR, deductions, exemptions, and more.")
print("\n(Type 'exit' to quit)")
print("=" * 50 + "\n")

# 💬 Conversation History (stores last 5 exchanges)
conversation_history = []

# 🔁 Chat Loop
while True:
    query = input("❓ You: ")

    if query.strip().lower() in ["exit", "quit", "bye"]:
        print("👋 Bye! Have a great day filing your taxes 😎")
        break

    try:
        # Build context from conversation history
        history_context = ""
        if conversation_history:
            history_context = "\n\nPrevious Conversation:\n"
            for i, (q, a) in enumerate(conversation_history[-5:], 1):
                history_context += f"Q{i}: {q}\nA{i}: {a}\n\n"
        
        # Add history to the query
        query_with_history = f"{history_context}Current Question: {query}"
        
        result = rag.invoke(query_with_history)
        answer = result["result"].strip()

        # Store in history (keep last 5)
        conversation_history.append((query, answer))
        if len(conversation_history) > 5:
            conversation_history.pop(0)

        print(f"\n💡 Bot: {answer}\n")
        print("-" * 50 + "\n")

    except Exception as e:
        print(f"⚠️ Error: {e}\n")