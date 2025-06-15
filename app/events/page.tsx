"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Users, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getEvents } from "@/lib/api-client"
import { format } from "date-fns"

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

// Default fallback image if event image is not available
const DEFAULT_IMAGE = "/placeholder.svg?width=400&height=225";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-asc")

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (err) {
        console.error("Failed to fetch events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])

  // Filter and sort events
  const filteredEvents = events
    .filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => 
      categoryFilter === "all" || 
      (event.category && event.category.toLowerCase() === categoryFilter.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case "date-asc":
          return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        case "date-desc":
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <p>Loading events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
        <p className="mt-4 text-xl">Error loading events</p>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      {/* Search and Filter */}
      <div className="bg-card rounded-lg p-4 mb-8 border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Event Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="concert">Concerts</SelectItem>
              <SelectItem value="conference">Conferences</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="theater">Theater</SelectItem>
              <SelectItem value="expo">Expos</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-asc">Date (Earliest)</SelectItem>
              <SelectItem value="date-desc">Date (Latest)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="group">
              <div className="bg-card rounded-lg overflow-hidden border shadow-sm transition-all hover:shadow-md">
                <div className="aspect-video relative">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <div className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded mb-2">
                        {event.category || "Event"}
                      </div>
                      <h3 className="font-bold text-xl">{event.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-white/80 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(event.eventDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{event.availableSeats} seats left</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold">${event.price.toFixed(2)}</span>
                    <Button size="sm" className="group-hover:bg-primary/90">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
