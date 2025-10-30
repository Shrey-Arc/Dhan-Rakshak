"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import BlurText from "@/components/ui/blur-text"
import Hyperspeed from "@/components/ui/hyperspeed"
import GoogleAuth, { GoogleAuthModal } from "@/components/auth/google-auth"
import { ArrowRight, Shield, Brain, FileText, TrendingUp, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">DhanRakshak</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </Link>
              <Link href="#security" className="text-muted-foreground hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/copilot" className="text-muted-foreground hover:text-foreground transition-colors">
                AI Copilot
              </Link>
              <Link href="/mindmap" className="text-muted-foreground hover:text-foreground transition-colors">
                Mind Map
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <GoogleAuth />
              <Button size="sm" onClick={() => setShowAuthModal(true)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <GoogleAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Hero Section with Hyperspeed Background */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 z-0">
          <Hyperspeed />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              AI for Tax Filing
            </Badge>
            <BlurText
              text="AI-powered ITR filing made simple & secure"
              className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl text-balance"
              delay={100}
              animateBy="words"
              direction="top"
            />
            <BlurText
              text="Transform your tax filing experience with intelligent guidance, interactive mind maps, and automated document processing. File your ITR with confidence using our AI copilot."
              className="mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto"
              delay={50}
              animateBy="words"
              direction="top"
            />
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="text-base" onClick={() => setShowAuthModal(true)}>
                Start Filing Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-base bg-transparent">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BlurText
              text="Everything you need for ITR filing"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              delay={80}
              animateBy="words"
            />
            <BlurText
              text="Comprehensive tools and AI assistance to make tax filing effortless"
              className="mt-4 text-lg text-muted-foreground text-pretty"
              delay={60}
              animateBy="words"
            />
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">AI Copilot</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Get instant answers to tax questions with our intelligent assistant trained on ITR regulations and best
                practices.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Interactive Mind Maps</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Navigate the ITR process with visual mind maps that break down complex tax concepts into simple steps.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Smart Autofill</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Upload Form-16 and financial documents to automatically populate your ITR forms with AI-powered
                extraction.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-chart-3/10 rounded-lg">
                  <Shield className="h-6 w-6 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Bank-Grade Security</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your sensitive financial data is protected with AES-256 encryption and secure authentication protocols.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-chart-4/10 rounded-lg">
                  <Users className="h-6 w-6 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Tax Optimization</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Receive personalized recommendations for deductions and tax-saving strategies based on your profile.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur border-border/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-chart-5/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-chart-5" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Learning Hub</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Access comprehensive tutorials, videos, and guides to understand tax filing concepts and regulations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BlurText
              text="File your ITR in 4 simple steps"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              delay={80}
              animateBy="words"
            />
            <BlurText
              text="Our AI-guided process makes tax filing straightforward and error-free"
              className="mt-4 text-lg text-muted-foreground text-pretty"
              delay={60}
              animateBy="words"
            />
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Upload Documents</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply upload your Form-16, bank statements, and other financial documents. Our AI will extract all
                  relevant information.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">AI Review & Guidance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI copilot reviews your information, suggests optimizations, and guides you through any missing
                  details.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Verification</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use our mind map interface to verify all information and understand each section of your ITR filing.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Secure Submission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Submit your ITR directly to the government portal with our secure, encrypted connection and track your
                  refund status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BlurText
              text="Ready to simplify your tax filing?"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
              delay={80}
              animateBy="words"
            />
            <BlurText
              text="Join thousands of users who trust DhanRakshak for their ITR filing needs"
              className="mt-4 text-lg text-muted-foreground text-pretty"
              delay={60}
              animateBy="words"
            />
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button size="lg" className="text-base" onClick={() => setShowAuthModal(true)}>
                Start Your ITR Filing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-base bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">DhanRakshak</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 DhanRakshak. Secure AI-powered tax filing.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
