import {useBlueprintStore} from "../../modules/store.js";
import {useCallback, useMemo} from "react";
import {Anchor, Badge, Box, Button, Center, Group, HoverCard, Indicator, Stack, Text} from "@mantine/core";
import {getModifierColor} from "../../modules/utils.js";

export function PurchaseItemWrapper({ showWikiLink,wikiLink, children, position='top', meta }){
    const buys = useBlueprintStore(state => state.buys)
    const buyCard = useBlueprintStore(state => state.buyCard);
    const removeCard = useBlueprintStore(state => state.removeCard);
    const isOwned = useBlueprintStore(state => state.owned);
    const owned = useMemo(() => isOwned({...meta}), [meta, isOwned,buys])
    const handleBuy = useCallback(() => {
        // use the purchased joker info to generate the card after analyze changes
        // reset needs to remove buys and sells
        !owned ?
            buyCard({...meta}) :
            removeCard({...meta});
    }, [meta, owned]);
    return (
        <HoverCard openDelay={300} position={position}>
            <HoverCard.Target>
                <Indicator color={'green'} disabled={!owned}>
                    <Center>
                        {children}
                    </Center>
                </Indicator>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Box p={'.5rem'}>
                    <Group align={'flex-start'}>
                        <Text fz={'small'} ta={'start'} mb={'sm'}>{meta?.baseCardName || meta?.cardName}</Text>
                        {
                            meta?.itemModifiers &&
                            meta?.itemModifiers.map((modifier, index) => {
                                let color = getModifierColor(modifier)
                                return (
                                    <Badge autoContrast color={color} key={index}>{modifier}</Badge>
                                )
                            })
                        }
                        {
                            meta?.itemStickers &&
                            meta?.itemStickers.map((sticker, index) => {
                                let color = getModifierColor(sticker)
                                return (
                                    <Badge autoContrast color={color} key={index}>{sticker}</Badge>
                                )
                            })
                        }
                        {
                            meta?.itemSeals &&
                            meta?.itemSeals.map((seal, index) => {
                                let color = getModifierColor(seal)
                                return (
                                    <Badge autoContrast color={color} key={index}>{seal}</Badge>
                                )
                            })
                        }
                    </Group>
                    <Stack>
                        {
                            showWikiLink &&
                            <Anchor href={wikiLink || `https://balatrogame.fandom.com/wiki/${meta.baseCardName || meta.cardName}`} target={'_blank'}>
                                Balatro Fandom Link
                            </Anchor>
                        }
                        <Button onClick={handleBuy} color={owned ? 'red' : 'blue'}> {!owned ? `Buy ${meta.type || 'Card'}` : "Undo"} </Button>
                    </Stack>
                </Box>
            </HoverCard.Dropdown>
        </HoverCard>
    )

}
