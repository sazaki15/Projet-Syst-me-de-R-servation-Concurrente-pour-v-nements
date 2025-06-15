"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, AlertTriangle, Ticket, ExternalLink, Info } from "lucide-react"
import { format } from "date-fns"
import { getUserReservations, Reservation, Event } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

// Default fallback image if event image is not available
const DEFAULT_IMAGE = "/placeholder.svg?width=600&height=300";

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/my-reservations")
      return
    }

    const fetchReservations = async () => {
      setLoading(true)
      try {
        const data = await getUserReservations()
        console.log("Fetched reservations:", data);
        setReservations(data)
      } catch (err) {
        console.error("Failed to fetch reservations:", err)
        setError("Failed to load your reservations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [isAuthenticated, router])

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "CANCELED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getEventName = (reservation: Reservation): string => {
    return reservation.event?.name || reservation.eventName || "Event";
  }

  const getEventDate = (reservation: Reservation): string => {
    return reservation.event?.eventDate || new Date().toISOString();
  }

  const getEventId = (reservation: Reservation): number => {
    return reservation.event?.id || 0;
  }

  const getEventImageUrl = (reservation: Reservation): string => {
    return reservation.event?.imageUrl || DEFAULT_IMAGE;
  }

  const getEventCategory = (reservation: Reservation): string => {
    return reservation.event?.category || "Event";
  }

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <p>Loading your reservations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <p className="mt-4 text-xl">Error loading reservations</p>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
        <div className="bg-muted rounded-lg p-8 text-center">
          <div className="mb-4">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">You don't have any reservations yet</h2>
          <p className="text-muted-foreground mb-6">
            Explore our events and make your first reservation!
          </p>
          <Button onClick={() => router.push("/events")}>Browse Events</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image 
                src={getEventImageUrl(reservation)} 
                alt={getEventName(reservation)} 
                fill 
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = DEFAULT_IMAGE;
                }}
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{getEventName(reservation)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(getEventDate(reservation)), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(getEventDate(reservation)), "h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">
                      {getEventCategory(reservation)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Ticket className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Reservation Code</p>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {reservation.reservationCode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/events/${getEventId(reservation)}`)}
              >
                View Event
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Ticket className="h-4 w-4 mr-2" />
                    View Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Your Ticket</DialogTitle>
                    <DialogDescription>
                      Ticket details for {getEventName(reservation)}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={getEventImageUrl(reservation)} 
                        alt={getEventName(reservation)} 
                        fill 
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-4">{getEventName(reservation)}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Date & Time</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(getEventDate(reservation)), "MMMM d, yyyy")} at {format(new Date(getEventDate(reservation)), "h:mm a")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Ticket className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Number of Seats</p>
                            <p className="text-sm text-muted-foreground">
                              {reservation.numberOfSeats} {reservation.numberOfSeats > 1 ? 'seats' : 'seat'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Price</p>
                            <p className="text-sm text-muted-foreground">
                              ${reservation.totalPrice?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Reservation Code</p>
                            <p className="text-lg font-mono font-semibold tracking-wider">{reservation.reservationCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => window.print()}>
                      Print Ticket
                    </Button>
                    <Button variant="default">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
