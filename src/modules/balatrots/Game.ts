import { Lock } from "./Lock";
import { Tarot, TarotEnum } from "./enum/cards/Tarot";
import { Planet, PlanetItem } from "./enum/cards/Planet";
import { Spectral, SpectralItem } from "./enum/packs/Spectral";
import { LegendaryJoker, LegendaryJokerItem } from "./enum/cards/LegendaryJoker";
import { UncommonJoker, UncommonJokerItem } from "./enum/cards/UncommonJoker";
import { UncommonJoker101CItem, UncommonJoker_101C } from "./enum/cards/UncommonJoker_101C";
import { UncommonJoker100Item, UncommonJoker_100 } from "./enum/cards/UncommonJoker_100";
import { Card, PlayingCard } from "./enum/cards/Card";
import { Enhancement, EnhancementItem } from "./enum/Enhancement";
import { Voucher, VoucherItem } from "./enum/Voucher";
import { Tag, TagItem } from "./enum/Tag";
import { PackType, PackTypeItem } from "./enum/packs/PackType";
import { RareJoker, RareJokerItem } from "./enum/cards/RareJoker";
import { RareJoker101CItem, RareJoker_101C } from "./enum/cards/RareJoker_101C";
import { RareJoker100Item, RareJoker_100 } from "./enum/cards/RareJoker_100";
import { CommonJoker, CommonJokerCard } from "./enum/cards/CommonJoker";
import { CommonJoker_100, CommonJoker_100Card } from "./enum/cards/CommonJoker_100";
import { BossBlind, BossBlindEnum } from "./enum/BossBlind";
import { InstanceParams } from "./struct/InstanceParams";
import { LuaRandom, pseudohash, round13 } from "./utils/LuaRandom";
import { Cache } from "./Cache";
import { ItemImpl } from "./interface/Item";
import { Specials, SpecialsItem } from "./enum/cards/Specials";
import { JokerData } from "./struct/JokerData";
import { Edition, EditionItem } from "./enum/Edition";
import { JokerStickers } from "./struct/JokerStickers";
import { Stake, StakeType } from "./enum/Stake";
import { JokerImpl } from "./interface/Joker";
import { ShopInstance } from "./struct/ShopInstance";
import { Deck, deckMap, deckNames, DeckType } from "./enum/Deck";
import { ShopItem } from "./struct/ShopItem";
import { Type } from "./enum/cards/CardType";
import { PackInfo } from "./struct/PackInfo";
import { Seal, SealItem } from "./enum/Seal";
import { QueueNames, RandomQueueNames, RNGSource } from "./enum/QueueName.ts";
import { PackKind } from "./enum/packs/PackKind.ts";
import { options } from "../const.ts";

export class Game extends Lock {
    private static _tarots: Tarot[] | null = null;
    private static _planets: PlanetItem[] | null = null;
    private static _spectrals: SpectralItem[] | null = null;
    private static _legendaryJokers: LegendaryJokerItem[] | null = null;
    private static _uncommonJokers: UncommonJokerItem[] | null = null;
    private static _uncommonJokers101C: UncommonJoker101CItem[] | null = null;
    private static _uncommonJokers100: UncommonJoker100Item[] | null = null;
    private static _cards: Card[] | null = null;
    private static _enhancements: EnhancementItem[] | null = null;
    private static _vouchers: VoucherItem[] | null = null;
    private static _tags: TagItem[] | null = null;
    private static _packs: PackTypeItem[] | null = null;
    private static _rareJokers: RareJokerItem[] | null = null;
    private static _rareJokers101C: RareJoker101CItem[] | null = null;
    private static _rareJokers100: RareJoker100Item[] | null = null;
    private static _commonJokers: CommonJokerCard[] | null = null;
    private static _commonJokers100: CommonJoker_100Card[] | null = null;
    private static _bossBlind: BossBlind[] | null = null;

    static get TAROTS(): Tarot[] {
        if (!this._tarots) {
            this._tarots = Object.values(TarotEnum).map(tarot => new Tarot(tarot));
        }
        return this._tarots;
    }

    static get PLANETS(): PlanetItem[] {
        if (!this._planets) {
            this._planets = Object.values(Planet).map(planet => new PlanetItem(planet));
        }
        return this._planets;
    }

    static get SPECTRALS(): SpectralItem[] {
        if (!this._spectrals) {
            this._spectrals = Object.values(Spectral).map(spectral => new SpectralItem(spectral));
        }
        return this._spectrals;
    }

    static get LEGENDARY_JOKERS(): LegendaryJokerItem[] {
        if (!this._legendaryJokers) {
            this._legendaryJokers = Object.values(LegendaryJoker).map(joker => new LegendaryJokerItem(joker));
        }
        return this._legendaryJokers;
    }

    static get UNCOMMON_JOKERS(): UncommonJokerItem[] {
        if (!this._uncommonJokers) {
            this._uncommonJokers = Object.values(UncommonJoker).map(joker => new UncommonJokerItem(joker));
        }
        return this._uncommonJokers;
    }

