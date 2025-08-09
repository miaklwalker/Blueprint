import { BossBlind } from "../enum/BossBlind";
import { PlanetItem } from "../enum/cards/Planet";
import { Tarot } from "../enum/cards/Tarot";
import { TagItem } from "../enum/Tag";
import { VoucherItem } from "../enum/Voucher";
import { PackInfo } from "../struct/PackInfo";
import { ShopQueue } from "../struct/ShopQueue";
import { CommonQueries } from "./CommonQueries";
import { JokerImpl } from "./Joker";

export interface Ante extends CommonQueries {
    getAnte(): number;
    getShopQueue(): ShopQueue;
    getTags(): Set<TagItem>;
    getVoucher(): VoucherItem;
    getBoss(): BossBlind;
    getPacks(): PackInfo[];
    getLegendaryJokers(): Set<string>;
    getScore(): number;
    getBufferedJokerCount(): number;
    getJokers(): Set<JokerImpl>;
    getRareJokers(): Set<JokerImpl>;
    getUncommonJokers(): Set<JokerImpl>;
    getNegativeJokerCount(): number;
    getTarots(): Set<Tarot>;
    getPlanets(): Set<PlanetItem>;
    getStandardPackCount(): number;
    getJokerPackCount(): number;
    getSpectralPackCount(): number;
    getTarotPackCount(): number;
    getPlanetPackCount(): number;
}

