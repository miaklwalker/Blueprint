import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {CodeHighlight} from "@mantine/code-highlight";
import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    ActionIcon,
    AppShell,
    Box,
    Burger,
    Button, Center,
    Container, CopyButton,
    Divider,
    Fieldset,
    Flex,
    Grid,
    Group,
    MantineProvider,
    NativeSelect,
    NumberInput,
    Paper,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
    Slider,
    Stack,
    Tabs,
    Text,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core";
import {theme} from "./theme";
import {
    analyzeSeed,
    determineItemType,
    extractShopQueues,
    maskToCanvas,
    parseCardItem,
    parseStandardCardName,
    renderBoss,
    renderStandardCard,
    renderTag,
    renderVoucher
} from "./modules/utils.js";
import {buildShareableUrl, createBlueprintStore} from "./modules/store.js";
import {useStore} from "zustand";
import {Carousel} from "@mantine/carousel";
import {blinds} from "./modules/const.js";
import {IconSearch, IconShare} from "@tabler/icons-react";
import {openSpotlight, Spotlight,} from "@mantine/spotlight";
import {useDebouncedValue, useViewportSize} from "@mantine/hooks";

const StoreContext = createContext(null)

function useBlueprintStore(selector) {
    const blueprintStore = useContext(StoreContext);
    return useStore(blueprintStore, selector)
}

function StoreProvider({children}) {
    const store = useRef(createBlueprintStore).current
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    )
}

function Header() {
    const {width} = useViewportSize();
    const settingsOpened = useBlueprintStore(state => state.settingsOpen);
    const outputOpened = useBlueprintStore(state => state.outputOpen);
    const seedIsOpen = useBlueprintStore(state => state.seedIsOpen);
    const toggleSettings = useBlueprintStore(state => state.toggleSettingsOpen);
    const toggleOutput = useBlueprintStore(state => state.toggleOutputOpen);
    const state = useBlueprintStore(state => state)
    const shareLink = useMemo(() => buildShareableUrl(state, 0), [state])
    return (
        <AppShell.Header>
            <Container h={'100%'} fluid>
                <Group h={'100%'} justify="space-between">
                    {width <= 348 && <Burger opened={settingsOpened} onClick={toggleSettings} size="sm"/>}
                    <Center h={'100%'}>
                        <Title> Blueprint </Title>
                    </Center>

                    <Group align={'center'}>
                        {width > 600 && seedIsOpen && <SearchSeedInput/>}
                        {width > 348 && <Button onClick={toggleSettings} variant={'transparent'}> Settings </Button>}
                        {width > 700 && seedIsOpen && (
                            <CopyButton value={shareLink}>
                                {({copied, copy}) => (
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                        {copied ? 'Copied url' : 'Copy url'}
                                    </Button>
                                )}
                            </CopyButton>
                        )}
                        <Burger opened={outputOpened} onClick={toggleOutput} size="sm"/>
                    </Group>

                </Group>
            </Container>
        </AppShell.Header>
    )
}

