import { Quest, DifficultyLevel } from '../types';

/**
 * Professional curated quests designed according to SkillGarden specifications:
 * - Measurable learning objectives
 * - Distinct topic-specific quest types
 * - Adaptive levels (Beginner, Beginner+, Intermediate, Intermediate+, Advanced, Expert)
 * - Required materials/tools
 * - Step-by-step instructions
 * - Tangible real-world expected outcomes
 * - Practical hints & reference examples
 * - Structured completion criteria & interactive payloads
 */

export const PROFESSIONAL_QUESTS: Quest[] = [
  // =========================================================================
  // PROGRAMMING
  // =========================================================================
  {
    id: 'prog_debug_calc_01',
    topicName: 'Programming',
    topicSlug: 'programming',
    skillName: 'Debugging & State',
    title: 'Debug the Broken Calculator',
    description: 'Find and fix three JavaScript bugs preventing a small arithmetic calculator from producing accurate calculations.',
    objective: 'Identify type coercion issues and operator bugs in a functional calculator script to return correct mathematical values.',
    categoryTypeBadge: 'DEBUGGING CHALLENGE',
    type: 'Debugging challenge',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    materials: ['In-browser code editor', 'JavaScript runtime'],
    expectedOutcome: 'A working calculator function that correctly evaluates addition, subtraction, and multiplication without string concatenation bugs.',
    hint: 'Notice that values read from input elements are strings by default ("5" + "5" = "55"). Use Number() or parseInt() to cast them.',
    example: `// Broken:\nfunction add(a, b) { return a + b; } // if strings, "3" + "4" -> "34"\n// Fixed:\nfunction add(a, b) { return Number(a) + Number(b); }`,
    rewardXp: 35,
    whyThisQuest: 'Debugging code written by others or yourself is the #1 skill of everyday software engineering.',
    progressImpact: 'Unlocks Code Inspector badge & advances State Mastery by 25%',
    completionType: 'coding',
    completionCriteria: [
      'Cast input string values to numbers',
      'Fix the subtraction logic bug',
      'Ensure the function returns a clean number output'
    ],
    steps: [
      {
        id: 'p_d1',
        title: 'Diagnose the Concatenation Flaw',
        instruction: 'Look at the calculation function below. Why does calculate(10, 5, "+") return "105" instead of 15?',
        type: 'interactive_choice',
        options: [
          'JavaScript runs out of memory on double-digit numbers',
          'The + operator concatenates strings when arguments are passed as text',
          'Math operations in JavaScript only support negative numbers',
          'The function requires an async await promise'
        ],
        correctOptionIndex: 1,
        explanation: 'In JavaScript, the + operator acts as string concatenation if either operand is a string. Wrapping with Number() enforces arithmetic addition.'
      },
      {
        id: 'p_d2',
        title: 'Implement the Calculator Fix',
        instruction: 'Fix the calculate function so that it handles Number conversion and returns the correct result for addition and subtraction.',
        type: 'micro_code',
        initialCode: `function calculate(a, b, op) {\n  // Bug: a and b might be strings!\n  const numA = Number(a);\n  const numB = Number(b);\n  \n  if (op === "+") {\n    return numA + numB;\n  } else if (op === "-") {\n    return numA - numB;\n  }\n  return 0;\n}`,
        solutionKeywords: ['Number', 'numA', 'numB', '+', '-']
      },
      {
        id: 'p_d3',
        title: 'Review Edge Cases',
        instruction: 'What should the calculator return if a user passes invalid input like calculate("abc", 5, "+")?',
        type: 'concept',
        content: `When handling user input, checking \`isNaN(numA)\` prevents silent failures. Professional engineers always anticipate that user inputs might be empty or malformed.\n\nGood practice:\nif (Number.isNaN(numA) || Number.isNaN(numB)) {\n  return "Invalid Input";\n}`
      }
    ]
  },
  {
    id: 'prog_array_shop_02',
    topicName: 'Programming',
    topicSlug: 'programming',
    skillName: 'Arrays & Data Collections',
    title: 'Build a Dynamic Shopping Cart Array',
    description: 'Create, modify, and display an array of cart items: add items, remove an item by index, and calculate total count.',
    objective: 'Practice declaring an array, appending with .push(), filtering or splicing, and calculating length.',
    categoryTypeBadge: 'CODING CHALLENGE',
    type: 'Coding challenge',
    difficulty: 'Beginner+',
    estimatedMinutes: 15,
    materials: ['JavaScript workspace'],
    expectedOutcome: 'A clean shopping list script that manages an array with add, remove, and summary methods.',
    hint: 'Use array.push("item") to append, and array.splice(index, 1) or array.filter() to remove.',
    example: `const cart = ["Apple", "Bread"];\ncart.push("Milk");\nconst filtered = cart.filter(item => item !== "Apple");`,
    rewardXp: 40,
    whyThisQuest: 'Arrays are the backbone of all modern apps—from to-do lists to Instagram feeds.',
    progressImpact: 'Unlocks Shopping Cart landmark & +30% Array comprehension',
    completionType: 'coding',
    steps: [
      {
        id: 'p_a1',
        title: 'Array Operations Architecture',
        instruction: 'Observe how arrays store ordered lists in index positions starting at zero.',
        type: 'concept',
        content: `Arrays in JavaScript:\n• cart[0] refers to the first item.\n• cart.length gives the total count.\n• cart.push('newItem') appends to the end.\n• cart.includes('item') checks if it is present.`
      },
      {
        id: 'p_a2',
        title: 'Write Cart Manipulation Code',
        instruction: 'Declare a cart array, push two grocery items, and return its total length.',
        type: 'micro_code',
        initialCode: `function manageCart() {\n  const cart = ["Fresh Herbs", "Green Tea"];\n  // Add "Honey" to the cart\n  cart.push("Honey");\n  // Return the count of items in cart\n  return cart.length;\n}`,
        solutionKeywords: ['cart', 'push', 'length']
      }
    ]
  },
  {
    id: 'prog_project_todo_stage1',
    topicName: 'Programming',
    topicSlug: 'programming',
    skillName: 'DOM & Interactive UI',
    title: 'Mini Project: To-Do App (Stage 1 of 5)',
    description: 'Construct the visual user interface for a clean task management component with input field and submit button.',
    objective: 'Build the foundational layout and event listeners to capture user input into state.',
    categoryTypeBadge: 'MINI PROJECT',
    type: 'Mini project',
    difficulty: 'Beginner+',
    estimatedMinutes: 20,
    materials: ['HTML/CSS/JS or React component sandbox'],
    expectedOutcome: 'A rendered UI component featuring an accessible input field, action button, and empty task list container.',
    rewardXp: 50,
    whyThisQuest: 'Projects turn isolated syntax exercises into actual software you can share.',
    progressImpact: 'Advances To-Do Project to 20% & expands island workshop region',
    projectStage: {
      stage: 1,
      totalStages: 5,
      stageName: 'Stage 1: Interface & Input Capture'
    },
    completionType: 'coding',
    steps: [
      {
        id: 'proj_s1',
        title: 'Structure the Component Contract',
        instruction: 'Define the state representation for a single task item (id, title, completed).',
        type: 'concept',
        content: `A resilient task structure:\n{\n  id: "task_1",\n  text: "Water the seedling",\n  completed: false,\n  createdAt: Date.now()\n}\nBy storing items as objects instead of raw strings, we can toggle completion state cleanly.`
      },
      {
        id: 'proj_s2',
        title: 'Implement Task Input Handler',
        instruction: 'Write the handler function that accepts an input string and returns a task object if non-empty.',
        type: 'micro_code',
        initialCode: `function createTask(title) {\n  if (!title || title.trim() === "") return null;\n  return {\n    id: Date.now(),\n    title: title.trim(),\n    completed: false\n  };\n}`,
        solutionKeywords: ['createTask', 'title', 'completed', 'trim']
      }
    ]
  },

  // =========================================================================
  // DRAWING & ART
  // =========================================================================
  {
    id: 'art_shape_to_char_01',
    topicName: 'Drawing & Art',
    topicSlug: 'drawing',
    skillName: 'Construction & Proportions',
    title: 'Shape-to-Character Construction',
    description: 'Construct a stylized character figure starting exclusively from basic geometric forms: a circle, rectangle, and triangle.',
    objective: 'Break down complex anatomical anatomy into primary construction volumes before adding line details.',
    categoryTypeBadge: 'DRAWING EXERCISE',
    type: 'Drawing exercise',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    materials: ['Sketchbook or in-app canvas', 'Pencil or stylus'],
    expectedOutcome: 'A completed character sketch showing visible underlying geometric construction forms.',
    hint: 'Use the circle for the head/skull volume, a tilted rectangle for the torso, and a triangle for the hips or cloak.',
    example: 'Think of classic animation characters: notice how Winnie the Pooh is spheres, whereas a robot character is stacked cylinders and cuboids.',
    rewardXp: 35,
    whyThisQuest: 'Professional animators and concept artists never start with details like eyelashes. They establish silhouette volumes first.',
    progressImpact: 'Unlocks Easel Landmark & +30% Character Construction',
    completionType: 'drawing_canvas',
    completionCriteria: [
      'Establish primary geometric masses',
      'Maintain head-to-body proportion ratio',
      'Draw over construction with clean contour lines'
    ],
    steps: [
      {
        id: 'd_s1',
        title: 'The Secret of Big Volumes',
        instruction: 'Why do master artists begin drawings with light primitive shapes?',
        type: 'interactive_choice',
        options: [
          'Because they are not allowed to use color right away',
          'Primitive shapes allow instant evaluation of pose, weight, and silhouette before committing',
          'Circles are the only shapes that paper can absorb',
          'It is an old tradition with no practical purpose'
        ],
        correctOptionIndex: 1,
        explanation: 'Primitive construction lets you fix proportion and gesture errors in 5 seconds instead of after 2 hours of detailed shading!'
      },
      {
        id: 'd_s2',
        title: 'Sketch Your Construction Character',
        instruction: 'Use the interactive canvas below (or your paper sketchbook) to construct your character using circle, rectangle, and triangle forms.',
        type: 'drawing_canvas',
        drawingPrompt: 'Sketch a character figure: 1. Circle for head, 2. Rectangle for torso, 3. Triangle for cloak/stance.',
        suggestedColors: ['#1c1917', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
        criteriaChecklist: [
          'Head volume established with a clear circle or oval',
          'Torso mass placed with balanced angle/weight',
          'Arms or legs gesture marked out'
        ]
      }
    ]
  },
  {
    id: 'art_perspective_street_02',
    topicName: 'Drawing & Art',
    topicSlug: 'drawing',
    skillName: 'Perspective & Depth',
    title: 'One-Point Perspective Street Scene',
    description: 'Draw a street scene using one-point perspective: establish a horizon line and single vanishing point before adding buildings.',
    objective: 'Demonstrate convergent depth lines receding toward a single vanishing point with proportional size diminution.',
    categoryTypeBadge: 'PERSPECTIVE EXERCISE',
    type: 'Perspective exercise',
    difficulty: 'Beginner+',
    estimatedMinutes: 20,
    materials: ['Ruler or straight-edge guide', 'Fineliner / Pencil'],
    expectedOutcome: 'A streetscape drawing with at least 3 buildings receding accurately toward the central horizon vanishing point.',
    hint: 'All horizontal lines remain strictly horizontal; all vertical lines remain strictly vertical; all receding lines aim at the point.',
    rewardXp: 45,
    whyThisQuest: 'Perspective creates the illusion of a three-dimensional world on a flat two-dimensional surface.',
    completionType: 'self_assessment_rubric',
    steps: [
      {
        id: 'persp_1',
        title: 'Rules of 1-Point Perspective',
        instruction: 'Remember the golden rule: only lines pointing toward the viewer or away from the viewer converge.',
        type: 'concept',
        content: `Three line families in 1-point perspective:\n1. Verticals (e.g. wall corners): strictly straight up & down.\n2. Horizontals (e.g. building roofs facing you): strictly parallel to the horizon.\n3. Orthogonals (e.g. sidewalk edges, windows along the road): all meet at the single Vanishing Point (VP).`
      },
      {
        id: 'persp_2',
        title: 'Draw & Check Your Orthogonals',
        instruction: 'Complete the scene in your sketchbook or on the canvas, then verify each criterion in the rubric.',
        type: 'drawing_canvas',
        drawingPrompt: 'Draw a horizon line across the middle. Place a dot in the center. Draw 4 diagonal lines radiating from it to create the street & rooftops.',
        criteriaChecklist: [
          'Horizon line is level across the composition',
          'Vanishing point is clearly defined',
          'Building tops and sidewalk curbs align with the vanishing point',
          'Distant buildings are noticeably smaller than foreground buildings'
        ]
      }
    ]
  },

  // =========================================================================
  // ENGLISH FLUENCY
  // =========================================================================
  {
    id: 'eng_cafe_sim_01',
    topicName: 'English Fluency',
    topicSlug: 'english',
    skillName: 'Spoken Fluency & Dialogue',
    title: 'Café Order & Small Talk Simulation',
    description: 'Engage in a natural café conversation: order a beverage with custom preferences, ask a question about the pastries, and respond politely.',
    objective: 'Practice using polite modal verbs ("Could I get...", "Would you mind...") and natural conversational rejoinders in real time.',
    categoryTypeBadge: 'CONVERSATION SIMULATION',
    type: 'Conversation simulation',
    difficulty: 'Beginner+',
    estimatedMinutes: 10,
    materials: ['Microphone or spoken practice', 'Voice playback'],
    expectedOutcome: 'A complete spoken dialogue where you order fluently using target phrases and listen to barista responses.',
    hint: 'Native speakers rarely say "I want a coffee." Instead, they say: "Could I have an oat latte, please?" or "I will go with the cold brew today."',
    example: 'Barista: "Hi there! What can I get started for you?"\nYou: "Hi! Could I please get a medium cappuccino with oat milk, and do you have any vegan muffins left?"',
    rewardXp: 35,
    whyThisQuest: 'Ordering at a café is the premier low-stress, high-frequency immersion experience abroad.',
    completionType: 'speaking_recording',
    steps: [
      {
        id: 'eng_c1',
        title: 'Polite Phrasing Comparison',
        instruction: 'Which option sounds most natural and polite to a native English barista?',
        type: 'interactive_choice',
        options: [
          '"Give me one latte now."',
          '"Could I please get a large iced latte with oat milk?"',
          '"I want drink coffee here."',
          '"Prepare coffee beverage for my consumption."'
        ],
        correctOptionIndex: 1,
        explanation: '"Could I get..." with "please" is the gold standard for friendly, respectful customer ordering in English.'
      },
      {
        id: 'eng_c2',
        title: 'Spoken Simulation Practice',
        instruction: 'Read the barista prompt, speak your answer aloud (or use the microphone recorder to practice your cadence), and use the target phrase.',
        type: 'speaking_task',
        speakingPrompt: 'Barista: "Good morning! Can I get you anything to eat with your coffee today?"',
        targetPhrases: ['Actually, do you have any...', 'I think I will pass today, but thank you!', 'Could you recommend...']
      }
    ]
  },
  {
    id: 'eng_room_describe_02',
    topicName: 'English Fluency',
    topicSlug: 'english',
    skillName: 'Vocabulary & Descriptives',
    title: 'Describe Your Room Aloud for 2 Minutes',
    description: 'Speak continuously for two minutes describing the objects, lighting, and colors in your immediate surroundings without translating in your head.',
    objective: 'Strengthen spontaneous descriptive vocabulary (spatial prepositions: across from, adjacent to, perched on).',
    categoryTypeBadge: 'SPEAKING TASK',
    type: 'Speaking task',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    materials: ['Timer / Voice notes'],
    expectedOutcome: 'A 2-minute spoken session describing physical space with spatial prepositions.',
    rewardXp: 30,
    whyThisQuest: 'Eliminating the "translation delay" between thought and English speech requires describing real physical things you see right now.',
    completionType: 'speaking_recording',
    steps: [
      {
        id: 'eng_r1',
        title: 'Spatial Preposition Toolkit',
        instruction: 'Review spatial vocabulary before speaking:',
        type: 'concept',
        content: `Useful prepositions for physical descriptions:\n• "Perched on the windowsill..."\n• "Right next to my laptop sits..."\n• "Directly across from where I am sitting..."\n• "Tucked away in the corner..."`
      },
      {
        id: 'eng_r2',
        title: '2-Minute Continuous Speaking Run',
        instruction: 'Start the timer, look around your actual room, and speak aloud about what you see. Focus on continuous flow over perfection.',
        type: 'micro_action'
      }
    ]
  },

  // =========================================================================
  // PHOTOGRAPHY
  // =========================================================================
  {
    id: 'photo_thirds_field_01',
    topicName: 'Photography',
    topicSlug: 'photography',
    skillName: 'Composition & Framing',
    title: 'Rule of Thirds Field Assignment',
    description: 'Capture three photographs of ordinary everyday objects placing the focal subject precisely along the vertical or horizontal 1/3 grid lines.',
    objective: 'Move away from default center-bullseye framing by deliberately positioning visual interest at grid intersections.',
    categoryTypeBadge: 'FIELD ASSIGNMENT',
    type: 'Field assignment',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    materials: ['Smartphone camera or DSLR', 'Grid overlay enabled'],
    expectedOutcome: 'Three photographs demonstrating intentional Rule of Thirds subject placement with negative space.',
    hint: 'Enable "Grid" in your camera settings. Place your subject where two grid lines intersect (an "interest point").',
    rewardXp: 35,
    whyThisQuest: 'Placing subjects off-center gives the photo dynamic energy, tension, and breathing room.',
    progressImpact: 'Unlocks Viewfinder landmark & +25% Composition Skill',
    completionType: 'self_assessment_rubric',
    steps: [
      {
        id: 'ph_1',
        title: 'Center Framing vs. Rule of Thirds',
        instruction: 'Why does placing a coffee cup at the lower-left intersection often look more professional than right in the middle?',
        type: 'interactive_choice',
        options: [
          'Because cameras have sharper lenses only in the corners',
          'It provides narrative negative space and guides the viewer eye naturally through the scene',
          'Center framing is technically illegal in photography contests',
          'The battery lasts longer when shooting off-center'
        ],
        correctOptionIndex: 1,
        explanation: 'Off-center placement creates visual movement: the eye lands on the subject, then explores the surrounding environment.'
      },
      {
        id: 'ph_2',
        title: 'Field Execution Checklist',
        instruction: 'Take 3 photos around your home or street applying the rule of thirds. Review your results against this rubric:',
        type: 'micro_action'
      }
    ]
  },

  // =========================================================================
  // CHESS STRATEGY
  // =========================================================================
  {
    id: 'chess_backrank_puzzle_01',
    topicName: 'Chess Strategy',
    topicSlug: 'chess',
    skillName: 'Tactics & Calculation',
    title: 'Back-Rank Mate Tactical Puzzle',
    description: 'Identify the weakness in the opponent\'s back rank and deliver checkmate in 2 moves by exploiting an un-moved pawn shield.',
    objective: 'Spot the trapped enemy King behind unmoved pawns (f7, g7, h7) and execute a decisive rook or queen back-rank penetration.',
    categoryTypeBadge: 'TACTICAL PUZZLE',
    type: 'Tactical puzzle',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    materials: ['Interactive chess board'],
    expectedOutcome: 'A correctly solved tactical sequence delivering back-rank checkmate.',
    hint: 'Notice that Black has not played h6 or g6 to give their King a "luft" (breathing escape square).',
    example: '1. Re8+ Rxe8 2. Rxe8# Checkmate.',
    rewardXp: 35,
    whyThisQuest: 'Back-rank mates are responsible for over 40% of tactical wins at the beginner and club level.',
    progressImpact: 'Unlocks Grandmaster Pavilion landmark & +35% Tactical Rating',
    completionType: 'tactical_chess',
    steps: [
      {
        id: 'ch_1',
        title: 'Diagnose the King Safety Defect',
        instruction: 'White to move. The Black King is trapped on g8 behind pawns on f7, g7, h7. What is White\'s winning move?',
        type: 'chess_puzzle',
        chessTurn: 'white',
        chessInstruction: 'White to move: deliver the back-rank rook invasion!',
        chessSolutionMove: {
          from: 'd1',
          to: 'd8',
          description: '1. Rd8+! Invades the vulnerable back rank, forcing a deflection and winning.'
        },
        chessPieces: [
          { square: 'g8', piece: '♚' },
          { square: 'f7', piece: '♟' },
          { square: 'g7', piece: '♟' },
          { square: 'h7', piece: '♟' },
          { square: 'e8', piece: '♜' },
          { square: 'g1', piece: '♔' },
          { square: 'f2', piece: '♙' },
          { square: 'g2', piece: '♙' },
          { square: 'h2', piece: '♙' },
          { square: 'd1', piece: '♖' }
        ]
      },
      {
        id: 'ch_2',
        title: 'Strategic Takeaway: What is "Luft"?',
        instruction: 'How should Black have defended against this threat beforehand?',
        type: 'interactive_choice',
        options: [
          'By moving their King to the center of the board on move 3',
          'By pushing h6 or g6 beforehand to create an escape square ("luft") for the King',
          'By resigning immediately when White has a rook',
          'By playing with two kings'
        ],
        correctOptionIndex: 1,
        explanation: 'Creating "luft" (German for air) by nudging h7 to h6 provides an escape square and neutralizes back-rank threats.'
      }
    ]
  },

  // =========================================================================
  // MUSIC & INSTRUMENT
  // =========================================================================
  {
    id: 'music_rhythm_syncopation_01',
    topicName: 'Music & Instrument',
    topicSlug: 'music',
    skillName: 'Rhythm & Timing',
    title: 'Syncopated Groove & Off-Beat Tap',
    description: 'Learn to feel and tap the "and" of the beat (off-beats): count 1-&-2-&-3-&-4-& and tap exclusively on the upbeat notes.',
    objective: 'Develop steady internal pulse and decouple clapping from downbeats for expressive groove playing.',
    categoryTypeBadge: 'RHYTHM EXERCISE',
    type: 'Rhythm exercise',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    materials: ['Metronome or interactive rhythm pad'],
    expectedOutcome: 'Accurate execution of an off-beat syncopated groove for 16 consecutive measures.',
    hint: 'Count out loud: "ONE and TWO and THREE and FOUR and". Clap your hands only when your voice says "and".',
    rewardXp: 30,
    whyThisQuest: 'Syncopation is what makes funk, jazz, pop, and bossa nova sound alive rather than robotic.',
    completionType: 'rhythm_tap',
    steps: [
      {
        id: 'm_r1',
        title: 'Understanding Downbeats vs Upbeats',
        instruction: 'Why does syncopation create emotional energy in a song?',
        type: 'interactive_choice',
        options: [
          'Because playing off-beats violates standard physics',
          'It creates pleasant rhythmic tension against the steady pulse of the meter',
          'It speeds up the metronome automatically',
          'It only sounds good on acoustic guitars'
        ],
        correctOptionIndex: 1,
        explanation: 'Syncopation plays with expectation: our ear anticipates the heavy downbeat, so landing on the upbeat creates danceable groove and bounce.'
      },
      {
        id: 'm_r2',
        title: '16-Measure Metronome Practice',
        instruction: 'Set your tempo to 75 BPM. Tap along on every upbeat "&". Keep your foot tapping the downbeat steady.',
        type: 'micro_action'
      }
    ]
  },

  // =========================================================================
  // CULINARY & COOKING
  // =========================================================================
  {
    id: 'cook_knife_julienne_01',
    topicName: 'Culinary & Cooking',
    topicSlug: 'cooking',
    skillName: 'Knife Technique & Prep',
    title: 'The "Claw Grip" & Matchstick Julienne Cut',
    description: 'Practice the classic chef\'s claw grip on a carrot or cucumber to cut uniform 1/8-inch matchsticks safely without finger risk.',
    objective: 'Master knuckle blade-guide safety and uniform vegetable dimension for consistent cooking.',
    categoryTypeBadge: 'TECHNIQUE EXERCISE',
    type: 'Technique exercise',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    materials: ['Chef\'s knife', 'Cutting board', '1 carrot or bell pepper'],
    expectedOutcome: 'A uniform portion of julienne cut matchsticks with zero safety near-misses.',
    hint: 'Tuck your fingertips inward like a tiger claw; rest the flat side of the knife blade against your middle knuckles.',
    rewardXp: 35,
    whyThisQuest: 'Knife skills are 80% of kitchen speed and guarantee that all pieces cook at exactly the same rate in the pan.',
    completionType: 'self_assessment_rubric',
    steps: [
      {
        id: 'c_k1',
        title: 'The Claw Grip Mechanics',
        instruction: 'Where should your guide-hand fingertips point while slicing with a chef knife?',
        type: 'interactive_choice',
        options: [
          'Flat and spread out as wide as possible',
          'Curled inward toward your palm with the thumb tucked safely behind',
          'Holding the tip of the sharp knife blade',
          'Pointing straight up in the air'
        ],
        correctOptionIndex: 1,
        explanation: 'The claw grip curls your fingertips inward, letting the flat of the chef knife glide safely against your knuckles.'
      },
      {
        id: 'c_k2',
        title: 'Prep & Julienne Execution',
        instruction: 'Square off your carrot, slice into 1/8-inch planks, stack two planks, and cut into matchsticks. Check off your technique:',
        type: 'micro_action'
      }
    ]
  }
];

/**
 * Returns curated quests matching a topic slug or keyword.
 */
export function getProfessionalQuestsForTopic(topicSlug: string): Quest[] {
  const norm = topicSlug.toLowerCase().trim();
  const direct = PROFESSIONAL_QUESTS.filter((q) => q.topicSlug === norm);
  if (direct.length > 0) return direct;
  return PROFESSIONAL_QUESTS.filter((q) => q.topicName?.toLowerCase().includes(norm));
}
