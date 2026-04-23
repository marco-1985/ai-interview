# InterviewIQ - AI-Powered Mock Interview Platform

A modern, fully responsive AI-powered web platform for mock interview practice designed for students and job seekers.

## Tech Stack

### Frontend
- **React.js 18+** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework with custom glassmorphism design
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **Chart.js / Recharts** - Data visualization for analytics
- **Heroicons** - Beautiful SVG icons

### Backend
- **Java 17+** - Modern Java with latest features
- **Spring Boot 3.x** - Enterprise-grade framework
- **Spring Security** - Comprehensive security framework
- **JWT Authentication** - Token-based authentication
- **Spring Data JPA** - Database abstraction layer
- **MySQL/PostgreSQL** - Relational database support
- **Lombok** - Reduce boilerplate code
- **Maven** - Build and dependency management
- **SpringDoc OpenAPI** - API documentation

## Features

### Core Features
- **Authentication System**: JWT-based secure login/signup with email verification
- **AI Interview Agent**: Field-specific interview questions with experience levels
- **AI Interview Experience**: Real-time webcam/microphone integration with voice-to-text
- **AI Evaluation System**: Comprehensive scoring and feedback system
- **Premium Features**: Resume analysis, PDF reports, leaderboard, multi-language support

### Pages
- **Home/Landing** - Modern landing page with hero section and features
- **About** - Company information and mission
- **Features** - Detailed feature showcase
- **Login/Signup** - Authentication with social login options
- **Dashboard** - User dashboard with interview history and stats
- **Interview Room** - Live interview simulation with AI
- **Results Page** - Detailed feedback and analytics
- **Profile** - User profile management
- **Pricing** - Subscription plans and features
- **Contact** - Contact form and information

## Project Structure

```
InterviewIQ/
/backend/
  src/main/java/com/interviewiq/
    controller/          # REST API controllers
    service/             # Business logic services
    repository/          # Data access layer
    entity/              # JPA entities
    dto/                 # Data transfer objects
    security/            # Security configuration
    config/              # Application configuration
    exception/           # Global exception handling
    utils/               # Utility classes
/frontend/
  src/
    components/          # Reusable React components
    pages/               # Page components
    hooks/               # Custom React hooks
    services/            # API service layer
    utils/               # Utility functions
    styles/              # Global styles and CSS
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.6+
- MySQL/PostgreSQL database

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

### Database Configuration
Update `application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/interviewiq
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Database Schema

### User
- `id` - Primary key
- `name` - User's full name
- `email` - Email address (unique)
- `password` - Encrypted password
- `phoneNumber` - Optional phone number
- `role` - User role (USER/ADMIN)
- `emailVerified` - Email verification status
- `createdAt` - Account creation timestamp

### Interview
- `id` - Primary key
- `userId` - Foreign key to User
- `category` - Interview category (FRONTEND_DEVELOPER, BACKEND_DEVELOPER, etc.)
- `level` - Experience level (FRESHER, INTERMEDIATE, EXPERIENCED)
- `type` - Interview type (TECHNICAL, HR, MIXED)
- `status` - Interview status (CREATED, IN_PROGRESS, COMPLETED)
- `durationMinutes` - Planned duration
- `actualDurationMinutes` - Actual time taken
- `startedAt` - Interview start time
- `completedAt` - Interview completion time
- `createdAt` - Creation timestamp

### Question
- `id` - Primary key
- `questionText` - The question content
- `category` - Question category
- `level` - Difficulty level
- `type` - Question type
- `difficultyScore` - Numeric difficulty rating
- `expectedAnswer` - Expected answer for evaluation
- `keywords` - Keywords for answer matching
- `maxTimeSeconds` - Time limit for answering
- `isActive` - Whether question is active

### Answer
- `id` - Primary key
- `interviewId` - Foreign key to Interview
- `questionId` - Foreign key to Question
- `userAnswer` - User's response
- `score` - Answer score (0-100)
- `feedback` - AI-generated feedback
- `timeTaken` - Time taken to answer
- `answeredAt` - Answer timestamp

### Result
- `id` - Primary key
- `interviewId` - Foreign key to Interview
- `overallScore` - Total interview score
- `confidenceScore` - Confidence metric
- `communicationScore` - Communication skills score
- `technicalScore` - Technical knowledge score
- `problemSolvingScore` - Problem-solving score
- `passFail` - Pass/fail determination
- `grade` - Letter grade (A, B, C, D, F)
- `strengths` - Identified strengths
- `weaknesses` - Areas for improvement
- `improvements` - Recommendations
- `createdAt` - Result generation timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Reset password

### Interviews
- `POST /api/interviews/start` - Start new interview
- `GET /api/interviews/{id}` - Get interview by ID
- `GET /api/interviews/history` - Get user interview history
- `GET /api/interviews/active` - Get active interviews
- `PUT /api/interviews/{id}/status` - Update interview status
- `DELETE /api/interviews/{id}` - Delete interview

### Questions
- `GET /api/questions/generate` - Generate questions for interview
- `GET /api/questions/category/{category}` - Get questions by category
- `GET /api/questions/all` - Get all active questions
- `GET /api/questions/{id}` - Get question by ID
- `POST /api/questions` - Create new question
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question
- `GET /api/questions/search` - Search questions by keyword
- `POST /api/questions/initialize` - Initialize default questions

### Answers
- `POST /api/answers/submit` - Submit answer
- `GET /api/answers/interview/{id}` - Get answers for interview

### Results
- `GET /api/results/{interviewId}` - Get interview results
- `GET /api/results/history` - Get results history
- `POST /api/results/generate` - Generate results for interview

## Design Features

### UI/UX
- **Glassmorphism Design** - Modern frosted glass effect
- **Dark/Light Mode** - Theme switching support
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Framer Motion transitions
- **Micro-interactions** - Hover states and feedback

### Security
- **JWT Authentication** - Secure token-based auth
- **Password Encryption** - BCrypt hashing
- **CORS Configuration** - Cross-origin security
- **Input Validation** - Comprehensive validation
- **SQL Injection Prevention** - Parameterized queries

## Development Workflow

### Running the Application
1. Start the database (MySQL/PostgreSQL)
2. Run the backend: `cd backend && mvn spring-boot:run`
3. Run the frontend: `cd frontend && npm start`
4. Access the application at `http://localhost:3000`

### API Documentation
Swagger UI is available at `http://localhost:8080/swagger-ui.html`

### Environment Variables
Create `.env` file in frontend root:
```
VITE_API_URL=http://localhost:8080/api
```

## Future Enhancements

### Planned Features
- **WebRTC Integration** - Real video/audio recording
- **AI Voice Assistant** - Voice-based interaction
- **Advanced Analytics** - Detailed performance metrics
- **Multi-language Support** - Internationalization
- **Mobile App** - React Native application
- **Integration APIs** - Third-party platform integrations

### Technical Improvements
- **Microservices Architecture** - Service decomposition
- **Redis Caching** - Performance optimization
- **WebSocket Support** - Real-time features
- **Docker Containerization** - Deployment readiness
- **CI/CD Pipeline** - Automated testing and deployment

## Contributing

This project is designed for hackathon submission and demonstrates modern web development practices with AI integration capabilities.

### Development Guidelines
- Follow REST API conventions
- Write comprehensive tests
- Maintain code quality standards
- Document new features
- Use semantic versioning

## License

MIT License
