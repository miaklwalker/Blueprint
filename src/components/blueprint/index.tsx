import {useCardStore} from "../../modules/state/store.ts";
import {useEffect, useState} from "react";
import {Carousel, Embla} from "@mantine/carousel";
import {blinds, LOCATION_TYPES, LOCATIONS, tagDescriptions} from "../../modules/const.ts";
import {
    Accordion,
    AppShell,
    Box,
    Fieldset,
    Flex,
    Group,
    NativeSelect,
    Paper,
    Popover,
    ScrollArea,
    SegmentedControl,
    Tabs,
    Text
} from "@mantine/core";
import {BuyWrapper} from "../buyerWrapper.tsx";
import {GameCard} from "../Rendering/cards.tsx";
import {Ante, Pack, Seed} from "../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {BuyMetaData} from "../../modules/classes/BuyMetaData.ts";
import {Boss, Tag, Voucher} from "../Rendering/gameElements.tsx";
import {toHeaderCase} from "js-convert-case";
import {useViewportSize} from "@mantine/hooks";
import Header from "./layout/header.tsx";
import NavBar from "./layout/navbar.tsx";
import {Aside} from "./layout/aside.tsx";
import Footer from "./layout/footer.tsx";
import HomePage from "./homePage/homepage.tsx";

function QueueCarousel({queue, tabName}: { queue: any[], tabName: string }) {
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const selectedSearchResult = useCardStore(state => state.searchState.selectedSearchResult);
    const [embla, setEmbla] = useState<Embla | null>(null);
    useEffect(() => {
        if (embla && selectedSearchResult) {
            if (selectedSearchResult?.location === LOCATIONS.SHOP && selectedSearchResult?.index) {
                embla.scrollTo(selectedSearchResult.index - 1)
            }
        }
    }, [embla, selectedSearchResult])
    return (
        <Paper>
            <Carousel
                getEmblaApi={setEmbla}
                containScroll={'keepSnaps'}
                slideGap={{base: 'sm'}}
                slideSize={{base: 90}}
                withControls={false}
                height={190}
                dragFree
                type={'container'}
            >
                {
                    queue.map((card: any, index: number) => {
                        return (
                            <Carousel.Slide h={190} key={index}>
                                <BuyWrapper
                                    metaData={new BuyMetaData({
                                        location: LOCATIONS.SHOP,
                                        locationType: LOCATION_TYPES.SHOP,
                                        index: index,
                                        ante: tabName,
                                        blind: selectedBlind,
                                        link: `https://balatrogame.fandom.com/wiki/${card.name}`,
                                        card: card,
                                        name: card.name
                                    })
                                }
                                >
                                    <GameCard card={card}/>
                                </BuyWrapper>
                            </Carousel.Slide>
                        )
                    })
                }
            </Carousel>
        </Paper>
    )
}

function AntePanel({ante, tabName}: { ante: Ante, tabName: string }) {
    const queue = ante.queue;
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const packs = ante?.blinds?.[selectedBlind]?.packs;
    return (
        <Tabs.Panel w={'100%'} value={tabName}>
            <Paper withBorder h={'100%'} p={'sm'}>
                <Fieldset legend={'Shop'} mb={'sm'}>
                    <QueueCarousel queue={queue} tabName={tabName}/>
                </Fieldset>
                <Flex gap={'md'}>
                    <Paper h={'100%'} withBorder p={'1rem'}>
                        <Flex h={'100%'} direction={'column'} align={'space-between'}>
                            <Text ta={'center'} c={'dimmed'} fz={'md'}> Voucher </Text>
                            <BuyWrapper
                                bottomOffset={40}
                                topOffset={40}
                                metaData={
                                    new BuyMetaData({
                                        location: LOCATIONS.VOUCHER,
                                        locationType: LOCATIONS.VOUCHER,
                                        ante: tabName,
                                        blind: selectedBlind,
                                        itemType: 'voucher',
                                        name: ante?.voucher ?? "",
                                        index: 0,
                                        link: `https://balatrogame.fandom.com/wiki/vouchers`
                                    })
                                }
                            >
                                <Voucher voucherName={ante.voucher}/>
                            </BuyWrapper>
                            <Text ta={'center'} fz={'md'}>  {ante.voucher} </Text>
                        </Flex>
                    </Paper>
                    <Accordion multiple={true} value={packs?.map(({name}: { name: string }) => name) ?? []} w={'100%'}
                               variant={'separated'}>
                        {
                            packs.map((pack: Pack, index: number) => {
                                return (
                                    <Accordion.Item key={String(pack.name) + String(index)} value={String(pack.name)}>
                                        <Accordion.Control w={'100%'}>
                                            <Group w={'100%'}>
                                                <Text fw={500}>{toHeaderCase(String(pack.name))}</Text>
                                            </Group>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <Box w={'100%'} key={index}>
                                                <Carousel
                                                    type={'container'}
                                                    slideSize="90px"
                                                    slideGap={{base: 'xs'}}
                                                    align="start"
                                                    withControls={true}
                                                    height={190}
                                                    dragFree
                                                >
                                                    {pack.cards && pack.cards.map((card: any, cardIndex: number) => (
                                                        <Carousel.Slide key={cardIndex}>
                                                            <BuyWrapper
                                                                key={cardIndex}
                                                                // bottomOffset={30}
                                                                // topOffset={30}
                                                                metaData={
                                                                    new BuyMetaData({
                                                                        location: pack.name,
                                                                        locationType: LOCATION_TYPES.PACK,
                                                                        index: cardIndex,
                                                                        ante: tabName,
                                                                        blind: selectedBlind,
                                                                        itemType: 'card',
                                                                        link: `https://balatrogame.fandom.com/wiki/${card.name}`,
                                                                        card: card,
                                                                        name: card.name
                                                                    })
                                                                }
                                                            >
                                                                <GameCard card={card}/>
                                                            </BuyWrapper>
                                                        </Carousel.Slide>
                                                    ))}
                                                </Carousel>
                                            </Box>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                )
                            })
                        }
                    </Accordion>
                </Flex>
            </Paper>
        </Tabs.Panel>
    )
}

