import {bosses, editionMap, jokers, options, stickerMap, tags, tarotsAndPlanets, vouchers} from "./const.js";

export function maskToCanvas(canvas, itemName, type, itemModifiers, itemStickers) {
    let itemData;
    let imgSrc;
    let gridWidth;
    let gridHeight;

    if (type === 'joker') {
        itemData = jokers.find(j => j.name === itemName);
        imgSrc = 'images/Jokers.png';
        gridWidth = 10;
        gridHeight = 16;
    } else if (type === 'tarot' || type === 'planet') {
        itemData = tarotsAndPlanets.find(t => t.name === itemName);
        imgSrc = 'images/Tarots.png';
        gridWidth = 10;
        gridHeight = 6;
    }

    if (!itemData) {
        console.error(`${type.charAt(0).toUpperCase() + type.slice(1)} not found:`, itemName);
        return;
    }

    const imageWidth = imgSrc.includes('Jokers.png') ? 710 : 710; // Width of your images
    const imageHeight = imgSrc.includes('Jokers.png') ? 1520 : 570; // Height of your images

    const itemWidth = imageWidth / gridWidth;
    const itemHeight = imageHeight / gridHeight;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imgSrc;
    img.onload = function () {
        ctx.drawImage(
            img,
            itemData.pos.x * itemWidth,
            itemData.pos.y * itemHeight,
            itemWidth,
            itemHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const overlayModifier = itemModifiers.find(mod => ["Foil", "Holographic", "Polychrome"].includes(mod));
        if (overlayModifier) {
            overlayEdition(ctx, canvas, editionMap[overlayModifier]);
        }

        itemStickers.forEach(stick => {
            if (stickerMap[stick]) {
                overlaySticker(ctx, canvas, stickerMap[stick]);
            }
        });

        if (itemModifiers.includes("Negative")) {
            canvas.style.filter = 'invert(0.8)';
        }
    };
}

export function overlayEdition(ctx, canvas, index) {
    const editionImg = new Image();
    editionImg.src = 'images/Editions.png';
    editionImg.onload = function () {
        const editionWidth = editionImg.width / 5;
        const editionHeight = editionImg.height;

        ctx.drawImage(
            editionImg,
            index * editionWidth,
            0,
            editionWidth,
            editionHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );
    };
}

export function overlaySticker(ctx, canvas, position) {
    const stickerImg = new Image();
    stickerImg.src = 'images/stickers.png';
    stickerImg.onload = function () {
        const stickerWidth = stickerImg.width / 5;
        const stickerHeight = stickerImg.height / 3;

        ctx.drawImage(
            stickerImg,
            position.x * stickerWidth,
            position.y * stickerHeight,
            stickerWidth,
            stickerHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );
    };
}

export function getStandardCardName(cardName) {
    return cardName.replace(/\b(Purple|Red|Blue|Gold) Seal\b/g, '').replace(/\b(Bonus|Mult|Wild|Glass|Steel|Stone|Gold|Lucky)\b/g, '').replace(/\b(Foil|Holographic|Polychrome)\b/g, '').trim();
}

export function getStandardCardModifiers(cardName) {
    const sealRegex = /\b(Purple Seal|Red Seal|Blue Seal|Gold Seal)\b/g;
    const enhancementRegex = /\b(Bonus|Mult|Wild|Glass|Steel|Stone|Gold|Lucky)\b/g;
    const editionRegex = /\b(Foil|Holographic|Polychrome)\b/g;

    const seals = [];
    let sealMatch;
    while ((sealMatch = sealRegex.exec(cardName)) !== null) {
        seals.push(sealMatch[0]);
    }

    // Remove the seal text from the card name
    const cardNameWithoutSeals = cardName.replace(sealRegex, '').trim();

    const enhancements = cardNameWithoutSeals.match(enhancementRegex) || [];
    const editions = cardNameWithoutSeals.match(editionRegex) || [];

    return [...seals, ...enhancements, ...editions];
}

export function getStandardCardPosition(rank, suit) {
    const rankMap = {
        '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6, '9': 7, '10': 8, 'Jack': 9, 'Queen': 10, 'King': 11, 'Ace': 12
    };
    const suitMap = {
        'Hearts': 0, 'Clubs': 1, 'Diamonds': 2, 'Spades': 3
    };

    const x = rankMap[rank];
    const y = suitMap[suit];

    return { x, y };
}

export function renderStandardCard(canvas, rank, suit, modifiers, seal) {

    const ctx = canvas.getContext('2d');

    const deckImg = new Image();
    deckImg.src = 'images/8BitDeck.png';
    const enhancersImg = new Image();
    enhancersImg.src = 'images/Enhancers.png';

    const cardWidth = 71;
    const cardHeight = 95;
    const deckWidth = 923;
    const deckHeight = 380;
    const enhancersWidth = 497;
    const enhancersHeight = 475;

    const { x: cardX, y: cardY } = getStandardCardPosition(rank, suit);

    deckImg.onload = function () {
        enhancersImg.onload = function () {
            // Draw the card background
            const enhancerPos = getEnhancerPosition(modifiers);
            ctx.drawImage(
                enhancersImg,
                enhancerPos.x * (enhancersWidth / 7),
                enhancerPos.y * (enhancersHeight / 5),
                enhancersWidth / 7,
                enhancersHeight / 5,
                0,
                0,
                cardWidth,
                cardHeight
            );

            // Draw the card rank and suit
            ctx.drawImage(
                deckImg,
                cardX * (deckWidth / 13),
                cardY * (deckHeight / 4),
                deckWidth / 13,
                deckHeight / 4,
                0,
                0,
                cardWidth,
                cardHeight
            );

            // Draw the edition overlay
            const edition = modifiers.find(mod => ["Foil", "Holographic", "Polychrome"].includes(mod));
            if (edition) {
                overlayEdition(ctx, canvas, editionMap[edition]);
            }

            // Draw the seal overlay
            if (seal) {
                const sealPos = getSealPosition(seal);
                ctx.drawImage(
                    enhancersImg,
                    sealPos.x * (enhancersWidth / 7),
                    sealPos.y * (enhancersHeight / 5),
                    enhancersWidth / 7,
                    enhancersHeight / 5,
                    0,
                    0,
                    cardWidth,
                    cardHeight
                );
            }
        };
        enhancersImg.src = 'images/Enhancers.png';
    };
    deckImg.src = 'images/8BitDeck.png';
}

export function getEnhancerPosition(modifiers) {
    const enhancerMap = {
        'Bonus': { x: 1, y: 1 },
        'Mult': { x: 2, y: 1 },
        'Wild': { x: 3, y: 1 },
        'Glass': { x: 5, y: 1 },
        'Steel': { x: 6, y: 1 },
        'Stone': { x: 5, y: 0 },
        'Gold': { x: 6, y: 0 },
        'Lucky': { x: 4, y: 1 }
    };

    const enhancer = modifiers.find(mod => Object.keys(enhancerMap).includes(mod));
    return enhancer ? enhancerMap[enhancer] : { x: 1, y: 0 };
}

export function getSealPosition(seal) {
    const sealMap = {
        'Gold Seal': { x: 2, y: 0 },
        'Purple Seal': { x: 4, y: 4 },
        'Red Seal': { x: 5, y: 4 },
        'Blue Seal': { x: 6, y: 4 }
    };

    return sealMap[seal];
}

export function parseStandardCardName(cardName) {
    const sealRegex = /(Purple|Red|Blue|Gold) Seal/;
    const sealMatch = cardName.match(sealRegex);
    const seal = sealMatch ? sealMatch[0] : null;

    let cleanedCardName = seal ? cardName.replace(sealRegex, '').trim() : cardName;

    const modifierRegex = /(Foil|Holographic|Polychrome|Bonus|Mult|Wild|Glass|Steel|Stone|Gold|Lucky)/g;
    const modifiers = cleanedCardName.match(modifierRegex) || [];

    // Remove all modifiers from the cleaned card name
    cleanedCardName = cleanedCardName.replace(modifierRegex, '').trim();

    const parts = cleanedCardName.split(' of ');
    if (parts.length !== 2) {
        console.error('Invalid card name format:', cardName);
        return null;
    }

    const suit = parts[1].trim();
    const rankPart = parts[0].trim();
    const rank = rankPart.split(' ').pop(); // Get the last word as rank

    return { rank, suit, modifiers, seal };
}

export function getModifierColor(modifier) {
    if (modifier.includes('Seal')) {
        return '#ff80ff'; // Light Purple
    } else if (modifier.includes('Bonus') || modifier.includes('Mult') || modifier.includes('Wild')) {
        return '#ff8080'; // Light Red
    } else if (modifier.includes('Glass') || modifier.includes('Steel') || modifier.includes('Stone') || modifier.includes('Gold') || modifier.includes('Lucky')) {
        return '#8080ff'; // Light Blue
    } else if (modifier.includes('Foil') || modifier.includes('Holographic') || modifier.includes('Polychrome')) {
        return '#80ff80'; // Light Green
    }
    return '#ffffff'; // White (default)
}

export function renderBoss(canvas, bossName) {
    const bossData = bosses.find(boss => boss.name === bossName);
    if (!bossData) {
        console.error("Boss not found:", bossName);
        return;
    }

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'images/BlindChips.png';
    img.onload = function () {
        const bossWidth = 714 / 21;
        const bossHeight = 1054 / 31;

        ctx.drawImage(
            img,
            bossData.pos.x * bossWidth,
            bossData.pos.y * bossHeight,
            bossWidth,
            bossHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );
    };
}

export function renderTag(canvas, tagName) {
    const tagData = tags.find(tag => tag.name === tagName);
    if (!tagData) {
        console.error("Tag not found:", tagName);
        return;
    }

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'images/tags.png';
    img.onload = function () {
        const tagWidth = 204 / 6;
        const tagHeight = 170 / 5;

        ctx.drawImage(
            img,
            tagData.pos.x * tagWidth,
            tagData.pos.y * tagHeight,
            tagWidth,
            tagHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );
    };
}

export function renderVoucher(canvas, voucherName) {
    const voucherData = vouchers.find(voucher => voucher.name === voucherName);
    if (!voucherData) {
        console.error("Voucher not found:", voucherName);
        return;
    }

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'images/Vouchers.png';
    img.onload = function () {
        const voucherWidth = 639 / 9;
        const voucherHeight = 380 / 4;

        ctx.drawImage(
            img,
            voucherData.pos.x * voucherWidth,
            voucherData.pos.y * voucherHeight,
            voucherWidth,
            voucherHeight,
            0,
            0,
            canvas.width,
            canvas.height
        );
    };
}

export function searchAndHighlight() {
    const searchInput = document.getElementById('searchInput');
    const searchTerms = searchInput.value.split(',')
        .map(term => term.trim().toLowerCase())
        .filter(term => term.length >= 4); // Filter out terms less than 4 letters

    const queueItems = document.querySelectorAll('.queueItem, .packItem > div, .voucherContainer, .tagContainer, .bossContainer');

    queueItems.forEach(item => {
        const itemText = item.textContent.toLowerCase();
        const shouldHighlight = searchTerms.some(term => itemText.includes(term));
        if (shouldHighlight) {
            item.classList.add('highlight');
        } else {
            item.classList.remove('highlight');
        }
    });
}

export function analyzeSeed(state) {

    if(!state.seed) return ''
    if(state.seed.trim().length <= 1) return '';
    let output = ''
    const cardsPerAnte = state.cardsPerAnte.split(',').map(Number);
    const inst = new Immolate.Instance(state.seed);
    inst.params = new Immolate.InstParams(state.deck, state.stake, false, state.version);
    inst.initLocks(1, false, false);
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
    inst.setStake(state.stake);
    inst.setDeck(state.deck);
    var ghostDeck = (state.deck == "Ghost Deck");
    for (let a = 1; a <= state.ante; a++) {
        inst.initUnlocks(a, false);
        output += "==ANTE " + a + "==\n"
        output += "Boss: " + inst.nextBoss(a) + "\n";
        var voucher = inst.nextVoucher(a);
        output += "Voucher: " + voucher + "\n";
        inst.lock(voucher);
        // Unlock next level voucher
        for (let i = 0; i < Immolate.VOUCHERS.size(); i+=2) {
            if (Immolate.VOUCHERS.get(i) == voucher) {
                // Only unlock it if it's unlockable
                if (state.selectedOptions[options.indexOf(Immolate.VOUCHERS.get(i+1))]) {
                    inst.unlock(Immolate.VOUCHERS.get(i+1));
                };
            };
        };
        output += "Tags: " + inst.nextTag(a) + ", " + inst.nextTag(a) + "\n";

        output += "Shop Queue: \n";
        for (let q = 1; q <= cardsPerAnte[a-1]; q++) {
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
    };

    inst.delete();
    return output
}

export function extractShopQueues(text) {
    const shopQueues = [];
    const regex = /==ANTE \d+==[\s\S]*?(?=(?:==ANTE \d+==|$))/g;
    const matches = text.match(regex);

    if (matches) {
        matches.forEach(match => {
            const titleMatch = match.match(/==ANTE \d+==/);
            const title = titleMatch ? titleMatch[0] : 'Untitled';
            const bossMatch = match.match(/Boss: (.+)/);
            const voucherMatch = match.match(/Voucher: (.+)/);
            const tagsMatch = match.match(/Tags: (.+)/);
            const queueMatch = match.match(/Shop Queue:([\s\S]*?)(?=Packs:|$)/);
            const packsMatch = match.match(/Packs:([\s\S]*?)(?=(?:==ANTE \d+==|$))/);

            const boss = bossMatch ? bossMatch[1].trim() : '';
            const voucher = voucherMatch ? voucherMatch[1].trim() : '';
            const tags = tagsMatch ? tagsMatch[1].trim().split(',').map(tag => tag.trim()) : [];
            const queue = queueMatch ? queueMatch[1].trim().split('\n').filter(item => item.trim() !== '') : [];
            const packs = packsMatch ? packsMatch[1].trim().split('\n').filter(item => item.trim() !== '') : [];

            shopQueues.push({ title, queue, boss, voucher, tags, packs });
        });
    }

    return shopQueues;
}

export function parseCardItem(item) {
    const modifiers = ['Foil', 'Holographic', 'Polychrome', 'Negative'];
    const stickers = ['Perishable', 'Rental', 'Eternal'];
    const seals = ['Purple Seal', 'Red Seal', 'Blue Seal', 'Gold Seal'];

    let standardCardName = item.replace(/^\d+\)/, '').trim();
    let baseCardName = item.replace(/^\d+\)/, '').trim()
    let itemModifiers = [];
    let itemStickers = [];
    let itemSeals = [];

    modifiers.forEach(mod => {
        const regex = new RegExp(`\\b${mod}\\b`, 'i');
        if (regex.test(standardCardName)) {
            itemModifiers.push(mod);
            standardCardName = standardCardName.replace(regex, '').trim();
            baseCardName = baseCardName.replace(regex, '').trim();
        }
    });

    stickers.forEach(stick => {
        const regex = new RegExp(`\\b${stick}\\b`, 'i');
        if (regex.test(standardCardName)) {
            itemStickers.push(stick);
            standardCardName = standardCardName.replace(regex, '').trim();
            baseCardName = baseCardName.replace(regex, '').trim();
        }
    });

    seals.forEach(seal => {
        const regex = new RegExp(`\\b${seal}\\b`, 'i');
        if (regex.test(standardCardName)) {
            itemStickers.push(seal);
            baseCardName = baseCardName.replace(regex, '').trim();
        }
    });

    return { cardName: standardCardName, baseCardName, itemModifiers, itemStickers, itemSeals };
}

