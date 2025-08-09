import { Filter } from "./Filter";
import { Item } from "./Item";
import { JokerType } from "../enum/JokerType";

export interface Joker extends Item {
    // Method overload signatures
    inBuffonPack(): Filter;
    inBuffonPack(ante: number): Filter;
    getType(): JokerType;
    isRare(): boolean;
    isCommon(): boolean;
    isUncommon(): boolean;
    isLegendary(): boolean;
}

export class JokerImpl implements Joker {
    name: string;
    constructor(private type: JokerType, name: string) {
        this.name = name;
    }

    getType(): JokerType {
        return this.type;
    }

    // Implementation of overloaded method
    inBuffonPack(ante?: number): Filter {
        // Implement your logic here
        return {} as Filter; // Replace with actual implementation
    }

    isRare(): boolean {
        return this.type === JokerType.RARE;
    }

    isCommon(): boolean {
        return this.type === JokerType.COMMON;
    }

    isUncommon(): boolean {
        return this.type === JokerType.UNCOMMON;
    }

    isLegendary(): boolean {
        return this.type === JokerType.LEGENDARY;
    }

    // Implementation of Item interface methods
    getName(): string {
        return this.name;
    }

    eq(item: Item): boolean {
        return this.getName() === item.getName();
    }

    equals(value: string): boolean {
        return this.getName() === value;
    }

    inPack(ante?: number): Filter {
        // Implement your logic here
        return {} as Filter; // Replace with actual implementation
    }

    inShop(ante?: number): Filter {
        // Implement your logic here
        return {} as Filter; // Replace with actual implementation
    }

    inSpectral(ante?: number): Filter {
        // Implement your logic here
        return {} as Filter; // Replace with actual implementation
    }

    edition() {
        // Implement your logic here
        return {} as any; // Replace with actual implementation
    }

}