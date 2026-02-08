import React, { useEffect, useMemo, useState } from "react";
import { Carousel } from "@mantine/carousel";
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
import { toHeaderCase } from "js-convert-case";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import { Boss, Tag as RenderTag, Voucher } from "../../Rendering/gameElements.tsx";
import { BuyMetaData } from "../../../modules/classes/BuyMetaData.ts";
import { BuyWrapper } from "../../buyerWrapper.tsx";
import { LOCATIONS, LOCATION_TYPES, blinds, tagDescriptions } from "../../../modules/const.ts";
import { useCardStore } from "../../../modules/state/store.ts";
import { GameCard } from "../../Rendering/cards.tsx";
import Header from "../layout/header.tsx";
import NavBar from "../layout/navbar.tsx";
import { Aside } from "../layout/aside.tsx";
import Footer from "../layout/footer.tsx";
import HomePage from "../homePage/homepage.tsx";
import Index from "../textView";
import Simple from "../simpleView/simple.tsx";
import SnapshotModal from "../snapshotView/SnapshotView.tsx";
import { useSeedResultsContainer } from "../../../modules/state/analysisResultProvider.tsx";
import { useDownloadSeedResults } from "../../../modules/state/downloadProvider.tsx";
import type { Blinds } from "../../../modules/state/store.ts";
import type { Tag } from "../../../modules/balatrots/enum/Tag.ts";
import type { Ante, Pack } from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import type { EmblaCarouselType } from 'embla-carousel';

function QueueCarousel({ queue, tabName }: { queue: Array<any>, tabName: string }) {
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const selectedSearchResult = useCardStore(state => state.searchState.selectedSearchResult);
    const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

    useEffect(() => {
        if (!embla) return;


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
                slideGap={{ base: 'sm' }}
                slideSize={{ base: 90 }}
                withControls={false}
                height={190}
                emblaOptions={{ dragFree: true, containScroll: "keepSnaps" }}
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
                                        link: `https://balatrowiki.org/w/${card.name}`,
                                        card: card,
                                        name: card.name
                                    })
                                    }
                                >
                                    <GameCard card={card} />
                                </BuyWrapper>
                            </Carousel.Slide>
                        )
                    })
                }
            </Carousel>
        </Paper>
    )
}

function AntePanel({ ante, tabName, timeTravelVoucherOffset }: {
    ante: Ante,
    tabName: string,
    timeTravelVoucherOffset: number
}) {
    const queue = ante.queue;
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const packs = ante.blinds[selectedBlind].packs;
    return (
        <Tabs.Panel w={'100%'} value={tabName}>
            <Paper id="shop-results" withBorder h={'100%'} p={'sm'}>
                <Group preventGrowOverflow mb={'sm'}>
                    <Fieldset flex={1} legend={'Shop'}>
                        <QueueCarousel queue={queue} tabName={tabName} />
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
                                        name: ante.voucher ?? "",
                                        index: 0,
                                        link: `https://balatrowiki.org/w/vouchers`
                                    })
                                }
                            >
                                <Voucher voucherName={ante.voucher} />
                            </BuyWrapper>
                            <Text ta={'center'} fz={'md'}>  {ante.voucher} </Text>
                        </Flex>
                    </Fieldset>
                </Group>

                <Accordion
                    key={`${tabName}-${selectedBlind}`}
                    multiple={true}
                    defaultValue={packs?.map((pack: Pack, index: number) => String(pack.name) + String(index)) ?? []}
                    w={'100%'}
                    variant={'separated'}
                >
                    {
                        packs.map((pack: Pack, index: number) => {
                            return (
                                <Accordion.Item key={String(pack.name) + String(index)} value={String(pack.name) + String(index)}>
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
                                                slideGap={{ base: 'xs' }}
                                                withControls={true}
                                                height={190}
                                                emblaOptions={{
                                                    dragFree: true,
                                                    containScroll: "keepSnaps",
                                                    align: 'start'
                                                }}
                                            >
                                                {pack.cards.map((card, cardIndex) => (
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
                                                                    packIndex: index,
                                                                    ante: tabName,
                                                                    blind: selectedBlind,
                                                                    itemType: 'card',
                                                                    link: `https://balatrowiki.org/w/${card!.name}`,
                                                                    card: card,
                                                                    name: card!.name
                                                                })
                                                            }
                                                        >
                                                            <GameCard card={card!} />
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
type CustomDetailsType = {
    [K in Tag]?: { renderer: (ante: Ante, navigateToMiscSource: (source: string) => void) => React.ReactNode };
};
const CustomDetails: CustomDetailsType = {
    "Uncommon Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'uncommonTag')?.cards.slice(0, 1).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('uncommonTag')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Rare Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'rareTag')?.cards.slice(0, 1).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('rareTag')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Charm Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'arcanaPack')?.cards.slice(0, 5).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('arcanaPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Boss Tag": {
        renderer: (ante: Ante) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.bossQueue[0]
                        }
                    </Text>
                </Stack>

            )
        }
    },
    "Voucher Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.voucherQueue[0]
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('Vouchers')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Top-up Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'topUpTag')?.cards.slice(0, 5).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('topUpTag')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Ethereal Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'spectralPack')?.cards.slice(0, 5).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('spectralPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Standard Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'standardPack')?.cards.slice(0, 5).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('standardPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Meteor Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'celestialPack')?.cards.slice(0, 5).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('celestialPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
    "Buffoon Tag": {
        renderer: (ante: Ante, navigateToMiscSource) => {
            return (
                <Stack>
                    <Text>
                        {
                            ante.miscCardSources.find(({ name }) => name === 'buffoonPack')?.cards.slice(0, 4).map(({ name }) => name).join(', ')
                        }
                    </Text>
                    <Button onClick={() => navigateToMiscSource('buffoonPack')}>
                        More Info
                    </Button>
                </Stack>

            )
        }
    },
}

