import assert from 'node:assert/strict'
import test from 'node:test'
import { hasPageFractures, maxDecayStage, shouldShowPageFractures } from '../src/utils.ts'

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
