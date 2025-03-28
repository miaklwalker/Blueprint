import {useCardStore} from "../../modules/state/store.ts";
import {useEffect, useMemo, useState} from "react";
import {Carousel, Embla} from "@mantine/carousel";
import {blinds, LOCATION_TYPES, LOCATIONS, tagDescriptions} from "../../modules/const.ts";
import {
    Accordion,
    AppShell,
    Badge,
    Box,
    Button,
    Fieldset,
    Flex,
    Group,
    NativeSelect,
    Paper,
    Popover,
    ScrollArea,
    SegmentedControl,
    Stack,
    Tabs,
    Text
} from "@mantine/core";
import {BuyWrapper} from "../buyerWrapper.tsx";
import {GameCard} from "../Rendering/cards.tsx";
import {Ante, Pack, SeedResultsContainer} from "../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {BuyMetaData} from "../../modules/classes/BuyMetaData.ts";
import {Boss, Tag, Voucher} from "../Rendering/gameElements.tsx";
import {toHeaderCase} from "js-convert-case";
import {useDisclosure, useViewportSize} from "@mantine/hooks";
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
        if(!embla) return;


        if (embla && selectedSearchResult) {
            if (selectedSearchResult?.location === LOCATIONS.SHOP && selectedSearchResult?.index) {
                embla.scrollTo(selectedSearchResult.index - 1)
            }
        }

        return () => {

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

function AntePanel({ante, tabName, timeTravelVoucherOffset}: { ante: Ante, tabName: string, timeTravelVoucherOffset: number }) {
    const queue = ante.queue;
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const packs = ante?.blinds?.[selectedBlind]?.packs;
    return (
        <Tabs.Panel w={'100%'} value={tabName}>
            <Paper withBorder h={'100%'} p={'sm'}>
                <Group preventGrowOverflow mb={'sm'}>
                    <Fieldset flex={1} legend={'Shop'}>
                        <QueueCarousel queue={queue} tabName={tabName}/>
                    </Fieldset>
                    <Fieldset legend={'Voucher'}>
                        <Flex h={192} direction={'column'} align={'space-between'}>
                            <Text ta={'center'} c={'dimmed'} fz={'md'}> Voucher </Text>
                            <BuyWrapper
                                bottomOffset={40}
                                topOffset={40}
                                metaData={
                                    new BuyMetaData({
                                        location: LOCATIONS.VOUCHER,
                                        locationType: LOCATIONS.VOUCHER,
                                        ante: String(Number(tabName) - timeTravelVoucherOffset),
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
                    </Fieldset>
                </Group>

                <Accordion multiple={true} value={packs?.map(({name}: { name: string }) => name) ?? []} w={'100%'}
                           variant={'separated'}>
                    {
                        packs.map((pack: Pack, index: number) => {
                            return (
                                <Accordion.Item key={String(pack.name) + String(index)} value={String(pack.name)}>
                                    <Accordion.Control w={'100%'}>
                                        <Group justify={'space-between'} pr={'1rem'}>
                                            <Group>
                                                <Text fw={500}>{toHeaderCase(String(pack.name))}</Text>
                                                <Badge color={'blue'}> Cards: {pack.size}</Badge>
                                            </Group>
                                            <Badge>
                                                Pick: {pack.choices}
                                            </Badge>
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
            </Paper>
        </Tabs.Panel>
    )
}

const  CustomDetails: {[key: string] : any} = {
    "Charm Tag" : {
        renderer: (ante: Ante, navigateToMiscSource: any) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({name}) => name === 'arcanaPack')?.cards?.slice(0,5).map(({ name }: any) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={()=> navigateToMiscSource('arcanaPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Standard Tag" : {
        renderer: (ante: Ante, navigateToMiscSource: any) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({name}) => name === 'standardPack')?.cards?.slice(0,5).map(({ name }: any) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={()=> navigateToMiscSource('standardPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Meteor Tag" : {
        renderer: (ante: Ante, navigateToMiscSource: any) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({name}) => name === 'celestialPack')?.cards?.slice(0,5).map(({ name }: any) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={()=> navigateToMiscSource('celestialPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Buffoon Tag": {
        renderer: (ante: Ante, navigateToMiscSource: any) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({name}) => name === 'buffoonPack')?.cards?.slice(0,5).map(({ name }: any) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={()=> navigateToMiscSource('buffoonPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Uncommon Tag": {
        renderer: (ante: Ante, navigateToMiscSource: any) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({name}) => name === 'uncommonTag')?.cards?.slice(0,1).map(({ name }: any) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={()=> navigateToMiscSource('uncommonTag')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Rare Tag": {
        renderer: (ante: Ante, navigateToMiscSource: any) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({name}) => name === 'rareTag')?.cards?.slice(0,1).map(({ name }: any) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={()=> navigateToMiscSource('rareTag')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
}

function TagDisplay({ tag, ante }: { tag: string, ante: Ante }) {
    const [opened, { close, open }] = useDisclosure(false);
    const navigateToMiscSource = useCardStore(state => state.navigateToMiscSource);
    return (
        <Popover opened={opened}>
            <Popover.Target>
                <Box onMouseEnter={open} onMouseLeave={close}>
                    <Tag tagName={tag}/>
                </Box>
            </Popover.Target>
            <Popover.Dropdown>
                <Box onMouseEnter={open} onMouseLeave={close}>
                    <Text ta={'center'}>{tag}</Text>
                    <Text>
                        {tagDescriptions[tag ?? ''] ?? 'No description available'}
                    </Text>
                    {
                        CustomDetails[tag] &&
                        CustomDetails[tag]?.renderer(ante, navigateToMiscSource)
                    }
                </Box>
            </Popover.Dropdown>
        </Popover>
    )


}

function SeedExplorer({SeedResults}: { SeedResults: SeedResultsContainer }) {
    const {width} = useViewportSize();

    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const setSelectedAnte = useCardStore(state => state.setSelectedAnte);

    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const setSelectedBlind = useCardStore(state => state.setSelectedBlind);

    // const buys = useCardStore(state => state.shoppingState.buys);
    const timeTravelVoucherOffset = useMemo(() => {
        return 0
        // let keys = Object.keys(buys);
        // if(keys.length === 0) return 0;
        // let offset = 0;
        // for(let i = 0; i < keys.length; i++){
        //     let buy = buys[keys[i]];
        //     if(buy.locationType === LOCATIONS.VOUCHER){
        //
        //         let sameAnte = String(buy.ante) === String(selectedAnte);
        //         let sameBlind = blindsCamelCase.indexOf(buy.blind) < blindsCamelCase.indexOf(selectedBlind);
        //         let offsetNames = ['Hieroglyph', 'Petroglyph'];
        //         if(sameAnte && sameBlind && offsetNames.includes(buy?.name ?? '')){
        //             offset++;
        //         }
        //     }
        // }
        // return offset;
    },[ /*buys, selectedAnte, selectedBlind */ ]);


    let pool:{[key:number|string]: Ante} = SeedResults.antes //timeTravelVoucherOffset === 0 ? SeedResults.antes : SeedResults.timeTravelAntes;

    let itemPool = selectedAnte //timeTravelVoucherOffset === 0 ? selectedAnte : `${selectedAnte-timeTravelVoucherOffset}-${timeTravelVoucherOffset}`;

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
                                <TagDisplay tag={pool[itemPool]?.tags?.[i]} ante={pool[itemPool]}/>
                            )
                            }
                            {
                                i === 2 &&
                                <Popover>
                                    <Popover.Target>
                                        <Box>
                                            <Boss bossName={pool[itemPool]?.boss ?? ''}/>
                                        </Box>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Box>
                                            <Text>{pool[itemPool]?.boss}</Text>
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
                    Object.entries(SeedResults.antes).map(([ante, anteData]: [string, Ante], i: number) => {
                        let currentAnte = String(ante) === String(selectedAnte);
                        let panelData = currentAnte ? pool[itemPool] : anteData;
                        return (
                            <AntePanel key={i} tabName={ante} ante={panelData} timeTravelVoucherOffset={timeTravelVoucherOffset}/>
                        )
                    })
                }
            </Tabs>
        </>
    )
}

function Main({SeedResults}: { SeedResults: SeedResultsContainer | null }) {
    return (
        <AppShell.Main>
            {!SeedResults && <HomePage/>}
            {SeedResults && <SeedExplorer SeedResults={SeedResults}/>}
        </AppShell.Main>
    )
}

export function Blueprint({SeedResults}: { SeedResults: SeedResultsContainer | null }) {
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