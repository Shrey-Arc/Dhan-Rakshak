"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"

declare global {
  interface Window {
    google: any
  }
}

interface User {
  id: string
  name: string
  email: string
  picture: string
}

export default function GoogleAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Read from public env; empty string if undefined
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

  useEffect(() => {
    console.log("[v0] Initializing Google Auth with Client ID:", GOOGLE_CLIENT_ID || "(missing)")

    const savedUser = api.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
    }

    // If not configured, don't attempt to load SDK
    if (!GOOGLE_CLIENT_ID) {
      console.error("[v0] Google Client ID missing. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.")
      setIsLoading(false)
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = initializeGoogleAuth
    document.head.appendChild(script)

    setIsLoading(false)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initializeGoogleAuth = () => {
    if (!GOOGLE_CLIENT_ID) return
    if (window.google) {
      console.log("[v0] Google SDK loaded, initializing with client ID")
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      console.log("[v0] Google Auth initialized successfully")
    } else {
      console.error("[v0] Google SDK not loaded")
    }
  }

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log("[v0] Received credential response from Google")
      console.log("[v0] Credential token length:", response.credential?.length)

      const apiResponse = await api.loginWithGoogle(response.credential)
      console.log("[v0] Backend API response:", apiResponse)

      if (apiResponse.success && apiResponse.token && apiResponse.user) {
        const userData: User = {
          id: apiResponse.user.id || apiResponse.user.sub,
          name: apiResponse.user.name,
          email: apiResponse.user.email,
          picture: apiResponse.user.picture,
        }

        setUser(userData)
        console.log("[v0] Login successful:", userData)
        window.location.href = "/itr-details"
      } else {
        const err = (apiResponse?.error || "").toLowerCase()
        if (err.includes("google authentication not configured")) {
          alert(
            "Google authentication is not configured on the backend. Please configure Google auth on your API or update NEXT_PUBLIC_API_BASE_URL to a backend with Google auth enabled.",
          )
        } else {
          const errorMsg = apiResponse.error || "Login failed - no token received"
          console.error("[v0] Login failed:", errorMsg)
          alert("Login failed: " + errorMsg)
        }
      }
    } catch (error) {
      console.error("[v0] Error processing Google auth:", error)
      alert("Authentication error. Please try again.")
    }
  }

  const signInWithGoogle = () => {
    console.log("[v0] Sign in button clicked")
    if (!GOOGLE_CLIENT_ID) {
      alert("Google auth is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable Google sign-in.")
      return
    }
    if (window.google) {
      console.log("[v0] Prompting Google sign-in")
      window.google.accounts.id.prompt()
    } else {
      console.error("[v0] Google SDK not available")
      alert("Google sign-in is not available. Please try again.")
    }
  }

  const signOut = () => {
    api.logout()
    setUser(null)
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

  if (isLoading) {
    return (
      <Button disabled size="sm">
        Loading...
      </Button>
    )
  }

  if (!GOOGLE_CLIENT_ID && !user) {
    return (
      <Button variant="outline" size="sm" disabled title="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID to enable">
        Google auth not configured
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <img src={user.picture || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
        <span className="text-sm font-medium text-foreground">{user.name}</span>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={signInWithGoogle}>
      Sign In with Google
    </Button>
  )
}

export function GoogleAuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null)

  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

  useEffect(() => {
    if (!isOpen) return

    console.log("[v0] Opening auth modal with Client ID:", GOOGLE_CLIENT_ID || "(missing)")

    if (!GOOGLE_CLIENT_ID) {
      console.error("[v0] Google Client ID missing. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.")
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) {
        console.log("[v0] Google SDK loaded in modal, initializing")
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        })

        const buttonDiv = document.getElementById("google-signin-button")
        if (buttonDiv) {
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: "outline",
            size: "large",
            width: 300,
            text: "signin_with",
          })
          console.log("[v0] Google button rendered in modal")
        }
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [isOpen])

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log("[v0] Modal: Received credential response from Google")
      console.log("[v0] Modal: Credential token length:", response.credential?.length)

      const apiResponse = await api.loginWithGoogle(response.credential)
      console.log("[v0] Modal: Backend API response:", apiResponse)

      if (apiResponse.success && apiResponse.token && apiResponse.user) {
        const userData: User = {
          id: apiResponse.user.id || apiResponse.user.sub,
          name: apiResponse.user.name,
          email: apiResponse.user.email,
          picture: apiResponse.user.picture,
        }

        setUser(userData)
        console.log("[v0] Modal: Login successful:", userData)
        onClose()
        window.location.href = "/itr-details"
      } else {
        const err = (apiResponse?.error || "").toLowerCase()
        if (err.includes("google authentication not configured")) {
          alert(
            "Google authentication is not configured on the backend. Please configure Google auth on your API or update NEXT_PUBLIC_API_BASE_URL.",
          )
        } else {
          const errorMsg = apiResponse.error || "Login failed - no token received"
          console.error("[v0] Modal: Login failed:", errorMsg)
          alert("Login failed: " + errorMsg)
        }
      }
    } catch (error) {
      console.error("[v0] Modal: Error processing Google auth:", error)
      alert("Authentication error. Please try again.")
    }
  }

  // If not configured, show clear UI with demo option
  if (!isOpen) return null
  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Google auth not configured</CardTitle>
            <CardDescription>
              Set NEXT_PUBLIC_GOOGLE_CLIENT_ID and ensure your API has Google auth enabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="ghost" onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Sign in to DhanRakshak</CardTitle>
          <CardDescription>Access your AI-powered tax filing dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div id="google-signin-button" className="flex justify-center"></div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Or try the demo</p>
            <Button
              variant="secondary"
              onClick={() => {
                const demoUser: User = {
                  id: "demo-user",
                  name: "Demo User",
                  email: "demo@dhanrakshak.com",
                  picture: "/diverse-user-avatars.png",
                }
                setUser(demoUser)
                localStorage.setItem("dhanrakshak_user", JSON.stringify(demoUser))
                onClose()
                window.location.href = "/itr-details"
              }}
              className="w-full"
            >
              Continue as Demo User
            </Button>
          </div>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
