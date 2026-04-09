export interface MonthImage {
  url: string;
  alt: string;
}

// Curated Unsplash images — one per month
// Each image fits the season/mood of that month
export const MONTH_IMAGES: Record<number, MonthImage> = {
  0: {
    url: "/images/jan.jpg",
    alt: "Snow covered mountain peaks in January",
  },
  1: {
    url: "/images/feb.jpg",
    alt: "Misty forest in February",
  },
  2: {
    url: "/images/mar.jpg",
    alt: "Cherry blossoms blooming in March",
  },
  3: {
    url: "/images/apr.jpg",
    alt: "Vibrant spring flowers in April",
  },
  4: {
    url: "/images/may.jpg",
    alt: "Green meadows in May",
  },
  5: {
    url: "/images/jun.jpg",
    alt: "Golden beach in June",
  },
  6: {
    url: "/images/jul.jpg",
    alt: "Lush green forest in July",
  },
  7: {
    url: "/images/aug.jpg",
    alt: "Sunflower fields in August",
  },
  8: {
    url: "/images/sep.jpg",
    alt: "Autumn begins in September",
  },
  9: {
    url: "/images/oct.jpg",
    alt: "Fall foliage in October",
  },
  10: {
    url: "/images/nov.jpg",
    alt: "Foggy autumn morning in November",
  },
  11: {
    url: "/images/dec.jpg",
    alt: "Snowy winter landscape in December",
  },
};

export function getMonthImage(monthIndex: number): MonthImage {
  return MONTH_IMAGES[monthIndex] ?? MONTH_IMAGES[0];
}