import {CommonJoker, CommonJokerCard} from '../enum/cards/CommonJoker';
import {Edition} from '../enum/Edition';
import {JokerStickers} from './JokerStickers';
import {JokerImpl} from '../interface/Joker';

export class JokerData {
    constructor(
        private _joker: JokerImpl = new CommonJokerCard(CommonJoker.JOKER),
        private _rarity: number = 1,
        private _edition: Edition = Edition.NO_EDITION,
        private _stickers: JokerStickers = new JokerStickers()
    ) { }
    get name() {
        return this.joker.getName()
    }
    get joker(): JokerImpl {
        return this._joker;
    }

    set joker(value: JokerImpl) {
        this._joker = value;
    }

    get rarity(): number {
        return this._rarity;
    }

    set rarity(value: number) {
        this._rarity = value;
    }

    get edition(): Edition {
        return this._edition;
    }

    set edition(value: Edition) {
        this._edition = value;
    }

    get stickers(): JokerStickers {
        return this._stickers;
    }

    set stickers(value: JokerStickers) {
        this._stickers = value;
    }
}