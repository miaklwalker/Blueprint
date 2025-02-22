import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {create, createStore} from "zustand";
import {options} from "./const.js";
import {Buy} from "./classes.js";


const getUrlSearch = () => {
    return window.location.search.slice(1)
}
const persistentStorage = {
    getItem: (key) => {
        if (getUrlSearch()) {
            const searchParams = new URLSearchParams(getUrlSearch())
            return searchParams.get(key)
        } else {
            // Otherwise, we should load from localstorage or alternative storage
            return JSON.parse(sessionStorage.getItem(key))
        }
    },
    setItem: (key, newValue) => {
        if (getUrlSearch()) {
            const searchParams = new URLSearchParams(getUrlSearch())
            searchParams.set(key, JSON.stringify(newValue))
            window.history.replaceState(null, '', `?${searchParams.toString()}`)
        }
        sessionStorage.setItem(key, JSON.stringify(newValue))
    },
    removeItem: (key) => {
        const searchParams = new URLSearchParams(getUrlSearch())
        searchParams.delete(key)
        window.location.search = searchParams.toString()
    }
}
const buildURLSuffix = (params, version = 0) => {
    const searchParams = new URLSearchParams()

    const zustandStoreParams = {
        state: {
            seed: params.seed,
            deck: params.deck,
            cardsPerAnte: params.cardsPerAnte,
            stake: params.stake,
            version: params.version,
            ante: params.ante,
            globalSearch: params.globalSearch,
            selectedAnte: params.selectedAnte,
            selectedBlind: params.selectedBlind,
        },
        version: version,
    }
    // The URL param key should match the name of the store, as specified as in storageOptions above
    searchParams.set('blueprint-store', JSON.stringify(zustandStoreParams))
    return searchParams.toString()
}

export const buildShareableUrl = (params, version) => {
    return `${window.location.origin}?${buildURLSuffix(params, version)}`
}


const seedSettingsSlice = (set, get) => ({
    seed: '',
    deck: 'Red Deck',
    cardsPerAnte: 50,
    stake: 'White Stake',
    version: '10106',
    ante: 8,
    selectedOptions: Array(61).fill(true),


    setSeed: (value) => set({seed: value.toUpperCase()}),
    setDeck: (value) => set({deck: value}),
    setCardsPerAnte: (value) => set({cardsPerAnte: value}),
    setStake: (value) => set({stake: value}),
    setVersion: (value) => set({version: value}),
    setAnte: (value) => set({ante: value}),
    setSelectedOptions: (newOptions) => {
        return set({
            selectedOptions: options.map(option => newOptions.includes(option))
        })
    },

    getCardsPerAnteString: () => {
        let result = Array(get().ante).fill(get().cardsPerAnte);
        result[0] = 15;
        return result.join(',')
    },

    reset: () => set({
        seed: '',
        deck: 'Red Deck',
        cardsPerAnte: 50,
        stake: 'White Stake',
        version: '10106',
        ante: 8,
        selectedOptions: Array(61).fill(true),
        selectedSearchResult: null,
        searchResults: [],
        globalSearch: '',
        selectedAnte: 'ANTE 1',
        selectedBlind: 'Big Blind',
        results: '',
        seedIsOpen: false,
    }),

});
const modalsSlice = (set, get) => ({

    selectOptionsModalOpen: false,
    openSelectOptionModal: () => set({selectOptionsModalOpen: true}),
    closeSelectOptionModal: () => set({selectOptionsModalOpen: false}),

    settingsOpen: true,
    openSettings: () => set({settingsOpen: true}),
    closeSettings: () => set({settingsOpen: false}),
    toggleSettingsOpen: () => set({settingsOpen: !get().settingsOpen}),

    outputOpen: false,
    openOutput: () => set({outputOpen: false}),
    closeOutput: () => set({outputOpen: true}),
    toggleOutputOpen: () => set({outputOpen: !get().outputOpen}),

});
const applicationSlice = (set, get) => ({
    seedIsOpen: false,
    setSeedIsOpen: (value) => set({seedIsOpen: value}),

    selectedSearchResult: null,
    searchResults: [],
    setSearchResults: (results) => set({searchResults: results}),

    globalSearch: '',
    setGlobalSearchString: (value) => set({globalSearch: value}),

    selectedAnte: 'ANTE 1',
    setSelectedAnte: (value) => set({selectedAnte: value}),

    selectedBlind: 'Big Blind',
    setSelectedBlind: (value) => set({selectedBlind: value}),

    results: '',
    setResults: (results) => set({results: results}),

    goToResult: (result) => {
        const {ante, blind, location, index} = result
        let update = {selectedSearchResult: result};
        if (ante) update.selectedAnte = ante;
        if (blind) update.selectedBlind = blind;
        if (location.includes('Pack')) {
            if (ante === 'ANTE 1') {
                if (index < 2) {
                    update.selectedBlind = 'Big Blind'
                } else {
                    update.selectedBlind = 'Boss Blind'
                }
            } else {
                if (index < 2) {
                    update.selectedBlind = 'Small Blind'
                } else if (index < 4) {
                    update.selectedBlind = 'Big Blind'
                } else {
                    update.selectedBlind = 'Boss Blind'
                }
            }
        }
        return set(update)
    }

});
const shoppingListSlice = (set, get) => ({
    buys: new Map(),
    sells: new Map(),
    owned: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        if(!get()?.buys?.has){
            return false
        }
        return get().buys.has(key)
    },
    buyCard: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        let value = new Buy(purchase);
        let updatedMap = new Map(Object.entries(get().buys))
        updatedMap.set(key, value);
        return set({ buys: updatedMap }, undefined, 'shoppingList::buy')
    },
    removeCard: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        let current = get().buys;
        current.delete(key);
        let updatedMap = new Map(Object.entries(current))
        return set({buys: updatedMap}, undefined, 'shoppingList::remove')
    }

})

const makeBlueprintStore = (set, get) => ({
    ...seedSettingsSlice(set, get),
    ...modalsSlice(set, get),
    ...applicationSlice(set, get),
    ...shoppingListSlice(set, get)


})
//3FSE45
export const useBlueprintStore = create(
    devtools(
        persist(
            makeBlueprintStore,
            {
                name: 'blueprint-store',
                version: 1,
                storage: createJSONStorage(() => sessionStorage),
                migrate: (persisted, version) => {
                    if (version === 0) {
                        persisted.buys = new Map();
                        persisted.sells = new Map();
                    }
                    return persisted
                }
            }
        )
    )
)
