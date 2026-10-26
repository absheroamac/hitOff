export interface VisualStep {
  stepNumber: number
  label: string
  imageUrl: string
  cue: string
}

export interface VisualGuide {
  id: string
  title: string
  imageUrl: string
  images?: string[]
  steps?: VisualStep[]
  keyFocus: string
  cues: string[]
}

export const VISUAL_GUIDES: Record<string, VisualGuide> = {
  // --- Individual Specific Guides ---
  stance_guard: {
    id: 'stance_guard',
    title: 'Combat Stance & Guard Position',
    imageUrl: '/guides/stance_guard.jpg',
    keyFocus: 'Balance line centered, chin tucked to chest, hands guarding cheeks, elbows in.',
    cues: [
      'Feet shoulder-width apart at 45° angle, weight balanced 50/50 on balls of feet',
      'Lead toe and rear heel aligned with your opponent\'s centerline',
      'Hands up guarding cheekbones, chin tucked behind lead shoulder',
      'Elbows resting tight against ribs to protect your liver and floating ribs',
    ],
  },

  footwork_step_drag: {
    id: 'footwork_step_drag',
    title: 'Footwork: Step-Drag Mechanics',
    imageUrl: '/guides/footwork_step_drag.jpg',
    keyFocus: 'Step with the foot closest to direction of movement, drag the other foot. Never cross feet.',
    cues: [
      'Moving forward: Step with lead foot first, drag rear foot to follow',
      'Moving backward: Step with rear foot first, drag lead foot to follow',
      'Maintain constant shoulder-width stance circle throughout entire movement',
      'Stay light on the balls of your feet with knees gently bent to absorb momentum',
    ],
  },

  boxing_jab: {
    id: 'boxing_jab',
    title: 'The Lead Jab Punch Mechanics',
    imageUrl: '/guides/boxing_jab.jpg',
    keyFocus: 'Snap the punch straight from your cheek and rotate your fist 90° at impact.',
    cues: [
      'Snap punch directly along the centerline — don\'t flare your elbow out',
      'Rotate fist on full extension so top two knuckles connect horizontally',
      'Raise lead shoulder to protect chin while punching',
      'Snap lead hand back immediately to guard position along identical path',
    ],
  },

  pad_drill_jab: {
    id: 'pad_drill_jab',
    title: 'Partner Pad Drill: Jab Reps',
    imageUrl: '/guides/pad_drill_jab.jpg',
    keyFocus: 'Holder offers firm resistance at chin height; striker snaps jab on the call.',
    cues: [
      'Holder: Position mitt at striker\'s eye level, pop back lightly at impact',
      'Striker: React instantly to the call ("1") without telegraphing or dropping hands',
      'Exhale sharply on impact ("Tss!") to tighten core and deliver snap',
      'Partner feedback: Check that striker returns glove straight to jawline',
    ],
  },

  wrestling_stance: {
    id: 'wrestling_stance',
    title: 'Athletic Wrestling Stance',
    imageUrl: '/guides/wrestling_stance.jpg',
    keyFocus: 'Hips low, knees flexed 110–115°, chest upright, ready to shoot or sprawl.',
    cues: [
      'Drop your hips into a deep athletic squat — do NOT bend over at your waist',
      'Staggered stance with lead foot forward, weight centered on balls of feet',
      'Elbows tucked inside knees to protect your legs from opponent\'s shots',
      'Head high and neck rigid — looking through your eyebrows at opponent\'s hips',
    ],
  },

  penetration_step: {
    id: 'penetration_step',
    title: 'Penetration Step & Shooting Motion',
    imageUrl: '/guides/wrestling_takedown.jpg',
    keyFocus: 'Level change first, deep forward knee drive between opponent\'s feet.',
    cues: [
      'Drop level with your hips before driving forward',
      'Step deep between opponent\'s legs, driving lead knee smoothly to the mat',
      'Keep your chest vertical and head up glued to opponent\'s hip/ribs',
      'Drive forward off rear toes at a 45° angle to complete the shot',
    ],
  },

  breakfalls_ukemi: {
    id: 'breakfalls_ukemi',
    title: 'Breakfalls (Ukemi) — Mat Impact Dissipation',
    imageUrl: '/guides/breakfalls_ukemi.jpg',
    keyFocus: 'Tuck chin tightly to chest and slap mat with both palms at 45°.',
    cues: [
      'Tuck chin firmly to your sternum — your head must NEVER touch the mat',
      'Exhale on impact and slap the mat with both arms at 45° to body',
      'Use full surface of palms and forearms to dissipate impact shockwaves',
      'Bend knees with feet planted to prevent heels or tailbone from bruising',
    ],
  },

  sprawl_defense: {
    id: 'sprawl_defense',
    title: 'Sprawl — Takedown Defense',
    imageUrl: '/guides/sprawl_defense.jpg',
    keyFocus: 'Kick both legs back explosively and drive heavy hips down onto the shooter.',
    cues: [
      'React immediately to opponent\'s level change by kicking both legs backward',
      'Drive your hip bones directly into opponent\'s neck and upper back',
      'Keep chest heavy with toes dug into mat for forward driving pressure',
      'Control opponent\'s head and tricep with a front headlock to prevent re-shots',
    ],
  },

  bjj_guard: {
    id: 'bjj_guard',
    title: 'Guard Control & Hip Escape (Shrimping)',
    imageUrl: '/guides/bjj_guard.jpg',
    keyFocus: 'Turn onto your side, frame with forearms, and drive hips back to make space.',
    cues: [
      'Never lie flat on your back — turn onto your hip and shoulder',
      'Plant one foot on the mat and hinge at waist to slide hips backward',
      'Keep forearm frames active against opponent\'s neck and bicep',
      'Insert your knee between bodies to recover full closed guard',
    ],
  },

  bjj_mount: {
    id: 'bjj_mount',
    title: 'Mount Control & Bridge-and-Roll (Upa) Escape',
    imageUrl: '/guides/bjj_mount.jpg',
    keyFocus: 'Trap arm and leg on the same side, then bridge high diagonally over your shoulder.',
    cues: [
      'Trap opponent\'s wrist and elbow tightly against your chest on one side',
      'Hook the outside of opponent\'s same-side ankle with your foot',
      'Drive through your heels to bridge your hips explosively toward the ceiling',
      'Roll over your trapped shoulder to reverse into opponent\'s guard',
    ],
  },

  kickboxing_combo: {
    id: 'kickboxing_combo',
    title: 'Roundhouse Kick & Striking Combinations',
    imageUrl: '/guides/kickboxing_combo.jpg',
    keyFocus: 'Pivot standing foot 90–180° to open hips for full rotational power.',
    cues: [
      'Pivot on the ball of standing foot as kick initiates',
      'Rotate hip all the way over — strike with lower third of your shin',
      'Keep opposite hand up defending temple and jawline',
      'Return foot quickly to balance ready to follow up or check',
    ],
  },

  // --- Multi-Step Visual Guides ---
  shadow_flow_sprawl: {
    id: 'shadow_flow_sprawl',
    title: 'Shadow Flow: Stance → Jab → Sprawl → Reset',
    imageUrl: '/guides/stance_guard.jpg',
    images: ['/guides/stance_guard.jpg', '/guides/boxing_jab.jpg', '/guides/sprawl_defense.jpg'],
    steps: [
      {
        stepNumber: 1,
        label: 'Stance & Guard',
        imageUrl: '/guides/stance_guard.jpg',
        cue: 'Establish textbook balance, high guard, and light footwork.',
      },
      {
        stepNumber: 2,
        label: 'The Jab',
        imageUrl: '/guides/boxing_jab.jpg',
        cue: 'Step-in and snap an explosive lead jab, rotating fist at impact.',
      },
      {
        stepNumber: 3,
        label: 'Defensive Sprawl',
        imageUrl: '/guides/sprawl_defense.jpg',
        cue: 'Drop hips instantly, kick legs back, then pop back up to stance.',
      },
    ],
    keyFocus: 'Smooth, cooperative transitions between striking and wrestling defense.',
    cues: [
      'Step into the jab without leaning your head forward',
      'Anticipate the counter-shot and drop immediately into a full sprawl',
      'Push off the mat and bounce straight back into balanced stance',
    ],
  },

  conditioning_circuit: {
    id: 'conditioning_circuit',
    title: 'Combat Conditioning Circuit — Multi-Exercise Protocol',
    imageUrl: '/guides/conditioning_circuit.jpg',
    images: ['/guides/conditioning_circuit.jpg'],
    steps: [
      {
        stepNumber: 1,
        label: 'Bodyweight Squats',
        imageUrl: '/guides/conditioning_circuit.jpg',
        cue: 'Weight in mid-foot/heels, knees tracking over toes, thighs parallel to floor.',
      },
      {
        stepNumber: 2,
        label: 'Push-up & Plank Hold',
        imageUrl: '/guides/conditioning_circuit.jpg',
        cue: 'Straight line from heels to crown, elbows 45° to ribs, core locked.',
      },
      {
        stepNumber: 3,
        label: 'Mountain Climbers',
        imageUrl: '/guides/conditioning_circuit.jpg',
        cue: 'Drive knees straight forward under hips at steady tempo without bobbing hips.',
      },
    ],
    keyFocus: 'Strict form and steady breathing over 30s work / 15s rest intervals.',
    cues: [
      'Maintain neutral spine through every movement',
      'Breathe rhythmically — exhale on exertion, inhale on reset',
      'Push side-by-side with your partner to match pace and intensity',
    ],
  },

  warmup_protocol: {
    id: 'warmup_protocol',
    title: 'Warm-up Protocol — 3-Phase Dynamic Sequence',
    imageUrl: '/guides/warmup_mobility.jpg',
    images: ['/guides/warmup_mobility.jpg'],
    steps: [
      {
        stepNumber: 1,
        label: 'Jump Rope or Jog in Place (3 min)',
        imageUrl: '/guides/warmup_mobility.jpg',
        cue: 'Light spring on the balls of your feet, small wrist rotations, easy breathing.',
      },
      {
        stepNumber: 2,
        label: 'Dynamic Mobility Circles (3 min)',
        imageUrl: '/guides/warmup_mobility.jpg',
        cue: 'Arm circles, hip circles, leg swings, and gentle neck rolls to grease joints.',
      },
      {
        stepNumber: 3,
        label: 'Loose Shadowboxing (2 min)',
        imageUrl: '/guides/stance_guard.jpg',
        cue: 'Slow, relaxed movement focusing on stance, footwork, and breathing.',
      },
    ],
    keyFocus: 'Elevate core body temperature and prepare joint capsules for impact.',
    cues: [
      'Do not rush through dynamic mobility — move through full joint ranges',
      'Keep shadowboxing at 30% speed, focusing on technique and flow',
    ],
  },

  cooldown_protocol: {
    id: 'cooldown_protocol',
    title: 'Cooldown Protocol — Recovery & Decompression',
    imageUrl: '/guides/warmup_mobility.jpg',
    images: ['/guides/warmup_mobility.jpg'],
    steps: [
      {
        stepNumber: 1,
        label: 'Hamstring & Hip Stretches (4 min)',
        imageUrl: '/guides/warmup_mobility.jpg',
        cue: 'Gentle static forward folds and hip flexor lunges holding 45s each.',
      },
      {
        stepNumber: 2,
        label: 'Shoulder & Chest Decompression (2 min)',
        imageUrl: '/guides/warmup_mobility.jpg',
        cue: 'Cross-body arm stretch and doorway chest opener to release punching muscles.',
      },
      {
        stepNumber: 3,
        label: 'Deep Diaphragmatic Breathing (2 min)',
        imageUrl: '/guides/warmup_mobility.jpg',
        cue: 'Inhale through nose for 4s, exhale slowly through mouth for 6s to lower heart rate.',
      },
    ],
    keyFocus: 'Decompress joints and down-regulate the nervous system after training.',
    cues: [
      'Breathe into each stretch without bouncing or forcing pain',
      'Hydrate and acknowledge your partner for a great session',
    ],
  },
}

