import { Card } from "./enum/cards/Card";
// import { Edition } from "./enum/Edition";
import { PackKind } from "./enum/packs/PackKind";
import { JokerData } from "./struct/JokerData";
import {MiscCardSource} from "../ImmolateWrapper";
import {BossBlind} from "./enum/BossBlind.ts";

export interface IResult {
	ante: number;
	voucher: string;
	shop: (Card | JokerData)[];
	packs: {
		kind: PackKind;
		cards: (Card | JokerData)[];
	}[];
	tags?: string[];
	boss?: BossBlind
	miscQueues?: MiscCardSource[];
}

export class Result {
	currentAnte: number;
	private result: IResult[] = [];

	constructor() {
		this.currentAnte = 1
	}

	set setCurrentAnte(ante: number) {
		if (ante < 1) {
			throw new Error("Ante must be at least 1");
		}
		this.currentAnte = ante;
	}

	get ante(): number {
		return this.currentAnte;
	}

	get getResult(): IResult[] {
		return this.result;
	}

	addVoucher(voucher: string) {
		this.result[this.currentAnte - 1] = {
			...this.result[this.currentAnte - 1],
			voucher: voucher,
			ante: this.currentAnte,
		}
	}

	addItemToShopQueue(item:Card | JokerData) {
		if (!this.result[this.currentAnte - 1]?.shop) {
			this.result[this.currentAnte - 1] = {
				...this.result[this.currentAnte - 1],
				shop: [],
			};
		}
		this.result[this.currentAnte - 1].shop.push(item);
	}
	addBoss(boss: BossBlind) {
		if (!this.result[this.currentAnte - 1]?.boss) {
			this.result[this.currentAnte - 1] = {
				...this.result[this.currentAnte - 1],
				boss: boss,
			};
		}
	}
	addTag(tag: string) {
		if (!this.result[this.currentAnte - 1]?.tags) {
			this.result[this.currentAnte - 1] = {
				...this.result[this.currentAnte - 1],
				tags: [],
			};
		}
		if (!this.result[this.currentAnte - 1].tags!.includes(tag)) {
			this.result[this.currentAnte - 1].tags!.push(tag);
		}
	}
	addPackToQueue(kind: PackKind, cards: (Card | JokerData)[]) {
		if (!this.result[this.currentAnte - 1]?.packs) {
			this.result[this.currentAnte - 1] = {
				...this.result[this.currentAnte - 1],
				packs: [],
			};
		}
		this.result[this.currentAnte - 1].packs.push({
			kind,
			cards,
		});
	}
	addMiscCardSourcesToQueue(miscSources:MiscCardSource[]) {
		if(!this.result[this.currentAnte - 1]?.miscQueues) {
			this.result[this.currentAnte - 1] = {
				...this.result[this.currentAnte - 1],
				miscQueues: miscSources,
			};
		}else{
			this.result[this.currentAnte - 1].miscQueues!.push(...miscSources);
		}
	}

}