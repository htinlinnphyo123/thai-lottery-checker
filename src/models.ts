import { t, type UnwrapSchema } from 'elysia'

export const model = {
  'lotto.overview': t.Object(
    {
      status: t.String({
        default: 'success',
      }),
      response: t.Array(
        t.Object({
          id: t.String(),
          url: t.String(),
          date: t.String(),
        })
      ),
    },
    {
      description: 'Lottery Overview',
    }
  ),
  'lotto.detail': t.Object(
    {
      status: t.String({
        default: 'success',
      }),
      response: t.Object({
        date: t.String(),
        endpoint: t.String(),
        prizes: t.Array(
          t.Object({
            id: t.String(),
            name: t.String(),
            reward: t.String(),
            amount: t.Number(),
            number: t.Array(t.String()),
          })
        ),
        runningNumbers: t.Array(
          t.Object({
            id: t.String(),
            name: t.String(),
            reward: t.String(),
            amount: t.Number(),
            number: t.Array(t.String()),
          })
        ),
      }),
    },
    {
      description: 'Full Lottery Detail',
    }
  ),
  'api.error': t.Object(
    {
      status: t.String({
        default: 'crash',
      }),
      response: t.String({
        default: 'api cannot fulfill your request at this time',
      }),
    },
    {
      description: 'Default error when API is unable to process the request',
    }
  ),
  'lottery.check.request': t.Object(
    {
      numbers: t.Array(t.String(), {
        minItems: 1,
        description: 'Array of lottery ticket numbers to check',
      }),
    },
    {
      description: 'Request body for checking lottery tickets',
    }
  ),
  'lottery.check.response': t.Object(
    {
      status: t.String({
        default: 'success',
      }),
      response: t.Object({
        drawDate: t.String(),
        results: t.Array(
          t.Object({
            ticketNumber: t.String(),
            isWinner: t.Boolean(),
            matches: t.Array(
              t.Object({
                prizeId: t.String(),
                prizeName: t.String(),
                reward: t.String(),
                matchedNumber: t.String(),
                matchType: t.String(),
              })
            ),
            totalReward: t.Number(),
          })
        ),
      }),
    },
    {
      description: 'Response with lottery checking results',
    }
  ),
  'lottery.save.response': t.Object(
    {
      status: t.String(),
      response: t.Object({
        message: t.String(),
        drawId: t.String(),
        drawDate: t.String(),
      }),
    },
    {
      description: 'Response after saving lottery data',
    }
  ),
}

export interface Model {
  lotto: {
    overview: UnwrapSchema<typeof model['lotto.overview']>
    detail: UnwrapSchema<typeof model['lotto.detail']>
  }
  api: {
    error: UnwrapSchema<typeof model['api.error']>
  }
  lottery: {
    check: {
      request: UnwrapSchema<typeof model['lottery.check.request']>
      response: UnwrapSchema<typeof model['lottery.check.response']>
    }
    save: {
      response: UnwrapSchema<typeof model['lottery.save.response']>
    }
  }
}
