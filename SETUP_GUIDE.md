# InterviewIQ Setup Guide

## Prerequisites Installation

### 1. Install Maven
Since `mvn` command is not recognized, you need to install Apache Maven:

#### Windows:
```bash
# Option 1: Download and install manually
# Download from: https://maven.apache.org/download.cgi
# Extract to C:\Program Files\Apache\maven
# Add to PATH: C:\Program Files\Apache\maven\bin

# Option 2: Use Chocolatey
choco install maven

# Option 3: Use Scoop
scoop install maven
```

#### macOS:
```bash
# Using Homebrew
brew install maven
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install maven

# Using SDKMAN
curl -s "https://get.sdkman.io" | bash
sdk install maven
```

### 2. Verify Installation
```bash
mvn --version
```

### 3. Set Environment Variables
Add to your system PATH:
- Windows: `C:\Program Files\Apache\maven\bin`
- macOS/Linux: `/usr/local/bin` or wherever Maven is installed

## Frontend Setup

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Frontend
```bash
npm start
# or
npm run dev
```

## Backend Setup

### Compile Backend
```bash
cd backend
mvn clean compile
```

### Run Backend
```bash
mvn spring-boot:run
```

## Alternative: Using IDE

### VS Code:
1. Install Java Extension Pack
2. Install Maven Extension
3. Open project folder
4. Use integrated terminal

### IntelliJ IDEA:
1. Open as Maven project
2. Use built-in Maven support
3. Run from IDE

## Quick Start Commands

### After Maven is installed:
```bash
# 1. Start backend
cd backend
mvn spring-boot:run

# 2. Start frontend (new terminal)
cd frontend
npm start

# 3. Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

## Troubleshooting

### Maven Issues:
- Verify PATH: `echo %PATH%` (Windows) or `echo $PATH` (Unix)
- Check Java: `java -version`
- Check Maven: `mvn --version`

### Frontend Issues:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js: `node --version`
- Check npm: `npm --version`

### Port Conflicts:
- Check ports: `netstat -an | grep :8080`
- Kill processes: `taskkill /PID <pid>` (Windows)

## Docker Alternative (Recommended)

If Maven setup is problematic, use Docker:

```bash
# Install Docker Desktop
# Then run:
docker-compose up --build
```

This will handle all dependencies automatically.