function TagDisplay({ tag, ante }: { tag: Tag, ante: Ante }) {
    const [opened, { close, open }] = useDisclosure(false);
    const navigateToMiscSource = useCardStore(state => state.navigateToMiscSource);
    return (
        <Popover opened={opened}>
            <Popover.Target>
                <Box onMouseEnter={open} onMouseLeave={close}>
                    <RenderTag tagName={tag} />
                </Box>
            </Popover.Target>
            <Popover.Dropdown>
                <Box onMouseEnter={open} onMouseLeave={close} maw={375} w={'100%'}>
                    <Text ta={'center'}>{tag}</Text>
                    <Text>
                        {tagDescriptions[tag] ?? 'No description available'}
                    </Text>
                    {
                        CustomDetails[tag] &&
                        CustomDetails[tag].renderer(ante, navigateToMiscSource)
                    }
                </Box>
            </Popover.Dropdown>
        </Popover>
    )


}

function SeedExplorer() {
    const { width } = useViewportSize();
    const SeedResults = useSeedResultsContainer()
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const setSelectedAnte = useCardStore(state => state.setSelectedAnte);

    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const setSelectedBlind = useCardStore(state => state.setSelectedBlind);

    // const buys = useCardStore(state => state.shoppingState.buys);
    const timeTravelVoucherOffset = useMemo(() => {
        return 0
    }, []);

    if (!SeedResults) {
        return null;
    }


    const pool = SeedResults.antes
    const itemPool = selectedAnte

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
                    id="blind-navigation"
                    value={selectedBlind}
                    onChange={(v) => setSelectedBlind(v as Blinds)}
                    fullWidth
                    radius="xl"
                    size="md"
                    mb={'sm'}
                    data={blinds.map((blind: string, i: number) => ({
                        value: ['smallBlind', 'bigBlind', 'bossBlind'][i],
                        label: <Group justify={'center'}>
                            {blind}
                            {i < 2 && (
                                <TagDisplay tag={pool[itemPool].tags[i] as Tag} ante={pool[itemPool]} />
                            )
                            }
                            {
                                i === 2 &&
                                <Popover>
                                    <Popover.Target>
                                        <Box>
                                            <Boss bossName={pool[itemPool].boss ?? ''} />
                                        </Box>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Box>
                                            <Text>{pool[itemPool].boss}</Text>
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
                <Box id="ante-navigation" mah={'65vh'} style={{ display: width > 767 ? 'revert' : 'none' }} mr={'2rem'}>
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
                    Object.entries(SeedResults.antes).map(([ante, anteData]: [string, Ante], i: number) => {
                        const currentAnte = String(ante) === String(selectedAnte);
                        const panelData = currentAnte ? pool[itemPool] : anteData;
                        return (
                            <AntePanel key={i} tabName={ante} ante={panelData}
                                timeTravelVoucherOffset={timeTravelVoucherOffset} />
                        )
                    })
                }
            </Tabs>
        </>
    )
}

function Main() {
    const SeedResults = useSeedResultsContainer()
    const viewMode = useCardStore(state => state.applicationState.viewMode);
    return (
        <AppShell.Main>
            {!SeedResults && <HomePage />}
            {SeedResults && viewMode === 'blueprint' && <SeedExplorer />}
            {SeedResults && viewMode === 'text' && <Index />}
            {SeedResults && viewMode === 'simple' && <Simple />}
            {SeedResults && <SnapshotModal />}
        </AppShell.Main>
    )
}
// declare window module and saveSeedDebug function
declare global {
    interface Window {
        saveSeedDebug: ReturnType<typeof useDownloadSeedResults>;
    }
}

export function Blueprint() {
    const { width } = useViewportSize();
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const outputOpened = useCardStore(state => state.applicationState.asideOpen);
    const download = useDownloadSeedResults()
    useEffect(() => {
        if(typeof window !== 'undefined' && !!download) {
            window.saveSeedDebug = download
        }
    }, [download]);

    return (
        <AppShell
            header={{ height: { base: 60, md: 70, lg: 80 } }}
            aside={{
                width: { base: '100%', md: 400, lg: 550 },
                breakpoint: 'md',
                collapsed: {
                    desktop: !outputOpened,
                    mobile: !outputOpened
                },
            }}
            navbar={{
                width: { base: '100%', md: 400, lg: 400 },
                breakpoint: 'sm',
                collapsed: {
                    desktop: !(width > 1000) && !settingsOpened,
                    mobile: !settingsOpened
                },
            }}
            padding="md"
        >
            <Header />
            <NavBar />
            <Main />
            <Aside />
            <Footer />
        </AppShell>
    )
}
