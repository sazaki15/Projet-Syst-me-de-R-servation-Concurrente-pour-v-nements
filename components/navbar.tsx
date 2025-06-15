"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, logout, isLoading } = useAuth()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl">
            EventReserve
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
            Events
          </Link>
          {isAuthenticated && (
            <Link href="/my-reservations" className="text-sm font-medium transition-colors hover:text-primary">
              My Reservations
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden md:flex gap-2">
            {isLoading ? (
              <Button variant="outline" disabled>
                Loading...
              </Button>
            ) : isAuthenticated ? (
              <>
                <span className="text-sm font-medium self-center mr-2">Hi, {user?.firstName}</span>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 grid gap-4">
            <Link
              href="/events"
              className="text-sm font-medium p-2 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            {isAuthenticated && (
              <Link
                href="/my-reservations"
                className="text-sm font-medium p-2 rounded-md hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                My Reservations
              </Link>
            )}
            <div className="grid gap-2 pt-2 border-t">
              {isLoading ? (
                <Button variant="outline" disabled className="w-full">
                  Loading...
                </Button>
              ) : isAuthenticated ? (
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
