import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {createStore} from "zustand";


const getUrlSearch = () => {
    return window.location.search.slice(1)
}
const persistentStorage = {
    getItem: (key) => {
        if (getUrlSearch()) {
            const searchParams = new URLSearchParams(getUrlSearch())
            const storedValue = searchParams.get(key)
            return JSON.parse(storedValue)
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
        localStorage.setItem(key, JSON.stringify(newValue))
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
    searchParams.set('blueprintStore', JSON.stringify(zustandStoreParams))
    return searchParams.toString()
}

export const buildShareableUrl = (params, version) => {
    return `${window.location.origin}?${buildURLSuffix(params, version)}`
}
const makeBlueprintStore = (set, get) => ({

    seedIsOpen: false,
    setSeedIsOpen: (value) => set({seedIsOpen: value}),

    seed: '',
    deck: 'Red Deck',
    cardsPerAnte: 50,
    stake: 'White Stake',
    version: '1.0.1f',
    ante: 8,
    selectedOptions: Array(61).fill(true),
    selectedSearchResult: null,
    searchResults: [],
    setSearchResults: (results) => set({searchResults: results}),

    globalSearch: '',
    setGlobalSearchString: (value) => set({globalSearch: value}),

    setSeed: (value) => set({seed: value}),
    setDeck: (value) => set({deck: value}),
    setCardsPerAnte: (value) => set({cardsPerAnte: value}),
    setStake: (value) => set({stake: value}),
    setVersion: (value) => set({version: value}),
    setAnte: (value) => set({ante: value}),

    reset: () => set({
        seed:'',
        deck: 'Red Deck',
        cardsPerAnte: 50,
        stake: 'White Stake',
        version: '1.0.1f',
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

    getCardsPerAnteString: () => {
        let result = Array(get().ante).fill(get().cardsPerAnte);
        result[0] = 15;
        return result.join(',')
    },


    selectedAnte: 'ANTE 1',
    setSelectedAnte: (value) => set({selectedAnte: value}),

    selectedBlind: 'Big Blind',
    setSelectedBlind: (value) => set({selectedBlind: value}),

    settingsOpen: true,
    openSettings : () => set({ settingsOpen: true}),
    closeSettings: () => set({ settingsOpen: false }),
    toggleSettingsOpen: () => set({settingsOpen: !get().settingsOpen}),

    outputOpen: false,
    openOutput: () => set({outputOpen: false}),
    closeOutput: () => set({outputOpen: true}),
    toggleOutputOpen: () => set({outputOpen: !get().outputOpen}),

    results: '',
    setResults: (results) => set({results: results}),

    goToResult: (result) => {
        const {ante, blind, location, index} = result
        let update = {selectedSearchResult: result};
        if (ante) update.selectedAnte = ante;
        if (blind) update.selectedBlind = blind;
        if(location.includes('Pack')){
            if( ante === 'ANTE 1') {
                if(index < 2){
                    update.selectedBlind = 'Big Blind'
                }else{
                    update.selectedBlind = 'Boss Blind'
                }
            }else{
                if(index < 2){
                    update.selectedBlind = 'Small Blind'
                }else if (index < 4) {
                    update.selectedBlind = 'Big Blind'
                }else{
                    update.selectedBlind = 'Boss Blind'
                }
            }
        }
        return set(update)
    }

})

export const createBlueprintStore = createStore(
    devtools(
        persist(
            makeBlueprintStore,
            {
                name: 'blueprint-store',
                storage: createJSONStorage(() => persistentStorage)
            }
        )
    )
)