import type { Week, DaySession, SessionTask, TimerConfig } from './types'

// Task ids below are placeholders — day() overwrites them with stable, position-based ids
// (t0, t1, ...) once a day's task list is assembled. That way editing one day's tasks later
// can only ever affect that day's own ids, never shift ids in other days/weeks and silently
// orphan completions already saved in Supabase.
const PLACEHOLDER_ID = '_'

const warmup = (): SessionTask => ({
  id: PLACEHOLDER_ID,
  label: 'Warm-up',
  description: 'Jump rope or jog in place (3 min) → arm/hip circles, leg swings, neck rolls → 2 min loose shadowboxing.',
  solo: { workSec: 8 * 60, restSec: 0, rounds: 1, label: 'Warm-up' },
})

const cooldown = (): SessionTask => ({
  id: PLACEHOLDER_ID,
  label: 'Cooldown',
  description: 'Static stretch — hamstrings, hips, shoulders, calves — then 1–2 min of slow breathing.',
  solo: { workSec: 8 * 60, restSec: 0, rounds: 1, label: 'Cooldown' },
})

const conditioningCircuit = (): SessionTask => ({
  id: PLACEHOLDER_ID,
  label: 'Conditioning circuit',
  description: 'Squats, push-ups, mountain climbers, plank hold, jumping jacks, glute bridges — 3 rounds through, 30s on / 15s off. Do it side by side.',
  solo: { workSec: 30, restSec: 15, rounds: 18, label: 'Circuit' },
})

interface TechniqueOpts {
  soloDesc?: string
  teamDesc?: string
  solo?: Partial<TimerConfig>
  team?: Partial<TimerConfig>
  noSolo?: boolean
  noTeam?: boolean
}

function technique(label: string, description: string, opts: TechniqueOpts = {}): SessionTask {
  const solo: TimerConfig = {
    workSec: 45,
    restSec: 15,
    rounds: 3,
    label: opts.soloDesc ?? 'Solo reps — shadow the movement, focus on form',
    ...opts.solo,
  }
  const team: TimerConfig = {
    workSec: 60,
    restSec: 20,
    rounds: 2,
    label: opts.teamDesc ?? 'Partner drill — you each get equal turns performing and checking form',
    turnBased: true,
    roles: ['performing the movement', "checking your partner's form"],
    ...opts.team,
  }
  return {
    id: PLACEHOLDER_ID,
    label,
    description,
    solo: opts.noSolo ? undefined : solo,
    team: opts.noTeam ? undefined : team,
  }
}

function padDrill(label: string, description: string, calls: string, opts: TechniqueOpts = {}): SessionTask {
  return {
    id: PLACEHOLDER_ID,
    label,
    description,
    solo: {
      workSec: 2 * 60,
      restSec: 60,
      rounds: 3,
      label: `Shadow version, solo — throw ${calls} at the air, ${opts.solo?.rounds ?? 3} x 2min rounds`,
      ...opts.solo,
    },
    team: {
      workSec: 2 * 60,
      restSec: 60,
      rounds: 3,
      label: `Pads — holder calls ${calls}. You each get ${opts.team?.rounds ?? 3} rounds striking.`,
      turnBased: true,
      roles: ['striking the pads', 'holding pads & calling the combo'],
      ...opts.team,
    },
  }
}

function liveSparring(label: string, description: string, teamCfg: TimerConfig): SessionTask {
  return { id: PLACEHOLDER_ID, label, description, team: teamCfg }
}

function day(dayNumber: number, type: DaySession['type'], title: string, tasks: SessionTask[], opts: { circuit?: boolean } = {}): DaySession {
  const body = opts.circuit ? [...tasks, conditioningCircuit()] : tasks
  const allTasks = [warmup(), ...body, cooldown()].map((t, i) => ({ ...t, id: `t${i}` }))
  return { id: `day-${dayNumber}`, dayNumber, type, title, tasks: allTasks }
}

const restDay: DaySession = {
  id: 'rest',
  dayNumber: 3,
  type: 'rest',
  title: 'Rest / Mobility',
  tasks: [
    {
      id: 'rest-1',
      label: 'Rest or light mobility',
      description: 'A 10 min walk plus full-body static stretch, or take the day fully off. Recovery is part of the program.',
      solo: { workSec: 10 * 60, restSec: 0, rounds: 1, label: 'Walk + stretch' },
    },
  ],
}

