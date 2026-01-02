// Exercise database with images and descriptions
// Images from training.fit and similar sources

const exerciseDatabase = {
  // CHEST EXERCISES
  'push up': {
    name: 'Push Ups',
    image: 'https://training.fit/wp-content/uploads/2020/02/liegestuetze.png',
    muscles: 'Chest, Shoulders, Triceps',
    description: 'Start in a plank position with hands slightly wider than shoulders. Lower your body until chest nearly touches the ground, then push back up.',
    tips: [
      'Keep your body in a straight line from head to heels',
      'Lower until chest nearly touches the ground',
      'Push up explosively',
      'Keep elbows at 45 degrees'
    ],
    source: 'training.fit'
  },
  'bench press': {
    name: 'Bench Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/flachbankdruecken-langhantel.png',
    muscles: 'Chest, Triceps, Front Delts',
    description: 'Lie on a bench, grip the bar just outside shoulder width. Lower to mid-chest and press up.',
    tips: [
      'Arch your back slightly and retract shoulder blades',
      'Keep feet flat on the floor',
      'Lower bar to mid-chest level',
      'Drive through your heels'
    ],
    source: 'training.fit'
  },
  'incline barbell press': {
    name: 'Incline Barbell Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/schraegbankdruecken-langhantel.png',
    muscles: 'Upper Chest, Front Delts, Triceps',
    description: 'Set bench to 30-45 degrees. Lower the bar to your upper chest with control, then press up.',
    tips: [
      'Set bench to 30-45 degrees',
      'Retract shoulder blades',
      'Lower to upper chest',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'incline bench': {
    name: 'Incline Bench Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/schraegbankdruecken-langhantel.png',
    muscles: 'Upper Chest, Front Delts, Triceps',
    description: 'Set bench to 30-45 degrees. Lower the bar to your upper chest with control, then press up.',
    tips: [
      'Set bench to 30-45 degrees',
      'Retract shoulder blades',
      'Lower to upper chest',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'close grip bench': {
    name: 'Close Grip Bench Press',
    image: 'https://training.fit/wp-content/uploads/2020/03/enges-bankdruecken.png',
    muscles: 'Triceps, Chest, Front Delts',
    description: 'Grip the bar shoulder-width apart. Keep elbows close to body and lower to lower chest.',
    tips: [
      'Grip shoulder-width apart',
      'Keep elbows tucked close to body',
      'Lower to lower chest',
      'Full lockout at top'
    ],
    source: 'training.fit'
  },
  'dumbbell fly': {
    name: 'Dumbbell Fly',
    image: 'https://training.fit/wp-content/uploads/2020/02/fliegende-flachbank.png',
    muscles: 'Chest, Front Delts',
    description: 'Lie on bench with dumbbells, arms extended. Lower with slight elbow bend, then bring back up.',
    tips: [
      'Keep slight bend in elbows throughout',
      'Lower until you feel a stretch in chest',
      'Squeeze chest at the top',
      'Control the weight'
    ],
    source: 'training.fit'
  },

  // BACK EXERCISES
  'pull up': {
    name: 'Pull Ups',
    image: 'https://training.fit/wp-content/uploads/2020/02/klimmzuege.png',
    muscles: 'Lats, Biceps, Core',
    description: 'Hang with arms fully extended, pull yourself up until chin clears the bar.',
    tips: [
      'Engage lats before pulling',
      'Pull until chin clears bar',
      'Full extension at bottom',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'lat pulldown': {
    name: 'Lat Pulldown',
    image: 'https://training.fit/wp-content/uploads/2020/02/latzug-zur-brust.png',
    muscles: 'Lats, Biceps, Rear Delts',
    description: 'Pull the bar to your upper chest while leaning back slightly. Squeeze your lats at the bottom.',
    tips: [
      'Keep chest up',
      'Pull to upper chest',
      'Squeeze lats at bottom',
      'Controlled release'
    ],
    source: 'training.fit'
  },
  'barbell row': {
    name: 'Barbell Row',
    image: 'https://training.fit/wp-content/uploads/2020/02/langhantel-rudern.png',
    muscles: 'Back, Biceps, Rear Delts',
    description: 'Bend at hips, pull bar to lower chest. Keep back straight throughout.',
    tips: [
      'Keep back straight',
      'Pull to lower chest/upper abs',
      'Lead with elbows',
      'Squeeze back at top'
    ],
    source: 'training.fit'
  },
  'dumbbell row': {
    name: 'Dumbbell Row',
    image: 'https://training.fit/wp-content/uploads/2020/02/kurzhantel-rudern.png',
    muscles: 'Back, Biceps, Rear Delts',
    description: 'Support yourself on bench, pull dumbbell to hip. Keep back flat.',
    tips: [
      'Keep back flat',
      'Pull to hip, not chest',
      'Squeeze back at top',
      'Control the negative'
    ],
    source: 'training.fit'
  },
  'muscle up': {
    name: 'Muscle Up',
    image: 'https://training.fit/wp-content/uploads/2020/02/klimmzuege.png',
    muscles: 'Lats, Chest, Triceps, Core',
    description: 'Start with explosive pull-up, transition over the bar by leaning forward and pressing out.',
    tips: [
      'Start with explosive pull',
      'Lean forward at the top',
      'Smooth transition over bar',
      'Press out to lockout'
    ],
    source: 'training.fit'
  },

  // LEG EXERCISES
  'barbell squat': {
    name: 'Barbell Squats',
    image: 'https://training.fit/wp-content/uploads/2020/02/kniebeuge-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings, Core',
    description: 'Bar on upper back, feet shoulder-width. Squat until thighs are parallel, then stand up.',
    tips: [
      'Keep chest up',
      'Push knees out over toes',
      'Squat to parallel or below',
      'Drive through heels'
    ],
    source: 'training.fit'
  },
  'squat': {
    name: 'Squats',
    image: 'https://training.fit/wp-content/uploads/2020/02/kniebeuge-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings, Core',
    description: 'Feet shoulder-width, squat until thighs are parallel to floor, then stand back up.',
    tips: [
      'Keep chest up',
      'Push knees out',
      'Depth: hip crease below knee',
      'Drive through heels'
    ],
    source: 'training.fit'
  },
  'deadlift': {
    name: 'Deadlift',
    image: 'https://training.fit/wp-content/uploads/2020/02/kreuzheben.png',
    muscles: 'Hamstrings, Glutes, Back, Core',
    description: 'Keep bar close to body, hinge at hips, maintain neutral spine throughout.',
    tips: [
      'Push floor away with legs',
      'Keep bar close to body',
      'Hips and shoulders rise together',
      'Lock out at top'
    ],
    source: 'training.fit'
  },
  'lunge': {
    name: 'Lunges',
    image: 'https://training.fit/wp-content/uploads/2020/02/ausfallschritte-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings',
    description: 'Step forward, lower until back knee nearly touches ground, push back up.',
    tips: [
      'Keep torso upright',
      'Front knee tracks over toes',
      'Back knee nearly touches ground',
      'Push through front heel'
    ],
    source: 'training.fit'
  },
  'barbell walking lunge': {
    name: 'Barbell Walking Lunges',
    image: 'https://training.fit/wp-content/uploads/2020/02/ausfallschritte-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings',
    description: 'Bar on back, step forward into lunge, then step through to next lunge.',
    tips: [
      'Keep torso upright',
      'Take controlled steps',
      'Back knee nearly touches ground',
      'Alternate legs'
    ],
    source: 'training.fit'
  },
  'leg extension': {
    name: 'Leg Extensions',
    image: 'https://training.fit/wp-content/uploads/2020/02/beinstrecken.png',
    muscles: 'Quadriceps',
    description: 'Sit on machine, extend legs until straight, then lower with control.',
    tips: [
      'Keep back against pad',
      'Full extension at top',
      'Controlled descent',
      'Don\'t swing the weight'
    ],
    source: 'training.fit'
  },
  'leg curl': {
    name: 'Leg Curls',
    image: 'https://training.fit/wp-content/uploads/2020/02/beinbeugen-liegend.png',
    muscles: 'Hamstrings',
    description: 'Lie face down, curl weight toward glutes, then lower with control.',
    tips: [
      'Keep hips pressed into pad',
      'Curl all the way up',
      'Controlled descent',
      'Don\'t jerk the weight'
    ],
    source: 'training.fit'
  },
  'hanging leg raise': {
    name: 'Hanging Leg Raises',
    image: 'https://training.fit/wp-content/uploads/2020/02/beinheben-haengend.png',
    muscles: 'Abs, Hip Flexors',
    description: 'Hang from bar, raise legs to parallel or higher with control.',
    tips: [
      'No swinging',
      'Keep legs straight',
      'Raise to parallel or higher',
      'Control the descent'
    ],
    source: 'training.fit'
  },

  // SHOULDER EXERCISES
  'barbell push press': {
    name: 'Barbell Push Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulter-druecken-langhantel.png',
    muscles: 'Shoulders, Triceps, Core, Legs',
    description: 'Bar at shoulders, dip knees slightly, explosively drive through legs while pressing overhead.',
    tips: [
      'Quick knee dip',
      'Explosive leg drive',
      'Press straight overhead',
      'Lock out at top'
    ],
    source: 'training.fit'
  },
  'shoulder press': {
    name: 'Shoulder Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulter-druecken-langhantel.png',
    muscles: 'Shoulders, Triceps, Core',
    description: 'Press weight directly overhead, keeping core tight.',
    tips: [
      'Core braced',
      'Press straight up',
      'Full lockout',
      'Head through at top'
    ],
    source: 'training.fit'
  },
  'lateral raise': {
    name: 'Lateral Raises',
    image: 'https://training.fit/wp-content/uploads/2020/02/seitheben-stehend.png',
    muscles: 'Side Delts',
    description: 'Raise arms to shoulder height with slight elbow bend.',
    tips: [
      'Slight elbow bend',
      'Raise to shoulder height',
      'Lead with elbows',
      'Pause at top'
    ],
    source: 'training.fit'
  },
  'hand stand push up': {
    name: 'Handstand Push Ups',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulter-druecken-langhantel.png',
    muscles: 'Shoulders, Triceps, Core',
    description: 'Kick up against wall, lower head toward ground, then press back up.',
    tips: [
      'Use wall for support',
      'Core tight',
      'Lower head to ground',
      'Press through palms'
    ],
    source: 'training.fit'
  },

  // ARM EXERCISES
  'barbell curl': {
    name: 'Barbell Curls',
    image: 'https://training.fit/wp-content/uploads/2020/02/langhantel-curls.png',
    muscles: 'Biceps, Forearms',
    description: 'Curl bar up keeping elbows stationary, squeeze at top, lower with control.',
    tips: [
      'Keep elbows stationary',
      'Full contraction at top',
      'Slow negative',
      'Don\'t swing'
    ],
    source: 'training.fit'
  },
  'dumbbell curl': {
    name: 'Dumbbell Curls',
    image: 'https://training.fit/wp-content/uploads/2020/02/kurzhantel-curls.png',
    muscles: 'Biceps, Forearms',
    description: 'Curl dumbbells up, squeeze at top, lower with control.',
    tips: [
      'Keep elbows at sides',
      'Supinate wrist at top',
      'Full contraction',
      'Control the weight'
    ],
    source: 'training.fit'
  },
  'tricep rope pushdown': {
    name: 'Tricep Rope Pushdowns',
    image: 'https://training.fit/wp-content/uploads/2020/02/trizepsdruecken-am-kabel.png',
    muscles: 'Triceps',
    description: 'Pin elbows at sides, extend arms, spread rope at bottom.',
    tips: [
      'Keep elbows pinned',
      'Full extension',
      'Spread rope at bottom',
      'Squeeze triceps'
    ],
    source: 'training.fit'
  },
  'dip': {
    name: 'Dips',
    image: 'https://training.fit/wp-content/uploads/2020/02/dips.png',
    muscles: 'Triceps, Chest, Front Delts',
    description: 'Lower until upper arms parallel to floor, then press back up.',
    tips: [
      'Lower to parallel',
      'Keep elbows close for triceps',
      'Lean forward for chest',
      'Full lockout at top'
    ],
    source: 'training.fit'
  },

  // CORE EXERCISES
  'l-sit': {
    name: 'L-Sit',
    image: 'https://training.fit/wp-content/uploads/2020/02/beinheben-haengend.png',
    muscles: 'Abs, Hip Flexors, Triceps',
    description: 'Support yourself on parallettes or floor, lift legs to parallel and hold.',
    tips: [
      'Depress shoulders',
      'Keep legs straight',
      'Point toes',
      'Breathe steadily'
    ],
    source: 'training.fit'
  },
  'plank': {
    name: 'Plank',
    image: 'https://training.fit/wp-content/uploads/2020/02/unterarmstuetze.png',
    muscles: 'Core, Shoulders',
    description: 'Hold a push-up position on forearms, keep body straight from head to heels.',
    tips: [
      'Keep body straight',
      'Don\'t let hips sag',
      'Engage core throughout',
      'Breathe normally'
    ],
    source: 'training.fit'
  },
  'crunch': {
    name: 'Crunches',
    image: 'https://training.fit/wp-content/uploads/2020/02/crunches.png',
    muscles: 'Abs',
    description: 'Lie on back, curl upper body toward knees, focus on contracting abs.',
    tips: [
      'Don\'t pull on neck',
      'Focus on ab contraction',
      'Controlled movement',
      'Exhale on the way up'
    ],
    source: 'training.fit'
  }
}

// Helper function to find exercise info
export function getExerciseInfo(exerciseName) {
  const name = exerciseName.toLowerCase().trim()
  
  // Direct match
  if (exerciseDatabase[name]) {
    return exerciseDatabase[name]
  }
  
  // Partial match
  for (const [key, data] of Object.entries(exerciseDatabase)) {
    if (name.includes(key) || key.includes(name)) {
      return data
    }
  }
  
  // Keyword match
  const keywords = ['press', 'curl', 'squat', 'row', 'pull', 'deadlift', 'lunge', 'raise', 'fly', 'extension', 'dip', 'crunch', 'plank']
  for (const keyword of keywords) {
    if (name.includes(keyword) && exerciseDatabase[keyword]) {
      return exerciseDatabase[keyword]
    }
  }
  
  // Default fallback
  return {
    name: exerciseName,
    image: null,
    muscles: 'Multiple muscle groups',
    description: 'Focus on proper form and controlled movements.',
    tips: ['Control the weight', 'Full range of motion', 'Mind-muscle connection', 'Breathe properly'],
    source: null
  }
}

export default exerciseDatabase

