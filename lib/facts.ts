// Locked facts. Every number on the site comes from here or from the
// Society's own documents. Change here, changes everywhere.

export const FACTS = {
  name: "Young Men's Adventure Weekend",
  short: "YMAW",
  society: "Young Men's Adventure Weekend Society of BC",
  incorporation: "S-40533",       // BC society registration, as on every paper form since 2014
  since: 1990,
  founder: "Brad Leslie",                       // cofounder, still on the team every year
  founders: "Brad Leslie and Andy Vine",        // the two men who started it in 1990
  why: "for every young man who needed it, and for the betterment of mankind",
  email: "info@ymaw.com",
  instagram: "https://www.instagram.com/youngmensadventure/",
  facebook: "https://www.facebook.com/YoungMensAdventureWeekend/",
  region: "Squamish region, BC",
  ages: { min: 12, max: 17 },          // what the site says
  agesAccepted: { min: 11, max: 18 },  // what registration actually accepts
  priceCAD: 320,
  priceCents: 32000,
  event: "ymaw-2026",
  year: 2026,
  dates: {
    label: "September 11–13, 2026",
    short: "Sept 11–13",
    start: "2026-09-11",
    end: "2026-09-13",
    // Friday pickup, first bus stop (Langley) — America/Vancouver (PDT, UTC-7)
    busISO: "2026-09-11T15:00:00-07:00",
  },
  stops: [
    {
      town: "Langley",
      place: "McDonald's",
      address: "20394 88 Ave, Langley",
      depart: "Friday 3:00 pm",
      return: "Sunday after 2:30 pm",
    },
    {
      town: "Burnaby",
      place: "Christine Sinclair Community Centre, south lot",
      address: "3713 Kensington Ave, Burnaby",
      depart: "Friday 4:00 pm",
      return: "Sunday after 1:30 pm",
    },
  ],
  crc: {
    portal: "https://justice.gov.bc.ca/eCRC/",
    code: "W3LVWMAYTG",
  },
  // From the Society's own site and outreach documents.
  completed: "more than a thousand young men",
  // The Society's mailing list (it lives in GHL).
  newsletters: [
    { name: "Rising the Man Within", who: "families, young men and the men", line: "fireside stories, the monthly gatherings, the weekend" },
  ],
  // T.E.A.M.S. — the five values the men coach the young men in, from the
  // Society's "T.E.A.M.S. Core Values for Coaching Young Men". Definitions verbatim.
  teams: [
    {
      letter: "T", name: "Truthful",
      def: "The commitment to honesty and integrity in all aspects of life.",
      line: "Genuine and sincere in your words and actions, to others and to yourself. Face reality with courage, admit mistakes, and do what is right even when it's difficult.",
      ask: "Are you being truthful?",
    },
    {
      letter: "E", name: "Excellence",
      def: "The pursuit of giving your best in everything you do, at all times, by taking intentional actions to achieve your desired outcomes.",
      line: "High standards, brought every time. Out of your comfort zone, into the challenge, and through it. Never settling for mediocre.",
      ask: "Are you striving for excellence?",
    },
    {
      letter: "A", name: "Accountable",
      def: "Taking full responsibility for yourself, your actions and even your thoughts.",
      line: "Own it when you fall short of who you want to be. Make amends. Keep your commitments, to yourself and to others, and stay open to feedback.",
      ask: "Are you being accountable?",
    },
    {
      letter: "M", name: "Mindful",
      def: "Paying attention to your thoughts, feelings, sensations and surroundings with curiosity and acceptance.",
      line: "Be here, fully. In tune with yourself, your emotions and the people around you, not lost in the past or the future.",
      ask: "Are you being mindful?",
    },
    {
      letter: "S", name: "Service",
      def: "Prioritizing the needs of others above your own wants and desires, without seeking attention or praise.",
      line: "Present and ready to improve a situation. Help when asked, not to be seen. Lead by example and put the greater good over recognition.",
      ask: "Are you serving others, or just yourself right now?",
    },
  ],
  team: {
    ask: "Are you being a team player?",
    unequal: "Every man on a team is not equal. The largest man cannot do what the smallest can, and vice versa. Each one brings a strength the others don't have, and the team wins by putting them together.",
    carbon: "A young man is a chunk of carbon. A man is a diamond. Only pressure, heat and time form the diamond, and only when its rough edges are ground down does it show its glow in the sun.",
    steel: "As steel sharpens steel, so does one man sharpen another. That is the value of a team.",
  },
  manCode: {
    line: "Commitment before ego. Keep your word. Be prepared. Defend humanity. Champion diversity and recognize differences. Always be faithful to others. Fight only honourable battles. Earn and honour rank. Be an example to children.",
    virtues: ["Endurance", "Commitment", "Integrity", "Passion", "Humour", "Generosity", "Helpfulness", "Hope", "Belief in team", "Trust", "Conviction", "Justice", "Fairness", "Self-mastery", "Patience", "Skill", "Resourcefulness", "Compassion", "Creativity", "Thoughtfulness", "Insight", "Respect", "Wisdom", "Emotional intelligence"],
  },
  departments: [
    { name: "Program & Quests", line: "Design and run the Quest stations and the arc of the weekend." },
    { name: "Shadows", line: "Walk beside a team of young men all weekend. Watch. Say little. On Sunday, say everything." },
    { name: "Kitchen", line: "Eight meals for fifty, cooked over fire. The calmest place in camp." },
    { name: "Site & Supplies", line: "Tarps, tools, water, wood. Leave it better than we found it." },
    { name: "Safety", line: "First aid, the buddy system, the emergency plan. Everyone's job; your watch." },
    { name: "Transport", line: "The bus, the trucks, the 4x4s, the stops on time." },
    { name: "Load & Strike", line: "Thursday load. Sunday strike. Strong backs, early mornings." },
    { name: "Enrolment", line: "The calls, the emails, the families, the seats filled." },
  ],
  // 2026 production leadership, from the Society's team roster. Roles only.
  team2026: [
    { name: "Jeffery Woods", role: "Production Team Manager" },
    { name: "Cameron Tsoi-A-Sue", role: "S1 · second in command" },
    { name: "Bryan Wadsworth", role: "Enrolment manager" },
    { name: "Jason Macloed", role: "Enrolment 2nd" },
    { name: "Dan Beck", role: "Finance & registration" },
    { name: "Raymond Wong", role: "Safety manager" },
    { name: "Tim Bolan", role: "Transport manager" },
    { name: "Dorian Leslie", role: "Kitchen · Food Boss" },
    { name: "Brad Leslie", role: "Cofounder" },
  ],
  standards: [
    "Safety. We are all responsible for our own safety and the safety of others.",
    "Buddy system. Never be alone. Every man is visible to at least one other man at all times, and never alone with a young man.",
    "No drugs, alcohol, or tobacco at YMAW or in the 24 hours before any YMAW event.",
    "Honour the site. Leave things better than you found them.",
    "Confidentiality. Everything you see or hear is confidential. Speak to your own experience only.",
    "Be on time. Be at the designated place at the designated time, ready.",
    "No foul language. We are modelling behaviour for the young men.",
    "We refer to the youth as young men. Not boys, not kids.",
    "Don't make anything up. Get clear direction and set your ego aside.",
    "Supportability. Trust the team.",
    "Your well-being is your responsibility. Hydrate, rest, look out for one another.",
    "Clean it up. If you find yourself out of integrity, call yourself back in with a simple act of service.",
    "Fathers of young men: trust the process. This is his time.",
    "By modelling accountability to the young men and to each other, we cultivate trust and mutual respect.",
  ],
} as const;

export const NAV = [
  { href: "/his-path", label: "His Path" },
  { href: "/bringing-him", label: "Bringing Him" },
  { href: "/the-weekend", label: "The Weekend" },
  { href: "/media", label: "Photos" },
  { href: "/since-1990", label: "Since 1990" },
  { href: "/the-men", label: "The Men" },
  { href: "/support", label: "Support" },
  { href: "/faq", label: "FAQ" },
] as const;
