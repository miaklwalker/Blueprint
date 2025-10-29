import {MiscCardSource} from "../modules/ImmolateWrapper";
import {Accordion, Box, Center, Group, Paper, Text, Title} from "@mantine/core";
import {useCardStore} from "../modules/state/store.ts";
import {useEffect, useState} from "react";
import { EmblaCarouselType } from 'embla-carousel';
import {Carousel} from "@mantine/carousel";
import {LOCATIONS} from "../modules/const.ts";
import {toHeaderCase} from "js-convert-case";
import {BuyWrapper} from "./buyerWrapper.tsx";
import {GameCard} from "./Rendering/cards.tsx";
import {BoosterPack, Voucher} from "./Rendering/gameElements.tsx";
import {Boss} from "./Rendering/gameElements.tsx";
import {Tag} from "./Rendering/gameElements.tsx";
import {Joker_Final, StandardCard_Final} from "../modules/ImmolateWrapper/CardEngines/Cards.ts";

export default function MiscCardSourcesDisplay({miscSources, boosterQueue, bossQueue, tagQueue, voucherQueue, wheelQueue, auraQueue }: {
    miscSources?: MiscCardSource[],
    bossQueue?: any[],
    boosterQueue?: any[],
    tagQueue?: any[],
    voucherQueue?: any[]
    wheelQueue?: any[]
    auraQueue?: any[]
}) {
    if (!miscSources || Object.keys(miscSources).length === 0) {
        return (
            <Paper p="md" withBorder mb="md">
                <Text c="dimmed" size="sm" ta="center">No miscellaneous card sources available for this ante</Text>
            </Paper>
        );
    }
    const selectedResult = useCardStore(state => state.searchState.selectedSearchResult);
    const currentSource = useCardStore(state => state.applicationState.miscSource);
    const setCurrentSource = useCardStore(state => state.setMiscSource);
    const currentAnte = useCardStore(state => state.applicationState.selectedAnte);
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
    useEffect(() => {
        if (!embla) return;
        embla.reInit()
    }, [embla])
    useEffect(() => {
        if (!selectedResult || !embla) return;
        if (selectedResult?.locationType === LOCATIONS.MISC) {
            if (selectedResult?.index) {
                embla.scrollTo(selectedResult.index)
            }
        }
    }, [currentSource, selectedResult, currentSource])
    return (
        <Paper p="md" withBorder mb="md">
            <Title order={3} mb="xs">Card Sources</Title>
            <Accordion onChange={e => setCurrentSource(`${e}`)} variant={'separated'} value={currentSource}>
                {miscSources.map(({name, cards}: { name: string, cards: any }) => (
                    <Accordion.Item key={String(name)} value={String(name)}>
                        <Accordion.Control>
                            <Group>
                                <Text fw={500}>{toHeaderCase(String(name))}</Text>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            {
                                name === currentSource &&
                                <Box>
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        type={'container'}
                                        slideSize="90px"
                                        slideGap={{base: 'xs'}}
                                        withControls={false}
                                        height={190}
                                        emblaOptions={{
                                            dragFree: true,
                                            align:'start'
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
                                                    <GameCard card={card}/>
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
                                    slideGap={{base: 'xs'}}
                                    withControls={false}
                                    height={190}
                                    emblaOptions={{
                                        dragFree: true,
                                        align:'start'
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
                                                <Voucher voucherName={voucher}/>
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
                                    slideGap={{base: 'xs'}}
                                    withControls={false}
                                    height={70}
                                    emblaOptions={{
                                        dragFree: true,
                                        align:'start'
                                    }}
                                >
                                    {bossQueue?.map((boss: any, i: number) => (
                                        <Carousel.Slide key={i}>
                                            <Center w={'100%'} h={'50'}>
                                                <Boss bossName={boss}/>
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
                                    slideGap={{base: 'xs'}}
                                    withControls={false}
                                    height={70}
                                    emblaOptions={{
                                        dragFree: true,
                                        align:'start'
                                    }}
                                >
                                    {tagQueue?.map((tag: any, i: number) => (
                                        <Carousel.Slide key={i}>
                                            <Center w={'100%'} h={'50'}>
                                                <Tag tagName={tag}/>
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
                            "WheelOfFortune" === currentSource &&(
                                <Box>
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        type={'container'}
                                        slideSize="90px"
                                        slideGap={{base: 'xs'}}
                                        withControls={false}
                                        height={190}
                                        emblaOptions={{
                                            dragFree: true,
                                            align:'start'
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
                                                }/>
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
                            "aura" === currentSource &&(
                                <Box>
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        type={'container'}
                                        slideSize="90px"
                                        slideGap={{base: 'xs'}}
                                        withControls={false}
                                        height={190}
                                        emblaOptions={{
                                            dragFree: true,
                                            align:'start'
                                        }}

                                    >
                                        {auraQueue?.map((card: any, i: number) => (
                                            <Carousel.Slide key={i}>
                                                <GameCard card={
                                                    new StandardCard_Final({
                                                        ...card,
                                                        type: "Standard",
                                                    })
                                                }/>
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
                                    slideGap={{base: 'xs'}}
                                    withControls={false}
                                    height={190}
                                    emblaOptions={{
                                        dragFree: true,
                                        align:'start'
                                    }}
                                >
                                    {boosterQueue?.map((packname:string, i: number) => (
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
                                                <BoosterPack packName={packname}/>
                                            </BuyWrapper>
                                        </Carousel.Slide>
                                    ))}
                                </Carousel>
                            </Box>
                        }
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Paper>
    );
}
