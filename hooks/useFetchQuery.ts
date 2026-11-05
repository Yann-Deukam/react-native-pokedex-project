
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Colors } from '../constants/color'

type Pokemon = {
    name: string
    url: string
}

type PokemonDetails = {
    id: number
    name: string
    weight: number
    height: number

    moves: {
        move: {
            name: string
        }
    }[]

    stats: {
        base_stat: number
        stat: {
            name: string
        }
    }[]

    cries: {
        latest: string
    }

    types: {
        type: {
            name: keyof (typeof Colors)["type"]
        }
    }[]
}

type PaginatedResponse = {
    count: number
    next: string | null
    results: Pokemon[]
}

type API = {
    '/pokemon?limit=21': PaginatedResponse

    '/pokemon?limit=2000&offset=0': PaginatedResponse

    '/pokemon/[id]': PokemonDetails
}

type PaginatedPath =
    | '/pokemon?limit=21'
    | '/pokemon?limit=2000&offset=0'

const endpoint = 'https://pokeapi.co/api/v2'

async function fetchAPI<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
    }

    return response.json() as Promise<T>
}

// Fetch a single page or individual Pokémon
export function useFetchQuery<T extends keyof API>(
    path: T,
    params?: Record<string, string | number>
) {
    const localUrl = endpoint + Object.entries(params ?? {}).reduce(
        (url, [key, value]) =>
            url.replaceAll(`[${key}]`, encodeURIComponent(String(value))),
        path as string
    )

    return useQuery({
        queryKey: [localUrl],
        queryFn: () => fetchAPI<API[T]>(localUrl),
        staleTime: 1000 * 60 * 60 * 24,
    })
}

// Fetch paginated data
export function useInfiniteFetchQuery<T extends PaginatedPath>(path: T) {
    return useInfiniteQuery({
        queryKey: [path],

        initialPageParam: endpoint + path,

        queryFn: async ({ pageParam }) => {
            return fetchAPI<API[T]>(pageParam)
        },

        getNextPageParam: lastPage => {
            return lastPage.next ?? undefined
        },

        staleTime: 1000 * 60 * 60 * 24,
    })
}
