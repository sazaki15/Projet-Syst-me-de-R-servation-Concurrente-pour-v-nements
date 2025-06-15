import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, you would send this to your backend
    const response = await fetch("http://localhost:8080/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating reservation:", error)
    const body = await request.json() // Declare the body variable here

    // Mock response
    return NextResponse.json({
      id: "res-" + Math.random().toString(36).substring(2, 10),
      eventId: body.eventId,
      seats: body.seats,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    })
  }
}
