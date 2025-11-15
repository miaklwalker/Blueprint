import {
    Joker_Final,
    Pack,
    Planet_Final,
    SeedResultsContainer,
    Spectral_Final,
    StandardCard_Final,
    Tarot_Final
} from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {
    Affix,
    Box,
    Button,
    Container,
    Divider,
    Group,
    Paper,
    Skeleton,
    Stack,
    Text,
    Title,
    Tooltip
} from "@mantine/core";
import {
    bosses,
    consumablesFaces,
    editionMap,
    jokerFaces,
    jokers,
    stickerMap,
    tags,
    tarotsAndPlanets,
    vouchers
} from "../../../modules/const.ts";
import {Layer} from "../../../modules/classes/Layer.ts";
import {SimpleRenderCanvas} from "../../Rendering/canvasRenderer.tsx";
import {getEnhancerPosition, getSealPosition, getStandardCardPosition} from "../../../modules/utils.ts";
import React, {useEffect, useRef, useState} from "react";
import {DragScroll} from "../../DragScroller.tsx";
import {useDebouncedCallback, useIntersection} from "@mantine/hooks";
import {SimpleBuyerWrapper} from "./simpleBuyWrapper.tsx";
import {useCardStore} from "../../../modules/state/store.ts";
import {IconLockOpen} from "@tabler/icons-react";


function SimpleJokerCard({card, index}: { card: Joker_Final, index?: number }) {
    let layers = [];
    const jokerData = jokers.find((joker: any) => joker.name === card.name);
    if (jokerData) layers.push(new Layer({...jokerData, source: 'images/Jokers.png', order: 0, columns: 10, rows: 16}));
    const face = jokerFaces.find((joker: any) => joker.name === card.name);
    if (face) layers.push(new Layer({...face, source: 'images/Jokers.png', order: 1, columns: 10, rows: 16}));
    if (card.edition) {
        const index = editionMap[card.edition];
        layers.push(new Layer({
            pos: {x: index, y: 0},
            name: card.edition,
            order: 2,
            source: 'images/Editions.png',
            rows: 1,
            columns: 5
        }));
    }
    if (card.isEternal) {
        layers.push(new Layer({
            pos: stickerMap['Eternal'],
            name: 'Eternal',
            order: 3,
            source: 'images/stickers.png',
            rows: 3,
            columns: 5
        }));
    }
    if (card.isPerishable) {
        layers.push(new Layer({
            pos: stickerMap['Perishable'],
            name: 'Perishable',
            order: 4,
            source: 'images/stickers.png',
            rows: 3,
            columns: 5
        }));
    }
    if (card.isRental) {
        layers.push(new Layer({
            pos: stickerMap['Rental'],
            name: 'Rental',
            order: 5,
            source: 'images/stickers.png',
            rows: 3,
            columns: 5
        }));
    }
    const position = index || ""
    return (
        <Tooltip label={position + " " + card.name}>
            <Box>
                <SimpleRenderCanvas
                    invert={card.edition === "Negative"}
                    layers={layers}
                />
            </Box>
        </Tooltip>

    )
}

function SimplePlayingCard({card, index}: { card: StandardCard_Final, index?: number }) {
    if (!card?.rank || !card?.suit) return null;
    const position = getStandardCardPosition(card.rank, card.suit);
    //getEnhancerPosition
    const background = getEnhancerPosition([card?.enhancements ?? '']);
    let layers = [
        new Layer({
            pos: background,
            name: 'background',
            order: 0,
            source: 'images/Enhancers.png',
            rows: 5,
            columns: 7
        }),
        new Layer({
            pos: position,
            name: card.name,
            order: 1,
            source: 'images/8BitDeck.png',
            rows: 4,
            columns: 13
        })
    ]
    if (card.edition) {
        const index = editionMap[card.edition];
        layers.push(new Layer({
            pos: {x: index, y: 0},
            name: card.edition,
            order: 2,
            source: 'images/Editions.png',
            rows: 1,
            columns: 5
        }));
    }
    if (card.seal) {
        layers.push(new Layer({
            pos: getSealPosition(card.seal),
            name: card.seal,
            order: 3,
            source: 'images/Enhancers.png',
            rows: 5,
            columns: 7
        }));
    }
    const positionText = index ? `${index} ` : '';
    return (
        <Tooltip label={positionText + card.name}>
            <SimpleRenderCanvas
                layers={layers}
            />
        </Tooltip>
    )
}

function SimpleConsumables({card, index}: { card: Planet_Final | Spectral_Final | Tarot_Final, index?: number }) {
    let layers = [
        new Layer({
            ...tarotsAndPlanets.find((t: any) => t.name === card.name),
            order: 0,
            source: 'images/Tarots.png',
            rows: 6,
            columns: 10
        })
    ]
    let consumablesFace = consumablesFaces.find((t: any) => t.name === card.name);
    if (consumablesFace) {
        layers.push(new Layer({
            ...consumablesFace,
            order: 1,
            source: 'images/Enhancers.png',
            rows: 5,
            columns: 7
        }))

    }
    const positionText = index ? `${index} ` : '';
    return (
        <Tooltip label={positionText + card.name}>
            <Box>
                <SimpleRenderCanvas
                    invert={card?.edition === "Negative"}
                    layers={layers}
                />
            </Box>
        </Tooltip>
    )
}

