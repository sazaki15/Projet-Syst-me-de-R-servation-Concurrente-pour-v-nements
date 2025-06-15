"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, MapPin, Share2, Star, Users, AlertTriangle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { getEvent, createReservation } from "@/lib/api-client"
import { format } from "date-fns"

// Default fallback image if event image is not available
const DEFAULT_IMAGE = "/placeholder.svg?width=800&height=450";

interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  category: string;
  imageUrl: string;
}

export default function EventDetailPage() {
  const { id } = useParams()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      try {
        const data = await getEvent(id as string)
        setEvent(data)
      } catch (err) {
        console.error("Failed to fetch event:", err)
        setError("Failed to load event. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvent()
  }, [id])

  const handleSeatSelection = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId))
    } else {
      // Check if we haven't reached max selection (e.g., 4 seats)
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, seatId])
      }
    }
  }

  const handleReservation = async () => {
    if (!event || selectedSeats.length === 0) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to make a reservation",
        variant: "destructive"
      });
      router.push("/login?redirect=" + encodeURIComponent(`/events/${id}`));
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Sending reservation request:", {
        eventId: event.id,
        numberOfSeats: selectedSeats.length
      });
      
      const response = await createReservation({
        eventId: event.id,
        numberOfSeats: selectedSeats.length
      });
      
      console.log("Reservation response:", response);
      
      toast({
        title: "Reservation successful!",
        description: `You have reserved ${selectedSeats.length} seats. Your reservation code is: ${response.reservationCode}`,
        variant: "default"
      });
      
      // Redirect to my reservations page
      router.push("/my-reservations");
      
    } catch (error) {
      console.error("Reservation error:", error);
      let errorMessage = "Could not complete your reservation. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("Authentication required")) {
          errorMessage = "Your session has expired. Please log in again.";
          // Redirect to login
          router.push("/login?redirect=" + encodeURIComponent(`/events/${id}`));
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Reservation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <p>Loading event details...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container py-8 text-center text-red-500">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <p className="mt-4 text-xl">Error loading event</p>
        <p>{error || "Event not found"}</p>
        <Button onClick={() => router.push("/events")} className="mt-4">
          Back to Events
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video relative bg-muted rounded-lg mb-6 overflow-hidden">
            <Image 
              src={event.imageUrl || DEFAULT_IMAGE} 
              alt={event.name} 
              fill 
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_IMAGE;
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Time</p>
                <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate), 'h:mm a')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">{event.category || "Event"}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="py-4">
              <h3 className="text-xl font-semibold mb-2">Event Description</h3>
              <p className="text-muted-foreground mb-4 whitespace-pre-line">
                {event.description || "Join us for an unforgettable experience at " + event.name}
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-2">What's Included</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>General admission to the event</li>
                <li>Access to all main stage performances</li>
                <li>Complimentary welcome drink</li>
                <li>Event program and merchandise</li>
                <li>Free parking at the venue</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-2">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                <div>
                  <h4 className="font-medium">Venue Rules</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>No outside food or drinks</li>
                    <li>No smoking inside the venue</li>
                    <li>No photography or recording without permission</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Event Organizer</h4>
                  <p className="mt-2">
                    EventPro Productions<br />
                    Email: info@eventpro.com<br />
                    Phone: (123) 456-7890
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="py-4">
              <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate), 'h:mm a')}</p>
                  <h4 className="font-medium">Doors Open</h4>
                  <p className="text-sm text-muted-foreground">Welcome drinks and registration</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate).getTime() + 30*60000, 'h:mm a')}</p>
                  <h4 className="font-medium">Opening Act</h4>
                  <p className="text-sm text-muted-foreground">Featuring special guest performers</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate).getTime() + 90*60000, 'h:mm a')}</p>
                  <h4 className="font-medium">Main Event</h4>
                  <p className="text-sm text-muted-foreground">Headliner performance</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate).getTime() + 180*60000, 'h:mm a')}</p>
                  <h4 className="font-medium">Intermission</h4>
                  <p className="text-sm text-muted-foreground">Refreshments available</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate).getTime() + 210*60000, 'h:mm a')}</p>
                  <h4 className="font-medium">Closing Performance</h4>
                  <p className="text-sm text-muted-foreground">Final act and closing remarks</p>
                </div>
                <div className="border-l-2 border-primary pl-4 pb-4">
                  <p className="text-sm text-muted-foreground">{format(new Date(event.eventDate).getTime() + 240*60000, 'h:mm a')}</p>
                  <h4 className="font-medium">Event Concludes</h4>
                  <p className="text-sm text-muted-foreground">Thank you for attending!</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Important Notes</h4>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  <li>Please arrive at least 30 minutes before the event starts</li>
                  <li>Have your reservation code ready for quick check-in</li>
                  <li>Schedule is subject to minor changes</li>
                  <li>Photography is allowed during designated times only</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">${event.price.toFixed(2)}</h2>
                <Badge>{event.availableSeats} seats left</Badge>
              </div>

              <Alert className="mb-4">
                <Users className="h-4 w-4" />
                <AlertTitle>Limited Availability</AlertTitle>
                <AlertDescription>This event is selling out fast. Secure your seats now.</AlertDescription>
              </Alert>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Select Seats</h3>
                <div className="grid grid-cols-8 gap-1 mb-2">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const seatId = `seat-${i + 1}`
                    const isSelected = selectedSeats.includes(seatId)
                    const isUnavailable = [3, 7, 12, 15, 22, 28].includes(i + 1)

                    return (
                      <button
                        key={i}
                        disabled={isUnavailable || i >= event.availableSeats}
                        onClick={() => handleSeatSelection(seatId)}
                        className={`aspect-square rounded-sm text-xs flex items-center justify-center ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : isUnavailable || i >= event.availableSeats
                              ? "bg-muted-foreground/20 text-muted-foreground cursor-not-allowed"
                              : "bg-muted hover:bg-muted-foreground/20"
                        }`}
                      >
                        {i + 1}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-muted rounded-sm"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-muted-foreground/20 rounded-sm"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>
                    Price ({selectedSeats.length} × ${event.price.toFixed(2)})
                  </span>
                  <span>${(event.price * selectedSeats.length).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>${(selectedSeats.length * 9.99).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      event.price * selectedSeats.length +
                      selectedSeats.length * 9.99
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full" 
                disabled={selectedSeats.length === 0 || isLoading} 
                onClick={handleReservation}
              >
                {isLoading 
                  ? "Processing..." 
                  : `Reserve ${selectedSeats.length > 0 ? `(${selectedSeats.length})` : ""}`
                }
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
