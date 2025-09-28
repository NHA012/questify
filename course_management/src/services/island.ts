import { Island } from '../models/island';
import { PrerequisiteIsland } from '../models/prerequisiteIsland';
import { Transaction } from 'sequelize';

export async function detectCycle(
  startIslandId: string,
  transaction?: Transaction,
): Promise<boolean> {
  const visited: Set<string> = new Set();
  const path: Set<string> = new Set();

  async function checkCycle(islandId: string): Promise<boolean> {
    if (path.has(islandId)) {
      return true;
    }

    if (visited.has(islandId)) {
      return false;
    }

    visited.add(islandId);
    path.add(islandId);

    const dependencies = await PrerequisiteIsland.findAll({
      where: { prerequisiteIslandId: islandId },
      transaction,
    });

    for (const dep of dependencies) {
      if (await checkCycle(dep.islandId)) {
        return true;
      }
    }

    path.delete(islandId);
    return false;
  }

  return checkCycle(startIslandId);
}

export const recalculatePositions = async (
  courseId: string,
  transaction?: Transaction,
  includeDeleted: boolean = false,
): Promise<void> => {
  const whereClause: { courseId: string; isDeleted?: boolean } = { courseId };

  if (!includeDeleted) {
    whereClause.isDeleted = false;
  }

  const islands = await Island.findAll({
    where: whereClause,
    transaction,
  });

  const islandIds = islands.map((island) => island.id);

  const allPrereqs = await PrerequisiteIsland.findAll({
    where: {
      islandId: islandIds,
    },
    transaction,
  });

  const graph: Record<string, string[]> = {};
  islands.forEach((island) => {
    graph[island.id] = [];
  });

  allPrereqs.forEach((prereq) => {
    if (graph[prereq.prerequisiteIslandId]) {
      graph[prereq.prerequisiteIslandId].push(prereq.islandId);
    }
  });

  const inDegree: Record<string, number> = {};
  islands.forEach((island) => {
    inDegree[island.id] = 0;
  });

  for (const prereqIds of Object.values(graph)) {
    for (const prereqId of prereqIds) {
      inDegree[prereqId] = (inDegree[prereqId] || 0) + 1;
    }
  }

  const queue: string[] = [];
  const levels: Record<string, number> = {};

  for (const islandId of Object.keys(inDegree)) {
    if (inDegree[islandId] === 0) {
      queue.push(islandId);
      levels[islandId] = 0;
    }
  }

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    for (const dependentId of graph[currentId]) {
      inDegree[dependentId]--;

      if (inDegree[dependentId] === 0) {
        queue.push(dependentId);
        levels[dependentId] = levels[currentId] + 1;
      }
    }
  }

  const updatePromises = islands.map((island) => {
    const newPosition = levels[island.id];
    if (newPosition !== undefined && newPosition !== island.position) {
      island.position = newPosition;
      return island.save({ transaction });
    }
    return Promise.resolve();
  });

  await Promise.all(updatePromises);
};
