import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getPageFractureDelayMs,
  hasPageFractures,
  maxDecayStage,
  pageFractureEntryDelayMs,
  shouldShowPageFractures,
} from '../src/utils.ts'

test('page fractures only appear at the final decay stage', () => {
  for (let stage = 1; stage < maxDecayStage; stage += 1) {
    assert.equal(hasPageFractures(stage), false)
  }

  assert.equal(hasPageFractures(maxDecayStage), true)
})

test('repaired page fractures stay hidden without changing the decay stage', () => {
  assert.equal(shouldShowPageFractures(maxDecayStage, false), true)
  assert.equal(shouldShowPageFractures(maxDecayStage, true), false)
  assert.equal(shouldShowPageFractures(maxDecayStage - 1, true), false)
})

test('page fractures wait after entering the final decay stage', () => {
  const enteredAt = 1_000
  const now = enteredAt + 12_000

  assert.equal(
    getPageFractureDelayMs(now, enteredAt, 0, 120_000),
    pageFractureEntryDelayMs - 12_000,
  )
})

test('page fracture delay also respects the crack cooldown', () => {
  const enteredAt = 1_000
  const lastFractureAt = enteredAt + 20_000
  const now = lastFractureAt + 10_000

  assert.equal(
    getPageFractureDelayMs(now, enteredAt, lastFractureAt, 120_000),
    110_000,
  )
})
