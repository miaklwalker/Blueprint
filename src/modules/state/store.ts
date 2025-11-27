import { LOCATION_TYPES, LOCATIONS, options } from "../const.ts";
import { create } from "zustand/index";
import { combine, createJSONStorage, devtools, persist, StateStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { BuyMetaData } from "../classes/BuyMetaData.ts";
import { analyzeSeed } from "../ImmolateWrapper";
import { SeedResultsContainer } from "../ImmolateWrapper/CardEngines/Cards.ts";


export interface InitialState {
    immolateState: {
        seed: string;
        deck: string;
        cardsPerAnte: number;
        antes: number;
        stake: string;
        showmanOwned: boolean;
        gameVersion: string;
        selectedOptions: string[];
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
        selectedBlind: string;
        hasSettingsChanged: boolean;
        analyzedResults: SeedResultsContainer | null | undefined;
        maxMiscCardSource: number;
        rerollStartIndex: number;
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
    eventState: {
        events: any[]
    },
    lockState: {
        lockedCards: Record<string, any>  // Maps card IDs to locked cards
    }
}

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
        useCardPeek: true,
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
        let immolateState = getImmolateStateFromUrl();


        let results = {
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
    return {
        seed: params.get('seed') || initialState.immolateState.seed,
        deck: params.get('deck') || initialState.immolateState.deck,
        cardsPerAnte: parseInt(params.get('cardsPerAnte') || initialState.immolateState.cardsPerAnte.toString()),
        antes: parseInt(params.get('antes') || initialState.immolateState.antes.toString()),
        stake: params.get('stake') || initialState.immolateState.stake,
        gameVersion: params.get('gameVersion') || initialState.immolateState.gameVersion,
    };
}


export const useCardStore = create(
    devtools(
        persist(
            immer(
                combine(initialState,
                    (set, get) => ({
                        setViewMode: (viewMode: string) => set((prev: InitialState) => {
                            prev.applicationState.viewMode = viewMode;
                        }, undefined, 'Global/SetViewMode'),
                        setSeed: (seed: string) => set((prev: InitialState) => {
                            prev.immolateState.seed = seed?.toUpperCase();
                            prev.shoppingState = initialState.shoppingState
                            prev.searchState = initialState.searchState;
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetSeed'),
                        setDeck: (deck: string) => set((prev: InitialState) => {
                            prev.immolateState.deck = deck
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetDeck'),
                        setUseCardPeek: (useCardPeek: boolean) => set((prev: InitialState) => {
                            prev.applicationState.useCardPeek = useCardPeek
                        }, undefined, 'Global/SetCardPeek'),
                        setCardsPerAnte: (cardsPerAnte: number) => set((prev: InitialState) => {
                            prev.immolateState.cardsPerAnte = cardsPerAnte
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetCardsPerAnte'),
                        setAntes: (antes: number) => set((prev: InitialState) => {
                            prev.immolateState.antes = antes
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetAntes'),
                        setStake: (stake: string) => set((prev: InitialState) => {
                            prev.immolateState.stake = stake
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetStake'),
                        setGameVersion: (gameVersion: string) => set((prev: InitialState) => {
                            prev.immolateState.gameVersion = gameVersion
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetGameVersion'),
                        setSelectedOptions: (selectedOptions: string[]) => set((prev: InitialState) => {
                            prev.immolateState.selectedOptions = selectedOptions
                            prev.applicationState.hasSettingsChanged = true;
                        }, undefined, 'Global/SetSelectedOptions'),

                        setStart: (start: boolean) => set((prev: InitialState) => {
                            prev.applicationState.start = start
                            prev.applicationState.settingsOpen = false
                        }, undefined, 'Global/SetStart'),

                        setShowCardSpoilers: (showCardSpoilers: boolean) => set((prev: InitialState) => {
                            prev.applicationState.showCardSpoilers = showCardSpoilers
                        }, undefined, 'Global/SetShowCardSpoilers'),
                        openSelectOptionModal: () => set((prev: InitialState) => {
                            prev.applicationState.selectOptionsModalOpen = true
                        }, undefined, 'Global/OpenSelectOptionModal'),
                        closeSelectOptionModal: () => set((prev: InitialState) => {
                            prev.applicationState.selectOptionsModalOpen = false
                        }, undefined, 'Global/CloseSelectOptionModal'),
                        openFeaturesModal: () => set((prev: InitialState) => {
                            prev.applicationState.featuresModalOpen = true
                        }, undefined, 'Global/OpenFeaturesModal'),
                        closeFeaturesModal: () => set((prev: InitialState) => {
                            prev.applicationState.featuresModalOpen = false
                        }, undefined, 'Global/CloseFeaturesModal'),
                        openRerollCalculatorModal: (metadata: any) => set((prev: InitialState) => {
                            prev.applicationState.rerollCalculatorModalOpen = true
                            prev.applicationState.rerollCalculatorMetadata = metadata
                        }, undefined, 'Global/OpenRerollCalculatorModal'),
                        closeRerollCalculatorModal: () => set((prev: InitialState) => {
                            prev.applicationState.rerollCalculatorModalOpen = false
                            prev.applicationState.rerollCalculatorMetadata = null
                        }, undefined, 'Global/CloseRerollCalculatorModal'),
                        openSnapshotModal: () => set((prev: InitialState) => {
                            prev.applicationState.snapshotModalOpen = true
                        }, undefined, 'Global/OpenSnapshotModal'),
                        closeSnapshotModal: () => set((prev: InitialState) => {
                            prev.applicationState.snapshotModalOpen = false
                        }, undefined, 'Global/CloseSnapshotModal'),
                        setSelectedAnte: (selectedAnte: number) => set((prev: InitialState) => {
                            prev.applicationState.selectedAnte = selectedAnte
                            prev.applicationState.selectedBlind = prev.applicationState.selectedAnte === 1 ? 'bigBlind' : 'smallBlind'
                            prev.searchState.selectedSearchResult = null;
                        }, undefined, 'Global/SetSelectedAnte'),
                        setSelectedBlind: (selectedBlind: string) => set((prev: InitialState) => {
                            prev.applicationState.selectedBlind = selectedBlind
                        }, undefined, 'Global/SetSelectedBlind'),
                        toggleSettings: () => set((prev: InitialState) => {
                            prev.applicationState.settingsOpen = !prev.applicationState.settingsOpen;
                        }, undefined, 'Global/ToggleSettings'),
                        toggleOutput: () => set((prev: InitialState) => {
                            prev.applicationState.asideOpen = !prev.applicationState.asideOpen;
                        }, undefined, 'Global/ToggleOutput'),
                        setMiscSource: (source: string) => set((prev: InitialState) => {
                            prev.applicationState.miscSource = source

                        }, undefined, "Global/SetMiscSource"),
                        setAsideTab: (tab: string) => set((prev: InitialState) => {
                            prev.applicationState.asideTab = tab
                        }, undefined, "Global/SetAsideTab"),
                        setSearchString: (searchString: string) => set((prev: InitialState) => {
                            prev.searchState.searchTerm = searchString
                        }, undefined, 'Global/Search/SetSearch'),
                        setMiscMaxSource: (maxSource: number) => set((prev: InitialState) => {
                            prev.applicationState.maxMiscCardSource = maxSource
                        }, undefined, 'Global/SetMiscMaxSource'),
                        setRerollStartIndex: (index: number) => set((prev: InitialState) => {
                            prev.applicationState.rerollStartIndex = index
                        }, undefined, 'Global/SetRerollStartIndex'),
                        setSelectedSearchResult: (result: BuyMetaData) => set((prev: InitialState) => {
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
                        navigateToMiscSource: (source: string) => set((prev: InitialState) => {
                            prev.applicationState.asideOpen = true
                            prev.applicationState.settingsOpen = false
                            prev.applicationState.asideTab = 'sources'
                            prev.applicationState.miscSource = source

                        }, undefined, 'Global/NavigateToMiscSource'),
                        addBuy: (buy: BuyMetaData) => set((prev: InitialState) => {
                            let key = `${buy.ante}-${buy.location}-${buy.index}${buy.locationType === LOCATION_TYPES.PACK ? `-${buy.blind}` : ''}`;
                            prev.shoppingState.buys[key] = buy;
                        }, undefined, 'Global/AddBuy'),
                        removeBuy: (buy: BuyMetaData) => set((prev: InitialState) => {
                            let key = `${buy.ante}-${buy.location}-${buy.index}${buy.locationType === LOCATION_TYPES.PACK ? `-${buy.blind}` : ''}`;
                            delete prev.shoppingState.buys[key];
                        }, undefined, 'Global/RemoveBuy'),
                        isOwned: (key: string) => {
                            return key in get().shoppingState.buys;
                        },
                        addSell: (sell: BuyMetaData) => set((prev: InitialState) => {
                            let key = `${sell.ante}-${sell.blind}-${sell.name}`;
                            prev.shoppingState.sells[key] = sell;
                        }, undefined, 'Global/AddSell'),
                        undoSell: (sell: BuyMetaData) => set((prev: InitialState) => {
                            let key = `${sell.ante}-${sell.blind}-${sell.name}`;
                            delete prev.shoppingState.sells[key];
                        }, undefined, 'Global/UndoSell'),
                        setBuys: (buys: { [key: string]: BuyMetaData }) => set((prev: InitialState) => {
                            prev.shoppingState.buys = buys;
                        }, undefined, 'Global/SetBuys'),

                        setSells: (sells: { [key: string]: BuyMetaData }) => set((prev: InitialState) => {
                            prev.shoppingState.sells = sells;
                        }, undefined, 'Global/SetSells'),
                        trackEvent: (event: any) => set((prev: InitialState) => {
                            prev.eventState.events.push(event)
                        }, undefined, 'Global/TrackEvent'),
                        clearEvents: () => set((prev: InitialState) => {
                            prev.eventState.events = []
                        }, undefined, 'Global/ClearEvents'),
                        removeEvent: (index: number) => set((prev: InitialState) => {
                            prev.eventState.events.splice(index, 1)
                        }, undefined, 'Global/RemoveEvent'),
                        setHasSettingsChanged: (hasSettingsChanged: boolean) => set((prev: InitialState) => {
                            prev.applicationState.hasSettingsChanged = hasSettingsChanged
                        }, undefined, 'Global/SetHasSettingsChanged'),
                        analyzeSeed: () => set((prev: InitialState) => {
                            const analyzeState = get().immolateState;
                            const buys = get().shoppingState.buys;
                            const sells = get().shoppingState.sells;
                            const showCardSpoilers = get().applicationState.showCardSpoilers;
                            const unlocks = get().immolateState.selectedOptions;
                            const events = get().eventState.events;
                            const lockedCards = get().lockState.lockedCards;
                            const maxMiscCardSource = get().applicationState.maxMiscCardSource;
                            const options = {
                                maxMiscCardSource,
                                showCardSpoilers,
                                unlocks,
                                events,
                                updates: [],
                                buys,
                                sells,
                                lockedCards
                            }
                            prev.applicationState.analyzedResults = analyzeSeed(analyzeState, options);
                            prev.applicationState.hasSettingsChanged = false; // Reset flag after analyzing
                        }, undefined, 'Global/AnalyzeSeed'),
                        lockCard: (cardId: string, card: any) => set((prev: InitialState) => {
                            prev.lockState.lockedCards[cardId] = card;
                            prev.applicationState.hasSettingsChanged = true;
                            return prev;
                        }, undefined, 'Cards/LockCard'),

                        downloadImmolateResults: () => {
                            const analyzeState = get().immolateState;
                            const buys = get().shoppingState.buys;
                            const sells = get().shoppingState.sells;
                            const showCardSpoilers = get().applicationState.showCardSpoilers;
                            const unlocks = get().immolateState.selectedOptions;
                            const events = get().eventState.events;
                            const lockedCards = get().lockState.lockedCards;

                            const options = {
                                showCardSpoilers,
                                unlocks,
                                events,
                                updates: [],
                                buys,
                                sells,
                                lockedCards
                            }
                            const immolateResults = analyzeSeed(analyzeState, options)
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify
                                ({
                                    analyzeState,
                                    options,
                                    immolateResults
                                }, null, 2));
                            const downloadAnchorNode = document.createElement('a');
                            downloadAnchorNode.setAttribute("href", dataStr);
                            const fileName = `${analyzeState.seed}.json`;
                            downloadAnchorNode.setAttribute("download", fileName);
                            document.body.appendChild(downloadAnchorNode); // required for firefox
                            downloadAnchorNode.click();
                            downloadAnchorNode.remove();
                        },

                        unlockCard: (cardId: string) => set((prev: InitialState) => {
                            delete prev.lockState.lockedCards[cardId];
                            prev.applicationState.hasSettingsChanged = true;
                            return prev;
                        }, undefined, 'Cards/UnlockCard'),

                        clearLockedCards: () => set((prev: InitialState) => {
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