function Settings() {
    const reset = useBlueprintStore(state => state.reset)
    const seedIsOpen = useBlueprintStore(state => state.seedIsOpen);
    const setSeedIsOpen = useBlueprintStore(state => state.setSeedIsOpen);
    const closeSettings = useBlueprintStore(state => state.closeSettings);
    const seed = useBlueprintStore(state => state.seed)
    const deck = useBlueprintStore(state => state.deck)
    const cardsPerAnte = useBlueprintStore(state => state.cardsPerAnte)
    const cardsPerAnteString = useBlueprintStore(state => state.getCardsPerAnteString)
    const stake = useBlueprintStore(state => state.stake)
    const version = useBlueprintStore(state => state.version)
    const ante = useBlueprintStore(state => state.ante)


    const setSeed = useBlueprintStore(state => state.setSeed)
    const setDeck = useBlueprintStore(state => state.setDeck)
    const setCardsPerAnte = useBlueprintStore(state => state.setCardsPerAnte)
    const setStake = useBlueprintStore(state => state.setStake)
    const setVersion = useBlueprintStore(state => state.setVersion)
    const setAnte = useBlueprintStore(state => state.setAnte)

    const selectedOptions = useBlueprintStore(state => state.selectedOptions);
    const setResults = useBlueprintStore(state => state.setResults);

    const analyzeState = useMemo(() => ({
        seed,
        deck,
        cardsPerAnte: cardsPerAnteString(),
        stake,
        version,
        ante,
        selectedOptions
    }), [seed, deck, cardsPerAnteString, stake, version, ante, selectedOptions, cardsPerAnte]);
    const [debounced] = useDebouncedValue(analyzeState, 500);
    useEffect(() => {
        if (!seedIsOpen) return;
        const output = analyzeSeed(debounced)
        setResults(output)
    }, [debounced]);
    const handleAnalyzeClick = useCallback(() => {
        const output = analyzeSeed(debounced)
        closeSettings();
        setSeedIsOpen(true)
        setResults(output)
    }, [debounced]);

    return (
        <AppShell.Navbar>
            <Title my={'sm'} px={'1rem'} order={4}> Settings </Title>
            <Divider mb={'lg'}/>
            <SimpleGrid cols={1} px={'1rem'}>
                <TextInput
                    label={'seed'}
                    value={seed}
                    onChange={(e) => setSeed(e.currentTarget.value)}
                />
                <NumberInput
                    label={'Max Ante'}
                    defaultValue={8}
                    value={ante}
                    onChange={setAnte}
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
                <Box mb={'sm'}>
                    <Text size="sm"> Cards Per Ante</Text>
                    <Text fz={'xs'} c={'dimmed'} mb={'xs'} truncate="end">{cardsPerAnteString() || ''}</Text>
                    <Slider
                        min={0}
                        defaultValue={50}
                        max={100}
                        label={'Cards per hand'}
                        color="blue"
                        marks={[
                            {value: 0, label: '0'},
                            {value: 50, label: '50'},
                            {value: 100, label: '100'},
                        ]}
                        value={cardsPerAnte}
                        onChange={setCardsPerAnte}

                    />
                </Box>
                <NativeSelect
                    label={'Choose Version'}
                    value={version}
                    onChange={(e) => setVersion(e.currentTarget.value)}
                >
                    <option value="10106">1.0.1f</option>
                    <option value="10103">1.0.1c</option>
                    <option value="10014">1.0.0n</option>
                </NativeSelect>
                <Button color={'red'} variant={'filled'} onClick={() => reset()}> Reset </Button>
                <Button color={'blue'} variant={'filled'} onClick={handleAnalyzeClick}> Analyze Seed </Button>
            </SimpleGrid>
        </AppShell.Navbar>
    )
}

function Output() {
    const {width} = useViewportSize();
    const results = useBlueprintStore(state => state.results)
    const settingsOpened = useBlueprintStore(state => state.settingsOpen);
    const asideSizes = settingsOpened ?
        {base: 200, md: 300, lg: 400} :
        {base: Math.min(400, width), md: 600, lg: 800};
    return (
        <AppShell.Aside>
            <ScrollArea
                w={'100%'}
                h={'100%'}
                type="scroll"
            >
                <CodeHighlight
                    w={{base: '100%', lg: asideSizes.lg}}
                    maw={'100%'}
                    code={results || ''}
                    language={'plaintext'}
                />
            </ScrollArea>
        </AppShell.Aside>
    )
}

function Footer() {
}

function AnalyzeSeedInput() {
    const setSeedIsOpen = useBlueprintStore(state => state.setSeedIsOpen)
    const seed = useBlueprintStore(state => state.seed)
    const setSeed = useBlueprintStore(state => state.setSeed)
    const deck = useBlueprintStore(state => state.deck)
    const cardsPerAnteString = useBlueprintStore(state => state.getCardsPerAnteString)
    const stake = useBlueprintStore(state => state.stake)
    const version = useBlueprintStore(state => state.version)
    const ante = useBlueprintStore(state => state.ante);
    const selectedOptions = useBlueprintStore(state => state.selectedOptions);
    const setResults = useBlueprintStore(state => state.setResults);

    const analyzeState = useMemo(() => ({
        seed,
        deck,
        cardsPerAnte: cardsPerAnteString(),
        stake,
        version,
        ante,
        selectedOptions
    }), [seed, deck, cardsPerAnteString, stake, version, ante, selectedOptions]);
    const [debounced] = useDebouncedValue(analyzeState, 500);
    const handleAnalyzeClick = useCallback(() => {
        const output = analyzeSeed(debounced)
        setSeedIsOpen(true)
        setResults(output)
    }, [debounced]);
    return (
        <Box>
            <Text>Enter Seed</Text>
            <Group>
                <TextInput
                    value={seed}
                    onChange={(e) => setSeed(e.currentTarget.value)}
                    flex={1}
                    placeholder={'Enter Seed'}
                />
                <Button onClick={handleAnalyzeClick}> Submit </Button>
            </Group>
        </Box>
    )
}

class SearchResult {
    constructor({ante, blind, location, index, name}) {
        this.ante = ante
        this.blind = blind || undefined
        this.location = location
        this.index = index
        this.name = name
    }
}

