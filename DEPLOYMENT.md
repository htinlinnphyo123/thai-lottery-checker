# Production Deployment Guide

## Build for Production

### 1. Build the Application

```bash
bun run build
```

This will:
- Compile TypeScript to optimized JavaScript
- Output to `./dist` directory
- Bundle for Bun runtime

### 2. Start Production Server

```bash
bun run start
```

The server will run on port 3000 (or the port specified in your `.env` file).

## Environment Variables

Make sure to set these in production:

```env
# Database
DB_HOST=your_production_mysql_host
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=thai_lottery

# Server
PORT=3000
NODE_ENV=production
```

## Deployment Options

### Option 1: VPS/Cloud Server (DigitalOcean, AWS, etc.)

1. **Install Bun on server:**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Clone your repository:**
   ```bash
   git clone <your-repo-url>
   cd thai-lotto-api
   ```

3. **Install dependencies:**
   ```bash
   bun install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your production values
   ```

5. **Set up MySQL database:**
   ```bash
   mysql -u root -p < schema.sql
   ```

6. **Build and start:**
   ```bash
   bun run build
   bun run start
   ```

7. **Use PM2 for process management (recommended):**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   pm2 start "bun run start" --name thai-lottery-api
   
   # Save PM2 configuration
   pm2 save
   
   # Set PM2 to start on boot
   pm2 startup
   ```

### Option 2: Railway

1. **Connect your GitHub repository to Railway**

2. **Add environment variables in Railway dashboard:**
   - All variables from `.env`

3. **Railway will automatically:**
   - Detect Bun
   - Run `bun install`
   - Run `bun run start`

4. **Custom start command (if needed):**
   ```
   bun run build && bun run start
   ```

### Option 3: Vercel (Serverless)

> Note: Vercel doesn't support long-running servers well. Better for Railway or VPS.

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production

COPY . .
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
```

Build and run:
```bash
docker build -t thai-lottery-api .
docker run -p 3000:3000 --env-file .env thai-lottery-api
```

## Production Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Configure production MySQL database
- [ ] Set strong database password
- [ ] Enable HTTPS (use Nginx/Caddy as reverse proxy)
- [ ] Set up firewall rules
- [ ] Configure CORS if needed for specific domains
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Set up automated backups for MySQL
- [ ] Test all endpoints after deployment
- [ ] Save initial lottery data: `curl -X GET https://yourdomain.com/save-latest-lottery`

## Nginx Reverse Proxy (Optional)

If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Then set up SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com
```

## Monitoring

Check logs with PM2:
```bash
pm2 logs thai-lottery-api
```

Check status:
```bash
pm2 status
```

Restart if needed:
```bash
pm2 restart thai-lottery-api
```

## Updating

```bash
git pull
bun install
bun run build
pm2 restart thai-lottery-api
```

## Health Check

Test if server is running:
```bash
curl https://yourdomain.com/ping
```

Expected response:
```json
{"status":"success","response":"pong"}
```
