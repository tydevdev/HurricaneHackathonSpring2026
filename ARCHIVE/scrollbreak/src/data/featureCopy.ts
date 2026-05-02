export type FeatureCopyItem = {
  id: string
  label: string
  copy: string
}

export type EmptyStateCopy = FeatureCopyItem & {
  actionLabel: string
}

export const featureHeaders: FeatureCopyItem[] = [
  {
    id: 'daily-missions',
    label: 'Daily missions',
    copy: 'Small real-world exits from the feed.',
  },
  {
    id: 'mode-presets',
    label: 'Modes',
    copy: 'Pick the shape of the scroll before it picks you.',
  },
  {
    id: 'achievements',
    label: 'Badges',
    copy: 'Proof that stopping can become a skill.',
  },
  {
    id: 'reflections',
    label: 'Reflections',
    copy: 'One honest question before the next thing.',
  },
  {
    id: 'offline-quests',
    label: 'Offline quests',
    copy: 'Tiny side missions for the room you are actually in.',
  },
]

export const modePickerCopy: FeatureCopyItem[] = [
  {
    id: 'energy-low',
    label: 'Low battery',
    copy: 'Use Soft Reset or Night Landing.',
  },
  {
    id: 'energy-scattered',
    label: 'Scattered',
    copy: 'Use Focus Lock and write one next action.',
  },
  {
    id: 'energy-bored',
    label: 'Bored',
    copy: 'Use Spark Run and make something small.',
  },
  {
    id: 'energy-curious',
    label: 'Curious',
    copy: 'Use Morning Primer and leave with one keeper.',
  },
]

export const completionCopy: FeatureCopyItem[] = [
  {
    id: 'finish-soft',
    label: 'That is enough feed.',
    copy: 'Leave while your brain still believes you.',
  },
  {
    id: 'finish-active',
    label: 'Cash it out.',
    copy: 'Turn one thing you saw into one thing you do.',
  },
  {
    id: 'finish-proud',
    label: 'Good exit.',
    copy: 'Stopping on purpose counts.',
  },
  {
    id: 'finish-night',
    label: 'Land the plane.',
    copy: 'One reflection, then lights down.',
  },
]

export const emptyStateCopy: EmptyStateCopy[] = [
  {
    id: 'no-missions',
    label: 'No missions loaded',
    copy: 'The feed can still end cleanly. Pick one tiny offline move.',
    actionLabel: 'Choose a quest',
  },
  {
    id: 'no-achievements',
    label: 'No badges yet',
    copy: 'The first one usually appears when you stop before you have to.',
    actionLabel: 'Start a mode',
  },
  {
    id: 'no-reflections',
    label: 'No reflection saved',
    copy: 'A single honest sentence is plenty.',
    actionLabel: 'Answer one',
  },
]

export const notificationCopy: FeatureCopyItem[] = [
  {
    id: 'nudge-tabs',
    label: 'Three tabs are enough',
    copy: 'Close a few loops before opening new ones.',
  },
  {
    id: 'nudge-walk',
    label: 'Pocket walk?',
    copy: 'Seven minutes outside beats seven more minutes of almost-done scrolling.',
  },
  {
    id: 'nudge-reflect',
    label: 'Keep one thing',
    copy: 'What is worth remembering from this scroll?',
  },
  {
    id: 'nudge-stop',
    label: 'Exit ramp available',
    copy: 'You reached the useful part. The rest is gravity.',
  },
]