function SearchSeedInput({...props}) {
    const results = useBlueprintStore(state => state.results)
    const searchString = useBlueprintStore(state => state.globalSearch);
    const setSearchString = useBlueprintStore(state => state.setGlobalSearchString)
    const searchResults = useBlueprintStore(state => state.searchResults)
    const setSearchResults = useBlueprintStore(state => state.setSearchResults)
    const goToResults = useBlueprintStore(state => state.goToResult)


    useEffect(() => {
        const queues = extractShopQueues(results);
        const resultsFound = [];
        const LOWER_CASE_SEARCH_STRING = searchString.toLowerCase();
        for (let {packs, queue, tags, voucher, boss, title: ante} of queues) {
            let title = ante.replaceAll('=', '');
            let inQueue = queue.some(card => card?.toLowerCase()?.includes(LOWER_CASE_SEARCH_STRING));
            if (inQueue) {
                let index = queue.findIndex(card => card?.toLowerCase().includes(LOWER_CASE_SEARCH_STRING));
                let name = queue[index].split(')')[1]
                resultsFound.push(new SearchResult({ante: title, location: 'queue', index, name}))
            }
            for (let i = 0; i < packs.length; i++) {
                //todo Make pack determine Blind
                let pack = packs[i];
                const [name, contents] = pack.split('-');
                if (contents?.toLowerCase()?.includes(LOWER_CASE_SEARCH_STRING)) {
                    let matchName = contents.split(',').find(item => item?.toLowerCase().includes(LOWER_CASE_SEARCH_STRING))
                    resultsFound.push(new SearchResult({ante: title, location: name, name: matchName, index: i}))
                }
            }
            // User Could Also Be Searching For Voucher Or Tags Or Boss
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                if (tag.includes(searchString)) {
                    resultsFound.push(new SearchResult({ante: title, location: 'tags', index: i}))
                }
            }
            if (boss.includes(searchString)) {
                resultsFound.push(new SearchResult({ante: title, location: 'boss', index: 0}))
            }
            if (voucher.includes(searchString)) {
                resultsFound.push(new SearchResult({ante: title, location: 'voucher', index: 0}))
            }
        }
        setSearchResults(resultsFound)
    }, [searchString, results])

    const handleSearch = useCallback(() => {
        openSpotlight()
    }, []);


    return (
        <>
            <Spotlight
                nothingFound="Nothing found..."
                actions={
                    searchResults.map((result, index) => ({
                        id: index,
                        description: result.name,
                        label: `${result.ante} (${result.location})`,
                        onClick: () => {
                            // closeSpotlight()
                            goToResults(result)
                        }
                    }))
                }
                searchProps={{
                    value: searchString,
                    onChange: (e) => {
                        setSearchString(e.currentTarget.value)
                        handleSearch()
                    },
                }}
            />
            <Group align={'flex-end'} {...props}>
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

function RenderWithCanvas({renderFn, width, height, value}) {
    const renderCanvas = useRef(null);
    useEffect(() => {
        if (renderCanvas.current !== null) {
            if (width) renderCanvas.current.width = width;
            if (height) renderCanvas.current.height = height;
            renderFn(renderCanvas.current, value);
        }
    }, [value])
    return (
        <Box>
            <canvas ref={renderCanvas}/>
        </Box>
    )
}

function RenderCardWithCanvas({width, height, value, selected, searched}) {
    const renderCanvas = useRef(null);
    const {cardName, itemModifiers, itemStickers} = parseCardItem(value);
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
            <Flex direction={'column'}>
                <Box>
                    <canvas style={{
                        width: width,
                        height: height,
                        boxShadow: searched ? '0px 0px 10px 10px rgba(255, 255, 255, 1)' : ''
                    }} ref={renderCanvas}/>
                </Box>
                <Text hiddenFrom={'sm'} fz={'small'} ta={'start'}>{cardName}</Text>
                <Stack>
                    <>
                        {
                            itemModifiers &&
                            itemModifiers.map((modifier, index) => {
                                return (
                                    <Text key={index} c={'dimmed'} fz={'xs'} size={'xs'}>{modifier}</Text>
                                )
                            })
                        }
                    </>
                    <>
                        {
                            itemStickers &&
                            itemStickers.map((sticker, index) => {
                                return (
                                    <Text key={index} c={'dimmed'} fz={'xs'} size={'xs'}>{sticker}</Text>
                                )
                            })
                        }
                    </>
                </Stack>
            </Flex>
        </Paper>
    )
}

