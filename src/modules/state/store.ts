import {LOCATIONS, options} from "../const.ts";
import {create} from "zustand/index";
import {combine, createJSONStorage, devtools, persist, StateStorage} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {BuyMetaData} from "../classes/BuyMetaData.ts";


export interface InitialState {
    immolateState: {
        seed: string;
        deck: string;
        cardsPerAnte: number;
        antes: number;
        stake: string;
        showmanOwned: boolean;
        gameVersion: string;
        selectedOptions: boolean[];
    };
    applicationState: {
        start: boolean;
        settingsOpen: boolean;
        asideOpen: boolean;
        selectOptionsModalOpen: boolean;
        showCardSpoilers: boolean;
        miscSource: string;
        asideTab: string;
        selectedAnte: number;
        selectedBlind: string;
    };
    searchState: {
        searchTerm: string;
        searchResults: any[];
        selectedSearchResult: any | null;
    };
    shoppingState: {
        buys: {
            [key: string]: BuyMetaData
        },
        sells: {
            [key: string]: BuyMetaData
        }
    };
}

const initialState: InitialState = {
    immolateState: {
        seed: '15IBIXCA',
        deck: 'Ghost Deck',
        cardsPerAnte: 50,
        antes: 8,
        stake: 'Gold Stake',
        showmanOwned: false,
        gameVersion: '10106',
        selectedOptions: Array(61).fill(true),
    },
    applicationState: {
        start: false,
        settingsOpen: false,
        asideOpen: false,
        selectOptionsModalOpen: false,
        showCardSpoilers: false,
        miscSource: 'riffRaff',
        asideTab: 'sources',
        selectedAnte: 1,
        selectedBlind: 'bigBlind',
    },
    searchState: {
        searchTerm: '',
        searchResults: [],
        selectedSearchResult: null
    },
    shoppingState: {
        buys: {},
        sells: {},
    }
}

