import { Topic, TopicQuestion, SkillNode, Quest } from '../../types';

export interface TopicConfig {
  topic: Topic;
  genericQuestions: TopicQuestion[];
  topicSpecificQuestions: TopicQuestion[];
  initialSkills: Omit<SkillNode, 'id' | 'userTopicId'>[];
  starterQuests: (userTopicId: string) => Quest[];
  worldConfig: {
    colorPalette: {
      primary: string;
      accent: string;
      ground: string;
      fog: string;
    };
    stageLandmarks: {
      stage1: string;
      stage2: string;
      stage3: string;
      stage4: string;
      stage5: string;
    };
    ambientEffect: 'code_matrix' | 'paint_splatters' | 'photo_flash' | 'floating_words' | 'music_notes' | 'herb_spores' | 'chess_squares' | 'orbit_dust';
  };
}

// 1. PROGRAMMING CONFIGURATION
export const PROGRAMMING_CONFIG: TopicConfig = {
  topic: {
    id: 'programming',
    name: 'Programming',
    slug: 'programming',
    icon: '💻',
    description: 'Code, software engineering, interactive apps, and creative systems.',
    category: 'tech',
  },
  genericQuestions: [
    {
      id: 'prog_goal_generic',
      topicSlug: 'programming',
      question: 'What do you want to accomplish in Programming?',
      subtitle: 'Your personal north star for writing code.',
      type: 'text',
      placeholder: 'e.g. Learn JavaScript well enough to build my own apps and tools.',
      required: true,
    },
    {
      id: 'prog_why',
      topicSlug: 'programming',
      question: 'Why do you want to learn programming?',
      type: 'multi_choice',
      options: ['For a personal project', 'Career / Future work', 'For fun & curiosity', 'To challenge my brain', 'School / Studies'],
      required: true,
    },
    {
      id: 'prog_level',
      topicSlug: 'programming',
      question: 'What is your current level in coding?',
      type: 'single_choice',
      options: ['Complete beginner', 'Beginner (know basics)', 'Intermediate', 'Advanced', 'Not sure'],
      required: true,
    },
    {
      id: 'prog_session_time',
      topicSlug: 'programming',
      question: 'How much time feels realistic for a coding session?',
      type: 'single_choice',
      options: ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '30 minutes'],
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'prog_interest_focus',
      topicSlug: 'programming',
      question: 'What interests you most in programming?',
      type: 'single_choice',
      options: ['Websites & Web Apps', 'Games & Interactive', 'Mobile Apps', 'AI & Machine Learning', 'Automation & Scripts', 'Creative Coding', 'Not sure yet'],
      required: true,
    },
    {
      id: 'prog_tech_exp',
      topicSlug: 'programming',
      question: 'What have you used before (if any)?',
      type: 'multi_choice',
      options: ['None / Starting fresh', 'HTML & CSS', 'JavaScript / TypeScript', 'Python', 'React', 'C++ / Java', 'Scratch / Block code'],
      required: true,
    },
    {
      id: 'prog_style',
      topicSlug: 'programming',
      question: 'How do you prefer learning programming?',
      type: 'single_choice',
      options: ['Building real projects', 'Coding challenges & puzzles', 'Visual games', 'Short concept breakdowns', 'Mixed balance'],
      required: true,
    },
    {
      id: 'prog_dream_build',
      topicSlug: 'programming',
      question: 'What would you love to build one day?',
      subtitle: 'A dream tool, game, website, or app idea.',
      type: 'text',
      placeholder: 'e.g. A personal habit tracker, a retro pixel game, or an interactive portfolio.',
      required: false,
    },
  ],
  initialSkills: [
    { topicSlug: 'programming', name: 'Variables & State', description: 'Storing values and data containers in memory.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 20, level: 1, xp: 20 },
    { topicSlug: 'programming', name: 'Conditionals & Logic', description: 'Guiding branches with if/else comparisons.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'programming', name: 'Loops & Iterations', description: 'Repeating operations without repeating code.', orderIndex: 3, difficulty: 'beginner', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'programming', name: 'Arrays & Data Collections', description: 'Manipulating lists and mapping data structures.', orderIndex: 4, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'programming', name: 'Functions & Reusable Recipes', description: 'Writing modular, pure, and reusable algorithms.', orderIndex: 5, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'programming', name: 'DOM & Interactive UI', description: 'Connecting buttons, inputs, and screens.', orderIndex: 6, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'programming', name: 'APIs & Live Data', description: 'Fetching live information from the cloud.', orderIndex: 7, difficulty: 'advanced', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'programming', name: 'Cap-Stone Project Build', description: 'Combining all systems into a finished product.', orderIndex: 8, difficulty: 'advanced', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_prog_debug_${Date.now()}`,
      userTopicId,
      topicName: 'Programming',
      skillId: 'Variables & State',
      skillName: 'Variables & State',
      title: 'Debug the Broken Calculator',
      description: 'Find and fix three JavaScript bugs in a calculator logic function.',
      objective: 'Identify incorrect assignment operators and fix calculation outputs for addition and multiplication.',
      categoryTypeBadge: 'DEBUGGING CHALLENGE',
      type: 'challenge',
      estimatedMinutes: 15,
      difficulty: 'beginner',
      materials: ['Browser & Code Workspace'],
      expectedOutcome: 'A working calculator script that returns accurate arithmetic sums and products.',
      hint: 'Check where `let` vs `const` was declared, and look at the return expression.',
      example: 'function add(a, b) {\n  return a + b;\n}',
      completionType: 'coding',
      completionCriteria: ['Correct variable declaration', 'Fix return sum formula', 'Pass verification test check'],
      rewardXp: 40,
      progressImpact: 'Variables & Debugging +18%',
      worldReward: {
        unlockKey: 'terminal_screen',
        name: 'Glowing Terminal Screen',
        icon: '💻',
        description: 'Interactive debugger monitor on your coding workbench',
      },
      whyThisQuest: 'Debugging is the real craft of software development. Fixing broken code cements mental models faster than copying syntax.',
      steps: [
        {
          id: 'p_dbg_1',
          title: 'Analyze the Buggy Code',
          instruction: 'Observe the broken calculator snippet and spot the syntax and logic errors.',
          type: 'concept',
          content: '```javascript\n// BUG: This function tries to reassign a const and has a flawed formula:\nconst total = 0;\nfunction calculateScore(bonus, multiplier) {\n  total = bonus * 1; // Error: Assignment to constant variable!\n  return bonus + multiplier;\n}\n```',
        },
        {
          id: 'p_dbg_2',
          title: 'Interactive Code Fix',
          instruction: 'Fix the code in the editor below. Change `const total` to `let total`, and ensure `return bonus * multiplier;` returns the proper calculation.',
          type: 'micro_code',
          initialCode: 'let total = 0;\nfunction calculateScore(bonus, multiplier) {\n  total = bonus * multiplier;\n  return total;\n}',
          solutionKeywords: ['let total', 'bonus * multiplier'],
        },
        {
          id: 'p_dbg_3',
          title: 'Error Reflection',
          instruction: 'Why did the original `const total = 0; total = ...` fail in JavaScript runtime?',
          type: 'interactive_choice',
          options: [
            'Constants (`const`) cannot be reassigned after their initial declaration',
            'Numbers cannot be assigned to variables in JavaScript',
            'Variables can only be modified inside loops',
          ],
          correctOptionIndex: 0,
          explanation: '`const` guarantees the variable identifier cannot be reassigned!',
        },
      ],
    },
    {
      id: `quest_prog_shopping_${Date.now()}`,
      userTopicId,
      topicName: 'Programming',
      skillId: 'Arrays & Data Collections',
      skillName: 'Arrays & Data Collections',
      title: 'Build a Dynamic Shopping List',
      description: 'Practice creating, modifying, and displaying an array of items.',
      objective: 'Construct an array, append items using .push(), and remove items using .filter() or .pop().',
      categoryTypeBadge: 'BUILD TASK',
      type: 'project',
      estimatedMinutes: 15,
      difficulty: 'intermediate',
      materials: ['JavaScript Array Engine'],
      expectedOutcome: 'A functioning array inventory with dynamic addition and deletion.',
      hint: 'Remember that array indices start at index 0.',
      example: 'const cart = ["tea", "honey"];\ncart.push("lemon");',
      completionType: 'coding',
      completionCriteria: ['Initialize cart array', 'Push 3 items', 'Verify item count'],
      rewardXp: 35,
      progressImpact: 'Arrays & Collections +15%',
      worldReward: {
        unlockKey: 'data_cube',
        name: 'Holographic Data Cube',
        icon: '🧊',
        description: 'Floating data core above your lab workbench',
      },
      whyThisQuest: 'You recently practiced variables. Arrays are how you group collections of data together.',
      steps: [
        {
          id: 's_arr_1',
          title: 'Array Mechanics',
          instruction: 'Arrays are ordered lists that hold multiple values in a single container.',
          type: 'concept',
          content: '```javascript\nconst gardenTools = ["Shears", "Water Can", "Gloves"];\ngardenTools.push("Trowel"); // Adds to end\nconsole.log(gardenTools.length); // 4\n```',
        },
        {
          id: 's_arr_2',
          title: 'Array Push Check',
          instruction: 'If `cart = ["Apples"]` and we run `cart.push("Peaches")`, what is `cart[1]`?',
          type: 'interactive_choice',
          options: ['"Peaches"', '"Apples"', 'undefined', '2'],
          correctOptionIndex: 0,
          explanation: '`cart[0]` is "Apples", and the newly pushed item is at index 1: "Peaches"!',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#10b981',
      accent: '#06b6d4',
      ground: '#2e4c45',
      fog: '#0f172a',
    },
    stageLandmarks: {
      stage1: 'Empty Coding Workbench',
      stage2: 'Terminal & Glowing Monitor',
      stage3: 'Server Rack & Data Core',
      stage4: 'Automated Tech Lab',
      stage5: 'High-Tech Digital Campus',
    },
    ambientEffect: 'code_matrix',
  },
};

// 2. DRAWING CONFIGURATION
export const DRAWING_CONFIG: TopicConfig = {
  topic: {
    id: 'drawing',
    name: 'Drawing & Art',
    slug: 'drawing',
    icon: '🎨',
    description: 'Digital sketching, character design, anatomy, perspective, and illustration.',
    category: 'art',
  },
  genericQuestions: [
    {
      id: 'draw_goal_generic',
      topicSlug: 'drawing',
      question: 'What do you want to accomplish in Drawing?',
      subtitle: 'Your artistic vision.',
      type: 'text',
      placeholder: 'e.g. Draw dynamic anime characters with good anatomy and color.',
      required: true,
    },
    {
      id: 'draw_why',
      topicSlug: 'drawing',
      question: 'Why does drawing matter to you?',
      type: 'multi_choice',
      options: ['Pure creative joy & relaxation', 'To express original ideas & stories', 'For digital art / freelance', 'To challenge my craft', 'For fan art & fandoms'],
      required: true,
    },
    {
      id: 'draw_level',
      topicSlug: 'drawing',
      question: 'What is your current drawing experience?',
      type: 'single_choice',
      options: ['Never drawn seriously', 'Beginner (doodling)', 'Some experience', 'Intermediate', 'Advanced'],
      required: true,
    },
    {
      id: 'draw_session_time',
      topicSlug: 'drawing',
      question: 'How much time feels realistic for a drawing session?',
      type: 'single_choice',
      options: ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '30 minutes'],
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'draw_type',
      topicSlug: 'drawing',
      question: 'What type of drawing interests you most?',
      type: 'single_choice',
      options: ['Characters & Figures', 'Portraits & Faces', 'Digital Art & Painting', 'Anime & Manga', 'Landscapes & Environments', 'Comics & Storyboards', 'Concept Art'],
      required: true,
    },
    {
      id: 'draw_improve',
      topicSlug: 'drawing',
      question: 'What would you like to improve most?',
      type: 'multi_choice',
      options: ['Human Anatomy', 'Perspective & Depth', 'Lighting & Shading', 'Line Quality & Confidence', 'Color Harmony', 'Composition', 'Drawing from imagination'],
      required: true,
    },
    {
      id: 'draw_medium',
      topicSlug: 'drawing',
      question: 'What tools do you usually use?',
      type: 'single_choice',
      options: ['Tablet / iPad (Procreate, Clip Studio)', 'Traditional sketchbook & pencil', 'Graphics tablet on PC', 'Ballpoint pen & scrap paper', 'Mixed'],
      required: true,
    },
    {
      id: 'draw_subject_note',
      topicSlug: 'drawing',
      question: 'What do you love sketching when you sit down?',
      type: 'text',
      placeholder: 'e.g. Fantasy outfits, cute animals, cozy coffee shop corners.',
      required: false,
    },
  ],
  initialSkills: [
    { topicSlug: 'drawing', name: 'Gesture & Rhythm', description: 'Capturing dynamic lines of action with loose strokes.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 15, level: 1, xp: 15 },
    { topicSlug: 'drawing', name: 'Basic 3D Forms', description: 'Constructing boxes, cylinders, and spheres in space.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'drawing', name: 'Perspective & Horizons', description: '1-point and 2-point perspective grids.', orderIndex: 3, difficulty: 'beginner', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'drawing', name: 'Light & 5-Tone Value', description: 'Core shadows, midtones, and ambient occlusion.', orderIndex: 4, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'drawing', name: 'Anatomy Foundations', description: 'Torso rhythm, head proportions, and limbs.', orderIndex: 5, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'drawing', name: 'Color Harmonies', description: 'Complementary schemes and emotional palette design.', orderIndex: 6, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'drawing', name: 'Full Illustration Project', description: 'Taking an initial sketch to a finished artwork.', orderIndex: 7, difficulty: 'advanced', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_draw_shape_to_char_${Date.now()}`,
      userTopicId,
      topicName: 'Drawing & Art',
      skillId: 'Basic 3D Forms',
      skillName: 'Basic 3D Forms',
      title: 'Shape-to-Character Construction',
      description: 'Create a character silhouette starting with a circle, rectangle, and triangle as the primary volumes.',
      objective: 'Construct a character using basic geometric forms while maintaining consistent proportions.',
      categoryTypeBadge: 'DRAWING EXERCISE',
      type: 'practice',
      estimatedMinutes: 15,
      difficulty: 'beginner',
      materials: ['Sketchbook & Pencil' , 'Digital Drawing Stylus'],
      expectedOutcome: 'A completed character sketch constructed from geometric volumes with clean gesture.',
      hint: 'Stack the triangle for torso weight, circle for head balance, and cylinders for limbs.',
      example: 'Circle head -> Trapezoid chest -> Cylinder legs -> Wedge feet.',
      completionType: 'self_assessment_rubric',
      completionCriteria: ['Clear primary geometric forms', 'Balanced center of gravity', 'Harmonic proportions'],
      rewardXp: 35,
      progressImpact: 'Basic 3D Forms +16%',
      worldReward: {
        unlockKey: 'easel_canvas',
        name: 'Oil Painting Canvas',
        icon: '🎨',
        description: 'Artisan canvas on your studio easel',
      },
      whyThisQuest: 'Starting from primitive 3D shapes prevents stiff 2D tracing and gives your drawings depth.',
      steps: [
        {
          id: 'd_sc_1',
          title: 'The Power of Primitives',
          instruction: 'Every complex form—from animals to mech robots—can be simplified into three primitives: Sphere, Box, and Cylinder.',
          type: 'concept',
          content: 'Begin with 3 big shapes before drawing eyes or fingers:\n1. A circle for the head volume\n2. A tapered box/trapezoid for the ribcage\n3. Cylinders for the limbs',
        },
        {
          id: 'd_sc_2',
          title: 'Construction Principle Check',
          instruction: 'Why should you draw overlapping geometric volumes instead of just an outline?',
          type: 'interactive_choice',
          options: [
            'Overlapping forms establish 3D depth and foreshortening',
            'Outlines use too much graphite',
            'Flat drawing is forbidden by classical ateliers',
          ],
          correctOptionIndex: 0,
          explanation: 'Overlapping shapes create visual depth, making a character feel solid in 3D space!',
        },
        {
          id: 'd_sc_3',
          title: 'Hands-On Sketch Confirmation',
          instruction: 'Execute the 3-shape character layout on your paper or tablet.',
          type: 'micro_action',
        },
      ],
    },
    {
      id: `quest_draw_light_direction_${Date.now()}`,
      userTopicId,
      topicName: 'Drawing & Art',
      skillId: 'Light & 5-Tone Value',
      skillName: 'Light & 5-Tone Value',
      title: 'Light Direction Study',
      description: 'Draw the same head or sphere under three distinct light directions: front, side, and rim backlighting.',
      objective: 'Map core shadow, cast shadow, and ambient reflection across 3 lighting angles.',
      categoryTypeBadge: 'STUDY',
      type: 'challenge',
      estimatedMinutes: 20,
      difficulty: 'intermediate',
      materials: ['Pencil 2B/4B or Digital Soft Airbrush'],
      expectedOutcome: 'Three value studies demonstrating clear understanding of the terminator line.',
      hint: 'Find the terminator line—where light rays cannot touch the curving surface.',
      completionType: 'self_assessment_rubric',
      rewardXp: 40,
      progressImpact: 'Light & Value +20%',
      worldReward: {
        unlockKey: 'color_palette',
        name: 'Artist Color Wheel',
        icon: '🖌️',
        description: 'Handcrafted palette on your art stool',
      },
      whyThisQuest: 'Mastering value and shadow direction is what transforms flat sketches into 3-dimensional illusions.',
      steps: [
        {
          id: 'd_lt_1',
          title: 'The 5 Value Tones',
          instruction: 'Study the essential lighting anatomy.',
          type: 'concept',
          content: 'Every form lit by a single key light has:\n1. Highlight\n2. Midtone\n3. Core Shadow (the darkest part on the object)\n4. Reflected Light\n5. Cast Shadow (on the ground with hard edge)',
        },
        {
          id: 'd_lt_2',
          title: 'Core Shadow Identifier',
          instruction: 'Where is the "Core Shadow" located on a sphere?',
          type: 'interactive_choice',
          options: [
            'Right along the terminator line where the form turns away from the light',
            'Directly under the highlight',
            'On the ground underneath the sphere',
          ],
          correctOptionIndex: 0,
          explanation: 'The core shadow hugs the terminator line, where grazing light stops hitting the curvature!',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#ec4899',
      accent: '#f59e0b',
      ground: '#5c3a44',
      fog: '#1e1124',
    },
    stageLandmarks: {
      stage1: 'Small Sketch Corner & Stool',
      stage2: 'Wooden Artist Easel & Palette',
      stage3: 'Artisan Glass Studio',
      stage4: 'Exhibition Gallery Pavilion',
      stage5: 'Master Creative Art District',
    },
    ambientEffect: 'paint_splatters',
  },
};

// 3. PHOTOGRAPHY CONFIGURATION
export const PHOTOGRAPHY_CONFIG: TopicConfig = {
  topic: {
    id: 'photography',
    name: 'Photography',
    slug: 'photography',
    icon: '📸',
    description: 'Composition, natural lighting, camera optics, framing, and visual storytelling.',
    category: 'photo',
  },
  genericQuestions: [
    {
      id: 'photo_goal_generic',
      topicSlug: 'photography',
      question: 'What do you want to accomplish in Photography?',
      type: 'text',
      placeholder: 'e.g. Take moody street photos and stunning travel portraits.',
      required: true,
    },
    {
      id: 'photo_level',
      topicSlug: 'photography',
      question: 'What is your current experience with photography?',
      type: 'single_choice',
      options: ['Total beginner (just casual phone snaps)', 'Some experience with manual settings', 'Comfortable with exposure triangle', 'Experienced photographer'],
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'photo_genre',
      topicSlug: 'photography',
      question: 'What genres inspire you?',
      type: 'multi_choice',
      options: ['Street & City', 'Portraits & People', 'Nature & Landscapes', 'Travel & Architecture', 'Minimalist & Abstract', 'Food & Products'],
      required: true,
    },
    {
      id: 'photo_gear',
      topicSlug: 'photography',
      question: 'What do you usually shoot with?',
      type: 'single_choice',
      options: ['iPhone / Smartphone', 'Mirrorless Camera', 'DSLR Camera', 'Film Camera', 'Planning to get a camera'],
      required: true,
    },
    {
      id: 'photo_improve',
      topicSlug: 'photography',
      question: 'What skill do you want to master first?',
      type: 'single_choice',
      options: ['Framing & Rule of Thirds', 'Using Natural Light & Golden Hour', 'Manual Exposure (Aperture, Shutter, ISO)', 'Color Grading & Editing', 'Storytelling Moments'],
      required: true,
    },
  ],
  initialSkills: [
    { topicSlug: 'photography', name: 'Rule of Thirds & Framing', description: 'Harmonic grid alignment and leading lines.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 20, level: 1, xp: 20 },
    { topicSlug: 'photography', name: 'Direction of Light', description: 'Front light, side light, and rim backlighting.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'photography', name: 'Depth of Field', description: 'Bokeh blur vs tack-sharp landscapes.', orderIndex: 3, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'photography', name: 'Visual Storytelling', description: 'Capturing tension, emotion, and candid moments.', orderIndex: 4, difficulty: 'advanced', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_photo_three_ways_${Date.now()}`,
      userTopicId,
      topicName: 'Photography',
      skillId: 'Rule of Thirds & Framing',
      skillName: 'Rule of Thirds & Framing',
      title: 'Three Ways to Frame',
      description: 'Photograph one single subject using three completely different compositions and select your strongest image.',
      objective: 'Create three different compositions (wide contextual, tight third-alignment, low-angle dynamic) using the same subject.',
      categoryTypeBadge: 'FIELD ASSIGNMENT',
      type: 'challenge',
      estimatedMinutes: 15,
      difficulty: 'intermediate',
      materials: ['Smartphone Camera or Dedicated Camera'],
      expectedOutcome: 'Three distinct photographs demonstrating deliberate framing choices + one chosen hero shot.',
      hint: 'Move your feet! Don\'t just zoom—crouch low or stand on a step.',
      completionType: 'self_assessment_rubric',
      completionCriteria: ['Shot 1: Establishing contextual wide', 'Shot 2: Rule of thirds crop', 'Shot 3: Low-angle dramatic perspective'],
      rewardXp: 35,
      progressImpact: 'Composition & Framing +18%',
      worldReward: {
        unlockKey: 'gallery_frame',
        name: 'Mounted Gallery Frame',
        icon: '📸',
        description: 'Framed exhibition photograph on your district display wall',
      },
      whyThisQuest: 'Forces you to explore angles before settling on the default standing eye-level shot.',
      steps: [
        {
          id: 'p_tw_1',
          title: 'The Eye-Level Trap',
          instruction: 'Most beginner photos look boring because they are shot from standing height (5.5 ft).',
          type: 'concept',
          content: 'To capture compelling photos:\n1. Wide contextual view (giving the subject room)\n2. Tight rule-of-thirds intersection (focusing on emotion/texture)\n3. Extreme low angle (making the subject heroic and eliminating messy backgrounds)',
        },
        {
          id: 'p_tw_2',
          title: 'Framing Geometry Check',
          instruction: 'Which framing choice creates the greatest sense of stature and scale?',
          type: 'interactive_choice',
          options: [
            'Shooting from below eye level angled slightly upward',
            'Shooting from chest height with standard zoom',
            'Shooting from high above looking straight down',
          ],
          correctOptionIndex: 0,
          explanation: 'Low angles elongate the subject against the sky, conveying presence and authority!',
        },
        {
          id: 'p_tw_3',
          title: 'Field Execution Check',
          instruction: 'Photograph your subject using these three angles now and pick your favorite.',
          type: 'micro_action',
        },
      ],
    },
    {
      id: `quest_photo_natural_light_${Date.now()}`,
      userTopicId,
      topicName: 'Photography',
      skillId: 'Direction of Light',
      skillName: 'Direction of Light',
      title: 'Natural Light Portrait Study',
      description: 'Take two portraits using natural window light from different directions and compare the mood.',
      objective: 'Observe the difference between direct front lighting and 45-degree side lighting (Rembrandt triangle).',
      categoryTypeBadge: 'PHOTOGRAPHY ASSIGNMENT',
      type: 'practice',
      estimatedMinutes: 20,
      difficulty: 'intermediate',
      materials: ['Camera or Smartphone with Portrait mode', 'A window with indirect daylight'],
      expectedOutcome: 'Two photos comparing flat lighting vs dimensional side-lit shadow depth.',
      hint: 'Place your subject 3-4 feet away from the window at a 45-degree angle.',
      completionType: 'self_assessment_rubric',
      rewardXp: 40,
      progressImpact: 'Direction of Light +15%',
      worldReward: {
        unlockKey: 'darkroom_lantern',
        name: 'Darkroom Red Lantern',
        icon: '🏮',
        description: 'Vintage darkroom lamp on your photo desk',
      },
      whyThisQuest: 'Light direction determines emotion and facial depth. Flat front light washes out jawlines.',
      steps: [
        {
          id: 'p_nl_1',
          title: 'Front vs Side Light Depth',
          instruction: 'Observe how light direction sculpts facial features.',
          type: 'concept',
          content: 'Direct front light reduces shadows, creating a bright passport-like look. Side light at 45 degrees casts soft shadow across the nose and cheek, creating natural 3D depth and cinematic drama.',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#f59e0b',
      accent: '#38bdf8',
      ground: '#3f3933',
      fog: '#1c1917',
    },
    stageLandmarks: {
      stage1: 'Tripod Outlook Over Sea',
      stage2: 'Darkroom Red Lantern Booth',
      stage3: 'Studio Softbox & Photo Wall',
      stage4: 'Panoramic Horizon Gallery',
      stage5: 'Master Visual Arts Pavilion',
    },
    ambientEffect: 'photo_flash',
  },
};

// 4. ENGLISH / LANGUAGE CONFIGURATION
export const ENGLISH_CONFIG: TopicConfig = {
  topic: {
    id: 'english',
    name: 'English Fluency',
    slug: 'english',
    icon: '🇬🇧',
    description: 'Spoken conversation, idioms, fluid storytelling, and confident communication.',
    category: 'language',
  },
  genericQuestions: [
    {
      id: 'eng_goal_generic',
      topicSlug: 'english',
      question: 'What is your main English dream?',
      type: 'text',
      placeholder: 'e.g. Speak smoothly in everyday conversations without freezing or overthinking.',
      required: true,
    },
    {
      id: 'eng_level',
      topicSlug: 'english',
      question: 'How confident do you feel speaking English right now?',
      type: 'single_choice',
      options: ['Very nervous / Hesitant', 'Basic sentences with pauses', 'Comfortable in casual chats', 'Fluent but want advanced idioms'],
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'eng_context',
      topicSlug: 'english',
      question: 'What kind of English do you care about most?',
      type: 'single_choice',
      options: ['Everyday casual conversations & friends', 'Career / Professional English', 'Travel & Navigation', 'Watching movies & reading books', 'Academic & School'],
      required: true,
    },
    {
      id: 'eng_bottleneck',
      topicSlug: 'english',
      question: 'What is your biggest obstacle when speaking?',
      type: 'multi_choice',
      options: ['Finding the right word in time', 'Grammar fear (worrying about mistakes)', 'Pronunciation & accent', 'Understanding fast native speakers', 'Structuring thoughts smoothly'],
      required: true,
    },
  ],
  initialSkills: [
    { topicSlug: 'english', name: 'Conversational Connectors', description: 'Smooth fillers and transition phrases.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 25, level: 1, xp: 25 },
    { topicSlug: 'english', name: 'Active Daily Idioms', description: 'Expressions native speakers use every hour.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'english', name: 'The 60-Second Story Hook', description: 'Engaging people with three-beat stories.', orderIndex: 3, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'english', name: 'Nuance & Softening', description: 'Disagreeing politely and expressing shades of opinion.', orderIndex: 4, difficulty: 'advanced', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_eng_connect_${Date.now()}`,
      userTopicId,
      topicName: 'English Fluency',
      skillId: 'Conversational Connectors',
      skillName: 'Conversational Connectors',
      title: 'Conversational Cushions',
      description: 'Replace awkward pauses with natural connectors like "as it turns out".',
      type: 'lesson',
      estimatedMinutes: 5,
      difficulty: 'beginner',
      rewardXp: 20,
      whyThisQuest: 'Gives your brain time to form sentences naturally while keeping the conversation flowing.',
      steps: [
        {
          id: 'e1',
          title: 'Thought Connectors',
          instruction: 'Learn how native speakers buy thinking time.',
          type: 'concept',
          content: 'Instead of saying "Um...", try:\n- "The interesting thing is..."\n- "As it turns out..."\n- "Actually, now that I think about it..."',
        },
        {
          id: 'e2',
          title: 'Context Fit',
          instruction: 'Which phrase sounds most natural in casual conversation?',
          type: 'interactive_choice',
          options: ['"As it turns out, it was surprisingly simple"', '"Thus it is concluded"', '"Hereby I acknowledge"'],
          correctOptionIndex: 0,
          explanation: '"As it turns out" is warm, friendly, and natural!',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#3b82f6',
      accent: '#f97316',
      ground: '#334155',
      fog: '#0f172a',
    },
    stageLandmarks: {
      stage1: 'Open Wooden Gazebo with Stacked Books',
      stage2: 'Reading Armchair & Hanging Lamp',
      stage3: 'Cozy Language Café Pergola',
      stage4: 'Grand Open-Air Library',
      stage5: 'International Cultural Academy',
    },
    ambientEffect: 'floating_words',
  },
};

// 5. MUSIC CONFIGURATION
export const MUSIC_CONFIG: TopicConfig = {
  topic: {
    id: 'music',
    name: 'Music & Instrument',
    slug: 'music',
    icon: '🎵',
    description: 'Ear training, piano/guitar chords, rhythm groove, and songwriting craft.',
    category: 'music',
  },
  genericQuestions: [
    {
      id: 'mus_goal_generic',
      topicSlug: 'music',
      question: 'What do you want to accomplish in Music?',
      type: 'text',
      placeholder: 'e.g. Play my favorite songs on piano and write simple melodies.',
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'mus_instrument',
      topicSlug: 'music',
      question: 'What instrument are you focusing on?',
      type: 'single_choice',
      options: ['Piano / Keyboard', 'Acoustic Guitar', 'Electric Guitar / Bass', 'Singing / Vocals', 'Music Production / Beats', 'Ukulele / Other'],
      required: true,
    },
    {
      id: 'mus_skills_focus',
      topicSlug: 'music',
      question: 'What would you like to master?',
      type: 'multi_choice',
      options: ['Chords & Harmony', 'Ear Training & Playing by ear', 'Rhythm & Timing', 'Reading Sheet Music / Tabs', 'Improvising Melodies'],
      required: true,
    },
  ],
  initialSkills: [
    { topicSlug: 'music', name: 'Pentatonic Magic', description: 'The 5-note scale where no note clashes.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 20, level: 1, xp: 20 },
    { topicSlug: 'music', name: 'Root Notes & Triads', description: 'Major and minor chord foundations.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'music', name: 'Rhythmic Pulse', description: 'Internal metronome and syncopation.', orderIndex: 3, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_mus_pentatonic_${Date.now()}`,
      userTopicId,
      topicName: 'Music & Instrument',
      skillId: 'Pentatonic Magic',
      skillName: 'Pentatonic Magic',
      title: 'The Magic 5-Note Pentatonic Scale',
      description: 'Discover the scale where every single note sounds harmonious together.',
      type: 'lesson',
      estimatedMinutes: 6,
      difficulty: 'beginner',
      rewardXp: 20,
      whyThisQuest: 'Allows immediate soulful melodic improvisation without dissonant mistakes.',
      steps: [
        {
          id: 'm1',
          title: 'No Clashing Half-Steps',
          instruction: 'Only play black keys on a piano to hear instant pentatonic harmony.',
          type: 'concept',
          content: 'The pentatonic scale leaves out the two tense half-steps of the major scale, making every note combination pleasant.',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#a855f7',
      accent: '#eab308',
      ground: '#4a2c5a',
      fog: '#190e24',
    },
    stageLandmarks: {
      stage1: 'Acoustic Podium & Lute Stand',
      stage2: 'Brass Gramophone & Piano Bench',
      stage3: 'Acoustic Recording Pavilion',
      stage4: 'Surround Amphitheater Stage',
      stage5: 'Master Harmonic Concert Hall',
    },
    ambientEffect: 'music_notes',
  },
};

// 6. COOKING CONFIGURATION
export const COOKING_CONFIG: TopicConfig = {
  topic: {
    id: 'cooking',
    name: 'Culinary & Cooking',
    slug: 'cooking',
    icon: '🍳',
    description: 'Flavor balance, artisanal baking, knife skills, and wholesome meals.',
    category: 'culinary',
  },
  genericQuestions: [
    {
      id: 'cook_goal',
      topicSlug: 'cooking',
      question: 'What do you want to accomplish in the kitchen?',
      type: 'text',
      placeholder: 'e.g. Cook delicious healthy dinners without stress and balance seasonings like a chef.',
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'cook_focus',
      topicSlug: 'cooking',
      question: 'What kind of cooking excites you?',
      type: 'multi_choice',
      options: ['Quick 20-minute weeknight dinners', 'Baking & Artisan Bread', 'Flavor pairing & Sauces', 'International cuisine', 'Healthy meal prep'],
      required: true,
    },
    {
      id: 'cook_knife',
      topicSlug: 'cooking',
      question: 'How confident are you with a chef knife?',
      type: 'single_choice',
      options: ['Beginner / Nervous about cutting fingers', 'Comfortable with basic chopping', 'Fast and confident'],
      required: true,
    },
  ],
  initialSkills: [
    { topicSlug: 'cooking', name: 'Flavor Balancing: Salt, Fat, Acid, Heat', description: 'The four levers of delicious food.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 25, level: 1, xp: 25 },
    { topicSlug: 'cooking', name: 'Knife Fundamentals: Claw Grip', description: 'Safety, speed, and consistent dice sizes.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'cooking', name: 'Pan Searing & Fond', description: 'Building deep pan sauces with fond deglazing.', orderIndex: 3, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_cook_acid_${Date.now()}`,
      userTopicId,
      topicName: 'Culinary & Cooking',
      skillId: 'Flavor Balancing: Salt, Fat, Acid, Heat',
      skillName: 'Flavor Balancing: Salt, Fat, Acid, Heat',
      title: 'The Acid Lift: Transforming Flat Dishes',
      description: 'Learn why a splash of lemon juice or vinegar rescues dull soups and sauces.',
      type: 'lesson',
      estimatedMinutes: 5,
      difficulty: 'beginner',
      rewardXp: 20,
      whyThisQuest: 'Acid cuts through heavy fats and activates salivation, bringing all flavors to life.',
      steps: [
        {
          id: 'c1',
          title: 'Brightening Flavors',
          instruction: 'When a soup tastes flat, it usually needs acid, not more salt.',
          type: 'concept',
          content: 'A squeeze of lime or teaspoon of vinegar cuts through rich olive oils and brings deep savory aromatics forward.',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#ef4444',
      accent: '#f59e0b',
      ground: '#57382d',
      fog: '#24120c',
    },
    stageLandmarks: {
      stage1: 'Outdoor Herb Planters & Stone Table',
      stage2: 'Cast Iron Stove & Prep Counter',
      stage3: 'Artisan Brick Pizza Oven',
      stage4: 'Garden Greenhouse Kitchen',
      stage5: 'Master Culinary Conservatory',
    },
    ambientEffect: 'herb_spores',
  },
};

// 7. CHESS CONFIGURATION
export const CHESS_CONFIG: TopicConfig = {
  topic: {
    id: 'chess',
    name: 'Chess Strategy',
    slug: 'chess',
    icon: '♟️',
    description: 'Tactical motifs, opening principles, board calculation, and calm strategy.',
    category: 'tactics',
  },
  genericQuestions: [
    {
      id: 'chess_goal',
      topicSlug: 'chess',
      question: 'What is your chess aspiration?',
      type: 'text',
      placeholder: 'e.g. Reach 1200 rating and spot forks and pins effortlessly.',
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'chess_exp',
      topicSlug: 'chess',
      question: 'What is your chess background?',
      type: 'single_choice',
      options: ['Complete beginner (just learned how pieces move)', 'Know basic checkmates and played casually', 'Intermediate (play on Chess.com / Lichess)', 'Club player'],
      required: true,
    },
    {
      id: 'chess_focus',
      topicSlug: 'chess',
      question: 'What part of your game hurts you most?',
      type: 'multi_choice',
      options: ['Blundering hanging pieces', 'Opening principles & traps', 'Tactical patterns (pins, forks, skewers)', 'Endgame technique', 'Time management in rapid/blitz'],
      required: true,
    },
  ],
  initialSkills: [
    { topicSlug: 'chess', name: 'Tactical Vision: Forks & Pins', description: 'Attacking two targets at once.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 20, level: 1, xp: 20 },
    { topicSlug: 'chess', name: 'Opening Fundamentals', description: 'Center control, knight before bishop, king safety.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'chess', name: 'Pawn Structure & Endgames', description: 'Passed pawns and king opposition.', orderIndex: 3, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_chess_fork_${Date.now()}`,
      userTopicId,
      topicName: 'Chess Strategy',
      skillId: 'Tactical Vision: Forks & Pins',
      skillName: 'Tactical Vision: Forks & Pins',
      title: 'The Knight Fork Trap',
      description: 'Learn how knights leap across barriers to threaten the King and Queen simultaneously.',
      type: 'practice',
      estimatedMinutes: 6,
      difficulty: 'beginner',
      rewardXp: 25,
      whyThisQuest: 'Forks decide 60% of beginner games. Spotting them saves pieces and wins games.',
      steps: [
        {
          id: 'ch1',
          title: 'The Geometry of the Fork',
          instruction: 'A fork occurs when one piece attacks two or more enemy pieces simultaneously.',
          type: 'concept',
          content: 'Because the knight jumps over other pieces, an opponent cannot block a knight fork—they must move the king, leaving the other piece hanging.',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#64748b',
      accent: '#fbbf24',
      ground: '#334155',
      fog: '#0f172a',
    },
    stageLandmarks: {
      stage1: 'Giant Stone Checkerboard Table',
      stage2: 'Carved Marble Knight Pedestal',
      stage3: 'Grandmaster Tactics Pergola',
      stage4: 'Tactical Observatory Pavilion',
      stage5: 'Citadel of Chess Strategy',
    },
    ambientEffect: 'chess_squares',
  },
};

// 8. SCIENCE CONFIGURATION
export const SCIENCE_CONFIG: TopicConfig = {
  topic: {
    id: 'science',
    name: 'Science & Cosmos',
    slug: 'science',
    icon: '🔬',
    description: 'Astronomy, neuroscience, quantum optics, and physical curiosity.',
    category: 'science',
  },
  genericQuestions: [
    {
      id: 'sci_goal',
      topicSlug: 'science',
      question: 'What sparks your scientific curiosity?',
      type: 'text',
      placeholder: 'e.g. Understand astrophysical scales, black holes, and planetary mechanics.',
      required: true,
    },
  ],
  topicSpecificQuestions: [
    {
      id: 'sci_fields',
      topicSlug: 'science',
      question: 'Which areas fascinate you?',
      type: 'multi_choice',
      options: ['Astronomy & Cosmos', 'Neuroscience & Human Brain', 'Quantum & Fundamental Physics', 'Microbiology & Genetics', 'Earth & Climate Systems'],
      required: true,
    },
  ],
  initialSkills: [
    { topicSlug: 'science', name: 'Cosmic Scales & Light-Years', description: 'Visualizing astronomical distances and speed of light.', orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 20, level: 1, xp: 20 },
    { topicSlug: 'science', name: 'Rayleigh Atmospheric Scattering', description: 'Why the sky is blue and sunsets glow red.', orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
    { topicSlug: 'science', name: 'Gravity & Orbital Mechanics', description: 'How moons orbit planets without falling in.', orderIndex: 3, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
  ],
  starterQuests: (userTopicId: string) => [
    {
      id: `quest_sci_light_${Date.now()}`,
      userTopicId,
      topicName: 'Science & Cosmos',
      skillId: 'Cosmic Scales & Light-Years',
      skillName: 'Cosmic Scales & Light-Years',
      title: 'Looking Back in Time with Sunlight',
      description: 'Discover why looking at stars is literally looking into ancient history.',
      type: 'lesson',
      estimatedMinutes: 6,
      difficulty: 'beginner',
      rewardXp: 20,
      whyThisQuest: 'Every photon from the sun left 8 minutes ago. The universe is a living time machine.',
      steps: [
        {
          id: 'sc1',
          title: 'Speed of Light Constraints',
          instruction: 'Light travels at ~300,000 km per second.',
          type: 'concept',
          content: 'Because space is vast, when you look at Alpha Centauri, you are seeing light that left over 4 years ago.',
        },
      ],
    },
  ],
  worldConfig: {
    colorPalette: {
      primary: '#0ea5e9',
      accent: '#8b5cf6',
      ground: '#1e293b',
      fog: '#090d16',
    },
    stageLandmarks: {
      stage1: 'Brass Telescope on Stone Plinth',
      stage2: 'Orbital Planetarium & Flasks',
      stage3: 'Deep Space Glass Dome',
      stage4: 'Planetary Research Observatory',
      stage5: 'Cosmic Astrolab Citadel',
    },
    ambientEffect: 'orbit_dust',
  },
};

// 9. DYNAMIC CUSTOM TOPIC GENERATOR
export function generateCustomTopicConfig(customName: string): TopicConfig {
  const slug = customName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return {
    topic: {
      id: slug,
      name: customName,
      slug,
      icon: '🌱',
      description: `Personalized discovery and progression in ${customName}.`,
      category: 'custom',
      isCustom: true,
    },
    genericQuestions: [
      {
        id: `${slug}_goal`,
        topicSlug: slug,
        question: `What do you want to accomplish in ${customName}?`,
        type: 'text',
        placeholder: `e.g. Master the foundations of ${customName} and create my first project.`,
        required: true,
      },
      {
        id: `${slug}_why`,
        topicSlug: slug,
        question: `Why does ${customName} matter to you?`,
        type: 'multi_choice',
        options: ['Genuinely curious & fun', 'Personal passion project', 'Career / Future opportunity', 'Self-improvement', 'To challenge myself'],
        required: true,
      },
      {
        id: `${slug}_level`,
        topicSlug: slug,
        question: `What is your current level in ${customName}?`,
        type: 'single_choice',
        options: ['Complete beginner', 'Some experience', 'Intermediate', 'Advanced'],
        required: true,
      },
      {
        id: `${slug}_time`,
        topicSlug: slug,
        question: 'How much time feels realistic for a session?',
        type: 'single_choice',
        options: ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '30 minutes'],
        required: true,
      },
    ],
    topicSpecificQuestions: [
      {
        id: `${slug}_focus_sub`,
        topicSlug: slug,
        question: `Which specific area of ${customName} excites you most?`,
        type: 'text',
        placeholder: `e.g. Key techniques, creative tools, or practical experiments in ${customName}.`,
        required: true,
      },
      {
        id: `${slug}_style`,
        topicSlug: slug,
        question: `How do you prefer learning ${customName}?`,
        type: 'single_choice',
        options: ['Hands-on experiments & building', 'Step-by-step breakdowns & reading', 'Solving small puzzles', 'Visual demonstrations & examples'],
        required: true,
      },
    ],
    initialSkills: [
      { topicSlug: slug, name: `Core Foundations of ${customName}`, description: `The essential mental models and basics of ${customName}.`, orderIndex: 1, difficulty: 'beginner', status: 'active', progressPercentage: 20, level: 1, xp: 20 },
      { topicSlug: slug, name: `Practical Techniques & Tools`, description: `Working hands-on with the primary mechanics of ${customName}.`, orderIndex: 2, difficulty: 'beginner', status: 'available', progressPercentage: 0, level: 1, xp: 0 },
      { topicSlug: slug, name: `Creative Experimentation`, description: `Applying concepts into a personal mini creation.`, orderIndex: 3, difficulty: 'intermediate', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
      { topicSlug: slug, name: `Mastery & Synthesis`, description: `Advanced nuances and connecting ideas smoothly.`, orderIndex: 4, difficulty: 'advanced', status: 'locked', progressPercentage: 0, level: 1, xp: 0 },
    ],
    starterQuests: (userTopicId: string) => [
      {
        id: `quest_${slug}_start_${Date.now()}`,
        userTopicId,
        topicName: customName,
        skillId: `Core Foundations of ${customName}`,
        skillName: `Core Foundations of ${customName}`,
        title: `The 5-Minute Core Spark in ${customName}`,
        description: `Explore the single most important principle that drives 80% of results in ${customName}.`,
        type: 'lesson',
        estimatedMinutes: 5,
        difficulty: 'beginner',
        rewardXp: 20,
        whyThisQuest: `Matched directly to your new goal in ${customName}.`,
        steps: [
          {
            id: 'cq1',
            title: 'Deconstructing the Core',
            instruction: `Focus on the primary lever that unlocks ${customName}.`,
            type: 'concept',
            content: `When approaching ${customName}, experts don't try to memorize everything. They isolate the primary lever—the core intuition that makes all other pieces click into place.\n\nTake two minutes to visualize what success in ${customName} looks and feels like.`,
          },
          {
            id: 'cq2',
            title: 'Active Spark Note',
            instruction: 'What is one specific thing you want to test first?',
            type: 'reflection',
            promptQuestion: `What made you want to dive into ${customName} today?`,
          },
        ],
      },
    ],
    worldConfig: {
      colorPalette: {
        primary: '#10b981',
        accent: '#f59e0b',
        ground: '#36493f',
        fog: '#131e1a',
      },
      stageLandmarks: {
        stage1: `Quiet Study Desk for ${customName}`,
        stage2: `Creative Workshop Booth`,
        stage3: `Dedicated Atelier for ${customName}`,
        stage4: `Open District Pavilion`,
        stage5: `Master Guild of ${customName}`,
      },
      ambientEffect: 'herb_spores',
    },
  };
}

export const ALL_PREDEFINED_TOPIC_CONFIGS: Record<string, TopicConfig> = {
  programming: PROGRAMMING_CONFIG,
  drawing: DRAWING_CONFIG,
  photography: PHOTOGRAPHY_CONFIG,
  english: ENGLISH_CONFIG,
  music: MUSIC_CONFIG,
  cooking: COOKING_CONFIG,
  chess: CHESS_CONFIG,
  science: SCIENCE_CONFIG,
};

export function getTopicConfig(slugOrName: string): TopicConfig {
  const norm = slugOrName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  for (const [key, cfg] of Object.entries(ALL_PREDEFINED_TOPIC_CONFIGS)) {
    if (key === norm || cfg.topic.slug === norm || cfg.topic.name.toLowerCase() === slugOrName.toLowerCase()) {
      return cfg;
    }
  }
  return generateCustomTopicConfig(slugOrName);
}
