// Real trip photography (founder-provided, converted from RAW into
// /public/img). Replaces the earlier Unsplash placeholders. The optional
// width/quality args are ignored now that these are local, fixed-size files —
// kept so existing call sites compile unchanged.

const PHOTO = {
  marshDawn: "marsh-dawn", // wide dawn marsh, hunter wading among decoys
  lodgeFire: "lodge-fire", // night cook at the lodge, warm glow
  decoySpread: "decoy-spread", // hunter in the boat over a decoy spread
  leatherMark: "leather-mark", // embossed Pintail leather bag
  featherDetail: "feather-detail", // macro of duck feathers
  goldenPortrait: "golden-portrait", // golden-hour portrait, Pintail cap
  capPortrait: "cap-portrait", // portrait in a Pintail patch cap
  thermosHands: "thermos-hands", // hands pouring a thermos in the blind
  boatHunter: "boat-hunter", // hunter in the boat, flooded field
} as const;

export type StockKey = keyof typeof PHOTO;

export function stock(key: StockKey, _w?: number, _q?: number): string {
  return `/img/${PHOTO[key]}.jpg`;
}
