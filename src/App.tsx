import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {
    Accordion,
    ActionIcon,
    AppShell,
    Autocomplete,
    Badge,
    Box,
    Burger,
    Button,
    Center,
    Container,
    Fieldset,
    Flex,
    Group,
    MantineProvider,
    Modal,
    NativeSelect,
    NumberInput,
    Paper, Popover,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
    Slider,
    Space,
    Stack,
    Switch,
    Tabs,
    Text,
    TextInput,
    Timeline,
    Title,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {theme} from "./theme.js";
import {ImmolateClassic} from "./modules/ImmolateWrapper/CardEngines/immolateClassic.ts";
import {CardEngineWrapper, MiscCardSource} from "./modules/ImmolateWrapper";

import {AnalyzeOptions, blinds, LOCATIONS, options, SeedsWithLegendary} from "./modules/const.js"
import {toHeaderCase} from 'js-convert-case';
import {useCallback, useEffect, useMemo, useState} from "react";
import {useViewportSize} from "@mantine/hooks";
import {Ante, Pack, Seed} from "./modules/ImmolateWrapper/CardEngines/Cards.ts";
import {
    IconCards,
    IconJoker,
    IconPlayCard,
    IconSearch,
    IconShoppingCart,
    IconShoppingCartOff
} from "@tabler/icons-react";
import {Carousel, Embla} from "@mantine/carousel";
import {openSpotlight, Spotlight} from "@mantine/spotlight";
import {useCardStore} from "./modules/state/store.ts";
import {GameCard} from "./components/cards.tsx";
import {Boss, Tag, Voucher} from "./components/gameElements.tsx";
import {BuyWrapper} from "./components/buyerWrapper.tsx";
import {BuyMetaData} from "./modules/classes/BuyMetaData.ts";

//@ts-ignore

function SeedInputAutoComplete({seed, setSeed}: { seed: string, setSeed: (seed: string) => void }) {
    return (
        <Autocomplete
            flex={1}
            label={'Seed'}
            placeholder={'Enter Seed'}
            value={seed}
            onChange={(e) => setSeed(e)}
            data={[
                {
                    group: 'Popular Seeds',
                    items: [
                        '7LB2WVPK',
                        'PHQ8P93R',
                        '8Q47WV6K',
                        'CRNWYUXA'
                    ]
                }, {
                    group: 'Generated Seeds With Legendary Jokers',
                    items: SeedsWithLegendary

                }
            ]}
        />
    );
}

function SearchSeedInput({SeedResults}: { SeedResults: Seed | null }) {
    const searchString = useCardStore(state => state.searchState.searchTerm);
    const setSearchString = useCardStore(state => state.setSearchString);
    const goToResults = useCardStore(state => state.setSelectedSearchResult);
    const [searchActive, setSearchActive] = useState(false);
    const handleSearch = useCallback(() => {
        setSearchActive(true)
        openSpotlight()
    }, []);

    const searchResults = useMemo(() => {
        if (searchString === '' || !searchActive) return [];
        const cards: BuyMetaData[] = [];
        let antes: Ante[] = Object?.values(SeedResults?.antes ?? {});

        antes.forEach((ante: Ante) => {
            ante.queue.forEach((card, index) => {
                const cardString = `${(card?.edition && card.edition !== 'No Edition') ? card.edition : ''} ${card.name}`.trim();
                if (cardString.toLowerCase().includes(searchString.toLowerCase())) {
                    cards.push({
                        location: LOCATIONS.SHOP,
                        locationType: LOCATIONS.SHOP,
                        ante: String(ante.ante),
                        name: cardString,
                        index: index,
                        blind: 'smallBlind'
                    })
                }
            })
            console.log(ante.blinds['smallBlind'].packs)
            Object.keys(ante.blinds).forEach((blind) => {
                ante.blinds[blind]?.packs?.forEach((pack) => {
                    pack.cards.forEach((card: any, index: number) => {
                        const cardString = `${card?.edition ?? ''} ${card.name}`.trim();
                        if (cardString.toLowerCase().includes(searchString.toLowerCase())) {
                            cards.push({
                                location: pack.name,
                                locationType: LOCATIONS.PACK,
                                ante: String(ante.ante),
                                name: cardString,
                                index: index,
                                blind: blind
                            })
                        }
                    })
                })
            })
            Object.values(ante.miscCardSources).forEach((source: MiscCardSource) => {
                source.cards.forEach((card: any, index) => {
                    const cardString = `${card?.edition ?? ''} ${card.name}`.trim();
                    if (cardString.toLowerCase().includes(searchString.toLowerCase())) {
                        cards.push({
                            location: source.name,
                            locationType: LOCATIONS.MISC,
                            ante: String(ante.ante),
                            name: cardString,
                            index: index,
                            blind: 'smallBlind'
                        })
                    }
                })
            });
        })
        return cards
    }, [searchString, searchActive])

    return (
        <>
            <Spotlight
                nothingFound="Nothing found..."
                actions={
                    searchResults.map((result: any, index) => {
                            const name = result.name;
                            const edition = result?.['edition'];
                            const label = edition && edition !== 'No Edition' ? `${edition} ${name}` : name;

                            const locationType = result?.locationType;

                            let description = '';
                            if (locationType === LOCATIONS.SHOP) {
                                description += `ANTE ${result.ante} SHOP: Card ${result.index + 1}`;
                            }
                            if (locationType === LOCATIONS.PACK) {
                                description += `ANTE ${result.ante} Blind: ${toHeaderCase(result.blind)} ${result.location}`;
                            }
                            if (locationType === LOCATIONS.MISC) {
                                description += `ANTE ${result.ante} ${result.location}: Card ${result.index + 1}`;
                            }

                            return {
                                id: String(index),
                                label,
                                description,
                                onClick: () => {
                                    // closeSpotlight()
                                    goToResults(result)
                                }
                            }
                        }
                    )}
                searchProps={{
                    value: searchString,
                    onChange: (e) => {
                        setSearchString(e.currentTarget.value)
                    },
                }}
            />
            <Group align={'flex-end'}>
                <TextInput
                    flex={1}
                    value={searchString}
                    placeholder={'Search for cards'}
                    onChange={e => setSearchString(e.currentTarget.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleSearch()
                        }
                    }}
                    rightSection={
                        <ActionIcon onClick={handleSearch}>
                            <IconSearch/>
                        </ActionIcon>
                    }
                />
            </Group>

        </>

    )
}

