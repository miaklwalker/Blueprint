import {LOCATIONS, options} from "../const.ts";
import {create} from "zustand/index";
import {combine, devtools, persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {BuyMetaData} from "../../App.tsx";

export interface InitialState {
    immolateState: {
        seed: string;
        deck: string;
        cardsPerAnte: number;
        antes: number;
        deckType: string;
        stake: string;
        showmanOwned: boolean;
        gameVersion: string;
        selectedOptions: string[];
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
        deckType: 'Ghost Deck',
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
    setDeckType: (deckType: string) => set((prev: InitialState) => {
        prev.immolateState.deckType = deckType
    }, undefined, 'Global/SetDeckType'),
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

    toggleSettings: () => set((prev: { applicationState: { settingsOpen: boolean; }; }) => {
        prev.applicationState.settingsOpen = !prev.applicationState.settingsOpen
    }, undefined, 'Global/ToggleSettings'),

    toggleOutput: () => set((prev: { applicationState: { asideOpen: boolean; }; }) => {
        prev.applicationState.asideOpen = !prev.applicationState.asideOpen
    }, undefined, 'Global/ToggleOutput'),
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
})

export const useCardStore = create(devtools(persist(immer(combine(initialState,
                (set, get) => ({
                    ...globalSettingsSetters(set),
                    ...applicationSetters(set),
                    addBuy: (buy: BuyMetaData) => set(prev => {
                        let key = `${buy.ante}-${buy.location}-${buy.index}`;
                        prev.shoppingState.buys[key] = buy;
                    }, undefined, 'Global/AddBuy'),
                    removeBuy: (buy: BuyMetaData) => set(prev => {
                        let key = `${buy.ante}-${buy.location}-${buy.index}`;
                        delete prev.shoppingState.buys[key];
                    }, undefined, 'Global/RemoveBuy'),
                    isOwned: (key: string) => {
                        return key in get().shoppingState.buys;
                    },


                    reset: () => set(initialState, undefined, 'Global/Reset'),
                })
            )),
            {
                name: 'blueprint-store',
                version: 1,
            }
        )
    )
)
