import assert from 'node:assert/strict'
import test from 'node:test'
import {
  DEV_RESCUE_DELAY_MAX_MS,
  DEV_RESCUE_DELAY_MIN_MS,
  DEV_RESCUE_QUESTION_COUNT,
  devRescueQuestions,
  devRescueDelayMs,
  devRescueQuestionPool,
  getDevRescueQuestion,
  isDevRescueAvailable,
  nextDevRescueStep,
  recoveryScore,
  selectDevRescueQuestions,
} from '../src/decayRecovery.ts'
import { maxDecayStage, scoreForStage } from '../src/utils.ts'

test('human dev rescue only appears at the final decay stage', () => {
  for (let stage = 1; stage < maxDecayStage; stage += 1) {
    assert.equal(isDevRescueAvailable(stage), false)
  }

  assert.equal(isDevRescueAvailable(maxDecayStage), true)
})

test('human dev rescue requires three trivia answers', () => {
  assert.equal(devRescueQuestions.length, DEV_RESCUE_QUESTION_COUNT)
  assert.equal(new Set(devRescueQuestions.map((question) => question.id)).size, 3)

  devRescueQuestions.forEach((question) => {
    assert.equal(question.choices.length, 3)
    assert.ok(question.choices[question.answerIndex])
  })
})

test('human dev rescue draws three random questions from a 30-question pool', () => {
  assert.equal(devRescueQuestionPool.length, 30)
  assert.equal(new Set(devRescueQuestionPool.map((question) => question.id)).size, 30)

  const lowPick = selectDevRescueQuestions(() => 0)
  const highPick = selectDevRescueQuestions(() => 0.999)

  assert.equal(lowPick.length, DEV_RESCUE_QUESTION_COUNT)
  assert.equal(highPick.length, DEV_RESCUE_QUESTION_COUNT)
  assert.equal(new Set(lowPick.map((question) => question.id)).size, DEV_RESCUE_QUESTION_COUNT)
  assert.equal(new Set(highPick.map((question) => question.id)).size, DEV_RESCUE_QUESTION_COUNT)
  assert.notDeepEqual(
    lowPick.map((question) => question.id),
    highPick.map((question) => question.id),
  )
})

test('human dev rescue advances only on the correct answer for the selected run', () => {
  const selectedQuestions = selectDevRescueQuestions(() => 0.42)
  const firstAnswerIndex = getDevRescueQuestion(0, selectedQuestions).answerIndex
  const wrongAnswerIndex = firstAnswerIndex === 0 ? 1 : 0

  assert.deepEqual(nextDevRescueStep(0, wrongAnswerIndex, selectedQuestions), {
    step: 0,
    completed: false,
    correct: false,
  })
  assert.deepEqual(nextDevRescueStep(0, getDevRescueQuestion(0, selectedQuestions).answerIndex, selectedQuestions), {
    step: 1,
    completed: false,
    correct: true,
  })
  assert.deepEqual(nextDevRescueStep(2, getDevRescueQuestion(2, selectedQuestions).answerIndex, selectedQuestions), {
    step: 3,
    completed: true,
    correct: true,
  })
})

test('human dev rescue delay stays between 30 and 60 seconds', () => {
  assert.equal(devRescueDelayMs(() => 0), DEV_RESCUE_DELAY_MIN_MS)
  assert.equal(devRescueDelayMs(() => 0.999), 59_970)
  assert.equal(devRescueDelayMs(() => 1), DEV_RESCUE_DELAY_MAX_MS)
})

test('successful human dev rescue returns decay to phase one', () => {
  assert.equal(recoveryScore(), scoreForStage(1))
})