function Header({SeedResults}: { SeedResults: Seed | null }) {
    const {width} = useViewportSize();
    const start = useCardStore(state => state.applicationState.start)
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const toggleSettings = useCardStore(state => state.toggleSettings);

    const outputOpened = useCardStore(state => state.applicationState.asideOpen);
    const toggleOutput = useCardStore(state => state.toggleOutput);
    return (
        <AppShell.Header>
            <Container fluid h={'100%'}>
                <Group h={'100%'} justify={'space-between'}>
                    {width <= 348 && <Burger opened={settingsOpened} onClick={toggleSettings} size="sm"/>}
                    <Center h={'100%'}>
                        <Title> Blueprint </Title>
                    </Center>
                    <Group align={'center'}>
                        {width > 600 && start && <SearchSeedInput SeedResults={SeedResults}/>}
                        {width > 348 &&
                            <Button onClick={() => toggleSettings()} variant={'transparent'}> Settings </Button>}
                        {/*{width > 700 && seedIsOpen && (*/}
                        {/*    <CopyButton value={shareLink}>*/}
                        {/*        {({copied, copy}) => (*/}
                        {/*            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>*/}
                        {/*                {copied ? 'Copied url' : 'Copy url'}*/}
                        {/*            </Button>*/}
                        {/*        )}*/}
                        {/*    </CopyButton>*/}
                        {/*)}*/}
                        <Burger opened={outputOpened} onClick={toggleOutput} size="sm"/>
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>
    )
}

