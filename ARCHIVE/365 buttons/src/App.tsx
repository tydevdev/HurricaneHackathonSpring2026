import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, Minus, Plus, RotateCcw } from 'lucide-react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import './App.css'

const DEFAULT_LIFE_FRAME = 85
const DAYS_IN_YEAR = 365
const WEEKS_IN_YEAR = 52
const MINUTES_IN_DAY = 1440

type DailyUse = {
  label: string
  hours: number
  tone: string
}

type TimeStats = {
  safeAge: number
  safeFrame: number
  livedDays: number
  livedWeeks: number
  remainingDays: number
  totalWeeks: number
  lifetimePercent: number
  yearPercent: number
  dayPercent: number
  years: { year: number; lived: boolean; current: boolean }[]
}

const baseDailyUses: DailyUse[] = [
  { label: 'sleep', hours: 8, tone: 'deep' },
  { label: 'work', hours: 7.5, tone: 'ink' },
  { label: 'care', hours: 2, tone: 'warm' },
  { label: 'movement', hours: 1, tone: 'green' },
  { label: 'phone', hours: 3, tone: 'cool' },
]

const today = new Date()
const startOfYear = new Date(today.getFullYear(), 0, 0)
const minutesToday = today.getHours() * 60 + today.getMinutes()
const dayOfYear = Math.min(
  DAYS_IN_YEAR,
  Math.floor((today.getTime() - startOfYear.getTime()) / 86_400_000),
)

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function App() {
  const [age, setAge] = useState(22)
  const [lifeFrame, setLifeFrame] = useState(DEFAULT_LIFE_FRAME)
  const [dailyPlan, setDailyPlan] = useState(baseDailyUses)
  const pageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  })

  useEffect(() => {
    function scrollToHash() {
      const hash = window.location.hash

      if (!hash) {
        return
      }

      window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ block: 'start' })
      }, 40)
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  const time = useMemo(() => {
    const safeFrame = clamp(lifeFrame || DEFAULT_LIFE_FRAME, 40, 120)
    const safeAge = clamp(age || 0, 0, safeFrame)
    const livedDays = safeAge * DAYS_IN_YEAR + dayOfYear
    const livedWeeks = Math.floor(livedDays / 7)
    const totalWeeks = safeFrame * WEEKS_IN_YEAR
    const remainingDays = Math.max(0, (safeFrame - safeAge) * DAYS_IN_YEAR)
    const lifetimePercent = clamp(
      ((safeAge + dayOfYear / DAYS_IN_YEAR) / safeFrame) * 100,
      0,
      100,
    )

    return {
      safeAge,
      safeFrame,
      livedDays,
      livedWeeks,
      remainingDays,
      totalWeeks,
      lifetimePercent,
      yearPercent: (dayOfYear / DAYS_IN_YEAR) * 100,
      dayPercent: (minutesToday / MINUTES_IN_DAY) * 100,
      years: Array.from({ length: safeFrame }, (_, index) => ({
        year: index + 1,
        lived: index < safeAge,
        current: index === safeAge,
      })),
    }
  }, [age, lifeFrame])

  return (
    <main className="page" ref={pageRef}>
      <motion.div className="scroll-line" style={{ scaleX: progress }} />
      <Hero age={age} setAge={setAge} time={time} scrollProgress={progress} />
      <ButtonYear time={time} />
      <HourglassSection time={time} scrollProgress={progress} />
      <WeeksSection time={time} />
      <YearOrbitSection time={time} />
      <MinutesSection time={time} />
      <DailySection dailyPlan={dailyPlan} setDailyPlan={setDailyPlan} />
      <RemainingSection
        age={age}
        setAge={setAge}
        lifeFrame={lifeFrame}
        setLifeFrame={setLifeFrame}
        time={time}
      />
    </main>
  )
}

