import DoubleLong from "../helpers/DoubleLong";

const MAX_UINT64 = 18446744073709551615n;
const MASK_64 = 0xFFFFFFFFFFFFFFFFn; // 64-bit mask

export class LuaRandom {
    seed: number;
    state: bigint[];

    constructor(seed: number = 0.0) {
        this.state = [0n, 0n, 0n, 0n];
        this.seed = seed;

        let d = seed;
        let r = BigInt("0x11090601");

        for (let i = 0; i < 4; i++) {
            const m = 1n << (r & 255n);
            r >>= 8n;
            d = d * Math.PI + Math.E;

            const u = new DoubleLong(d);
            u.dbl = d;
            if (u.ulong < m) u.ulong += m;
            // console.log(u.ulong);
            this.state[i] = u.ulong;
        }
        for (let i = 0; i < 10; i++) {
            this._randint();
        }
    }

    _randint() {
        let z = 0n;
        let r = 0n;

        // State 0
        z = this.state[0];
        // debugBitOperation(z);
        z = BigInt.asUintN(64, (((((z << 31n & MASK_64) ^ z) >> 45n & MASK_64) ^ ((z & (MAX_UINT64 << 1n & MASK_64)) << 18n & MASK_64)) & MASK_64));
        // console.log('z', z);
        r ^= z;
        // console.log('r ^= z', r);
        this.state[0] = z;

        // State 1
        z = this.state[1];
        z = (((z << 19n & MASK_64) ^ z) >> 30n & MASK_64) ^ ((z & (MAX_UINT64 << 6n & MASK_64)) << 28n & MASK_64) & MASK_64;
        r ^= z;
        this.state[1] = z;

        // State 2
        z = this.state[2];
        z = (((z << 24n & MASK_64) ^ z) >> 48n & MASK_64) ^ ((z & (MAX_UINT64 << 9n & MASK_64)) << 7n & MASK_64) & MASK_64;
        r ^= z;
        this.state[2] = z;

        // State 3
        z = this.state[3];
        z = (((z << 21n & MASK_64) ^ z) >> 39n & MASK_64) ^ ((z & (MAX_UINT64 << 17n & MASK_64)) << 8n & MASK_64) & MASK_64;
        r ^= z;
        this.state[3] = z;

        return r;
    }

    randdblmem() {
        const mask = 4503599627370495n;
        const base = 4607182418800017408n;
        return (this._randint() & mask) | base;
    }

    random() {
        const u = new DoubleLong();
        u.ulong = this.randdblmem();
        return u.dbl - 1.0;
    }

    randint(min:number,  max:number) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

}

function fract(n: number) {
    return n % 1;
}

export function pseudohash(s: string) {
    let num = 1;
    for (let i = s.length; i > 0; i--) {
        const charCode = s.charCodeAt(i - 1);
        num = fract(1.1239285023 / num * charCode * Math.PI + Math.PI * i);
    }
    return isNaN(num) ? NaN : num;
}

const inv_prec = Math.pow(10, 13);
const two_inv_prec = Math.pow(2, 13);
const five_inv_prec = Math.pow(5, 13);

function nextAfter(x: number, direction: number): number {
    const epsilon = Number.EPSILON;
    return direction > x ? x + epsilon : x - epsilon;
}

export function round13(x: number) {
    const tentative = Math.floor(x * inv_prec) / inv_prec;
    const truncated = (x * two_inv_prec % 1) * five_inv_prec;

    if (
        tentative !== x &&
        tentative !== nextAfter(x, 1) &&
        truncated % 1 >= 0.5
    ) {
        return (Math.floor(x * inv_prec) + 1) / inv_prec;
    }
    return tentative;
}

export function debugBitOperation(z: bigint) {
    const step1 = (z << 31n & MASK_64) ^ z;
    const step2 = step1 >> 45n & MASK_64;
    const step3 = z & (MAX_UINT64 << 1n & MASK_64);
    const step4 = step3 << 18n & MASK_64;
    const final = step2 ^ step4;

    // console.log({
    //     original: z.toString(16),
    //     step1: step1.toString(16),
    //     step2: step2.toString(16),
    //     step3: step3.toString(16),
    //     step4: step4.toString(16),
    //     final: final.toString(16)
    // });

    return final;
}
