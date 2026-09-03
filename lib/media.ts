// Media manifest. Every entry is a real frame from a YMAW weekend.
// `stage` maps a frame to a station on the hero's journey.
// `faces` flags identifiable young men (used only where the archive already
// carried them publicly, or with consent).

export type Stage =
  | "ordinary" | "call" | "threshold" | "allies" | "camp" | "trials"
  | "ordeal" | "reward" | "roadback" | "return" | "men" | "archive";

export type Still = {
  id: string;
  src: string;
  srcSmall?: string;
  alt: string;
  year?: number;
  stage: Stage;
  portrait?: boolean;
  faces?: boolean;
  w?: number; h?: number;
};

export type Clip = {
  id: string;
  src: string;
  poster: string;
  alt: string;
  year?: number;
  stage: Stage;
  seconds?: number;
  portrait?: boolean;
};

const S = "/media/stills";
const C = "/media/clips";
const G = "/media/gallery";

export const STILLS: Record<string, Still> = {
  axe: { id: "axe", src: `${S}/axe.webp`, srcSmall: `${S}/axe-m.webp`, alt: "A young man swings an axe overhead at a round of cedar, camp behind him", stage: "camp", portrait: true, year: 2025, faces: true },
  "young-man": { id: "young-man", src: `${S}/young-man.webp`, srcSmall: `${S}/young-man-m.webp`, alt: "A young man in a cap on the beach, looking straight at the camera", stage: "return", year: 2025, faces: true },
  kayaks: { id: "kayaks", src: `${S}/kayaks.webp`, srcSmall: `${S}/kayaks-m.webp`, alt: "Kayaks pulled up on the shore, one young man paddling out onto green water", stage: "trials", year: 2025 },
  "creek-team": { id: "creek-team", src: `${S}/creek-team.webp`, srcSmall: `${S}/creek-team-m.webp`, alt: "A team in red bandanas works together on the rocks of a creek", stage: "trials", year: 2013, faces: true },
  "men-truck": { id: "men-truck", src: `${S}/men-truck.webp`, srcSmall: `${S}/men-truck-m.webp`, alt: "Production men lean on a truck in the forest, laughing at the sky", stage: "men", year: 2006, faces: true },
  "kitchen-chef": { id: "kitchen-chef", src: `${S}/kitchen-chef.webp`, srcSmall: `${S}/kitchen-chef-m.webp`, alt: "A man in a chef's jacket opens his arms wide at the camp kitchen", stage: "men", year: 2025, faces: true },
  "kayak-lake": { id: "kayak-lake", src: `${S}/kayak-lake.webp`, srcSmall: `${S}/kayak-lake-m.webp`, alt: "One kayak paddles out onto a wide grey lake under the mountains", stage: "ordinary", year: 2025 },
  huddle: { id: "huddle", src: `${S}/huddle.webp`, srcSmall: `${S}/huddle-m.webp`, alt: "Young men in purple bandanas huddle under a tarp", stage: "allies", year: 2025, faces: true },
  "fire-circle-2003": { id: "fire-circle-2003", src: `${S}/fire-circle-2003.webp`, srcSmall: `${S}/fire-circle-2003-m.webp`, alt: "A team sits around the fire pit under a tarp in the forest, 2003", stage: "ordeal", year: 2003, faces: true },
  "hands-raised": { id: "hands-raised", src: `${S}/hands-raised.webp`, srcSmall: `${S}/hands-raised-m.webp`, alt: "Men and young men on the shore, every hand raised to the mountains", stage: "reward", year: 2025 },
  "arch-2003": { id: "arch-2003", src: `${S}/arch-2003.webp`, alt: "Archive, 2003", stage: "archive", year: 2003 },
  "arch-2006": { id: "arch-2006", src: `${S}/arch-2006.webp`, alt: "Archive, 2006", stage: "archive", year: 2006 },
  "arch-2025": { id: "arch-2025", src: `${S}/arch-2025.webp`, alt: "Archive, 2025", stage: "archive", year: 2025 },
  king: { id: "king", src: `${S}/king.webp`, alt: "A young man stands on the shore", stage: "reward" },
  volunteer: { id: "volunteer", src: `${S}/volunteer.webp`, alt: "Production men at the site", stage: "men" },
  // From the 2026 archive survey (public/media/gallery)
  "fire-circle-lake": { id: "fire-circle-lake", src: `${G}/stills/p-y2019-0231.webp`, srcSmall: `${G}/stills/p-y2019-0231-m.webp`, alt: "Dusk. Everyone in a circle around the fire pit by the lake, mountains behind", stage: "ordeal", year: 2019 },
  "meadow-circle": { id: "meadow-circle", src: `${G}/stills/p-y2024-0217.webp`, srcSmall: `${G}/stills/p-y2024-0217-m.webp`, alt: "The whole weekend in one circle in the meadow at dusk, a fire in the middle", stage: "allies", year: 2024 },
  "bus-forest": { id: "bus-forest", src: `${G}/stills/p-y2019-0104.webp`, srcSmall: `${G}/stills/p-y2019-0104-m.webp`, alt: "The yellow school bus arriving on the forest road", stage: "call", year: 2019 },
  "bus-packs": { id: "bus-packs", src: `${G}/stills/p-y2019-0107.webp`, srcSmall: `${G}/stills/p-y2019-0107-m.webp`, alt: "Young men with packs beside the bus in the forest", stage: "threshold", year: 2019 },
  "packs-trailhead": { id: "packs-trailhead", src: `${G}/stills/p-y2019-0108.webp`, srcSmall: `${G}/stills/p-y2019-0108-m.webp`, alt: "Young men shoulder their packs at the trailhead", stage: "threshold", year: 2019 },
  "single-file": { id: "single-file", src: `${G}/stills/p-y2022-0100.webp`, srcSmall: `${G}/stills/p-y2022-0100-m.webp`, alt: "Young men walking single file into the old growth", stage: "threshold", year: 2022 },
  "rain-circle": { id: "rain-circle", src: `${G}/stills/p-y2019-0243.webp`, srcSmall: `${G}/stills/p-y2019-0243-m.webp`, alt: "The circle in the rain under the old growth, everyone in ponchos", stage: "allies", year: 2019 },
  "circle-old-growth": { id: "circle-old-growth", src: `${G}/stills/p-y2019-0254.webp`, srcSmall: `${G}/stills/p-y2019-0254-m.webp`, alt: "A wide circle of men and young men in the mossy forest", stage: "allies", year: 2019 },
  "stump": { id: "stump", src: `${G}/stills/p-y2019-0126.webp`, srcSmall: `${G}/stills/p-y2019-0126-m.webp`, alt: "A young man stands on a mossy stump, facing the forest", stage: "reward", year: 2019 },
  "lake-watch": { id: "lake-watch", src: `${G}/stills/p-ymawphotos-0030.webp`, srcSmall: `${G}/stills/p-ymawphotos-0030-m.webp`, alt: "A man and a young man at the lake's edge, looking out", stage: "return" },
  "arms-up-lake": { id: "arms-up-lake", src: `${G}/stills/p-ymawphotos-0109.webp`, srcSmall: `${G}/stills/p-ymawphotos-0109-m.webp`, alt: "The whole weekend at the lake, every arm up", stage: "return" },
  "men-shore": { id: "men-shore", src: `${G}/stills/p-y2019-0216.webp`, srcSmall: `${G}/stills/p-y2019-0216-m.webp`, alt: "The production men in a line at the lakeshore", stage: "men", year: 2019 },
  "men-line": { id: "men-line", src: `${G}/stills/p-y2019-0215.webp`, srcSmall: `${G}/stills/p-y2019-0215-m.webp`, alt: "The production men lined up on the shore, mountains behind", stage: "men", year: 2019 },
  "men-circle-arms": { id: "men-circle-arms", src: `${G}/stills/p-y2019-0257.webp`, srcSmall: `${G}/stills/p-y2019-0257-m.webp`, alt: "Men in the forest circle, arms out", stage: "men", year: 2019 },
  "sun-forest": { id: "sun-forest", src: `${G}/stills/p-y2024-0264.webp`, srcSmall: `${G}/stills/p-y2024-0264-m.webp`, alt: "Sun through the cedars over the forest camp", stage: "threshold", year: 2024 },
  "embers": { id: "embers", src: `${G}/stills/p-y2019-0236.webp`, srcSmall: `${G}/stills/p-y2019-0236-m.webp`, alt: "The fire at night, embers", stage: "ordeal", year: 2019 },
  "driftwood-fire": { id: "driftwood-fire", src: `${G}/stills/p-y2019-0166.webp`, srcSmall: `${G}/stills/p-y2019-0166-m.webp`, alt: "The driftwood fire pit on the lakeshore", stage: "camp", year: 2019 },
  "pushups": { id: "pushups", src: `${G}/stills/p-y2019-0155.webp`, srcSmall: `${G}/stills/p-y2019-0155-m.webp`, alt: "Everyone doing push-ups on the beach at morning circle", stage: "trials", year: 2019 },
  "shields": { id: "shields", src: `${G}/stills/p-y2022-0120.webp`, srcSmall: `${G}/stills/p-y2022-0120-m.webp`, alt: "Young men with wooden shields in the forest quest", stage: "trials", year: 2022 },
  "swim": { id: "swim", src: `${G}/stills/p-ymawphotos-0095.webp`, srcSmall: `${G}/stills/p-ymawphotos-0095-m.webp`, alt: "Young men wading into the turquoise lake", stage: "trials" },
  "game-dust": { id: "game-dust", src: `${G}/stills/p-ymawphotos-0119.webp`, srcSmall: `${G}/stills/p-ymawphotos-0119-m.webp`, alt: "The game: young men versus the men in the dust", stage: "roadback" },
  "griddle": { id: "griddle", src: `${G}/stills/p-y2019-0226.webp`, srcSmall: `${G}/stills/p-y2019-0226-m.webp`, alt: "A production man at the kitchen griddle", stage: "men", year: 2019 },
  "axe-swing": { id: "axe-swing", src: `${G}/stills/p-y2022-0061.webp`, srcSmall: `${G}/stills/p-y2022-0061-m.webp`, alt: "A man splitting wood with an axe", stage: "camp", year: 2022 },
  "misty-shore": { id: "misty-shore", src: `${G}/stills/p-y2019-0003.webp`, srcSmall: `${G}/stills/p-y2019-0003-m.webp`, alt: "Figures at the misty lakeshore under the trees", stage: "ordinary", year: 2019 },
  "beach-fire-smoke": { id: "beach-fire-smoke", src: `${G}/stills/p-y2019-0022.webp`, srcSmall: `${G}/stills/p-y2019-0022-m.webp`, alt: "Smoke from the beach fire, the whole camp by the lake", stage: "ordeal", year: 2019 },
  "kayak-grey": { id: "kayak-grey", src: `${G}/stills/p-y2019-0183.webp`, srcSmall: `${G}/stills/p-y2019-0183-m.webp`, alt: "A kayak on the grey lake", stage: "trials", year: 2019 },
  "raft": { id: "raft", src: `${G}/stills/p-ymawphotos-0008.webp`, srcSmall: `${G}/stills/p-ymawphotos-0008-m.webp`, alt: "Two young men poling a raft across the lake", stage: "trials" },
  "run-lake": { id: "run-lake", src: `${G}/stills/p-ymawphotos-0073.webp`, srcSmall: `${G}/stills/p-ymawphotos-0073-m.webp`, alt: "Two young men running into the lake", stage: "trials" },
  "group-2019": { id: "group-2019", src: `${G}/stills/p-y2019-0300.webp`, srcSmall: `${G}/stills/p-y2019-0300-m.webp`, alt: "The 2019 weekend, everyone, at the lake", stage: "return", year: 2019 },
  "group-2016": { id: "group-2016", src: `${G}/stills/p-y2016-0025.webp`, srcSmall: `${G}/stills/p-y2016-0025-m.webp`, alt: "The 2016 weekend, everyone, on the beach", stage: "return", year: 2016 },
  "group-2024": { id: "group-2024", src: `${G}/stills/p-y2024-0445.webp`, srcSmall: `${G}/stills/p-y2024-0445-m.webp`, alt: "The 2024 weekend, everyone, under the trees", stage: "return", year: 2024 },
  "tarp-forest": { id: "tarp-forest", src: `${G}/stills/p-y2024-0196.webp`, srcSmall: `${G}/stills/p-y2024-0196-m.webp`, alt: "A tarp shelter going up in the forest", stage: "camp", year: 2024 },
  "mossy-trail": { id: "mossy-trail", src: `${G}/stills/p-y2019-0044.webp`, srcSmall: `${G}/stills/p-y2019-0044-m.webp`, alt: "The mossy trail through the old growth", stage: "threshold", year: 2019 },
  "brad-points": { id: "brad-points", src: `${S}/brad-points.webp`, srcSmall: `${S}/brad-points-m.webp`, alt: "The founder, mid-sentence, one finger raised, a young man in a cap listening", stage: "men", faces: true },
  "creek-quest": { id: "creek-quest", src: `${G}/stills/p-ymawphotos-0020.webp`, srcSmall: `${G}/stills/p-ymawphotos-0020-m.webp`, alt: "A young man leaps the creek rocks on a Quest, his team behind him", stage: "trials", year: 0 },
  "kayaks-lined": { id: "kayaks-lined", src: `${G}/stills/p-y2019-0192.webp`, srcSmall: `${G}/stills/p-y2019-0192-m.webp`, alt: "Orange kayaks lined up on the shore, young men at the water", stage: "trials", year: 2019 },
  "raft-2003": { id: "raft-2003", src: `${G}/stills/p-extra-0084.webp`, srcSmall: `${G}/stills/p-extra-0084-m.webp`, alt: "Two young men pole a raft they built across the lake, 2003", stage: "trials", year: 2003 },
  "rocks-crowd-2003": { id: "rocks-crowd-2003", src: `${G}/stills/p-extra-0087.webp`, srcSmall: `${G}/stills/p-extra-0087-m.webp`, alt: "Everyone on the rocks above the green water, 2003", stage: "allies", year: 2003 },
  "creek-2003": { id: "creek-2003", src: `${G}/stills/p-extra-0096.webp`, srcSmall: `${G}/stills/p-extra-0096-m.webp`, alt: "The creek crossing Quest, 2003", stage: "trials", year: 2003 },
  "fire-circle-meadow-2003": { id: "fire-circle-meadow-2003", src: `${G}/stills/p-extra-0107.webp`, srcSmall: `${G}/stills/p-extra-0107-m.webp`, alt: "The circle in the meadow around the fire, 2003", stage: "ordeal", year: 2003 },
  "everyone-2003": { id: "everyone-2003", src: `${G}/stills/p-extra-0115.webp`, srcSmall: `${G}/stills/p-extra-0115-m.webp`, alt: "Everyone on the beach, 2003", stage: "return", year: 2003, faces: true },
  "shields-2003": { id: "shields-2003", src: `${G}/stills/p-extra-0129.webp`, srcSmall: `${G}/stills/p-extra-0129-m.webp`, alt: "Shields lined up in the meadow, 2003", stage: "roadback", year: 2003 },
  "game-2003": { id: "game-2003", src: `${G}/stills/p-extra-0133.webp`, srcSmall: `${G}/stills/p-extra-0133-m.webp`, alt: "The game in the dust, 2003", stage: "roadback", year: 2003 },
  "staffs-2003": { id: "staffs-2003", src: `${G}/stills/p-extra-0136.webp`, srcSmall: `${G}/stills/p-extra-0136-m.webp`, alt: "Staffs on the field, 2003", stage: "roadback", year: 2003 },
  "inukshuk-2006": { id: "inukshuk-2006", src: `${G}/stills/p-y2006-0087.webp`, srcSmall: `${G}/stills/p-y2006-0087-m.webp`, alt: "Building the inukshuk on the rocks above the lake, 2006", stage: "reward", year: 2006 },
  "shore-rocks-2006": { id: "shore-rocks-2006", src: `${G}/stills/p-y2006-0096.webp`, srcSmall: `${G}/stills/p-y2006-0096-m.webp`, alt: "Everyone along the rocks by the water, 2006", stage: "allies", year: 2006 },
  "men-lot-2006": { id: "men-lot-2006", src: `${G}/stills/p-y2006-0123.webp`, srcSmall: `${G}/stills/p-y2006-0123-m.webp`, alt: "Production men in the lot before the trucks leave, 2006", stage: "men", year: 2006, faces: true },
  "pole-frame-2006": { id: "pole-frame-2006", src: `${G}/stills/p-y2006-0208.webp`, srcSmall: `${G}/stills/p-y2006-0208-m.webp`, alt: "Raising the pole frame at the lakeshore, 2006", stage: "camp", year: 2006 },
  "dusk-circle-2006": { id: "dusk-circle-2006", src: `${G}/stills/p-y2006-0244.webp`, srcSmall: `${G}/stills/p-y2006-0244-m.webp`, alt: "The circle at dusk by the lake, 2006", stage: "ordeal", year: 2006 },
  "dusk-line-2006": { id: "dusk-line-2006", src: `${G}/stills/p-y2006-0246.webp`, srcSmall: `${G}/stills/p-y2006-0246-m.webp`, alt: "A line along the shore at dusk, 2006", stage: "ordeal", year: 2006 },
  "golden-game-2006": { id: "golden-game-2006", src: `${G}/stills/p-y2006-0272.webp`, srcSmall: `${G}/stills/p-y2006-0272-m.webp`, alt: "The game in the golden meadow, 2006", stage: "roadback", year: 2006 },
  "men-meadow-2007": { id: "men-meadow-2007", src: `${G}/stills/p-y2007-0083.webp`, srcSmall: `${G}/stills/p-y2007-0083-m.webp`, alt: "Men on the meadow, 2007", stage: "men", year: 2007, faces: true },
  "barge-2007": { id: "barge-2007", src: `${G}/stills/p-y2007-0086.webp`, srcSmall: `${G}/stills/p-y2007-0086-m.webp`, alt: "The barge at the lakeshore, 2007", stage: "camp", year: 2007 },
  "men-log-2007": { id: "men-log-2007", src: `${G}/stills/p-y2007-0373.webp`, srcSmall: `${G}/stills/p-y2007-0373-m.webp`, alt: "Men on the log with staffs, 2007", stage: "men", year: 2007, faces: true },
  "everyone-2007": { id: "everyone-2007", src: `${G}/stills/p-y2007-0393.webp`, srcSmall: `${G}/stills/p-y2007-0393-m.webp`, alt: "Everyone at the lake, 2007", stage: "return", year: 2007, faces: true },
  "meadow-circle-2007": { id: "meadow-circle-2007", src: `${G}/stills/p-y2007-0131.webp`, srcSmall: `${G}/stills/p-y2007-0131-m.webp`, alt: "The big circle in the meadow, 2007", stage: "allies", year: 2007 },
  "creek-2023": { id: "creek-2023", src: `${G}/posters/c-2157.webp`, alt: "A team crossing the creek rocks on a Quest, 2023", stage: "trials", year: 2023 },
  "game-2023": { id: "game-2023", src: `${G}/posters/c-1614.webp`, alt: "The game, running through the dust, 2023", stage: "roadback", year: 2023 },
  "bus-road-2023": { id: "bus-road-2023", src: `${G}/posters/c-1478.webp`, alt: "The bus arriving on the gravel road, 2023", stage: "call", year: 2023 },
};

