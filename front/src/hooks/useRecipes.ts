import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recipesApi } from '../api/recipes'
import type { RecipeInput } from '../types'

const recipesKey = ['recipes'] as const

export function useRecipes() {
  return useQuery({ queryKey: recipesKey, queryFn: recipesApi.list })
}

export function useRecipeMutations() {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: recipesKey })

  const create = useMutation({
    mutationFn: (input: RecipeInput) => recipesApi.create(input),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: RecipeInput }) =>
      recipesApi.update(id, input),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string) => recipesApi.remove(id),
    onSuccess: invalidate,
  })

  const setFavorite = useMutation({
    mutationFn: ({ id, favorite }: { id: string; favorite: boolean }) =>
      recipesApi.setFavorite(id, favorite),
    onSuccess: invalidate,
  })

  return { create, update, remove, setFavorite }
}
