import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Pintail Experience",
    short_name: "Pintail",
    description:
      "A curated, faith-based hunting retreat — in your pocket from confirmation to long after the trip.",
    start_url: "/home",
    display: "standalone",
    background_color: "#1a1620",
    theme_color: "#1a1620",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
