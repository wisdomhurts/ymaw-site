// The weekend in six parts, Friday afternoon to Sunday afternoon. This
// replaced the hour-by-hour field log in September 2026 at the production
// team's request: the shape of the three days, not the clock. The clock is
// still in lib/schedule.ts if it's ever wanted again.

export type Beat = {
  when: string;    // "Friday afternoon"
  name: string;    // "Departure"
  title: string;   // the line
  body: string[];  // one or two short paragraphs
  still: string;   // STILLS id
};

export const ARC: Beat[] = [
  {
    when: "Friday afternoon",
    name: "Departure",
    title: "The bus goes north.",
    body: [
      "Langley at 3:00, Burnaby at 4:00, then north. Once the bus clears the city, phones and everything else with a screen are checked in and locked away until Sunday. Everyone survives this.",
    ],
    still: "bus-forest",
  },
  {
    when: "Friday night",
    name: "Into the dark",
    title: "Camp is built by the people sleeping in it.",
    body: [
      "The bus stops where the road stops and the young men hike in with their gear, usually in the last light. Line up by height. Teams are made, a leader is picked, and every team gets its shadows: men whose whole job is to walk beside them all weekend and say very little.",
      "Safety briefing, then each team builds the shelter it sleeps in. Hot chocolate, and the young men write the standards they'll hold each other to for the weekend.",
    ],
    still: "tarp-forest",
  },
  {
    when: "Saturday",
    name: "The Quests",
    title: "Nerve, strength, wits.",
    body: [
      "Stations open across the forest and the water. Every team is pushed to what it thinks its limit is, and a little past it, and nobody gets through alone: the team can't finish without him and he can't finish without them.",
      "Lunch is at the stations. The afternoon is the summer-camp part: the water, the games, tired legs.",
    ],
    still: "creek-quest",
  },
  {
    when: "Saturday dusk",
    name: "The turn",
    title: "The woods go quiet.",
    body: [
      "The games stop. The men build the fire and the work shifts from the body to whatever he has been carrying. Nobody is made to speak. Nobody ever has been.",
      "The circle and the ceremony are never filmed and never repeated outside the circle. Confidentiality is a standard every man signs. Your son may tell you about it; that's his to decide.",
    ],
    still: "meadow-circle",
  },
  {
    when: "Sunday morning",
    name: "The return",
    title: "What he saw, and what's next.",
    body: [
      "Future Plans: each young man writes down, in his own words, what he's claiming and where he's going. Then his shadows tell him what they saw all weekend, in front of his team, and give him something to keep.",
      "Then the game: all the young men against all the men, wild and rowdy, and the men have been waiting since Friday. Then strike. Pack out, and leave the land cleaner than we found it.",
    ],
    still: "game-dust",
  },
  {
    when: "Sunday afternoon",
    name: "Home",
    title: "Between two lines of men.",
    body: [
      "Every man who was there stands in a line, and each young man walks out between them, eye to eye with every one. Then the bus goes south: Burnaby after 1:30, Langley after 2:30, and the men text as it gets close.",
      "He steps off tired, proud, and one of the crew. Feed him and let him sleep.",
    ],
    still: "men-line",
  },
];
