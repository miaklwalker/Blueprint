import {useCallback, useEffect, useMemo, useRef} from "react";
import {
    determineItemType, getModifierColor,
    maskToCanvas,
    parseCardItem,
    parseStandardCardName,
    renderStandardCard
} from "../../modules/utils.js";
import {Anchor, Badge, Box, Button, Center, Flex, Group, HoverCard, Indicator, Paper, Stack, Text} from "@mantine/core";
import {useBlueprintStore} from "../../modules/store.js";
import {PurchaseItemWrapper} from "../purchaseItemWrapper/index.jsx";





export function RenderCardWithCanvas({width, height, value, meta, searched}) {
    const renderCanvas = useRef(null);
    const {cardName, itemModifiers, itemStickers, itemSeals, baseCardName} = parseCardItem(value);
    const itemType = determineItemType(cardName);

    useEffect(() => {
        let canvas = renderCanvas?.current
        if (canvas !== null) {
            if (itemType !== 'unknown') {
                maskToCanvas(canvas, cardName, itemType, itemModifiers, itemStickers);
            } else {
                const {rank, suit, modifiers, seal} = parseStandardCardName(cardName);
                renderStandardCard(canvas, rank, suit, modifiers, seal)
            }
            canvas.width = width;
            canvas.height = height;
        }
    }, [value])

    return (
        <Paper>
            <PurchaseItemWrapper
                showWikiLink
                meta={{
                    ...meta,
                    cardName,
                    itemType,
                    itemSeals,
                    baseCardName
                }}

            >
                <canvas
                    style={
                        {
                            width: width,
                            height: height,
                            boxShadow: searched ? '0px 0px 8px 8px rgba(255, 255, 255, .65)' : ''
                        }
                    }
                    ref={renderCanvas}
                />
            </PurchaseItemWrapper>
        </Paper>
    )
}