    static get UNCOMMON_JOKERS_101C(): UncommonJoker101CItem[] {
        if (!this._uncommonJokers101C) {
            this._uncommonJokers101C = Object.values(UncommonJoker_101C).map(joker => new UncommonJoker101CItem(joker));
        }
        return this._uncommonJokers101C;
    }

    static get UNCOMMON_JOKERS_100(): UncommonJoker100Item[] {
        if (!this._uncommonJokers100) {
            this._uncommonJokers100 = Object.values(UncommonJoker_100).map(joker => new UncommonJoker100Item(joker));
        }
        return this._uncommonJokers100;
    }

    static get CARDS(): Card[] {
        if (!this._cards) {
            this._cards = Object.values(PlayingCard).map(card => new Card(card));
        }
        return this._cards;
    }

    static get ENHANCEMENTS(): EnhancementItem[] {
        if (!this._enhancements) {
            this._enhancements = Object.values(Enhancement).map(enhancement => new EnhancementItem(enhancement));
        }
        return this._enhancements;
    }

    static get VOUCHERS(): VoucherItem[] {
        if (!this._vouchers) {
            this._vouchers = Object.values(Voucher).map(voucher => new VoucherItem(voucher));
        }
        return this._vouchers;
    }

    static get TAGS(): TagItem[] {
        if (!this._tags) {
            this._tags = Object.values(Tag).map(tag => new TagItem(tag));
        }
        return this._tags;
    }

    static get PACKS(): PackTypeItem[] {
        if (!this._packs) {
            this._packs = Object.values(PackType).map(pack => new PackTypeItem(pack, PackTypeItem.VALUES[pack]));
        }
        return this._packs;
    }

    static get RARE_JOKERS(): RareJokerItem[] {
        if (!this._rareJokers) {
            this._rareJokers = Object.values(RareJoker).map(joker => new RareJokerItem(joker));
        }
        return this._rareJokers;
    }

    static get RARE_JOKERS_101C(): RareJoker101CItem[] {
        if (!this._rareJokers101C) {
            this._rareJokers101C = Object.values(RareJoker_101C).map(joker => new RareJoker101CItem(joker));
        }
        return this._rareJokers101C;
    }

    static get RARE_JOKERS_100(): RareJoker100Item[] {
        if (!this._rareJokers100) {
            this._rareJokers100 = Object.values(RareJoker_100).map(joker => new RareJoker100Item(joker));
        }
        return this._rareJokers100;
    }

    static get COMMON_JOKERS() {
        if (!this._commonJokers) {
            return this._commonJokers = Object.values(CommonJoker).map(joker => new CommonJokerCard(joker));
        }
        return this._commonJokers;
    }

    static get COMMON_JOKERS_100() {
        if (!this._commonJokers100) {
            return this._commonJokers100 = Object.values(CommonJoker_100).map(joker => new CommonJoker_100Card(joker));
        }
        return this._commonJokers100;
    }

    static get BOSSES() {
        if (!this._bossBlind) {
            return this._bossBlind = Object.values(BossBlindEnum).map(boss => new BossBlind(boss));
        }
        return this._bossBlind;
    }

    static readonly OPTIONS: ReadonlyArray<string> = [
        // Tags
        "Negative Tag",
        "Foil Tag",
        "Holographic Tag",
        "Polychrome Tag",
        "Rare Tag",

        // Special Cards
        "Golden Ticket",

        // Characters
        "Mr. Bones",
        "Acrobat",
        "Sock and Buskin",
        "Swashbuckler",
        "Troubadour",

        // Items & Certificates
        "Certificate",
        "Smeared Joker",
        "Throwback",
        "Hanging Chad",

        // Gems & Materials
        "Rough Gem",
        "Bloodstone",
        "Arrowhead",
        "Onyx Agate",
        "Glass Joker",

        // Performance & Entertainment
        "Showman",
        "Flower Pot",
        "Blueprint",
        "Wee Joker",
        "Merry Andy",

        // Special Effects
        "Oops! All 6s",
        "The Idol",
        "Seeing Double",
        "Matador",
        "Hit the Road",

        // Card Sets
        "The Duo",
        "The Trio",
        "The Family",
        "The Order",
        "The Tribe",

        // Special Characters
        "Stuntman",
        "Invisible Joker",
        "Brainstorm",
        "Satellite",
        "Shoot the Moon",

        // Licenses & Professions
        "Driver's License",
        "Cartomancer",
        "Astronomer",
        "Burnt Joker",
        "Bootstraps",

        // Shop & Economy
        "Overstock Plus",
        "Liquidation",
        "Glow Up",
        "Reroll Glut",
        "Omen Globe",

        // Tools & Equipment
        "Observatory",
        "Nacho Tong",
        "Recyclomancy",

        // Merchants
        "Tarot Tycoon",
        "Planet Tycoon",

        // Special Items
        "Money Tree",
        "Antimatter",
        "Illusion",
        "Petroglyph",
        "Retcon",
        "Palette"
    ] as const;
    static readonly SET_A: ReadonlySet<string> = new Set([
        // Food & Drink
        "Gros Michel",
        "Ice Cream",
        "Cavendish",
        "Turtle Bean",
        "Diet Cola",
        "Popcorn",
        "Ramen",
        "Seltzer",

        // Characters
        "Luchador",
        "Mr. Bones",

        // Special
        "Invisible Joker"
    ]);

