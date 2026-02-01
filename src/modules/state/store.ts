import { create } from "zustand/index";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { LOCATIONS, LOCATION_TYPES, options } from "../const.ts";
import type { StateStorage } from "zustand/middleware";
import type { BuyMetaData } from "../classes/BuyMetaData.ts";
import type { SeedResultsContainer } from "../ImmolateWrapper/CardEngines/Cards.ts";

export type Blinds = 'smallBlind' | 'bigBlind' | 'bossBlind';
export interface InitialState {
    immolateState: {
        seed: string;
        deck: string;
        cardsPerAnte: number;
        antes: number;
        stake: string;
        showmanOwned: boolean;
        gameVersion: string;
        selectedOptions: Array<any>;
    };
    applicationState: {
        viewMode: string
        start: boolean;
        settingsOpen: boolean;
        asideOpen: boolean;
        selectOptionsModalOpen: boolean;
        featuresModalOpen: boolean;
        rerollCalculatorModalOpen: boolean;
        rerollCalculatorMetadata: any | null;
        snapshotModalOpen: boolean;
        showCardSpoilers: boolean;
        useCardPeek: boolean;
        autoBuyPacks: boolean;
        autoBuyVouchers: boolean;
        miscSource: string;
        asideTab: string;
        selectedAnte: number;
        selectedBlind: Blinds;
        hasSettingsChanged: boolean;
        analyzedResults: SeedResultsContainer | null | undefined;
        maxMiscCardSource: number;
        rerollStartIndex: number;
    };
    searchState: {
        searchTerm: string;
        searchResults: Array<any>;
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
    eventState: {
        events: Array<any>
    },
    lockState: {
        lockedCards: Record<string, any>  // Maps card IDs to locked cards
    }
}
interface StoreActions {
    setViewMode: (viewMode: string) => void;
    setSeed: (seed: string) => void;
    setDeck: (deck: string) => void;
    setCardsPerAnte: (cardsPerAnte: number) => void;
    setAntes: (antes: number) => void;
    setStake: (stake: string) => void;
    setGameVersion: (gameVersion: string) => void;
    setSelectedOptions: (selectedOptions: Array<string>) => void;
    setUseCardPeek: (useCardPeek: boolean) => void;
    setStart: (start: boolean) => void;
    setShowCardSpoilers: (showCardSpoilers: boolean) => void;
    openSelectOptionModal: () => void;
    closeSelectOptionModal: () => void;
    openFeaturesModal: () => void;
    closeFeaturesModal: () => void;
    openRerollCalculatorModal: (metadata: any) => void;
    closeRerollCalculatorModal: () => void;
    openSnapshotModal: () => void;
    closeSnapshotModal: () => void;
    setSelectedAnte: (selectedAnte: number) => void;
    setSelectedBlind: (selectedBlind: Blinds) => void;
    toggleSettings: () => void;
    toggleOutput: () => void;
    setMiscSource: (source: string) => void;
    setAsideTab: (tab: string) => void;
    setSearchString: (searchString: string) => void;
    setMiscMaxSource: (maxSource: number) => void;
    setRerollStartIndex: (index: number) => void;
    setSelectedSearchResult: (result: BuyMetaData) => void;
    navigateToMiscSource: (source: string) => void;
    addBuy: (buy: BuyMetaData) => void;
    removeBuy: (buy: BuyMetaData) => void;
    isOwned: (key: string) => boolean;
    addSell: (sell: BuyMetaData) => void;
    undoSell: (sell: BuyMetaData) => void;
    setBuys: (buys: { [key: string]: BuyMetaData }) => void;
    setSells: (sells: { [key: string]: BuyMetaData }) => void;
    trackEvent: (event: any) => void;
    clearEvents: () => void;
    removeEvent: (index: number) => void;
    lockCard: (cardId: string, card: any) => void;
    unlockCard: (cardId: string) => void;
    clearLockedCards: () => void;
    reset: () => void;
}
export interface CardStore extends InitialState, StoreActions { }
const initialState: InitialState = {
    immolateState: {
        seed: '',
        deck: 'Ghost Deck',
        cardsPerAnte: 50,
        antes: 8,
        stake: 'White Stake',
        showmanOwned: false,
        gameVersion: '10106',
        selectedOptions: options,
    },
    applicationState: {
        viewMode: 'blueprint',
        start: false,
        settingsOpen: true,
        asideOpen: false,
        selectOptionsModalOpen: false,
        featuresModalOpen: false,
        rerollCalculatorModalOpen: false,
        rerollCalculatorMetadata: null,
        snapshotModalOpen: false,
        showCardSpoilers: false,
        useCardPeek: false,
        autoBuyPacks: true,
        autoBuyVouchers: true,
        miscSource: 'riffRaff',
        asideTab: 'sources',
        selectedAnte: 1,
        selectedBlind: 'bigBlind',
        hasSettingsChanged: false,
        analyzedResults: null,
        maxMiscCardSource: 15,
        rerollStartIndex: 0
    },
    searchState: {
        searchTerm: '',
        searchResults: [],
        selectedSearchResult: null
    },
    shoppingState: {
        buys: {},
        sells: {},
    },
    eventState: {
        events: []
    },
    lockState: {
        lockedCards: {}
    },

}


// @ts-ignore
const blueprintStorage: StateStorage = {
    // @ts-ignore
    getItem: (): string => {
        const immolateState = getImmolateStateFromUrl();


        const results = {
            state: {
                immolateState: {
                    ...initialState.immolateState,
                    ...immolateState
                },
                applicationState: {
                    ...initialState.applicationState,
                    start: !!immolateState.seed
                },
                shoppingState: {
                    ...initialState.shoppingState,
                    // buys: getBuysFromHash(),
                },
            }
        }
        return JSON.stringify(results)
    },
    setItem: (_: string, newValue: string): void => {
        const parsedValue = JSON.parse(newValue);
        const params = new URLSearchParams(window.location.search);
        const ignoreKeys = ['selectedOptions', 'cardsPerAnte', 'showmanOwned', 'gameVersion']; // Keys to ignore when updating URL
        // Update URL with immolateState values
        Object.entries(parsedValue.state.immolateState).forEach(([key, value]) => {
            if (!ignoreKeys.includes(key)) { // Don't include selectedOptions in URL
                params.set(key, String(value));
            }
        });

        // Update URL without reloading the page
        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState({}, '', newUrl);
        // updateBuysInHash(parsedValue.state.shoppingState.buys);
    },
};

// Helper functions to manage immolateState in URL
function getImmolateStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const antesParam = params.get('antes');
    const parsedAntes = antesParam !== null && antesParam !== '' && !Number.isNaN(Number(antesParam)) ? Number(antesParam) : undefined;
    return {
        seed: params.get('seed') || initialState.immolateState.seed,
        deck: params.get('deck') || initialState.immolateState.deck,
        cardsPerAnte: parseInt(params.get('cardsPerAnte') || initialState.immolateState.cardsPerAnte.toString()),
        antes: parsedAntes !== undefined ? parsedAntes : initialState.immolateState.antes,
        stake: params.get('stake') || initialState.immolateState.stake,
        gameVersion: params.get('gameVersion') || initialState.immolateState.gameVersion,
    };
}


