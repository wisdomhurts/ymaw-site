// The weekend, hour by hour, from the Society's own arc-of-the-weekend
// document. "The map is never the territory": the men follow the energy of
// the young men and this shifts. It is a reference, not a promise.

export type Hour = { t: string; what: string; note?: string; still?: string; mark?: boolean };
export type Day = { day: string; sub: string; hours: Hour[] };

export const SCHEDULE: Day[] = [
  {
    day: "Friday",
    sub: "Separation",
    hours: [
      { t: "7:00 am", what: "The men load the trucks and head north", note: "Site set-up, kitchen up, safety walk-through. The camp is built before the bus arrives." },
      { t: "3:00 pm", what: "Bus: Langley", note: "McDonald's, 20394 88 Ave. Packed lunch, water bottle, sleeping bag, no phone.", mark: true },
      { t: "4:00 pm", what: "Bus: Burnaby", note: "Christine Sinclair Community Centre, south lot, 3713 Kensington Ave." },
      { t: "Dusk", what: "Arrive and hike in", note: "Physical work, usually in the last light. It's meant to feel like entering the unknown.", still: "packs-trailhead", mark: true },
      { t: "Evening", what: "Dinner. Line up by height. Teams formed, a leader picked.", note: "This is where young men size each other up and find where they fit. Then each team gets its shadows." },
      { t: "Night", what: "Build camp", note: "Each team builds its own shelter with tools, tarps and rope. The first place leadership shows up.", still: "tarp-forest" },
      { t: "10:45 pm", what: "Circle up as teams. Hot chocolate.", note: "Some light entertainment. Standards for the weekend are written by the young men themselves." },
      { t: "Late", what: "Friday night riot", note: "The young men blow off steam, often till the wee hours. The men allow it. Mostly." },
    ],
  },
  {
    day: "Saturday",
    sub: "Trial",
    hours: [
      { t: "6:00 am", what: "The men get up", note: "Kitchen fire lit. Coffee." },
      { t: "6:30 am", what: "The young men are woken", note: "Not gently." },
      { t: "7:00 am", what: "Morning circle", note: "Anything from the night before is addressed and cleaned up. Games, exercise." },
      { t: "8:00 am", what: "Breakfast", note: "Two hundred and sixty-five eggs, roughly." },
      { t: "9:00 am", what: "Big circle up", note: "Directions for the day. Every young man and every man present." },
      { t: "10:00 am", what: "The Quests", note: "Challenge stations in the forest and at the water: nerve, strength, wits, always as a team. Safety men at every station.", still: "shields", mark: true },
      { t: "1:00 pm", what: "Lunch at the stations" },
      { t: "2:00 pm", what: "The Quests continue" },
      { t: "4:00 pm", what: "Time off", note: "The summer-camp part. Water, games, camaraderie, tired legs.", still: "swim" },
      { t: "8:00 pm", what: "Dinner", note: "Cooked over open fire. The meal they tell their parents about." },
      { t: "9:00 pm", what: "The men's talk" },
      { t: "10:00 pm", what: "The circle", note: "The focus shifts from body to whatever he's been carrying. Nobody is made to speak. Never filmed, never recorded, never repeated.", mark: true },
      { t: "11:30 pm", what: "Lights out", note: "The production team meets: how are things going, what needs attention." },
    ],
  },
  {
    day: "Sunday",
    sub: "Return",
    hours: [
      { t: "6:00 am", what: "The men get up" },
      { t: "6:30 am", what: "The young men are woken" },
      { t: "7:00 am", what: "Morning circle", note: "Games and exercise." },
      { t: "8:00 am", what: "Breakfast" },
      { t: "9:00 am", what: "Circle up", note: "Shirts and markers handed out. Strike team arrives." },
      { t: "10:00 am", what: "Future Plans and acknowledgments", note: "Each young man writes what he's claiming and where he's going. His shadows tell him what they saw all weekend, and give him something to keep.", still: "stump", mark: true },
      { t: "11:00 am", what: "Young men versus the men", note: "Handball meets British Bulldog. Wild, rowdy, and the men have been waiting since Friday.", still: "game-dust" },
      { t: "12:00 pm", what: "Strike", note: "The young men pack up their camps." },
      { t: "1:00 pm", what: "Bag lunch" },
      { t: "Early afternoon", what: "The walk out", note: "The young men walk through two lines of the production men, eye to eye with every man they spent the weekend with. Then the bus.", mark: true },
      { t: "Afternoon", what: "The bus goes south", note: "Pick him up in Burnaby after 1:30 pm or Langley after 2:30 pm. The men text as the bus gets close." },
      { t: "Evening", what: "The men strike the site and unload the truck", note: "Leave it better than we found it." },
    ],
  },
];