function Hero({
  age,
  setAge,
  time,
  scrollProgress,
}: {
  age: number
  setAge: (age: number) => void
  time: TimeStats
  scrollProgress: MotionValue<number>
}) {
  const hourglassY = useTransform(scrollProgress, [0, 0.22], [0, -48])
  const sandScale = useTransform(scrollProgress, [0, 0.22], [1, 0.46])

  return (
    <section className="hero-section">
      <nav className="topbar" aria-label="Page sections">
        <a href="#buttons">365</a>
        <a href="#hourglass">sand</a>
        <a href="#weeks">weeks</a>
        <a href="#orbit">orbit</a>
        <a href="#minutes">minutes</a>
        <a href="#day">day</a>
        <a href="#left">left</a>
      </nav>

      <div className="hero-copy">
        <motion.p
          className="small-label"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          A time-awareness study
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.06 }}
        >
          365 Buttons
        </motion.h1>
        <motion.p
          className="hero-line"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.12 }}
        >
          See the shape of your days.
        </motion.p>

        <motion.form
          className="age-form"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 0.2 }}
          onSubmit={(event) => {
            event.preventDefault()
            document.querySelector('#buttons')?.scrollIntoView({
              behavior: 'smooth',
            })
          }}
        >
          <label htmlFor="age">Age</label>
          <input
            id="age"
            min="0"
            max="120"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(event) => setAge(Number(event.target.value))}
          />
          <button type="submit" aria-label="Scroll to the first visualization">
            <ArrowDown size={18} />
          </button>
        </motion.form>
      </div>

      <motion.div className="hero-visual" style={{ y: hourglassY }}>
        <div className="orbital-year" aria-hidden="true">
          <span>{today.getFullYear()}</span>
        </div>
        <div className="glass-large" aria-label="Animated hourglass">
          <div className="glass-bowl top">
            <motion.div
              className="sand-pile top-sand"
              style={{ scaleY: sandScale }}
            />
          </div>
          <div className="sand-thread" />
          <div className="glass-bowl bottom">
            <motion.div
              className="sand-pile bottom-sand"
              initial={{ scaleY: 0.45 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
        <div className="hero-readout">
          <strong>{time.lifetimePercent.toFixed(1)}%</strong>
          <span>of your frame marked</span>
        </div>
      </motion.div>
    </section>
  )
}

function ButtonYear({ time }: { time: TimeStats }) {
  const [selectedDay, setSelectedDay] = useState(dayOfYear)
  const days = Array.from({ length: DAYS_IN_YEAR }, (_, index) => index + 1)
  const selectedStatus =
    selectedDay < dayOfYear
      ? 'already spent'
      : selectedDay === dayOfYear
        ? 'today'
        : 'still ahead'

  return (
    <section className="buttons-section section-grid" id="buttons">
      <div className="section-copy">
        <span className="section-number">01</span>
        <h2>This year, as buttons.</h2>
        <p>
          Each button is one sunrise. The amber ones are already behind you.
        </p>
      </div>
      <div className="button-field-wrap">
        <div className="field-meta">
          <span>{dayOfYear} pressed</span>
          <span>{DAYS_IN_YEAR - dayOfYear} unpressed</span>
        </div>
        <div
          className="button-field"
          style={{ '--year-progress': `${time.yearPercent}%` } as CSSProperties}
          aria-label={`${dayOfYear} of 365 days have passed this year`}
        >
          {days.map((day) => (
            <button
              className={[
                'time-button',
                day <= dayOfYear ? 'is-filled' : '',
                day === selectedDay ? 'is-selected' : '',
              ].join(' ')}
              key={day}
              onClick={() => setSelectedDay(day)}
              type="button"
              title={`Day ${day}`}
              aria-label={`Day ${day}${day <= dayOfYear ? ' passed' : ' ahead'}`}
            />
          ))}
        </div>
        <div className="day-inspector" aria-live="polite">
          <span>Day {selectedDay}</span>
          <strong>{selectedStatus}</strong>
          <p>
            {selectedDay <= dayOfYear
              ? 'Name what it held. Then let it be complete.'
              : 'Leave a small claim on this one before it arrives.'}
          </p>
        </div>
      </div>
    </section>
  )
}

function HourglassSection({
  time,
  scrollProgress,
}: {
  time: TimeStats
  scrollProgress: MotionValue<number>
}) {
  const fillHeight = useTransform(
    scrollProgress,
    [0.18, 0.54],
    [`${100 - time.lifetimePercent}%`, `${Math.max(10, 100 - time.lifetimePercent - 22)}%`],
  )

  return (
    <section className="hourglass-section" id="hourglass">
      <div className="sticky-hourglass">
        <div className="section-copy">
          <span className="section-number">02</span>
          <h2>The sand is not the warning. It is the invitation.</h2>
          <p>
            At {time.safeAge}, roughly {formatNumber(time.livedDays)} days have
            passed. The point is not panic. The point is contact.
          </p>
        </div>
        <div className="deep-glass" aria-label="Lifetime hourglass">
          <motion.div className="remaining-sand" style={{ height: fillHeight }} />
          <div className="falling-grains" />
          <div className="held-sand" />
        </div>
      </div>
    </section>
  )
}

