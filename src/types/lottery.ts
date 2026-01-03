// Lottery data types
export interface Prize {
  id: string
  name: string
  reward: string
  amount: number
  number: string[]
}

export interface RunningNumber {
  id: string
  name: string
  reward: string
  amount: number
  number: string[]
}

export interface LotteryData {
  date: string
  endpoint: string
  prizes: Prize[]
  runningNumbers: RunningNumber[]
}

// Lottery checking types
export interface PrizeMatch {
  prizeId: string
  prizeName: string
  reward: string
  matchedNumber: string
  matchType: 'full' | 'front3' | 'back3' | 'back2'
}

export interface CheckResult {
  ticketNumber: string
  isWinner: boolean
  matches: PrizeMatch[]
  totalReward: number
}

export interface CheckResponse {
  status: string
  response: {
    drawDate: string
    results: CheckResult[]
  }
}
