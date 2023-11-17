export const LEVELS_DEFAULT_NAMES = {
  1: "Level 1",
  2: "Level 2",
  3: "Level 3",
  4: "Level 4",
  5: "Level 5",
  6: "Level 6",
  7: "Level 7",
  8: "Level 8",
  9: "Level 9",
  10: "Level 10",
};

export const LEVELS_XP = {
  1: 0,
  2: 100,
  3: 500,
  4: 1200,
  5: 2200,
  6: 3500,
  7: 5100,
  8: 7000,
  9: 9200,
  10: 11700,
};

export const getLevelForXp = (xp: number) => {
  let level = 1;
  while (xp >= LEVELS_XP[level] && level < 10) {
    level++;
  }
  return level;
};
