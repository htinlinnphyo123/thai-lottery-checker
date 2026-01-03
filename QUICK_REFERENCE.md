# Thai Lottery API - Quick Reference

## 🚀 Getting Started

### Development
```bash
bun run dev
```

### Production with PM2
```bash
# Quick setup (recommended)
./pm2-setup.sh

# Or manually
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Run the sudo command it outputs
```

## 📋 Common Commands

### Development
| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun install` | Install dependencies |

### Production
| Command | Description |
|---------|-------------|
| `bun run build` | Build for production |
| `bun run start` | Start production server |

### PM2 Process Management
| Command | Description |
|---------|-------------|
| `npm run pm2:start` | Start with PM2 |
| `npm run pm2:stop` | Stop process |
| `npm run pm2:restart` | Restart process |
| `npm run pm2:logs` | View logs |
| `npm run pm2:status` | Check status |
| `pm2 save` | **Save process list** |
| `pm2 monit` | Real-time monitoring |

### Database
| Command | Description |
|---------|-------------|
| `mysql -u root -p < schema.sql` | Create database & tables |

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Lottery checker web interface |
| GET | `/swagger` | API documentation |
| GET | `/ping` | Health check |
| GET | `/latest` | Get latest lottery results |
| GET | `/lotto/:id` | Get lottery by ID |
| GET | `/list/:page` | Get lottery list |
| **GET** | **`/save-latest-lottery`** | **Save latest to database** |
| **POST** | **`/check-lottery-ticket`** | **Check tickets** |

### Check Lottery Ticket
```bash
curl -X POST http://localhost:3000/check-lottery-ticket \
  -H "Content-Type: application/json" \
  -d '{"numbers": ["123456", "789012"]}'
```

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `ecosystem.config.js` | PM2 configuration |
| `schema.sql` | Database schema |
| `package.json` | Dependencies & scripts |

## 📝 Important PM2 Steps

**To keep your app running after exit:**

1. Start with PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

2. **Save the process list** (CRITICAL):
   ```bash
   pm2 save
   ```

3. **Setup startup script** (CRITICAL):
   ```bash
   pm2 startup
   # Run the sudo command it outputs
   pm2 save  # Save again after startup
   ```

## 📊 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs

# Check status
pm2 status
```

## 🐛 Troubleshooting

**App stops when I exit terminal:**
- Make sure you ran `pm2 save`
- Make sure you ran `pm2 startup` and the sudo command

**Database connection error:**
- Check `.env` file has correct credentials
- Make sure MySQL is running
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Port already in use:**
```bash
# Find process on port 3000
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)
```

## 📚 Documentation

- [PM2_GUIDE.md](PM2_GUIDE.md) - Detailed PM2 setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [TELEGRAM_APP.md](TELEGRAM_APP.md) - Telegram Mini App setup
- [README.md](README.md) - Full documentation

## 🎯 Quick Start Checklist

- [ ] Install dependencies: `bun install`
- [ ] Setup database: `mysql -u root -p < schema.sql`
- [ ] Configure `.env` file
- [ ] Save lottery data: `curl -X GET http://localhost:3000/save-latest-lottery`
- [ ] Start with PM2: `./pm2-setup.sh`
- [ ] Test: `curl http://localhost:3000/ping`
- [ ] Open web interface: `http://localhost:3000/`