function UnlocksModal() {
    const selectOptionsModalOpen = useCardStore(state => state.applicationState.selectOptionsModalOpen);
    const closeSelectOptionModal = useCardStore(state => state.closeSelectOptionModal);
    const selectedOptions = useCardStore(state => state.immolateState.selectedOptions);
    const setSelectedOptions = useCardStore(state => state.setSelectedOptions);
    if (!selectOptionsModalOpen) return null;
    return (
        <Modal size="auto" title={'Unlocks'} opened={selectOptionsModalOpen} onClose={() => closeSelectOptionModal()}>
            <Container fluid>
                <Switch.Group
                    defaultValue={options}
                    label="Unlocked Items "
                    description="Items that you have unlocked by playing the game"
                    withAsterisk
                    value={options.filter((_: any, i: number) => selectedOptions[i])}
                    onChange={setSelectedOptions}
                >
                    <SimpleGrid cols={{base: 2, md: 4, lg: 6}} mb={'lg'} mt={'xs'}>
                        {
                            options.map((option: string, i: number) => (
                                <Switch key={i} value={option} label={option}/>))
                        }
                    </SimpleGrid>
                </Switch.Group>
                <Group justify={'flex-end'}>
                    <Button onClick={() => setSelectedOptions(options)}> Select All </Button>
                    <Button onClick={() => setSelectedOptions([])}> Remove All </Button>
                </Group>
            </Container>
        </Modal>
    )
}

function NavBar() {
    const theme = useMantineTheme();
    const analyzeState = useCardStore(state => state.immolateState);
    const {seed, deck, stake, gameVersion: version, antes, cardsPerAnte} = analyzeState;
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const setSeed = useCardStore(state => state.setSeed);
    const setDeck = useCardStore(state => state.setDeck);
    const setStake = useCardStore(state => state.setStake);
    const setVersion = useCardStore(state => state.setGameVersion);
    const setAntes = useCardStore(state => state.setAntes);
    const setCardsPerAnte = useCardStore(state => state.setCardsPerAnte);
    const setShowCardSpoilers = useCardStore(state => state.setShowCardSpoilers);

    const openSelectOptionModal = useCardStore(state => state.openSelectOptionModal);
    const reset = useCardStore(state => state.reset);
    const handleAnalyzeClick = () => {
    }
    return (
        <AppShell.Navbar p="md">
            <UnlocksModal/>
            <AppShell.Section>Settings</AppShell.Section>
            <AppShell.Section grow my="md" component={ScrollArea} scrollbars={'y'}>
                <SeedInputAutoComplete
                    seed={seed}
                    setSeed={setSeed}
                />
                <NumberInput
                    label={'Max Ante'}
                    defaultValue={8}
                    value={antes}
                    onChange={(val) => setAntes(Number(val))}
                />
                <NativeSelect
                    label={'Choose Deck'}
                    value={deck}
                    onChange={(e) => setDeck(e.currentTarget.value)}
                >
                    <option value="Red Deck">Red Deck</option>
                    <option value="Blue Deck">Blue Deck</option>
                    <option value="Yellow Deck">Yellow Deck</option>
                    <option value="Green Deck">Green Deck</option>
                    <option value="Black Deck">Black Deck</option>
                    <option value="Magic Deck">Magic Deck</option>
                    <option value="Nebula Deck">Nebula Deck</option>
                    <option value="Ghost Deck">Ghost Deck</option>
                    <option value="Abandoned Deck">Abandoned Deck</option>
                    <option value="Checkered Deck">Checkered Deck</option>
                    <option value="Zodiac Deck">Zodiac Deck</option>
                    <option value="Painted Deck">Painted Deck</option>
                    <option value="Anaglyph Deck">Anaglyph Deck</option>
                    <option value="Plasma Deck">Plasma Deck</option>
                    <option value="Erratic Deck">Erratic Deck</option>
                </NativeSelect>
                <NativeSelect
                    label={'Choose Stake'}
                    value={stake}
                    onChange={(e) => setStake(e.currentTarget.value)}
                >
                    <option value="White Stake">White Stake</option>
                    <option value="Red Stake">Red Stake</option>
                    <option value="Green Stake">Green Stake</option>
                    <option value="Black Stake">Black Stake</option>
                    <option value="Blue Stake">Blue Stake</option>
                    <option value="Purple Stake">Purple Stake</option>
                    <option value="Orange Stake">Orange Stake</option>
                    <option value="Gold Stake">Gold Stake</option>
                </NativeSelect>
                <NativeSelect
                    label={'Choose Version'}
                    value={version}
                    onChange={(e) => setVersion(e.currentTarget.value)}
                >
                    <option value="10106">1.0.1f</option>
                    <option value="10103">1.0.1c</option>
                    <option value="10014">1.0.0n</option>
                </NativeSelect>
                <NumberInput
                    min={0}
                    defaultValue={50}
                    max={300}
                    label={'Cards per ante'}
                    color="blue"
                    value={cardsPerAnte}
                    onChange={(v) => setCardsPerAnte(Number(v))}

                />
                <Group>
                    <Box>
                        <Text mb={0} fz={'xs'}>Show Joker Spoilers</Text>
                        <Tooltip label="Cards that give jokers, are replaced with the joker the card would give."
                                 refProp="rootRef">
                            <Switch
                                size={'xl'}
                                checked={showCardSpoilers}
                                thumbIcon={showCardSpoilers ? (<IconJoker color={'black'}/>) : (
                                    <IconPlayCard color={'black'}/>)}
                                onChange={e => setShowCardSpoilers(e.currentTarget.checked)}
                            />
                        </Tooltip>
                    </Box>
                    <Box mb={'sm'}>

                    </Box>
                </Group>

            </AppShell.Section>
            <AppShell.Section my="md">
                <Stack>
                    <Button color={theme.colors.blue[9]} onClick={() => openSelectOptionModal()}>
                        Modify Unlocks
                    </Button>
                    <Button color={theme.colors.red[9]} variant={'filled'} onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button color={theme.colors.green[9]} variant={'filled'} onClick={handleAnalyzeClick}>
                        Analyze Seed
                    </Button>
                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    )
}

