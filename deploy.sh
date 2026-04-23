#!/bin/bash

# InterviewIQ Deployment Script
# This script automates the deployment of InterviewIQ using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please update the .env file with your configuration before proceeding."
    read -p "Press Enter to continue after updating .env file..."
fi

# Function to generate SSL certificates (self-signed for development)
generate_ssl_certificates() {
    print_status "Generating SSL certificates..."
    
    mkdir -p nginx/ssl
    
    if [ ! -f nginx/ssl/cert.pem ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        print_success "SSL certificates generated successfully"
    else
        print_status "SSL certificates already exist"
    fi
}

# Function to build and start services
deploy_application() {
    print_status "Building and starting InterviewIQ services..."
    
    # Stop existing services if running
    docker-compose down
    
    # Build and start services
    docker-compose up --build -d
    
    print_success "Services started successfully"
}

# Function to wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for database
    print_status "Waiting for database..."
    while ! docker-compose exec -T database mysqladmin ping -h localhost --silent; do
        echo -n "."
        sleep 2
    done
    echo ""
    print_success "Database is ready"
    
    # Wait for backend
    print_status "Waiting for backend service..."
    while ! curl -f http://localhost:8080/actuator/health &> /dev/null; do
        echo -n "."
        sleep 5
    done
    echo ""
    print_success "Backend service is ready"
    
    # Wait for frontend
    print_status "Waiting for frontend service..."
    while ! curl -f http://localhost:3000/health &> /dev/null; do
        echo -n "."
        sleep 5
    done
    echo ""
    print_success "Frontend service is ready"
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    docker-compose ps
    echo ""
    print_status "Service URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8080"
    echo "  API Documentation: http://localhost:8080/swagger-ui.html"
    echo "  Nginx (HTTPS): https://localhost"
    echo ""
    print_status "Default Login Credentials:"
    echo "  Admin: admin@interviewiq.com / admin123"
    echo "  User: user@interviewiq.com / user123"
    echo ""
}

# Function to show logs
show_logs() {
    print_status "Showing logs for all services..."
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    print_status "Stopping InterviewIQ services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up containers, images, and volumes..."
    docker-compose down -v --rmi all
    docker system prune -f
    print_success "Cleanup completed"
}

# Main deployment function
main() {
    echo "=========================================="
    echo "    InterviewIQ Deployment Script"
    echo "=========================================="
    echo ""
    
    case "${1:-deploy}" in
        "deploy")
            generate_ssl_certificates
            deploy_application
            wait_for_services
            show_status
            ;;
        "logs")
            show_logs
            ;;
        "stop")
            stop_services
            ;;
        "cleanup")
            cleanup
            ;;
        "restart")
            stop_services
            sleep 2
            deploy_application
            wait_for_services
            show_status
            ;;
        "status")
            show_status
            ;;
        *)
            echo "Usage: $0 {deploy|logs|stop|cleanup|restart|status}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Build and deploy the application (default)"
            echo "  logs     - Show logs for all services"
            echo "  stop     - Stop all services"
            echo "  cleanup  - Remove all containers, images, and volumes"
            echo "  restart  - Restart all services"
            echo "  status   - Show deployment status"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
