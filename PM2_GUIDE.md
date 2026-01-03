# PM2 Configuration Guide

## Quick Setup

Run the automated setup script:

```bash
./pm2-setup.sh
```

This will:
1. Install PM2 if not already installed
2. Create logs directory
3. Stop any existing processes
4. Start your application with PM2
5. Save the PM2 process list
6. Configure PM2 to start on system boot

## Manual Setup

If you prefer to set up manually:

### 1. Install PM2

```bash
npm install -g pm2
```

### 2. Start Application

```bash
pm2 start ecosystem.config.js
```

### 3. Save Process List

**IMPORTANT**: This saves your PM2 processes so they persist after reboot:

```bash
pm2 save
```

### 4. Setup Startup Script

**IMPORTANT**: This ensures PM2 starts automatically when your system boots:

```bash
pm2 startup
```

This will output a command that you need to run with sudo. Copy and run that command. It will look something like:

```bash
sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u yourusername --hp /home/yourusername
```

After running the sudo command, save again:

```bash
pm2 save
```

## Why Your App Stops When You Exit

The issue you're experiencing happens because:

1. **PM2 process list not saved**: If you don't run `pm2 save`, PM2 doesn't remember your processes
2. **No startup script**: Without `pm2 startup`, PM2 doesn't start automatically when the system reboots
3. **Running in foreground**: If you're running `pm2 start` without saving, it only runs in the current session

## Solution

You MUST run these two commands:

```bash
# Save the current PM2 process list
pm2 save

# Setup PM2 to start on boot (run the command it outputs with sudo)
pm2 startup
```

## PM2 Commands

### Status & Monitoring

```bash
# Check status of all processes
pm2 status

# Monitor in real-time
pm2 monit

# View logs
pm2 logs

# View logs for specific app
pm2 logs thai-lottery-api

# Clear logs
pm2 flush
```

### Process Management

```bash
# Restart application
pm2 restart thai-lottery-api

# Stop application
pm2 stop thai-lottery-api

# Delete from PM2
pm2 delete thai-lottery-api

# Restart all processes
pm2 restart all
```

### Process List Management

```bash
# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Clear saved process list
pm2 delete all
pm2 save --force
```

## Configuration File

The `ecosystem.config.js` file contains:

- **name**: Process name (`thai-lottery-api`)
- **script**: Command to run (`bun`)
- **args**: Arguments (`run src/index.ts`)
- **instances**: Number of instances (1 for single instance)
- **autorestart**: Automatically restart if crashed
- **max_memory_restart**: Restart if memory exceeds 1GB
- **env**: Environment variables
- **logs**: Log file locations

## Logs

Logs are stored in the `logs/` directory:

- `err.log` - Error logs
- `out.log` - Standard output logs
- `combined.log` - All logs combined

View logs:
```bash
# Live logs
pm2 logs

# Last 100 lines
pm2 logs --lines 100

# Error logs only
pm2 logs --err
```

## Testing PM2 Persistence

1. Start your app:
   ```bash
   pm2 start ecosystem.config.js
   ```

2. Save the process list:
   ```bash
   pm2 save
   ```

3. Exit your terminal completely

4. Open a new terminal and check:
   ```bash
   pm2 status
   ```

Your app should still be running!

## Troubleshooting

### App not running after reboot

```bash
# Check if PM2 is running
pm2 status

# If empty, resurrect saved processes
pm2 resurrect

# If still not working, setup startup again
pm2 startup
# Run the sudo command it outputs
pm2 save
```

### App keeps crashing

```bash
# Check logs
pm2 logs thai-lottery-api --lines 50

# Check if database is accessible
# Make sure .env file has correct credentials
```

### Update application

```bash
# Pull latest code
git pull

# Restart PM2 process
pm2 restart thai-lottery-api

# Or reload with zero-downtime
pm2 reload thai-lottery-api
```

## Production Checklist

- [x] PM2 installed globally
- [x] Application started with `pm2 start ecosystem.config.js`
- [x] Process list saved with `pm2 save`
- [x] Startup script configured with `pm2 startup`
- [x] Sudo command from startup executed
- [x] Saved again after startup configuration
- [x] Tested by exiting terminal and checking `pm2 status`
- [x] Database connection configured in `.env`
- [x] Logs directory created

## Advanced: Multiple Environments

You can create different ecosystem files:

**ecosystem.production.config.js**
```javascript
module.exports = {
  apps: [{
    name: 'thai-lottery-api-prod',
    script: 'bun',
    args: 'run dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

Start with:
```bash
pm2 start ecosystem.production.config.js
```
