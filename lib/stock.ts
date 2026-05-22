// Curated, visually-vetted duck-hunting placeholder photography (Unsplash,
// free to use). Each ID was downloaded and eyeballed — mallards, low-country
// marsh, hunters in the blind, a working retriever. Swap for real trip
// photography later. Plain <img>/CSS URLs, so no remote config needed.

const PHOTO = {
  hunterDawn: "1548171971-b56560f9a7bb", // hunter + dogs silhouette at sunrise
  huntersBlind: "1481140717212-b0124736c90a", // two hunters in the brush at dusk
  marshLowcountry: "1566818421132-700d4b3ceeb7", // marsh grass + water + big sky
  marshAutumn: "1633295686973-6ce4b697ebab", // autumn wetland pond, reeds
  marshMono: "1687833343134-1e1a8e7b6184", // black-and-white marsh, lone tree
  tidalSunset: "1568522979297-104bfdf5ae4e", // tidal flats at golden sunset
  mallardDrake: "1594270844773-a7d264a62285", // mallard drake at the water's edge
  mallardHen: "1598168373100-237b409b1b74", // mallard hen by the reeds
  retrieverWater: "1520179942687-0d7dc321a7ff", // wet retriever working a river
} as const;

export type StockKey = keyof typeof PHOTO;

export function stock(key: StockKey, w = 1200, q = 60): string {
  return `https://images.unsplash.com/photo-${PHOTO[key]}?auto=format&fit=crop&w=${w}&q=${q}`;
}
