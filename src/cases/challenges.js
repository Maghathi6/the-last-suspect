import { case01 } from './case01.js';

export const challenges = [
  // =========================================================================
  // CHALLENGE 01: THE LAST SAMOSA (Easy ★☆☆)
  // =========================================================================
  {
    id: 'challenge_01',
    caseId: 'case01',
    title: 'THE LAST SAMOSA',
    subtitle: 'One samosa. Five suspects. Four timeslots.',
    difficulty: 'Easy',
    stars: '★☆☆',
    premise: 'At 4:30 PM, exactly one samosa remained in the college canteen. At 4:45 PM, the samosa was gone. Five students were somewhere around campus.',
    initialFacts: [
      'The samosa was present at 4:30 PM.',
      'The samosa was missing by 4:45 PM.',
      'The incident happened between 4:30 PM and 4:45 PM.',
      'Students can move only between directly connected campus locations.',
      'Movement happens in 5-minute intervals.',
      'A student cannot occupy two locations at the same time.',
      'The exact movements are NOT initially known.'
    ],
    suspects: [
      { id: 'sus_arun', name: 'ARUN', role: 'The Topper', feature: 'Blue Backpack', featureDesc: 'Carries a distinct blue laptop bag everywhere.' },
      { id: 'sus_priya', name: 'PRIYA', role: 'The Procrastinator', feature: 'Red Notebook', featureDesc: 'Holds a bright red spiral assignment notebook.' },
      { id: 'sus_karthik', name: 'KARTHIK', role: 'The Canteen Regular', feature: 'Black Cap', featureDesc: 'Wears a dark black baseball cap.' },
      { id: 'sus_meena', name: 'MEENA', role: 'The Gossip Queen', feature: 'Green Water Bottle', featureDesc: 'Carries a pastel green water bottle.' },
      { id: 'sus_rahul', name: 'RAHUL', role: 'The Silent Student', feature: 'Headphones', featureDesc: 'Wears bulky black noise-canceling headphones.' }
    ],
    locations: [
      { id: 'loc_canteen', name: 'Canteen', desc: 'Where the last samosa sat on the counter.' },
      { id: 'loc_main', name: 'Main Block', desc: 'Central administrative corridor with CCTV.' },
      { id: 'loc_library', name: 'Library', desc: 'Quiet study reading room with digital swipe gate.' },
      { id: 'loc_lab', name: 'Computer Lab', desc: 'Air-conditioned lab with PC login logs.' },
      { id: 'loc_seminar', name: 'Seminar Hall', desc: 'Auditorium podium with sign-in register.' }
    ],
    times: ['4:30 PM', '4:35 PM', '4:40 PM', '4:45 PM'],
    edges: [
      ['loc_library', 'loc_main'],
      ['loc_main', 'loc_canteen'],
      ['loc_main', 'loc_lab'],
      ['loc_lab', 'loc_seminar']
    ],
    clues: [
      {
        id: 'clue_1',
        title: 'Library Entrance Swipe Log',
        type: 'DIRECT_FACT',
        text: 'Library digital gate log confirms a student carrying a Blue Backpack swiped into the Library reading room at 4:30 PM.',
        purpose: 'Establishes Arun starting location at 4:30 PM.',
        eliminates: ['Arun in Canteen at 4:30 PM'],
        deductionOptions: [
          {
            id: 'd1_correct',
            label: 'Arun (Blue Backpack) was in Library at 4:30 PM',
            isCorrect: true,
            suspectId: 'sus_arun',
            time: '4:30 PM',
            locationId: 'loc_library',
            status: '✓'
          },
          { id: 'd1_wrong', label: 'Priya was in Library at 4:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_2',
        title: 'Computer Lab Sign-in Register',
        type: 'DIRECT_FACT',
        text: 'Computer Lab sign-in register shows a student holding a Red Notebook signed into the Lab at 4:35 PM.',
        purpose: 'Establishes Priya location at 4:35 PM.',
        eliminates: ['Priya in Canteen at 4:35 PM'],
        deductionOptions: [
          {
            id: 'd2_correct',
            label: 'Priya (Red Notebook) was in Computer Lab at 4:35 PM',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '4:35 PM',
            locationId: 'loc_lab',
            status: '✓'
          },
          { id: 'd2_wrong', label: 'Meena was in Computer Lab at 4:35 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_3',
        title: 'Main Block Corridor Security Footage',
        type: 'MOVEMENT_FACT',
        text: 'Security CCTV camera in Main Block corridor captures someone carrying a Blue Backpack walking through at 4:35 PM.',
        purpose: 'Establishes Arun at Main Block at 4:35 PM.',
        eliminates: ['Arun in Canteen at 4:35 PM'],
        deductionOptions: [
          {
            id: 'd3_correct',
            label: 'Arun (Blue Backpack) was in Main Block at 4:35 PM',
            isCorrect: true,
            suspectId: 'sus_arun',
            time: '4:35 PM',
            locationId: 'loc_main',
            status: '✓'
          },
          { id: 'd3_wrong', label: 'Karthik was in Main Block at 4:35 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_4',
        title: 'Seminar Hall Event Register',
        type: 'TIME_FACT',
        text: 'The podium sign-in log proves a student holding a Green Water Bottle stayed inside Seminar Hall from 4:30 PM to 4:40 PM.',
        purpose: 'Establishes Meena in Seminar Hall for 4:30, 4:35, 4:40 PM.',
        eliminates: ['Meena in Canteen at 4:35 PM'],
        deductionOptions: [
          {
            id: 'd4_correct',
            label: 'Meena (Green Water Bottle) was in Seminar Hall (4:30–4:40 PM)',
            isCorrect: true,
            suspectId: 'sus_meena',
            time: '4:35 PM',
            locationId: 'loc_seminar',
            status: '✓'
          },
          { id: 'd4_wrong', label: 'Arun was in Seminar Hall at 4:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_5',
        title: 'Canteen Security Clip',
        type: 'WITNESS_STATEMENT',
        text: 'Canteen CCTV clip shows a student wearing Headphones sitting asleep in the Canteen corner from 4:30 PM to 4:45 PM without standing up once.',
        purpose: 'Establishes Rahul in Canteen asleep, ruling him out as active thief.',
        eliminates: ['Rahul as active samosa thief'],
        deductionOptions: [
          {
            id: 'd5_correct',
            label: 'Rahul (Headphones) was asleep in Canteen (4:30–4:45 PM)',
            isCorrect: true,
            suspectId: 'sus_rahul',
            time: '4:35 PM',
            locationId: 'loc_canteen',
            status: '✓'
          },
          { id: 'd5_wrong', label: 'Rahul was in Computer Lab at 4:35 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_6',
        title: 'Computer Lab System Login Record',
        type: 'DIRECT_FACT',
        text: 'Computer Lab system log #04 confirms a student wearing a Black Cap logged in at 4:30 PM and logged in again at 4:40 PM.',
        purpose: 'Establishes Karthik in Computer Lab at 4:30 PM & 4:40 PM.',
        eliminates: ['Karthik in Canteen at 4:30 PM', 'Karthik in Canteen at 4:40 PM'],
        deductionOptions: [
          {
            id: 'd6_correct',
            label: 'Karthik (Black Cap) was in Computer Lab at 4:30 PM & 4:40 PM',
            isCorrect: true,
            suspectId: 'sus_karthik',
            time: '4:30 PM',
            locationId: 'loc_lab',
            status: '✓'
          },
          { id: 'd6_wrong', label: 'Karthik was in Canteen at 4:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_7',
        title: 'Canteen Counter Receipt',
        type: 'OBJECT_CLUE',
        text: 'A printed receipt at the Canteen counter shows a tea order at 4:35 PM. Counter attendant remembers someone wearing a Black Cap ordering tea.',
        purpose: 'Places Karthik (Black Cap) at Canteen counter at 4:35 PM.',
        eliminates: ['Karthik outside Canteen at 4:35 PM'],
        deductionOptions: [
          {
            id: 'd7_correct',
            label: 'Karthik (Black Cap) was in Canteen at 4:35 PM ordering tea',
            isCorrect: true,
            suspectId: 'sus_karthik',
            time: '4:35 PM',
            locationId: 'loc_canteen',
            status: '✓'
          },
          { id: 'd7_wrong', label: 'Arun ordered tea at 4:35 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_8',
        title: "Priya's Canteen Water Arrival",
        type: 'NEGATIVE_FACT',
        text: 'A student with a Red Notebook walked into the Canteen at 4:40 PM to get water and observed the samosa counter was already empty.',
        purpose: 'Fixes theft time window to 4:35 PM.',
        eliminates: ['Theft at 4:40 PM', 'Theft at 4:45 PM'],
        deductionOptions: [
          {
            id: 'd8_correct',
            label: 'Priya (Red Notebook) arrived at Canteen at 4:40 PM (samosa already gone)',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '4:40 PM',
            locationId: 'loc_canteen',
            status: '✓'
          },
          { id: 'd8_wrong', label: 'Samosa was taken at 4:40 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_9',
        title: 'Seminar Hall Notice Board Log',
        type: 'CONDITIONAL_FACT',
        text: 'Security log shows a student carrying a Blue Backpack entered Seminar Hall at 4:40 PM to inspect exam paper posters.',
        purpose: 'Verifies Arun route: Library (4:30) → Main Block (4:35) → Seminar Hall (4:40), proving he never visited Canteen.',
        eliminates: ['Arun in Canteen at 4:35 PM or 4:40 PM'],
        deductionOptions: [
          {
            id: 'd9_correct',
            label: 'Arun (Blue Backpack) reached Seminar Hall at 4:40 PM',
            isCorrect: true,
            suspectId: 'sus_arun',
            time: '4:40 PM',
            locationId: 'loc_seminar',
            status: '✓'
          },
          { id: 'd9_wrong', label: 'Arun was at Canteen at 4:40 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_10',
        title: 'Campus Network Traversal Synthesis',
        type: 'CONDITIONAL_FACT',
        text: 'Campus traversal synthesis confirms that at 4:35 PM, Arun was at Main Block, Priya was at Lab, Meena was in Seminar Hall, and Rahul was asleep. Karthik is the only suspect at the Canteen at 4:35 PM.',
        purpose: 'Forces final elimination of all suspects except Karthik.',
        eliminates: ['All suspects except Karthik'],
        deductionOptions: [
          {
            id: 'd10_correct',
            label: 'Karthik is the only active suspect at Canteen at 4:35 PM',
            isCorrect: true,
            suspectId: 'sus_karthik',
            time: '4:35 PM',
            locationId: 'loc_canteen',
            status: '✓'
          }
        ]
      }
    ],
    hints: [
      { id: 'h1', text: 'HINT 1: Look at where each suspect was positioned at 4:35 PM on the Campus Graph map.', cost: 10 },
      { id: 'h2', text: 'HINT 2: Arun (Main Block), Priya (Lab), and Meena (Seminar Hall) were all documented elsewhere at 4:35 PM.', cost: 10 },
      { id: 'h3', text: 'HINT 3: Karthik\'s tea slip places him at the Canteen counter at 4:35 PM while Rahul was asleep.', cost: 10 }
    ],
    solution: {
      suspect: 'sus_karthik',
      suspectName: 'KARTHIK',
      location: 'loc_canteen',
      locationName: 'Canteen',
      time: '4:35 PM',
      object: 'samosa',
      evidenceId: 'clue_7',
      evidenceTitle: 'Canteen Counter Receipt (4:35 PM)',
      summary: 'At 4:35 PM: Arun was at Main Block; Priya was at Computer Lab; Meena was in Seminar Hall; Rahul was asleep at Canteen. Karthik (Black Cap) logged out of Lab at 4:33 PM, arrived at Canteen at 4:35 PM to buy tea, took the unattended samosa while Rahul slept, and returned to Lab by 4:40 PM.',
      explanationSteps: [
        '1. Rahul was asleep in the Canteen corner continuously from 4:30 PM to 4:45 PM.',
        '2. Security CCTV and Lab registers placed Arun, Priya, and Meena at non-canteen locations at 4:35 PM.',
        '3. Campus movement graph proved Arun could not reach Canteen at 4:35 PM while arriving at Seminar Hall by 4:40 PM.',
        '4. The Canteen tea slip timestamped 4:35 PM connected Karthik (Black Cap) to the counter at the exact moment of theft.',
        '5. Therefore, Karthik was uniquely responsible.'
      ],
      daaBreakdown: {
        graphTraversal: 'Verified movement adjacency across Library ↔ Main Block ↔ Canteen & Main Block ↔ Computer Lab ↔ Seminar Hall.',
        movementValidation: 'Hamiltonian path constraint checking verified Karthik was the only suspect whose path intersected Canteen at 4:35 PM.',
        graphConsistency: 'Graph Coloring vertex non-conflict check eliminated dual-location states for suspects.',
        backtracking: 'Backtracking CSP systematically eliminated Arun, Priya, Meena, and Rahul, leaving Karthik as the unique ground-truth thief.'
      }
    }
  },

  // =========================================================================
  // CHALLENGE 02: THE MISSING ATTENDANCE REGISTER (Medium ★★☆)
  // =========================================================================
  {
    id: 'challenge_02',
    caseId: 'case02',
    title: 'THE MISSING ATTENDANCE REGISTER',
    subtitle: 'The department register disappeared between 10:00 AM and 10:45 AM.',
    difficulty: 'Medium',
    stars: '★★☆',
    premise: 'The department\'s physical attendance register disappeared between 10:00 AM and 10:45 AM from the Department Block. Someone took the register and returned it later with several pages altered. Five students were moving around campus.',
    initialFacts: [
      'The attendance register was in the Department Block at 10:00 AM.',
      'The register was missing from the desk at 10:30 AM.',
      'The register was returned to the desk by 10:45 AM with altered pages.',
      'Only one student handled the register during the missing period.',
      'Students can move only between directly connected campus locations.',
      'Movement happens in 15-minute intervals (10:00 AM, 10:15 AM, 10:30 AM, 10:45 AM).',
      'A student cannot occupy two locations at the same time.'
    ],
    suspects: [
      { id: 'sus_arun', name: 'ARUN', role: 'The Topper', feature: 'Blue Backpack', featureDesc: 'Carries a distinct blue laptop bag everywhere.' },
      { id: 'sus_priya', name: 'PRIYA', role: 'The Procrastinator', feature: 'Red Notebook', featureDesc: 'Holds a bright red spiral assignment notebook.' },
      { id: 'sus_karthik', name: 'KARTHIK', role: 'The Canteen Regular', feature: 'Black Cap', featureDesc: 'Wears a dark black baseball cap.' },
      { id: 'sus_meena', name: 'MEENA', role: 'The Gossip Queen', feature: 'Green Water Bottle', featureDesc: 'Carries a pastel green water bottle.' },
      { id: 'sus_rahul', name: 'RAHUL', role: 'The Silent Student', feature: 'Headphones', featureDesc: 'Wears bulky black noise-canceling headphones.' }
    ],
    locations: [
      { id: 'loc_dept', name: 'Department Block', desc: 'Central desk where the attendance register was kept.' },
      { id: 'loc_library', name: 'Library', desc: 'Quiet study reading room with digital gate log.' },
      { id: 'loc_lab', name: 'Computer Lab', desc: 'Workstation room with automated login logs.' },
      { id: 'loc_staff', name: 'Staff Room', desc: 'Faculty room with lockers and grading desks.' },
      { id: 'loc_seminar', name: 'Seminar Hall', desc: 'Auditorium podium and sign-in desk.' }
    ],
    times: ['10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM'],
    edges: [
      ['loc_library', 'loc_dept'],
      ['loc_dept', 'loc_lab'],
      ['loc_dept', 'loc_staff'],
      ['loc_staff', 'loc_seminar']
    ],
    clues: [
      {
        id: 'clue_c2_1',
        title: 'Library Swipe Terminal Log',
        type: 'DIRECT_FACT',
        text: 'Library gate log proves a student carrying a Blue Backpack swiped into the Library at 10:00 AM and stayed reading until 10:30 AM.',
        purpose: 'Establishes Arun at Library at 10:00 AM and 10:15 AM.',
        eliminates: ['Arun in Dept Block at 10:00 AM'],
        deductionOptions: [
          {
            id: 'c2_d1_correct',
            label: 'Arun (Blue Backpack) was in Library at 10:00 AM',
            isCorrect: true,
            suspectId: 'sus_arun',
            time: '10:00 AM',
            locationId: 'loc_library',
            status: '✓'
          },
          { id: 'c2_d1_wrong', label: 'Meena was in Library at 10:00 AM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_2',
        title: 'Computer Lab PC Login Log',
        type: 'DIRECT_FACT',
        text: 'Computer Lab system log confirms a student wearing a Black Cap logged into PC #12 at 10:00 AM and stayed logged in continuously until 10:45 AM.',
        purpose: 'Establishes Karthik in Computer Lab for all timeslots (10:00 AM - 10:45 AM).',
        eliminates: ['Karthik handling register'],
        deductionOptions: [
          {
            id: 'c2_d2_correct',
            label: 'Karthik (Black Cap) was in Computer Lab from 10:00 AM to 10:45 AM',
            isCorrect: true,
            suspectId: 'sus_karthik',
            time: '10:30 AM',
            locationId: 'loc_lab',
            status: '✓'
          },
          { id: 'c2_d2_wrong', label: 'Karthik was in Staff Room at 10:30 AM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_3',
        title: 'Seminar Hall Audio Station Register',
        type: 'TIME_FACT',
        text: 'Seminar Hall log records a student wearing Headphones listening to audio lectures inside Seminar Hall from 10:15 AM to 10:45 AM.',
        purpose: 'Establishes Rahul in Seminar Hall from 10:15 AM to 10:45 AM.',
        eliminates: ['Rahul in Staff Room at 10:30 AM'],
        deductionOptions: [
          {
            id: 'c2_d3_correct',
            label: 'Rahul (Headphones) was in Seminar Hall (10:15–10:45 AM)',
            isCorrect: true,
            suspectId: 'sus_rahul',
            time: '10:30 AM',
            locationId: 'loc_seminar',
            status: '✓'
          },
          { id: 'c2_d3_wrong', label: 'Rahul was at Department Block at 10:30 AM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_4',
        title: 'Dept Block Corridor Security Clip',
        type: 'MOVEMENT_FACT',
        text: 'Dept Block corridor camera captures a student with a Red Notebook walking away from Dept Block toward the Library at 10:15 AM.',
        purpose: 'Places Priya at Library at 10:15 AM.',
        eliminates: ['Priya at Staff Room at 10:15 AM'],
        deductionOptions: [
          {
            id: 'c2_d4_correct',
            label: 'Priya (Red Notebook) was at Library at 10:15 AM',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '10:15 AM',
            locationId: 'loc_library',
            status: '✓'
          },
          { id: 'c2_d4_wrong', label: 'Priya was in Staff Room at 10:15 AM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_5',
        title: 'Library Study Group Sign-sheet',
        type: 'DIRECT_FACT',
        text: 'Library group study sign-sheet confirms Priya (Red Notebook) and Arun (Blue Backpack) were working together at Library Desk #3 at 10:30 AM.',
        purpose: 'Establishes Priya and Arun in Library at 10:30 AM.',
        eliminates: ['Arun in Staff Room at 10:30 AM', 'Priya in Staff Room at 10:30 AM'],
        deductionOptions: [
          {
            id: 'c2_d5_correct',
            label: 'Priya (Red Notebook) and Arun (Blue Backpack) were in Library at 10:30 AM',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '10:30 AM',
            locationId: 'loc_library',
            status: '✓'
          },
          { id: 'c2_d5_wrong', label: 'Priya was in Staff Room at 10:30 AM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_6',
        title: 'Dept Block Desk Log',
        type: 'NEGATIVE_FACT',
        text: 'Faculty clerk notes that the register was on the Dept Block desk at 10:15 AM, missing at 10:30 AM, and returned by 10:45 AM.',
        purpose: 'Establishes theft and alteration window specifically at 10:30 AM.',
        eliminates: ['Theft at 10:00 AM', 'Theft at 10:45 AM'],
        deductionOptions: [
          {
            id: 'c2_d6_correct',
            label: 'The register was taken and altered during the 10:30 AM window',
            isCorrect: true,
            suspectId: 'sus_meena',
            time: '10:30 AM',
            locationId: 'loc_staff',
            status: '✓'
          },
          { id: 'c2_d6_wrong', label: 'Register was taken at 10:00 AM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_7',
        title: 'Staff Room Trash Bin Evidence',
        type: 'OBJECT_CLUE',
        text: 'Inside the Staff Room trash bin at 10:30 AM, an inspector found a Green Water Bottle cap beside an ink-smudged torn attendance page fragment.',
        purpose: 'Connects Meena (Green Water Bottle) directly to Staff Room at 10:30 AM with the register.',
        eliminates: ['Meena outside Staff Room at 10:30 AM'],
        deductionOptions: [
          {
            id: 'c2_d7_correct',
            label: 'Meena (Green Water Bottle cap) was in Staff Room at 10:30 AM altering pages',
            isCorrect: true,
            suspectId: 'sus_meena',
            time: '10:30 AM',
            locationId: 'loc_staff',
            status: '✓'
          },
          { id: 'c2_d7_wrong', label: 'Arun dropped the cap in Staff Room', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_8',
        title: 'Staff Room Corridor Motion Camera',
        type: 'MOVEMENT_FACT',
        text: 'Corridor motion camera recorded a student holding a Green Water Bottle entering the Staff Room at 10:30 AM carrying a heavy blue ledger file.',
        purpose: 'Proves Meena carried the register into Staff Room at 10:30 AM.',
        eliminates: ['Meena in Dept Block at 10:30 AM'],
        deductionOptions: [
          {
            id: 'c2_d8_correct',
            label: 'Meena carried the register into Staff Room at 10:30 AM',
            isCorrect: true,
            suspectId: 'sus_meena',
            time: '10:30 AM',
            locationId: 'loc_staff',
            status: '✓'
          },
          { id: 'c2_d8_wrong', label: 'Rahul carried the register into Staff Room', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_9',
        title: 'Dept Block Return Witness Statement',
        type: 'CONDITIONAL_FACT',
        text: 'Student witness saw someone with a Green Water Bottle quickly slip the register back onto the Dept Block desk at 10:45 AM before heading to Seminar Hall.',
        purpose: 'Verifies Meena route: Staff Room (10:30) → Dept Block (10:45) → Seminar Hall.',
        eliminates: ['Meena in Library at 10:45 AM'],
        deductionOptions: [
          {
            id: 'c2_d9_correct',
            label: 'Meena returned register to Dept Block at 10:45 AM',
            isCorrect: true,
            suspectId: 'sus_meena',
            time: '10:45 AM',
            locationId: 'loc_dept',
            status: '✓'
          },
          { id: 'c2_d9_wrong', label: 'Karthik returned register at 10:45 AM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c2_10',
        title: 'Campus Traversal Synthesis',
        type: 'CONDITIONAL_FACT',
        text: 'Campus traversal synthesis confirms that at 10:30 AM: Arun & Priya were in Library, Karthik was in Lab, and Rahul was in Seminar Hall. Meena is the ONLY suspect at the Staff Room with the register.',
        purpose: 'Final elimination proving Meena uniquely altered the register.',
        eliminates: ['All suspects except Meena'],
        deductionOptions: [
          {
            id: 'c2_d10_correct',
            label: 'Meena is the unique suspect who took and altered the register at 10:30 AM',
            isCorrect: true,
            suspectId: 'sus_meena',
            time: '10:30 AM',
            locationId: 'loc_staff',
            status: '✓'
          }
        ]
      }
    ],
    hints: [
      { id: 'c2_h1', text: 'HINT 1: Check where each suspect was documented at 10:30 AM when the register went missing.', cost: 10 },
      { id: 'c2_h2', text: 'HINT 2: Arun & Priya were in the Library, Karthik was in the Lab, and Rahul was in Seminar Hall.', cost: 10 },
      { id: 'c2_h3', text: 'HINT 3: The green water bottle cap found beside the ink fragment connects Meena to the Staff Room.', cost: 10 }
    ],
    solution: {
      suspect: 'sus_meena',
      suspectName: 'MEENA',
      location: 'loc_staff',
      locationName: 'Staff Room',
      time: '10:30 AM',
      object: 'register',
      evidenceId: 'clue_c2_7',
      evidenceTitle: 'Staff Room Trash Bin Evidence (10:30 AM)',
      summary: 'At 10:30 AM: Arun and Priya were studying in the Library; Karthik was logged into PC #12 in Computer Lab; Rahul was listening to lectures in Seminar Hall. Meena (Green Water Bottle) took the register from Dept Block at 10:30 AM, brought it to Staff Room to alter entries, dropped her bottle cap, and returned it at 10:45 AM.',
      explanationSteps: [
        '1. Computer Lab logs and Seminar Hall registers placed Karthik and Rahul at non-dept locations at 10:30 AM.',
        '2. Library sign-sheet proved Arun and Priya were studying together in the Library at 10:30 AM.',
        '3. Dept Block desk log confirmed the register was removed between 10:15 AM and 10:45 AM.',
        '4. Green water bottle cap and ink page fragment in Staff Room at 10:30 AM tied Meena directly to the alteration.',
        '5. Therefore, Meena was uniquely responsible.'
      ],
      daaBreakdown: {
        graphTraversal: 'Verified movement adjacency across Library ↔ Dept Block ↔ Computer Lab & Dept Block ↔ Staff Room ↔ Seminar Hall.',
        movementValidation: 'Path traversal checking verified Meena was the only suspect whose route intersected Staff Room at 10:30 AM.',
        graphConsistency: 'Graph Coloring non-conflict check eliminated dual-location states for suspects.',
        backtracking: 'Backtracking CSP systematically eliminated Arun, Priya, Karthik, and Rahul, leaving Meena as the unique culprit.'
      }
    }
  },

  // =========================================================================
  // CHALLENGE 03: THE PROJECTOR INCIDENT (Hard ★★★)
  // =========================================================================
  {
    id: 'challenge_03',
    caseId: 'case03',
    title: 'THE PROJECTOR INCIDENT',
    subtitle: 'Five minutes before a major presentation, the projector remote disappeared.',
    difficulty: 'Hard',
    stars: '★★★',
    premise: 'Five minutes before a major 3:00 PM presentation, the classroom projector stopped working. Someone unplugged the power unit and moved the remote between 2:15 PM and 2:45 PM. Five students were moving around campus.',
    initialFacts: [
      'The classroom projector worked perfectly at 2:00 PM.',
      'The presentation was scheduled for 3:00 PM.',
      'The projector stopped working between 2:15 PM and 2:45 PM.',
      'The remote was later found outside the classroom in Seminar Hall.',
      'Students can move only between directly connected campus locations.',
      'Movement happens in 15-minute intervals (2:00 PM, 2:15 PM, 2:30 PM, 2:45 PM, 3:00 PM).',
      'A student cannot occupy two locations at the same time.'
    ],
    suspects: [
      { id: 'sus_arun', name: 'ARUN', role: 'The Topper', feature: 'Blue Backpack', featureDesc: 'Carries a distinct blue laptop bag everywhere.' },
      { id: 'sus_priya', name: 'PRIYA', role: 'The Procrastinator', feature: 'Red Notebook', featureDesc: 'Holds a bright red spiral assignment notebook.' },
      { id: 'sus_karthik', name: 'KARTHIK', role: 'The Canteen Regular', feature: 'Black Cap', featureDesc: 'Wears a dark black baseball cap.' },
      { id: 'sus_meena', name: 'MEENA', role: 'The Gossip Queen', feature: 'Green Water Bottle', featureDesc: 'Carries a pastel green water bottle.' },
      { id: 'sus_rahul', name: 'RAHUL', role: 'The Silent Student', feature: 'Headphones', featureDesc: 'Wears bulky black noise-canceling headphones.' }
    ],
    locations: [
      { id: 'loc_class', name: 'Classroom', desc: 'Where the presentation projector setup was located.' },
      { id: 'loc_dept', name: 'Department Block', desc: 'Faculty corridor connecting Classroom and Seminar Hall.' },
      { id: 'loc_library', name: 'Library', desc: 'Resource reading center connected to Dept Block & Lab.' },
      { id: 'loc_lab', name: 'Computer Lab', desc: 'PC workstation lab connected to Library & Seminar Hall.' },
      { id: 'loc_seminar', name: 'Seminar Hall', desc: 'Main auditorium where remote was stashed.' }
    ],
    times: ['2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM'],
    edges: [
      ['loc_library', 'loc_dept'],
      ['loc_dept', 'loc_class'],
      ['loc_library', 'loc_lab'],
      ['loc_lab', 'loc_seminar'],
      ['loc_dept', 'loc_seminar']
    ],
    clues: [
      {
        id: 'clue_c3_1',
        title: 'Library Entrance Gate Log',
        type: 'DIRECT_FACT',
        text: 'Library digital gate log proves a student carrying a Blue Backpack (Arun) swiped into Library at 2:00 PM and remained studying at Table #4 until 2:30 PM.',
        purpose: 'Establishes Arun at Library at 2:00 PM, 2:15 PM, and 2:30 PM.',
        eliminates: ['Arun in Classroom at 2:30 PM'],
        deductionOptions: [
          {
            id: 'c3_d1_correct',
            label: 'Arun (Blue Backpack) was in Library at 2:30 PM',
            isCorrect: true,
            suspectId: 'sus_arun',
            time: '2:30 PM',
            locationId: 'loc_library',
            status: '✓'
          },
          { id: 'c3_d1_wrong', label: 'Priya was in Library at 2:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_2',
        title: 'Computer Lab Workstation Log',
        type: 'DIRECT_FACT',
        text: 'Computer Lab system log confirms a student wearing a Black Cap (Karthik) logged into PC #08 at 2:15 PM and remained logged in continuously until 2:45 PM.',
        purpose: 'Establishes Karthik in Computer Lab for 2:15 PM, 2:30 PM, and 2:45 PM.',
        eliminates: ['Karthik in Classroom at 2:30 PM'],
        deductionOptions: [
          {
            id: 'c3_d2_correct',
            label: 'Karthik (Black Cap) was in Computer Lab from 2:15 PM to 2:45 PM',
            isCorrect: true,
            suspectId: 'sus_karthik',
            time: '2:30 PM',
            locationId: 'loc_lab',
            status: '✓'
          },
          { id: 'c3_d2_wrong', label: 'Karthik was in Classroom at 2:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_3',
        title: 'Seminar Hall Rehearsal Log',
        type: 'TIME_FACT',
        text: 'Seminar Hall sign-in desk log proves a student holding a Green Water Bottle (Meena) was present inside Seminar Hall from 2:15 PM to 2:45 PM.',
        purpose: 'Establishes Meena in Seminar Hall for 2:15 PM, 2:30 PM, and 2:45 PM.',
        eliminates: ['Meena in Classroom at 2:30 PM'],
        deductionOptions: [
          {
            id: 'c3_d3_correct',
            label: 'Meena (Green Water Bottle) was in Seminar Hall (2:15–2:45 PM)',
            isCorrect: true,
            suspectId: 'sus_meena',
            time: '2:30 PM',
            locationId: 'loc_seminar',
            status: '✓'
          },
          { id: 'c3_d3_wrong', label: 'Meena was in Classroom at 2:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_4',
        title: 'Computer Lab Audio Station Log',
        type: 'DIRECT_FACT',
        text: 'Audio station workstation log shows a student wearing Headphones (Rahul) was logged into audio booth #02 in Computer Lab at 2:30 PM.',
        purpose: 'Establishes Rahul in Computer Lab at 2:30 PM.',
        eliminates: ['Rahul in Classroom at 2:30 PM'],
        deductionOptions: [
          {
            id: 'c3_d4_correct',
            label: 'Rahul (Headphones) was in Computer Lab at 2:30 PM',
            isCorrect: true,
            suspectId: 'sus_rahul',
            time: '2:30 PM',
            locationId: 'loc_lab',
            status: '✓'
          },
          { id: 'c3_d4_wrong', label: 'Rahul was in Classroom at 2:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_5',
        title: 'Dept Block Corridor Security CCTV',
        type: 'MOVEMENT_FACT',
        text: 'Corridor CCTV camera in Dept Block captures a student carrying a Red Notebook (Priya) passing through at 2:15 PM heading toward the Classroom.',
        purpose: 'Establishes Priya at Dept Block at 2:15 PM heading to Classroom.',
        eliminates: ['Priya in Library at 2:15 PM'],
        deductionOptions: [
          {
            id: 'c3_d5_correct',
            label: 'Priya (Red Notebook) was at Dept Block at 2:15 PM heading to Classroom',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '2:15 PM',
            locationId: 'loc_dept',
            status: '✓'
          },
          { id: 'c3_d5_wrong', label: 'Priya was in Seminar Hall at 2:15 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_6',
        title: 'Classroom Tech Setup Timestamp',
        type: 'NEGATIVE_FACT',
        text: 'Tech coordinator tested the projector working at 2:00 PM & 2:15 PM. The power was cut and remote missing when checked at 2:30 PM.',
        purpose: 'Fixes incident time to 2:30 PM.',
        eliminates: ['Incident at 2:00 PM', 'Incident at 3:00 PM'],
        deductionOptions: [
          {
            id: 'c3_d6_correct',
            label: 'Projector was unplugged and remote taken at 2:30 PM',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '2:30 PM',
            locationId: 'loc_class',
            status: '✓'
          },
          { id: 'c3_d6_wrong', label: 'Incident happened at 2:00 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_7',
        title: 'Classroom Power Outlet Evidence',
        type: 'OBJECT_CLUE',
        text: 'Beside the unplugged projector power socket in Classroom at 2:30 PM, inspectors found a red notebook paper bookmark slip snagged in the wall plate.',
        purpose: 'Connects Priya (Red Notebook) directly to Classroom at 2:30 PM during the outage.',
        eliminates: ['Priya outside Classroom at 2:30 PM'],
        deductionOptions: [
          {
            id: 'c3_d7_correct',
            label: 'Priya (Red Notebook bookmark) was in Classroom at 2:30 PM unplugging projector',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '2:30 PM',
            locationId: 'loc_class',
            status: '✓'
          },
          { id: 'c3_d7_wrong', label: 'Arun dropped the bookmark', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_8',
        title: 'Classroom Motion Sensor Log',
        type: 'MOVEMENT_FACT',
        text: 'Classroom motion sensor recorded a student carrying a Red Notebook inside Classroom at 2:30 PM.',
        purpose: 'Confirms Priya presence inside Classroom at 2:30 PM.',
        eliminates: ['Priya in Dept Block at 2:30 PM'],
        deductionOptions: [
          {
            id: 'c3_d8_correct',
            label: 'Priya (Red Notebook) was inside Classroom at 2:30 PM',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '2:30 PM',
            locationId: 'loc_class',
            status: '✓'
          },
          { id: 'c3_d8_wrong', label: 'Meena was in Classroom at 2:30 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_9',
        title: 'Seminar Hall Podium Recovery Log',
        type: 'CONDITIONAL_FACT',
        text: 'Remote was discovered stashed behind Seminar Hall podium at 3:00 PM. Priya moved from Classroom (2:30 PM) → Dept Block (2:45 PM) → Seminar Hall (3:00 PM).',
        purpose: 'Verifies Priya route with remote: Classroom (2:30) → Dept Block (2:45) → Seminar Hall (3:00).',
        eliminates: ['Priya in Library at 3:00 PM'],
        deductionOptions: [
          {
            id: 'c3_d9_correct',
            label: 'Priya reached Seminar Hall at 3:00 PM and stashed the remote',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '3:00 PM',
            locationId: 'loc_seminar',
            status: '✓'
          },
          { id: 'c3_d9_wrong', label: 'Rahul stashed remote at 3:00 PM', isCorrect: false }
        ]
      },
      {
        id: 'clue_c3_10',
        title: 'Campus Traversal Synthesis',
        type: 'CONDITIONAL_FACT',
        text: 'Campus traversal synthesis confirms that at 2:30 PM: Arun was in Library, Karthik was in Lab, Meena was in Seminar Hall, and Rahul was in Computer Lab. Priya is the ONLY suspect in Classroom at 2:30 PM.',
        purpose: 'Final elimination proving Priya unplugged the projector and moved the remote.',
        eliminates: ['All suspects except Priya'],
        deductionOptions: [
          {
            id: 'c3_d10_correct',
            label: 'Priya is the unique suspect who unplugged the projector and moved the remote',
            isCorrect: true,
            suspectId: 'sus_priya',
            time: '2:30 PM',
            locationId: 'loc_class',
            status: '✓'
          }
        ]
      }
    ],
    hints: [
      { id: 'c3_h1', text: 'HINT 1: Check where each suspect was documented at 2:30 PM when the projector failed.', cost: 10 },
      { id: 'c3_h2', text: 'HINT 2: Arun (Library), Karthik (Lab), Meena (Seminar Hall), and Rahul (Lab) were all elsewhere at 2:30 PM.', cost: 10 },
      { id: 'c3_h3', text: 'HINT 3: The red notebook bookmark snagged in the Classroom socket points directly to Priya.', cost: 10 }
    ],
    solution: {
      suspect: 'sus_priya',
      suspectName: 'PRIYA',
      location: 'loc_class',
      locationName: 'Classroom',
      time: '2:30 PM',
      object: 'remote',
      evidenceId: 'clue_c3_7',
      evidenceTitle: 'Classroom Power Outlet Evidence (2:30 PM)',
      summary: 'At 2:30 PM: Arun was studying in Library; Karthik was logged into PC #08 in Lab; Meena was rehearsing in Seminar Hall; Rahul was at Computer Lab audio station. Priya (Red Notebook) entered Classroom at 2:30 PM, unplugged the projector power cord, took the remote, and stashed it behind the Seminar Hall podium at 3:00 PM.',
      explanationSteps: [
        '1. Computer Lab logs and Seminar Hall registers placed Karthik, Meena, and Rahul at non-classroom locations at 2:30 PM.',
        '2. Library gate log proved Arun was studying at Table #4 in Library at 2:30 PM.',
        '3. Classroom tech setup timestamp fixed the outage and remote disappearance to 2:30 PM.',
        '4. Red notebook bookmark paper slip snagged in the Classroom power socket connected Priya directly to the outage.',
        '5. Therefore, Priya was uniquely responsible.'
      ],
      daaBreakdown: {
        graphTraversal: 'Verified movement adjacency across Library ↔ Dept Block ↔ Classroom, Library ↔ Lab ↔ Seminar Hall, & Dept Block ↔ Seminar Hall.',
        movementValidation: 'Hamiltonian path constraint checking verified Priya was the only suspect whose path passed through Classroom at 2:30 PM.',
        graphConsistency: 'Graph Coloring vertex non-conflict check eliminated dual-location states for suspects.',
        backtracking: 'Backtracking CSP systematically eliminated Arun, Karthik, Meena, and Rahul, leaving Priya as the unique ground-truth culprit.'
      }
    }
  }
];
