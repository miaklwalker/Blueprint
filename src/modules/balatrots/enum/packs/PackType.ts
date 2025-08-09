import { ItemImpl } from "../../interface/Item";
import { PackKind } from "./PackKind";

export enum PackType {
    RETRY = "RETRY",
    ARCANA_PACK = "Arcana Pack",
    JUMBO_ARCANA_PACK = "Jumbo Arcana Pack",
    MEGA_ARCANA_PACK = "Mega Arcana Pack",
    CELESTIAL_PACK = "Celestial Pack",
    JUMBO_CELESTIAL_PACK = "Jumbo Celestial Pack",
    MEGA_CELESTIAL_PACK = "Mega Celestial Pack",
    STANDARD_PACK = "Standard Pack",
    JUMBO_STANDARD_PACK = "Jumbo Standard Pack",
    MEGA_STANDARD_PACK = "Mega Standard Pack",
    BUFFOON_PACK = "Buffoon Pack",
    JUMBO_BUFFOON_PACK = "Jumbo Buffoon Pack",
    MEGA_BUFFOON_PACK = "Mega Buffoon Pack",
    SPECTRAL_PACK = "Spectral Pack",
    JUMBO_SPECTRAL_PACK = "Jumbo Spectral Pack",
    MEGA_SPECTRAL_PACK = "Mega Spectral Pack"
}

export class PackTypeItem extends ItemImpl {
    public static readonly VALUES: Record<PackType, number> = {
        [PackType.RETRY]: 22.42,
        [PackType.ARCANA_PACK]: 4,
        [PackType.JUMBO_ARCANA_PACK]: 2,
        [PackType.MEGA_ARCANA_PACK]: 0.5,
        [PackType.CELESTIAL_PACK]: 4,
        [PackType.JUMBO_CELESTIAL_PACK]: 2,
        [PackType.MEGA_CELESTIAL_PACK]: 0.5,
        [PackType.STANDARD_PACK]: 4,
        [PackType.JUMBO_STANDARD_PACK]: 2,
        [PackType.MEGA_STANDARD_PACK]: 0.5,
        [PackType.BUFFOON_PACK]: 1.2,
        [PackType.JUMBO_BUFFOON_PACK]: 0.6,
        [PackType.MEGA_BUFFOON_PACK]: 0.15,
        [PackType.SPECTRAL_PACK]: 0.6,
        [PackType.JUMBO_SPECTRAL_PACK]: 0.3,
        [PackType.MEGA_SPECTRAL_PACK]: 0.07
    };
    constructor(
        readonly name: PackType,
        readonly value: number
    ) {
        super(name);
        this.value = value;
    }

    getName() {
        return this.name;
    }

    getValue(): number {
        return this.value;
    }

    getKind() {
        if (this.isArcana()) return PackKind.ARCANA;
        if (this.isCelestial()) return PackKind.CELESTIAL;
        if (this.isStandard()) return PackKind.STANDARD;
        if (this.isBuffoon()) return PackKind.BUFFOON;
        if (this.isSpectral()) return PackKind.SPECTRAL;

        throw new Error(`Invalid pack type: ${this.name}`);
    }

    isMega(): boolean {
        return this.name.includes("Mega");
    }

    isJumbo(): boolean {
        return this.name.includes("Jumbo");
    }

    isStandard(): boolean {
        return this.name.includes("Standard");
    }

    isCelestial(): boolean {
        return this.name.includes("Celestial");
    }

    isArcana(): boolean {
        return this.name.includes("Arcana");
    }

    isBuffoon(): boolean {
        return this.name.includes("Buffoon");
    }

    isSpectral(): boolean {
        return this.name.includes("Spectral");
    }

    getPacks() {
        return PackTypeItem.VALUES;
    }

}

