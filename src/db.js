import Dexie from 'dexie'

export const db = new Dexie('RecipeBook')

db.version(1).stores({
  recipes: '++id, name, createdAt',
})

db.version(2).stores({
  recipes: '++id, name, createdAt',
  menus: '++id, name, createdAt',
})

db.version(3).stores({
  recipes: '++id, name, createdAt',
  menus: '++id, name, createdAt',
  families: '++id, name, createdAt',
  members: '++id, familyId, name, createdAt',
})
