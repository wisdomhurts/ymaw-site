// The archive, as it actually survives. The first thirteen years were shot
// on film and most of it is gone; from 2003 there are rolls, from 2019
// there is everything. So the page pairs the same moment across the years
// we have, instead of pretending to one frame per year.

export type Pair = {
  title: string;   // the moment
  line: string;    // one sentence under it
  then: string;    // STILLS id, the old roll
  now: string;     // STILLS id, recent
};

export const PAIRS: Pair[] = [
  { title: "The creek.", line: "Same rocks, same cold water, twenty years apart. The Quest hasn't changed because it doesn't need to.", then: "creek-2003", now: "creek-2023" },
  { title: "The water.", line: "Rafts you built that morning, then. Kayaks now. Either way you're the one paddling.", then: "raft-2003", now: "kayaks-lined" },
  { title: "The circle.", line: "Dusk by the lake in 2006, dusk in the meadow in 2024. What's said in it has never been filmed.", then: "dusk-circle-2006", now: "meadow-circle" },
  { title: "The game.", line: "Sunday morning, young men versus the men, dust in the air. The men have been waiting since Friday.", then: "game-2003", now: "game-2023" },
  { title: "The men.", line: "In the lot before the trucks left, 2006. On the shore before the young men arrived, 2019. Nobody paid.", then: "men-lot-2006", now: "men-shore" },
  { title: "Everyone.", line: "Sunday, before the bus. The young men in the first frame are about the age of the men in the second.", then: "everyone-2003", now: "group-2024" },
];
