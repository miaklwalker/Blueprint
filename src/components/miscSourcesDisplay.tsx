import React, { useEffect, useState } from 'react';
import { Accordion, Box, Button, Center, Group, Paper, Text, Title } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { toHeaderCase } from "js-convert-case";
import { LOCATIONS } from "../modules/const.ts";
import { useCardStore } from "../modules/state/store.ts";
import { Joker_Final, StandardCard_Final } from "../modules/ImmolateWrapper/CardEngines/Cards.ts";
import { BuyWrapper } from "./buyerWrapper.tsx";
import { GameCard } from "./Rendering/cards.tsx";
import MiscDeepDiveModal from "./MiscDeepDiveModal.tsx";
import { BoosterPack, Boss, Tag , Voucher  } from "./Rendering/gameElements.tsx";
import type { MiscCardSource } from "../modules/ImmolateWrapper";
import type { EmblaCarouselType } from 'embla-carousel';

export default function MiscCardSourcesDisplay({ miscSources, boosterQueue, bossQueue, tagQueue, voucherQueue, wheelQueue, auraQueue, draws }: {
    miscSources?: Array<MiscCardSource>,
    bossQueue?: Array<any>,
    boosterQueue?: Array<any>,
    tagQueue?: Array<any>,
    voucherQueue?: Array<any>
    wheelQueue?: Array<any>
    auraQueue?: Array<any>
    draws?: Record<string, Array<any>>
}) {
    const selectedResult = useCardStore(state => state.searchState.selectedSearchResult);
    const currentSource = useCardStore(state => state.applicationState.miscSource);
    const setCurrentSource = useCardStore(state => state.setMiscSource);
    const currentAnte = useCardStore(state => state.applicationState.selectedAnte);
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
    const [deepDiveSource, setDeepDiveSource] = useState<string | null>(null);
    useEffect(() => {
        if (!embla) return;
        embla.reInit()
    }, [embla])
    useEffect(() => {
        if (!selectedResult || !embla) return;
        if (selectedResult?.locationType === LOCATIONS.MISC) {
            if (selectedResult.index !== undefined) {
                embla.scrollTo(selectedResult.index)
            }
        }
    }, [embla, selectedResult, currentSource])
    if (!miscSources || Object.keys(miscSources).length === 0) {
        return (
            <Paper p="md" withBorder mb="md">
                <Text c="dimmed" size="sm" ta="center">No miscellaneous card sources available for this ante</Text>
            </Paper>
        );
    }
    return (
        <Paper p="md" withBorder mb="md">
            <MiscDeepDiveModal
                opened={deepDiveSource !== null}
                onClose={() => setDeepDiveSource(null)}
                sourceName={deepDiveSource}
            />
            <Title order={3} mb="xs">Card Sources</Title>
            <Accordion onChange={e => setCurrentSource(`${e}`)} variant={'separated'} value={currentSource}>
                {miscSources.map(({ name, cards }: { name: string, cards: any }) => (
                    <Accordion.Item key={String(name)} value={String(name)}>
                        {/* Control and button are siblings: Accordion.Control renders a
                            button, so the action cannot be nested inside it. */}
                        <Center>
                            <Accordion.Control>
                                <Group>
                                    <Text fw={500}>{toHeaderCase(String(name))}</Text>
                                </Group>
                            </Accordion.Control>
                            <Button
                                size={'compact-xs'}
                                variant={'subtle'}
                                mr={'xs'}
                                style={{ flexShrink: 0 }}
                                onClick={() => setDeepDiveSource(String(name))}
                            >
                                See more
                            </Button>
                        </Center>
                        <Accordion.Panel>
                            {
                                name === currentSource &&
                                <Box>
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        type={'container'}
                                        slideSize="90px"
                                        slideGap={{ base: 'xs' }}
                                        withControls={false}
                                        height={190}
                                        emblaOptions={{
                                            dragFree: true,
                                            align: 'start'
                                        }}

                                    >
                                        {cards?.map((card: any, i: number) => (
                                            <Carousel.Slide key={i}>
                                                <BuyWrapper
                                                    metaData={{
                                                        transactionType: "buy",
                                                        location: name,
                                                        locationType: LOCATIONS.MISC,
                                                        index: i,
                                                        ante: String(currentAnte),
                                                        blind: "smallBlind",
                                                        name: card?.name,
                                                        link: `https://balatrowiki.org/w/${card.name}`,
                                                        card: card
                                                    }}
                                                >
                                                    <GameCard card={card} />
                                                </BuyWrapper>

                                            </Carousel.Slide>
                                        ))}
                                    </Carousel>
                                </Box>
                            }

                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
                {/*    Voucher Queue */}
                <Accordion.Item key={"Vouchers"} value={"Vouchers"}>
                    <Accordion.Control>
                        <Group>
                            <Text fw={500}>Vouchers</Text>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {
                            "Vouchers" === currentSource &&
                            <Box>
                                <Carousel
                                    getEmblaApi={setEmbla}
                                    type={'container'}
                                    slideSize="90px"
                                    slideGap={{ base: 'xs' }}
                                    withControls={false}
                                    height={190}
                                    emblaOptions={{
                                        dragFree: true,
                                        align: 'start'
                                    }}
                                >
                                    {voucherQueue?.map((voucher: any, i: number) => (
                                        <Carousel.Slide key={i}>
                                            <BuyWrapper
                                                metaData={{
                                                    transactionType: "buy",
                                                    location: "Vouchers",
                                                    locationType: LOCATIONS.MISC,
                                                    index: i,
                                                    ante: String(currentAnte),
                                                    blind: "smallBlind",
                                                    name: voucher,
                                                    link: `https://balatrowiki.org/w/${voucher}`,
                                                    card: voucher
                                                }}
                                            >
                                                <Voucher voucherName={voucher} />
                                            </BuyWrapper>

                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            </Box>
                        }
                    </Accordion.Panel>
                </Accordion.Item>
                {/*    Boss Queue */}
                <Accordion.Item key={"Bosses"} value={"Bosses"}>
                    <Accordion.Control>
                        <Group>
                            <Text fw={500}>Bosses</Text>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {
                            "Bosses" === currentSource &&
                            <Box>
                                <Carousel
                                    getEmblaApi={setEmbla}
                                    type={'container'}
                                    slideSize="90px"
                                    slideGap={{ base: 'xs' }}
                                    withControls={false}
                                    height={70}
                                    emblaOptions={{
                                        dragFree: true,
                                        align: 'start'
                                    }}
                                >
                                    {bossQueue?.map((boss: any, i: number) => (
                                        <Carousel.Slide key={i}>
                                            <Center w={'100%'} h={'50'}>
                                                <Boss bossName={boss} />
                                            </Center>
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            </Box>
                        }
                    </Accordion.Panel>
                </Accordion.Item>
                {/*    Tag Queue */}
                <Accordion.Item key={"Tags"} value={"Tags"}>
                    <Accordion.Control>
                        <Group>
                            <Text fw={500}>Tags</Text>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {
                            "Tags" === currentSource &&
                            <Box>
                                <Carousel
                                    getEmblaApi={setEmbla}
                                    type={'container'}
                                    slideSize="90px"
                                    slideGap={{ base: 'xs' }}
                                    withControls={false}
                                    height={70}
                                    emblaOptions={{
                                        dragFree: true,
                                        align: 'start'
                                    }}
                                >
                                    {tagQueue?.map((tag: any, i: number) => (
                                        <Carousel.Slide key={i}>
                                            <Center w={'100%'} h={'50'}>
                                                <Tag tagName={tag} />
                                            </Center>
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            </Box>
                        }
                    </Accordion.Panel>
                </Accordion.Item>
                {/*    Wheel Queue*/}
                <Accordion.Item key={'WheelOfFortune'} value={'WheelOfFortune'}>
                    <Accordion.Control>
                        <Group>
                            <Text fw={500}>Wheel of Fortune</Text>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {
                            "WheelOfFortune" === currentSource && (
                                <Box>
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        type={'container'}
                                        slideSize="90px"
                                        slideGap={{ base: 'xs' }}
                                        withControls={false}
                                        height={190}
                                        emblaOptions={{
                                            dragFree: true,
                                            align: 'start'
                                        }}

                                    >
                                        {wheelQueue?.map((card: any, i: number) => (
                                            <Carousel.Slide key={i}>
                                                <GameCard card={
                                                    new Joker_Final({
                                                        ...card,
                                                        name: "Joker",
                                                        type: "Joker",
                                                    })
                                                } />
                                            </Carousel.Slide>
                                        ))}
                                    </Carousel>
                                </Box>
                            )
                        }
                    </Accordion.Panel>
                </Accordion.Item>
                {/*    Aura Queue*/}
                <Accordion.Item key={'aura'} value={'aura'}>
                    <Accordion.Control>
                        <Group>
                            <Text fw={500}>Aura</Text>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {
                            "aura" === currentSource && (
                                <Box>
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        type={'container'}
                                        slideSize="90px"
                                        slideGap={{ base: 'xs' }}
                                        withControls={false}
                                        height={190}
                                        emblaOptions={{
                                            dragFree: true,
                                            align: 'start'
                                        }}

                                    >
                                        {auraQueue?.map((card: any, i: number) => (
                                            <Carousel.Slide key={i}>
                                                <GameCard card={
                                                    new StandardCard_Final({
                                                        ...card,
                                                        type: "Standard",
                                                    })
                                                } />
                                            </Carousel.Slide>
                                        ))}
                                    </Carousel>
                                </Box>
                            )
                        }
                    </Accordion.Panel>
                </Accordion.Item>
                {/* Booster Queue */}
                <Accordion.Item key={'boosters'} value={'boosters'}>
                    <Accordion.Control>
                        <Group>
                            <Text fw={500}>Boosters</Text>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {
                            "boosters" === currentSource &&
                            <Box>
                                <Carousel
                                    getEmblaApi={setEmbla}
                                    type={'container'}
                                    slideSize="90px"
                                    slideGap={{ base: 'xs' }}
                                    withControls={false}
                                    height={190}
                                    emblaOptions={{
                                        dragFree: true,
                                        align: 'start'
                                    }}
                                >
                                    {boosterQueue?.map((packname: string, i: number) => (
                                        <Carousel.Slide key={i}>
                                            <BuyWrapper
                                                metaData={{
                                                    transactionType: "buy",
                                                    location: "boosters",
                                                    locationType: LOCATIONS.MISC,
                                                    index: i,
                                                    ante: String(currentAnte),
                                                    blind: "smallBlind",
                                                    name: packname,
                                                    link: `https://balatrowiki.org/w/${packname}`,
                                                }}
                                            >
                                                <BoosterPack packName={packname} />
                                            </BuyWrapper>
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            </Box>
                        }
                    </Accordion.Panel>
                </Accordion.Item>
                {
                    draws && Object.entries(draws).map(([k, v]) => {
                        return (
                            <Accordion.Item key={String(k)} value={String(k)}>
                                <Accordion.Control>
                                    <Group>
                                        <Text fw={500}>{toHeaderCase(String(k))} Deck Order</Text>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {
                                        String(k) === currentSource &&
                                        <Box>
                                            <Carousel
                                                getEmblaApi={setEmbla}
                                                type={'container'}
                                                slideSize="90px"
                                                slideGap={{ base: 'xs' }}
                                                withControls={false}
                                                height={190}
                                                emblaOptions={{
                                                    dragFree: true,
                                                    align: 'start'
                                                }}

                                            >
                                                {v?.map((card: any, i: number) => (
                                                    <Carousel.Slide key={i}>
                                                        <BuyWrapper
                                                            metaData={{
                                                                location: '',
                                                                blind: 'smallBlind',
                                                                transactionType: "buy",
                                                                locationType: LOCATIONS.MISC,
                                                                index: i,
                                                                ante: String(currentAnte),
                                                                name: card?.name,
                                                                card: card
                                                            }}
                                                        >
                                                            <GameCard card={
                                                                card
                                                            } />
                                                        </BuyWrapper>

                                                    </Carousel.Slide>
                                                ))}
                                            </Carousel>
                                        </Box>
                                    }
                                </Accordion.Panel>
                            </Accordion.Item>
                        )
                    })
                }





            </Accordion>
        </Paper>
    );
}