    static readonly SET_B: ReadonlySet<string> = new Set([
        // Items
        "Ceremonial Dagger",
        "Flash Card",
        "Spare Trousers",

        // Movement/Action
        "Ride the Bus",
        "Runner",
        "Rocket",

        // Special Jokers
        "Green Joker",
        "Square Joker",
        "Wee Joker",

        // Mystic/Supernatural
        "Constellation",
        "Madness",
        "Vampire",

        // Objects
        "Red Card",
        "Obelisk",
        "Lucky Cat",
        "Castle"
    ]);

    private params: InstanceParams;
    private cache: Cache;
    public seed: string;
    public hashedSeed: number;
    public hasSpoilersMap: Record<string, RNGSource>;
    public hasSpoilers: boolean;

    constructor(seed: string, params: InstanceParams) {
        super();
        this.seed = seed;
        this.params = params;
        this.cache = new Cache();
        this.hashedSeed = pseudohash(seed);
        this.hasSpoilersMap = {
            "The Soul": RNGSource.S_Soul,
            "Judgement": RNGSource.S_Judgement,
            "Wraith": RNGSource.S_Wraith,
        }
        this.hasSpoilers = false;
    }

    private getNode(id: string) {
        var c = this.cache.getNode(id);

        if (c == null) {
            c = pseudohash(id + this.seed);
            this.cache.setNode(id, c);
        }

        var value = round13((c * 1.72431234 + 2.134453429141) % 1);

        this.cache.setNode(id, value);

        return (value + this.hashedSeed) / 2;
    }

    private random(id: string): number {
        const rng = new LuaRandom(this.getNode(id));
        return rng.random();
    }

    private randint(id: string, min: number, max: number) {
        const rng = new LuaRandom(this.getNode(id));
        return rng.randint(min, max);
    }

    randchoice<T extends ItemImpl>(id: string, items: T[]): ItemImpl {
        if (!items || items.length === 0) {
            throw new Error('Items array cannot be empty');
        }

        let item = items[this.randint(id, 0, items.length - 1)];

        // Availability check (Always respected)
        const isAvailabilityLocked = this.isLocked(item);

        // Purchased check (Respected unless Showman is active AND item is not a Voucher)
        // Showman only affects Joker, Tarot, Planet, Spectral.
        // Vouchers are always unique per run (mostly).
        const isVoucher = item instanceof VoucherItem;
        const showmanApplies = this.params.isShowman() && !isVoucher;
        const isPurchasedLocked = this.isPurchased(item);

        if (isAvailabilityLocked || (!showmanApplies && isPurchasedLocked) || item.getName() === "RETRY") {
            let resample = 2;
            while (true) {
                item = items[this.randint(`${id}_resample${resample}`, 0, items.length - 1)];
                resample++;

                const isAvailabilityLockedResample = this.isLocked(item);
                const isVoucherResample = item instanceof VoucherItem;
                const showmanAppliesResample = this.params.isShowman() && !isVoucherResample;
                const isPurchasedLockedResample = this.isPurchased(item);

                if ((!isAvailabilityLockedResample && (showmanAppliesResample || !isPurchasedLockedResample) && item.getName() !== "RETRY") || resample > 1000) {
                    return item;
                }
            }
        }
        return item;
    }

    randchoice_simple<T extends ItemImpl>(id: string, items: T[]): ItemImpl {
        return this.randchoice<T>(id, items);
    }

    private randchoiceJoker<T extends JokerImpl>(id: string, items: T[]): JokerImpl {
        if (!items || items.length === 0) {
            throw new Error('Items array cannot be empty');
        }

        let item = items[this.randint(id, 0, items.length - 1)];

        const isAvailabilityLocked = this.isLocked(item);
        const showmanApplies = this.params.isShowman();
        const isPurchasedLocked = this.isPurchased(item);

        if (isAvailabilityLocked || (!showmanApplies && isPurchasedLocked) || item.getName() === "RETRY") {
            let resample = 2;
            while (true) {
                item = items[this.randint(`${id}_resample${resample}`, 0, items.length - 1)];
                resample++;

                const isAvailabilityLockedResample = this.isLocked(item);
                const isPurchasedLockedResample = this.isPurchased(item);

                if ((!isAvailabilityLockedResample && (showmanApplies || !isPurchasedLockedResample) && item.getName() !== "RETRY") || resample > 1000) {
                    return item;
                }
            }
        }
        return item;
    }

