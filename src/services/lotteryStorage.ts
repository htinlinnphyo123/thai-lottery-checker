import { pool } from '../config/database'
import type { LotteryData } from '../types/lottery'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'

/**
 * Save lottery data to the database
 */
export const saveLotteryData = async (
  drawId: string,
  lotteryData: LotteryData
): Promise<boolean> => {
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    // Check if lottery draw already exists
    const [existingDraw] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM lottery_draws WHERE draw_id = ?',
      [drawId]
    )

    let lotteryDrawId: number

    if (existingDraw.length > 0) {
      // Update existing draw
      lotteryDrawId = existingDraw[0].id
      await connection.query(
        'UPDATE lottery_draws SET draw_date = ?, endpoint = ?, updated_at = NOW() WHERE id = ?',
        [lotteryData.date, lotteryData.endpoint, lotteryDrawId]
      )

      // Delete existing prizes and running numbers
      await connection.query('DELETE FROM prizes WHERE lottery_draw_id = ?', [
        lotteryDrawId,
      ])
      await connection.query(
        'DELETE FROM running_numbers WHERE lottery_draw_id = ?',
        [lotteryDrawId]
      )
    } else {
      // Insert new draw
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO lottery_draws (draw_id, draw_date, endpoint) VALUES (?, ?, ?)',
        [drawId, lotteryData.date, lotteryData.endpoint]
      )
      lotteryDrawId = result.insertId
    }

    // Insert prizes
    for (const prize of lotteryData.prizes) {
      for (const number of prize.number) {
        await connection.query(
          'INSERT INTO prizes (lottery_draw_id, prize_id, prize_name, reward, amount, number) VALUES (?, ?, ?, ?, ?, ?)',
          [
            lotteryDrawId,
            prize.id,
            prize.name,
            prize.reward,
            prize.amount,
            number,
          ]
        )
      }
    }

    // Insert running numbers
    for (const running of lotteryData.runningNumbers) {
      for (const number of running.number) {
        await connection.query(
          'INSERT INTO running_numbers (lottery_draw_id, running_id, running_name, reward, amount, number) VALUES (?, ?, ?, ?, ?, ?)',
          [
            lotteryDrawId,
            running.id,
            running.name,
            running.reward,
            running.amount,
            number,
          ]
        )
      }
    }

    await connection.commit()
    console.log(`✅ Lottery data saved successfully for draw: ${drawId}`)
    return true
  } catch (error) {
    await connection.rollback()
    console.error('❌ Error saving lottery data:', error)
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Get the latest lottery data from database
 */
export const getLatestLotteryFromDB = async (): Promise<LotteryData | null> => {
  const connection = await pool.getConnection()

  try {
    // Get latest lottery draw
    const [draws] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM lottery_draws ORDER BY created_at DESC LIMIT 1'
    )

    if (draws.length === 0) {
      return null
    }

    const draw = draws[0]
    const lotteryDrawId = draw.id

    // Get prizes
    const [prizesRows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM prizes WHERE lottery_draw_id = ? ORDER BY id',
      [lotteryDrawId]
    )

    // Get running numbers
    const [runningRows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM running_numbers WHERE lottery_draw_id = ? ORDER BY id',
      [lotteryDrawId]
    )

    // Group prizes by prize_id
    const prizesMap = new Map<string, any>()
    for (const row of prizesRows) {
      if (!prizesMap.has(row.prize_id)) {
        prizesMap.set(row.prize_id, {
          id: row.prize_id,
          name: row.prize_name,
          reward: row.reward,
          amount: row.amount,
          number: [],
        })
      }
      prizesMap.get(row.prize_id)!.number.push(row.number)
    }

    // Group running numbers by running_id
    const runningMap = new Map<string, any>()
    for (const row of runningRows) {
      if (!runningMap.has(row.running_id)) {
        runningMap.set(row.running_id, {
          id: row.running_id,
          name: row.running_name,
          reward: row.reward,
          amount: row.amount,
          number: [],
        })
      }
      runningMap.get(row.running_id)!.number.push(row.number)
    }

    return {
      date: draw.draw_date,
      endpoint: draw.endpoint,
      prizes: Array.from(prizesMap.values()),
      runningNumbers: Array.from(runningMap.values()),
    }
  } catch (error) {
    console.error('❌ Error fetching lottery data:', error)
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Get lottery data by draw ID
 */
export const getLotteryByDrawId = async (
  drawId: string
): Promise<LotteryData | null> => {
  const connection = await pool.getConnection()

  try {
    // Get lottery draw by draw_id
    const [draws] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM lottery_draws WHERE draw_id = ?',
      [drawId]
    )

    if (draws.length === 0) {
      return null
    }

    const draw = draws[0]
    const lotteryDrawId = draw.id

    // Get prizes
    const [prizesRows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM prizes WHERE lottery_draw_id = ? ORDER BY id',
      [lotteryDrawId]
    )

    // Get running numbers
    const [runningRows] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM running_numbers WHERE lottery_draw_id = ? ORDER BY id',
      [lotteryDrawId]
    )

    // Group prizes by prize_id
    const prizesMap = new Map<string, any>()
    for (const row of prizesRows) {
      if (!prizesMap.has(row.prize_id)) {
        prizesMap.set(row.prize_id, {
          id: row.prize_id,
          name: row.prize_name,
          reward: row.reward,
          amount: row.amount,
          number: [],
        })
      }
      prizesMap.get(row.prize_id)!.number.push(row.number)
    }

    // Group running numbers by running_id
    const runningMap = new Map<string, any>()
    for (const row of runningRows) {
      if (!runningMap.has(row.running_id)) {
        runningMap.set(row.running_id, {
          id: row.running_id,
          name: row.running_name,
          reward: row.reward,
          amount: row.amount,
          number: [],
        })
      }
      runningMap.get(row.running_id)!.number.push(row.number)
    }

    return {
      date: draw.draw_date,
      endpoint: draw.endpoint,
      prizes: Array.from(prizesMap.values()),
      runningNumbers: Array.from(runningMap.values()),
    }
  } catch (error) {
    console.error('❌ Error fetching lottery data:', error)
    throw error
  } finally {
    connection.release()
  }
}