function Queue({cards, width = 71, height = 95, scale = 1}) {
    const [embla, setEmbla] = useState(null);
    const selectedResult = useBlueprintStore(state => state.selectedSearchResult);

    useEffect(() => {
        if (embla && selectedResult) {
            if (selectedResult?.location === 'queue' && selectedResult?.index) {
                embla.scrollTo(selectedResult.index - 1)
            }
        }
    }, [embla, selectedResult])
    let slideWidth = width * scale;
    let slideHeight = height * scale;
    let results = cards.map((tag, index) => (
        <Carousel.Slide key={tag} pt={'1rem'}>
            <RenderCardWithCanvas
                searched={selectedResult?.location === 'queue' && selectedResult?.index === index}
                value={tag}
                width={slideWidth}
                height={slideHeight}
            />
        </Carousel.Slide>
    ))
    return (
        <Box maw={'100%'}>
            <Carousel
                // withControls={false}
                // loop={true}
                getEmblaApi={setEmbla}
                align="center"
                initialSlide={6}
                containScroll={"trimSnaps"}
                slideSize={{base: Number(slideWidth + 20)}}
                height={slideHeight + (70 * scale)}
                dragFree
                type="container"
                slideGap={{base: 'md'}}
            >
                {results}
            </Carousel>
        </Box>


    )
}

function Packs({value, width = 71, height = 95, scale = 1}) {
    const selectedBlind = useBlueprintStore(state => state.selectedBlind);
    const tab = useBlueprintStore(state => state.selectedAnte);
    const firstBlindOffset = tab !== 'ANTE 1' ? 2 : 0;
    const offsets = {
        "Small Blind": [
            0,
            2
        ],
        "Big Blind": [
            0 + firstBlindOffset,
            2 + firstBlindOffset
        ],
        "Boss Blind": [
            2 + firstBlindOffset,
            4 + firstBlindOffset
        ]
    }
    const blindOffset = offsets[selectedBlind];

    const packs = value.slice(...blindOffset).map((item, index) => {
        const [title, contents] = item.split('-')
        const count = contents.split(',').length;
        return (
            <Fieldset legend={title} key={index}>
                <SimpleGrid cols={{base: count + 1, lg: 9}}>
                    {
                        contents.split(',').map((item, index) => (
                            <RenderCardWithCanvas key={index} value={item} width={width} height={height} scale={scale}/>
                        ))
                    }
                </SimpleGrid>
            </Fieldset>
        )
    })

    return (
        <Flex justify={'space-evenly'} direction={'column'}>
            {packs}
        </Flex>
    )
}

