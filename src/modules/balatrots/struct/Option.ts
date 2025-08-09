import { ItemImpl } from '../interface/Item';

export class Option {
    constructor(
        private readonly _name: ItemImpl,
        private readonly _sticker?: ItemImpl
    ) {}

    get name(): ItemImpl {
        return this._name;
    }

    get sticker(): ItemImpl | undefined {
        return this._sticker;
    }
}