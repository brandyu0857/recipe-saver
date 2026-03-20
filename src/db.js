import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

function toRecipe(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ingredients: row.ingredients ?? [],
    photo: row.photo,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function toMenu(row) {
  return {
    id: row.id,
    name: row.name,
    recipeIds: row.recipe_ids ?? [],
    familyId: row.family_id,
    familyName: row.family_name,
    contributions: row.contributions,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function toFamily(row) {
  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at),
  }
}

function toMember(row) {
  return {
    id: row.id,
    familyId: row.family_id,
    name: row.name,
    color: row.color,
    createdAt: new Date(row.created_at),
  }
}

export const db = {
  recipes: {
    async getAll() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data.map(toRecipe)
    },
    async add(recipe) {
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          name: recipe.name,
          description: recipe.description ?? null,
          ingredients: recipe.ingredients ?? [],
          photo: recipe.photo ?? null,
          created_at: recipe.createdAt,
          updated_at: recipe.updatedAt,
        })
        .select()
        .single()
      if (error) throw error
      return toRecipe(data)
    },
    async update(id, recipe) {
      const patch = {}
      if (recipe.name !== undefined) patch.name = recipe.name
      if (recipe.description !== undefined) patch.description = recipe.description
      if (recipe.ingredients !== undefined) patch.ingredients = recipe.ingredients
      if (recipe.photo !== undefined) patch.photo = recipe.photo
      if (recipe.updatedAt !== undefined) patch.updated_at = recipe.updatedAt
      const { error } = await supabase.from('recipes').update(patch).eq('id', id)
      if (error) throw error
    },
    async delete(id) {
      const { error } = await supabase.from('recipes').delete().eq('id', id)
      if (error) throw error
    },
  },

  menus: {
    async getAll() {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data.map(toMenu)
    },
    async add(menu) {
      const { data, error } = await supabase
        .from('menus')
        .insert({
          name: menu.name,
          recipe_ids: menu.recipeIds ?? [],
          family_id: menu.familyId ?? null,
          family_name: menu.familyName ?? null,
          contributions: menu.contributions ?? null,
          created_at: menu.createdAt,
          updated_at: menu.updatedAt,
        })
        .select()
        .single()
      if (error) throw error
      return toMenu(data)
    },
    async update(id, menu) {
      const patch = {}
      if (menu.name !== undefined) patch.name = menu.name
      if (menu.updatedAt !== undefined) patch.updated_at = menu.updatedAt
      const { error } = await supabase.from('menus').update(patch).eq('id', id)
      if (error) throw error
    },
    async delete(id) {
      const { error } = await supabase.from('menus').delete().eq('id', id)
      if (error) throw error
    },
  },

  families: {
    async getAll() {
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return data.map(toFamily)
    },
    async add(family) {
      const { data, error } = await supabase
        .from('families')
        .insert({ name: family.name, created_at: family.createdAt })
        .select()
        .single()
      if (error) throw error
      return toFamily(data)
    },
    async delete(id) {
      const { error } = await supabase.from('families').delete().eq('id', id)
      if (error) throw error
    },
  },

  members: {
    async getAll() {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return data.map(toMember)
    },
    async add(member) {
      const { data, error } = await supabase
        .from('members')
        .insert({
          family_id: member.familyId,
          name: member.name,
          color: member.color,
          created_at: member.createdAt,
        })
        .select()
        .single()
      if (error) throw error
      return toMember(data)
    },
    async deleteByFamilyId(familyId) {
      const { error } = await supabase.from('members').delete().eq('family_id', familyId)
      if (error) throw error
    },
    async delete(id) {
      const { error } = await supabase.from('members').delete().eq('id', id)
      if (error) throw error
    },
  },
}