function WeeksSection({ time }: { time: TimeStats }) {
  const [focusYear, setFocusYear] = useState(time.safeAge)
  const weeks = Array.from({ length: time.totalWeeks }, (_, index) => {
    const year = Math.floor(index / WEEKS_IN_YEAR) + 1
    const week = (index % WEEKS_IN_YEAR) + 1

    return {
      id: index,
      year,
      week,
      lived: index < time.livedWeeks,
      current: index === time.livedWeeks,
      focused: year === focusYear,
    }
  })

  return (
    <section className="weeks-section section-grid" id="weeks">
      <div className="section-copy">
        <span className="section-number">03</span>
        <h2>Your life, counted in weeks.</h2>
        <p>
          A week is small enough to waste and large enough to redirect. Hover the
          field. Pull a year into focus.
        </p>
        <label className="year-focus">
          <span>Focus year</span>
          <input
            type="range"
            min="1"
            max={time.safeFrame}
            value={focusYear}
            onChange={(event) => setFocusYear(Number(event.target.value))}
          />
          <strong>{focusYear}</strong>
        </label>
      </div>
      <div className="weeks-wrap">
        <div className="weeks-meta">
          <span>{formatNumber(time.livedWeeks)} weeks lived</span>
          <span>{formatNumber(Math.max(0, time.totalWeeks - time.livedWeeks))} ahead</span>
        </div>
        <div className="weeks-field" aria-label={`${time.totalWeeks} week field`}>
          {weeks.map((item) => (
            <span
              className={[
                'week-cell',
                item.lived ? 'is-lived' : '',
                item.current ? 'is-current' : '',
                item.focused ? 'is-focused' : '',
              ].join(' ')}
              key={item.id}
              title={`Year ${item.year}, week ${item.week}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function YearOrbitSection({ time }: { time: TimeStats }) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const currentMonth = today.getMonth()

  return (
    <section className="orbit-section section-grid" id="orbit">
      <div className="section-copy">
        <span className="section-number">04</span>
        <h2>The year has a weather of its own.</h2>
        <p>
          The orbit is not a countdown. It is a return path, with one bright
          point moving through it.
        </p>
      </div>
      <div className="orbit-visual">
        <div
          className="orbit-ring"
          style={
            {
              '--year-progress': `${time.yearPercent}%`,
              '--progress-angle': `${time.yearPercent * 3.6}deg`,
              '--dot-angle': `${time.yearPercent * 3.6 - 90}deg`,
            } as CSSProperties
          }
          aria-label={`${dayOfYear} days through the year`}
        >
          {months.map((month, index) => (
            <span
              className={index === currentMonth ? 'month-mark is-current' : 'month-mark'}
              key={month}
              style={{ '--i': index } as CSSProperties}
            >
              {month}
            </span>
          ))}
          <strong>{dayOfYear}</strong>
          <small>of 365</small>
        </div>
        <div className="season-lines" aria-hidden="true">
          <span>winter</span>
          <span>spring</span>
          <span>summer</span>
          <span>fall</span>
        </div>
      </div>
    </section>
  )
}

function MinutesSection({ time }: { time: TimeStats }) {
  const [scale, setScale] = useState<'quiet' | 'full'>('quiet')
  const minuteCount = scale === 'quiet' ? 240 : MINUTES_IN_DAY
  const elapsedUnits =
    scale === 'quiet'
      ? Math.floor((minutesToday / MINUTES_IN_DAY) * minuteCount)
      : minutesToday
  const minutes = Array.from({ length: minuteCount }, (_, index) => index)

  return (
    <section className="minutes-section section-grid" id="minutes">
      <div className="section-copy">
        <span className="section-number">05</span>
        <h2>Today is 1,440 small doors.</h2>
        <p>
          The line is already {time.dayPercent.toFixed(1)}% through. Change the
          density and the day changes texture.
        </p>
        <div className="density-toggle" aria-label="Minute density">
          <button
            className={scale === 'quiet' ? 'is-active' : ''}
            type="button"
            onClick={() => setScale('quiet')}
          >
            quiet
          </button>
          <button
            className={scale === 'full' ? 'is-active' : ''}
            type="button"
            onClick={() => setScale('full')}
          >
            1,440
          </button>
        </div>
      </div>
      <div className={`minute-field ${scale}`}>
        {minutes.map((minute) => (
          <span
            className={minute < elapsedUnits ? 'minute-dot is-lived' : 'minute-dot'}
            key={minute}
          />
        ))}
      </div>
    </section>
  )
}

function DailySection({
  dailyPlan,
  setDailyPlan,
}: {
  dailyPlan: DailyUse[]
  setDailyPlan: (plan: DailyUse[]) => void
}) {
  const assignedHours = dailyPlan.reduce((sum, item) => sum + item.hours, 0)
  const openHours = clamp(24 - assignedHours, 0, 24)
  const dailyUses = [...dailyPlan, { label: 'open', hours: openHours, tone: 'gold' }]

  function adjustHours(label: string, direction: 1 | -1) {
    setDailyPlan(
      dailyPlan.map((item) =>
        item.label === label
          ? { ...item, hours: clamp(item.hours + direction * 0.5, 0, 14) }
          : item,
      ),
    )
  }

  return (
    <section className="daily-section section-grid" id="day">
      <div className="section-copy">
        <span className="section-number">06</span>
        <h2>A normal day, unfolded.</h2>
        <p>
          Twenty-four hours becomes less abstract when the pieces sit next to
          each other.
        </p>
        <div className="time-balance">
          <strong>{openHours.toFixed(1)}h</strong>
          <span>unclaimed</span>
        </div>
      </div>
      <div className="daily-visual">
        <div className="daily-streams">
          {dailyUses.map((item, index) => (
            <motion.div
              className={`stream ${item.tone}`}
              key={item.label}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.8, delay: index * 0.07, ease: 'easeOut' }}
              style={
                {
                  '--hours': item.hours,
                  transformOrigin: 'left',
                } as CSSProperties
              }
            >
              <span>{item.label}</span>
              <strong>{item.hours}h</strong>
            </motion.div>
          ))}
        </div>
        <div className="daily-controls" aria-label="Adjust daily hours">
          {dailyPlan.map((item) => (
            <div className="daily-control" key={item.label}>
              <span>{item.label}</span>
              <div>
                <button
                  type="button"
                  aria-label={`Decrease ${item.label}`}
                  onClick={() => adjustHours(item.label, -1)}
                >
                  <Minus size={15} />
                </button>
                <strong>{item.hours}h</strong>
                <button
                  type="button"
                  aria-label={`Increase ${item.label}`}
                  onClick={() => adjustHours(item.label, 1)}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="day-clock" aria-hidden="true">
          <small>24h</small>
        </div>
      </div>
    </section>
  )
}

function RemainingSection({
  age,
  setAge,
  lifeFrame,
  setLifeFrame,
  time,
}: {
  age: number
  setAge: (age: number) => void
  lifeFrame: number
  setLifeFrame: (lifeFrame: number) => void
  time: TimeStats
}) {
  return (
    <section className="remaining-section" id="left">
      <div className="remaining-copy">
        <span className="section-number">07</span>
        <h2>{formatNumber(time.remainingDays)} days left in this frame.</h2>
        <p>
          Use the number as a lens, not a verdict. Come back tomorrow and press
          one button with care.
        </p>
      </div>
      <div className="life-marks" aria-label={`${time.safeFrame} year span`}>
        {time.years.map((year) => (
          <span
            className={[
              'year-mark',
              year.lived ? 'is-lived' : '',
              year.current ? 'is-current' : '',
            ].join(' ')}
            key={year.year}
            title={`Year ${year.year}`}
          />
        ))}
      </div>
      <div className="frame-controls" aria-label="Adjust lifetime frame">
        <label>
          <span>Age</span>
          <input
            type="range"
            min="0"
            max="120"
            value={age}
            onChange={(event) => setAge(Number(event.target.value))}
          />
          <strong>{age}</strong>
        </label>
        <label>
          <span>Frame</span>
          <input
            type="range"
            min="40"
            max="120"
            value={lifeFrame}
            onChange={(event) => setLifeFrame(Number(event.target.value))}
          />
          <strong>{lifeFrame}</strong>
        </label>
      </div>
      <div className="closing-actions">
        <button
          type="button"
          onClick={() => setAge(clamp(age - 1, 0, 120))}
        >
          <RotateCcw size={17} />
          Rewind one year
        </button>
        <a href="#buttons">Begin again tomorrow</a>
      </div>
    </section>
  )
}

export default App
