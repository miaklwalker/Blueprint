import { ItemImpl } from '../interface/Item';
import { Type } from '../enum/cards/CardType';
import { TarotEnum, Tarot } from '../enum/cards/Tarot';
import { JokerData } from './JokerData';
import { JokerImpl } from '../interface/Joker';

export class ShopItem {
    constructor(
        private _type: Type = Type.TAROT,
        private _item: ItemImpl = new Tarot(TarotEnum.THE_FOOL),
        private _jokerData: JokerData = new JokerData()
    ) { }

    get type(): Type {
        return this._type;
    }

    set type(value: Type) {
        this._type = value;
    }

    get item(): ItemImpl | JokerImpl {
        return this._item;
    }

    set item(value: ItemImpl) {
        this._item = value;
    }

    get jokerData(): JokerData {
        return this._jokerData;
    }

    set jokerData(value: JokerData) {
        this._jokerData = value;
    }
}