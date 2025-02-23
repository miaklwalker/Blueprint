import {createJSONStorage, devtools, persist} from "zustand/middleware";
import {create} from "zustand";
import {blinds, options} from "./const.js";
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
    setSelectedAnte: (value) => set({selectedAnte: value, selectedSearchResult: null}),

    selectedBlind: 'Big Blind',
    setSelectedBlind: (value) => set({selectedBlind: value, selectedSearchResult: null}),

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
    buys: {},
    owned: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        if (!get()?.buys) {
            return false
        }
        if (get().buys?.[key]) {
            return true;
        }

        for (let buy of Object.keys(get().buys)) {
            const [purchaseAnte, purchaseBlind, purchasedCard, purchasedLocation] = buy.split('-');
            let sameCardAndLocation = purchasedCard === cardName && purchasedLocation === location;
            let samesAnte = purchaseAnte === selectedAnte;
            let sameOrLaterBlind = blinds.indexOf(purchaseBlind) <= blinds.indexOf(selectedBlind)
            if (sameCardAndLocation && samesAnte && sameOrLaterBlind) {
                return true
            }
        }
        return false;

    },
    buyCard: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        let value = new Buy(purchase);

        return set({buys: {...get().buys, [key]: value}}, undefined, 'shoppingList::buy')
    },
    removeCard: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        let current = get().buys;
        delete current[key]
        return set({buys: {...current}}, undefined, 'shoppingList::buy::undo')
    },

    sells: {},
    sellCard: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        let value = new Buy(purchase);

        return set({sells: {...get().sells, [key]: value}}, undefined, 'shoppingList::sell')
    },
    undoSell: (purchase) => {
        const {selectedAnte, selectedBlind, cardName, location} = purchase
        let key = `${selectedAnte}-${selectedBlind}-${cardName}-${location}`;
        let current = get().sells;
        delete current[key]
        return set({sells: {...current}}, undefined, 'shoppingList::sell::undo')
    },


    getPurchaseHistory() {
        let buys = get().buys;
        let sells = get().sells;
        let mappedBuys = Object
            .values(buys)
            .map(buy => ({
                    ante: Number(buy.ante.split('ANTE ')[1]),
                    blind: blinds.indexOf(buy.blind),
                    cardName: buy.cardName,
                })
            )
        let mappedSells = Object
            .values(sells)
            .map(sell => ({
                    ante: Number(sell.ante.split('ANTE ')[1]),
                    blind: blinds.indexOf(sell.blind),
                    cardName: sell.cardName,
                })
            )
        let maxRuns = get().ante
        let ante = 1;
        let blind = 0
        let purchaseHistory = []

        while ((mappedBuys.length + mappedSells.length)) {
            if (ante >= maxRuns) {
                break
            }
            for (let i = 0; i < mappedBuys.length; i++) {
                let buy = mappedBuys[i];
                if (buy.ante === ante && buy.blind === blind) {
                    let entry = mappedBuys.splice(i, 1)[0];
                    entry.type = 'buy'
                    purchaseHistory.push(entry)
                }
            }
            for (let i = 0; i < mappedSells.length; i++) {
                let sell = mappedSells[i];
                if (sell.ante === ante && sell.blind === blind) {
                    let entry = mappedSells.splice(i, 1)[0];
                    entry.type = 'sell'
                    purchaseHistory.push(entry)

                }
            }

            if (blind !== 0 && blind % 2 === 0) {
                ante++
                blind = 0
            } else {
                blind++;
            }
        }
        return purchaseHistory

    }
})


function initLocks(inst) {
    // level 2 vouchers
    inst.lock("Overstock Plus");
    inst.lock("Liquidation");
    inst.lock("Glow Up");
    inst.lock("Reroll Glut");
    inst.lock("Omen Globe");
    inst.lock("Observatory");
    inst.lock("Nacho Tong");
    inst.lock("Recyclomancy");
    inst.lock("Tarot Tycoon");
    inst.lock("Planet Tycoon");
    inst.lock("Money Tree");
    inst.lock("Antimatter");
    inst.lock("Illusion");
    inst.lock("Petroglyph");
    inst.lock("Retcon");
    inst.lock("Palette");
}

