// API client for interacting with the backend

const API_BASE_URL = "http://localhost:8080/api"

export interface Event {
  id: number
  name: string
  description: string
  eventDate: string
  totalSeats: number
  availableSeats: number
  price: number
  category: string
  imageUrl: string
  createdAt: string
}

export interface Seat {
  id: string
  seatNumber: string
  status: "AVAILABLE" | "RESERVED" | "SOLD"
}

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

export interface Reservation {
  id: number
  event?: Event
  eventName: string
  reservationDate: string
  numberOfSeats: number
  status: string
  reservationCode: string
  totalPrice: number
  userName?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    firstName: string
    lastName: string
    roles: string[]
  }
}

export interface CreateReservationRequest {
  eventId: number
  numberOfSeats: number
}

// Helper function to get token
function getToken(): string | null {
  return localStorage.getItem("authToken")
}

// Helper for fetch requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }
  if (token) {
    ;(headers as any)["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Auth functions
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Login failed")
  }
  
  return response.json()
}

export async function register(userData: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Registration failed")
  }
  
  return response.json()
}

// Events functions
export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/events`)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch events")
  }
  
  return response.json()
}

export async function getEvent(id: string): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${id}`)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch event")
  }
  
  return response.json()
}

// Reservation functions
export async function createReservation(request: CreateReservationRequest): Promise<Reservation> {
  const token = getToken()
  
  if (!token) {
    throw new Error("Authentication required")
  }
  
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(request),
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to create reservation")
  }
  
  return response.json()
}

export async function getUserReservations(): Promise<Reservation[]> {
  const token = getToken()
  
  if (!token) {
    throw new Error("Authentication required")
  }
  
  const response = await fetch(`${API_BASE_URL}/reservations/user`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to fetch reservations")
  }
  
  return response.json()
}
