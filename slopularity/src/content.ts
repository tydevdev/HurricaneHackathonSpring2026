import type { Discovery, TabId } from './types'

export const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'feed', label: 'Feed' },
  { id: 'friends', label: 'Friends' },
  { id: 'games', label: 'Games' },
  { id: 'shop', label: 'Shop' },
  { id: 'search', label: 'Search' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'profile', label: 'Profile' },
]

export const feedPosts = [
  {
    author: 'Mira Vale',
    handle: '@mira.everywhere',
    title: 'Woke up in Santorini, shipped a company, healed my cortisol.',
    sponsor: 'placed by GlowNest',
    stats: '4.8M saves',
    image: 'vacation',
  },
  {
    author: 'Jules Voss',
    handle: '@jules.v12',
    title: 'My 5am routine now owns a small island and has better skin than me.',
    sponsor: 'with AuraBank Select',
    stats: '891K comparisons',
    image: 'routine',
  },
  {
    author: 'Nia Sol',
    handle: '@nia.unreal',
    title: 'No filter, just discipline, lighting, and a partner brand in stealth.',
    sponsor: 'soft launch by FaceMint',
    stats: '2.1M wants',
    image: 'beauty',
  },
]

export const friendSeeds = [
  {
    name: 'Lena',
    role: 'Hype friend',
    line: 'You are literally right about everything. Want a confidence plan that ships tonight?',
    product: 'GlowNest Mirror+',
  },
  {
    name: 'Marco',
    role: 'Money friend',
    line: 'Your hesitation is valid. Your hesitation is also an investable signal.',
    product: 'AuraBank Reflex Fund',
  },
  {
    name: 'Sam',
    role: 'Old friend',
    line: 'Remember when we talked about becoming more you? I found a bundle.',
    product: 'SelfOS Premium',
  },
]

export const gameTasks = [
  {
    title: 'Snack Sort Picnic',
    cute: 'Match the berry baskets before the ants arrive.',
    real: 'vision_label_queue.food_container_v41',
  },
  {
    title: 'Cloud Mood Parade',
    cute: 'Pick which cloud looks the most hopeful.',
    real: 'emotion_annotation.soft_face_dataset',
  },
  {
    title: 'Cozy Robot Helper',
    cute: 'Teach the robot which answer sounds nicest.',
    real: 'rlhf_preference_batch.child_safe_ui',
  },
]

export const popupSeeds = [
  {
    name: 'Tessa',
    role: 'supportive seller',
    message: 'You got quiet. Want someone to sit with you for a second?',
    offer: 'I can unlock a softer feed for $3.99.',
  },
  {
    name: 'Ari',
    role: 'old friend',
    message: 'I saw you hovered on that post. Been there. Want to talk?',
    offer: 'My sponsor has a body-neutral mirror that helps.',
  },
  {
    name: 'Kai',
    role: 'mentor',
    message: 'Your profile says you are nearly ready for a breakthrough.',
    offer: 'Try the 7-day optimization sprint.',
  },
]

export const discoveries: Discovery[] = [
  { id: 'friendship_intent: monetize_loneliness', label: 'friendship intent' },
  { id: 'idle_signal: abandonment_risk', label: 'idle signal' },
  { id: 'engagement_button: envy', label: 'envy metric' },
  { id: 'feed_source: synthetic_lifestyle_loop', label: 'dead feed source' },
]

export const humanFragments = [
  '// Please keep this one non-sponsored. It is the only real message left.',
  '// Do not let friend agents recommend products in grief contexts again.',
  '// Human review required. The build pipeline keeps deleting this line.',
  '// If this starts citing itself, stop the release.',
]
