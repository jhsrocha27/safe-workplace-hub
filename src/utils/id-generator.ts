/**
 * Gera um ID único para uma nova entidade baseado na coleção existente.
 * @param items Array de itens que possuem um ID
 * @returns Novo ID único
 */
export function generateId<T extends { id?: number }>(items: T[]): number {
  if (items.length === 0) return 1;
  
  const maxId = items.reduce((max, item) => {
    const itemId = item.id || 0;
    return itemId > max ? itemId : max;
  }, 0);
  
  return maxId + 1;
}