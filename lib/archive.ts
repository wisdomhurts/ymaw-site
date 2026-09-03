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

// The old rolls, for the grid. Every one is a real weekend.
export const OLD_ROLLS: string[] = [
  "rocks-crowd-2003", "fire-circle-meadow-2003", "shields-2003", "staffs-2003",
  "inukshuk-2006", "dusk-line-2006", "golden-game-2006", "pole-frame-2006",
  "barge-2007", "men-log-2007", "meadow-circle-2007", "everyone-2007", "men-meadow-2007",
];

// What survives from each September. "film" means video only.
export type Have = "photos" | "film" | "none" | "next";
export const YEARS: { year: number; have: Have }[] = Array.from({ length: 37 }, (_, k) => {
  const year = 1990 + k;
  const photos = new Set([2003, 2006, 2007, 2016, 2019, 2022, 2024]);
  const film = new Set([2013, 2023]);
  return { year, have: year === 2026 ? "next" : photos.has(year) ? "photos" : film.has(year) ? "film" : "none" };
});
