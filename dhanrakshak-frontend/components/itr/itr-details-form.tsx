"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Category = "individual" | "company"

export default function ITRDetailsForm() {
  const [category, setCategory] = useState<Category>("individual")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Build payload
    const base = {
      category: formData.get("category"),
      // Contact
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      // Identity
      pan: formData.get("pan"),
      aadhaar: formData.get("aadhaar"),
      dob: formData.get("dob"),
      // Address
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      // Bank
      bankName: formData.get("bankName"),
      accountNumber: formData.get("accountNumber"),
      ifsc: formData.get("ifsc"),
      // Income
      employmentType: formData.get("employmentType"),
      salaryIncome: Number(formData.get("salaryIncome") || 0),
      businessIncome: Number(formData.get("businessIncome") || 0),
      capitalGains: Number(formData.get("capitalGains") || 0),
      otherIncome: Number(formData.get("otherIncome") || 0),
      // Deductions
      section80C: Number(formData.get("section80C") || 0),
      section80D: Number(formData.get("section80D") || 0),
      section24: Number(formData.get("section24") || 0),
      otherDeductions: Number(formData.get("otherDeductions") || 0),
      // TDS/TCS
      tdsAmount: Number(formData.get("tdsAmount") || 0),
      tcsAmount: Number(formData.get("tcsAmount") || 0),
      // Investments/Notes
      investments: formData.get("investments"),
      notes: formData.get("notes"),
    }

    const company =
      category === "company"
        ? {
            companyName: formData.get("companyName"),
            cin: formData.get("cin"),
            gstin: formData.get("gstin"),
            companyType: formData.get("companyType"),
            turnover: Number(formData.get("turnover") || 0),
            registeredAddress: formData.get("registeredAddress"),
            directors: String(formData.get("directors") || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : {}

    const payload = { ...base, ...company }

    try {
      setSubmitting(true)
      const res = await apiCallUserDetails(payload)
      if (res.success) {
        alert("Your details have been submitted successfully.")
        window.location.href = "/dashboard"
      } else {
        alert("Failed to submit details: " + (res.error || "Unknown error"))
      }
    } catch (err) {
      alert("Error submitting details. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Use the shared apiCall wrapper via a small helper to ensure token header
  async function apiCallUserDetails(details: any) {
    // Use the apiCall from lib/api via a simple proxy using fetch and headers
    // Better: add a method on api itself, but to avoid refactor risks, we inline using existing apiCall indirectly
    // We'll call our own route in case the backend path changes in future.
    return await fetch("/api/user-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    }).then((r) => r.json())
  }

  return (
    <Card className="border-border/40 bg-background/50 backdrop-blur">
      <CardHeader>
        <CardTitle>ITR Details</CardTitle>
        <CardDescription>Enter your details to get started with AI-powered filing</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v: Category) => setCategory(v)} name="category">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pan">PAN</Label>
              <Input id="pan" name="pan" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="aadhaar">Aadhaar</Label>
              <Input id="aadhaar" name="aadhaar" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input id="addressLine1" name="addressLine1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input id="addressLine2" name="addressLine2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pincode">PIN Code</Label>
              <Input id="pincode" name="pincode" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" name="bankName" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" name="accountNumber" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ifsc">IFSC</Label>
              <Input id="ifsc" name="ifsc" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select name="employmentType">
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="business">Business/Profession</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salaryIncome">Salary Income</Label>
                <Input id="salaryIncome" name="salaryIncome" type="number" min="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="businessIncome">Business/Professional Income</Label>
                <Input id="businessIncome" name="businessIncome" type="number" min="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capitalGains">Capital Gains</Label>
                <Input id="capitalGains" name="capitalGains" type="number" min="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="otherIncome">Other Income</Label>
                <Input id="otherIncome" name="otherIncome" type="number" min="0" />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="section80C">Section 80C</Label>
                <Input id="section80C" name="section80C" type="number" min="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="section80D">Section 80D</Label>
                <Input id="section80D" name="section80D" type="number" min="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="section24">Section 24 (Home Loan Interest)</Label>
                <Input id="section24" name="section24" type="number" min="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="otherDeductions">Other Deductions</Label>
                <Input id="otherDeductions" name="otherDeductions" type="number" min="0" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tdsAmount">TDS</Label>
                <Input id="tdsAmount" name="tdsAmount" type="number" min="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tcsAmount">TCS</Label>
                <Input id="tcsAmount" name="tcsAmount" type="number" min="0" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="investments">Investments (optional)</Label>
              <Textarea id="investments" name="investments" placeholder="e.g., ELSS, PPF, NPS, etc." />
            </div>

            {category === "company" && (
              <div className="grid gap-4 border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" name="companyName" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="companyType">Company Type</Label>
                    <Select name="companyType">
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private-limited">Private Limited</SelectItem>
                        <SelectItem value="public-limited">Public Limited</SelectItem>
                        <SelectItem value="llp">LLP</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="proprietorship">Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cin">CIN</Label>
                    <Input id="cin" name="cin" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input id="gstin" name="gstin" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="turnover">Turnover (FY)</Label>
                    <Input id="turnover" name="turnover" type="number" min="0" />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="registeredAddress">Registered Address</Label>
                    <Input id="registeredAddress" name="registeredAddress" />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="directors">Directors (comma separated)</Label>
                    <Input id="directors" name="directors" placeholder="Name1, Name2, ..." />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit details"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
