import assert from 'node:assert/strict'
import test from 'node:test'
import { choosePageWarp, pageWarpModes } from '../src/pageWarp.ts'
import { maxDecayStage } from '../src/utils.ts'

function seededRandom(values: number[]) {
  let index = 0
  return () => {
    const value = values[index]
    index += 1
    return value ?? 1
  }
}

test('page warp is disabled before stage 3', () => {
  assert.equal(choosePageWarp(maxDecayStage - 3, seededRandom([0.01])), null)
})

test('page warp event odds scale by decay stage', () => {
  const stageThree = maxDecayStage - 2
  const stageFour = maxDecayStage - 1

  assert.equal(choosePageWarp(stageThree, seededRandom([0.2])), null)
  assert.equal(choosePageWarp(stageFour, seededRandom([0.3])), null)
  assert.equal(choosePageWarp(maxDecayStage, seededRandom([0.4])), null)
  assert.deepEqual(choosePageWarp(stageThree, seededRandom([0.19, 0.71, 0])), {
    modes: ['colorInverted'],
  })
  assert.deepEqual(choosePageWarp(stageFour, seededRandom([0.29, 0.71, 0])), {
    modes: ['colorInverted'],
  })
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.39, 0.71, 0])), {
    modes: ['colorInverted'],
  })
})

test('page warp stacking is uncommon but can choose up to three modes', () => {
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.01, 0.71, 0])), {
    modes: ['colorInverted'],
  })
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.01, 0.72, 0, 0])), {
    modes: ['colorInverted', 'upsideDown'],
  })
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.01, 0.94, 0, 0, 0])), {
    modes: ['colorInverted', 'upsideDown', 'zeroGravity'],
  })
})

test('page warp exposes all implemented modes', () => {
  assert.deepEqual(pageWarpModes, [
    'colorInverted',
    'upsideDown',
    'zeroGravity',
    'melt',
    'mirror',
    'duplicateEcho',
    'fontInfection',
    'jelly',
    'translationFailure',
    'looseScrews',
    'notFoundBleed',
    'autofillHallucination',
  ])
})
