# InterviewIQ Deployment Guide

This guide provides comprehensive instructions for deploying the InterviewIQ application using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git
- At least 4GB RAM
- 10GB free disk space

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd InterviewIQ
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit the configuration
nano .env
```

Update the following variables in `.env`:
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secure JWT secret (change this!)
- `MAIL_USERNAME` - Email for notifications
- `MAIL_PASSWORD` - Email app password

### 3. Deploy Application

```bash
# Make deploy script executable (Linux/Mac)
chmod +x deploy.sh

# Deploy the application
./deploy.sh deploy
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **HTTPS**: https://localhost (self-signed certificate)

## Default Credentials

- **Admin**: admin@interviewiq.com / admin123
- **User**: user@interviewiq.com / user123

## Deployment Options

### Development Deployment

For development and testing:

```bash
docker-compose up --build
```

### Production Deployment

For production environment:

```bash
# Set production environment variables
export SPRING_PROFILES_ACTIVE=production

# Use production compose file
docker-compose -f docker-compose.prod.yml up --build -d
```

## Deployment Script Usage

The `deploy.sh` script provides several commands:

```bash
./deploy.sh deploy    # Build and deploy (default)
./deploy.sh logs      # Show logs
./deploy.sh stop      # Stop services
./deploy.sh restart   # Restart services
./deploy.sh cleanup   # Remove all containers and data
./deploy.sh status    # Show deployment status
```

## Manual Deployment Steps

### 1. Build Docker Images

```bash
# Backend
cd backend
docker build -t interviewiq-backend .

# Frontend
cd ../frontend
docker build -t interviewiq-frontend .
```

### 2. Start Database

```bash
docker run -d \
  --name interviewiq-db \
  -e MYSQL_ROOT_PASSWORD=rootpassword123 \
  -e MYSQL_DATABASE=interviewiq \
  -e MYSQL_USER=interviewiq_user \
  -e MYSQL_PASSWORD=interviewiq_password \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

### 3. Start Backend

```bash
docker run -d \
  --name interviewiq-backend \
  --link interviewiq-db:database \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://database:3306/interviewiq \
  -e SPRING_DATASOURCE_USERNAME=interviewiq_user \
  -e SPRING_DATASOURCE_PASSWORD=interviewiq_password \
  -e JWT_SECRET=your-jwt-secret \
  -p 8080:8080 \
  interviewiq-backend
```

### 4. Start Frontend

```bash
docker run -d \
  --name interviewiq-frontend \
  --link interviewiq-backend:backend \
  -p 3000:3000 \
  interviewiq-frontend
```

## SSL Configuration

For production, replace the self-signed certificates:

1. Obtain SSL certificates from your provider
2. Place them in `nginx/ssl/` directory:
   - `cert.pem` - SSL certificate
   - `key.pem` - Private key

3. Update `nginx/nginx.conf` with your domain

## Environment Variables

### Database Configuration
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_NAME` - Database name (default: interviewiq)
- `DB_USER` - Database username (default: interviewiq_user)
- `DB_PASSWORD` - Database password

### Application Configuration
- `SPRING_PROFILES_ACTIVE` - Spring profile (development/production)
- `SERVER_PORT` - Backend port (default: 8080)
- `JWT_SECRET` - JWT signing secret (change this!)
- `JWT_EXPIRATION` - Token expiration in milliseconds

### Email Configuration
- `MAIL_HOST` - SMTP server (default: smtp.gmail.com)
- `MAIL_PORT` - SMTP port (default: 587)
- `MAIL_USERNAME` - Email username
- `MAIL_PASSWORD` - Email app password

## Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost:3000/health

# Database health
docker-compose exec database mysqladmin ping -h localhost
```

### Service Status

```bash
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   netstat -tulpn | grep :8080
   netstat -tulpn | grep :3000
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Test database connection
   docker-compose exec database mysql -u interviewiq_user -p
   ```

3. **Memory Issues**
   ```bash
   # Check Docker memory usage
   docker stats
   ```

4. **SSL Certificate Issues**
   ```bash
   # Regenerate certificates
   rm -rf nginx/ssl
   ./deploy.sh deploy
   ```

### Reset Deployment

```bash
# Stop all services
docker-compose down

# Remove volumes (data will be lost!)
docker-compose down -v

# Remove all images
docker system prune -a

# Redeploy
./deploy.sh deploy
```

## Production Considerations

### Security

1. Change default passwords
2. Use strong JWT secret
3. Configure proper SSL certificates
4. Set up firewall rules
5. Enable HTTPS only

### Performance

1. Use Redis for caching
2. Configure connection pooling
3. Enable Gzip compression
4. Use CDN for static assets

### Backup

1. Backup database regularly
2. Backup configuration files
3. Document deployment process

## Scaling

### Horizontal Scaling

```bash
# Scale backend services
docker-compose up --scale backend=3

# Use load balancer for multiple instances
```

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy InterviewIQ
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          ./deploy.sh deploy
```

## Support

For deployment issues:

1. Check the logs: `./deploy.sh logs`
2. Verify configuration: `./deploy.sh status`
3. Review troubleshooting section above
4. Check GitHub issues for common problems

## Next Steps

After successful deployment:

1. Change default passwords
2. Configure email settings
3. Set up monitoring
4. Configure backup strategy
5. Test all functionality
6. Set up domain and SSL certificates
