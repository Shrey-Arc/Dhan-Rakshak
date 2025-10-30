"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, GitBranch, Workflow, Shield } from "lucide-react"

export default function DocumentationPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">DhanRakshak Documentation</h1>
          <Button onClick={handlePrint} className="gap-2">
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="container py-8 max-w-5xl">
        <Tabs defaultValue="overview" className="print:hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="api">API Docs</TabsTrigger>
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProjectOverview />
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <SystemArchitecture />
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <APIDocumentation />
          </TabsContent>

          <TabsContent value="flows" className="space-y-6">
            <FlowDiagrams />
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <SetupGuide />
          </TabsContent>
        </Tabs>

        {/* Print-only: All content */}
        <div className="hidden print:block space-y-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">DhanRakshak</h1>
            <p className="text-xl text-muted-foreground">Tax Integrity Platform - Complete Documentation</p>
            <p className="text-sm text-muted-foreground mt-2">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          <ProjectOverview />
          <div className="page-break" />

          <SystemArchitecture />
          <div className="page-break" />

          <APIDocumentation />
          <div className="page-break" />

          <FlowDiagrams />
          <div className="page-break" />

          <SetupGuide />
        </div>
      </div>
    </div>
  )
}

function ProjectOverview() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Overview
          </CardTitle>
          <CardDescription>DhanRakshak - Tax Integrity Platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Executive Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DhanRakshak is a blockchain-powered tax integrity platform that ensures transparency and immutability in
              tax record management. The platform combines modern web technologies with blockchain to create
              tamper-proof tax certificates and provide AI-powered financial assistance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Google OAuth Authentication for secure user access</li>
              <li>AI-Powered Tax Copilot for financial guidance</li>
              <li>Interactive Mind Map for tax planning visualization</li>
              <li>Blockchain-based data verification (Ethereum Sepolia)</li>
              <li>PDF Certificate generation with QR codes</li>
              <li>Real-time data integrity verification</li>
              <li>Comprehensive dashboard with analytics</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <h4 className="text-sm font-medium mb-1">Frontend</h4>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>• Next.js 15 (App Router)</li>
                  <li>• React 19</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS v4</li>
                  <li>• shadcn/ui Components</li>
                  <li>• Framer Motion</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Backend</h4>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>• Node.js + Express</li>
                  <li>• MongoDB Database</li>
                  <li>• Ethereum Smart Contracts</li>
                  <li>• Web3.js</li>
                  <li>• JWT Authentication</li>
                  <li>• ngrok (Development)</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Core Modules</h3>
            <div className="space-y-2">
              <div className="border-l-2 border-primary pl-3">
                <h4 className="text-sm font-medium">Landing Page</h4>
                <p className="text-xs text-muted-foreground">
                  Hero section with animated elements and feature showcase
                </p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <h4 className="text-sm font-medium">Dashboard</h4>
                <p className="text-xs text-muted-foreground">User analytics, recent activities, and quick actions</p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <h4 className="text-sm font-medium">AI Copilot</h4>
                <p className="text-xs text-muted-foreground">Conversational AI for tax queries and financial advice</p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <h4 className="text-sm font-medium">Mind Map</h4>
                <p className="text-xs text-muted-foreground">
                  Visual tax planning with interactive node-based interface
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SystemArchitecture() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            System Architecture
          </CardTitle>
          <CardDescription>High-level system design and component interaction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Architecture Layers</h3>
            <div className="space-y-3">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">1. Presentation Layer (Frontend)</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Next.js application with server and client components
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• Server Components: SEO-optimized pages, data fetching</li>
                  <li>• Client Components: Interactive UI, real-time updates</li>
                  <li>• API Routes: Server-side logic and middleware</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">2. Application Layer (Backend API)</h4>
                <p className="text-xs text-muted-foreground mb-2">RESTful API with Express.js</p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• Authentication: Google OAuth + JWT</li>
                  <li>• Business Logic: Tax calculations, validations</li>
                  <li>• PDF Generation: Certificate creation</li>
                  <li>• Blockchain Integration: Smart contract interaction</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">3. Data Layer</h4>
                <p className="text-xs text-muted-foreground mb-2">Dual storage system</p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• MongoDB: User data, records, metadata</li>
                  <li>• Ethereum Blockchain: Immutable data hashes</li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">4. External Services</h4>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• Google OAuth: User authentication</li>
                  <li>• Ethereum Sepolia: Test blockchain network</li>
                  <li>• ngrok: Development tunneling</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Component Structure</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-xs">
              <pre className="whitespace-pre-wrap">
                {`DhanRakshak/
├── Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── dashboard/            # User dashboard
│   │   ├── copilot/              # AI assistant
│   │   └── mindmap/              # Visual planner
│   ├── components/
│   │   ├── auth/                 # Authentication
│   │   ├── ui/                   # UI components
│   │   └── features/             # Feature components
│   ├── lib/
│   │   └── api.ts                # API client
│   └── hooks/
│       └── use-auth.tsx          # Auth hook
│
└── Backend (Node.js)
    ├── routes/
    │   ├── auth.js               # Authentication
    │   ├── submit.js             # Data submission
    │   └── verify.js             # Verification
    ├── models/
    │   └── Record.js             # MongoDB schema
    ├── blockchain/
    │   └── contract.js           # Smart contract
    └── utils/
        └── pdf.js                # PDF generation`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Data Flow</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-medium min-w-6">1.</span>
                <span className="text-muted-foreground">User authenticates via Google OAuth</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">2.</span>
                <span className="text-muted-foreground">Backend validates token and issues JWT</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">3.</span>
                <span className="text-muted-foreground">User submits tax data through frontend</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">4.</span>
                <span className="text-muted-foreground">Backend validates and hashes data</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">5.</span>
                <span className="text-muted-foreground">Hash stored on Ethereum blockchain</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">6.</span>
                <span className="text-muted-foreground">Record saved to MongoDB with transaction hash</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">7.</span>
                <span className="text-muted-foreground">PDF certificate generated with QR code</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">8.</span>
                <span className="text-muted-foreground">Certificate downloaded to user's device</span>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function APIDocumentation() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            API Documentation
          </CardTitle>
          <CardDescription>Complete API reference and examples</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Base Configuration</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="font-mono text-xs">
                <span className="text-muted-foreground">Base URL:</span>{" "}
                <span className="text-primary">https://overstrong-shortsightedly-jakobe.ngrok-free.dev</span>
              </div>
              <div className="font-mono text-xs">
                <span className="text-muted-foreground">Required Headers:</span>
              </div>
              <div className="bg-background p-2 rounded font-mono text-xs">
                ngrok-skip-browser-warning: true
                <br />
                Authorization: Bearer {"{JWT_TOKEN}"}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Endpoints</h3>

            {/* Health Check */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">GET</span>
                <code className="text-sm">/health</code>
              </div>
              <p className="text-xs text-muted-foreground">Check API health status</p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs font-medium mb-1">Response:</p>
                <pre className="text-xs font-mono overflow-x-auto">
                  {`{
  "status": "healthy",
  "timestamp": "2025-01-10T12:00:00Z"
}`}
                </pre>
              </div>
            </div>

            {/* Google Login */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-xs font-medium">POST</span>
                <code className="text-sm">/auth/google</code>
              </div>
              <p className="text-xs text-muted-foreground">Authenticate with Google OAuth</p>
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div>
                  <p className="text-xs font-medium mb-1">Request Body:</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {`{
  "id_token": "google_id_token_here"
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Response:</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {`{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "profile_url"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Submit Data */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-xs font-medium">POST</span>
                <code className="text-sm">/submit</code>
              </div>
              <p className="text-xs text-muted-foreground">Submit tax data to blockchain</p>
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div>
                  <p className="text-xs font-medium mb-1">Request Body:</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {`{
  "extractedData": {
    "name": "John Doe",
    "income": 500000,
    "tax": 50000
  }
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Response (PDF Download):</p>
                  <p className="text-xs text-muted-foreground">Returns PDF file with headers:</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {`X-Record-Id: mongodb_record_id
X-Transaction-Hash: ethereum_tx_hash`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Verify Data */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-xs font-medium">POST</span>
                <code className="text-sm">/verify</code>
              </div>
              <p className="text-xs text-muted-foreground">Verify data integrity on blockchain</p>
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div>
                  <p className="text-xs font-medium mb-1">Request Body:</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {`{
  "extractedData": {
    "name": "John Doe",
    "income": 500000,
    "tax": 50000
  }
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Response (Match Found):</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {`{
  "match": true,
  "dataHash": "0x...",
  "timestamp": "1704902400",
  "submitter": "0x...",
  "transactionHash": "0x..."
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Response (No Match):</p>
                  <pre className="text-xs font-mono overflow-x-auto">
                    {`{
  "match": false,
  "reason": "Data not found on blockchain",
  "dataHash": "0x..."
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Get Records */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">GET</span>
                <code className="text-sm">/records?page=1&limit=10</code>
              </div>
              <p className="text-xs text-muted-foreground">Get user's records with pagination</p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs font-medium mb-1">Response:</p>
                <pre className="text-xs font-mono overflow-x-auto">
                  {`{
  "records": [
    {
      "_id": "record_id",
      "dataHash": "0x...",
      "txHash": "0x...",
      "createdAt": "2025-01-10T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 5,
    "total": 50,
    "hasMore": true
  }
}`}
                </pre>
              </div>
            </div>

            {/* Get Single Record */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-medium">GET</span>
                <code className="text-sm">/record/:recordId</code>
              </div>
              <p className="text-xs text-muted-foreground">Get specific record details</p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs font-medium mb-1">Response:</p>
                <pre className="text-xs font-mono overflow-x-auto">
                  {`{
  "record": {
    "_id": "record_id",
    "userId": "user_id",
    "dataHash": "0x...",
    "txHash": "0x...",
    "extractedData": {
      "name": "John Doe",
      "income": 500000,
      "tax": 50000
    },
    "createdAt": "2025-01-10T12:00:00Z"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FlowDiagrams() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Flow Diagrams
          </CardTitle>
          <CardDescription>Visual representation of system flows</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">1. User Authentication Flow</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <span>User clicks "Sign in with Google"</span>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <span>Google OAuth popup opens</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <span>User selects Google account</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <span>Google returns ID token to frontend</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      5
                    </div>
                    <span>Frontend sends ID token to backend API</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      6
                    </div>
                    <span>Backend verifies token with Google</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      7
                    </div>
                    <span>Backend creates/updates user in MongoDB</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      8
                    </div>
                    <span>Backend generates JWT token</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      9
                    </div>
                    <span>Frontend stores JWT and user data</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-medium">
                    ✓
                  </div>
                  <span className="text-green-500">User authenticated and redirected to dashboard</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">2. Data Submission Flow</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <span>User enters tax data in form</span>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <span>Frontend validates input data</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <span>POST request to /submit with JWT</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <span>Backend validates JWT and data</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      5
                    </div>
                    <span>Generate SHA-256 hash of data</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      6
                    </div>
                    <span>Submit hash to Ethereum smart contract</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      7
                    </div>
                    <span>Wait for blockchain confirmation</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      8
                    </div>
                    <span>Save record to MongoDB with tx hash</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      9
                    </div>
                    <span>Generate PDF certificate with QR code</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-medium">
                    ✓
                  </div>
                  <span className="text-green-500">PDF downloaded to user's device</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">3. Data Verification Flow</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <span>User enters data to verify</span>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <span>POST request to /verify endpoint</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <span>Backend generates hash of input data</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <span>Query smart contract with hash</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      5
                    </div>
                    <span>Blockchain returns record if exists</span>
                  </div>
                </div>
                <div className="ml-4 border-l-2 border-primary/20 pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      6
                    </div>
                    <span>Backend formats response</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-medium">
                    ✓
                  </div>
                  <span className="text-green-500">Frontend displays verification result</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">4. User Journey Map</h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm">Discovery</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Visit landing page</li>
                    <li>• View features</li>
                    <li>• Read about blockchain</li>
                    <li>• Click "Get Started"</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Onboarding</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Sign in with Google</li>
                    <li>• View dashboard</li>
                    <li>• Explore AI Copilot</li>
                    <li>• Check Mind Map</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm">Usage</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Submit tax data</li>
                    <li>• Download certificate</li>
                    <li>• Verify records</li>
                    <li>• View history</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SetupGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Setup & Configuration Guide
          </CardTitle>
          <CardDescription>Complete setup instructions for development and deployment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Environment Variables</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Frontend (.env.local)</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                  <pre>
                    {`NEXT_PUBLIC_API_BASE_URL=https://overstrong-shortsightedly-jakobe.ngrok-free.dev
NEXT_PUBLIC_GOOGLE_CLIENT_ID=444766138331-k604lsssa4sdjcrg8rbio6agnshdvjff.apps.googleusercontent.com`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Backend (.env)</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                  <pre>
                    {`MONGODB_URI=mongodb://localhost:27017/dhanrakshak
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret_key
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/your_project_id
PRIVATE_KEY=your_ethereum_private_key
CONTRACT_ADDRESS=deployed_contract_address
PORT=3001`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Installation Steps</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">1. Frontend Setup</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                  <div>$ git clone [repository-url]</div>
                  <div>$ cd dhanrakshak-frontend</div>
                  <div>$ npm install</div>
                  <div>$ cp .env.example .env.local</div>
                  <div># Edit .env.local with your values</div>
                  <div>$ npm run dev</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">2. Backend Setup</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                  <div>$ cd dhanrakshak-backend</div>
                  <div>$ npm install</div>
                  <div>$ cp .env.example .env</div>
                  <div># Edit .env with your values</div>
                  <div>$ npm start</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">3. Database Setup</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                  <div># Install MongoDB</div>
                  <div>$ brew install mongodb-community</div>
                  <div># Start MongoDB</div>
                  <div>$ brew services start mongodb-community</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">4. Smart Contract Deployment</h4>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                  <div>$ cd blockchain</div>
                  <div>$ npm install</div>
                  <div>$ npx hardhat compile</div>
                  <div>$ npx hardhat run scripts/deploy.js --network sepolia</div>
                  <div># Copy contract address to backend .env</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Google OAuth Setup</h3>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-medium min-w-6">1.</span>
                <span className="text-muted-foreground">Go to Google Cloud Console</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">2.</span>
                <span className="text-muted-foreground">Create new project or select existing</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">3.</span>
                <span className="text-muted-foreground">Enable Google+ API</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">4.</span>
                <span className="text-muted-foreground">Create OAuth 2.0 credentials</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">5.</span>
                <span className="text-muted-foreground">Add authorized JavaScript origins (http://localhost:3000)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium min-w-6">6.</span>
                <span className="text-muted-foreground">Copy Client ID to environment variables</span>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Deployment</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Frontend (Vercel)</h4>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• Connect GitHub repository to Vercel</li>
                  <li>• Add environment variables in Vercel dashboard</li>
                  <li>• Deploy automatically on push to main branch</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Backend (Railway/Heroku)</h4>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                  <li>• Create new app on hosting platform</li>
                  <li>• Connect GitHub repository</li>
                  <li>• Configure environment variables</li>
                  <li>• Deploy and get production URL</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Security Considerations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Never commit .env files to version control</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Use strong JWT secrets (minimum 32 characters)</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Keep Ethereum private keys secure and never expose</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Use HTTPS in production for all API calls</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Implement rate limiting on API endpoints</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Regularly update dependencies for security patches</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Testing</h3>
            <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
              <div># Run frontend tests</div>
              <div>$ npm test</div>
              <div></div>
              <div># Run backend tests</div>
              <div>$ npm run test:api</div>
              <div></div>
              <div># Test smart contracts</div>
              <div>$ npx hardhat test</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Troubleshooting</h3>
            <div className="space-y-3">
              <div className="border-l-2 border-yellow-500 pl-3">
                <h4 className="text-sm font-medium">Google OAuth Error</h4>
                <p className="text-xs text-muted-foreground">
                  Ensure your domain is added to authorized origins in Google Cloud Console
                </p>
              </div>
              <div className="border-l-2 border-yellow-500 pl-3">
                <h4 className="text-sm font-medium">Blockchain Connection Failed</h4>
                <p className="text-xs text-muted-foreground">
                  Check Ethereum RPC URL and ensure you have test ETH in your wallet
                </p>
              </div>
              <div className="border-l-2 border-yellow-500 pl-3">
                <h4 className="text-sm font-medium">MongoDB Connection Error</h4>
                <p className="text-xs text-muted-foreground">
                  Verify MongoDB is running and connection string is correct
                </p>
              </div>
              <div className="border-l-2 border-yellow-500 pl-3">
                <h4 className="text-sm font-medium">ngrok Issues</h4>
                <p className="text-xs text-muted-foreground">
                  Restart ngrok and update the URL in frontend environment variables
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