const optionalDay: DaySession = {
  id: 'optional',
  dayNumber: 6,
  type: 'optional',
  title: 'Optional light day',
  tasks: [
    {
      id: 'opt-1',
      label: 'Easy cardio + stretch',
      description: 'An easy walk or jog, nothing strenuous, followed by a full stretch. Skip this if you\'re feeling beat up.',
      solo: { workSec: 15 * 60, restSec: 0, rounds: 1, label: 'Easy cardio' },
    },
  ],
}

const fullRest: DaySession = {
  id: 'full-rest',
  dayNumber: 7,
  type: 'rest',
  title: 'Full Rest',
  tasks: [{ id: 'full-rest-1', label: 'Full rest day', description: 'No training — let your body recover fully before the next week.' }],
}

function week(weekNumber: number, phase: 1 | 2 | 3, phaseTitle: string, days: DaySession[]): Week {
  return { weekNumber, phase, phaseTitle, days: [...days, optionalDay, fullRest] }
}

const P1 = 'Phase 1 — Foundations'
const P2 = 'Phase 2 — Combinations & Positional Control'
const P3 = 'Phase 3 — Live Application'

export const PROGRAM: Week[] = [
  week(1, 1, P1, [
    day(1, 'striking', 'Stance, Guard, Footwork, Jab', [
      technique('Orthodox/southpaw stance, guard position', 'Feet shoulder-width, lead foot forward, hands up guarding your chin, elbows tucked to protect your ribs. This is home base for everything else.'),
      technique('Footwork: step-drag', 'Step forward with your lead foot, drag the rear foot to follow — never let your feet cross. Keeps you balanced and ready to strike or defend.'),
      technique('The jab', 'Straight lead-hand punch, snap it out and back quickly, rotate your fist on impact. Your fastest, safest strike — used to measure distance and set up everything else.'),
      padDrill('Pad drill: jab reps', 'Holder calls "1" (jab) — striker reacts on the call.', '"1" (jab)'),
    ]),
    day(2, 'wrestling', 'Wrestling Stance & Shot', [
      technique('Athletic/wrestling stance', 'Knees bent, hips low, chest up, weight balanced on the balls of your feet — like a mini squat. Lets you shoot or sprawl instantly.'),
      technique('Penetration step (shooting motion)', 'Drop level, drive off your back leg, step deep between the (imaginary) opponent\'s legs. No contact yet — just groove the motion.', { noTeam: true }),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Breakfalls', [
      technique(
        'Breakfalls — priority skill',
        'Learn to fall backward, sideways, and forward without injury before anything else on the ground. Slap the mat with your arm as you land to absorb impact, keep your chin tucked. Do this slowly on a mat or carpeted floor.',
        { soloDesc: 'Solo falls — backward, sideways, forward, slow and controlled', teamDesc: 'Take turns falling while your partner watches and corrects your form' },
      ),
    ]),
    day(5, 'integration', 'Light Flow', [
      technique('Shadow flow: stance → jab → sprawl → stand back up', 'Chain this week\'s pieces together at a cooperative, unhurried pace. No live sparring yet — the goal is smooth transitions.'),
    ], { circuit: true }),
  ]),
  week(2, 1, P1, [
    day(1, 'striking', 'Jab-Cross, Head Movement', [
      technique('Jab–cross', 'Jab with the lead hand, immediately follow with a straight rear-hand cross, rotating your hips and rear foot into it.'),
      technique('Head movement: slip left/right', 'Bend at the knees and waist to move your head just off the centerline, then return to guard. Practice slipping an imaginary jab.'),
      padDrill('Pad drill: jab-cross', 'Holder calls "1"/"2" combos — striker reacts.', '"1"/"2" combos'),
    ]),
    day(2, 'wrestling', 'Sprawl', [
      technique('Sprawl (defending a shot)', 'Kick your legs back and drop your hips as the opponent shoots, sprawling your weight onto their upper back.', { soloDesc: 'Solo reps — sprawl against an imaginary shot', teamDesc: 'Partner shoots lightly, you sprawl to defend — swap roles each round' }),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Guard & Hip Escape', [
      technique('Guard position', 'On your back, legs wrapped around your partner\'s hips or hooked — this is your main defensive position on the bottom.'),
      technique('Hip escape (shrimping)', 'Push off with your feet to slide your hips away and create space — the core movement for almost every ground escape.'),
    ]),
    day(5, 'integration', 'Light Flow', [
      technique('Shadow flow: stance → jab-cross → sprawl → stand back up', 'Chain this week\'s pieces together, cooperative pace only.'),
    ], { circuit: true }),
  ]),
  week(3, 1, P1, [
    day(1, 'striking', 'Jab-Cross-Hook, Low Kick Check', [
      technique('Jab–cross–hook', 'Add a lead-hand hook after the cross — pivot your lead foot and rotate your hip into a horizontal punch.'),
      technique('Checking a low kick', 'Lift your lead shin to block an incoming low kick with your shin, not your foot.'),
      padDrill('Pad drill: jab-cross-hook', 'Holder calls "1"/"2"/"3" — striker reacts.', '"1"/"2"/"3"'),
    ]),
    day(2, 'wrestling', 'Collar Tie & Clinch', [
      technique('Collar tie & clinch frame', 'One hand behind the opponent\'s neck, the other on their bicep or shoulder, keeping a frame that controls distance.'),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Mount Position', [
      technique('Mount position (top and bottom)', 'Top: straddle the torso, knees pinched, weight forward. Bottom: know how it feels so you recognize when you need to escape.'),
      technique('Basic mount escape (bridge and roll)', 'From bottom mount, trap an arm and leg on one side, bridge your hips explosively, and roll them over.'),
    ]),
    day(5, 'integration', 'Light Flow', [
      technique('Combine week\'s skills', 'Chain stance, striking combo, and mount escape at a cooperative pace.'),
    ], { circuit: true }),
  ]),
  week(4, 1, P1, [
    day(1, 'striking', 'Teep & Roundhouse', [
      technique('The teep (push kick)', 'Drive your heel or ball of the foot straight into the opponent\'s hip or midsection to push them back and control range.'),
      technique('Basic roundhouse kick to the pad', 'Pivot your standing foot, swing your shin through the target, keep your guard up on the way through.'),
      padDrill('Pad drill: combo + kicks', 'Holder calls 1/2/3 plus kicks — striker reacts.', '1/2/3 + kicks'),
    ]),
    day(2, 'wrestling', 'Single-Leg Entry', [
      technique('Single-leg takedown entry', 'Shoot in on one of the opponent\'s legs, wrap it up, and drive through — walk-through pace only this week, no resistance.', { noTeam: true, solo: { rounds: 4 } }),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Side Control', [
      technique('Side control position', 'Chest to chest, perpendicular to your partner, controlling their far arm and near hip.'),
      technique('Basic side control escape', 'Frame an arm against their hip/shoulder, create space with a hip escape, and recover guard.'),
    ]),
    day(5, 'integration', 'Light Flow', [
      technique('Combine week\'s skills', 'Cooperative pace only — no live sparring this month.'),
    ], { circuit: true }),
  ]),
  week(5, 2, P2, [
    day(1, 'striking', 'Uppercut Combo', [
      technique('The uppercut', 'Dip your knees slightly, drive your fist straight up through the target from underneath, staying tight to your body.'),
      technique('Jab-cross-hook-uppercut combo', 'Chain all four strikes smoothly — footwork resets your balance between each shot.'),
      padDrill('Pad drill: full combo', 'Holder calls the full 4-punch combo.', 'jab-cross-hook-uppercut'),
    ]),
    day(2, 'wrestling', 'Double-Leg', [
      technique('Double-leg takedown', 'Shoot low, wrap both legs, drive your shoulder into their hips and lift/drive through — slow reps first, then light resistance.', { teamDesc: 'Light-resistance reps — attacker shoots, defender gives ~30% resistance, swap every round' }),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Closed Guard', [
      technique('Closed guard basics', 'Ankles locked behind their back, control their posture by pulling on the collar/wrists — break their posture down to attack.'),
    ]),
    day(5, 'integration', 'Flow + Light Ground Sparring', [
      technique('Flow: strike → shoot/takedown → land in guard/mount → drill escape', 'Chain everything together at a cooperative pace, then hold the position and drill the escape.'),
    ], { circuit: true }),
  ]),
  week(6, 2, P2, [
    day(1, 'striking', 'Roundhouse & Combos', [
      technique('Roundhouse kick with hip rotation', 'Full hip rotation through the kick for power — pivot the standing foot all the way through.'),
      technique('Kick-punch combos', 'Mix kicks and punches in one sequence, resetting your stance between weapons.'),
      padDrill('Pad drill: kick-punch combos', 'Holder calls mixed kick/punch combos.', 'kick-punch combos'),
    ]),
    day(2, 'wrestling', 'Sprawl-and-Control', [
      technique('Sprawl-and-control after a shot defense', 'After sprawling, don\'t just stop — drive your weight down and work to control the opponent\'s upper body.'),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Armbar from Guard', [
      technique('Armbar from guard', 'Control one arm, swing a leg over the head, extend your hips to hyperextend the elbow. Drill slowly, tap early, no resistance yet.', { soloDesc: 'Solo — walk through the mechanics against an imaginary arm', teamDesc: 'Drill slowly at zero resistance — tap early, swap roles every round' }),
    ]),
    day(5, 'integration', 'Flow + Very Light Positional Sparring', [
      technique('Flow: strike → takedown → position → escape', 'Chain everything together, then hold position for a drill.'),
      liveSparring(
        'Very light positional ground sparring',
        'Start in a set position (guard/mount/side control). Partner tries to escape or sweep at ~30% effort. Tap immediately to any submission.',
        { workSec: 2 * 60, restSec: 60, rounds: 2, label: 'Positional sparring, 30% effort, tap early' },
      ),
    ], { circuit: true }),
  ]),
  week(7, 2, P2, [
    day(1, 'striking', 'Elbows / Knees', [
      technique('Elbows or knees in the clinch', 'Short, tight elbow strikes or knees driven up through the opponent\'s midsection while controlling the clinch.'),
      padDrill('Pad drill: elbow/knee combos', 'Holder calls elbow/knee combos.', 'elbow/knee combos'),
    ]),
    day(2, 'wrestling', 'Clinch Dirty Boxing', [
      technique('Clinch dirty boxing', 'Short punches and knees while controlling a collar tie or over/underhook — stay tight, don\'t lean back.'),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Rear Naked Choke Entry', [
      technique('Rear naked choke entry from back control', 'Seat belt grip from the back, slide one arm under the chin, lock your hands, squeeze. Drill only, very light.', { soloDesc: 'Solo — walk through hand positioning and grip', teamDesc: 'Drill only, very light pressure — tap early, swap roles every round' }),
    ]),
    day(5, 'integration', 'Flow + Light Positional Sparring', [
      technique('Flow rounds', 'Chain strike → takedown → position at a cooperative pace.'),
      liveSparring(
        'Light positional ground sparring',
        'From a set position, roll at ~30% effort to escape or submit. Tap early and often.',
        { workSec: 2 * 60, restSec: 60, rounds: 3, label: 'Positional sparring, 30% effort' },
      ),
    ], { circuit: true }),
  ]),
  week(8, 2, P2, [
    day(1, 'striking', 'Defense Focus', [
      technique('Parrying, blocking kicks, checking', 'Redirect punches with an open glove, check kicks with your shin, keep your guard tight throughout.'),
      padDrill('Pad drill: defense reactions', 'Holder throws to pads, striker parries/blocks/checks on call.', 'defense reactions'),
    ]),
    day(2, 'wrestling', 'Takedown-to-Top Chain', [
      technique('Takedown-to-top-position chain', 'Shoot, complete the takedown, then immediately work to pass into side control rather than stopping at the takedown.'),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Guard Passing + Chains', [
      technique('Guard passing basics', 'Control the legs/hips, stay heavy, work around rather than through the guard.'),
      technique('Escape-to-guard-to-sweep chain', 'Link a bottom escape straight into recovering guard and attempting a sweep — think in sequences, not single moves.'),
    ]),
    day(5, 'integration', 'Flow + Light Positional Sparring', [
      technique('Flow rounds', 'Chain strike → takedown → position at a cooperative pace.'),
      liveSparring(
        'Light positional ground sparring',
        'From a set position, roll at ~30% effort to escape or submit. Tap early and often.',
        { workSec: 2 * 60, restSec: 60, rounds: 3, label: 'Positional sparring, 30% effort' },
      ),
    ], { circuit: true }),
  ]),
  week(9, 3, P3, [
    day(1, 'striking', 'Combo Chains', [
      technique('Combo chains (jab-cross-hook-kick)', 'Longer combinations with a kick on the end — footwork resets your base after each strike.'),
      padDrill('Pad drill: random combo calls', 'Holder calls random combos on the fly — striker reacts without knowing what\'s next.', 'random combos'),
    ]),
    day(2, 'wrestling', 'Live Takedown Reps', [
      liveSparring(
        'Live takedown reps, 50% resistance',
        'One partner attempts a takedown, the other defends lightly at ~50%. Switch roles after each attempt.',
        {
          workSec: 90,
          restSec: 45,
          rounds: 3,
          label: 'Takedown reps, 50% resistance — you each get equal reps attacking and defending',
          turnBased: true,
          roles: ['attempting the takedown', 'defending at ~50% resistance'],
        },
      ),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Positional Sparring', [
      liveSparring(
        'Positional sparring',
        'Start in guard/mount/side control, roll at ~50% to escape or submit. Tap early and often.',
        { workSec: 3 * 60, restSec: 60, rounds: 4, label: 'Positional sparring, 50% effort' },
      ),
    ]),
    day(5, 'integration', 'Full Integration', [
      liveSparring(
        'Full integration round',
        'Light striking round → clinch/takedown attempt → ground positional round, all at ~40-50% intensity.',
        { workSec: 3 * 60, restSec: 60, rounds: 3, label: 'Striking → takedown → ground, 40-50% intensity' },
      ),
    ], { circuit: true }),
  ]),
  week(10, 3, P3, [
    day(1, 'striking', 'Combo Chains', [
      technique('Combo chains (jab-cross-hook-kick)', 'Keep building longer combinations — speed and rhythm over power.'),
      padDrill('Pad drill: random combo calls', 'Holder calls random combos on the fly.', 'random combos'),
    ]),
    day(2, 'wrestling', 'Live Takedown Reps', [
      liveSparring(
        'Live takedown reps, 50% resistance',
        'One attempts, the other defends lightly at ~50%. Switch roles after each attempt.',
        {
          workSec: 90,
          restSec: 45,
          rounds: 3,
          label: 'Takedown reps, 50% resistance — you each get equal reps attacking and defending',
          turnBased: true,
          roles: ['attempting the takedown', 'defending at ~50% resistance'],
        },
      ),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Positional Sparring', [
      liveSparring(
        'Positional sparring',
        'Roll at ~50% to escape or submit from a set position. Tap early and often.',
        { workSec: 3 * 60, restSec: 60, rounds: 4, label: 'Positional sparring, 50% effort' },
      ),
    ]),
    day(5, 'integration', 'Full Integration', [
      liveSparring(
        'Full integration round',
        'Light striking → clinch/takedown attempt → ground positional round, ~40-50% intensity.',
        { workSec: 3 * 60, restSec: 60, rounds: 3, label: 'Striking → takedown → ground, 40-50% intensity' },
      ),
    ], { circuit: true }),
  ]),
  week(11, 3, P3, [
    day(1, 'striking', 'Light Technical Sparring', [
      liveSparring(
        'Light technical sparring',
        'Mouthguards on, ~50% power. Focus entirely on technique and control, not on winning the exchange.',
        { workSec: 3 * 60, restSec: 60, rounds: 3, label: 'Technical sparring, 50% power' },
      ),
    ]),
    day(2, 'wrestling', 'Clinch Sparring', [
      liveSparring(
        'Clinch sparring',
        'Work for a takedown or control only — no strikes. Reset and go again each round.',
        { workSec: 2 * 60, restSec: 60, rounds: 4, label: 'Clinch sparring, control only' },
      ),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Open Rolling', [
      liveSparring(
        'Open rolling',
        'Low intensity, focus on staying calm and using the positions you\'ve learned rather than scrambling.',
        { workSec: 4 * 60, restSec: 60, rounds: 3, label: 'Open rolling, low intensity' },
      ),
    ]),
    day(5, 'integration', 'Full Integration', [
      liveSparring(
        'Full integration',
        'Combine all three — light striking → clinch/takedown → ground positional, 40-50% intensity throughout.',
        { workSec: 3 * 60, restSec: 60, rounds: 3, label: 'Full integration, 40-50% intensity' },
      ),
    ], { circuit: true }),
  ]),
  week(12, 3, P3, [
    day(1, 'striking', 'Light Technical Sparring', [
      liveSparring(
        'Light technical sparring',
        'Mouthguards on, ~50% power. Focus entirely on technique and control, not on winning the exchange.',
        { workSec: 3 * 60, restSec: 60, rounds: 3, label: 'Technical sparring, 50% power' },
      ),
    ]),
    day(2, 'wrestling', 'Clinch Sparring', [
      liveSparring(
        'Clinch sparring',
        'Work for a takedown or control only — no strikes.',
        { workSec: 2 * 60, restSec: 60, rounds: 4, label: 'Clinch sparring, control only' },
      ),
    ], { circuit: true }),
    restDay,
    day(4, 'ground', 'Open Rolling', [
      liveSparring(
        'Open rolling',
        'Low intensity, 3–5 min rounds. Stay calm and use the positions you\'ve learned.',
        { workSec: 5 * 60, restSec: 60, rounds: 3, label: 'Open rolling, low intensity' },
      ),
    ]),
    day(5, 'integration', 'Full Integration — Program Complete', [
      liveSparring(
        'Full integration — final week',
        'Combine all three — light striking → clinch/takedown → ground positional, 40-50% intensity throughout. Consider in-person coaching before pushing to full-speed sparring.',
        { workSec: 3 * 60, restSec: 60, rounds: 3, label: 'Full integration, 40-50% intensity' },
      ),
    ], { circuit: true }),
  ]),
]

export const TOTAL_WEEKS = PROGRAM.length