/**
 * Resolves the precise, individualized visual guide for any workout task based on label & description.
 * Ensures zero repetitive generic fallback matches across distinct exercises.
 */
export function getVisualGuideForTask(label: string, description: string): VisualGuide {
  const text = `${label} ${description}`.toLowerCase()

  // 1. Warm-up & Cooldown Multi-Step Protocols
  if (text.includes('warm-up') || text.includes('warmup') || text.includes('jump rope')) {
    return VISUAL_GUIDES.warmup_protocol
  }
  if (text.includes('cooldown') || text.includes('cool-down') || text.includes('static stretch')) {
    return VISUAL_GUIDES.cooldown_protocol
  }

  // 2. Conditioning Circuit
  if (text.includes('conditioning circuit') || text.includes('circuit')) {
    return VISUAL_GUIDES.conditioning_circuit
  }

  // 3. Shadow Flow & Transitions (Multi-Step)
  if (text.includes('shadow flow') || text.includes('stance → jab → sprawl')) {
    return VISUAL_GUIDES.shadow_flow_sprawl
  }

  // 4. Stand-up Stance & Footwork (Specific individual guides!)
  if (text.includes('footwork') || text.includes('step-drag') || text.includes('step drag')) {
    return VISUAL_GUIDES.footwork_step_drag
  }
  if (text.includes('stance, guard') || text.includes('guard position') || text.includes('orthodox/southpaw')) {
    return VISUAL_GUIDES.stance_guard
  }

  // 5. Pad Drills
  if (text.includes('pad drill') && text.includes('jab')) {
    return VISUAL_GUIDES.pad_drill_jab
  }

  // 6. Wrestling Stance & Shots
  if (text.includes('athletic/wrestling stance') || (text.includes('wrestling stance') && !text.includes('shot'))) {
    return VISUAL_GUIDES.wrestling_stance
  }
  if (text.includes('penetration step') || text.includes('shooting motion') || text.includes('single-leg') || text.includes('double-leg') || text.includes('takedown')) {
    return VISUAL_GUIDES.penetration_step
  }

  // 7. Breakfalls
  if (text.includes('breakfall') || text.includes('ukemi') || text.includes('falling backward')) {
    return VISUAL_GUIDES.breakfalls_ukemi
  }

  // 8. Sprawl
  if (text.includes('sprawl')) {
    return VISUAL_GUIDES.sprawl_defense
  }

  // 9. BJJ Mount
  if (text.includes('mount position') || text.includes('mount escape') || text.includes('bridge and roll') || text.includes('upa')) {
    return VISUAL_GUIDES.bjj_mount
  }

  // 10. BJJ Guard & Ground
  if (text.includes('guard') || text.includes('hip escape') || text.includes('shrimp') || text.includes('side control') || text.includes('armbar')) {
    return VISUAL_GUIDES.bjj_guard
  }

  // 11. Kicks & Muay Thai
  if (text.includes('kick') || text.includes('roundhouse') || text.includes('teep') || text.includes('check')) {
    return VISUAL_GUIDES.kickboxing_combo
  }

  // 12. Pad drills general
  if (text.includes('pad drill')) {
    return VISUAL_GUIDES.pad_drill_jab
  }

  // 13. The Jab
  if (text.includes('jab')) {
    return VISUAL_GUIDES.boxing_jab
  }

  // Default to Stance & Guard
  return VISUAL_GUIDES.stance_guard
}
