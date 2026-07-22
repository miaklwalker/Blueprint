import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Center, Group, Loader, Modal, NumberInput, Stack, Text } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { toHeaderCase } from "js-convert-case";
import { analyzeSeed } from "../modules/ImmolateWrapper";
import { useCardStore } from "../modules/state/store.ts";
import { useSeedOptionsContainer } from "../modules/state/optionsProvider.tsx";
import { GameCard } from "./Rendering/cards.tsx";

// Generating far into a queue is a synchronous engine run, so keep a hard lid on
// it. The warning threshold is where a run starts being noticeable.
const MAX_DEPTH = 10000;

export default function MiscDeepDiveModal({ opened, onClose, sourceName }: {
    opened: boolean,
    onClose: () => void,
    sourceName: string | null
}) {
    const immolateState = useCardStore(state => state.immolateState);
    const deckCards = useCardStore(state => state.deckState.cards);
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const options = useSeedOptionsContainer();

    const [start, setStart] = useState<number | string>(0);
    const [size, setSize] = useState<number | string>(50);
    const [cards, setCards] = useState<Array<any> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Results are throwaway - a new source or a re-open starts from scratch.
    useEffect(() => {
        if (!opened) return;
        setCards(null);
        setError(null);
    }, [opened, sourceName]);

    const startNum = typeof start === 'string' ? parseInt(start) || 0 : start;
    const sizeNum = typeof size === 'string' ? parseInt(size) || 1 : size;
    const depth = startNum + sizeNum;
    const tooDeep = depth > MAX_DEPTH;

    const calculate = () => {
        if (!sourceName || tooDeep) return;
        setLoading(true);
        setError(null);
        // Hand the browser a frame to paint the loader before the engine run
        // blocks the main thread.
        setTimeout(() => {
            try {
                const results = analyzeSeed(
                    // Antes are generated sequentially off a shared engine, so we
                    // still need every ante up to the selected one - but not past it.
                    { ...immolateState, antes: Math.max(1, selectedAnte) },
                    {
                        ...options,
                        customDeck: deckCards,
                        updates: [{ source: sourceName, count: depth }]
                    }
                );
                const source = results?.antes?.[selectedAnte]?.miscCardSources
                    ?.find(s => s.name === sourceName);
                if (!source) {
                    setError(`No results for ${sourceName} in ante ${selectedAnte}.`);
                    setCards([]);
                } else {
                    setCards(source.cards.slice(startNum, depth));
                }
            } catch (e) {
                console.error("Deep dive failed:", e);
                setError(e instanceof Error ? e.message : "Failed to calculate this queue.");
                setCards(null);
            } finally {
                setLoading(false);
            }
        }, 0);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size={'xl'}
            title={sourceName ? `${toHeaderCase(sourceName)} - Ante ${selectedAnte}` : 'Card Source'}
        >
            <Stack>
                <Text fz={'sm'} c={'dimmed'}>
                    Generates this queue out to card {depth} for ante {selectedAnte}, then shows the
                    window you asked for. Results live in this modal only - they are not searchable
                    and are discarded when you close it.
                </Text>
                <Group align={'flex-end'}>
                    <NumberInput
                        label={'Start at card'}
                        w={140}
                        min={0}
                        max={MAX_DEPTH - 1}
                        value={start}
                        onChange={setStart}
                    />
                    <NumberInput
                        label={'Window size'}
                        w={140}
                        min={1}
                        max={MAX_DEPTH}
                        value={size}
                        onChange={setSize}
                    />
                    <Button onClick={calculate} loading={loading} disabled={!sourceName || tooDeep}>
                        Calculate
                    </Button>
                </Group>
                {
                    tooDeep && (
                        <Alert color={'red'} title={'Too deep'}>
                            Start + window size must be {MAX_DEPTH} or less (currently {depth}).
                        </Alert>
                    )
                }
                {/* {*/}
                {/*    !tooDeep && depth > SLOW_DEPTH && (*/}
                {/*        <Alert color={'yellow'} title={'This may take a moment'}>*/}
                {/*            Generating {depth} cards across {Math.max(1, selectedAnte)} ante(s) runs*/}
                {/*            synchronously and will briefly freeze the page.*/}
                {/*        </Alert>*/}
                {/*    )*/}
                {/* }*/}
                {
                    error && <Alert color={'red'} title={'Calculation failed'}>{error}</Alert>
                }
                {
                    loading && (
                        <Center h={190}>
                            <Loader />
                        </Center>
                    )
                }
                {
                    !loading && cards !== null && (
                        cards.length === 0 ? (
                            <Center h={190}>
                                <Text c={'dimmed'}>
                                    No cards in this range - the queue is shorter than card {startNum + 1}.
                                </Text>
                            </Center>
                        ) : (
                            <Box>
                                <Text fz={'xs'} c={'dimmed'} mb={'xs'}>
                                    Showing cards {startNum + 1}&ndash;{startNum + cards.length}
                                </Text>
                                <Carousel
                                    type={'container'}
                                    slideSize="90px"
                                    slideGap={{ base: 'xs' }}
                                    withControls={false}
                                    height={190}
                                    emblaOptions={{ dragFree: true, align: 'start' }}
                                >
                                    {cards.map((card: any, i: number) => (
                                        <Carousel.Slide key={startNum + i}>
                                            <Stack gap={2}>
                                                <GameCard card={card} />
                                                <Text fz={10} c={'dimmed'} ta={'center'}>
                                                    #{startNum + i + 1}
                                                </Text>
                                            </Stack>
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            </Box>
                        )
                    )
                }
            </Stack>
        </Modal>
    );
}
