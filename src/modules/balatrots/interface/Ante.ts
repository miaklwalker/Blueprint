import type { BossBlind } from "../enum/BossBlind";
import type { PlanetItem } from "../enum/cards/Planet";
import type { Tarot } from "../enum/cards/Tarot";
import type { TagItem } from "../enum/Tag";
import type { VoucherItem } from "../enum/Voucher";
import type { PackInfo } from "../struct/PackInfo";
import type { CommonQueries } from "./CommonQueries";
import type { JokerImpl } from "./Joker";

export interface Ante extends CommonQueries {
    getAnte: () => number;
    getTags: () => Set<TagItem>;
    getVoucher: () => VoucherItem;
    getBoss: () => BossBlind;
    getPacks: () => Array<PackInfo>;
    getLegendaryJokers: () => Set<string>;
    getScore: () => number;
    getBufferedJokerCount: () => number;
    getJokers: () => Set<JokerImpl>;
    getRareJokers: () => Set<JokerImpl>;
    getUncommonJokers: () => Set<JokerImpl>;
    getNegativeJokerCount: () => number;
    getTarots: () => Set<Tarot>;
    getPlanets: () => Set<PlanetItem>;
    getStandardPackCount: () => number;
    getJokerPackCount: () => number;
    getSpectralPackCount: () => number;
    getTarotPackCount: () => number;
    getPlanetPackCount: () => number;
}