    randweightedchoice(id: string, items: PackTypeItem[]): PackTypeItem {
        const poll: number = this.random(id) * 22.42;
        let idx: number = 1;
        let weight: number = 0;

        while (weight < poll) {
            weight += items[idx].getValue();
            idx++;
        }

        return items[idx - 1];
    }




    poll_edition(source: string, mod: number = 1, noNeg: boolean = true, guaranteed: boolean = false): EditionItem {
        let edition
        const editionPoll = this.random(`${source}`);
        const editionRate = this.isVoucherActive(Voucher.GLOW_UP) ? 4
            : this.isVoucherActive(Voucher.HONE) ? 2 : 1;
        if (guaranteed) {
            switch (true) {
                case (editionPoll > 1 - 0.003 * 25 && !noNeg):
                    edition = Edition.NEGATIVE;
                    break;
                case (editionPoll > 1 - 0.006 * 25):
                    edition = Edition.POLYCHROME;
                    break;
                case (editionPoll > 1 - 0.02 * 25):
                    edition = Edition.HOLOGRAPHIC;
                    break;
                case (editionPoll > 1 - 0.04 * 25):
                    edition = Edition.FOIL;
                    break;
                default:
                    edition = Edition.NO_EDITION;
                    break;
            }
        }
        else {
            switch (true) {
                case (editionPoll > 0.997 && !noNeg):
                    edition = Edition.NEGATIVE;
                    break;
                case (editionPoll > 1 - 0.006 * editionRate * mod):
                    edition = Edition.POLYCHROME;
                    break;
                case (editionPoll > 1 - 0.02 * editionRate * mod):
                    edition = Edition.HOLOGRAPHIC;
                    break;
                case (editionPoll > 1 - 0.04 * editionRate * mod):
                    edition = Edition.FOIL;
                    break;
                default:
                    edition = Edition.NO_EDITION;
                    break;
            }
        }
        return new EditionItem(edition);

    }

    nextTarot(source: QueueNames, ante: number, soulable: boolean): ItemImpl {
        if (soulable &&
            (this.params.isShowman() || !this.isLocked(Specials.THE_SOUL)) &&
            this.random(`${RandomQueueNames.R_Soul}${RandomQueueNames.R_Tarot}${ante}`) > 0.997) {
            return new SpecialsItem(Specials.THE_SOUL);
        }
        return this.randchoice<ItemImpl>(`${RandomQueueNames.R_Tarot}${source}${ante}`, Game.TAROTS);
    }

    nextPlanet(source: QueueNames, ante: number, soulable: boolean): ItemImpl {
        if (soulable &&
            (this.params.isShowman() || !this.isLocked(Specials.BLACKHOLE)) &&
            this.random(`${RandomQueueNames.R_Soul}${RandomQueueNames.R_Planet}${ante}`) > 0.997) {
            return new SpecialsItem(Specials.BLACKHOLE);
        }
        return this.randchoice(`${RandomQueueNames.R_Planet}${source}${ante}`, Game.PLANETS);
    }

    nextSpectral(source: QueueNames, ante: number, soulable: boolean): ItemImpl {
        if (soulable) {
            let forcedKey: ItemImpl | null = null;

            if ((this.params.isShowman() || !this.isLocked(Specials.THE_SOUL)) &&
                this.random(`${RandomQueueNames.R_Soul}${RandomQueueNames.R_Spectral}${ante}`) > 0.997) {
                forcedKey = new SpecialsItem(Specials.THE_SOUL);
            }

            if ((this.params.isShowman() || !this.isLocked(Specials.BLACKHOLE)) &&
                this.random(`${RandomQueueNames.R_Soul}${RandomQueueNames.R_Spectral}${ante}`) > 0.997) {
                forcedKey = new SpecialsItem(Specials.BLACKHOLE);
            }

            if (forcedKey !== null) {
                return forcedKey;
            }
        }

        return this.randchoice(`${RandomQueueNames.R_Spectral}${source}${ante}`, Game.SPECTRALS);
    }

