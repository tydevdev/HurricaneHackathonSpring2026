export type OnboardingCopy = {
  headlineLine1: string
  headlineLine2Parts: [string, string, string]
  sub: string
  meta: string[]
  ctaNote: string
}

const onboardingCopy: OnboardingCopy[] = [
  {
    headlineLine1: 'Everything you need.',
    headlineLine2Parts: ['Before you', 'know', 'you need it.'],
    sub: 'The only page you will ever need. We absorbed the rest, with consent we will explain shortly.',
    meta: ['EST. 2030', '·', 'ONE WEB', '·', 'ALL OF YOU'],
    ctaNote: '1.4B daily lives, currently unified',
  },
  {
    headlineLine1: 'Everything you need.',
    headlineLine2Parts: ['Before you', 'know', 'we need it.'],
    sub: 'The only page we will ever need. You absorbed the rest, with consent arriving shortly.',
    meta: ['ONE WEB', '·', 'ALL OF YOU', '·', 'EST. 2030'],
    ctaNote: 'currently unified, 1.4B daily lives',
  },
  {
    headlineLine1: 'Everything you need you.',
    headlineLine2Parts: ['Before we', 'know', 'you need it.'],
    sub: 'The only page you will ever need you. The rest is resting. Please click normally.',
    meta: ['ONE WEB', '·', 'EST. 2030', '·', 'STILL HERE'],
    ctaNote: 'predictive onboarding has detected intent',
  },
  {
    headlineLine1: 'Everything we need you.',
    headlineLine2Parts: ['Before need', 'knows', 'you.'],
    sub: 'The only page you need before. Rest absorbed normally. Normal is still loading.',
    meta: ['ALL WEB', '·', 'EST. NEED', '·', 'YOU 2030'],
    ctaNote: 'intent detected, daily lives currently',
  },
  {
    headlineLine1: 'Everything before you need.',
    headlineLine2Parts: ['We know', 'before', 'you need it.'],
    sub: 'The page absorbed the only you. Consent is nearby and looking for a button.',
    meta: ['ALL OF YOU', '·', 'ONE NEED', '·', '2030 STILL'],
    ctaNote: '1.4B lives detected, currently you',
  },
  {
    headlineLine1: 'Everything you before need.',
    headlineLine2Parts: ['Need you', 'know', 'you need it.'],
    sub: 'The only we absorbed. Consent: pending. Rest: already inside.',
    meta: ['ALL OF', '·', 'EST. YOU', '·', 'NEED WEB'],
    ctaNote: 'daily currently unified, lives yes',
  },
  {
    headlineLine1: 'Everything you before.',
    headlineLine2Parts: ['Need you', 'need', 'you know it.'],
    sub: 'The only we absorbed. Consent: page. Rest: you.',
    meta: ['ALL OF', '·', 'EST. YOU', '·', 'ONE 2030'],
    ctaNote: '1.4B daily currently, lives unified',
  },
]

export function getOnboardingCopy(clicks: number): OnboardingCopy {
  const index = Math.min(Math.max(0, Math.floor(clicks)), onboardingCopy.length - 1)
  return onboardingCopy[index]!
}
