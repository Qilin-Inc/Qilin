// Define a type for main ranks and their sub-ranks
type MainRank = "iron" | "bronze" | "silver" | "gold" | "platinum" | "diamond" | "ascendent" | "immortal" | "radiant" | "unranked";
type SubRank = "1" | "2" | "3"; // Define sub-rank levels

// Define a type for full rank names with space (e.g., "iron 1", "iron 2")
type FullRank = `${MainRank} ${SubRank}` | MainRank; // Main rank with optional sub-rank

// Object mapping full ranks to their image URLs
const rankImages: Record<FullRank, string> = {
    "iron 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/3.webp",
    "iron 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/4.webp",
    "iron 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/5.webp",
    "bronze 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/6.webp",
    "bronze 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/7.webp",
    "bronze 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/8.webp",
    "silver 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/9.webp",
    "silver 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/10.webp",
    "silver 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/11.webp",
    "gold 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/12.webp",
    "gold 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/13.webp",
    "gold 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/14.webp",
    "platinum 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/15.webp",
    "platinum 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/16.webp",
    "platinum 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/17.webp",
    "diamond 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/18.webp",
    "diamond 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/19.webp",
    "diamond 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/20.webp",
    "ascendent 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/21.webp",
    "ascendent 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/22.webp",
    "ascendent 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/23.webp",
    "immortal 1": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/24.webp",
    "immortal 2": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/25.webp",
    "immortal 3": "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/26.webp",
    radiant: "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/27.webp",
    unranked: "https://example.com/images/ranks/unranked.png",
    iron: "",
    bronze: "",
    silver: "",
    gold: "",
    platinum: "",
    diamond: "",
    ascendent: "",
    immortal: "",
    "radiant 1": "",
    "radiant 2": "",
    "radiant 3": "",
    "unranked 1": "",
    "unranked 2": "",
    "unranked 3": ""
};

/**
 * Get the image URL for a given rank
 * @param {string} rank - The rank name (e.g., "iron 1", "radiant")
 * @returns {string} The image URL
 */
export function getRankImage(rank: string): string {
  const lowerCaseRank = rank.toLowerCase() as FullRank;

  if (lowerCaseRank in rankImages) {
    return rankImages[lowerCaseRank];
  } else {
    console.warn(`Rank "${rank}" does not exist.`);
    return "https://raw.githubusercontent.com/haxgun/Valory/refs/heads/main/public/img/ranks/3.webp"; // Fallback image
  }
}