function QuickAnalyze() {
    const seed = useCardStore(state => state.immolateState.seed);
    const setSeed = useCardStore(state => state.setSeed);
    const deck = useCardStore(state => state.immolateState.deck);
    const setDeck = useCardStore(state => state.setDeck);
    const setStart = useCardStore(state => state.setStart);
    const sectionWidth = 130;
    const select = (
        <NativeSelect
            rightSectionWidth={28}
            styles={{
                input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: sectionWidth,
                    marginRight: -2,
                },
            }}
            value={deck}
            onChange={(e) => setDeck(e.currentTarget.value)}
        >
            <option value="Red Deck">Red Deck</option>
            <option value="Blue Deck">Blue Deck</option>
            <option value="Yellow Deck">Yellow Deck</option>
            <option value="Green Deck">Green Deck</option>
            <option value="Black Deck">Black Deck</option>
            <option value="Magic Deck">Magic Deck</option>
            <option value="Nebula Deck">Nebula Deck</option>
            <option value="Ghost Deck">Ghost Deck</option>
            <option value="Abandoned Deck">Abandoned Deck</option>
            <option value="Checkered Deck">Checkered Deck</option>
            <option value="Zodiac Deck">Zodiac Deck</option>
            <option value="Painted Deck">Painted Deck</option>
            <option value="Anaglyph Deck">Anaglyph Deck</option>
            <option value="Plasma Deck">Plasma Deck</option>
            <option value="Erratic Deck">Erratic Deck</option>
        </NativeSelect>
    );
    return (
        <Group align={'flex-end'}>
            <TextInput
                flex={1}
                type="text"
                placeholder="Enter Seed"
                label="Analyze Seed"
                value={seed}
                onChange={(e) => setSeed(e.currentTarget.value)}
                rightSection={select}
                rightSectionWidth={sectionWidth}
            />
            <Button onClick={() => setStart(seed.length >= 8)}> Analyze Seed </Button>
        </Group>

    );

}

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
                                    metaData={{
                                        location: LOCATIONS.SHOP,
                                        locationType: LOCATIONS.SHOP,
                                        index: index,
                                        ante: tabName,
                                        blind: selectedBlind,
                                        name: card.name,
                                        link: `https://balatrogame.fandom.com/wiki/${card.name}`,
                                        rarity: card?.rarity
                                    }}
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
                                        ante: tabName,
                                        blind: selectedBlind,
                                        itemType: 'voucher',
                                        name: ante?.voucher ?? "",
                                        index: 0,
                                        locationType: LOCATIONS.VOUCHER,
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
                                                                        locationType: LOCATIONS.PACK,
                                                                        index: cardIndex,
                                                                        ante: tabName,
                                                                        blind: selectedBlind,
                                                                        itemType: 'card',
                                                                        name: card?.edition ? `${card?.edition} ${card.name}` : card.name,
                                                                        link: `https://balatrogame.fandom.com/wiki/${card.name}`,
                                                                        rarity: card?.rarity
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