interface GameCardProps {
    card: Planet_Final | Spectral_Final | Tarot_Final | Joker_Final | StandardCard_Final
    index?: number
}

function GameCard({card, index}: GameCardProps) {
    let Card = () => {
        if (card instanceof StandardCard_Final) {
            return <SimplePlayingCard index={index} card={card}/>
        } else if (card instanceof Joker_Final) {
            return <SimpleJokerCard card={card} index={index}/>
        } else {
            return <SimpleConsumables index={index} card={card}/>
        }
    }
    return (
        <Paper maw={'71px'}>
            <Card/>
        </Paper>
    )
}

const MemoizedGameCard = React.memo(GameCard);

function SimpleVoucher({voucherName}: { voucherName: string | null }) {
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
        <Tooltip label={voucherName}>
            <Box maw={'80px'}>
                <SimpleRenderCanvas
                    layers={layers}
                />
            </Box>
        </Tooltip>

    )
}

function SimpleTag({tagName}: { tagName: string }) {
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
        <Tooltip label={tagName}>
            <Box h={32} w={32}>
                <SimpleRenderCanvas
                    layers={layers}
                />
            </Box>
        </Tooltip>
    )

}

function SimpleBoss({bossName}: { bossName: string }) {
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
        <Tooltip label={bossName}>
            <Box h={32} w={32}>
                <SimpleRenderCanvas
                    layers={layers}
                />
            </Box>
        </Tooltip>

    )

}

function AnteSkeletonLoader() {
    return (
        <Paper w={'100%'} withBorder shadow={'xl'} mb={'xl'} p={'md'}>
            <Skeleton height={28} width="120px" mb="lg"/>

            {/* Shop section */}
            <Skeleton height={20} width="80px" mb="sm"/>
            <Group gap="xs" wrap={'nowrap'}>
                {Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} height={90} width={71}/>
                ))}
            </Group>

            <Divider my={'md'}/>

            {/* Packs section */}
            <Skeleton height={20} width="80px" mb="sm"/>
            {Array(2).fill(0).map((_, blindIndex) => (
                <Box key={blindIndex} mb="xl">
                    <Skeleton height={18} width="100px" mb="xs"/>
                    <Box mb="md">
                        <Skeleton height={16} width="180px" mb="xs"/>
                        <Group gap="xs" wrap={'nowrap'}>
                            {Array(4).fill(0).map((_, i) => (
                                <Skeleton key={i} height={90} width={71}/>
                            ))}
                        </Group>
                    </Box>
                </Box>
            ))}

            {/* Footer section */}
            <Group align="flex-start" justify="space-between" p="md">
                <Group align="flex-start">
                    <Skeleton height={80} width={80}/>
                    <Stack align="flex-start">
                        <Group align="flex-start">
                            <Skeleton height={32} width={32}/>
                            <Skeleton height={32} width={32}/>
                        </Group>
                        <Skeleton height={32} width={32}/>
                    </Stack>
                </Group>
            </Group>
        </Paper>
    );
}

