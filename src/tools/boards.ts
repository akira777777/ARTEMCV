export interface Board {
  id: string;
  name: string;
  frameworks?: string[];
}

/**
 * Traverses boards and executes a callback for each.
 * The implementation should handle async fetching/paging if necessary.
 */
export async function forEachBoard(callback: (board: Board) => void | Promise<void>): Promise<void> {
  void callback;
  // Real implementation would go here.
}

/**
 * Returns a list of all boards.
 */
export async function listBoards(): Promise<Board[]> {
  const boards: Board[] = [];
  await forEachBoard(board => {
    boards.push(board);
  });
  return boards;
}

/**
 * Optimized: Single pass through boards to collect frameworks.
 * Avoids the double iteration and reduces memory overhead by processing boards one by one.
 */
export async function listFrameworks(): Promise<string[]> {
  const frameworkSet = new Set<string>();

  await forEachBoard(board => {
    if (board.frameworks) {
      for (const framework of board.frameworks) {
        frameworkSet.add(framework);
      }
    }
  });

  return Array.from(frameworkSet);
}
