export const LEVELS_DEFAULT_NAMES = {
  1: 'Level 1',
  2: 'Level 2',
  3: 'Level 3',
  4: 'Level 4',
  5: 'Level 5',
  6: 'Level 6',
  7: 'Level 7',
  8: 'Level 8',
  9: 'Level 9',
  10: 'Level 10',
};

export const LEVELS_XP = {
  1: 100,
  2: 500,
  3: 1200,
  4: 2200,
  5: 3500,
  6: 5100,
  7: 7000,
  8: 9200,
  9: 11700,
  10: 11701,
};

export const getLevelForXp = (xp: number) => {
    let level = 1;
    while (xp >= LEVELS_XP[level] && level < 10) {
        level++;
    }
    return level;
}