const makeBlueprintStore = (set, get) => ({
    ...seedSettingsSlice(set, get),
    ...modalsSlice(set, get),
    ...applicationSlice(set, get),
    ...shoppingListSlice(set, get),

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
        buys:{},
        sells:{},
    }),
    analyzeSeed: () => {

        const {seed, deck, stake, version, ante, selectedOptions, selectedAnte, selectedBlind} = get();
        const cardsPerAnteString = get().getCardsPerAnteString();
        let output = '';

        const cardsPerAnte = cardsPerAnteString.split(',').map(Number);
        const inst = new Immolate.Instance(seed);
        inst.params = new Immolate.InstParams(deck, stake, false, version);
        // ante, fresh_profile, fresh_run
        // fresh profile locks all unlockables and fresh run hides all event jokers ( lucky cat e.g. )
        inst.initLocks(1, false, true);
        initLocks(inst)
        inst.setStake(stake);
        inst.setDeck(deck);
        let buys = get().buys;
        let transactions = []
        if (buys && Object.keys(buys)?.length > 0) {
            let selectedAnteValue = Number(selectedAnte.split('ANTE ')[1])
            Object
                .values(buys)
                .map(buy => ({
                        ...buy,
                        ante: Number(buy.ante.split('ANTE ')[1]),
                        blind: blinds.indexOf(buy.blind),
                        cardName: buy.cardName,

                    })
                )
                .filter((buy) => {
                    return buy.ante < selectedAnteValue
                })
                .forEach(item => transactions.push(item))

        }
        for (let a = 1; a <= ante; a++) {
            inst.initUnlocks(a, false);
            transactions.forEach(item => {
                inst.lock(item.cardName)
            })
            output += "==ANTE " + a + "==\n"
            output += "Boss: " + inst.nextBoss(a) + "\n";
            const voucher = inst.nextVoucher(a);
            output += "Voucher: " + voucher + "\n";
            //todo handle with buys and sells logic
            //unlocks next level of voucher
            for (let i = 0; i < Immolate.VOUCHERS.size(); i += 2) {
                let levelOneVoucher = Immolate.VOUCHERS.get(i);
                let levelOneLocked = inst.isLocked(levelOneVoucher);
                let levelTwoVoucher = Immolate.VOUCHERS.get(i + 1);

                let isEnabled = selectedOptions[options.indexOf(levelTwoVoucher)];
                if (levelOneLocked) {
                    inst.activateVoucher(levelOneVoucher)
                    if (isEnabled) {
                        inst.unlock(levelTwoVoucher)
                    }
                }


            }
            output += "Tags: " + inst.nextTag(a) + ", " + inst.nextTag(a) + "\n";
            output += "Shop Queue: \n";
            for (let q = 1; q <= cardsPerAnte[a - 1]; q++) {
                output += q + ") ";
                let item = inst.nextShopItem(a);
                if (item.type === "Joker") {
                    if (item.jokerData.stickers.eternal) output += "Eternal ";
                    if (item.jokerData.stickers.perishable) output += "Perishable ";
                    if (item.jokerData.stickers.rental) output += "Rental ";
                    if (item.jokerData.edition !== "No Edition") output += item.jokerData.edition + " ";
                }
                output += item.item + "\n";
                item.delete();
            }
            output += "\nPacks: \n";
            let numPacks = (a === 1) ? 4 : 6;
            for (let p = 1; p <= numPacks; p++) {
                let pack = inst.nextPack(a);
                output += pack + " - ";
                let packInfo = Immolate.packInfo(pack);
                if (packInfo.type === "Celestial Pack") {
                    let cards = inst.nextCelestialPack(packInfo.size, a);
                    for (let c = 0; c < packInfo.size; c++) {
                        output += cards.get(c);
                        output += (c + 1 !== packInfo.size) ? ", " : "";
                    }
                    cards.delete();
                }
                if (packInfo.type === "Arcana Pack") {
                    let cards = inst.nextArcanaPack(packInfo.size, a);
                    for (let c = 0; c < packInfo.size; c++) {
                        output += cards.get(c);
                        output += (c + 1 !== packInfo.size) ? ", " : "";
                    }
                    cards.delete();
                }
                if (packInfo.type === "Spectral Pack") {
                    let cards = inst.nextSpectralPack(packInfo.size, a);
                    for (let c = 0; c < packInfo.size; c++) {
                        output += cards.get(c);
                        output += (c + 1 !== packInfo.size) ? ", " : "";
                    }
                    cards.delete();
                }
                if (packInfo.type === "Buffoon Pack") {
                    let cards = inst.nextBuffoonPack(packInfo.size, a);
                    for (let c = 0; c < packInfo.size; c++) {
                        let joker = cards.get(c);
                        if (joker.stickers.eternal) output += "Eternal ";
                        if (joker.stickers.perishable) output += "Perishable ";
                        if (joker.stickers.rental) output += "Rental ";
                        if (joker.edition !== "No Edition") output += joker.edition + " ";
                        output += joker.joker;
                        joker.delete();
                        output += (c + 1 !== packInfo.size) ? ", " : "";
                    }
                    cards.delete();
                }
                if (packInfo.type === "Standard Pack") {
                    let cards = inst.nextStandardPack(packInfo.size, a);
                    for (let c = 0; c < packInfo.size; c++) {
                        let card = cards.get(c);
                        if (card.seal !== "No Seal") output += card.seal + " ";
                        if (card.edition !== "No Edition") output += card.edition + " ";
                        if (card.enhancement !== "No Enhancement") output += card.enhancement + " ";
                        let rank = card.base[2];
                        if (rank === "T") output += "10";
                        else if (rank === "J") output += "Jack";
                        else if (rank === "Q") output += "Queen";
                        else if (rank === "K") output += "King";
                        else if (rank === "A") output += "Ace";
                        else output += rank;
                        output += " of ";
                        let suit = card.base[0];
                        if (suit === "C") output += "Clubs";
                        else if (suit === "S") output += "Spades";
                        else if (suit === "D") output += "Diamonds";
                        else if (suit === "H") output += "Hearts";
                        card.delete();
                        output += (c + 1 !== packInfo.size) ? ", " : "";
                    }
                    cards.delete();
                }
                output += "\n";
            }

            output += "\n";
        }
        inst.delete();

        set({results: output}, undefined, 'analyzeSeed::store')
    }

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
