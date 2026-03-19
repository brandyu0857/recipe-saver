import Dexie from 'dexie'

export const db = new Dexie('RecipeBook')

db.version(1).stores({
  recipes: '++id, name, createdAt',
})