const globalSettingsSetters = (set: any) => ({
    setSeed: (seed: string) => set((prev: InitialState) => {
        prev.immolateState.seed = seed
        prev.shoppingState = initialState.shoppingState
        prev.searchState = initialState.searchState
    }, undefined, 'Global/SetSeed'),
    setDeck: (deck: string) => set((prev: InitialState) => {
        prev.immolateState.deck = deck
    }, undefined, 'Global/SetDeck'),
    setCardsPerAnte: (cardsPerAnte: number) => set((prev: InitialState) => {
        prev.immolateState.cardsPerAnte = cardsPerAnte
    }, undefined, 'Global/SetCardsPerAnte'),
    setAntes: (antes: number) => set((prev: InitialState) => {
        prev.immolateState.antes = antes
    }, undefined, 'Global/SetAntes'),
    setStake: (stake: string) => set((prev: InitialState) => {
        prev.immolateState.stake = stake
    }, undefined, 'Global/SetStake'),
    setShowmanOwned: (showmanOwned: boolean) => set((prev: InitialState) => {
        prev.immolateState.showmanOwned = showmanOwned
    }, undefined, 'Global/SetShowmanOwned'),
    setGameVersion: (gameVersion: string) => set((prev: InitialState) => {
        prev.immolateState.gameVersion = gameVersion
    }, undefined, 'Global/SetGameVersion'),
    setSelectedOptions: (selectedOptions: string[]) => set((prev: InitialState) => {
        prev.immolateState.selectedOptions = options.map((option: string) => selectedOptions.includes(option));
    }, undefined, 'Global/SetSelectedOptions'),
});
const applicationSetters = (set: any) => ({
    setStart: (start: boolean) => set((prev: InitialState) => {
        prev.applicationState.start = start
    }, undefined, 'Global/SetStart'),
    setShowCardSpoilers: (showCardSpoilers: boolean) => set((prev: InitialState) => {
        prev.applicationState.showCardSpoilers = showCardSpoilers
    }, undefined, 'Global/SetShowCardSpoilers'),
    openSelectOptionModal: () => set((prev: { applicationState: { selectOptionsModalOpen: boolean; }; }) => {
        prev.applicationState.selectOptionsModalOpen = true
    }, undefined, 'Global/OpenSelectOptionModal'),
    closeSelectOptionModal: () => set((prev: { applicationState: { selectOptionsModalOpen: boolean; }; }) => {
        prev.applicationState.selectOptionsModalOpen = false
    }, undefined, 'Global/CloseSelectOptionModal'),

    setSelectedAnte: (selectedAnte: number) => set((prev: {
        applicationState: { selectedAnte: number; selectedBlind: string; };
    }) => {
        prev.applicationState.selectedAnte = selectedAnte
        prev.applicationState.selectedBlind = prev.applicationState.selectedAnte === 1 ? 'bigBlind' : 'smallBlind'
    }, undefined, 'Global/SetSelectedAnte'),

    setSelectedBlind: (selectedBlind: string) => set((prev: { applicationState: { selectedBlind: string; }; }) => {
        prev.applicationState.selectedBlind = selectedBlind
    }, undefined, 'Global/SetSelectedBlind'),

    toggleSettings: () => set((prev: { applicationState: { settingsOpen: boolean; asideOpen: boolean; }; }) => {
        const isSmallScreen = window.innerWidth < 1660;

        // If screen is small and we're opening settings, close aside
        if (isSmallScreen && !prev.applicationState.settingsOpen && prev.applicationState.asideOpen) {
            prev.applicationState.asideOpen = false;
        }

        prev.applicationState.settingsOpen = !prev.applicationState.settingsOpen;
    }, undefined, 'Global/ToggleSettings'),

    toggleOutput: () => set((prev: { applicationState: { asideOpen: boolean; settingsOpen: boolean; }; }) => {
        const isSmallScreen = window.innerWidth < 1660;

        // If screen is small and we're opening aside, close settings
        if (isSmallScreen && !prev.applicationState.asideOpen && prev.applicationState.settingsOpen) {
            prev.applicationState.settingsOpen = false;
        }

        prev.applicationState.asideOpen = !prev.applicationState.asideOpen;
    }, undefined, 'Global/ToggleOutput'),

    // Also update the direct setters to implement the same logic
    setSettings: (settingsOpen: boolean) => set((prev: {
        applicationState: { settingsOpen: boolean; asideOpen: boolean; };
    }) => {
        const isSmallScreen = window.innerWidth < 1660;

        // If screen is small and we're opening settings, close aside
        if (isSmallScreen && settingsOpen && prev.applicationState.asideOpen) {
            prev.applicationState.asideOpen = false;
        }

        prev.applicationState.settingsOpen = settingsOpen;
    }, undefined, 'Global/SetSettings'),

    setOutput: (asideOpen: boolean) => set((prev: {
        applicationState: { asideOpen: boolean; settingsOpen: boolean; };
    }) => {
        const isSmallScreen = window.innerWidth < 1660;

        // If screen is small and we're opening aside, close settings
        if (isSmallScreen && asideOpen && prev.applicationState.settingsOpen) {
            prev.applicationState.settingsOpen = false;
        }

        prev.applicationState.asideOpen = asideOpen;
    }, undefined, 'Global/SetOutput'),
    setMiscSource: (source: string) => set((prev: { applicationState: { miscSource: string; }; }) => {
        prev.applicationState.miscSource = source

    }, undefined, "Global/SetMiscSource"),
    setAsideTab: (tab: string) => set((prev: { applicationState: { asideTab: string; }; }) => {
        prev.applicationState.asideTab = tab
    }, undefined, "Global/SetAsideTab"),
    setSearchString: (searchString: string) => set((prev: { searchState: { searchTerm: string } }) => {
        prev.searchState.searchTerm = searchString
    }, undefined, 'Global/Search/SetSearch'),
    setSelectedSearchResult: (result: BuyMetaData) => set((prev: {
        applicationState: {
            selectedAnte: number,
            selectedBlind: string,
            asideOpen: boolean,
            settingsOpen: boolean,
            asideTab: string,
            miscSource: string
        },
        searchState: { selectedSearchResult: BuyMetaData | null }
    }) => {
        prev.searchState.selectedSearchResult = result
        prev.applicationState.selectedAnte = Number(result.ante)
        prev.applicationState.selectedBlind = result.blind
        if (result.locationType === LOCATIONS.MISC) {
            prev.applicationState.asideOpen = true
            prev.applicationState.settingsOpen = false
            prev.applicationState.asideTab = 'sources'
            prev.applicationState.miscSource = result.location
        }

    }, undefined, 'Global/Search/SetSelectedSearchResult'),
});
const shopGetters = (set: any, get: any) => ({
    addBuy: (buy: BuyMetaData) => set((prev: { shoppingState: { buys: { [x: string]: BuyMetaData; }; }; }) => {
        let key = `${buy.ante}-${buy.location}-${buy.index}`;
        prev.shoppingState.buys[key] = buy;
    }, undefined, 'Global/AddBuy'),
    removeBuy: (buy: BuyMetaData) => set((prev: { shoppingState: { buys: { [x: string]: any; }; }; }) => {
        let key = `${buy.ante}-${buy.location}-${buy.index}`;
        delete prev.shoppingState.buys[key];
    }, undefined, 'Global/RemoveBuy'),
    isOwned: (key: string) => {
        return key in get().shoppingState.buys;
    },


    reset: () => set(initialState, undefined, 'Global/Reset'),
});