    nextJoker(source: QueueNames, ante: number, hasStickers: boolean): JokerData {
        // Rarity determination
        let rarity: number;
        switch (source) {
            case RNGSource.S_Soul:
                rarity = 4;
                break;
            case RNGSource.S_Wraith:
            case RNGSource.S_Rare_Tag:
                rarity = 3;
                break;
            case RNGSource.S_Uncommon_Tag:
                rarity = 2;
                break;
            case RNGSource.S_Riff_Raff:
            case RNGSource.S_Top_Up:
                rarity = 1;
                break;
            default: {
                const rarityPoll = this.random(`${RandomQueueNames.R_Joker_Rarity}${ante}${source}`);
                rarity = rarityPoll > 0.95 ? 3 : rarityPoll > 0.7 ? 2 : 1;
            }
        }

        // Edition calculation
        const edition = this.poll_edition(
            `${RandomQueueNames.R_Joker_Edition}${source}${ante}`,
            1,
            false,
            false
        ).name

        // Joker selection based on rarity and version
        let joker: JokerImpl;
        const version = this.params.version;

        switch (rarity) {
            case 4:
                joker = this.randchoiceJoker(
                    version > 10099 ? RandomQueueNames.R_Joker_Legendary : `${RandomQueueNames.R_Joker_Legendary}${source}${ante}`,
                    Game.LEGENDARY_JOKERS
                );
                break;
            case 3:
                joker = version > 10103
                    ? this.randchoiceJoker(`${RandomQueueNames.R_Joker_Rare}${source}${ante}`, Game.RARE_JOKERS)
                    : version > 10099
                        ? this.randchoiceJoker(`${RandomQueueNames.R_Joker_Rare}${source}${ante}`, Game.RARE_JOKERS_101C)
                        : this.randchoiceJoker(`${RandomQueueNames.R_Joker_Rare}${source}${ante}`, Game.RARE_JOKERS_100);
                break;
            case 2:
                joker = version > 10103
                    ? this.randchoiceJoker(`${RandomQueueNames.R_Joker_Uncommon}${source}${ante}`, Game.UNCOMMON_JOKERS)
                    : version > 10099
                        ? this.randchoiceJoker(`${RandomQueueNames.R_Joker_Uncommon}${source}${ante}`, Game.UNCOMMON_JOKERS_101C)
                        : this.randchoiceJoker(`${RandomQueueNames.R_Joker_Uncommon}${source}${ante}`, Game.UNCOMMON_JOKERS_100);
                break;
            default:
                joker = version > 10099
                    ? this.randchoiceJoker(`${RandomQueueNames.R_Joker_Common}${source}${ante}`, Game.COMMON_JOKERS)
                    : this.randchoiceJoker(`${RandomQueueNames.R_Joker_Common}${source}${ante}`, Game.COMMON_JOKERS_100);
        }

        // Sticker application
        const stickers = new JokerStickers();
        if (hasStickers) {
            const stake = this.params.getStake();
            const isHighStake = [
                StakeType.BLACK_STAKE, StakeType.BLUE_STAKE, StakeType.PURPLE_STAKE,
                StakeType.ORANGE_STAKE, StakeType.GOLD_STAKE
            ].includes(stake);

            if (version > 10103) {
                if (isHighStake) {
                    const stickerPoll = this.random(
                        `${source === RNGSource.S_Buffoon ? RandomQueueNames.R_Eternal_Perishable_Pack : RandomQueueNames.R_Eternal_Perishable}${ante}`
                    );

                    if (stickerPoll > 0.7 && !Game.SET_A.has(joker.getName())) {
                        stickers.eternal = true;
                    }

                    if (stickerPoll > 0.4 && stickerPoll <= 0.7 &&
                        [StakeType.ORANGE_STAKE, StakeType.GOLD_STAKE].includes(stake) &&
                        !Game.SET_B.has(joker.getName())) {
                        stickers.perishable = true;
                    }
                }

                if (stake === StakeType.GOLD_STAKE) {
                    stickers.rental = this.random(
                        `${source === RNGSource.S_Buffoon ? RandomQueueNames.R_Rental_Pack : RandomQueueNames.R_Rental}${ante}`
                    ) > 0.7;
                }
            } else {
                if (isHighStake && !Game.SET_A.has(joker.getName())) {
                    stickers.eternal = this.random(`${RandomQueueNames.R_Eternal}${ante}`) > 0.7;
                }
                if (version > 10099) {
                    if ([StakeType.ORANGE_STAKE, StakeType.GOLD_STAKE].includes(stake) &&
                        !stickers.eternal) {
                        stickers.perishable = this.random(`${RandomQueueNames.R_Perishable}${ante}`) > 0.49;
                    }
                    if (stake === StakeType.GOLD_STAKE) {
                        stickers.rental = this.random(`${RandomQueueNames.R_Rental}${ante}`) > 0.7;
                    }
                }
            }
        }
        return new JokerData(joker, rarity, edition, stickers);
    }

    getShopInstance(): ShopInstance {
        let tarotRate = 4;
        let planetRate = 4;
        let playingCardRate = 0;
        let spectralRate = 0;
        if (this.params.getDeck().name === deckNames[DeckType.GHOST_DECK]) {
            spectralRate = 2;
        }

        if (this.isVoucherActive(Voucher.TAROT_TYCOON)) {
            tarotRate = 32;
        } else if (this.isVoucherActive(Voucher.TAROT_MERCHANT)) {
            tarotRate = 9.6;
        }

        if (this.isVoucherActive(Voucher.PLANET_TYCOON)) {
            planetRate = 32;
        } else if (this.isVoucherActive(Voucher.PLANET_MERCHANT)) {
            planetRate = 9.6;
        }

        if (this.isVoucherActive(Voucher.MAGIC_TRICK)) {
            playingCardRate = 4;
        }

        return new ShopInstance(20, tarotRate, planetRate, playingCardRate, spectralRate);
    }

