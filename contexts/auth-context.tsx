"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation" // Corrected import

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (token: string, userData: User) => void
  logout: () => void
  isLoading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Compute isAdmin based on user roles
  const isAdmin = user?.roles?.includes("ADMIN") || false

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("authUser")
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User
        setToken(storedToken)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error)
        localStorage.removeItem("authToken")
        localStorage.removeItem("authUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string, userData: User) => {
    localStorage.setItem("authToken", newToken)
    localStorage.setItem("authUser", JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
    setIsAuthenticated(true)
    router.push("/") // Redirect to home after login
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    router.push("/login") // Redirect to login after logout
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
