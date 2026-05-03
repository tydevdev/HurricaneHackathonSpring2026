import assert from 'node:assert/strict'
import test from 'node:test'
import { getOnboardingCopy } from '../src/onboardingCopy.ts'

test('onboarding headline gets weirder after every button click', () => {
  const stages = [0, 1, 2, 3, 4, 5, 6].map((clicks) => getOnboardingCopy(clicks))
  const headlines = stages.map((stage) => `${stage.headlineLine1} ${stage.headlineLine2Parts.join(' ')}`)

  assert.equal(new Set(headlines).size, stages.length)
  assert.match(headlines[0]!, /Everything you need\. Before you know you need it\./)
  assert.match(headlines[1]!, /Everything you need\. Before you know we need it\./)
  assert.match(headlines[2]!, /Everything you need you\. Before we know you need it\./)
  assert.match(headlines[3]!, /Everything we need you\. Before need knows you\./)
  assert.match(headlines[4]!, /Everything before you need\. We know before you need it\./)
  assert.match(headlines[5]!, /Everything you before need\. Need you know you need it\./)
  assert.match(headlines[6]!, /Everything you before\. Need you need you know it\./)
})

test('onboarding copy clamps after the last visible stage', () => {
  assert.deepEqual(getOnboardingCopy(99), getOnboardingCopy(6))
})
