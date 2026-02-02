# Focus Community Center

Full-stack web application for a public community indoor facility with booking management system.

## Features

### Backend (Java Spring Boot)
- RESTful API with Spring Boot 3.2.0
- PostgreSQL database with JPA/Hibernate
- JWT-based authentication
- Role-based access control (USER, STAFF, ADMIN)
- Facilities/Rooms CRUD operations
- Booking system with date/time slots
- Overlap prevention for bookings
- Spring Security integration

### Frontend (React + Vite)
- Modern React 18 with Vite
- React Router for navigation
- JWT authentication context
- Public pages (Home, Facilities)
- User dashboard with booking management
- Staff portal for booking management
- Admin panel for facility management
- Responsive design

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- React 18
- Vite
- React Router
- Axios
- CSS3

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Maven 3.6 or higher

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE focuscenter;

# Exit psql
\q
```

### 2. Backend Setup

Navigate to the backend directory and configure the database:

```bash
cd backend
```

Edit `src/main/resources/application.properties` if needed to match your PostgreSQL credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/focuscenter
spring.datasource.username=postgres
spring.datasource.password=postgres
```

The backend will auto-seed a handful of facilities on first run if the database is empty.

Build and run the backend:

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend API will start at `http://localhost:8080`

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file if you want to point the frontend at a different backend URL:

```bash
VITE_API_URL=http://localhost:8080/api
```

Run the development server:

```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

## Default User Roles

After starting the application, you can create users with different roles:

- **USER**: Can view facilities and create bookings
- **STAFF**: Can view and manage all bookings
- **ADMIN**: Can manage facilities and all bookings

To create STAFF or ADMIN users, manually update the `user_roles` table in the database after registration.

## Notes

- Booking cancellations are handled as status updates (set to `CANCELLED`) so the history is preserved.
- Booking start times must be in the future and end times must be after start times.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Facilities
- `GET /api/facilities/public` - Get all available facilities (public)
- `GET /api/facilities/public/{id}` - Get facility by ID (public)
- `GET /api/facilities` - Get all facilities (STAFF/ADMIN)
- `POST /api/facilities` - Create facility (ADMIN)
- `PUT /api/facilities/{id}` - Update facility (ADMIN)
- `DELETE /api/facilities/{id}` - Delete facility (ADMIN)

### Bookings
- `GET /api/bookings/my` - Get current user's bookings (authenticated)
- `GET /api/bookings` - Get all bookings (STAFF/ADMIN)
- `GET /api/bookings/{id}` - Get booking by ID (authenticated)
- `GET /api/bookings/facility/{facilityId}` - Get bookings for a facility
- `POST /api/bookings` - Create booking (authenticated)
- `PUT /api/bookings/{id}/status` - Update booking status (STAFF/ADMIN)
- `DELETE /api/bookings/{id}` - Delete booking (authenticated)

## Project Structure

```
focus-community-center/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/focuscenter/
│   │   │   │   ├── config/          # Security & app configuration
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # JPA entities
│   │   │   │   ├── repository/      # Spring Data repositories
│   │   │   │   ├── security/        # JWT & security components
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── README.md
```

## Development

### Running Tests

Backend tests:
```bash
cd backend
mvn test
```

### Building for Production

Backend:
```bash
cd backend
mvn clean package
java -jar target/focus-community-center-1.0.0.jar
```

Frontend:
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration
- Protected API endpoints
- Booking overlap prevention

## License

This project is licensed under the MIT License - see the LICENSE file for details.
