# Thai Lottery Checker - Telegram Mini App

## Features Added

✅ **Beautiful HTML Lottery Checker Page**
- Modern gradient design with purple theme
- Auto-check when 6 digits are entered
- Thai language interface (ตรวจหวย)
- Telegram Mini App integration
- Responsive design for mobile
- Haptic feedback for Telegram users
- Animated results with winner/loser states

## How to Access

### Local Development
1. Make sure your dev server is running:
   ```bash
   bun run dev
   ```

2. Open in browser:
   ```
   http://localhost:3000/
   ```

### For Telegram Mini App

1. **Host the application** (you can use services like):
   - Vercel
   - Netlify
   - Railway
   - Your own server

2. **Create Telegram Bot** (if you haven't):
   ```
   Talk to @BotFather on Telegram
   /newbot
   Follow the instructions
   ```

3. **Set up Mini App**:
   ```
   Talk to @BotFather
   /newapp
   Select your bot
   Provide your hosted URL (e.g., https://yourdomain.com)
   Upload icon and description
   ```

4. **Access your Mini App**:
   - Users can open it from your bot's menu
   - Or share the direct link: `https://t.me/YourBotName/YourAppName`

## Page Features

### User Experience
1. **Input**: User types 6-digit lottery number
2. **Auto-check**: Automatically checks when 6 digits are entered
3. **Results Display**:
   - **Winner**: Shows confetti emoji, green gradient, prize details, total reward
   - **Loser**: Shows sad emoji, red gradient, encouragement message
4. **Check Another**: Button to check another number

### Technical Features
- **Telegram WebApp SDK**: Integrated for native Telegram features
- **Haptic Feedback**: Vibration feedback on success/error
- **Responsive Design**: Works on all mobile devices
- **Auto-focus**: Input field auto-focuses on load
- **Number-only Input**: Prevents non-numeric characters
- **Loading States**: Shows spinner while checking
- **Error Handling**: Displays user-friendly error messages

### API Integration
The page calls your `/check-lottery-ticket` endpoint:
```javascript
POST /check-lottery-ticket
Body: { "numbers": ["123456"] }
```

## File Structure

```
thai-lotto-api/
├── public/
│   └── index.html          # Lottery checker page
├── src/
│   ├── index.ts            # Main app with static file serving
│   ├── services/
│   │   ├── lotteryChecker.ts
│   │   └── lotteryStorage.ts
│   └── ...
└── ...
```

## Customization

### Change API URL
In `public/index.html`, line ~285:
```javascript
const API_URL = window.location.origin;
```

For production, you might want to set a specific URL:
```javascript
const API_URL = 'https://your-api-domain.com';
```

### Styling
The page uses CSS variables and gradients. Main colors:
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (darker purple)
- Success: `#4caf50` (green)
- Error: `#ff6b6b` (red)
- Gold: `#ffd700` (for total reward)

### Language
Currently in Thai. To add English or other languages, modify the text strings in the HTML.

## Testing

1. **Save lottery data first**:
   ```bash
   curl -X GET http://localhost:3000/save-latest-lottery
   ```

2. **Open the page**:
   ```
   http://localhost:3000/
   ```

3. **Test with known numbers** from the latest draw:
   - Enter: `837706` (should win 1st prize)
   - Enter: `837705` (should win near 1st prize)
   - Enter: `999999` (should not win)

## Deployment Tips

### Environment Variables
Make sure to set these in your hosting platform:
```env
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=thai_lottery
PORT=3000
```

### CORS
The API already has CORS enabled, so it will work from any domain.

### HTTPS Required
Telegram Mini Apps require HTTPS. Most hosting platforms provide this automatically.

## Screenshots Description

The page shows:
- **Header**: Purple gradient with "🎰 ตรวจหวย" title
- **Input Card**: White card with large number input (6 digits)
- **Check Button**: Purple gradient button
- **Winner Result**: Green gradient header with 🎉, prize list, golden total reward box
- **Loser Result**: Red gradient header with 😔, encouragement message
- **Draw Info**: Shows the draw date at bottom

Enjoy your Thai Lottery Checker Telegram Mini App! 🎰✨
