// One frame per year we have. Grows a ring every September.
export type Ring = { year: number; still: string; line: string };

export const RINGS: Ring[] = [
  { year: 1990, still: "", line: "Brad Leslie starts the weekend for his son and for the next generation." },
  { year: 2003, still: "fire-circle-2003", line: "A team around the fire pit under a tarp." },
  { year: 2006, still: "men-truck", line: "Production men on the truck, looking up." },
  { year: 2013, still: "creek-team", line: "Red bandanas on the creek rocks." },
  { year: 2024, still: "huddle", line: "The huddle under the tarp." },
  { year: 2025, still: "hands-raised", line: "Every hand raised at the water." },
  { year: 2026, still: "", line: "September 11–13. His year." },
];
