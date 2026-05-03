import assert from 'node:assert/strict'
import test from 'node:test'
import { choosePageWarp, pageWarpModeClassNames, pageWarpModes } from '../src/pageWarp.ts'
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

  assert.deepEqual(pageWarpModeClassNames, {
    colorInverted: 'is-color-inverted',
    upsideDown: 'is-upside-down',
    zeroGravity: 'is-zero-gravity',
    melt: 'is-melt-mode',
    mirror: 'is-mirror-mode',
    duplicateEcho: 'is-duplicate-echo-mode',
    fontInfection: 'is-font-infection-mode',
    jelly: 'is-jelly-mode',
    translationFailure: 'is-translation-failure-mode',
    looseScrews: 'is-loose-screws-mode',
    notFoundBleed: 'is-404-bleed-mode',
    autofillHallucination: 'is-autofill-hallucination-mode',
  })
})

test('page warp can stack newly added deep modes', () => {
  assert.deepEqual(choosePageWarp(maxDecayStage, seededRandom([0.01, 0.94, 0.67, 0.82, 0.95])), {
    modes: ['translationFailure', 'notFoundBleed', 'autofillHallucination'],
  })
})