    nextShopItem(ante: number): ShopItem {
        const shop = this.getShopInstance();
        let cdtPoll = this.random(`${RandomQueueNames.R_Card_Type}${ante}`) * (shop.getTotalRate());
        let type: Type;

        // Determine card type based on rates
        if (cdtPoll < shop.jokerRate) {
            type = Type.JOKER;
        } else {
            cdtPoll -= shop.jokerRate;
            if (cdtPoll < shop.tarotRate) {
                type = Type.TAROT;
            } else {
                cdtPoll -= shop.tarotRate;
                if (cdtPoll < shop.planetRate) {
                    type = Type.PLANET;
                } else {
                    cdtPoll -= shop.planetRate;
                    type = cdtPoll < shop.playingCardRate ? Type.PLAYING_CARD : Type.SPECTRAL;
                }
            }
        }

        // Generate item based on type
        switch (type) {
            case Type.JOKER: {
                const jokerData = this.nextJoker(RNGSource.S_Shop, ante, true);
                return new ShopItem(type, jokerData.joker, jokerData);
            }
            case Type.TAROT:
                return new ShopItem(type, this.nextTarot(RNGSource.S_Shop, ante, false));
            case Type.PLANET:
                return new ShopItem(type, this.nextPlanet(RNGSource.S_Shop, ante, false));
            case Type.SPECTRAL:
                return new ShopItem(type, this.nextSpectral(RNGSource.S_Shop, ante, false));
            default:
                return new ShopItem();
        }
    }

    nextPack(ante: number): PackTypeItem {
        if (ante < 2 && !this.cache.isGeneratedFirstPack() && this.params.version > 10099) {
            this.cache.setGeneratedFirstPack(true);
            return new PackTypeItem(PackType.BUFFOON_PACK, PackTypeItem.VALUES[PackType.BUFFOON_PACK]);
        }
        return this.randweightedchoice(`${RandomQueueNames.R_Shop_Pack}${ante}`, Game.PACKS);
    }

    packInfo(pack: PackTypeItem): PackInfo {
        const getPackSize = () => {
            if (pack.isMega() || pack.isJumbo()) {
                return pack.isBuffoon() || pack.isSpectral() ? 4 : 5;
            } else {
                return pack.isBuffoon() || pack.isSpectral() ? 2 : 3;
            }
        }

        const getChoices = () => {
            if (pack.isMega()) return 2;
            return 1;
        }

        return new PackInfo(pack, getPackSize(), getChoices());
    }

    setDeck(deck: Deck): void {
        this.params.setDeck(deck);
        let name = deckMap[deck.name]
        switch (name) {
            case DeckType.MAGIC_DECK:
                this.activateVoucher(Voucher.CRYSTAL_BALL);
                break;

            case DeckType.NEBULA_DECK:
                this.activateVoucher(Voucher.TELESCOPE);
                break;

            case DeckType.ZODIAC_DECK:
                this.activateVoucher(Voucher.TAROT_MERCHANT);
                this.activateVoucher(Voucher.PLANET_MERCHANT);
                this.activateVoucher(Voucher.OVERSTOCK);
                break;

            default:
                break;
        }
    }

    setStake(stake: Stake): void {
        this.params.setStake(stake)
    }

    activateVoucher(voucher: Voucher): void {
        this.params.getVouchers().add(voucher);
        this.lockPurchased(voucher);

        // Find voucher index in VOUCHERS array
        const index = Game.VOUCHERS.findIndex(v => v.getName() === voucher);

        // If found and next voucher exists, unlock it
        if (index >= 0 && index + 1 < Game.VOUCHERS.length) {
            const nextVoucher = Game.VOUCHERS[index + 1];
            this.unlock(nextVoucher);
        }
    }

    isVoucherActive(voucher: Voucher): boolean {
        return this.params.getVouchers().has(voucher);
    }

    nextVoucher(ante: number) {
        return this.randchoice(`${RandomQueueNames.R_Voucher}${ante}`, Game.VOUCHERS);
    }

    nextVoucherSimple() {
        return this.randchoice_simple(RandomQueueNames.R_Voucher_Tag, Game.VOUCHERS);
    }

    nextTag(ante: number) {
        return this.randchoice(`${RandomQueueNames.R_Tags}${ante}`, Game.TAGS);
    }

