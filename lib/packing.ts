// From the Society's 2026 adventure checklist. Rewritten to him, with a
// note for the person packing with him where it helps.

export type Item = { item: string; note?: string };
export type Group = { name: string; why: string; items: Item[] };

export const PACKING: Group[] = [
  {
    name: "On your back",
    why: "Three days. It rains here even in September. Pack for cold and wet and you'll be fine either way.",
    items: [
      { item: "Socks, underwear, shirts for 3 days", note: "One more pair of socks than you think." },
      { item: "Pants and shorts" },
      { item: "A sweater or fleece" },
      { item: "A heavy jacket", note: "Nights are cold by the water." },
      { item: "Rain gear", note: "Jacket at minimum. Pants if you have them." },
      { item: "Long-sleeve shirt", note: "Sun and bugs." },
      { item: "Hat" },
      { item: "Two pairs of shoes", note: "One you can hike in, broken in, and one to change into. No flip-flops." },
      { item: "Swimsuit and towel" },
    ],
  },
  {
    name: "For sleeping",
    why: "You build your own shelter with your team. You bring what goes inside it.",
    items: [
      { item: "Sleeping bag", note: "Compact. It travels on the bus and up the trail on your back." },
      { item: "Sleeping mat", note: "ThermaRest or thin foam. Small." },
      { item: "Flashlight or headlamp, with batteries", note: "Headlamp is better: your hands are busy." },
    ],
  },
  {
    name: "For eating",
    why: "Eight meals cooked over fire. Plates, bowls and cutlery are supplied, biodegradable, so leave the kit at home.",
    items: [
      { item: "Water bottle, full", note: "For the bus and the weekend." },
      { item: "A packed lunch for the bus", note: "The ride is about three hours. You'll want it." },
    ],
  },
  {
    name: "Toiletries",
    why: "Small. A ziplock does it.",
    items: [
      { item: "Toothbrush" },
      { item: "Medications, in a labelled bag", note: "Listed at registration. The safety man can hold them if you'd prefer." },
    ],
  },
];

export const LEAVE_HOME: Item[] = [
  { item: "Phone, music, games, any electronics", note: "It stays with whoever drops you off. Everyone survives this." },
  { item: "Weapons and knives", note: "The men supply every tool you'll use and teach you to use it." },
  { item: "Drugs, tobacco, alcohol, vapes" },
  { item: "Tents and tarps", note: "Your team builds its shelter from the Society's gear." },
  { item: "Lighters and matches" },
];

export const CONFISCATION = "Items from this list will be confiscated and may, or may not, be returned at the end of the weekend.";
