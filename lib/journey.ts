// The home-page journey: Campbell's stations laid over the weekend as it
// actually runs (from the Society's own arc-of-the-weekend document).
// Two voices per station: `him` speaks to the young man, `you` to the one
// bringing him. Nothing here is invented; where the weekend is confidential,
// the copy says so and stops.

export type Station = {
  id: string;
  n: string;          // roman numeral
  stage: string;      // Campbell's name
  when: string;       // the weekend's clock
  title: string;
  him: string[];      // paragraphs
  you: string[];
  media: { kind: "still" | "clip"; id: string };
  tone?: "dark" | "light";
};

export const STATIONS: Station[] = [
  {
    id: "ordinary",
    n: "I",
    stage: "The ordinary world",
    when: "Any Tuesday",
    title: "You know this world.",
    him: [
      "Your room. Your phone. The same week, again. Nobody has asked anything of you that you couldn't do with one thumb.",
      "That's not an insult. It's just where the story starts.",
    ],
    you: [
      "His room. His phone. The same week, again. Nobody has asked anything of him that he couldn't do with one thumb.",
      "That's not a criticism of him. It's the world he was handed. It's where the story starts.",
    ],
    media: { kind: "clip", id: "leg1" },
  },
  {
    id: "call",
    n: "II",
    stage: "The call",
    when: "Friday, 3:00 pm",
    title: "Someone sent you here.",
    him: [
      "A father, an uncle, a coach, a man who went once and never forgot it. He didn't send you a link to a summer camp. He sent you to a bus.",
      "It leaves Friday afternoon. Langley, then Burnaby, then north. You can say no. Most young men who say yes are a little scared. That's allowed.",
    ],
    you: [
      "Most young men arrive because a man they know told their parents. Not a brochure. A conversation, usually short, usually something like: this is the weekend I wish I'd had.",
      "The bus leaves Friday afternoon from Langley and Burnaby and heads north into the Squamish wilderness. You drop him off with a packed lunch, a sleeping bag, and no phone.",
    ],
    media: { kind: "still", id: "kayaks" },
  },
  {
    id: "threshold",
    n: "III",
    stage: "Crossing the threshold",
    when: "Friday, dusk",
    title: "Your phone spends the weekend in your bag.",
    him: [
      "Everyone survives this. Including you.",
      "The bus stops where the road stops. You hike in with your gear, and it's getting dark. It's physical work. It should feel a little risky. That's the point. On the other side of that trail is a world run by men, and for three days you're in it.",
    ],
    you: [
      "The young men hike in to the site with their gear, usually in the last light. It's real work and it's meant to feel like entering the unknown, because it is.",
      "Phones stay home or in the bag until Sunday. In more than thirty years no one has failed to survive it. What they get instead is three days of men's full attention.",
    ],
    media: { kind: "still", id: "fire-circle-2003" },
    tone: "dark",
  },
  {
    id: "allies",
    n: "IV",
    stage: "Allies and mentors",
    when: "Friday night",
    title: "Line up by height.",
    him: [
      "First thing, you'll size each other up. Everyone does. Then teams are made, a leader is picked, and your team gets its shadows: men whose whole job is to walk beside you all weekend, watch, and say very little.",
      "Until Sunday. On Sunday they tell you what they saw.",
    ],
    you: [
      "Teams are formed on the first night and each team is given its shadows: production men whose only role is to stay with those young men for the whole weekend, observe, and hold back.",
      "Every man on the team has a signed criminal record check, is never alone with a young man, and keeps the buddy system without exception.",
    ],
    media: { kind: "still", id: "huddle" },
  },
  {
    id: "camp",
    n: "V",
    stage: "The camp",
    when: "Friday, late",
    title: "Build your own shelter.",
    him: [
      "Your team gets tools, tarps and rope, a knot manual, and a patch of forest. Nobody builds it for you. You'll eat when it's up.",
      "Then hot chocolate, then the Friday night riot, which is exactly what it sounds like and which the men, mostly, allow.",
    ],
    you: [
      "Each team builds its own shelter with tools, tarps and rope. It's the first place leadership shows up, and the first place a young man finds out he can do something with his hands he didn't know he could.",
      "Dinner is hearty and cooked over fire. Then the young men blow off steam, sometimes late, under the eyes of men who remember doing the same.",
    ],
    media: { kind: "clip", id: "leg2" },
  },
  {
    id: "trials",
    n: "VI",
    stage: "The trials",
    when: "Saturday",
    title: "The Quests ask for more than you think you have.",
    him: [
      "Stations in the forest and at the water. Nerve, strength, wits. Some of it you'll be good at. Some of it you'll be bad at in front of everyone. Your team can't finish without you and you can't finish without them.",
      "Lunch is at the stations. The afternoon is yours: the water, the games, the part that is actually a camp.",
    ],
    you: [
      "Saturday is the Quests: challenge stations designed by the program team that test young men physically and mentally, always as a team. Real tools, real water, real safety men at every station.",
      "The afternoon is the summer-camp part. Fun, food, camaraderie, and tired legs.",
    ],
    media: { kind: "clip", id: "leg3" },
  },
  {
    id: "ordeal",
    n: "VII",
    stage: "The ordeal",
    when: "Saturday night",
    title: "What is said in the circle stays in the circle.",
    him: [
      "Saturday night the men sit with you around the fire, and the work changes from your body to whatever you've been carrying. Nobody makes you speak. Nobody ever has.",
      "We won't describe it here, because it's yours. We'll tell you this: the young men who came before you say it was the part that mattered.",
    ],
    you: [
      "Saturday evening the focus shifts from physical and mental effort to emotional depth. In the Society's words, the young men are invited to empty their emotional buckets and discover the resilience that's been within them all along.",
      "It is never filmed, never recorded, and never repeated outside the circle. Confidentiality is a standard every man signs. Your son may tell you about it. That is his to decide.",
    ],
    media: { kind: "clip", id: "leg4" },
    tone: "dark",
  },
  {
    id: "reward",
    n: "VIII",
    stage: "The reward",
    when: "Sunday morning",
    title: "Your shadow has been watching you all weekend.",
    him: [
      "Sunday morning he tells you what he saw. Not what you should be. What you already were, out there, when you thought nobody was looking. He gives you something to keep.",
      "Then you get your shirt. Everyone signs it. Then you write down what you're taking home.",
    ],
    you: [
      "On Sunday, in front of his team, each young man is acknowledged by the shadows who watched him all weekend, for what he actually brought. He receives a gift and a t-shirt his team signs.",
      "Then Future Plans: he writes down, in his own words, what he's claiming and where he's going. Ask him about it. He may show you.",
    ],
    media: { kind: "clip", id: "leg5" },
  },
  {
    id: "roadback",
    n: "IX",
    stage: "The road back",
    when: "Sunday, noon",
    title: "Then it's you against the men.",
    him: [
      "One game. Wild, rowdy, all of you against all of them, and the men have been waiting for this since Friday. It's the only part of the weekend where you're allowed to knock a grown man over.",
      "Then you pack up. Then you eat. Then it's time.",
    ],
    you: [
      "The weekend ends in a tradition: one spirited game, young men versus the men, something like handball meets British Bulldog. Then the young men strike their camps, eat a bag lunch, and get ready to leave.",
    ],
    media: { kind: "still", id: "men-truck" },
  },
  {
    id: "return",
    n: "X",
    stage: "The return",
    when: "Sunday, early afternoon",
    title: "You walk out between two lines of men.",
    him: [
      "Every man who was there stands in a line, and you walk between them, and each one looks you in the eye. They've done this for every young man since 1990. Now you.",
      "The bus goes south. The one who gets off it is not the one who got on.",
    ],
    you: [
      "When the young men leave, they walk through two lines of the production men, eye to eye with every man they spent the weekend with. Then the bus brings them back to Burnaby and Langley.",
      "Pick him up. Feed him. Let him sleep. Then, in the days after, watch.",
    ],
    media: { kind: "clip", id: "leg6" },
  },
];