// @ts-ignore
const blueprintStorage: StateStorage = {
    // @ts-ignore
    getItem: (key: string): string => {
        let immolateState = getImmolateStateFromUrl();


        let results = {
            state: {
                immolateState:{
                    ...initialState.immolateState,
                    ...immolateState
                },
                applicationState: {
                    ...initialState.applicationState,
                    start : !!immolateState?.seed
                },
                shoppingState: {
                    ...initialState.shoppingState,
                    buys: getBuysFromHash(),
                    sells: {},
                },
            }
        }
        return JSON.stringify(results)
    },

    setItem: (_: string, newValue: string): void => {
        const parsedValue = JSON.parse(newValue);
        const params = new URLSearchParams(window.location.search);
        const ignoreKeys = ['selectedOptions','cardsPerAnte','showmanOwned','gameVersion']; // Keys to ignore when updating URL
        // Update URL with immolateState values
        Object.entries(parsedValue.state.immolateState).forEach(([key, value]) => {
            if (!ignoreKeys.includes(key)) { // Don't include selectedOptions in URL
                params.set(key, String(value));
            }
        });

        // Update URL without reloading the page
        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
        updateBuysInHash(parsedValue.state.shoppingState.buys);
    },
};

// Helper functions to manage immolateState in URL
function getImmolateStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return {
        seed: params.get('seed') || initialState.immolateState.seed,
        deck: params.get('deck') || initialState.immolateState.deck,
        cardsPerAnte: parseInt(params.get('cardsPerAnte') || initialState.immolateState.cardsPerAnte.toString()),
        antes: parseInt(params.get('antes') || initialState.immolateState.antes.toString()),
        stake: params.get('stake') || initialState.immolateState.stake,
        gameVersion: params.get('gameVersion') || initialState.immolateState.gameVersion,
        start: !!params?.get('seed')

    };
}

// Helper functions to manage buys in hash
function getBuysFromHash() {
    try {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        return hash ? JSON.parse(decodeURIComponent(hash)) : {};
    } catch (e) {
        return {};
    }
}

function updateBuysInHash(buys: any) {
    const hashValue = encodeURIComponent(JSON.stringify(buys));

    // Update hash without affecting the URL query params
    const newUrl = `${window.location.pathname}${window.location.search}#${hashValue}`;
    window.history.replaceState({}, '', newUrl);
}

export const useCardStore = create(
    devtools(
        persist(
            immer(
                combine(initialState,
                    (set, get) => ({
                        ...globalSettingsSetters(set),
                        ...applicationSetters(set),
                        ...shopGetters(set, get),
                    })
                )),
            {
                storage: createJSONStorage(() => blueprintStorage),
                name: 'blueprint-store-v2',
                version: 2,
                partialize: (state) => ({
                    immolateState: state.immolateState,
                    shoppingState: {
                        buys: state.shoppingState.buys,
                        sells: state.shoppingState.sells
                    },
                    applicationState: state.applicationState,
                    searchState: state.searchState
                }),
            }
        )
    )
)
