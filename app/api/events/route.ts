import { NextResponse } from "next/server"

// This would connect to your backend API
export async function GET() {
  try {
    // In a real app, you would fetch this from your backend
    const response = await fetch("http://localhost:8080/api/events")
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching events:", error)

    // Fallback to mock data if backend is not available
    return NextResponse.json({
      events: [
        {
          id: "1",
          title: "Summer Music Festival",
          date: "July 15-17, 2025",
          location: "Central Park, NY",
          availableSeats: 250,
          price: 89.99,
          category: "Concert",
        },
        {
          id: "2",
          title: "Tech Innovation Summit",
          date: "August 5, 2025",
          location: "Convention Center, SF",
          availableSeats: 120,
          price: 199.99,
          category: "Conference",
        },
        {
          id: "3",
          title: "Comedy Night Special",
          date: "June 22, 2025",
          location: "Laugh Factory, LA",
          availableSeats: 75,
          price: 49.99,
          category: "Theater",
        },
      ],
    })
  }
}
