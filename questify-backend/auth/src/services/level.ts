export class LevelExperience {
  public static readonly MAX_LEVEL = 100;

  private static readonly BASE_EXP = 200;

  private static readonly GROWTH_FACTOR = 1.1;

  public static getExpForLevel(level: number): number {
    if (level <= 0) return 0;
    if (level > this.MAX_LEVEL) level = this.MAX_LEVEL;

    const totalExp = Math.floor(
      (this.BASE_EXP * (Math.pow(this.GROWTH_FACTOR, level - 1) - 1)) / (this.GROWTH_FACTOR - 1),
    );

    return totalExp;
  }

  public static getLevelTable(
    startLevel: number = 1,
    endLevel: number = this.MAX_LEVEL,
  ): Array<{ level: number; expRequired: number; expForThisLevel: number }> {
    const table = [];

    for (let level = startLevel; level <= endLevel && level <= this.MAX_LEVEL; level++) {
      const totalExp = this.getExpForLevel(level);
      const prevLevelExp = this.getExpForLevel(level - 1);
      const expForThisLevel = totalExp - prevLevelExp;

      table.push({
        level,
        expRequired: totalExp,
        expForThisLevel,
      });
    }

    return table;
  }
}

export class LevelService {
  private static instance: LevelService;

  public static getInstance(): LevelService {
    if (!LevelService.instance) {
      LevelService.instance = new LevelService();
    }
    return LevelService.instance;
  }

  public getLevelInfo(exp: number): {
    level: number;
    currentExp: number;
    expToNextLevel: number;
  } {
    let level = 1;
    let expRequired = LevelExperience.getExpForLevel(level);

    while (exp >= expRequired && level < LevelExperience.MAX_LEVEL) {
      level++;
      expRequired = LevelExperience.getExpForLevel(level);
    }

    if (exp < expRequired) {
      level--;
    }

    const currentLevelExp = LevelExperience.getExpForLevel(level);
    const nextLevelExp = LevelExperience.getExpForLevel(level + 1);
    const expToNextLevel = nextLevelExp - currentLevelExp;

    const currentExp = exp - currentLevelExp;

    return {
      level,
      currentExp,
      expToNextLevel,
    };
  }
}
