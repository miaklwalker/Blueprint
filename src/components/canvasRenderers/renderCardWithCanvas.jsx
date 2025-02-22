import {useEffect, useRef} from "react";
import {
    determineItemType, getModifierColor,
    maskToCanvas,
    parseCardItem,
    parseStandardCardName,
    renderStandardCard
} from "../../modules/utils.js";
import {Anchor, Badge, Box, Center, Flex, Group, HoverCard, Paper, Stack, Text} from "@mantine/core";

export function RenderCardWithCanvas({width, height, value, selected, searched}) {
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
            <HoverCard position={'top'}>
                <HoverCard.Target>
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
                                        <Badge autoContrast autoCapitalize color={color} key={index}>{modifier}</Badge>
                                    )
                                })
                            }
                            {
                                itemStickers &&
                                itemStickers.map((sticker, index) => {
                                    let color = getModifierColor(sticker)
                                    return (
                                        <Badge autoContrast autoCapitalize color={color} key={index}>{sticker}</Badge>
                                    )
                                })
                            }
                            {
                                itemSeals &&
                                itemSeals.map((seal, index) => {
                                    let color = getModifierColor(seal)
                                    return (
                                        <Badge autoContrast autoCapitalize color={color} key={index}>{seal}</Badge>
                                    )
                                })
                            }
                        </Group>
                        <Anchor href={`https://balatrogame.fandom.com/wiki/${cardName}`} target={'_blank'}> Balatro
                            Fandom Link </Anchor>
                    </Box>
                </HoverCard.Dropdown>
            </HoverCard>
        </Paper>
    )
}