export const useCardStore = create<CardStore,[
    ["zustand/devtools", never], ["zustand/persist", unknown], ["zustand/immer", never]
]>(
    devtools(
        persist(
            immer(
                combine(initialState,
                    (set, get) => ({
                        setViewMode: (viewMode) => set((prev) => {
                            prev.applicationState.viewMode = viewMode;
                        }, undefined, 'Global/SetViewMode'),
                        setSeed: (seed) => set((prev) => {
                            prev.immolateState.seed = seed.toUpperCase();
                            prev.shoppingState = initialState.shoppingState
                            prev.searchState = initialState.searchState;
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetSeed'),
                        setDeck: (deck: string) => set((prev) => {
                            prev.immolateState.deck = deck
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetDeck'),
                        setUseCardPeek: (useCardPeek) => set((prev) => {
                            prev.applicationState.useCardPeek = useCardPeek
                        }, undefined, 'Global/SetCardPeek'),
                        setCardsPerAnte: (cardsPerAnte) => set((prev) => {
                            prev.immolateState.cardsPerAnte = cardsPerAnte
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetCardsPerAnte'),
                        setAntes: (antes) => set((prev) => {
                            prev.immolateState.antes = antes
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetAntes'),
                        setStake: (stake) => set((prev) => {
                            prev.immolateState.stake = stake
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetStake'),
                        setGameVersion: (gameVersion) => set((prev) => {
                            prev.immolateState.gameVersion = gameVersion
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetGameVersion'),
                        setSelectedOptions: (selectedOptions) => set((prev) => {
                            prev.immolateState.selectedOptions = selectedOptions
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetSelectedOptions'),

                        setStart: (start) => set((prev) => {
                            prev.applicationState.start = start
                            prev.applicationState.settingsOpen = false
                        }, undefined, 'Global/SetStart'),

                        setShowCardSpoilers: (showCardSpoilers) => set((prev) => {
                            prev.applicationState.showCardSpoilers = showCardSpoilers
                        }, undefined, 'Global/SetShowCardSpoilers'),
                        openSelectOptionModal: () => set((prev) => {
                            prev.applicationState.selectOptionsModalOpen = true
                        }, undefined, 'Global/OpenSelectOptionModal'),
                        closeSelectOptionModal: () => set((prev) => {
                            prev.applicationState.selectOptionsModalOpen = false
                        }, undefined, 'Global/CloseSelectOptionModal'),
                        openFeaturesModal: () => set((prev) => {
                            prev.applicationState.featuresModalOpen = true
                        }, undefined, 'Global/OpenFeaturesModal'),
                        closeFeaturesModal: () => set((prev) => {
                            prev.applicationState.featuresModalOpen = false
                        }, undefined, 'Global/CloseFeaturesModal'),
                        openRerollCalculatorModal: (metadata) => set((prev) => {
                            prev.applicationState.rerollCalculatorModalOpen = true
                            prev.applicationState.rerollCalculatorMetadata = metadata
                        }, undefined, 'Global/OpenRerollCalculatorModal'),
                        closeRerollCalculatorModal: () => set((prev) => {
                            prev.applicationState.rerollCalculatorModalOpen = false
                            prev.applicationState.rerollCalculatorMetadata = null
                        }, undefined, 'Global/CloseRerollCalculatorModal'),
                        openSnapshotModal: () => set((prev) => {
                            prev.applicationState.snapshotModalOpen = true
                        }, undefined, 'Global/OpenSnapshotModal'),
                        closeSnapshotModal: () => set((prev) => {
                            prev.applicationState.snapshotModalOpen = false
                        }, undefined, 'Global/CloseSnapshotModal'),
                        setSelectedAnte: (selectedAnte) => set((prev) => {
                            prev.applicationState.selectedAnte = selectedAnte
                            prev.applicationState.selectedBlind = prev.applicationState.selectedAnte === 1 ? 'bigBlind' : 'smallBlind'
                            prev.searchState.selectedSearchResult = null;
                        }, undefined, 'Global/SetSelectedAnte'),
                        setSelectedBlind: (selectedBlind) => set((prev) => {
                            prev.applicationState.selectedBlind = selectedBlind
                        }, undefined, 'Global/SetSelectedBlind'),
                        toggleSettings: () => set((prev) => {
                            prev.applicationState.settingsOpen = !prev.applicationState.settingsOpen;
                        }, undefined, 'Global/ToggleSettings'),
                        toggleOutput: () => set((prev) => {
                            prev.applicationState.asideOpen = !prev.applicationState.asideOpen;
                        }, undefined, 'Global/ToggleOutput'),
                        setMiscSource: (source) => set((prev) => {
                            prev.applicationState.miscSource = source

                        }, undefined, "Global/SetMiscSource"),
                        setAsideTab: (tab) => set((prev) => {
                            prev.applicationState.asideTab = tab
                        }, undefined, "Global/SetAsideTab"),
                        setSearchString: (searchString) => set((prev) => {
                            prev.searchState.searchTerm = searchString
                        }, undefined, 'Global/Search/SetSearch'),
                        setMiscMaxSource: (maxSource) => set((prev) => {
                            prev.applicationState.maxMiscCardSource = maxSource
                        }, undefined, 'Global/SetMiscMaxSource'),
                        setRerollStartIndex: (index) => set((prev) => {
                            prev.applicationState.rerollStartIndex = index
                        }, undefined, 'Global/SetRerollStartIndex'),
                        setSelectedSearchResult: (result) => set((prev) => {
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
                        navigateToMiscSource: (source) => set((prev) => {
                            prev.applicationState.asideOpen = true
                            prev.applicationState.settingsOpen = false
                            prev.applicationState.asideTab = 'sources'
                            prev.applicationState.miscSource = source

                        }, undefined, 'Global/NavigateToMiscSource'),
                        addBuy: (buy) => set((prev) => {
                            const key = `${buy.ante}-${buy.location}-${buy.index}${buy.locationType === LOCATION_TYPES.PACK ? `-${buy.blind}` : ''}`;
                            prev.shoppingState.buys[key] = buy;
                        }, undefined, 'Global/AddBuy'),
                        removeBuy: (buy) => set((prev) => {
                            const key = `${buy.ante}-${buy.location}-${buy.index}${buy.locationType === LOCATION_TYPES.PACK ? `-${buy.blind}` : ''}`;
                            delete prev.shoppingState.buys[key];
                        }, undefined, 'Global/RemoveBuy'),
                        isOwned: (key: string) => {
                            return key in get().shoppingState.buys;
                        },
                        addSell: (sell) => set((prev) => {
                            const key = `${sell.ante}-${sell.blind}-${sell.name}`;
                            prev.shoppingState.sells[key] = sell;
                        }, undefined, 'Global/AddSell'),
                        undoSell: (sell) => set((prev) => {
                            const key = `${sell.ante}-${sell.blind}-${sell.name}`;
                            delete prev.shoppingState.sells[key];
                        }, undefined, 'Global/UndoSell'),
                        setBuys: (buys) => set((prev) => {
                            prev.shoppingState.buys = buys;
                        }, undefined, 'Global/SetBuys'),

                        setSells: (sells) => set((prev) => {
                            prev.shoppingState.sells = sells;
                        }, undefined, 'Global/SetSells'),
                        trackEvent: (event) => set((prev) => {
                            prev.eventState.events.push(event)
                        }, undefined, 'Global/TrackEvent'),
                        clearEvents: () => set((prev) => {
                            prev.eventState.events = []
                        }, undefined, 'Global/ClearEvents'),
                        removeEvent: (index) => set((prev) => {
                            prev.eventState.events.splice(index, 1)
                        }, undefined, 'Global/RemoveEvent'),
                        lockCard: (cardId: string, card: any) => set((prev) => {
                            prev.lockState.lockedCards[cardId] = card;
                            prev.applicationState.hasSettingsChanged = true;
                            return prev;
                        }, undefined, 'Cards/LockCard'),


                        unlockCard: (cardId: string) => set((prev) => {
                            delete prev.lockState.lockedCards[cardId];
                            prev.applicationState.hasSettingsChanged = true;
                            return prev;
                        }, undefined, 'Cards/UnlockCard'),

                        clearLockedCards: () => set((prev) => {
                            prev.lockState.lockedCards = {};
                            prev.applicationState.hasSettingsChanged = true;
                            return prev;
                        }, undefined, 'Cards/ClearLockedCards'),
                        reset: () => set(initialState, undefined, 'Global/Reset'),
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
