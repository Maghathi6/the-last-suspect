/**
 * CASE 01 — RESOLUTION DATA
 * 
 * Detailed explanation data derived for Case 01: The Last Samosa.
 */

export const case01Solution = {
  caseId: "case01",
  title: "THE LAST SAMOSA",
  culpritId: "sus_karthik",
  culpritName: "KARTHIK",
  motive: "Karthik saw the unattended samosa on the canteen counter while ordering tea at 4:35 PM. Rahul was sleeping in the corner, and nobody else was watching. He took it.",
  
  timelineEvents: [
    { time: "4:30 PM", text: "The canteen staff places the last samosa on the counter. Karthik is logged into Computer Lab PC. Arun swiped into Library. Priya is at Department Block. Meena leaves Hostel. Rahul falls asleep at Canteen." },
    { time: "4:35 PM", text: "Karthik logs off Lab PC, goes to Canteen, and orders tea (Order Slip: 4:35 PM). He takes the samosa. Arun is at Main Block. Priya is at Computer Lab. Meena takes a selfie at Playground." },
    { time: "4:40 PM", text: "Karthik returns to Computer Lab. Priya passes through Canteen to buy water (samosa already gone). Arun arrives at Seminar Hall. Meena arrives at Canteen." },
    { time: "4:45 PM", text: "Priya reaches Playground and texts 'I got it' for borrowed notes. Arun is at Playground. Karthik goes to Dept Block. Rahul wakes up." }
  ],

  keyEvidence: [
    {
      id: "ev_karthik_canteen",
      title: "Karthik's Tea Order Slip",
      established: "Places Karthik at the Canteen counter at exactly 4:35 PM.",
      mattered: "Proves he was physically at the exact spot at the exact minute the samosa vanished."
    },
    {
      id: "ev_karthik_lab",
      title: "Lab PC Login History",
      established: "Karthik logged out at 4:33 PM and logged back in at 4:38 PM.",
      mattered: "Refutes his claim of being at the canteen at 4:30 PM and exposes his 5-minute absence from the lab."
    },
    {
      id: "ev_arun_main",
      title: "Main Block Security Footage",
      established: "Shows Arun walking through Main Block corridor at 4:35 PM.",
      mattered: "Eliminates Arun, proving he was far from the Canteen at the time of theft."
    },
    {
      id: "ev_rahul_heard",
      title: "Rahul's Observation",
      established: "Rahul heard a regular customer ordering tea at 4:35 PM through his headphones.",
      mattered: "Independently corroborates Karthik ordering tea at the counter."
    }
  ],

  alternativeTheories: [
    {
      suspect: "ARUN",
      failedBecause: "Security footage places Arun at Main Block corridor at 4:35 PM, heading towards Seminar Hall. He lied about his route to hide previewing exam papers, not stealing food."
    },
    {
      suspect: "PRIYA",
      failedBecause: "Priya arrived at the canteen at 4:40 PM — 5 minutes after the samosa disappeared. Her text 'I got it' was sent at 4:45 PM from Playground for borrowed notes."
    },
    {
      suspect: "MEENA",
      failedBecause: "Meena was at the Playground at 4:35 PM (photo metadata). She confused 4:30 PM with 4:35 PM due to an internal clock error."
    },
    {
      suspect: "RAHUL",
      failedBecause: "Rahul was sleeping in the corner continuously from 4:30 PM to 4:45 PM as confirmed by canteen CCTV footage."
    }
  ],

  algorithmExplanation: {
    graphColoring: "Used to verify whether timeline events and suspect movements could co-exist within the 4 available time slots without scheduling conflicts.",
    hamiltonianPath: "Used to validate whether claimed campus routes were physically continuous and achievable across adjacent campus locations.",
    backtracking: "Used to explore the full space of possible suspect locations and instantly prune invalid hypotheses as soon as a constraint or evidence contradiction occurred."
  }
};
