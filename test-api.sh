#!/bin/bash

# Thai Lottery API Test Script

echo "🧪 Testing Thai Lottery Checker API"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Test 1: Check if server is running
echo "1️⃣  Testing server connection..."
if curl -s "${BASE_URL}/ping" > /dev/null; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server is not running. Please start with: bun run dev${NC}"
    exit 1
fi
echo ""

# Test 2: Save latest lottery data
echo "2️⃣  Saving latest lottery data to database..."
SAVE_RESPONSE=$(curl -s -X POST "${BASE_URL}/save-latest-lottery")
echo "$SAVE_RESPONSE" | jq '.'

if echo "$SAVE_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Lottery data saved successfully${NC}"
    DRAW_DATE=$(echo "$SAVE_RESPONSE" | jq -r '.response.drawDate')
    echo -e "  Draw Date: ${YELLOW}${DRAW_DATE}${NC}"
else
    echo -e "${YELLOW}⚠ Could not save lottery data (might be incomplete or already saved)${NC}"
fi
echo ""

# Test 3: Check lottery tickets
echo "3️⃣  Checking lottery tickets..."
CHECK_RESPONSE=$(curl -s -X POST "${BASE_URL}/check-lottery-ticket" \
    -H "Content-Type: application/json" \
    -d '{
        "numbers": ["837706", "837705", "104358", "999999"]
    }')

echo "$CHECK_RESPONSE" | jq '.'

if echo "$CHECK_RESPONSE" | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Ticket checking successful${NC}"
    
    # Count winners
    WINNERS=$(echo "$CHECK_RESPONSE" | jq '[.response.results[] | select(.isWinner == true)] | length')
    TOTAL=$(echo "$CHECK_RESPONSE" | jq '.response.results | length')
    
    echo -e "  Winners: ${GREEN}${WINNERS}${NC} out of ${TOTAL} tickets"
    
    # Show each result
    echo "$CHECK_RESPONSE" | jq -r '.response.results[] | 
        "  Ticket: \(.ticketNumber) - " + 
        (if .isWinner then "🎉 WINNER! Total: \(.totalReward) baht" else "❌ No win" end)'
else
    echo -e "${RED}✗ Ticket checking failed${NC}"
    echo -e "${YELLOW}Make sure you have saved lottery data first${NC}"
fi
echo ""

echo "===================================="
echo "✅ Testing complete!"
echo ""
echo "📚 View API documentation at: ${BASE_URL}/swagger"