export const CLIPS: Record<string, Clip> = {
  leg1: { id: "leg1", src: `${C}/leg1.mp4`, poster: `${S}/kayak-lake.webp`, alt: "Slow drift over the lake at dusk", stage: "ordinary", seconds: 8 },
  leg2: { id: "leg2", src: `${C}/leg2-m.mp4`, poster: `${S}/axe-m.webp`, alt: "The axe comes down", stage: "camp", seconds: 8, portrait: true },
  leg3: { id: "leg3", src: `${C}/leg3-m.mp4`, poster: `${S}/kayaks-m.webp`, alt: "Kayaks off the shore", stage: "trials", seconds: 8, portrait: true },
  leg4: { id: "leg4", src: `${C}/leg4-m.mp4`, poster: `${S}/fire-circle-2003-m.webp`, alt: "The fire circle", stage: "ordeal", seconds: 8, portrait: true },
  leg5: { id: "leg5", src: `${C}/leg5.mp4`, poster: `${S}/hands-raised.webp`, alt: "Every hand goes up", stage: "reward", seconds: 12 },
  leg6: { id: "leg6", src: `${C}/leg6-m.mp4`, poster: `${S}/young-man-m.webp`, alt: "He looks back", stage: "return", seconds: 8, portrait: true },
  // From the 2026 archive survey
  "drone-lake": { id: "drone-lake", src: `${G}/clips/c-0139.mp4`, poster: `${G}/posters/c-0139.webp`, alt: "Drone over the lake and the forest", stage: "ordinary", year: 2022, seconds: 9 },
  "off-the-bus": { id: "off-the-bus", src: `${G}/clips/c-2156.mp4`, poster: `${G}/posters/c-2156.webp`, alt: "Young men getting off the yellow bus in the forest", stage: "call", year: 2023, seconds: 9 },
  "packs-forest": { id: "packs-forest", src: `${G}/clips/c-1495.mp4`, poster: `${G}/posters/c-1495.webp`, alt: "Young men with packs walking through the forest", stage: "threshold", year: 2023, seconds: 9 },
  "rain-circle": { id: "rain-circle", src: `${G}/clips/c-0051.mp4`, poster: `${G}/posters/c-0051.webp`, alt: "The circle in the rain under the old growth", stage: "allies", year: 2019, seconds: 9 },
  "shelters": { id: "shelters", src: `${G}/clips/c-1514.mp4`, poster: `${G}/posters/c-1514.webp`, alt: "Teams building their tarp shelters in the forest", stage: "camp", year: 2023, seconds: 9 },
  "drone-kayaks": { id: "drone-kayaks", src: `${G}/clips/c-0134.mp4`, poster: `${G}/posters/c-0134.webp`, alt: "Drone over kayaks on the turquoise lake", stage: "trials", year: 2022, seconds: 9 },
  "lanterns": { id: "lanterns", src: `${G}/clips/c-2179.mp4`, poster: `${G}/posters/c-2179.webp`, alt: "Lanterns on the shore at dusk", stage: "ordeal", year: 2023, seconds: 9 },
  "arms-raised": { id: "arms-raised", src: `${G}/clips/c-1545.mp4`, poster: `${G}/posters/c-1545.webp`, alt: "Young men with their arms raised at the shore", stage: "reward", year: 2023, seconds: 9 },
  "dust-run": { id: "dust-run", src: `${G}/clips/c-1614.mp4`, poster: `${G}/posters/c-1614.webp`, alt: "The game: running through the dust", stage: "roadback", year: 2023, seconds: 9 },
  "misty-shore-walk": { id: "misty-shore-walk", src: `${G}/clips/c-0117.mp4`, poster: `${G}/posters/c-0117.webp`, alt: "A young man carries his pack along the misty shore", stage: "return", year: 2019, seconds: 9 },
  "lantern-path": { id: "lantern-path", src: `${G}/clips/c-1598.mp4`, poster: `${G}/posters/c-1598.webp`, alt: "The lantern path along the shore at dusk", stage: "ordeal", year: 2023, seconds: 9 },
  "lake-dusk": { id: "lake-dusk", src: `${G}/clips/c-1594.mp4`, poster: `${G}/posters/c-1594.webp`, alt: "The lake at dusk, mountains going blue", stage: "ordinary", year: 2023, seconds: 9 },
  "bus-forest-side": { id: "bus-forest-side", src: `${G}/clips/c-0011.mp4`, poster: `${G}/posters/c-0011.webp`, alt: "The yellow school bus parked in the forest, young men beside it", stage: "call", year: 2019, seconds: 9 },
  "kayaks-launch": { id: "kayaks-launch", src: `${G}/clips/c-0162.mp4`, poster: `${G}/posters/c-0162.webp`, alt: "Orange kayaks launching, a young man paddling out", stage: "trials", year: 2019, seconds: 9 },
  "bus-road": { id: "bus-road", src: `${G}/clips/c-1478.mp4`, poster: `${G}/posters/c-1478.webp`, alt: "The yellow bus arriving on the gravel road", stage: "call", year: 2023, seconds: 9 },
};

export const still = (id: keyof typeof STILLS | string) => STILLS[id as string];
export const clip = (id: keyof typeof CLIPS | string) => CLIPS[id as string];
