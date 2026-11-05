import { QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query'
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

type PokemonDescription = {
    flavor_text_entries: {
        flavor_text: string
        language: {
            name: string
        }
    }[]
}

type API = {
    '/pokemon?limit=21': PaginatedResponse

    '/pokemon?limit=2000&offset=0': PaginatedResponse

    '/pokemon/[id]': PokemonDetails

    '/pokemon-species/[id]': PokemonDescription
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

// Builds the full URL, e.g. '/pokemon/[id]' + { id: 25 } -> '.../pokemon/25'
function buildUrl(path: string, params?: Record<string, string | number>) {
    return (
        endpoint +
        Object.entries(params ?? {}).reduce(
            (url, [key, value]) =>
                url.replaceAll(`[${key}]`, encodeURIComponent(String(value))),
            path
        )
    )
}

// Pokemon data never changes, so never treat it as stale. This also stops
// a background refetch every time a page mounts.
const STATIC_DATA_OPTIONS = { staleTime: Infinity }

// Fetch a single page or individual Pokémon
export function useFetchQuery<T extends keyof API>(
    path: T,
    params?: Record<string, string | number>
) {
    const url = buildUrl(path as string, params)

    return useQuery({
        queryKey: [url],
        queryFn: () => fetchAPI<API[T]>(url),
        ...STATIC_DATA_OPTIONS,
    })
}

// Load data into the cache ahead of time, using the same key as useFetchQuery
// so the screen renders instantly when it mounts.
export function prefetchFetchQuery<T extends keyof API>(
    queryClient: QueryClient,
    path: T,
    params?: Record<string, string | number>
) {
    const url = buildUrl(path as string, params)

    return queryClient.prefetchQuery({
        queryKey: [url],
        queryFn: () => fetchAPI<API[T]>(url),
        ...STATIC_DATA_OPTIONS,
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

        getNextPageParam: (lastPage) => {
            return lastPage.next ?? undefined
        },
    })
}