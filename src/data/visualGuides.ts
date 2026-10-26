export interface VisualGuide {
  id: string
  title: string
  imageUrl: string
  cues: string[]
  keyFocus: string
}

export const VISUAL_GUIDES: Record<string, VisualGuide> = {
  boxing_jab: {
    id: 'boxing_jab',
    title: 'Stance, Guard & Lead Jab Form',
    imageUrl: '/guides/boxing_jab.jpg',
    keyFocus: 'Snap the punch from your cheek and rotate your fist at impact.',
    cues: [
      'Maintain chin tucked down with rear glove guarding your jaw line',
      'Push off rear foot to transfer kinetic energy into lead hand',
      'Rotate fist on impact so top knuckles align horizontally',
      'Snap lead hand back immediately along the exact same path',
    ],
  },
  kickboxing_combo: {
    id: 'kickboxing_combo',
    title: 'Roundhouse & Striking Combinations',
    imageUrl: '/guides/kickboxing_combo.jpg',
    keyFocus: 'Pivot standing foot 90–180° to open the hips for full rotational power.',
    cues: [
      'Pivot on the ball of your standing foot as you initiate the kick',
      'Swing your hip through the strike — strike with lower shin, not foot',
      'Keep your opposite guard hand pinned tightly to protect your temple',
      'Reset foot quickly back to balanced stance ready to check or strike',
    ],
  },
  wrestling_takedown: {
    id: 'wrestling_takedown',
    title: 'Wrestling Penetration Step & Shot Entry',
    imageUrl: '/guides/wrestling_takedown.jpg',
    keyFocus: 'Change levels with your hips, not by bending at the waist.',
    cues: [
      'Lower hips below opponent\'s beltline before driving forward',
      'Take deep penetration step between partner\'s feet with lead knee',
      'Keep chest upright, head high and pressed into partner\'s ribcage',
      'Drive forward at 45° angle off rear foot to complete the finish',
    ],
  },
  sprawl_defense: {
    id: 'sprawl_defense',
    title: 'Sprawl & Shot Defense',
    imageUrl: '/guides/sprawl_defense.jpg',
    keyFocus: 'Drive heavy hips down to the mat while kicking both legs back.',
    cues: [
      'React explosively to opponent\'s level change by kicking legs back',
      'Drive heavy hip pressure directly onto opponent\'s neck and shoulders',
      'Keep chest heavy with toes dug in for forward driving pressure',
      'Crossface or control opponent\'s chin and tricep to prevent re-shot',
    ],
  },
  bjj_guard: {
    id: 'bjj_guard',
    title: 'Guard Control & Hip Escape (Shrimping)',
    imageUrl: '/guides/bjj_guard.jpg',
    keyFocus: 'Frame with arms and push off the mat to escape your hips out.',
    cues: [
      'Turn onto your shoulder and hip rather than lying flat on your spine',
      'Plant lead foot firmly on mat and hinge at waist to slide hips away',
      'Maintain strong forearm frames against opponent\'s neck and bicep',
      'Insert knee shield or recover full closed guard as space opens',
    ],
  },
  bjj_mount: {
    id: 'bjj_mount',
    title: 'Mount Control & Bridge-and-Roll (Upa) Escape',
    imageUrl: '/guides/bjj_mount.jpg',
    keyFocus: 'Trap arm and leg on the same side, then bridge high diagonally.',
    cues: [
      'Trap top opponent\'s wrist and elbow against your chest on one side',
      'Trap opponent\'s foot on the identical side with your outside hook',
      'Drive through your heels to bridge your hips explosively toward the ceiling',
      'Roll over your trapped shoulder into partner\'s guard',
    ],
  },
  conditioning_circuit: {
    id: 'conditioning_circuit',
    title: 'Combat Conditioning Circuit Alignment',
    imageUrl: '/guides/conditioning_circuit.jpg',
    keyFocus: 'Keep spine neutral and prioritize joint stability over raw speed.',
    cues: [
      'Squats: Weight in mid-foot/heels, knees tracking over toes, chest upright',
      'Plank & Push-ups: Straight line from heels to crown of head, core braced',
      'Mountain Climbers: Drive knees straight under hips without bobbing torso',
      'Breathe steadily in rhythm with each rep through the 30-second interval',
    ],
  },
  warmup_mobility: {
    id: 'warmup_mobility',
    title: 'Dynamic Warm-up & Cooldown Protocol',
    imageUrl: '/guides/warmup_mobility.jpg',
    keyFocus: 'Warm up joints with dynamic circles, cool down with static stretches.',
    cues: [
      'Jump rope: Light bounces on balls of feet with quick wrist rotations',
      'Dynamic mobility: Full range of motion for neck, shoulder, and hip capsules',
      'Shadowboxing: Loose, rhythmic movement focusing on flow and footwork',
      'Cooldown: Static hamstring and hip flexor holds with slow deep exhalations',
    ],
  },
}

/**
 * Resolves appropriate visual guide for any workout task based on its label/description.
 */
export function getVisualGuideForTask(label: string, description: string): VisualGuide {
  const text = `${label} ${description}`.toLowerCase()

  if (text.includes('warm-up') || text.includes('warmup') || text.includes('cooldown') || text.includes('stretch') || text.includes('mobility') || text.includes('jump rope')) {
    return VISUAL_GUIDES.warmup_mobility
  }
  if (text.includes('circuit') || text.includes('conditioning') || text.includes('squat') || text.includes('push-up') || text.includes('plank')) {
    return VISUAL_GUIDES.conditioning_circuit
  }
  if (text.includes('sprawl')) {
    return VISUAL_GUIDES.sprawl_defense
  }
  if (text.includes('shoot') || text.includes('penetration step') || text.includes('takedown') || text.includes('single-leg') || text.includes('double-leg') || text.includes('wrestling') || text.includes('clinch') || text.includes('collar tie')) {
    return VISUAL_GUIDES.wrestling_takedown
  }
  if (text.includes('mount') || text.includes('side control') || text.includes('bridge and roll') || text.includes('upa')) {
    return VISUAL_GUIDES.bjj_mount
  }
  if (text.includes('guard') || text.includes('hip escape') || text.includes('shrimp') || text.includes('breakfall') || text.includes('armbar') || text.includes('triangle') || text.includes('rolling')) {
    return VISUAL_GUIDES.bjj_guard
  }
  if (text.includes('kick') || text.includes('roundhouse') || text.includes('teep') || text.includes('check')) {
    return VISUAL_GUIDES.kickboxing_combo
  }
  // Default for boxing, pad drills, jab, cross, hook, uppercut, stance, flow
  return VISUAL_GUIDES.boxing_jab
}
