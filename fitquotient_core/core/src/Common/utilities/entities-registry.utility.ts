/**
 * Global registry for collecting entities from various modules
 * Modules will register their entities when imported
 */
type EntityType = (new () => unknown) | string;

class EntitiesRegistry {
  private entities: EntityType[] = [];

  /**
   * Register entities from a module
   * Use in module.ts before CommonModule is imported
   */
  register(entityList: EntityType[]): void {
    this.entities.push(...entityList);
  }

  /**
   * Get all registered entities
   */
  getAll(): EntityType[] {
    return this.entities;
  }
}

export const entitiesRegistry = new EntitiesRegistry();
