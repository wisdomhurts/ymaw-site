// One frame per year we have. Grows a ring every September.
export type Ring = { year: number; still: string; line: string };

export const RINGS: Ring[] = [
  { year: 1990, still: "", line: "Brad Leslie starts the weekend for his son and for the next generation." },
  { year: 2003, still: "fire-circle-2003", line: "A team around the fire pit under a tarp." },
  { year: 2006, still: "men-truck", line: "Production men on the truck, looking up." },
  { year: 2013, still: "creek-team", line: "Red bandanas on the creek rocks." },
  { year: 2016, still: "group-2016", line: "Everyone on the beach." },
  { year: 2019, still: "bus-forest", line: "The bus arrives in the forest." },
  { year: 2022, still: "single-file", line: "Single file into the old growth." },
  { year: 2023, still: "bus-road-2023", line: "The bus on the gravel road." },
  { year: 2024, still: "meadow-circle", line: "One circle at dusk, a fire in the middle." },
  { year: 2026, still: "", line: "September 11–13. His year." },
];
