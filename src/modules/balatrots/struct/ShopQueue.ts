import { ItemImpl } from '../interface/Item';
// import { SearchableItem } from '../interface/SearchableItem';

export class ShopQueue extends Array<any> {
    constructor(items?: any[]) {
        super();
        if (items) {
            this.push(...items);
        } else {
            // Pre-allocate array with 20 empty slots
            this.length = 20;
        }
    }

    contains(named: ItemImpl): boolean {
        return this.some(item => item.equals(named));
    }
}