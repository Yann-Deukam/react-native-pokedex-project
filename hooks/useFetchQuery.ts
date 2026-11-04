import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type Pokemon = {
    name: string;
    url: string;
};

type API = {
    "/pokemon?limit=21": {
        count: number;
        next: string | null;
        results: Pokemon[];
    };

    "/pokemon?limit=2000&offset=0": {
        count: number;
        next: string | null;
        results: Pokemon[];
    };
};

const endpoint = "https://pokeapi.co/api/v2";

async function fetchAPI<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

// Fetch a single page of data
export function useFetchQuery<T extends keyof API>(path: T) {
    return useQuery({
        queryKey: [path],
        queryFn: async () => {
            return fetchAPI<API[T]>(endpoint + path);
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}

// Fetch paginated data
export function useInfiniteFetchQuery<T extends keyof API>(path: T) {
    return useInfiniteQuery({
        queryKey: [path],
        initialPageParam: endpoint + path,

        queryFn: async ({ pageParam }) => {
            return fetchAPI<API[T]>(pageParam);
        },

        getNextPageParam: (lastPage) => {
            return lastPage.next ?? undefined;
        },

        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}