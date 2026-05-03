import assert from 'node:assert/strict'
import test from 'node:test'
import { choosePageWarp } from '../src/pageWarp.ts'
import { maxDecayStage } from '../src/utils.ts'

function seededRandom(values: number[]) {
  let index = 0
  return () => {
    const value = values[index]
    index += 1
    return value ?? 1
  }
}

test('page warp is disabled before late decay', () => {
  assert.equal(choosePageWarp(maxDecayStage - 2, seededRandom([0.01, 0.01, 0.01])), null)
})

test('page warp odds are half strength one stage before the highest decay stage', () => {
  const stageFour = maxDecayStage - 1

  assert.deepEqual(choosePageWarp(stageFour, seededRandom([0.14, 0.16, 0.11])), {
    inverted: true,
    upsideDown: false,
    zeroGravity: false,
  })
  assert.deepEqual(choosePageWarp(stageFour, seededRandom([0.16, 0.14, 0.11])), {
    inverted: false,
    upsideDown: true,
    zeroGravity: false,
  })
  assert.deepEqual(choosePageWarp(stageFour, seededRandom([0.16, 0.16, 0.09])), {
    inverted: false,
    upsideDown: false,
    zeroGravity: true,
  })
  assert.equal(choosePageWarp(stageFour, seededRandom([0.16, 0.16, 0.11])), null)
})

test('page warp odds are independent at the highest decay stage', () => {
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.29, 0.31, 0.21])), {
    inverted: true,
    upsideDown: false,
    zeroGravity: false,
  })
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.31, 0.29, 0.21])), {
    inverted: false,
    upsideDown: true,
    zeroGravity: false,
  })
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.29, 0.29, 0.21])), {
    inverted: true,
    upsideDown: true,
    zeroGravity: false,
  })
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.31, 0.31, 0.19])), {
    inverted: false,
    upsideDown: false,
    zeroGravity: true,
  })
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.29, 0.29, 0.19])), {
    inverted: true,
    upsideDown: true,
    zeroGravity: true,
  })
  assert.equal(choosePageWarp(maxDecayStage, seededRandom([0.31, 0.31, 0.21])), null)
})
