import { ItemImpl } from '../interface/Item';
import { Edition, EditionItem } from '../enum/Edition';

export class SearchableItem {
    constructor(
        private readonly item: ItemImpl,
        private readonly edition?: ItemImpl
    ) { }

    hasSticker(): boolean {
        return this.edition !== undefined;
    }

    hasEdition(edition: EditionItem): boolean {
        return this.edition !== undefined && this.edition.eq(edition);
    }

    equals(item: ItemImpl): boolean {
        // if (item instanceof EditionItem && this.edition) {
        //     return item.eq(this.item) &&
        //         item.edition !== undefined &&
        //         this.edition.eq(item.edition()!);
        // }
        // return item.eq(this.item);
        return true;
    }

    getItem(): ItemImpl {
        return this.item;
    }

    getEdition(): ItemImpl | undefined {
        return this.edition;
    }
}