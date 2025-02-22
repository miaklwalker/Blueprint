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


export function RenderCardWithCanvas({width, height, value, meta, searched}) {
    const renderCanvas = useRef(null);
    const {cardName, itemModifiers, itemStickers, itemSeals, baseCardName} = parseCardItem(value);
    const itemType = determineItemType(cardName);
    const buyCard = useBlueprintStore(state => state.buyCard);
    const removeCard = useBlueprintStore(state => state.removeCard)
    const isOwned = useBlueprintStore(state => state.owned);
    const buys = useBlueprintStore(state => state.buys);
    const owned = useMemo(() => isOwned({...meta, cardName}, buys), [meta, cardName, isOwned, buys])


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

    const handleBuy = useCallback(() => {
        !owned ?
            buyCard({...meta, cardName}) :
            removeCard({...meta, cardName});
    }, [meta, cardName, owned]);

    return (
        <Paper>
            <HoverCard position={'top'}>
                <HoverCard.Target>
                    <Indicator color={'green'} disabled={!owned}>
                        <Center>
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
                        </Center>
                    </Indicator>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Box p={'.5rem'}>
                        <Group align={'flex-start'}>
                            <Text fz={'small'} ta={'start'} mb={'sm'}>{baseCardName}</Text>
                            {
                                itemModifiers &&
                                itemModifiers.map((modifier, index) => {
                                    let color = getModifierColor(modifier)
                                    return (
                                        <Badge autoContrast color={color} key={index}>{modifier}</Badge>
                                    )
                                })
                            }
                            {
                                itemStickers &&
                                itemStickers.map((sticker, index) => {
                                    let color = getModifierColor(sticker)
                                    return (
                                        <Badge autoContrast color={color} key={index}>{sticker}</Badge>
                                    )
                                })
                            }
                            {
                                itemSeals &&
                                itemSeals.map((seal, index) => {
                                    let color = getModifierColor(seal)
                                    return (
                                        <Badge autoContrast color={color} key={index}>{seal}</Badge>
                                    )
                                })
                            }
                        </Group>
                        <Stack>
                            <Anchor href={`https://balatrogame.fandom.com/wiki/${baseCardName}`} target={'_blank'}>
                                Balatro Fandom Link
                            </Anchor>
                            <Button onClick={handleBuy} color={owned ? 'red' : 'blue'}> {!owned ? "Buy Card" : "Undo"} </Button>
                        </Stack>

                    </Box>
                </HoverCard.Dropdown>
            </HoverCard>
        </Paper>
    )
}