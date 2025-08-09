
export class JokerStickers {
    constructor(
        private _eternal: boolean = false,
        private _perishable: boolean = false,
        private _rental: boolean = false
    ) { }

    get eternal(): boolean {
        return this._eternal;
    }

    set eternal(value: boolean) {
        this._eternal = value;
    }

    get perishable(): boolean {
        return this._perishable;
    }

    set perishable(value: boolean) {
        this._perishable = value;
    }

    get rental(): boolean {
        return this._rental;
    }

    set rental(value: boolean) {
        this._rental = value;
    }
}