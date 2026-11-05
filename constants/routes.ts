// Routes that exist in the app. Add a route here once its screen is built.
export type AppRoute = '/pokedex'

export type NavItem = {
    label: string
    color: string
    route?: AppRoute
}

// Home screen navigation cards.
// Items without a route are shown but not tappable yet.
export const NAV_ITEMS: NavItem[] = [
    { label: 'Pokedex', color: '#5CD3B5', route: '/pokedex' },
    { label: 'Moves', color: '#F47A6B' },
    { label: 'Abilities', color: '#4FA9F8' },
    { label: 'Items', color: '#FFCB47' },
    { label: 'Locations', color: '#7E5CA8' },
    { label: 'Type Charts', color: '#B96B5F' },
]