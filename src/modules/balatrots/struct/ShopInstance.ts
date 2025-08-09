export class ShopInstance {
    constructor(
        private _jokerRate: number = 20,
        private _tarotRate: number = 4,
        private _planetRate: number = 4,
        private _playingCardRate: number = 0,
        private _spectralRate: number = 0
    ) { }

    getTotalRate(): number {
        return this._jokerRate +
            this._tarotRate +
            this._planetRate +
            this._playingCardRate +
            this._spectralRate;
    }

    get jokerRate(): number { return this._jokerRate; }
    set jokerRate(value: number) { this._jokerRate = value; }

    get tarotRate(): number { return this._tarotRate; }
    set tarotRate(value: number) { this._tarotRate = value; }

    get planetRate(): number { return this._planetRate; }
    set planetRate(value: number) { this._planetRate = value; }

    get playingCardRate(): number { return this._playingCardRate; }
    set playingCardRate(value: number) { this._playingCardRate = value; }

    get spectralRate(): number { return this._spectralRate; }
    set spectralRate(value: number) { this._spectralRate = value; }
}