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
  },
  
  // Additional exercises for better coverage
  'front squat': {
    name: 'Front Squats',
    image: 'https://training.fit/wp-content/uploads/2020/02/frontkniebeuge.png',
    muscles: 'Quads, Glutes, Core',
    description: 'Bar rests on front delts, elbows high. Squat down keeping torso upright.',
    tips: [
      'Keep elbows high',
      'Stay upright',
      'Push knees out',
      'Full depth if mobility allows'
    ],
    source: 'training.fit'
  },
  'body squat': {
    name: 'Body Squats',
    image: 'https://training.fit/wp-content/uploads/2020/02/kniebeuge-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings',
    description: 'Bodyweight squat - feet shoulder-width, squat down until thighs parallel.',
    tips: [
      'Keep chest up',
      'Push knees out',
      'Full range of motion',
      'Control the movement'
    ],
    source: 'training.fit'
  },
  'dumbbell step up': {
    name: 'Dumbbell Step Ups',
    image: 'https://training.fit/wp-content/uploads/2020/02/ausfallschritte-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings',
    description: 'Hold dumbbells, step up onto a box or bench, drive through heel.',
    tips: [
      'Step fully onto platform',
      'Drive through front heel',
      'Control the descent',
      'Alternate legs'
    ],
    source: 'training.fit'
  },
  'dumbbell thruster': {
    name: 'Dumbbell Thrusters',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulter-druecken-langhantel.png',
    muscles: 'Quads, Shoulders, Core',
    description: 'Front squat with dumbbells, then press overhead in one fluid motion.',
    tips: [
      'Start with dumbbells at shoulders',
      'Squat to parallel',
      'Drive up explosively',
      'Press straight overhead'
    ],
    source: 'training.fit'
  },
  'dumbbell chest press': {
    name: 'Dumbbell Chest Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/flachbankdruecken-kurzhantel.png',
    muscles: 'Chest, Triceps, Front Delts',
    description: 'Lie on bench with dumbbells, press up until arms extended.',
    tips: [
      'Retract shoulder blades',
      'Lower to chest level',
      'Press up and slightly in',
      'Full lockout at top'
    ],
    source: 'training.fit'
  },
  'close grip bench press': {
    name: 'Close Grip Bench Press',
    image: 'https://training.fit/wp-content/uploads/2020/03/enges-bankdruecken.png',
    muscles: 'Triceps, Chest, Front Delts',
    description: 'Grip shoulder-width, lower bar to lower chest, press up.',
    tips: [
      'Keep elbows tucked',
      'Lower to lower chest',
      'Full lockout',
      'Focus on triceps'
    ],
    source: 'training.fit'
  },
  'cardio': {
    name: 'Cardio',
    image: null,
    muscles: 'Heart, Full Body',
    description: 'Any cardiovascular exercise - running, cycling, jumping jacks, etc.',
    tips: [
      'Maintain steady pace',
      'Keep breathing regular',
      'Stay hydrated',
      'Monitor heart rate'
    ],
    source: null
  },
  'step up': {
    name: 'Step Ups',
    image: 'https://training.fit/wp-content/uploads/2020/02/ausfallschritte-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings',
    description: 'Step onto a raised platform, drive through heel, then step down.',
    tips: [
      'Full foot on platform',
      'Drive through heel',
      'Control descent',
      'Keep torso upright'
    ],
    source: 'training.fit'
  },
  'thruster': {
    name: 'Thrusters',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulter-druecken-langhantel.png',
    muscles: 'Quads, Shoulders, Core, Glutes',
    description: 'Front squat into overhead press in one explosive movement.',
    tips: [
      'Bar at shoulders to start',
      'Squat to parallel or below',
      'Explosive drive up',
      'Full lockout overhead'
    ],
    source: 'training.fit'
  },
  'walking lunge': {
    name: 'Walking Lunges',
    image: 'https://training.fit/wp-content/uploads/2020/02/ausfallschritte-langhantel.png',
    muscles: 'Quads, Glutes, Hamstrings',
    description: 'Step forward into lunge, then step through to next lunge continuously.',
    tips: [
      'Keep torso upright',
      'Back knee nearly touches ground',
      'Alternate legs',
      'Control each step'
    ],
    source: 'training.fit'
  },
  'romanian deadlift': {
    name: 'Romanian Deadlift',
    image: 'https://training.fit/wp-content/uploads/2020/02/kreuzheben-gestreckte-beine.png',
    muscles: 'Hamstrings, Glutes, Lower Back',
    description: 'Hinge at hips with slight knee bend, lower bar along legs, feel hamstring stretch.',
    tips: [
      'Keep back straight',
      'Slight knee bend',
      'Push hips back',
      'Feel the hamstring stretch'
    ],
    source: 'training.fit'
  },
  'sumo deadlift': {
    name: 'Sumo Deadlift',
    image: 'https://training.fit/wp-content/uploads/2020/02/kreuzheben.png',
    muscles: 'Quads, Glutes, Adductors, Back',
    description: 'Wide stance, hands inside knees, pull the bar up by driving through legs.',
    tips: [
      'Wide stance, toes out',
      'Grip inside legs',
      'Push floor away',
      'Keep chest up'
    ],
    source: 'training.fit'
  },
  'cable fly': {
    name: 'Cable Fly',
    image: 'https://training.fit/wp-content/uploads/2020/02/cable-crossover.png',
    muscles: 'Chest, Front Delts',
    description: 'Stand between cables, bring handles together in front with slight elbow bend.',
    tips: [
      'Slight forward lean',
      'Slight elbow bend',
      'Squeeze at center',
      'Control the return'
    ],
    source: 'training.fit'
  },
  'face pull': {
    name: 'Face Pulls',
    image: 'https://training.fit/wp-content/uploads/2020/02/face-pull.png',
    muscles: 'Rear Delts, Traps, Rotator Cuff',
    description: 'Pull cable rope to face, rotating hands outward at end.',
    tips: [
      'Set cable at face height',
      'Pull to face',
      'External rotation at end',
      'Squeeze rear delts'
    ],
    source: 'training.fit'
  },
  'upright row': {
    name: 'Upright Row',
    image: 'https://training.fit/wp-content/uploads/2020/02/aufrechtes-rudern.png',
    muscles: 'Shoulders, Traps, Biceps',
    description: 'Pull bar up along body to chin height, leading with elbows.',
    tips: [
      'Lead with elbows',
      'Keep bar close to body',
      'Pause at top',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'goblet squat': {
    name: 'Goblet Squat',
    image: 'https://training.fit/wp-content/uploads/2020/02/kniebeuge-langhantel.png',
    muscles: 'Quads, Glutes, Core',
    description: 'Hold dumbbell or kettlebell at chest, squat down between legs.',
    tips: [
      'Hold weight at chest',
      'Elbows between knees at bottom',
      'Keep chest up',
      'Full depth'
    ],
    source: 'training.fit'
  },
  'hip thrust': {
    name: 'Hip Thrusts',
    image: 'https://training.fit/wp-content/uploads/2020/02/hip-thrust.png',
    muscles: 'Glutes, Hamstrings',
    description: 'Back against bench, drive hips up with weight on hips.',
    tips: [
      'Shoulder blades on bench',
      'Drive through heels',
      'Squeeze glutes at top',
      'Full hip extension'
    ],
    source: 'training.fit'
  },
  'calf raise': {
    name: 'Calf Raises',
    image: 'https://training.fit/wp-content/uploads/2020/02/wadenheben.png',
    muscles: 'Calves',
    description: 'Rise up onto toes, pause at top, lower with control.',
    tips: [
      'Full range of motion',
      'Pause at top',
      'Slow negative',
      'Feel the stretch at bottom'
    ],
    source: 'training.fit'
  },
  'skull crusher': {
    name: 'Skull Crushers',
    image: 'https://training.fit/wp-content/uploads/2020/02/stirndruecken.png',
    muscles: 'Triceps',
    description: 'Lie on bench, lower weight to forehead, extend arms back up.',
    tips: [
      'Keep elbows pointed up',
      'Lower to forehead',
      'Full extension',
      'Control the weight'
    ],
    source: 'training.fit'
  },
  'hammer curl': {
    name: 'Hammer Curls',
    image: 'https://training.fit/wp-content/uploads/2020/02/hammercurls.png',
    muscles: 'Biceps, Brachialis, Forearms',
    description: 'Curl with neutral grip (palms facing each other), squeeze at top.',
    tips: [
      'Keep palms facing each other',
      'Elbows at sides',
      'Full contraction',
      'Control the negative'
    ],
    source: 'training.fit'
  },
  'preacher curl': {
    name: 'Preacher Curls',
    image: 'https://training.fit/wp-content/uploads/2020/02/scottcurls.png',
    muscles: 'Biceps',
    description: 'Arms on preacher bench, curl weight up isolating biceps.',
    tips: [
      'Arms fully on pad',
      'Controlled movement',
      'Full extension at bottom',
      'Squeeze at top'
    ],
    source: 'training.fit'
  },
  'tricep dip': {
    name: 'Tricep Dips',
    image: 'https://training.fit/wp-content/uploads/2020/02/dips.png',
    muscles: 'Triceps, Chest, Front Delts',
    description: 'Lower body by bending arms, then press back up.',
    tips: [
      'Keep body upright for triceps focus',
      'Lower until upper arm is parallel',
      'Full lockout at top',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'overhead tricep extension': {
    name: 'Overhead Tricep Extension',
    image: 'https://training.fit/wp-content/uploads/2020/02/trizepsdruecken-ueber-kopf.png',
    muscles: 'Triceps',
    description: 'Hold weight overhead, lower behind head by bending elbows, extend back up.',
    tips: [
      'Keep elbows pointed up',
      'Lower behind head',
      'Full extension',
      'Control the weight'
    ],
    source: 'training.fit'
  },
  'incline dumbbell press': {
    name: 'Incline Dumbbell Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/schraegbankdruecken-kurzhantel.png',
    muscles: 'Upper Chest, Front Delts, Triceps',
    description: 'On incline bench, press dumbbells up and slightly together.',
    tips: [
      'Set bench to 30-45 degrees',
      'Retract shoulder blades',
      'Press up and slightly in',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'decline bench press': {
    name: 'Decline Bench Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/flachbankdruecken-langhantel.png',
    muscles: 'Lower Chest, Triceps',
    description: 'On decline bench, lower bar to lower chest, press up.',
    tips: [
      'Secure feet under pads',
      'Lower to lower chest',
      'Full lockout',
      'Control the weight'
    ],
    source: 'training.fit'
  },
  'bent over row': {
    name: 'Bent Over Row',
    image: 'https://training.fit/wp-content/uploads/2020/02/langhantel-rudern.png',
    muscles: 'Back, Biceps, Rear Delts',
    description: 'Hinge at hips, pull weight to lower chest, squeeze back.',
    tips: [
      'Keep back flat',
      'Pull to lower chest',
      'Lead with elbows',
      'Squeeze at top'
    ],
    source: 'training.fit'
  },
  'seated row': {
    name: 'Seated Row',
    image: 'https://training.fit/wp-content/uploads/2020/02/rudern-am-kabelzug.png',
    muscles: 'Back, Biceps, Rear Delts',
    description: 'Sit at cable machine, pull handle to torso, squeeze back.',
    tips: [
      'Keep chest up',
      'Pull to torso',
      'Squeeze shoulder blades',
      'Control the return'
    ],
    source: 'training.fit'
  },
  't-bar row': {
    name: 'T-Bar Row',
    image: 'https://training.fit/wp-content/uploads/2020/02/langhantel-rudern.png',
    muscles: 'Back, Biceps, Rear Delts',
    description: 'Straddle T-bar, pull weight to chest, squeeze back muscles.',
    tips: [
      'Keep back flat',
      'Pull to chest',
      'Squeeze at top',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'pendlay row': {
    name: 'Pendlay Row',
    image: 'https://training.fit/wp-content/uploads/2020/02/langhantel-rudern.png',
    muscles: 'Back, Biceps, Rear Delts',
    description: 'Start from floor each rep, explosively row bar to lower chest.',
    tips: [
      'Bar starts on floor',
      'Explosive pull',
      'Touch lower chest',
      'Control back down'
    ],
    source: 'training.fit'
  },
  'chin up': {
    name: 'Chin Ups',
    image: 'https://training.fit/wp-content/uploads/2020/02/klimmzuege.png',
    muscles: 'Biceps, Lats, Core',
    description: 'Underhand grip, pull until chin clears bar.',
    tips: [
      'Underhand grip',
      'Pull until chin clears bar',
      'Engage lats',
      'Full extension at bottom'
    ],
    source: 'training.fit'
  },
  'shrug': {
    name: 'Shrugs',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulterheben.png',
    muscles: 'Traps',
    description: 'Hold weights at sides, shrug shoulders up toward ears.',
    tips: [
      'Straight up motion',
      'Hold at top',
      'Don\'t roll shoulders',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'reverse fly': {
    name: 'Reverse Fly',
    image: 'https://training.fit/wp-content/uploads/2020/02/vorgebeugtes-seitheben.png',
    muscles: 'Rear Delts, Upper Back',
    description: 'Bent over, raise arms out to sides, squeeze rear delts.',
    tips: [
      'Slight elbow bend',
      'Raise to shoulder height',
      'Squeeze at top',
      'Control the descent'
    ],
    source: 'training.fit'
  },
  'front raise': {
    name: 'Front Raises',
    image: 'https://training.fit/wp-content/uploads/2020/02/frontheben.png',
    muscles: 'Front Delts',
    description: 'Raise weight in front to shoulder height, lower with control.',
    tips: [
      'Slight elbow bend',
      'Raise to shoulder height',
      'Don\'t swing',
      'Control the weight'
    ],
    source: 'training.fit'
  },
  'arnold press': {
    name: 'Arnold Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulter-druecken-langhantel.png',
    muscles: 'Shoulders, Triceps',
    description: 'Start with palms facing you, rotate and press overhead.',
    tips: [
      'Start palms facing you',
      'Rotate as you press',
      'Full lockout at top',
      'Reverse the motion down'
    ],
    source: 'training.fit'
  },
  'military press': {
    name: 'Military Press',
    image: 'https://training.fit/wp-content/uploads/2020/02/schulter-druecken-langhantel.png',
    muscles: 'Shoulders, Triceps, Core',
    description: 'Standing barbell press, strict form with no leg drive.',
    tips: [
      'Core braced',
      'Strict form, no leg drive',
      'Full lockout',
      'Head through at top'
    ],
    source: 'training.fit'
  },
  'cable crossover': {
    name: 'Cable Crossover',
    image: 'https://training.fit/wp-content/uploads/2020/02/cable-crossover.png',
    muscles: 'Chest, Front Delts',
    description: 'Cables set high, bring handles down and together in front.',
    tips: [
      'Cables set high',
      'Step forward for stretch',
      'Bring handles together',
      'Squeeze chest at bottom'
    ],
    source: 'training.fit'
  },
  'incline fly': {
    name: 'Incline Fly',
    image: 'https://training.fit/wp-content/uploads/2020/02/fliegende-flachbank.png',
    muscles: 'Upper Chest, Front Delts',
    description: 'On incline bench, lower dumbbells with slight elbow bend, bring back up.',
    tips: [
      'Set bench to 30 degrees',
      'Slight elbow bend',
      'Feel the stretch',
      'Squeeze at top'
    ],
    source: 'training.fit'
  }
}

// Helper function to normalize exercise name for matching
function normalizeForMatching(name) {
  let normalized = name.toLowerCase().trim()
    .replace(/[:\-\*\.]+$/, '') // Remove trailing punctuation
    .replace(/[:\-\*\.]+/g, ' ') // Replace punctuation with spaces
    .replace(/\s+/g, ' ')        // Collapse multiple spaces
    .trim()
  
  // Singularize (remove trailing 's')
  if (normalized.endsWith('s') && normalized.length > 3 && !normalized.endsWith('press')) {
    normalized = normalized.slice(0, -1)
  }
  
  return normalized
}

// Helper function to find exercise info
export function getExerciseInfo(exerciseName) {
  const name = exerciseName.toLowerCase().trim()
  const normalized = normalizeForMatching(name)
  
  // Direct match
  if (exerciseDatabase[name]) {
    return exerciseDatabase[name]
  }
  
  // Match with normalized name
  if (exerciseDatabase[normalized]) {
    return exerciseDatabase[normalized]
  }
  
  // Try matching without trailing 's' for all database keys
  for (const [key, data] of Object.entries(exerciseDatabase)) {
    const normalizedKey = normalizeForMatching(key)
    if (normalized === normalizedKey) {
      return data
    }
  }
  
  // Partial match - check if any database key is contained in the name
  for (const [key, data] of Object.entries(exerciseDatabase)) {
    if (name.includes(key) || key.includes(name)) {
      return data
    }
    // Also check normalized versions
    const normalizedKey = normalizeForMatching(key)
    if (normalized.includes(normalizedKey) || normalizedKey.includes(normalized)) {
      return data
    }
  }
  
  // Keyword match - find exercises containing common keywords
  const keywordPriority = [
    'front squat', 'back squat', 'goblet squat', 'sumo squat',
    'incline press', 'decline press', 'bench press', 'shoulder press', 'push press',
    'barbell row', 'dumbbell row', 'cable row', 'seated row',
    'deadlift', 'squat', 'press', 'curl', 'row', 'pull', 'lunge', 
    'raise', 'fly', 'extension', 'dip', 'crunch', 'plank', 'thruster', 'step up'
  ]
  
  for (const keyword of keywordPriority) {
    if (normalized.includes(keyword) || name.includes(keyword)) {
      // Find the best matching exercise
      for (const [key, data] of Object.entries(exerciseDatabase)) {
        if (key.includes(keyword)) {
          return data
        }
      }
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

