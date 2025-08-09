import {
    Deck,
    DeckType
} from '../enum/Deck';
import { Stake, StakeType } from '../enum/Stake';
import { Version } from '../enum/Version';
import { Voucher } from '../enum/Voucher';

export class InstanceParams {
    private deck: Deck;
    private stake: Stake;
    private showman: boolean;
    public sixesFactor: number;
    public version: number;
    public vouchers: Set<Voucher>;

    constructor(d?: Deck, s?: Stake, showman?: boolean, v?: number) {
        this.deck = d || new Deck(DeckType.RED_DECK);
        this.stake = s || new Stake(StakeType.WHITE_STAKE);
        this.showman = showman || false;
        this.sixesFactor = 1;
        this.version = v || Version.v_101c.getVersion();
        this.vouchers = new Set<Voucher>();
    }

    getDeck(): Deck {
        return this.deck;
    }

    setDeck(deck: Deck): void {
        this.deck = deck;
    }

    getStake(): StakeType {
        return this.stake.getName();
    }

    setStake(stake: Stake): void {
        this.stake = stake;
    }

    isShowman(): boolean {
        return this.showman;
    }

    setShowman(showman: boolean): void {
        this.showman = showman;
    }

    getSixesFactor(): number {
        return this.sixesFactor;
    }

    setSixesFactor(sixesFactor: number): void {
        this.sixesFactor = sixesFactor;
    }

    getVersion(): number {
        return this.version;
    }

    setVersion(version: number): void {
        this.version = version;
    }

    getVouchers(): Set<Voucher> {
        return this.vouchers;
    }

    setVouchers(vouchers: Set<Voucher>): void {
        this.vouchers = vouchers;
    }
}