import { ItemImpl } from "./interface/Item";
import { JokerImpl } from "./interface/Joker";

type lockeable = string | ItemImpl | string[] | JokerImpl;

interface ILock {
    lock(item: lockeable): void;
    firstLock(): void;
    unlock(item: lockeable): void;
    isLocked(item: lockeable): boolean;
    initLocks(ante: number, freshProfile: boolean, freshRun: boolean): void;
    initUnlocks(ante: number, freshProfile: boolean): void;
}

export class Lock implements ILock {
    private locked: Set<string> = new Set();
    private purchased: Set<string> = new Set();
    static firstLock = new Set(["Overstock Plus", "Liquidation", "Glow Up", "Reroll Glut", "Omen Globe", "Observatory", "Nacho Tong", "Recyclomancy", "Tarot Tycoon", "Planet Tycoon", "Money Tree", "Antimatter", "Illusion", "Petroglyph", "Retcon", "Palette"]);
    static ante2Lock = new Set(["The Mouth", "The Fish", "The Wall", "The House", "The Mark", "The Wheel", "The Arm", "The Water", "The Needle", "The Flint", "Negative Tag", "Standard Tag", "Meteor Tag", "Buffoon Tag", "Handy Tag", "Garbage Tag", "Ethereal Tag", "Top-up Tag", "Orbital Tag"]);


    lock(item: lockeable) {
        if (typeof item === 'string') {
            this.locked.add(item);
        } else if (Array.isArray(item)) {
            item.forEach(item => this.locked.add(item));
        } else if (item instanceof ItemImpl || item instanceof JokerImpl) {
            this.locked.add(item.getName());
        } else {
            throw new Error("Invalid argument type");
        }
    }

    lockPurchased(item: lockeable) {
        if (typeof item === 'string') {
            this.purchased.add(item);
        } else if (Array.isArray(item)) {
            item.forEach(item => this.purchased.add(item));
        } else if (item instanceof ItemImpl || item instanceof JokerImpl) {
            this.purchased.add(item.getName());
        } else {
            throw new Error("Invalid argument type");
        }
    }

    firstLock(): void {
        this.lock(Array.from(Lock.firstLock));
    }


    unlock(collection: lockeable) {
        if (typeof collection === 'string') {
            this.locked.delete(collection);
        } else if (Array.isArray(collection)) {
            collection.forEach(item => this.locked.delete(item));
        } else if (collection instanceof ItemImpl || collection instanceof JokerImpl) {
            this.locked.delete(collection.getName());
        } else {
            throw new Error("Invalid argument type");
        }
    }

    unlockPurchased(collection: lockeable) {
        if (typeof collection === 'string') {
            this.purchased.delete(collection);
        } else if (Array.isArray(collection)) {
            collection.forEach(item => this.purchased.delete(item));
        } else if (collection instanceof ItemImpl || collection instanceof JokerImpl) {
            this.purchased.delete(collection.getName());
        } else {
            throw new Error("Invalid argument type");
        }
    }

    isLocked(item: lockeable): boolean {
        if (typeof item === 'string') {
            return this.locked.has(item);
        } else if (item instanceof ItemImpl || item instanceof JokerImpl) {
            return this.locked.has(item.getName());
        } else {
            throw new Error("Invalid argument type");
        }
    }

    isPurchased(item: lockeable): boolean {
        if (typeof item === 'string') {
            return this.purchased.has(item);
        } else if (item instanceof ItemImpl || item instanceof JokerImpl) {
            return this.purchased.has(item.getName());
        } else {
            throw new Error("Invalid argument type");
        }
    }

    initLocks(ante: number, freshProfile: boolean, freshRun: boolean): void {
        if (ante < 2) this.lock(Array.from(Lock.ante2Lock));
        if (ante < 3) this.lock(["The Tooth", "The Eye"]);
        if (ante < 4) this.lock("The Plant");
        if (ante < 5) this.lock("The Serpent");
        if (ante < 6) this.lock("The Ox");

        if (freshProfile) {
            this.lock([
                // First set
                "Negative Tag", "Foil Tag", "Holographic Tag", "Polychrome Tag",
                "Rare Tag",
                "Golden Ticket", "Mr. Bones", "Acrobat",
                "Sock and Buskin", "Swashbuckler", "Troubadour", "Certificate",
                "Smeared Joker", "Throwback", "Hanging Chad", "Rough Gem",
                "Bloodstone", "Arrowhead", "Onyx Agate", "Glass Joker",
                "Showman", "Flower Pot", "Blueprint", "Wee Joker",
                "Merry Andy", "Oops! All 6s", "The Idol",
                // Second set
                "Seeing Double", "Matador", "Hit the Road", "The Duo",
                "The Trio", "The Family", "The Order", "The Tribe",
                "Stuntman", "Invisible Joker", "Brainstorm", "Satellite",
                "Shoot the Moon", "Driver's License", "Cartomancer",
                "Astronomer", "Burnt Joker", "Bootstraps",
                "Overstock Plus", "Liquidation", "Glow Up", "Reroll Glut",
                "Omen Globe",
                // Third set
                "Observatory", "Nacho Tong", "Recyclomancy", "Tarot Tycoon",
                "Planet Tycoon", "Money Tree", "Antimatter", "Illusion",
                "Petroglyph", "Retcon", "Palette"
            ])
        }

        if (freshRun) {
            this.lock([
                "Planet X", "Ceres", "Eris", "Five of a Kind", "Flush House", "Flush Five",
                "Stone Joker", "Steel Joker", "Glass Joker", "Golden Ticket", "Lucky Cat",
                "Cavendish", "Overstock Plus", "Liquidation", "Glow Up", "Reroll Glut", "Omen Globe", "Observatory",
                "Nacho Tong", "Recyclomancy", "Tarot Tycoon", "Planet Tycoon", "Money Tree", "Antimatter",
                "Illusion", "Petroglyph", "Retcon", "Palette"
            ]);
        }
    }

    initUnlocks(ante: number, freshProfile: boolean): void {
        if (ante == 2) {
            this.unlock(["The Mouth", "The Fish", "The Wall", "The House", "The Mark", "The Wheel", "The Arm", "The Water", "The Needle", "The Flint"]);
            this.unlock(["Standard Tag", "Meteor Tag", "Buffoon Tag", "Handy Tag", "Garbage Tag", "Ethereal Tag", "Top-up Tag", "Orbital Tag"]);
            if (!freshProfile) this.unlock("Negative Tag");
        }

        if (ante == 3) {
            this.unlock("The Tooth");
            this.unlock("The Eye");
        }
        if (ante == 4) this.unlock("The Plant");
        if (ante == 5) this.unlock("The Serpent");
        if (ante == 6) this.unlock("The Ox");
    }
}