    nextBoss(ante: number): ItemImpl {
        const bossPool: BossBlind[] = [];
        let numBosses = 0;

        for (let i = 0; i < Game.BOSSES.length; i++) {
            if (!this.isLocked(Game.BOSSES[i])) {
                if ((ante % 8 === 0 && Game.BOSSES[i].getName().charAt(0) !== 'T') ||
                    (ante % 8 !== 0 && Game.BOSSES[i].getName().charAt(0) === 'T')) {
                    bossPool[numBosses++] = Game.BOSSES[i];
                }
            }
        }

        if (numBosses === 0) {
            for (let i = 0; i < Game.BOSSES.length; i++) {
                if ((ante % 8 === 0 && Game.BOSSES[i].getName().charAt(0) !== 'T') ||
                    (ante % 8 !== 0 && Game.BOSSES[i].getName().charAt(0) === 'T')) {
                    this.unlock(Game.BOSSES[i].getName());
                }
            }
            return this.nextBoss(ante);
        }

        const chosenBoss = this.randchoice(RandomQueueNames.R_Boss, bossPool);
        this.lock(chosenBoss.getName());
        return chosenBoss;
    }

    nextCertificateStandardCard() {
        let enhancement = "No Enhancement";
        let edition = Edition.NO_EDITION;
        let seal;
        const base = this.randchoice(`${RandomQueueNames.R_Cert_Seal}`, Game.CARDS);
        const sealPoll = this.random(`${RandomQueueNames.R_Cert}`);
        if (sealPoll > 0.75) {
            seal = Seal.RED_SEAL;
        } else if (sealPoll > 0.5) {
            seal = Seal.BLUE_SEAL;
        } else if (sealPoll > 0.25) {
            seal = Seal.GOLD_SEAL;
        } else {
            seal = Seal.PURPLE_SEAL;
        }
        return new Card(base.getName() as PlayingCard, enhancement, new EditionItem(edition), new SealItem(seal));
    }

    nextStandardCard(ante: number, source?: string): Card {
        let enhancement;
        let isFromCertificate = source === RandomQueueNames.R_Cert;
        if (isFromCertificate) {
            return this.nextCertificateStandardCard()
        }

        if (this.random(`${RandomQueueNames.R_Standard_Has_Enhancement}${ante}`) <= 0.6) {
            enhancement = "No Enhancement";
        } else {
            enhancement = this.randchoice(`${RandomQueueNames.R_Enhancement}${RNGSource.S_Standard}${ante}`, Game.ENHANCEMENTS).getName();
        }

        let edition = Edition.NO_EDITION;

        const editionPoll = this.random(`${RandomQueueNames.R_Standard_Edition}${ante}`);

        if (editionPoll > 0.988) {
            edition = Edition.POLYCHROME;
        }
        else if (editionPoll > 0.96) {
            edition = Edition.HOLOGRAPHIC;
        }
        else if (editionPoll > 0.92) {
            edition = Edition.FOIL;
        }

        let seal = Seal.NO_SEAL;

        if (this.random(`${RandomQueueNames.R_Standard_Has_Seal}${ante}`) > 0.8) {
            const sealPoll = this.random(`${RandomQueueNames.R_Standard_Seal}${ante}`);
            if (sealPoll > 0.75) {
                seal = Seal.RED_SEAL;
            } else if (sealPoll > 0.5) {
                seal = Seal.BLUE_SEAL;
            } else if (sealPoll > 0.25) {
                seal = Seal.GOLD_SEAL;
            } else {
                seal = Seal.PURPLE_SEAL;
            }
        }

        const base = this.randchoice(`${RandomQueueNames.R_Card}${RNGSource.S_Standard}${ante}`, Game.CARDS);

        return new Card(base.getName() as PlayingCard, enhancement, new EditionItem(edition), new SealItem(seal));
    }

