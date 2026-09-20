/**
 * CASE 01 — THE LAST SAMOSA
 * 
 * A complete detective mystery set on a college campus.
 * 
 * HIDDEN GROUND TRUTH (never shown directly):
 *   Thief: KARTHIK
 *   Method: Took the samosa while ordering tea at 4:35 PM
 *   Motive: He was hungry and no one was watching (Rahul was asleep)
 *   
 *   Timeline:
 *   | Time    | Arun         | Priya        | Karthik      | Meena        | Rahul        |
 *   |---------|-------------|-------------|-------------|-------------|-------------|
 *   | 4:30 PM | Library      | Dept Block   | Computer Lab | Hostel       | Canteen      |
 *   | 4:35 PM | Main Block   | Computer Lab | Canteen ★    | Playground   | Canteen      |
 *   | 4:40 PM | Seminar Hall | Canteen      | Computer Lab | Canteen      | Canteen      |
 *   | 4:45 PM | Playground   | Playground   | Dept Block   | Canteen      | Canteen      |
 *   
 *   ★ = Karthik takes the samosa at 4:35 PM
 */

export const case01 = {
  id: "case01",
  title: "THE LAST SAMOSA",
  subtitle: "One samosa. Five students. Five different stories.",

  intro: [
    "4:30 PM — The canteen placed the last samosa on the counter.",
    "4:45 PM — It was gone. Nobody admitted to taking it.",
    "Five students were on campus during this time window. Every single one tells a different story.",
    "Your job: reconstruct what actually happened between 4:30 and 4:45 PM.",
    "Someone is lying. Or maybe everyone is... a little."
  ],

  // ── LOCATIONS ──────────────────────────────────────────
  locations: [
    { id: "loc_canteen",    name: "Canteen",          desc: "The usual battlefield between students and the last available snack. The counter is sticky, the chai is strong, and someone is always sleeping in the corner." },
    { id: "loc_library",    name: "Library",          desc: "Quiet. Too quiet. Smells like old books and approaching deadlines. The digital entry log tracks everyone who swipes in." },
    { id: "loc_lab",        name: "Computer Lab",     desc: "AC is permanently at 16°C. Half the screens show code, the other half show cricket scores. Every login is automatically logged." },
    { id: "loc_main",       name: "Main Block",       desc: "Administration, bureaucracy, and three security cameras that actually work. The corridor connects to the library wing and the seminar hall." },
    { id: "loc_seminar",    name: "Seminar Hall",     desc: "Currently between events. There's a sign-in register on the podium that nobody is supposed to peek at." },
    { id: "loc_hostel",     name: "Hostel",           desc: "A chaotic mess of half-asleep students, drying laundry, and mysteriously vanishing food. The warden keeps a meticulous exit register." },
    { id: "loc_playground",  name: "Playground",       desc: "Dusty, vast, and surprisingly good phone signal. Popular selfie spot near the big banyan tree." },
    { id: "loc_dept",       name: "Department Block", desc: "Where assignments go to die. Faculty offices, notice boards, and the faint hum of a printer that never works." },
    { id: "loc_parking",    name: "Parking Area",     desc: "Bikes parked chaotically. Nothing interesting happened here today. Probably." }
  ],

  // ── SUSPECTS ───────────────────────────────────────────
  suspects: [
    // ─── ARUN ───
    {
      id: "sus_arun",
      name: "ARUN",
      role: "The Topper",
      status: "Studying?",
      personality: "Precise, organized, slightly overconfident. Treats every conversation like a viva voce.",
      claimedRoute: ["loc_library", "loc_lab", "loc_canteen"],
      dialogue: {
        start: {
          text: "I was studying. Obviously. What else would I be doing?",
          options: [
            { text: "Where were you at 4:30?", next: "q1" },
            { text: "What did you do after the library?", next: "q2" },
            { text: "Did you see anyone suspicious?", next: "q3" },
            { text: "Did you take the samosa?", next: "q4" },
            { text: "Nevermind.", next: "end" }
          ]
        },
        q1: {
          text: "In the Library. You can check the entry log — I swiped in at 4:28 PM. I was reviewing the DAA notes, chapter 7, backtracking. Very important topic.",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_lib_photo"
        },
        q2: {
          text: "I went from the Library to the Computer Lab and then headed towards the Canteen. Standard route.",
          options: [
            { text: "Can anyone confirm that?", next: "q2b" },
            { text: "Back", next: "start" }
          ]
        },
        q2b: {
          text: "I don't need people to confirm my movements. I know where I was. Check the lab logs if you want.",
          options: [{ text: "Back", next: "start" }]
        },
        q3: {
          text: "I saw Karthik heading somewhere in a hurry around 4:30. He looked like he was late for something. Probably running to the canteen — he's always there.",
          options: [{ text: "Back", next: "start" }]
        },
        q4: {
          text: "I don't eat fried food during exam season. It affects concentration. Read any sports nutrition paper — the science is clear.",
          options: [{ text: "Back", next: "start" }]
        },
        end: {
          text: "Don't bother me again unless it's about the syllabus.",
          options: []
        }
      }
    },

    // ─── PRIYA ───
    {
      id: "sus_priya",
      name: "PRIYA",
      role: "The Procrastinator",
      status: "Looking for notes",
      personality: "Always rushing somewhere, gives vague answers, genuinely stressed about deadlines.",
      claimedRoute: ["loc_dept", "loc_lab", "loc_canteen"],
      dialogue: {
        start: {
          text: "Samosa? I don't know what you're talking about. I was busy ALL afternoon.",
          options: [
            { text: "Where were you at 4:30?", next: "q1" },
            { text: "You look nervous. Why?", next: "q2" },
            { text: "What about your text message?", next: "q3" },
            { text: "Were you at the canteen?", next: "q4" },
            { text: "Okay, bye.", next: "end" }
          ]
        },
        q1: {
          text: "Department Block. I was trying to find Professor Sharma to get my assignment extension approved. She wasn't there, obviously. She's never there when you need her.",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_priya_dept"
        },
        q2: {
          text: "I'm STRESSED because the deadline is tomorrow and I haven't started! I was running around campus trying to borrow notes. That's it!",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_message"
        },
        q3: {
          text: "I texted 'I got it' at 4:45 from the Playground. I finally borrowed the notes from a friend there. It was about NOTES, not a samosa. Why would I text about a samosa?",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_message"
        },
        q4: {
          text: "Maybe I passed through the canteen around 4:40. I was thirsty. But the samosa was already gone by then! I remember because Meena was there complaining about it.",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_statement"
        },
        end: {
          text: "I need to go find those notes...",
          options: []
        }
      }
    },

    // ─── KARTHIK ───
    {
      id: "sus_karthik",
      name: "KARTHIK",
      role: "The Canteen Regular",
      status: "Suspiciously well-informed",
      personality: "Knows everyone's business and remembers food-related events with alarming precision. Overly defensive.",
      claimedRoute: ["loc_canteen", "loc_lab", "loc_dept"],
      dialogue: {
        start: {
          text: "I left it on the counter for TWO MINUTES and someone took it! I was right there! Well... almost right there.",
          options: [
            { text: "When exactly did you see the samosa?", next: "q1" },
            { text: "Who else was around?", next: "q2" },
            { text: "Can you prove you were at the canteen?", next: "q3" },
            { text: "Where were you before the canteen?", next: "q4" },
            { text: "Thanks.", next: "end" }
          ]
        },
        q1: {
          text: "It was there when I went to grab tea at... let me think... around 4:30-ish? Yeah, definitely 4:30. The samosa was just sitting there, looking perfect. Golden-brown. Crispy edges.",
          options: [
            { text: "Are you SURE it was 4:30?", next: "q1b" },
            { text: "Back", next: "start" }
          ]
        },
        q1b: {
          text: "Well... I mean, it was around that time. Maybe 4:35? The point is, it was there and then it WASN'T. Someone took it while I was getting my tea.",
          options: [{ text: "Back", next: "start" }]
        },
        q2: {
          text: "Rahul was in the corner, half-asleep as usual. That guy sleeps through everything. He wouldn't notice if someone drove a truck through the canteen.",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_cctv"
        },
        q3: {
          text: "Here — I have my tea order slip. Timestamped 4:35 PM. See? I was at the canteen. Getting tea. Minding my own business. Not stealing samosas.",
          options: [
            { text: "Interesting that it says 4:35, not 4:30...", next: "q3b" },
            { text: "Back", next: "start" }
          ],
          evidence: "ev_karthik_canteen"
        },
        q3b: {
          text: "I said 4:30-ISH. Are you going to arrest me over five minutes? I was getting tea! TEA!",
          options: [{ text: "Back", next: "start" }]
        },
        q4: {
          text: "I was in the Computer Lab, working on the group project. You know, the one everyone else ignores? I do all the work.",
          options: [{ text: "Back", next: "start" }]
        },
        end: {
          text: "Find who actually did this. And tell them I want that samosa back.",
          options: []
        }
      }
    },

    // ─── MEENA ───
    {
      id: "sus_meena",
      name: "MEENA",
      role: "The Gossip Queen",
      status: "Knows everything (allegedly)",
      personality: "Confidently provides information, but mixes facts with assumptions and gets times wrong.",
      claimedRoute: ["loc_hostel", "loc_playground", "loc_canteen"],
      dialogue: {
        start: {
          text: "Omg, you're ACTUALLY investigating the samosa? This is the most exciting thing that's happened all semester. I know EVERYTHING.",
          options: [
            { text: "Tell me what you saw.", next: "q1" },
            { text: "Where were you at 4:30?", next: "q2" },
            { text: "Are you sure about the times?", next: "q3" },
            { text: "Did you go to the canteen?", next: "q4" },
            { text: "Whatever.", next: "end" }
          ]
        },
        q1: {
          text: "Okay so I was at the Playground around 4:30, right? And I SAW Priya running from the canteen direction later. She looked SO guilty. Like, who runs from a canteen unless they stole something?",
          options: [
            { text: "Could it have been 4:35 instead of 4:30?", next: "q1b" },
            { text: "Back", next: "start" }
          ],
          evidence: "ev_statement"
        },
        q1b: {
          text: "Hmm... maybe? I'm not great with exact times. But I DEFINITELY saw Priya near the canteen and she was rushing. That part I'm sure about.",
          options: [{ text: "Back", next: "start" }]
        },
        q2: {
          text: "I left the Hostel at 4:30. You can check the warden's register if you don't believe me. Then I went to the Playground to meet a friend.",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_meena_hostel"
        },
        q3: {
          text: "Look, I took a selfie at the Playground. The timestamp says 4:35 PM. So yeah, I was at the Playground at 4:35, not 4:30. My bad. But the Priya thing was definitely later — like 4:40.",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_meena_playground"
        },
        q4: {
          text: "I went to the canteen around 4:40 to grab water. Priya was there, looking flustered. And Rahul was sleeping, as usual. The samosa was already gone by then.",
          options: [{ text: "Back", next: "start" }]
        },
        end: {
          text: "Let me know when you figure it out. I want to post about it.",
          options: []
        }
      }
    },

    // ─── RAHUL ───
    {
      id: "sus_rahul",
      name: "RAHUL",
      role: "The Silent Student",
      status: "Listening to music",
      personality: "Quiet and observant. Says very little, but what he says is accurate.",
      claimedRoute: null,
      dialogue: {
        start: {
          text: "...",
          options: [
            { text: "Did you take the samosa?", next: "q1" },
            { text: "You were at the canteen the whole time?", next: "q2" },
            { text: "Did you see or hear anything?", next: "q3" },
            { text: "Anything else?", next: "q4" },
            { text: "Leave", next: "end" }
          ]
        },
        q1: {
          text: "No. I was asleep.",
          options: [{ text: "Back", next: "start" }],
          evidence: "ev_cctv"
        },
        q2: {
          text: "Yes. I was there before 4:30. Fell asleep. Woke up after 4:45. I had headphones on.",
          options: [{ text: "Back", next: "start" }]
        },
        q3: {
          text: "I heard someone at the counter around 4:35. Through my headphones. Sounded like they were ordering tea. I didn't open my eyes.",
          options: [
            { text: "Could you tell who it was?", next: "q3b" },
            { text: "Back", next: "start" }
          ],
          evidence: "ev_rahul_heard"
        },
        q3b: {
          text: "No. But they seemed familiar with the canteen staff. Like a regular.",
          options: [{ text: "Back", next: "start" }]
        },
        q4: {
          text: "...",
          options: [{ text: "Back", next: "start" }]
        },
        end: {
          text: "...",
          options: []
        }
      }
    }
  ],

  // ── EVIDENCE ───────────────────────────────────────────
  evidence: [
    // --- Found at locations ---
    {
      id: "ev_receipt",
      title: "Canteen Receipt",
      type: "RECEIPT",
      desc: "A crumpled receipt on the canteen counter. Timestamped 4:35 PM. Item: 'Chai × 1'. The samosa isn't listed, but whoever ordered tea was at the counter at 4:35.",
      source: "Found at the Canteen counter",
      meta: { location: "loc_canteen", fixedTime: "4:35 PM" }
    },
    {
      id: "ev_arun_main",
      title: "Main Block Security Footage",
      type: "CCTV",
      desc: "Grainy security camera footage showing Arun walking through the Main Block corridor at 4:35 PM, heading towards the Seminar Hall wing.",
      source: "Main Block security system",
      meta: { person: "sus_arun", location: "loc_main", fixedTime: "4:35 PM" }
    },
    {
      id: "ev_karthik_lab",
      title: "Lab PC Login History",
      type: "LOG",
      desc: "Computer Lab login records show Karthik logged in at 4:28 PM, logged out at 4:33 PM, logged back in at 4:38 PM, and logged out again at 4:43 PM. He was at the lab at 4:30 and 4:40, but NOT at 4:35.",
      source: "Computer Lab admin panel",
      meta: { person: "sus_karthik", location: "loc_lab", fixedTime: "4:30 PM" }
    },
    {
      id: "ev_priya_lab",
      title: "Lab Sign-in Sheet",
      type: "LOG",
      desc: "The handwritten lab sign-in sheet shows 'Priya — 4:35 PM' in rushed handwriting. She was at the Computer Lab at 4:35.",
      source: "Computer Lab sign-in sheet",
      meta: { person: "sus_priya", location: "loc_lab", fixedTime: "4:35 PM" }
    },
    {
      id: "ev_arun_seminar",
      title: "Seminar Hall Register",
      type: "LOG",
      desc: "The sign-in register at the Seminar Hall podium shows Arun's name at 4:40 PM. A guard noted seeing him leave towards the Playground at 4:44 PM.",
      source: "Seminar Hall sign-in register",
      meta: { person: "sus_arun", location: "loc_seminar", fixedTime: "4:40 PM" }
    },
    {
      id: "ev_priya_dept",
      title: "Faculty Observation",
      type: "NOTE",
      desc: "Professor Sharma's assistant remembers Priya knocking on the office door at 4:30 PM. 'She looked panicked about some assignment deadline.'",
      source: "Department Block faculty office",
      meta: { person: "sus_priya", location: "loc_dept", fixedTime: "4:30 PM" }
    },
    {
      id: "ev_meena_hostel",
      title: "Hostel Exit Register",
      type: "REGISTER",
      desc: "The warden's register shows Meena signed out of the Hostel at 4:29 PM, heading towards the campus.",
      source: "Hostel warden's register",
      meta: { person: "sus_meena", location: "loc_hostel", fixedTime: "4:30 PM" }
    },

    // --- Found through dialogue ---
    {
      id: "ev_lib_photo",
      title: "Library Entry Log",
      type: "PHOTO",
      desc: "The library's digital entry system shows Arun swiped in at 4:28 PM. A background photo from another student's Instagram confirms he was in the reading area at 4:30 PM.",
      source: "Arun's testimony + library records",
      meta: { person: "sus_arun", location: "loc_library", fixedTime: "4:30 PM" }
    },
    {
      id: "ev_cctv",
      title: "Canteen CCTV Clip",
      type: "CCTV",
      desc: "A short CCTV clip shows Rahul sitting in the canteen corner with headphones on, eyes closed, from before 4:30 PM through after 4:45 PM. He never moved.",
      source: "Canteen security camera",
      meta: { person: "sus_rahul", location: "loc_canteen" }
    },
    {
      id: "ev_message",
      title: "Priya's Phone Message",
      type: "MESSAGE",
      desc: "Priya's outgoing text at 4:45 PM from the Playground: 'I got it! Finally. Thx for the notes 🙏'. Sent to a classmate. The message is clearly about borrowed study notes.",
      source: "Priya's testimony + phone records",
      meta: { person: "sus_priya", location: "loc_playground", fixedTime: "4:45 PM" }
    },
    {
      id: "ev_statement",
      title: "Meena's Witness Account",
      type: "STATEMENT",
      desc: "Meena states: 'I saw Priya at the canteen around 4:40. She was there getting water. And Rahul was sleeping in the corner as usual.' Meena initially said 4:30 but corrected herself.",
      source: "Meena's testimony",
      meta: { person: "sus_priya", location: "loc_canteen", fixedTime: "4:40 PM" }
    },
    {
      id: "ev_karthik_canteen",
      title: "Karthik's Tea Order Slip",
      type: "RECEIPT",
      desc: "Karthik's own tea order slip, timestamped 4:35 PM, from the canteen. He was physically at the canteen counter at exactly 4:35 PM — the estimated time of the samosa's disappearance.",
      source: "Karthik's testimony + physical receipt",
      meta: { person: "sus_karthik", location: "loc_canteen", fixedTime: "4:35 PM" }
    },
    {
      id: "ev_meena_playground",
      title: "Meena's Selfie Timestamp",
      type: "PHOTO",
      desc: "A selfie Meena took at the Playground near the banyan tree. Photo metadata shows 4:35 PM. She was at the Playground at 4:35, not 4:30 as she initially claimed.",
      source: "Meena's phone photo metadata",
      meta: { person: "sus_meena", location: "loc_playground", fixedTime: "4:35 PM" }
    },
    {
      id: "ev_rahul_heard",
      title: "Rahul's Observation",
      type: "STATEMENT",
      desc: "Rahul heard someone at the canteen counter around 4:35 PM through his headphones. 'They were ordering tea. Sounded like a regular.' This matches Karthik's tea order slip.",
      source: "Rahul's testimony",
      meta: { location: "loc_canteen", fixedTime: "4:35 PM" }
    }
  ],

  // ── LOCATION EVIDENCE MAP ──────────────────────────────
  // Evidence discoverable by investigating a location (clicking INVESTIGATE AREA)
  locationEvidence: {
    "loc_canteen":  ["ev_receipt"],
    "loc_main":     ["ev_arun_main"],
    "loc_lab":      ["ev_karthik_lab", "ev_priya_lab"],
    "loc_seminar":  ["ev_arun_seminar"],
    "loc_dept":     ["ev_priya_dept"],
    "loc_hostel":   ["ev_meena_hostel"],
    "loc_library":  [],
    "loc_playground": [],
    "loc_parking":  []
  },

  // ── STATEMENTS & TRUTH TYPES ───────────────────────────
  // Hidden metadata — never shown directly to the player.
  // Used for case resolution after correct accusation.
  statements: [
    { id: "stmt_arun_1", suspect: "sus_arun", text: "I was in the Library the whole time.",         truth: "PARTIALLY_TRUE", note: "He was at the Library only at 4:30, then left." },
    { id: "stmt_arun_2", suspect: "sus_arun", text: "I went Library → Lab → Canteen.",             truth: "FALSE",           note: "He actually went Library → Main Block → Seminar → Playground. He lied about his route because he was sneaking to the Seminar Hall to preview exam papers." },
    { id: "stmt_arun_3", suspect: "sus_arun", text: "Karthik was heading somewhere in a hurry.",   truth: "PARTIALLY_TRUE", note: "Karthik did leave the Lab around 4:33, but Arun's timing is approximate." },
    { id: "stmt_arun_4", suspect: "sus_arun", text: "I don't eat fried food during exam season.",  truth: "TRUE",            note: "Genuine personal rule. Not relevant to the case." },

    { id: "stmt_priya_1", suspect: "sus_priya", text: "I was at the Department Block at 4:30.",     truth: "TRUE",            note: "Confirmed by faculty observation." },
    { id: "stmt_priya_2", suspect: "sus_priya", text: "I was busy ALL afternoon.",                  truth: "PARTIALLY_TRUE", note: "She was busy but did pass through the canteen." },
    { id: "stmt_priya_3", suspect: "sus_priya", text: "'I got it' was about borrowed notes.",       truth: "TRUE",            note: "The full message context confirms it." },
    { id: "stmt_priya_4", suspect: "sus_priya", text: "The samosa was already gone when I arrived.", truth: "TRUE",           note: "She arrived at 4:40; the samosa was taken at 4:35." },

    { id: "stmt_karthik_1", suspect: "sus_karthik", text: "I left it on the counter for two minutes!",     truth: "FALSE",           note: "He wasn't even at the canteen at 4:30. He was at the Lab." },
    { id: "stmt_karthik_2", suspect: "sus_karthik", text: "The samosa was there when I went at 4:30-ish.", truth: "MISLEADING",       note: "He initially said 4:30, then corrected to 4:35. He arrived at 4:35 and took it himself." },
    { id: "stmt_karthik_3", suspect: "sus_karthik", text: "Rahul was in the corner, half-asleep.",         truth: "TRUE",            note: "CCTV confirms this." },
    { id: "stmt_karthik_4", suspect: "sus_karthik", text: "I was in the Lab working on the project.",      truth: "PARTIALLY_TRUE", note: "He was at the Lab at 4:30 and 4:40, but left for the canteen at 4:35." },

    { id: "stmt_meena_1", suspect: "sus_meena", text: "I was at the Playground around 4:30.",          truth: "MEMORY_ERROR",    note: "She was at the Playground at 4:35 (selfie proves it), not 4:30. She left the Hostel at 4:30." },
    { id: "stmt_meena_2", suspect: "sus_meena", text: "I SAW Priya running from the canteen.",         truth: "MISLEADING",      note: "Priya was at the canteen at 4:40, which is true, but she wasn't 'running FROM' it guiltily — she was just passing through." },
    { id: "stmt_meena_3", suspect: "sus_meena", text: "Priya looked SO guilty.",                       truth: "FALSE",           note: "Meena assumed guilt based on Priya looking flustered. Priya was flustered about her assignment deadline." },
    { id: "stmt_meena_4", suspect: "sus_meena", text: "Arun was acting suspicious near the canteen.",   truth: "FALSE",           note: "Arun was never at the canteen. Meena fabricated this for drama." },

    { id: "stmt_rahul_1", suspect: "sus_rahul", text: "I was asleep.",                                 truth: "TRUE",            note: "CCTV confirms continuous sleeping." },
    { id: "stmt_rahul_2", suspect: "sus_rahul", text: "I heard someone at the counter around 4:35.",   truth: "TRUE",            note: "He heard Karthik ordering tea." },
    { id: "stmt_rahul_3", suspect: "sus_rahul", text: "They sounded like a regular.",                  truth: "TRUE",            note: "Karthik is indeed a canteen regular." }
  ],

  // ── GROUND TRUTH ───────────────────────────────────────
  // Used by CaseValidator and case resolution. Never shown during gameplay.
  groundTruth: {
    thief: "sus_karthik",
    motive: "Karthik saw the unattended samosa while ordering tea at 4:35 PM. Rahul was asleep. Nobody else was there. He took it.",
    timeline: {
      "sus_arun":    ["loc_library", "loc_main",    "loc_seminar", "loc_playground"],
      "sus_priya":   ["loc_dept",    "loc_lab",     "loc_canteen", "loc_playground"],
      "sus_karthik": ["loc_lab",     "loc_canteen", "loc_lab",     "loc_dept"],
      "sus_meena":   ["loc_hostel",  "loc_playground", "loc_canteen", "loc_canteen"],
      "sus_rahul":   ["loc_canteen", "loc_canteen", "loc_canteen", "loc_canteen"]
    },
    keyDeductions: [
      "Karthik's tea order slip places him at the canteen at exactly 4:35 PM.",
      "Lab PC logs prove Karthik was NOT at the canteen at 4:30 — he lied about the timing.",
      "Rahul heard someone ordering tea at 4:35 — that was Karthik.",
      "Karthik was the only non-sleeping person at the canteen at 4:35.",
      "Priya arrived at the canteen at 4:40 — the samosa was already gone.",
      "Arun was at Main Block at 4:35 (security footage) — nowhere near the canteen.",
      "Meena was at the Playground at 4:35 (selfie) — she couldn't have done it."
    ],
    redHerrings: [
      "Priya's 'I got it' text looked suspicious but was about notes.",
      "Meena accused Priya of 'running from the canteen' — but Priya arrived after the samosa was taken.",
      "Arun's false route claim makes him look like he's hiding something — but he was hiding that he went to preview exam papers, not that he stole a samosa."
    ]
  },

  times: ["4:30 PM", "4:35 PM", "4:40 PM", "4:45 PM"]
};
