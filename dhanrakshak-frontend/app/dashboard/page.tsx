"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Upload,
  Eye,
  Brain,
  Shield,
  Download,
  RefreshCw,
  Plus,
  BarChart3,
  Calendar,
  LogIn,
} from "lucide-react"
import Link from "next/link"

interface FilingStatus {
  step: string
  status: "completed" | "in-progress" | "pending"
  description: string
  date?: string
}

interface TaxSummary {
  totalIncome: number
  totalDeductions: number
  taxableIncome: number
  taxLiability: number
  tdsDeducted: number
  refundDue: number
}

const filingSteps: FilingStatus[] = [
  {
    step: "Document Upload",
    status: "completed",
    description: "Form-16 and supporting documents uploaded",
    date: "2025-01-15",
  },
  {
    step: "Income Details",
    status: "completed",
    description: "Salary and other income sources added",
    date: "2025-01-15",
  },
  {
    step: "Deductions",
    status: "in-progress",
    description: "80C, 80D deductions being reviewed",
  },
  {
    step: "Tax Calculation",
    status: "pending",
    description: "Final tax computation pending",
  },
  {
    step: "Review & Submit",
    status: "pending",
    description: "Final review before submission",
  },
  {
    step: "e-Verification",
    status: "pending",
    description: "Complete filing with OTP verification",
  },
]

const taxSummary: TaxSummary = {
  totalIncome: 1250000,
  totalDeductions: 150000,
  taxableIncome: 1100000,
  taxLiability: 78000,
  tdsDeducted: 85000,
  refundDue: 7000,
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "in-progress":
      return <Clock className="h-4 w-4 text-yellow-500" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500 bg-green-500/10 border-green-500/20"
    case "in-progress":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    default:
      return "text-muted-foreground bg-muted/50 border-border"
  }
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/"
    }
  }, [user, isLoading])

  const completedSteps = filingSteps.filter((step) => step.status === "completed").length
  const progressPercentage = (completedSteps / filingSteps.length) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center">
            <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to access your tax filing dashboard.</p>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Tax Filing Dashboard</h1>
                <Badge variant="secondary" className="text-xs">
                  AY 2025-26
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={user.picture || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                <span className="text-sm font-medium text-foreground hidden sm:inline">{user.name}</span>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Data
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user.name.split(" ")[0]}!</h2>
            <p className="text-muted-foreground">
              Your ITR-1 filing for Assessment Year 2025-26 is {progressPercentage.toFixed(0)}% complete.
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="p-6 mb-8 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Filing Progress</h3>
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
                {completedSteps} of {filingSteps.length} steps completed
              </Badge>
            </div>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filingSteps.map((step, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getStatusColor(step.status)}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(step.status)}
                    <span className="text-sm font-medium">{step.step}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {step.date && <p className="text-xs text-muted-foreground mt-1">{step.date}</p>}
                </div>
              ))}
            </div>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="calculations">Calculations</TabsTrigger>
              <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tax Summary */}
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    Tax Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Income</span>
                      <span className="font-semibold text-foreground">{formatCurrency(taxSummary.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Deductions</span>
                      <span className="font-semibold text-green-600">
                        -{formatCurrency(taxSummary.totalDeductions)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <span className="text-muted-foreground">Taxable Income</span>
                      <span className="font-semibold text-foreground">{formatCurrency(taxSummary.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tax Liability</span>
                      <span className="font-semibold text-red-600">{formatCurrency(taxSummary.taxLiability)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">TDS Deducted</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(taxSummary.tdsDeducted)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <span className="font-medium text-foreground">Refund Due</span>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(taxSummary.refundDue)}</span>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-green-500/10 rounded">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Form-16 uploaded successfully</p>
                        <p className="text-xs text-muted-foreground">Today, 2:30 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-blue-500/10 rounded">
                        <Calculator className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Income details auto-filled</p>
                        <p className="text-xs text-muted-foreground">Today, 2:25 PM</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-yellow-500/10 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Review 80C deductions</p>
                        <p className="text-xs text-muted-foreground">Pending action</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="p-1 bg-primary/10 rounded">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">AI suggested tax optimizations</p>
                        <p className="text-xs text-muted-foreground">Yesterday, 4:15 PM</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Documents</p>
                      <p className="text-lg font-bold text-primary">5/6</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-500/10 rounded">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Savings</p>
                      <p className="text-lg font-bold text-green-500">₹1.5L</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500/10 rounded">
                      <Calendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Due Date</p>
                      <p className="text-lg font-bold text-blue-500">Jul 31</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-yellow-500/10 rounded">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Pending</p>
                      <p className="text-lg font-bold text-yellow-500">4 items</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Uploaded Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Form-16</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Uploaded: Jan 15, 2025</p>
                    <p className="text-xs text-muted-foreground">Size: 2.3 MB</p>
                  </div>
                  <div className="p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Bank Statement</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">Uploaded: Jan 15, 2025</p>
                    <p className="text-xs text-muted-foreground">Size: 1.8 MB</p>
                  </div>
                  <div className="p-4 border border-border bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-muted-foreground">Investment Proofs</span>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Pending upload</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Calculations Tab */}
            <TabsContent value="calculations" className="space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Tax Calculations</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Income Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Salary Income</span>
                          <span className="text-sm font-medium">₹12,00,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Interest Income</span>
                          <span className="text-sm font-medium">₹50,000</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2">
                          <span className="text-sm font-medium">Total Income</span>
                          <span className="text-sm font-bold">₹12,50,000</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Deductions</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">80C (PPF, ELSS)</span>
                          <span className="text-sm font-medium">₹1,50,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Standard Deduction</span>
                          <span className="text-sm font-medium">₹50,000</span>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2">
                          <span className="text-sm font-medium">Total Deductions</span>
                          <span className="text-sm font-bold">₹2,00,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Quick Actions Tab */}
            <TabsContent value="actions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">Ask AI Copilot</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Get instant answers to your tax questions</p>
                  <Link href="/copilot">
                    <Button size="sm" className="w-full">
                      Open Chat
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-accent/10 rounded">
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">View Mind Map</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Interactive guide for ITR filing process</p>
                  <Link href="/mindmap">
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      Explore
                    </Button>
                  </Link>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-chart-2/10 rounded">
                      <Upload className="h-5 w-5 text-chart-2" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">Upload Documents</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Add missing investment proofs</p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Files
                  </Button>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-chart-3/10 rounded">
                      <Eye className="h-5 w-5 text-chart-3" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">Review Form 26AS</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Verify TDS and tax credits</p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-chart-4/10 rounded">
                      <Calculator className="h-5 w-5 text-chart-4" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">Tax Calculator</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Compare old vs new tax regime</p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Calculate
                  </Button>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-chart-5/10 rounded">
                      <Shield className="h-5 w-5 text-chart-5" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">Security Center</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Manage data privacy settings</p>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Settings
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