export function determineItemType(itemName) {
    if (jokers.find(j => j.name === itemName)) {
        return 'joker';
    } else if (tarotsAndPlanets.find(tp => tp.name === itemName)) {
        return 'tarot';
    } else {
        return 'unknown';
    }
}

export function displayShopQueues() {
    const textarea = document.getElementById('outputBox');
    const text = textarea.value;
    const shopQueues = extractShopQueues(text);

    scrollingContainer.innerHTML = ''; // Clear previous content

    shopQueues.forEach(({ title, queue, boss, voucher, tags, packs }) => {
        const queueContainer = document.createElement('div');
        queueContainer.className = 'queueContainer';

        const queueTitle = document.createElement('div');
        queueTitle.className = 'queueTitle';
        queueTitle.textContent = title; // Display the original title with ANTE number
        queueContainer.appendChild(queueTitle);

        const queueInfo = document.createElement('div');
        queueInfo.className = 'queueInfo';



        const voucherElement = document.createElement('div');
        voucherElement.innerHTML = '<b><u>Voucher</u></b>';
        voucherElement.style = "font-size: 16px";
        if (voucher) {
            const voucherContainer = document.createElement('div');
            voucherContainer.className = 'voucherContainer';

            const voucherCanvas = document.createElement('canvas');
            voucherCanvas.width = 71;
            voucherCanvas.height = 95;
            renderVoucher(voucherCanvas, voucher);
            voucherContainer.appendChild(voucherCanvas);

            const voucherNameElement = document.createElement('div');
            voucherNameElement.textContent = voucher;
            voucherNameElement.classList.add('voucherName');
            voucherContainer.appendChild(voucherNameElement);

            voucherElement.appendChild(voucherContainer);
        }
        queueInfo.appendChild(voucherElement);

        const bossElement = document.createElement('div');
        bossElement.innerHTML = '<b><u>Boss</u></b>';
        bossElement.style = "font-size: 16px";

        if (boss) {
            const bossContainer = document.createElement('div');
            bossContainer.className = 'bossContainer';

            const bossCanvas = document.createElement('canvas');
            bossCanvas.width = 34;
            bossCanvas.height = 34;
            renderBoss(bossCanvas, boss);
            bossContainer.appendChild(bossCanvas);

            const bossNameElement = document.createElement('div');
            bossNameElement.textContent = boss;
            bossNameElement.classList.add('bossName');
            bossContainer.appendChild(bossNameElement);

            bossElement.appendChild(bossContainer);
        }

        queueInfo.appendChild(bossElement);

        const tagsElement = document.createElement('div');
        tagsElement.innerHTML = '<b><u>Tags</u></b>';
        tagsElement.style = "font-size: 16px";

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tagsContainer';

        tags.forEach(tag => {
            const tagContainer = document.createElement('div');
            tagContainer.className = 'tagContainer';

            const tagCanvas = document.createElement('canvas');
            tagCanvas.width = 34;
            tagCanvas.height = 34;
            renderTag(tagCanvas, tag);
            tagContainer.appendChild(tagCanvas);

            const tagNameElement = document.createElement('div');
            tagNameElement.textContent = tag;
            tagNameElement.classList.add('tagName');
            tagContainer.appendChild(tagNameElement);

            tagsContainer.appendChild(tagContainer);
        });

        tagsElement.appendChild(tagsContainer);
        queueInfo.appendChild(tagsElement);

        queueContainer.appendChild(queueInfo);

        const scrollable = document.createElement('div');
        scrollable.className = 'scrollable no-select';
        queueContainer.appendChild(scrollable);

        queue.forEach(item => {
            const { cardName, itemModifiers, itemStickers } = parseCardItem(item);

            const queueItem = document.createElement('div');
            queueItem.className = 'queueItem';

            const canvas = document.createElement('canvas');
            canvas.width = 71;
            canvas.height = 95;

            const itemType = determineItemType(cardName);
            if (itemType !== 'unknown') {
                maskToCanvas(canvas, cardName, itemType, itemModifiers, itemStickers);
            }

            queueItem.appendChild(canvas);

            const itemText = document.createElement('div');
            itemText.textContent = cardName;
            queueItem.appendChild(itemText);

            itemModifiers.forEach(mod => {
                const modifierText = document.createElement('div');
                modifierText.className = 'modifier';
                modifierText.textContent = mod;
                queueItem.appendChild(modifierText);
            });

            itemStickers.forEach(stick => {
                const stickerText = document.createElement('div');
                stickerText.className = 'sticker';
                stickerText.textContent = stick;
                queueItem.appendChild(stickerText);
            });

            scrollable.appendChild(queueItem);
        });

        if (packs.length > 0) {
            const packsTitle = document.createElement('div');
            packsTitle.className = 'queueTitle';
            packsTitle.textContent = '==Packs==';
            queueContainer.appendChild(packsTitle);

            const packsContainer = document.createElement('div');
            queueContainer.appendChild(packsContainer);

            packs.forEach(pack => {
                const packItems = pack.split(' - ');
                const packName = packItems[0];
                const packCards = packItems[1] ? packItems[1].split(', ') : [];

                const packItem = document.createElement('div');
                packItem.className = 'packItem';

                const packNameElement = document.createElement('div');
                packNameElement.textContent = packName + ': ';
                packNameElement.classList.add('packName');
                packItem.appendChild(packNameElement);

                packCards.forEach(cardName => {
                    const { cardName: parsedCardName, itemModifiers, itemStickers } = parseCardItem(cardName);
                    const itemType = determineItemType(parsedCardName);

                    const cardContainer = document.createElement('div');

                    if (itemType !== 'unknown') {
                        const canvas = document.createElement('canvas');
                        canvas.width = 71;
                        canvas.height = 95;
                        maskToCanvas(canvas, parsedCardName, itemType, itemModifiers, itemStickers);
                        cardContainer.appendChild(canvas);

                        const itemText = document.createElement('div');
                        itemText.textContent = parsedCardName;
                        itemText.classList.add('cardName');
                        cardContainer.appendChild(itemText);

                        itemModifiers.forEach(mod => {
                            const modifierText = document.createElement('div');
                            modifierText.classList.add('modifier');
                            modifierText.textContent = mod;
                            cardContainer.appendChild(modifierText);
                        });

                        itemStickers.forEach(stick => {
                            const stickerText = document.createElement('div');
                            stickerText.classList.add('sticker');
                            stickerText.textContent = stick;
                            cardContainer.appendChild(stickerText);
                        });
                    } else {
                        const { rank, suit, modifiers, seal } = parseStandardCardName(cardName);

                        const canvas = document.createElement('canvas');
                        canvas.width = 71;
                        canvas.height = 95;
                        renderStandardCard(canvas, rank, suit, modifiers, seal);
                        cardContainer.appendChild(canvas);

                        const cardText = document.createElement('div');
                        cardText.textContent = getStandardCardName(cardName);
                        cardText.classList.add('standardCardName');
                        cardContainer.appendChild(cardText);

                        modifiers.forEach(modifier => {
                            const modifierText = document.createElement('div');
                            modifierText.textContent = modifier;
                            modifierText.classList.add('modifier');
                            modifierText.style.color = getModifierColor(modifier);
                            cardContainer.appendChild(modifierText);
                        });

                        if (seal) {
                            const sealText = document.createElement('div');
                            sealText.textContent = seal;
                            sealText.classList.add('seal');
                            sealText.style.color = getModifierColor(seal);
                            cardContainer.appendChild(sealText);
                        }
                    }

                    packItem.appendChild(cardContainer);
                });

                packsContainer.appendChild(packItem);
            });


        }


        scrollingContainer.appendChild(queueContainer);
    });

    // Add draggable scrolling functionality
    document.querySelectorAll('.scrollable').forEach(scrollable => {
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollable.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollable.classList.add('active');
            startX = e.pageX - scrollable.offsetLeft;
            scrollLeft = scrollable.scrollLeft;
            scrollable.classList.add('no-select');
        });

        scrollable.addEventListener('mouseleave', () => {
            isDown = false;
            scrollable.classList.remove('active');
            scrollable.classList.remove('no-select');
        });

        scrollable.addEventListener('mouseup', () => {
            isDown = false;
            scrollable.classList.remove('active');
            scrollable.classList.remove('no-select');
        });

        scrollable.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollable.offsetLeft;
            const walk = x - startX; // One-to-one scroll
            scrollable.scrollLeft = scrollLeft - walk;
        });
    });
    searchAndHighlight();
}
