import type { Recipe, RecipeInput } from '../types'

const BASE = '/api/recipes'

async function errorMessage(response: Response): Promise<string> {
  const fallback = `Request failed (${response.status})`
  try {
    const body = (await response.json()) as {
      error?: string
      issues?: Array<{ message: string }>
    }
    if (body.issues && body.issues.length > 0) {
      return body.issues.map((issue) => issue.message).join(', ')
    }
    return body.error ?? fallback
  } catch {
    return fallback
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(await errorMessage(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const recipesApi = {
  list: () => request<Recipe[]>(BASE),
  get: (id: string) => request<Recipe>(`${BASE}/${id}`),
  create: (input: RecipeInput) =>
    request<Recipe>(BASE, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  update: (id: string, input: RecipeInput) =>
    request<Recipe>(`${BASE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  setFavorite: (id: string, favorite: boolean) =>
    request<Recipe>(`${BASE}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ favorite }),
    }),
  remove: (id: string) => request<void>(`${BASE}/${id}`, { method: 'DELETE' }),
}
