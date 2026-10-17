import { describe, expect, test } from 'bun:test'
import { byId, emphasis, inView, structures, tour, views } from '../src/anatomy'

describe('anatomy data', () => {
  test('has unique structure IDs and FMA concepts', () => {
    expect(new Set(structures.map((s) => s.id)).size).toBe(structures.length)
    expect(new Set(structures.map((s) => s.fma)).size).toBe(structures.length)
  })

  test('points every tour stop at a real structure inside its view', () => {
    for (const stop of tour) {
      expect(byId[stop.id]).toBeDefined()
      expect(inView(byId[stop.id], stop.view)).toBe(true)
    }
  })

  test('frames regional views on their own bones', () => {
    for (const { view } of views) expect(structures.some((s) => inView(s, view))).toBe(true)
    const hand = structures.filter((s) => inView(s, 'Right hand'))
    expect(hand).toHaveLength(27)
    expect(hand.every((s) => s.group === 'Right upper limb')).toBe(true)
    expect(inView(byId['right-sesamoid-bones-of-the-foot'], 'Right foot')).toBe(true)
    expect(inView(byId['right-femur'], 'Right foot')).toBe(false)
  })
})

describe('selection emphasis', () => {
  test('keeps every structure normal without a selection', () => {
    expect(structures.every((s) => emphasis(s.id, null) === 'normal')).toBe(true)
  })

  test('keeps the selection solid and ghosts everything else', () => {
    const states = structures.map((s) => emphasis(s.id, 'right-femur'))
    expect(states.filter((s) => s === 'selected')).toHaveLength(1)
    expect(emphasis('right-femur', 'right-femur')).toBe('selected')
    expect(emphasis('mandible', 'right-femur')).toBe('ghosted')
  })
})
