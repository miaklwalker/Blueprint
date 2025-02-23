import {useMemo} from "react";


function handleBuys(instance, buys, sells) {
    const tierTwoVouchers = [
        "Overstock Plus",
        "Liquidation",
        "Glow Up",
        "Reroll Glut",
        "Omen Globe",
        "Observatory",
        "Nacho Tong",
        "Recyclomancy",
        "Tarot Tycoon",
        "Planet Tycoon",
        "Money Tree",
        "Antimatter",
        "Illusion",
        "Petroglyph",
        "Retcon",
        "Palette",
    ];

    // handle buys and sells
    // handle vouchers
    // handle jokers

    // handle events ( cards breaking )
    for (let voucher of tierTwoVouchers) {
        instance.lock(voucher)
    }
}

export function useAnalyzeSeed({state, options}) {
    return useMemo(() => {
        let output = ''
        const cardsPerAnte = state.cardsPerAnte.split(',').map(Number);
        try {
            const inst = new Immolate.Instance(state.seed);
            inst.params = new Immolate['InstParams'](state.deck, state.stake, false, state.version);
            inst['initLocks'](1, false, false);
            handleBuys(inst, [], [])
            inst.setStake(state.stake);
            inst.setDeck(state.deck);
            for (let a = 1; a <= state.ante; a++) {
                inst.initUnlocks(a, false);
                output += "==ANTE " + a + "==\n"
                output += "Boss: " + inst.nextBoss(a) + "\n";
                var voucher = inst.nextVoucher(a);
                output += "Voucher: " + voucher + "\n";
                //todo this will be handled by buying logic
                inst.lock(voucher);

                // Unlock next level voucher
                for (let i = 0; i < Immolate.VOUCHERS.size(); i += 2) {
                    if (Immolate.VOUCHERS.get(i) == voucher) {
                        // Only unlock it if it's unlockable
                        if (state.selectedOptions[options.indexOf(Immolate.VOUCHERS.get(i + 1))]) {
                            inst.unlock(Immolate.VOUCHERS.get(i + 1));
                        }

                    }

                }
                output += "Tags: " + inst.nextTag(a) + ", " + inst.nextTag(a) + "\n";

                output += "Shop Queue: \n";
                for (let q = 1; q <= cardsPerAnte[a - 1]; q++) {
                    output += q + ") ";
                    var item = inst.nextShopItem(a);
                    if (item.type == "Joker") {
                        if (item.jokerData.stickers.eternal) output += "Eternal ";
                        if (item.jokerData.stickers.perishable) output += "Perishable ";
                        if (item.jokerData.stickers.rental) output += "Rental ";
                        if (item.jokerData.edition != "No Edition") output += item.jokerData.edition + " ";
                    }
                    output += item.item + "\n";
                    item.delete();
                }

                output += "\nPacks: \n";
                var numPacks = (a == 1) ? 4 : 6;
                for (let p = 1; p <= numPacks; p++) {
                    var pack = inst.nextPack(a);
                    output += pack + " - ";
                    var packInfo = Immolate.packInfo(pack);
                    if (packInfo.type == "Celestial Pack") {
                        var cards = inst.nextCelestialPack(packInfo.size, a);
                        for (let c = 0; c < packInfo.size; c++) {
                            output += cards.get(c);
                            output += (c + 1 != packInfo.size) ? ", " : "";
                        }
                        cards.delete();
                    }
                    if (packInfo.type == "Arcana Pack") {
                        var cards = inst.nextArcanaPack(packInfo.size, a);
                        for (let c = 0; c < packInfo.size; c++) {
                            output += cards.get(c);
                            output += (c + 1 != packInfo.size) ? ", " : "";
                        }
                        cards.delete();
                    }
                    if (packInfo.type == "Spectral Pack") {
                        var cards = inst.nextSpectralPack(packInfo.size, a);
                        for (let c = 0; c < packInfo.size; c++) {
                            output += cards.get(c);
                            output += (c + 1 != packInfo.size) ? ", " : "";
                        }
                        cards.delete();
                    }
                    if (packInfo.type == "Buffoon Pack") {
                        var cards = inst.nextBuffoonPack(packInfo.size, a);
                        for (let c = 0; c < packInfo.size; c++) {
                            var joker = cards.get(c);
                            if (joker.stickers.eternal) output += "Eternal ";
                            if (joker.stickers.perishable) output += "Perishable ";
                            if (joker.stickers.rental) output += "Rental ";
                            if (joker.edition != "No Edition") output += joker.edition + " ";
                            output += joker.joker;
                            joker.delete();
                            output += (c + 1 != packInfo.size) ? ", " : "";
                        }
                        cards.delete();
                    }
                    if (packInfo.type == "Standard Pack") {
                        var cards = inst.nextStandardPack(packInfo.size, a);
                        for (let c = 0; c < packInfo.size; c++) {
                            var card = cards.get(c);
                            if (card.seal != "No Seal") output += card.seal + " ";
                            if (card.edition != "No Edition") output += card.edition + " ";
                            if (card.enhancement != "No Enhancement") output += card.enhancement + " ";
                            var rank = card.base[2];
                            if (rank == "T") output += "10";
                            else if (rank == "J") output += "Jack";
                            else if (rank == "Q") output += "Queen";
                            else if (rank == "K") output += "King";
                            else if (rank == "A") output += "Ace";
                            else output += rank;
                            output += " of ";
                            var suit = card.base[0];
                            if (suit == "C") output += "Clubs";
                            else if (suit == "S") output += "Spades";
                            else if (suit == "D") output += "Diamonds";
                            else if (suit == "H") output += "Hearts";
                            card.delete();
                            output += (c + 1 != packInfo.size) ? ", " : "";
                        }
                        cards.delete();
                    }
                    output += "\n";
                }

                output += "\n";
            }

        } catch (e) {
            output = '';
            console.error(e);
        }
        return output
    }, []);
}

function analyzeSeed(state) {

    if (!state.seed) return ''
    if (state.seed.trim().length <= 1) return '';
    let output = ''
    const cardsPerAnte = state.cardsPerAnte.split(',').map(Number);
    const inst = new Immolate.Instance(state.seed);
    inst.params = new Immolate.InstParams(state.deck, state.stake, false, state.version);
    inst.initLocks(1, false, false);




    inst.delete();
    return output
}