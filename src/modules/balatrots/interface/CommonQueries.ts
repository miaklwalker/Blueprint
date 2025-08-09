import { BossBlindEnum } from '../enum/BossBlind';
import { LegendaryJoker } from '../enum/cards/LegendaryJoker';
import { PackType } from '../enum/packs/PackType';
import { Voucher } from '../enum/Voucher';
import { Item } from './Item';

export interface CommonQueries {
    hasBoss(boss: BossBlindEnum): boolean;
    hasInPack(item: Item): boolean;
    hasInShop(item: Item, index?: number): boolean;
    countLegendary(): number;
    countInPack(item: Item): number;
    hasLegendary(...jokers: LegendaryJoker[]): boolean;
    hasPack(packType: PackType): boolean;
    hasInBuffonPack(item: Item): boolean;
    hasInSpectral(item: Item): boolean;
    hasVoucher(voucher: Voucher): boolean;
}