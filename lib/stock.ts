// Curated, on-brand placeholder photography (Unsplash, free to use).
// Each ID was visually vetted for the brand: moody, dawn/dusk, fog, fire,
// woods — Garden & Gun, not Bass Pro. Swap for real trip photography later.
//
// Using plain <img>/CSS background URLs (no next/image), so no remote config
// is required.

const PHOTO = {
  heroFog: "1470071459604-3b5ec3a7fe05", // dramatic highland fog at sunset
  duskMountains: "1485470733090-0aae1788d5af", // dark misty mountains, stars
  ridgeSunset: "1500534623283-312aade485b7", // warm ridges at dusk
  goldenField: "1500382017468-9049fed747ef", // golden-hour field
  campfire: "1475483768296-6163e08872a1", // fire-lit gathering at night
  starryWater: "1534447677768-be436bb09401", // moody night water
  forestPath: "1441974231531-c6227db76b6e", // soft-lit woods
} as const;

export type StockKey = keyof typeof PHOTO;

export function stock(key: StockKey, w = 1200, q = 60): string {
  return `https://images.unsplash.com/photo-${PHOTO[key]}?auto=format&fit=crop&w=${w}&q=${q}`;
}
