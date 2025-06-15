"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { getEvents } from "@/lib/api-client"
import { format } from "date-fns"
import { AlertTriangle } from "lucide-react"

// Default fallback image if event image is not available
const DEFAULT_IMAGE = "/placeholder.svg?width=600&height=400";

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

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const data = await getEvents()
        // Get the 3 most recent events for featuring on homepage
        setFeaturedEvents(data.slice(0, 3))
      } catch (err) {
        console.error("Failed to fetch events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-40 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Book Your Next Event Experience
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover and reserve tickets for the best concerts, conferences, sports events, and more. Seamless
                  booking for unforgettable experiences.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/events" passHref>
                  <Button size="lg" className="px-8">
                    Browse Events
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button size="lg" variant="outline" className="px-8">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="h-full">
              <Image
                src="/hero-image.jpg"
                width={550}
                height={550}
                alt="Hero Image"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Featured Events</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Explore our handpicked selection of popular events happening soon.
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="mt-8 text-center">
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="mt-8 text-center text-red-500">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
              <p className="mt-4">{error}</p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {featuredEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="group relative overflow-hidden rounded-lg border bg-background p-2">
                  <div className="aspect-video overflow-hidden rounded-md bg-muted">
                    <Image
                      src={event.imageUrl || DEFAULT_IMAGE}
                      width={600}
                      height={400}
                      alt={event.name}
                      className="object-cover transition-transform group-hover:scale-105 h-full w-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{event.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.eventDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="line-clamp-2 mt-2 text-sm text-muted-foreground">
                      {event.description.length > 100 
                        ? `${event.description.substring(0, 100)}...` 
                        : event.description}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="font-medium">${event.price.toFixed(2)}</div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </Link>
              ))}
              
              {featuredEvents.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No events available at the moment.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-center mt-10">
            <Link href="/events" passHref>
              <Button variant="outline" size="lg">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Book your tickets in three simple steps.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Browse Events</h3>
              <p className="text-muted-foreground">
                Explore our wide selection of events and find the perfect one for you.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Select Seats</h3>
              <p className="text-muted-foreground">
                Choose your preferred seats and the number of tickets you want to purchase.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Secure Reservation</h3>
              <p className="text-muted-foreground">
                Complete your booking and receive your confirmation immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Users Say</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Hear from our satisfied customers who have used our booking platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6">
              <div className="space-y-2">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-400"
                    >
                      <path d="M12 1L15.09 7.28L22 8.25L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.25L8.91 7.28L12 1Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "The booking process was incredibly smooth. I found the perfect concert and secured my tickets in
                  minutes. Highly recommended!"
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="space-y-1">
                  <h3 className="font-medium">Sarah Thompson</h3>
                  <p className="text-sm text-muted-foreground">Music Enthusiast</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6">
              <div className="space-y-2">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-400"
                    >
                      <path d="M12 1L15.09 7.28L22 8.25L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.25L8.91 7.28L12 1Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "I've been using this platform for all my event bookings. The user interface is intuitive and the
                  customer service is exceptional."
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="space-y-1">
                  <h3 className="font-medium">David Chen</h3>
                  <p className="text-sm text-muted-foreground">Regular Attendee</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border bg-background p-6">
              <div className="space-y-2">
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-400"
                    >
                      <path d="M12 1L15.09 7.28L22 8.25L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.25L8.91 7.28L12 1Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "I love how easy it is to find and book tickets for events. The seat selection feature is fantastic,
                  and I always get great seats!"
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="space-y-1">
                  <h3 className="font-medium">Emily Rodriguez</h3>
                  <p className="text-sm text-muted-foreground">Theater Lover</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
