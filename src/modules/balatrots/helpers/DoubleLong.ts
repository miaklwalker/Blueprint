export default class DoubleLong {
    view: DataView;
    constructor(dbl?: number) { 
        const buffer = new ArrayBuffer(8);
        this.view = new DataView(buffer);
        if(dbl != null) this.view.setFloat64(0, dbl, true);
    }

    get dbl() {
        return this.view.getFloat64(0, true);
    }

    set dbl(value) {
        this.view.setFloat64(0, value, true);
    }

    get ulong() {
        return this.view.getBigUint64(0, true);
    }

    set ulong(value) {
        this.view.setBigUint64(0, value, true);
    }
}