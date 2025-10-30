"use client"

import React from "react"

import type { ReactNode } from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle,
  Briefcase,
  Home,
  BarChart3,
  Wheat,
  FileText,
  Shield,
  Calculator,
  Eye,
  Send,
  ChevronRight,
  ChevronDown,
  Building2,
  FileSpreadsheet,
} from "lucide-react"
import Link from "next/link"

interface MindMapNode {
  id: string
  title: string
  description: string
  icon: ReactNode
  status: "complete" | "pending" | "attention"
  children?: MindMapNode[]
  details?: string
}

const individualMindMapData: MindMapNode = {
  id: "root",
  title: "ITR-1 Filing (Sahaj)",
  description: "Complete guide for AY 2025-26",
  icon: <FileText className="h-6 w-6" />,
  status: "pending",
  children: [
    {
      id: "eligibility",
      title: "Eligibility",
      description: "Check if you qualify for ITR-1",
      icon: <CheckCircle className="h-5 w-5" />,
      status: "complete",
      details:
        "ITR-1 is for Resident Individuals with income ≤ ₹50 lakh from salary/pension, one house property, other sources, agricultural income ≤ ₹5,000, and capital gains under 112A ≤ ₹1.25 lakh.",
      children: [
        {
          id: "resident",
          title: "Resident Individual",
          description: "Must be resident (not NOR)",
          icon: <Shield className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "income-limit",
          title: "Income ≤ ₹50 lakh",
          description: "Total income limit",
          icon: <Calculator className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "salary",
          title: "Salary/Pension",
          description: "Employment income",
          icon: <Briefcase className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "house-property",
          title: "One House Property",
          description: "Single property income",
          icon: <Home className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "other-sources",
          title: "Other Sources",
          description: "Interest, family pension",
          icon: <BarChart3 className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "agricultural",
          title: "Agricultural Income ≤ ₹5,000",
          description: "Limited agricultural income",
          icon: <Wheat className="h-4 w-4" />,
          status: "complete",
        },
      ],
    },
    {
      id: "pre-filing",
      title: "Pre-Filing Requirements",
      description: "Setup before filing",
      icon: <Clock className="h-5 w-5" />,
      status: "attention",
      details:
        "Ensure you have an e-Filing portal account, PAN linked with Aadhaar, pre-validated bank account, Form 26AS/AIS, and linked mobile number.",
      children: [
        {
          id: "portal-account",
          title: "e-Filing Portal Account",
          description: "Valid user ID and password",
          icon: <Shield className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "pan-aadhaar",
          title: "PAN linked with Aadhaar",
          description: "Mandatory linking",
          icon: <FileText className="h-4 w-4" />,
          status: "attention",
        },
        {
          id: "bank-account",
          title: "Bank account pre-validated",
          description: "For refund purposes",
          icon: <Calculator className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "form-26as",
          title: "Form 26AS and AIS",
          description: "Tax credit verification",
          icon: <Eye className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "mobile-linked",
          title: "Mobile number linked",
          description: "For e-Verification",
          icon: <Send className="h-4 w-4" />,
          status: "complete",
        },
      ],
    },
    {
      id: "filing-process",
      title: "Filing Process",
      description: "Step-by-step filing",
      icon: <FileText className="h-5 w-5" />,
      status: "pending",
      details:
        "Complete 8-step process from login to e-verification including regime selection, form filling, and submission.",
      children: [
        {
          id: "login",
          title: "Login to e-Filing Portal",
          description: "Access your account",
          icon: <Shield className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "select-form",
          title: "Select ITR-1 → AY 2025-26",
          description: "Choose correct form",
          icon: <FileText className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "tax-regime",
          title: "Choose Tax Regime",
          description: "Old vs New regime",
          icon: <Calculator className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "personal-details",
          title: "Fill Personal Details",
          description: "Basic information",
          icon: <Shield className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "income-details",
          title: "Fill Income Details",
          description: "All income sources",
          icon: <BarChart3 className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "deductions",
          title: "Claim Deductions",
          description: "80C, 80D, etc.",
          icon: <Calculator className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "review-submit",
          title: "Review & Submit",
          description: "Final validation",
          icon: <Eye className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "e-verify",
          title: "e-Verify",
          description: "Complete filing",
          icon: <CheckCircle className="h-4 w-4" />,
          status: "pending",
        },
      ],
    },
    {
      id: "income-sources",
      title: "Income Sources",
      description: "Types of income",
      icon: <BarChart3 className="h-5 w-5" />,
      status: "complete",
      details: "Four main categories of income eligible for ITR-1 filing with specific limits and conditions.",
      children: [
        {
          id: "salary-income",
          title: "Salary Income",
          description: "Employment earnings",
          icon: <Briefcase className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "house-property-income",
          title: "House Property",
          description: "Rental income",
          icon: <Home className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "other-sources-income",
          title: "Other Sources",
          description: "Interest, dividends",
          icon: <BarChart3 className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "agricultural-income",
          title: "Agricultural Income",
          description: "Up to ₹5,000",
          icon: <Wheat className="h-4 w-4" />,
          status: "complete",
        },
      ],
    },
    {
      id: "deductions-exemptions",
      title: "Deductions & Exemptions",
      description: "Tax saving options",
      icon: <Calculator className="h-5 w-5" />,
      status: "attention",
      details:
        "Major deductions available under various sections including 80C, 80D, 80G, and exemptions like HRA, LTA.",
      children: [
        {
          id: "80c",
          title: "80C: PPF, LIC, NSC",
          description: "Up to ₹1.5 lakh",
          icon: <Calculator className="h-4 w-4" />,
          status: "attention",
        },
        {
          id: "80d",
          title: "80D: Health Insurance",
          description: "Medical premiums",
          icon: <Shield className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "80g",
          title: "80G: Donations",
          description: "Charitable contributions",
          icon: <CheckCircle className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "hra-lta",
          title: "HRA, LTA, etc.",
          description: "Employment exemptions",
          icon: <Briefcase className="h-4 w-4" />,
          status: "complete",
        },
      ],
    },
    {
      id: "form-26as-ais",
      title: "Form 26AS / AIS",
      description: "Tax credit verification",
      icon: <Eye className="h-5 w-5" />,
      status: "pending",
      details: "Essential documents for verifying TDS, advance tax, and reconciling discrepancies before filing.",
      children: [
        {
          id: "view-credits",
          title: "View Tax Credits",
          description: "Check TDS details",
          icon: <Eye className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "verify-tds",
          title: "Verify TDS / Advance Tax",
          description: "Match with records",
          icon: <CheckCircle className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "reconcile",
          title: "Reconcile Discrepancies",
          description: "Fix mismatches",
          icon: <AlertTriangle className="h-4 w-4" />,
          status: "attention",
        },
      ],
    },
    {
      id: "common-errors",
      title: "Common Errors",
      description: "Troubleshooting guide",
      icon: <AlertTriangle className="h-5 w-5" />,
      status: "attention",
      details:
        "Most frequent issues during ITR filing and their solutions including PAN/Aadhaar mismatch and TDS issues.",
      children: [
        {
          id: "pan-aadhaar-mismatch",
          title: "PAN / Aadhaar mismatch",
          description: "Linking issues",
          icon: <AlertTriangle className="h-4 w-4" />,
          status: "attention",
        },
        {
          id: "bank-details",
          title: "Incorrect Bank Details",
          description: "Account verification",
          icon: <Calculator className="h-4 w-4" />,
          status: "attention",
        },
        {
          id: "unclaimed-tds",
          title: "Unclaimed TDS",
          description: "Missing tax credits",
          icon: <Eye className="h-4 w-4" />,
          status: "attention",
        },
        {
          id: "invalid-deductions",
          title: "Invalid deductions",
          description: "Documentation issues",
          icon: <FileText className="h-4 w-4" />,
          status: "attention",
        },
      ],
    },
    {
      id: "post-filing",
      title: "Post-Filing Actions",
      description: "After submission",
      icon: <Send className="h-5 w-5" />,
      status: "pending",
      details:
        "Important steps to complete after filing including e-verification, record keeping, and status tracking.",
      children: [
        {
          id: "e-verify-return",
          title: "E-Verify return",
          description: "Complete the process",
          icon: <CheckCircle className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "save-documents",
          title: "Save ITR-V / Acknowledgment",
          description: "Keep records",
          icon: <FileText className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "track-refund",
          title: "Track Refund Status",
          description: "Monitor progress",
          icon: <Eye className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "respond-notices",
          title: "Respond to Notices",
          description: "Handle communications",
          icon: <Send className="h-4 w-4" />,
          status: "pending",
        },
      ],
    },
  ],
}

