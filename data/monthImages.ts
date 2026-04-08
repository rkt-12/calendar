export interface MonthImage {
  url: string;
  alt: string;
  credit: string;
}

// Curated Unsplash images — one per month
// Each image fits the season/mood of that month
export const MONTH_IMAGES: Record<number, MonthImage> = {
  0: {
    // January
    url: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=800&q=80",
    alt: "Snow covered mountain peaks in January",
    credit: "Unsplash",
  },
  1: {
    // February
    url: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    alt: "Misty forest in February",
    credit: "Unsplash",
  },
  2: {
    // March
    url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80",
    alt: "Cherry blossoms blooming in March",
    credit: "Unsplash",
  },
  3: {
    // April
    url: "https://images.unsplash.com/photo-1490750967868-88df5691cc06?w=800&q=80",
    alt: "Vibrant spring flowers in April",
    credit: "Unsplash",
  },
  4: {
    // May
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Green meadows in May",
    credit: "Unsplash",
  },
  5: {
    // June
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    alt: "Golden beach in June",
    credit: "Unsplash",
  },
  6: {
    // July
    url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",
    alt: "Lush green forest in July",
    credit: "Unsplash",
  },
  7: {
    // August
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    alt: "Sunflower fields in August",
    credit: "Unsplash",
  },
  8: {
    // September
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    alt: "Autumn begins in September",
    credit: "Unsplash",
  },
  9: {
    // October
    url: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80",
    alt: "Fall foliage in October",
    credit: "Unsplash",
  },
  10: {
    // November
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80",
    alt: "Foggy autumn morning in November",
    credit: "Unsplash",
  },
  11: {
    // December
    url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80",
    alt: "Snowy winter landscape in December",
    credit: "Unsplash",
  },
};

export function getMonthImage(monthIndex: number): MonthImage {
  return MONTH_IMAGES[monthIndex] ?? MONTH_IMAGES[0];
}