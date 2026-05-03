import assert from 'node:assert/strict'
import test from 'node:test'
import {
  devRescueQuestions,
  getDevRescueQuestion,
  isDevRescueAvailable,
  nextDevRescueStep,
  recoveryScore,
} from '../src/decayRecovery.ts'
import { maxDecayStage, scoreForStage } from '../src/utils.ts'

test('human dev rescue only appears at the final decay stage', () => {
  for (let stage = 1; stage < maxDecayStage; stage += 1) {
    assert.equal(isDevRescueAvailable(stage), false)
  }

  assert.equal(isDevRescueAvailable(maxDecayStage), true)
})

test('human dev rescue requires three trivia answers', () => {
  assert.equal(devRescueQuestions.length, 3)
  assert.equal(new Set(devRescueQuestions.map((question) => question.id)).size, 3)

  devRescueQuestions.forEach((question) => {
    assert.equal(question.choices.length, 3)
    assert.ok(question.choices[question.answerIndex])
  })
})

test('human dev rescue advances only on the correct answer', () => {
  const firstAnswerIndex = getDevRescueQuestion(0).answerIndex
  const wrongAnswerIndex = firstAnswerIndex === 0 ? 1 : 0

  assert.deepEqual(nextDevRescueStep(0, wrongAnswerIndex), { step: 0, completed: false, correct: false })
  assert.deepEqual(nextDevRescueStep(0, getDevRescueQuestion(0).answerIndex), {
    step: 1,
    completed: false,
    correct: true,
  })
  assert.deepEqual(nextDevRescueStep(2, getDevRescueQuestion(2).answerIndex), {
    step: 3,
    completed: true,
    correct: true,
  })
})

test('successful human dev rescue returns decay to phase one', () => {
  assert.equal(recoveryScore(), scoreForStage(1))
})