    nextArcanaPack(size: number, ante: number) {
        const pack: ItemImpl[] = new Array(size);

        for (let i = 0; i < size; i++) {
            if (this.isVoucherActive(Voucher.OMEN_GLOBE) && this.random("omen_globe") > 0.8) {
                pack[i] = this.nextSpectral("ar2", ante, true);
            } else {
                pack[i] = this.nextTarot("ar1", ante, true);
            }
            if (!this.params.isShowman()) {
                this.lock(pack[i].getName());
            }
        }

        if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].getName());
        }

        return pack;
    }

    nextCelestialPack(size: number, ante: number): ItemImpl[] {
        const pack: ItemImpl[] = new Array(size);

        for (let i = 0; i < size; i++) {
            pack[i] = this.nextPlanet("pl1", ante, true);
            if (!this.params.isShowman()) {
                this.lock(pack[i].getName());
            }
        }

        if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].getName());
        }

        return pack;
    }

    nextSpectralPack(size: number, ante: number): ItemImpl[] {
        const pack: ItemImpl[] = new Array(size);

        for (let i = 0; i < size; i++) {
            pack[i] = this.nextSpectral(RNGSource.S_Spectral, ante, true);

            if (!this.params.isShowman()) {
                this.lock(pack[i].getName());
            }
        }

        if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].getName());
        }

        return pack;
    }

    nextStandardPack(size: number, ante: number): Card[] {
        const pack: Card[] = new Array(size);

        for (let i = 0; i < size; i++) {
            pack[i] = this.nextStandardCard(ante);
        }

        return pack;
    }

    public nextBuffoonPack(size: number, ante: number): JokerData[] {
        const pack: JokerData[] = new Array(size);

        for (let i = 0; i < size; i++) {
            const joker = this.nextJoker(RNGSource.S_Buffoon, ante, true);
            pack[i] = joker;

            if (!this.params.isShowman()) {
                this.lock(joker.joker.name);
            }
        }

        // if (this.params.isShowman()) return pack;

        for (let i = 0; i < size; i++) {
            this.unlock(pack[i].joker.name);
        }

        return pack;
    }

    updateShowman(owned: boolean) {
        this.params.setShowman(owned);
    }

    lockLevelTwoVouchers() {
        this.lock("Overstock Plus");
        this.lock("Liquidation");
        this.lock("Glow Up");
        this.lock("Reroll Glut");
        this.lock("Omen Globe");
        this.lock("Observatory");
        this.lock("Nacho Tong");
        this.lock("Recyclomancy");
        this.lock("Tarot Tycoon");
        this.lock("Planet Tycoon");
        this.lock("Money Tree");
        this.lock("Antimatter");
        this.lock("Illusion");
        this.lock("Petroglyph");
        this.lock("Retcon");
        this.lock("Palette");
    }

    handleSelectedUnlocks(selectedUnlocks: string[]) {
        options.forEach((option: string) => {
            if (selectedUnlocks.includes(option)) {
                this.unlock(option);
            } else {
                this.lock(option);
            }
        })
    }

    processPackCards(packInfo: PackInfo, card: any, ante: number) {
        if (packInfo.getKind() === PackKind.BUFFOON) {
            return card as JokerData
        } else {
            let item = (card as ItemImpl).getName();
            let spoilerSource = this.hasSpoilersMap[item];
            if (spoilerSource && this.hasSpoilers) {
                return this.nextJoker(spoilerSource, ante, false)
            }
            return card as Card;
        }
    }

    generatePack(packInfo: PackInfo, ante: number) {
        let cards;
        switch (packInfo.getKind()) {
            case PackKind.CELESTIAL:
                cards = this.nextCelestialPack(packInfo.getSize(), ante);
                break;
            case PackKind.ARCANA:
                cards = this.nextArcanaPack(packInfo.getSize(), ante);
                break;
            case PackKind.SPECTRAL:
                cards = this.nextSpectralPack(packInfo.getSize(), ante);
                break;
            case PackKind.BUFFOON:
                cards = this.nextBuffoonPack(packInfo.getSize(), ante);
                break;
            case PackKind.STANDARD:
                cards = this.nextStandardPack(packInfo.getSize(), ante);
                break;
        }
        for (let c = 0; c < packInfo.getSize(); c++) {
            cards[c] = this.processPackCards(packInfo, cards[c], ante);
        }
        return cards;
    }

    nextEdition(source: string, guaranteed = false): Edition {
        let version = this.params.version;
        let rate = version !== 10106 ? 5 : 4;
        if (this.random(source) < 1 / rate || guaranteed) {
            this.random(source);
            const poll = this.random(source);
            if (poll > 0.85) return Edition.POLYCHROME;
            if (poll > 0.5) return Edition.HOLOGRAPHIC;
            return Edition.FOIL;
        }
        return Edition.NO_EDITION
    }

    nextWheelOfFortuneEdition(): Edition {
        return this.nextEdition(RandomQueueNames.R_Wheel_of_Fortune);
    }
    nextAuraEdition(): Edition {
        return this.poll_edition(
            RandomQueueNames.R_Aura,
            0,
            true,
            true
        ).name
    }

    // nextOrbitalTag(unlockedHands){
    //     const handsWithEvents = [
    //         POKER_HANDS.FLUSH_FIVE,
    //         POKER_HANDS.FIVE_OF_A_KIND,
    //         POKER_HANDS.FLUSH_HOUSE
    //     ];
    //
    //
    // }

    /*
#if V_AT_MOST(0,9,3,12)
item wheel_of_fortune_edition(instance* inst) {
    if (random_simple(inst, R_Wheel_of_Fortune) < 1.0/5) {
        random_simple(inst, R_Wheel_of_Fortune); //Burn function call
        double poll = random_simple(inst, R_Wheel_of_Fortune);
        if (poll > 0.85) return Polychrome;
        if (poll > 0.5) return Holographic;
        return Foil;
    } else return No_Edition;
}
#else
//Wheel of Fortune buffed in 0.9.3n
item wheel_of_fortune_edition(instance* inst) {
    if (random_simple(inst, R_Wheel_of_Fortune) < 1.0/4) {
        random_simple(inst, R_Wheel_of_Fortune); //Burn function call
        double poll = random_simple(inst, R_Wheel_of_Fortune);
        if (poll > 0.85) return Polychrome;
        if (poll > 0.5) return Holographic;
        return Foil;
    } else return No_Edition;
}
#endif

    */

}
