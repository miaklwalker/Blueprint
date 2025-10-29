import {boosterPacks, bosses, tags, vouchers} from "../../modules/const.ts";
import {Layer} from "../../modules/classes/Layer.ts";
import {Box} from "@mantine/core";
import {RenderImagesWithCanvas} from "./canvasRenderer.tsx";

export function Voucher({voucherName}: { voucherName: string | null }) {
    let layers = [];
    const voucherData = vouchers.find((voucher: any) => voucher.name === voucherName);
    if (voucherData) layers.push(new Layer({
        ...voucherData,
        source: 'images/Vouchers.png',
        order: 0,
        columns: 9,
        rows: 4
    }));
    return (
        <Box maw={'80px'}>
            <RenderImagesWithCanvas
                layers={layers}
                spacing
            />
        </Box>

    )
}


export function BoosterPack({packName}: { packName: string | null }) {
    let layers = [];
    const packData = boosterPacks.find((booster: any) => booster.name === packName);
    if (packData) layers.push(new Layer({
        ...packData,
        source: 'images/Boosters.png',
        order: 0,
        columns: 4,
        rows: 9
    }));
    return (
        <Box maw={'80px'}>
            <RenderImagesWithCanvas
                layers={layers}
            />
        </Box>

    )
}

export function Tag({tagName}: { tagName: string }) {
    const tagData = tags.find((tag: { name: string }) => tag.name === tagName);
    if (!tagData) {
        console.error("Tag not found:", tagName);
        return;
    }
    const layers = [
        new Layer({
            ...tagData,
            order: 0,
            source: 'images/tags.png',
            rows: 5,
            columns: 6
        })
    ];
    return (
        <Box h={32} w={32}>
            <RenderImagesWithCanvas
                layers={layers}
            />
        </Box>

    )

}

export function Boss({bossName}: { bossName: string }) {
    const bossData = bosses.find((boss: { name: string }) => boss.name === bossName);
    if (!bossData) {
        console.error("Boss not found:", bossName);
        return;
    }

    const layers = [
        new Layer({
            ...bossData,
            order: 0,
            source: 'images/BlindChips.png',
            rows: 31,
            columns: 21
        })
    ];

    return (
        <Box h={32} w={32}>
            <RenderImagesWithCanvas
                layers={layers}
            />
        </Box>
    )

}
