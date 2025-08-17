import { Edition, EditionItem } from "../enum/Edition";
import { Filter } from "./Filter";

export interface Item {
    name: string;
    getName(): string;

    eq(item: Item): boolean;

    equals(value: string): boolean;

    inPack(ante?: number): Filter;

    inShop(ante?: number): Filter;

    inSpectral(ante?: number): Filter;

    edition(edition: Edition): any;
}

export class ItemImpl implements Item {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    eq(item: Item): boolean {
        return this.getName() === item.getName();
    }

    equals(value: string): boolean {
        return this.getName() === value;
    }

    inPack(_ante?: number): Filter {
        // Implement your logic here
        return {} as Filter; // Replace with actual implementation
    }

    inShop(_ante?: number): Filter {
        // Implement your logic here
        return {} as Filter; // Replace with actual implementation
    }

    inSpectral(_ante?: number): Filter {
        // Implement your logic here
        return {} as Filter; // Replace with actual implementation
    }

    edition(edition: Edition): EditionItem {
        // Implement your logic here
        return new EditionItem(edition);
    }
}