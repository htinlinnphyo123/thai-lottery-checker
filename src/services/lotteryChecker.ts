import type {
  LotteryData,
  CheckResult,
  PrizeMatch,
} from '../types/lottery'

/**
 * Check lottery tickets against lottery data
 */
export const checkTickets = (
  tickets: string[],
  lotteryData: LotteryData
): CheckResult[] => {
  const results: CheckResult[] = []

  for (const ticket of tickets) {
    const matches: PrizeMatch[] = []

    // Normalize ticket number (remove spaces, ensure 6 digits)
    const normalizedTicket = ticket.replace(/\s/g, '').padStart(6, '0')

    // Check against all prizes (full match)
    for (const prize of lotteryData.prizes) {
      for (const winningNumber of prize.number) {
        if (normalizedTicket === winningNumber) {
          matches.push({
            prizeId: prize.id,
            prizeName: prize.name,
            reward: prize.reward,
            matchedNumber: winningNumber,
            matchType: 'full',
          })
        }
      }
    }

    // Check against running numbers
    for (const running of lotteryData.runningNumbers) {
      for (const winningNumber of running.number) {
        let matchType: 'front3' | 'back3' | 'back2' | null = null

        // Front 3 digits
        if (
          running.id === 'runningNumberFrontThree' &&
          normalizedTicket.substring(0, 3) === winningNumber
        ) {
          matchType = 'front3'
        }

        // Back 3 digits
        if (
          running.id === 'runningNumberBackThree' &&
          normalizedTicket.substring(3, 6) === winningNumber
        ) {
          matchType = 'back3'
        }

        // Back 2 digits
        if (
          running.id === 'runningNumberBackTwo' &&
          normalizedTicket.substring(4, 6) === winningNumber
        ) {
          matchType = 'back2'
        }

        if (matchType) {
          matches.push({
            prizeId: running.id,
            prizeName: running.name,
            reward: running.reward,
            matchedNumber: winningNumber,
            matchType,
          })
        }
      }
    }

    // Calculate total reward
    const totalReward = matches.reduce(
      (sum, match) => sum + parseInt(match.reward),
      0
    )

    results.push({
      ticketNumber: normalizedTicket,
      isWinner: matches.length > 0,
      matches,
      totalReward,
    })
  }

  return results
}
