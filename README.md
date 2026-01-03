# Thai Lottery Checker API - Setup Guide

## Prerequisites

- Bun runtime installed
- MySQL server running
- Node.js (for npm compatibility)

## Installation

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up MySQL database:**
   ```bash
   # Create the database and tables
   mysql -u your_username -p < schema.sql
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your MySQL credentials
   # DB_HOST=localhost
   # DB_PORT=3306
   # DB_USER=your_mysql_username
   # DB_PASSWORD=your_mysql_password
   # DB_NAME=thai_lottery
   ```

## Running the Application

```bash
# Development mode with hot reload
bun run dev

# Production mode
bun run src/index.ts
```

## API Endpoints

### Existing Endpoints

- **GET /latest** - Get latest lottery results (from web scraping)
- **GET /lotto/:id** - Get lottery by ID
- **GET /list/:page** - Get paginated lottery list

### New Endpoints

#### 1. Save Latest Lottery to Database

**POST /save-latest-lottery**

Fetches the latest lottery data from Sanook and saves it to the MySQL database.

**Response:**
```json
{
  "status": "success",
  "response": {
    "message": "Lottery data saved successfully",
    "drawId": "02012569",
    "drawDate": "2 มกราคม 2569"
  }
}
```

#### 2. Check Lottery Tickets

**POST /check-lottery-ticket**

Check lottery ticket numbers against the latest draw stored in the database.

**Request Body:**
```json
{
  "numbers": ["837706", "837705", "104358", "999999"]
}
```

**Response:**
```json
{
  "status": "success",
  "response": {
    "drawDate": "2 มกราคม 2569",
    "results": [
      {
        "ticketNumber": "837706",
        "isWinner": true,
        "matches": [
          {
            "prizeId": "prizeFirst",
            "prizeName": "รางวัลที่ 1",
            "reward": "6000000",
            "matchedNumber": "837706",
            "matchType": "full"
          }
        ],
        "totalReward": 6000000
      },
      {
        "ticketNumber": "837705",
        "isWinner": true,
        "matches": [
          {
            "prizeId": "prizeFirstNear",
            "prizeName": "รางวัลข้างเคียงรางวัลที่ 1",
            "reward": "100000",
            "matchedNumber": "837705",
            "matchType": "full"
          }
        ],
        "totalReward": 100000
      },
      {
        "ticketNumber": "104358",
        "isWinner": true,
        "matches": [
          {
            "prizeId": "prizeSecond",
            "prizeName": "รางวัลที่ 2",
            "reward": "200000",
            "matchedNumber": "104358",
            "matchType": "full"
          }
        ],
        "totalReward": 200000
      },
      {
        "ticketNumber": "999999",
        "isWinner": false,
        "matches": [],
        "totalReward": 0
      }
    ]
  }
}
```

## Usage Flow

1. **First time setup:**
   - Run the database schema to create tables
   - Configure your `.env` file

2. **Save lottery data:**
   ```bash
   curl -X POST http://localhost:3000/save-latest-lottery
   ```

3. **Check tickets:**
   ```bash
   curl -X POST http://localhost:3000/check-lottery-ticket \
     -H "Content-Type: application/json" \
     -d '{"numbers": ["837706", "123456"]}'
   ```

## Database Schema

The application uses three tables:

- **lottery_draws**: Stores draw information (date, endpoint, draw ID)
- **prizes**: Stores all prize numbers and their categories
- **running_numbers**: Stores running numbers (front 3, back 3, back 2)

## Features

✅ Web scraping from Sanook lottery results  
✅ MySQL database storage for lottery results  
✅ Automatic duplicate detection (updates existing draws)  
✅ Comprehensive ticket checking (full matches + partial matches)  
✅ RESTful API with Swagger documentation  
✅ TypeScript type safety  
✅ Transaction support for data integrity  

## Swagger Documentation

Visit `http://localhost:3000/swagger` to explore the API interactively.
