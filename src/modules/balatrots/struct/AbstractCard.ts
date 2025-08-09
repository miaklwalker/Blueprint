import { ItemImpl } from "../interface/Item";

export class AbstractCard extends ItemImpl {
    constructor(readonly name: string) {
        super(name);
    }

    getName(): string {
        return this.name;
    }
}