function SeedExplorer({SeedResults}: { SeedResults: Seed  }) {
    const {width} = useViewportSize();

    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const setSelectedAnte = useCardStore(state => state.setSelectedAnte);

    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const setSelectedBlind = useCardStore(state => state.setSelectedBlind);



    return (
        <>
            <Box>
                <NativeSelect
                    mb={'sm'}
                    hiddenFrom="sm"
                    value={selectedAnte}
                    onChange={(e) => setSelectedAnte(Number(e.currentTarget.value))}
                    data={Object.keys(SeedResults.antes).map((ante: string) => ({
                        label: `Ante ${ante}`,
                        value: String(ante)
                    }))}
                />
                <SegmentedControl
                    value={selectedBlind}
                    onChange={setSelectedBlind}
                    fullWidth
                    radius="xl"
                    size="md"
                    mb={'sm'}
                    data={blinds.map((blind: string, i: number) => ({
                        value: ['smallBlind', 'bigBlind', 'bossBlind'][i],
                        label: <Group justify={'center'}>
                            {blind}
                            {i < 2 && (
                                <Popover >
                                    <Popover.Target>
                                        <Box>
                                            <Tag tagName={SeedResults.antes[selectedAnte]?.tags?.[i]}/>
                                        </Box>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Box>
                                            <Text ta={'center'}>{SeedResults.antes[selectedAnte]?.tags?.[i]}</Text>
                                            <Text>
                                                {tagDescriptions[SeedResults.antes[selectedAnte]?.tags?.[i] ?? ''] ?? 'No description available'}
                                            </Text>
                                        </Box>
                                    </Popover.Dropdown>
                                </Popover>

                            )
                            }
                            {
                                i === 2 &&
                                <Popover >
                                    <Popover.Target>
                                        <Box>
                                            <Boss bossName={SeedResults.antes[selectedAnte]?.boss ?? ''}/>
                                        </Box>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Box>
                                            <Text>{SeedResults.antes[selectedAnte]?.boss}</Text>
                                        </Box>
                                    </Popover.Dropdown>
                                </Popover>

                            }

                        </Group>,
                    }))}
                />
            </Box>
            <Tabs
                w={'100%'}
                variant="pills"
                orientation={"vertical"}
                defaultValue={'1'}
                keepMounted={false}
                value={String(selectedAnte)}
                onChange={(value) => {
                    setSelectedAnte(Number(value));
                }}
            >
                <Box mah={'65vh'} style={{display: width > 767 ? 'revert' : 'none'}} mr={'2rem'}>
                    <ScrollArea type="scroll" scrollbars={'y'} h={'100%'}>
                        <Tabs.List>
                            {
                                Object.keys(SeedResults.antes).map((ante: string) => (
                                    <Tabs.Tab
                                        key={ante}
                                        value={String(ante)}
                                    >
                                        {`Ante ${ante}`}
                                    </Tabs.Tab>
                                ))
                            }
                        </Tabs.List>
                    </ScrollArea>
                </Box>
                {
                    SeedResults &&
                    Object.entries(SeedResults.antes).map(([ante, anteData]: [string, Ante], i: number) => (
                        <AntePanel key={i} tabName={ante} ante={anteData}/>))
                }
            </Tabs>
        </>
    )
}

function Main({SeedResults}: { SeedResults: Seed | null }) {
    return (
        <AppShell.Main>
            { !SeedResults && <HomePage/>}
            { SeedResults && <SeedExplorer SeedResults={SeedResults}/> }
        </AppShell.Main>
    )
}

export function Blueprint({SeedResults}: { SeedResults: Seed | null }) {
    const {width} = useViewportSize();
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const outputOpened = useCardStore(state => state.applicationState.asideOpen);

    return (
        <AppShell
            header={{height: {base: 60, md: 70, lg: 80}}}
            aside={{
                width: {base: '100%', md: 400, lg: 550},
                breakpoint: 'md',
                collapsed: {
                    desktop: !outputOpened,
                    mobile: !outputOpened
                },
            }}
            navbar={{
                width: {base: '100%', md: 400, lg: 400},
                breakpoint: 'sm',
                collapsed: {
                    desktop: !(width > 1000) && !settingsOpened,
                    mobile: !settingsOpened
                },
            }}
            padding="md"
        >
            <Header SeedResults={SeedResults}/>
            <NavBar/>
            <Main SeedResults={SeedResults}/>
            <Aside SeedResults={SeedResults}/>
            <Footer/>
        </AppShell>
    )
}