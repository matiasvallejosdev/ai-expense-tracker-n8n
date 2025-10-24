# Docker Compose Guide - Quick Reference

## Core Concepts

### What is Docker Compose?
Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file.

**Think of it as:** A recipe that describes how multiple apps work together.

---

## Key Concepts (Atomic Notes)

### 1. **Service**
A container that runs your application.

```yaml
services:
  web-app:      # Service name
    image: node  # What to run
    ports:
      - "3000:3000"  # How to access it
```

**Analogy:** Like a single appliance in your kitchen (microwave, oven, fridge).

---

### 2. **Image**
A blueprint/template for creating containers.

```yaml
services:
  n8n:
    image: n8nio/n8n:latest  # Pre-built image from Docker Hub
```

```yaml
services:
  web-app:
    build:
      context: ./web-app      # Build from local Dockerfile
      dockerfile: Dockerfile
```

**Analogy:** Like a recipe - you can use someone else's recipe (image) or create your own (build).

---

### 3. **Ports**
Maps container ports to your computer ports.

```yaml
ports:
  - "3000:3000"  # host:container
```

**Format:** `HOST_PORT:CONTAINER_PORT`
- `3000:3000` - Access container's port 3000 via localhost:3000
- `8080:3000` - Access container's port 3000 via localhost:8080

**Analogy:** Like giving your apartment a street address so visitors can find you.

---

### 4. **Volumes**
Persistent storage for containers (data survives container restarts).

```yaml
volumes:
  - n8n_data:/home/node/.n8n  # Named volume
  - ./local-folder:/app/data   # Bind mount
```

**Types:**
- **Named volumes:** `n8n_data:/path` - Docker manages storage
- **Bind mounts:** `./folder:/path` - Uses your local folder

**Analogy:** Like a external hard drive that keeps your files even if you turn off your computer.

---

### 5. **Networks**
Allows containers to communicate with each other.

```yaml
networks:
  expense-tracker-network:
    driver: bridge
```

**In our project:**
- `web-app` can reach `n8n` using `http://n8n:5678` (service name as hostname)
- External access: `http://localhost:5678`

**Analogy:** Like a private Wi-Fi network where your devices can talk to each other.

---

### 6. **Environment Variables**
Configuration passed to containers.

```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=postgres://db:5432
  - API_KEY=${API_KEY}  # From .env file
```

**Analogy:** Like settings/preferences for your app.

---

### 7. **Depends On**
Controls startup order.

```yaml
services:
  web-app:
    depends_on:
      - n8n  # Start n8n first
```

**Note:** Only waits for container to start, not for app to be ready.

---

## Practical Commands

### Basic Operations

```bash
# Start all services (detached mode)
docker-compose up -d

# Start and rebuild images
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# View logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web-app

# List running containers
docker-compose ps

# Restart a service
docker-compose restart web-app

# Stop a single service
docker-compose stop n8n

# Start a single service
docker-compose start n8n
```

---

### Debugging Commands

```bash
# Execute command in running container
docker-compose exec web-app sh

# Run one-time command
docker-compose run web-app npm install

# View container resource usage
docker stats

# Inspect container details
docker-compose ps
docker inspect <container-name>

# Remove all stopped containers, unused images
docker system prune -a
```

---

## Real Example Breakdown

Let's break down our `docker-compose.yml`:

```yaml
version: '3.8'  # Docker Compose file version

services:
  # Service 1: N8N
  n8n:
    image: n8nio/n8n:latest        # Use pre-built image
    container_name: ai-expense-tracker-n8n  # Custom name
    restart: unless-stopped         # Auto-restart on crash
    ports:
      - "5678:5678"                # Expose on localhost:5678
    environment:
      - N8N_PORT=5678              # App listens on port 5678
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n  # Persist n8n data
    networks:
      - expense-tracker-network    # Join network

  # Service 2: Web App
  web-app:
    build:
      context: ./web-app           # Build from local code
    ports:
      - "3000:3000"                # Expose on localhost:3000
    environment:
      - NEXT_PUBLIC_WEBHOOK_URL=http://n8n:5678/webhook-test/upload-expense
      # ↑ Uses service name 'n8n' as hostname (internal network)
    depends_on:
      - n8n                        # Wait for n8n to start
    networks:
      - expense-tracker-network    # Join same network

# Define volumes
volumes:
  n8n_data:                        # Named volume for persistence

# Define networks
networks:
  expense-tracker-network:
    driver: bridge                 # Standard network type
```

---

## Common Patterns

### Pattern 1: Database + App

```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

  app:
    build: .
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://db:5432/mydb  # Use 'db' as hostname
```

### Pattern 2: Development with Hot Reload

```yaml
services:
  app:
    build: .
    volumes:
      - ./src:/app/src  # Mount source code
      - /app/node_modules  # Don't override node_modules
    command: npm run dev
```

### Pattern 3: Multiple Networks

```yaml
services:
  web:
    networks:
      - frontend
      - backend

  api:
    networks:
      - backend

  db:
    networks:
      - backend

networks:
  frontend:
  backend:
```

---

## Key Differences

### Image vs Build

| **Image** | **Build** |
|-----------|-----------|
| Use existing image | Create custom image |
| Fast to start | Slower (builds first) |
| `image: nginx` | `build: ./app` |

### Named Volume vs Bind Mount

| **Named Volume** | **Bind Mount** |
|-----------------|----------------|
| Docker manages | You manage |
| `db_data:/data` | `./data:/data` |
| For persistence | For development |
| Can't see files easily | Can edit files locally |

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs service-name

# Check if port is already in use
lsof -i :3000

# Rebuild and start
docker-compose up --build
```

### Can't connect between services
```bash
# Check they're on same network
docker-compose ps

# Verify network name in YAML
docker network ls

# Use service name as hostname, not localhost
# ✅ http://n8n:5678
# ❌ http://localhost:5678 (only works from host)
```

### Data disappeared
```bash
# Don't use -v flag when stopping
docker-compose down      # ✅ Keeps volumes
docker-compose down -v   # ❌ Deletes volumes

# List volumes
docker volume ls

# Inspect volume
docker volume inspect n8n_data
```

---

## Best Practices

1. **Always use named volumes for data persistence**
   ```yaml
   volumes:
     - postgres_data:/var/lib/postgresql/data
   ```

2. **Use environment files for secrets**
   ```yaml
   env_file:
     - .env
   ```

3. **Pin image versions for stability**
   ```yaml
   image: postgres:15.2  # ✅ Specific version
   image: postgres:latest  # ❌ Unpredictable
   ```

4. **Use health checks**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

5. **Limit container resources**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.50'
         memory: 512M
   ```

---

## Quick Reference Card

```
Start:     docker-compose up -d
Stop:      docker-compose down
Rebuild:   docker-compose up --build
Logs:      docker-compose logs -f [service]
Shell:     docker-compose exec [service] sh
Restart:   docker-compose restart [service]
Clean:     docker system prune -a
```

---

## Learning Path

1. ✅ **Start here:** Run existing docker-compose.yml
2. ✅ **Next:** Modify environment variables
3. ✅ **Then:** Add a new service (like Redis)
4. ✅ **Advanced:** Create custom networks
5. ✅ **Expert:** Multi-stage builds, health checks

---

## Additional Resources

- [Official Docs](https://docs.docker.com/compose/)
- [Docker Compose Spec](https://github.com/compose-spec/compose-spec/blob/master/spec.md)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