const companyMindMapData: MindMapNode = {
  id: "root-company",
  title: "Company ITR Filing",
  description: "Private/Public Companies - AY 2025-26",
  icon: <Building2 className="h-6 w-6" />,
  status: "attention",
  children: [
    {
      id: "company-eligibility",
      title: "Eligibility & Prerequisites",
      description: "PAN, TAN, DSC, e-Filing registration",
      icon: <Shield className="h-5 w-5" />,
      status: "complete",
      children: [
        {
          id: "company-pan-tan",
          title: "PAN & TAN",
          description: "Mandatory identifiers",
          icon: <FileText className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "company-dsc",
          title: "DSC",
          description: "Digital Signature Certificate",
          icon: <Shield className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "company-efiling",
          title: "e-Filing Portal",
          description: "Registered entity account",
          icon: <FileText className="h-4 w-4" />,
          status: "complete",
        },
      ],
    },
    {
      id: "company-pre-filing",
      title: "Pre-Filing Requirements",
      description: "Financials, Tax Audit, TDS, AIS/26AS",
      icon: <Clock className="h-5 w-5" />,
      status: "attention",
      details:
        "Prepare audited financial statements, ensure TDS returns are filed, and reconcile AIS/26AS. Confirm applicability of audit (Sec 44AB) and MAT.",
      children: [
        {
          id: "company-audit",
          title: "Audit u/s 44AB",
          description: "If applicable",
          icon: <FileSpreadsheet className="h-4 w-4" />,
          status: "attention",
        },
        {
          id: "company-statements",
          title: "Financial Statements",
          description: "BS, P&L, Notes",
          icon: <BarChart3 className="h-4 w-4" />,
          status: "complete",
        },
        {
          id: "company-tds",
          title: "TDS Reconciliation",
          description: "Match with 26AS",
          icon: <Eye className="h-4 w-4" />,
          status: "pending",
        },
      ],
    },
    {
      id: "company-filing-process",
      title: "Filing Process",
      description: "Form ITR-6 (generally), MAT, schedules",
      icon: <FileText className="h-5 w-5" />,
      status: "pending",
      details:
        "Company to select correct ITR form (usually ITR-6), fill schedules (BP, P&L, BS), compute MAT (if applicable), validate and file with DSC.",
      children: [
        {
          id: "company-login",
          title: "Login to e-Filing Portal",
          description: "Company admin login",
          icon: <Shield className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "company-select-form",
          title: "Select ITR-6 → AY 2025-26",
          description: "Choose correct form",
          icon: <FileText className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "company-schedules",
          title: "Fill Schedules",
          description: "BP, P&L, BS, Depreciation",
          icon: <Calculator className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "company-mat",
          title: "Compute MAT (if applicable)",
          description: "Book profit basis",
          icon: <Calculator className="h-4 w-4" />,
          status: "attention",
        },
        {
          id: "company-validate-submit",
          title: "Validate & File with DSC",
          description: "Upload & sign",
          icon: <CheckCircle className="h-4 w-4" />,
          status: "pending",
        },
      ],
    },
    {
      id: "company-post-filing",
      title: "Post-Filing Actions",
      description: "Acknowledgment, records, notices",
      icon: <Send className="h-5 w-5" />,
      status: "pending",
      children: [
        {
          id: "company-ack",
          title: "Download Acknowledgment",
          description: "Store safely",
          icon: <FileText className="h-4 w-4" />,
          status: "pending",
        },
        {
          id: "company-respond",
          title: "Respond to Notices",
          description: "If any",
          icon: <AlertTriangle className="h-4 w-4" />,
          status: "attention",
        },
      ],
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "complete":
      return "text-green-500 bg-green-500/10 border-green-500/20"
    case "attention":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    default:
      return "text-blue-500 bg-blue-500/10 border-blue-500/20"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "complete":
      return <CheckCircle className="h-4 w-4" />
    case "attention":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

interface NodeComponentProps {
  node: MindMapNode
  level: number
  onNodeClick: (node: MindMapNode) => void
  registerNode: (id: string, el: HTMLDivElement | null) => void
  onLayoutChange: () => void
}

const NodeComponent: React.FC<NodeComponentProps> = ({ node, level, onNodeClick, registerNode, onLayoutChange }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    registerNode(node.id, ref.current)
    return () => registerNode(node.id, null)
  }, [node.id, registerNode])

  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
    onNodeClick(node)
    onLayoutChange()
  }

  return (
    <div className={`${level > 0 ? "ml-6" : ""}`}>
      <Card
        ref={ref}
        className={`p-4 mb-3 cursor-pointer transition-all hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_8px_30px_rgba(0,0,0,0.12)] border ${getStatusColor(
          node.status,
        )} bg-white/10 dark:bg-black/20 backdrop-blur-xl`}
        onClick={handleToggle}
        data-node-id={node.id}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(node.status)}`}>{node.icon}</div>
            <div>
              <h3 className={`font-semibold ${level === 0 ? "text-lg" : "text-sm"} text-card-foreground`}>
                {node.title}
              </h3>
              <p className="text-xs text-muted-foreground">{node.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${getStatusColor(node.status)}`}>
              {getStatusIcon(node.status)}
              <span className="ml-1 capitalize">{node.status}</span>
            </Badge>
            {node.children && (
              <div className="text-muted-foreground">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </div>
            )}
          </div>
        </div>
      </Card>

      {isExpanded && node.children && (
        <div className="space-y-2">
          {node.children.map((child) => (
            <NodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              registerNode={registerNode}
              onLayoutChange={onLayoutChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function collectEdges(root: MindMapNode): Array<{ from: string; to: string }> {
  const edges: Array<{ from: string; to: string }> = []
  const dfs = (node: MindMapNode) => {
    if (node.children) {
      node.children.forEach((child) => {
        edges.push({ from: node.id, to: child.id })
        dfs(child)
      })
    }
  }
  dfs(root)
  return edges
}

export default function MindMapPage() {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null)
  const [activeFlow, setActiveFlow] = useState<"individual" | "company">("individual")

  const treeRoot = React.useMemo(
    () => (activeFlow === "individual" ? individualMindMapData : companyMindMapData),
    [activeFlow],
  )
  const edges = React.useMemo(() => collectEdges(treeRoot), [treeRoot])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLDivElement | null>())
  const [paths, setPaths] = useState<Array<{ d: string }>>([])
  const [layoutVersion, setLayoutVersion] = useState(0)
  const lastPathsSigRef = useRef<string>("")
  const resizeRafRef = useRef<number | null>(null)

  const registerNode = useCallback((id: string, el: HTMLDivElement | null) => {
    nodeRefs.current.set(id, el || null)
  }, [])

  const onLayoutChange = useCallback(() => {
    setLayoutVersion((v) => v + 1)
  }, [])

  const handleNodeClick = (node: MindMapNode) => {
    setSelectedNode(node)
  }

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const containerRect = el.getBoundingClientRect()
    const newPaths: Array<{ d: string }> = []

    edges.forEach(({ from, to }) => {
      const fromEl = nodeRefs.current.get(from)
      const toEl = nodeRefs.current.get(to)
      if (!fromEl || !toEl) return

      const fr = fromEl.getBoundingClientRect()
      const tr = toEl.getBoundingClientRect()

      const x1 = fr.left - containerRect.left + fr.width - 8
      const y1 = fr.top - containerRect.top + fr.height / 2
      const x2 = tr.left - containerRect.left + 8
      const y2 = tr.top - containerRect.top + tr.height / 2

      const dx = Math.max(40, Math.abs(x2 - x1) * 0.4)
      const d = `M ${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
      newPaths.push({ d })
    })

    const sig = newPaths.map((p) => p.d).join("|")
    if (sig !== lastPathsSigRef.current) {
      lastPathsSigRef.current = sig
      setPaths(newPaths)
    }
  }, [edges, layoutVersion])

  useEffect(() => {
    const onResize = () => {
      if (resizeRafRef.current != null) return
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null
        setLayoutVersion((v) => v + 1)
      })
    }
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      if (resizeRafRef.current != null) {
        cancelAnimationFrame(resizeRafRef.current)
        resizeRafRef.current = null
      }
    }
  }, [])

  const getProgressStats = () => {
    const countNodes = (node: MindMapNode): { complete: number; attention: number; pending: number; total: number } => {
      const stats = { complete: 0, attention: 0, pending: 0, total: 1 }

      switch (node.status) {
        case "complete":
          stats.complete = 1
          break
        case "attention":
          stats.attention = 1
          break
        default:
          stats.pending = 1
      }

      if (node.children) {
        node.children.forEach((child) => {
          const childStats = countNodes(child)
          stats.complete += childStats.complete
          stats.attention += childStats.attention
          stats.pending += childStats.pending
          stats.total += childStats.total
        })
      }

      return stats
    }

    return countNodes(treeRoot)
  }

  const stats = getProgressStats()

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(14,165,233,0.20), rgba(0,0,0,0) 60%), radial-gradient(1000px 500px at 90% 20%, rgba(59,130,246,0.20), rgba(0,0,0,0) 60%), linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(2,6,23,1) 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white/90 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-cyan-300" />
                <h1 className="text-xl font-semibold text-white mb-2 text-balance">ITR Mind Map</h1>
                <Badge variant="secondary" className="text-[10px] bg-white/10 text-white border-white/20">
                  AY 2025-26
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-white/70">{stats.complete} Complete</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-300" />
                  <span className="text-white/70">{stats.attention} Attention</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-sky-400" />
                  <span className="text-white/70">{stats.pending} Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 text-balance">ITR Filing Process</h2>
                <p className="text-white/70">
                  Interactive guide for Assessment Year 2025-26. Click on nodes to explore details. Switch flows to view
                  Individuals or Companies.
                </p>
              </div>

              <Tabs
                defaultValue="individual"
                value={activeFlow}
                onValueChange={(v) => {
                  setActiveFlow(v as "individual" | "company")
                  setSelectedNode(null)
                  setLayoutVersion((lv) => lv + 1)
                }}
                className="w-full"
              >
                <TabsList className="bg-white/10 border border-white/10 backdrop-blur-xl">
                  <TabsTrigger value="individual" className="data-[state=active]:bg-white/20 text-white">
                    Individuals
                  </TabsTrigger>
                  <TabsTrigger value="company" className="data-[state=active]:bg-white/20 text-white">
                    Companies
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="individual" className="mt-4">
                  <div ref={containerRef} className="relative">
                    <svg className="absolute inset-0 pointer-events-none" aria-hidden="true">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="url(#lineGradient)" />
                        </marker>
                      </defs>
                      {paths.map((p, idx) => (
                        <path
                          key={idx}
                          d={p.d}
                          stroke="url(#lineGradient)"
                          strokeWidth="2"
                          fill="none"
                          markerEnd="url(#arrowHead)"
                          style={{ filter: "drop-shadow(0 0 6px rgba(56,189,248,0.5))" }}
                        />
                      ))}
                    </svg>

                    <ScrollArea className="h-[600px]">
                      <div className="relative pt-2">
                        <NodeComponent
                          node={individualMindMapData}
                          level={0}
                          onNodeClick={handleNodeClick}
                          registerNode={registerNode}
                          onLayoutChange={onLayoutChange}
                        />
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="company" className="mt-4">
                  <div ref={containerRef} className="relative">
                    <svg className="absolute inset-0 pointer-events-none" aria-hidden="true">
                      <defs>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <marker id="arrowHead2" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="url(#lineGradient2)" />
                        </marker>
                      </defs>
                      {paths.map((p, idx) => (
                        <path
                          key={idx}
                          d={p.d}
                          stroke="url(#lineGradient2)"
                          strokeWidth="2"
                          fill="none"
                          markerEnd="url(#arrowHead2)"
                          style={{ filter: "drop-shadow(0 0 6px rgba(56,189,248,0.5))" }}
                        />
                      ))}
                    </svg>

                    <ScrollArea className="h-[600px]">
                      <div className="relative pt-2">
                        <NodeComponent
                          node={companyMindMapData}
                          level={0}
                          onNodeClick={handleNodeClick}
                          registerNode={registerNode}
                          onLayoutChange={onLayoutChange}
                        />
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/10 sticky top-8">
              {selectedNode ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${getStatusColor(selectedNode.status)}`}>{selectedNode.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{selectedNode.title}</h3>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(selectedNode.status)}`}>
                        {getStatusIcon(selectedNode.status)}
                        <span className="ml-1 capitalize">{selectedNode.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mb-4">{selectedNode.description}</p>
                  {selectedNode.details && (
                    <div className="p-4 bg-white/10 rounded-lg border border-white/10">
                      <h4 className="font-medium text-white mb-2">Details</h4>
                      <p className="text-sm text-white/80 leading-relaxed">{selectedNode.details}</p>
                    </div>
                  )}
                  {selectedNode.children && (
                    <div className="mt-4">
                      <h4 className="font-medium text-white mb-2">Sub-items ({selectedNode.children.length})</h4>
                      <div className="space-y-2">
                        {selectedNode.children.map((child) => (
                          <div
                            key={child.id}
                            className={`p-2 rounded border cursor-pointer transition-colors hover:bg-white/10 border-white/10 ${getStatusColor(
                              child.status,
                            )}`}
                            onClick={() => setSelectedNode(child)}
                          >
                            <div className="flex items-center gap-2">
                              {child.icon}
                              <span className="text-sm font-medium text-white">{child.title}</span>
                              {getStatusIcon(child.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-white/60 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Select a Node</h3>
                  <p className="text-sm text-white/70">Click on any node to view detailed information and sub-items.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