function Simple({SeedResults}: { SeedResults: SeedResultsContainer }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleAntes, setVisibleAntes] = useState<number[]>([1]); // Start with first ante visible
    const [loadingNextAnte, setLoadingNextAnte] = useState<number | null>(2); // Track which ante is loading
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const setSelectedAnte = useCardStore(state => state.setSelectedAnte);
    const debouncedSetSelectedAnte = useDebouncedCallback(setSelectedAnte, 500)
    const lockedCards = useCardStore(state => state.lockState.lockedCards);
    const clearLockedCards = useCardStore(state => state.clearLockedCards);
    const analyzeSeed = useCardStore(state => state.analyzeSeed)
    const hasLockedCards = Object.keys(lockedCards).length > 0;
    if (!SeedResults) return null;

    const anteEntries = Object.entries(SeedResults.antes);

    // Function to check if this ante should be rendered
    const shouldRenderAnte = (anteNumber: number) => {
        return visibleAntes.includes(anteNumber);
    };

    // Intersection observer for each ante
    const AnteObserver = ({anteNumber}: { anteNumber: number }) => {
        const {ref, entry} = useIntersection({
            threshold: 0.3, // Start loading next ante when 30% of current is visible
        });

        useEffect(() => {
            if (entry?.isIntersecting) {
                // When this ante is visible, make the next one available
                const currentAnte = anteNumber;
                if (currentAnte !== selectedAnte) {
                    debouncedSetSelectedAnte(currentAnte);
                }
                // Set the current ante as selected
                const nextAnte = anteNumber + 1;

                if (nextAnte <= anteEntries.length && !visibleAntes.includes(nextAnte)) {
                    setVisibleAntes(prev => [...prev, nextAnte]);
                    setLoadingNextAnte(nextAnte + 1);
                }
            }
        }, [entry?.isIntersecting, anteNumber, selectedAnte, debouncedSetSelectedAnte]);

        return <div ref={ref}/>;
    };

    return (
        <Container fluid ref={containerRef}>
            {hasLockedCards && (
                <Affix position={{bottom: 40, right: 40}}>
                    <Group justify="flex-end" mb="md">
                        <Button
                            size="sm"
                            variant="light"
                            color="yellow"
                            leftSection={<IconLockOpen size={16}/>}
                            onClick={() => {
                                clearLockedCards();
                                analyzeSeed()
                            }}
                        >
                            Clear Locked Cards ({Object.keys(lockedCards).length})
                        </Button>
                    </Group>
                </Affix>
            )}
            {anteEntries.map(([key, value]) => {
                const anteNumber = Number(key);

                // If this ante shouldn't be rendered yet
                if (!shouldRenderAnte(anteNumber)) {
                    // Show skeleton loader only for the next ante that would be loaded
                    if (loadingNextAnte === anteNumber) {
                        return <AnteSkeletonLoader key={key}/>;
                    }
                    // Otherwise just render the observer for previous ante
                    return <AnteObserver key={key} anteNumber={anteNumber - 1}/>;
                }

                const blinds = value.blinds;

                return (
                    <Paper w={'100%'} withBorder shadow={'xl'} mb={'xl'} p={'md'} key={key}>
                        <Title order={2} mb={'1rem'}>Ante {key}</Title>
                        <Group align={'flex-start'} justify={'space-between'} mb={'xs'}>
                            <Group align={'flex-start'}>
                                <SimpleVoucher voucherName={value.voucher}/>
                                <Stack align={'flex-start'}>
                                    <Group align={'flex-start'}>
                                        <SimpleTag tagName={value.tags[0]}/>
                                        <SimpleTag tagName={value.tags[1]}/>
                                    </Group>
                                    <SimpleBoss bossName={value.boss || ''}/>
                                </Stack>
                            </Group>
                        </Group>
                        <Divider my={'xs'}/>
                        {/* Shop section */}
                        <Title order={4} mb={'1rem'}>Shop</Title>
                        <DragScroll>
                            <Group wrap={'nowrap'}>
                                {value.queue.map((card: any, index: number) => (
                                    <SimpleBuyerWrapper
                                        key={index}
                                        card={card}
                                        cardId={`ante_${key}_shop_${index}`}
                                    >
                                        <MemoizedGameCard key={index} index={index + 1} card={card}/>
                                    </SimpleBuyerWrapper>
                                ))}
                            </Group>
                        </DragScroll>
                        <Divider my={'xs'}/>

                        {/* Packs section */}
                        <Title order={4} mb={'xs'}>Packs</Title>
                        {Object.entries(blinds).map(([blindName, blind]: [string, any]) => (
                            <Box key={blindName} mb="xs">
                                <Title order={5} mb={'xs'} c="dimmed">
                                    {blindName === 'smallBlind' ? 'Small Blind' :
                                        blindName === 'bigBlind' ? 'Big Blind' : 'Boss Blind'}
                                </Title>

                                {blind.packs && blind.packs.length > 0 ? (
                                    blind.packs.map((pack: Pack, packIndex: number) => (
                                        <Box key={packIndex} mb="xs">
                                            <Text fw={700} fz="sm" mb="xs">
                                                {pack.name || `Pack ${packIndex + 1}`} {pack.size} cards,
                                                pick{' '}{pack.choices}
                                            </Text>
                                            <DragScroll>
                                                <Group wrap={'nowrap'}>
                                                    {pack.cards.map((card: any, cardIndex: number) => (
                                                        <SimpleBuyerWrapper
                                                            key={cardIndex}
                                                            card={card}
                                                            cardId={`ante_${key}_${blindName}_pack_${packIndex}_card_${cardIndex}`}
                                                        >
                                                            <MemoizedGameCard
                                                                key={cardIndex}
                                                                card={card}
                                                            />
                                                        </SimpleBuyerWrapper>
                                                    ))}
                                                </Group>
                                            </DragScroll>
                                        </Box>
                                    ))
                                ) : (
                                    <Text fz="sm" c="dimmed" mb="md">No packs available</Text>
                                )}
                            </Box>
                        ))}


                        {/* Observer at the bottom of each rendered ante to detect when it's visible */}
                        <AnteObserver anteNumber={anteNumber}/>
                    </Paper>
                );
            })}

            {/* Show a skeleton at the end if there are more antes to load */}
            {loadingNextAnte && loadingNextAnte <= anteEntries.length &&
                !visibleAntes.includes(loadingNextAnte) &&
                <AnteSkeletonLoader key="loading-next"/>}
        </Container>
    );
}

export default Simple;
