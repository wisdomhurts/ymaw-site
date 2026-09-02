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

export const STILLS: Record<string, Still> = {
  axe: { id: "axe", src: `${S}/axe.webp`, srcSmall: `${S}/axe-m.webp`, alt: "A young man swings an axe overhead at a round of cedar, camp behind him", stage: "camp", portrait: true, year: 2025, faces: true },
  "young-man": { id: "young-man", src: `${S}/young-man.webp`, srcSmall: `${S}/young-man-m.webp`, alt: "A young man in a cap on the beach, looking straight at the camera", stage: "return", year: 2025, faces: true },
  kayaks: { id: "kayaks", src: `${S}/kayaks.webp`, srcSmall: `${S}/kayaks-m.webp`, alt: "Kayaks pulled up on the shore, one young man paddling out onto green water", stage: "trials", year: 2025 },
  "creek-team": { id: "creek-team", src: `${S}/creek-team.webp`, srcSmall: `${S}/creek-team-m.webp`, alt: "A team in red bandanas works together on the rocks of a creek", stage: "trials", year: 2013, faces: true },
  "men-truck": { id: "men-truck", src: `${S}/men-truck.webp`, srcSmall: `${S}/men-truck-m.webp`, alt: "Production men lean on a truck in the forest, laughing at the sky", stage: "men", year: 2006, faces: true },
  "kitchen-chef": { id: "kitchen-chef", src: `${S}/kitchen-chef.webp`, srcSmall: `${S}/kitchen-chef-m.webp`, alt: "A man in a chef's jacket opens his arms wide at the camp kitchen", stage: "men", year: 2025, faces: true },
  "kayak-lake": { id: "kayak-lake", src: `${S}/kayak-lake.webp`, srcSmall: `${S}/kayak-lake-m.webp`, alt: "One kayak paddles out onto a wide grey lake under the mountains", stage: "ordinary", year: 2025 },
  huddle: { id: "huddle", src: `${S}/huddle.webp`, srcSmall: `${S}/huddle-m.webp`, alt: "Young men in purple bandanas huddle under a tarp", stage: "allies", year: 2025, faces: true },
  "brad-dorian": { id: "brad-dorian", src: `${S}/brad-dorian.webp`, srcSmall: `${S}/brad-dorian-m.webp`, alt: "Two men, the founder and his son, in the mossy forest at camp", stage: "men", year: 2025, faces: true },
  "fire-circle-2003": { id: "fire-circle-2003", src: `${S}/fire-circle-2003.webp`, srcSmall: `${S}/fire-circle-2003-m.webp`, alt: "A team sits around the fire pit under a tarp in the forest, 2003", stage: "ordeal", year: 2003, faces: true },
  "hands-raised": { id: "hands-raised", src: `${S}/hands-raised.webp`, srcSmall: `${S}/hands-raised-m.webp`, alt: "Men and young men on the shore, every hand raised to the mountains", stage: "reward", year: 2025 },
  "arch-2003": { id: "arch-2003", src: `${S}/arch-2003.webp`, alt: "Archive, 2003", stage: "archive", year: 2003 },
  "arch-2006": { id: "arch-2006", src: `${S}/arch-2006.webp`, alt: "Archive, 2006", stage: "archive", year: 2006 },
  "arch-2025": { id: "arch-2025", src: `${S}/arch-2025.webp`, alt: "Archive, 2025", stage: "archive", year: 2025 },
  king: { id: "king", src: `${S}/king.webp`, alt: "A young man stands on the shore", stage: "reward" },
  volunteer: { id: "volunteer", src: `${S}/volunteer.webp`, alt: "Production men at the site", stage: "men" },
};

export const CLIPS: Record<string, Clip> = {
  leg1: { id: "leg1", src: `${C}/leg1.mp4`, poster: `${S}/kayak-lake.webp`, alt: "Slow drift over the lake at dusk", stage: "ordinary", seconds: 8 },
  leg2: { id: "leg2", src: `${C}/leg2-m.mp4`, poster: `${S}/axe-m.webp`, alt: "The axe comes down", stage: "camp", seconds: 8, portrait: true },
  leg3: { id: "leg3", src: `${C}/leg3-m.mp4`, poster: `${S}/kayaks-m.webp`, alt: "Kayaks off the shore", stage: "trials", seconds: 8, portrait: true },
  leg4: { id: "leg4", src: `${C}/leg4-m.mp4`, poster: `${S}/fire-circle-2003-m.webp`, alt: "The fire circle", stage: "ordeal", seconds: 8, portrait: true },
  leg5: { id: "leg5", src: `${C}/leg5.mp4`, poster: `${S}/hands-raised.webp`, alt: "Every hand goes up", stage: "reward", seconds: 12 },
  leg6: { id: "leg6", src: `${C}/leg6-m.mp4`, poster: `${S}/young-man-m.webp`, alt: "He looks back", stage: "return", seconds: 8, portrait: true },
};

export const still = (id: keyof typeof STILLS | string) => STILLS[id as string];
export const clip = (id: keyof typeof CLIPS | string) => CLIPS[id as string];