function AntePanel({ante}) {
    let title = ante.title.replaceAll('=', '');
    const tab = useBlueprintStore(state => state.selectedAnte);
    const selectedBlind = useBlueprintStore(state => state.selectedBlind);
    const setSelectedBlind = useBlueprintStore(state => state.setSelectedBlind)

    const isFirstAnteSmallBlind = (blind) => blind === 'Small Blind' && tab === 'ANTE 1'

    return (
        <Tabs.Panel value={title} key={title}>
            <Paper h={'100%'} withBorder p={'1rem'}>
                <Grid>
                    <Grid.Col order={{base: 5, lg: 1}} span={{base: 2, lg: 4}}>
                        <Group align={'flex-start'} gap={'4rem'}>
                            <Tooltip label={String(ante.boss)}>
                                <Flex direction={'column'} align={'center'} justify={'flex-start'}>
                                    <Title order={4} ta={'center'} mb={'.25rem'}> Boss </Title>
                                    <RenderWithCanvas
                                        name={'Boss'}
                                        value={ante.boss}
                                        renderFn={renderBoss}
                                        width={34}
                                        height={34}
                                    />
                                </Flex>
                            </Tooltip>

                        </Group>
                    </Grid.Col>
                    <Grid.Col order={{base: 1, lg: 2}} span={{base: 12, lg: 4}}>
                        <Box mb={'lg'} w={'100%'}>
                            <Title order={4} mb={'.25rem'}> Blind </Title>
                            <SegmentedControl
                                value={selectedBlind}
                                onChange={setSelectedBlind}
                                fullWidth
                                radius="xl"
                                mb={'sm'}
                                data={blinds.map(blind => ({
                                    value: blind,
                                    label: blind,
                                    disabled: isFirstAnteSmallBlind(blind)
                                }))}
                            />
                        </Box>
                    </Grid.Col>
                    <Grid.Col order={{base: 4, lg: 3}} span={{base: 2, lg: 4}}>
                        <Flex direction={'column'} align={'center'} justify={'flex-start'}>
                            <Title order={4} mb={'.25rem'}> Tags </Title>
                            <Group justify={'center'}>
                                {ante.tags.map((tag, index) => (
                                    <Tooltip key={index} label={String(tag)}>
                                        <Box w={'fit-content'}>
                                            <RenderWithCanvas
                                                renderFn={renderTag}
                                                value={tag}
                                                width={34}
                                                height={34}
                                            />
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Group>
                        </Flex>
                    </Grid.Col>
                    <Grid.Col order={{base: 2, lg: 4}} span={{base: 12, lg: 12}}>
                        <Title order={4} ta={'left'} mb={'.25rem'}> Shop </Title>
                        <Queue cards={ante.queue}/>
                    </Grid.Col>
                    <Grid.Col order={{base: 3, lg: 5}} span={{base: 6, sm: 3, lg: 1}}>
                        <Tooltip label={ante.voucher}>
                            <Flex w={'fit-content'} direction={'column'} justify={'flex-start'}>
                                <Title order={4} ta={'left'} mb={'.25rem'}> Voucher </Title>
                                <RenderWithCanvas
                                    name={'Voucher'}
                                    value={ante.voucher}
                                    renderFn={renderVoucher}
                                    width={71}
                                    height={95}
                                />
                                <Text fz={'xs'} ta={'center'} c={'dimmed'}>{ante.voucher}</Text>
                            </Flex>
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col order={{base: 6, lg: 6}} span={{base: 12, lg: 11}}>
                        <Packs value={ante.packs}/>
                    </Grid.Col>
                </Grid>
            </Paper>
        </Tabs.Panel>
    )
}

function SeedDisplay() {
    const {width} = useViewportSize()
    const tab = useBlueprintStore(state => state.selectedAnte);
    const setTab = useBlueprintStore(state => state.setSelectedAnte);
    const results = useBlueprintStore(state => state.results);
    const seedDetails = useMemo(() => {
        if (!results) return null;
        return extractShopQueues(results)
    }, [results])
    if (!seedDetails) return null
    return (
        <>
            <SearchSeedInput
                hiddenFrom={'sm'}
                mb={'sm'}
            />
            <NativeSelect
                onChange={e => setTab(e.currentTarget.value)}
                data={seedDetails.map(({title}) => title.replaceAll('=', ''))}
                value={tab}
                mb={'sm'}
                hiddenFrom="sm"
            />

            <Tabs
                w={'100%'}
                variant="pills"
                orientation={"vertical"}
                defaultValue={'ANTE 1'}
                value={String(tab)}
                onChange={(e) => setTab(e)}
                keepMounted={false}
            >
                <Tabs.List style={{display: width > 767 ? 'revert' : 'none'}} mr={'2rem'}>
                    <ScrollArea mah={'60vh'}>
                        {
                            seedDetails.map((seed) => {
                                let title = seed.title.replaceAll('=', '')
                                return (
                                    <Tabs.Tab value={title} key={title}>
                                        {title}
                                    </Tabs.Tab>
                                )
                            })
                        }
                    </ScrollArea>

                </Tabs.List>
                {
                    seedDetails.map((ante, i) => <AntePanel ante={ante} key={i}/>)
                }

            </Tabs>
        </>

    )
}

function UI() {
    const seedIsOpen = useBlueprintStore(state => state.seedIsOpen);
    return (
        <AppShell.Main>
            <Container fluid px={'1rem'}>
                {!seedIsOpen && <AnalyzeSeedInput/>}
                {seedIsOpen && <SeedDisplay/>}
            </Container>
        </AppShell.Main>
    )
}

function BluePrint() {
    const settingsOpened = useBlueprintStore(state => state.settingsOpen);
    const outputOpened = useBlueprintStore(state => state.outputOpen);

    const asideSizes = (settingsOpened && outputOpened) ?
        {base: 200, md: 300, lg: 400} :
        {base: 400, md: 600, lg: 800};


    return (
        <AppShell
            header={{height: {base: 60, md: 70, lg: 80}}}
            aside={{
                width: asideSizes,
                breakpoint: 'md',
                collapsed: {desktop: !outputOpened, mobile: !outputOpened}
            }}
            navbar={{
                width: {base: 200, md: 300, lg: 400},
                breakpoint: 'sm',
                collapsed: {desktop: !settingsOpened, mobile: settingsOpened},
            }}
            padding="md"
        >
            <Header/>
            <Settings/>
            <UI/>
            <Output/>
        </AppShell>
    )
}


function IndexPage() {
    return (
        <StoreProvider>
            <BluePrint/>
        </StoreProvider>
    );
}

export default function App() {
    return <MantineProvider defaultColorScheme={'dark'} theme={theme}><IndexPage/></MantineProvider>;
}
