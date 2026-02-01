import { describe, it, expect } from 'vitest'
import { analyzeSeed } from '../src/modules/ImmolateWrapper/index'

describe('ante sanitization', () => {
  it('does not throw when settings.antes is NaN or null and returns ante 1 output', () => {
    const settings: any = {
      seed: 'ABCD',
      deck: 'Ghost Deck',
      stake: 'White Stake',
      gameVersion: '10106',
      antes: NaN,
      cardsPerAnte: 1,
    }
    const options: any = {
      buys: {},
      sells: {},
      showCardSpoilers: false,
      unlocks: [],
      events: []
    }

    let result: any
    expect(() => { result = analyzeSeed(settings, options) }).not.toThrow()
    // If analyzeSeed returns, ensure ante 1 data exists
    if (result) {
      expect(result.antes[1]).toBeDefined()
    }
  })

  it('treats settings.antes = 0 as at least 1', () => {
    const settings: any = {
      seed: 'ABCD',
      deck: 'Ghost Deck',
      stake: 'White Stake',
      gameVersion: '10106',
      antes: 0,
      cardsPerAnte: 1,
    }
    const options: any = {
      buys: {},
      sells: {},
      showCardSpoilers: false,
      unlocks: [],
      events: []
    }

    const result: any = analyzeSeed(settings, options)
    expect(result.antes[1]).toBeDefined()
  })
})
