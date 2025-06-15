# EventReserve

EventReserve is a modern event reservation system built with Spring Boot and Next.js, allowing users to discover, book, and manage event reservations in real-time.

## Features

- 🔐 User Authentication and Authorization
- 🎫 Real-time Event Reservation System
- 📅 Event Management
- 📱 Responsive Design
- 🌙 Dark/Light Mode Support
- 🔄 Optimistic Concurrency Control

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- H2
- Lombok


### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI Components



## Core Models

### Event
- Event details including name, description, date
- Seat management with total and available seats
- Price and category information
- Image support
- Optimistic locking for concurrent reservations



### Reservation
- Real-time seat booking
- Reservation status tracking
- Unique reservation codes
- Price calculation
- User and event associations

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Maven

### Installation

1. Clone the repository
```bash
git clone https://github.com/sazaki15/Projet-Syst-me-de-R-servation-Concurrente-pour-v-nements
```

2. Backend Setup
```bash
cd src/main/java
mvn clean install
```

3. Frontend Setup
```bash
npm install
```



4. Run the Application
```bash
# Start Backend
mvn spring-boot:run

# Start Frontend
npm run dev
```