function Main({SeedResults}: { SeedResults: Seed | null }) {
    const {width} = useViewportSize();
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const setSelectedAnte = useCardStore(state => state.setSelectedAnte);
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const setSelectedBlind = useCardStore(state => state.setSelectedBlind);
    // @ts-ignore
    return (
        <AppShell.Main>
            {
                !SeedResults &&
                <QuickAnalyze/>
            }
            {
                SeedResults &&
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
                                        <Popover>
                                            <Popover.Target>
                                                <Box>
                                                    <Tag tagName={SeedResults.antes[selectedAnte]?.tags?.[i]}/>
                                                </Box>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <Box>
                                                    <Text>{SeedResults.antes[selectedAnte]?.tags?.[i]}</Text>
                                                </Box>
                                            </Popover.Dropdown>
                                        </Popover>

                                    )
                                    }
                                    {i === 2 && <Boss bossName={SeedResults.antes[selectedAnte]?.boss ?? ''}/>}

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
            }
        </AppShell.Main>
    )
}

function MiscCardSourcesDisplay({miscSources}: { miscSources?: MiscCardSource[] }) {
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
    const [embla, setEmbla] = useState<Embla | null>(null);
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
                                        align="start"
                                        withControls={false}
                                        height={190}
                                        dragFree
                                    >
                                        {cards?.map((card: any, i: number) => (
                                            <Carousel.Slide key={i}>
                                                <BuyWrapper
                                                    metaData={{
                                                        location: name,
                                                        locationType: LOCATIONS.MISC,
                                                        index: i,
                                                        ante: String(currentAnte),
                                                        blind: "smallBlind",
                                                        name: card?.name,
                                                        link: `https://balatrogame.fandom.com/wiki/${card.name}`,
                                                        rarity: card?.rarity,
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
            </Accordion>
        </Paper>
    );
}

function PurchaseTimeline({buys}: { buys: { [key: string]: BuyMetaData } }) {
    const buyEntries = Object.entries(buys);
    const removeBuy = useCardStore(state => state.removeBuy);

    if (buyEntries.length === 0) {
        return (
            <Paper p="md" withBorder>
                <Text c="dimmed" size="sm" ta="center">No purchases yet</Text>
            </Paper>
        );
    }

    return (
        <Paper p="md" withBorder>
            <Title order={3} mb="md">Purchase History</Title>
            <Timeline active={buyEntries.length - 1} bulletSize={24} lineWidth={2}>
                {buyEntries.map(([key, buyData]) => {
                    // Parse the key to extract information
                    const [, , index] = key.split('-');
                    // console.log(buyData)
                    return (
                        <Timeline.Item
                            key={key}
                            bullet={<IconJoker size={12}/>}
                            title={
                                <Group justify="space-between" wrap="nowrap">
                                    <Text size="sm" fw={500}>
                                        {buyData.name}
                                    </Text>
                                    <ActionIcon
                                        size="sm"
                                        color="red"
                                        variant="subtle"
                                        onClick={() => removeBuy(buyData)}
                                        title="Return item"
                                    >
                                        <IconShoppingCartOff size={48}/>
                                    </ActionIcon>
                                </Group>
                            }
                        >
                            <Text></Text>
                            <Text size="xs" c="dimmed" mt={4}>
                                {
                                    buyData.locationType === LOCATIONS.PACK ?
                                        `${buyData.location} - Card ${Number(index) + 1}` :
                                        buyData.locationType === LOCATIONS.MISC ?
                                            `${buyData.location} - Card ${Number(index) + 1}` :
                                            `Shop Item ${Number(index) + 1}`}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {toHeaderCase(buyData.blind)}
                            </Text>
                            <Badge size="xs" variant="light" color="blue" mt={4}>
                                Ante {buyData.ante}
                            </Badge>
                        </Timeline.Item>
                    );
                })}
            </Timeline>

            <Group justify="space-between" mt="md">
                <Text size="sm" fw={500}>Total Purchases:</Text>
                <Badge size="lg">{buyEntries.length}</Badge>
            </Group>
        </Paper>
    );
}

function Aside({SeedResults}: { SeedResults: Seed | null }) {
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const anteData = SeedResults?.antes[selectedAnte];
    const miscSources = anteData?.miscCardSources;
    const buys = useCardStore(state => state.shoppingState.buys);
    const theme = useMantineTheme();

    const tab = useCardStore(state => state.applicationState.asideTab);
    const setTab = useCardStore(state => state.setAsideTab);

    return (
        <AppShell.Aside p="md">
            <AppShell.Section>
                <Tabs value={tab} onChange={(e) => setTab(`${e}`)}>
                    <Tabs.List grow mb="md">
                        <Tabs.Tab
                            value="sources"
                            leftSection={<IconCards size={16}/>}
                        >
                            Card Sources
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="purchases"
                            leftSection={<IconShoppingCart size={16}/>}
                            rightSection={
                                <Badge size="xs" circle variant="filled" color={theme.colors.blue[7]}>
                                    {Object.keys(buys).length}
                                </Badge>
                            }
                        >
                            Purchases
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </AppShell.Section>
            <AppShell.Section component={ScrollArea} scrollbars="y">
                <Tabs value={tab}>
                    <Tabs.Panel value="sources">
                        {SeedResults ? (
                            <MiscCardSourcesDisplay miscSources={miscSources}/>
                        ) : (
                            <Center h={200}>
                                <Text c="dimmed">Select a seed to view card sources</Text>
                            </Center>
                        )}
                    </Tabs.Panel>
                    <Tabs.Panel value="purchases">
                        <PurchaseTimeline buys={buys}/>
                    </Tabs.Panel>
                </Tabs>
            </AppShell.Section>
        </AppShell.Aside>
    )
}

function Footer() {
    return (
        <AppShell.Footer>
            <Text ta={'center'} fz={'xs'}>
                Made with Mantine, Vite, Zustand, Immolate.
            </Text>
            <Text ta={'center'} fz={'xs'}>
                Made by Michael Walker 2025
            </Text>
        </AppShell.Footer>
    )
}

function Blueprint({SeedResults}: { SeedResults: Seed | null }) {
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const outputOpened = useCardStore(state => state.applicationState.asideOpen);
    const {width} = useViewportSize();
    const isSmallScreen = width < 1280;

    return (
        <AppShell
            header={{height: {base: 60, md: 70, lg: 80}}}
            aside={{
                width: {base: '100%', md: 400, lg: 550},
                breakpoint: 'md',
                collapsed: {
                    desktop: !outputOpened || (isSmallScreen && settingsOpened),
                    mobile: !outputOpened
                },
            }}
            navbar={{
                width: {base: '100%', md: 400, lg: 400},
                breakpoint: 'sm',
                collapsed: {
                    desktop: !settingsOpened || (isSmallScreen && outputOpened),
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


export default function App() {
    const analyzeState = useCardStore(state => state.immolateState);
    const {seed, deck, stake, showmanOwned, gameVersion: version, antes, cardsPerAnte} = analyzeState;

    const start = useCardStore(state => state.applicationState.start);
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const unlocks: boolean[] = useCardStore(state => state.immolateState.selectedOptions);
    const SeedResults = useMemo(() => {
            if (seed.length < 6 || !start) return null;
            const engine = new ImmolateClassic(seed);
            engine.InstParams(deck, stake, showmanOwned, version);
            engine.initLocks(1, false, true);
            const analyzer: CardEngineWrapper = new CardEngineWrapper(engine);
            const transactions = {buys, sells}

            const options: AnalyzeOptions = {
                showCardSpoilers,
                unlocks,
                updates: [],
                ...transactions
            };

            let results = analyzer.analyzeSeed(antes, cardsPerAnte, options);
            engine.delete();
            return results;
        },
        [analyzeState, start, buys, showCardSpoilers, unlocks]
    );


    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Blueprint SeedResults={SeedResults}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
