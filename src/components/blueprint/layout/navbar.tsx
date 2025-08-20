import {
    AppShell,
    Box,
    Button,
    Group,
    InputLabel,
    NativeSelect,
    NumberInput,
    ScrollArea,
    SegmentedControl, Select,
    Stack,
    Switch,
    Text,
    Tooltip, useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import {useCardStore} from "../../../modules/state/store.ts";
import UnlocksModal from "../../unlocksModal.tsx";
import {
    IconFileText,
    IconJoker,
    IconLayout,
    IconListSearch,
    IconMoon,
    IconPlayCard,
    IconSun
} from "@tabler/icons-react";
import SeedInputAutoComplete from "../../SeedInputAutoComplete.tsx";
import {useEffect} from "react";
import {themeNames} from "../../../App.tsx";

export default function NavBar({ themeName , setTheme }: { themeName: string, setTheme: any }) {
    const theme = useMantineTheme();
    const colorScheme = useMantineColorScheme()
    const viewMode = useCardStore(state => state.applicationState.viewMode);
    const setViewMode = useCardStore(state => state.setViewMode);
    const events = useCardStore(state => state.eventState.events);
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
    const setStart = useCardStore(state => state.setStart);
    const openSelectOptionModal = useCardStore(state => state.openSelectOptionModal);
    const reset = useCardStore(state => state.reset);
    const hasSettingsChanged = useCardStore((state) => state.applicationState.hasSettingsChanged);


    const start = useCardStore(state => state.applicationState.start);
    const analyzeSeed = useCardStore(state => state.analyzeSeed);
    const seedResults = useCardStore(state => state.applicationState.analyzedResults);
    const buys = useCardStore(state => state.shoppingState.buys);
    const handleAnalyzeClick = () => {
        setStart(true);
        analyzeSeed();
    }

    useEffect(() => {
        if(start && !seedResults){
            analyzeSeed()
        }
    }, [start,seedResults]);
    useEffect(()=>{
        if(start && seedResults){
            // If we have results, and the user changes the showCardSpoilers, we need to re-analyze the seed
            analyzeSeed();
        }
    },[showCardSpoilers, deck, stake, version, antes, cardsPerAnte, events, buys])


    return (
        <AppShell.Navbar p="md">
            <UnlocksModal/>
            <AppShell.Section>
                <SegmentedControl
                    fullWidth
                    value={viewMode}
                    onChange={(value: string) => setViewMode(value)}
                    data={[
                        {
                            value: 'blueprint',
                            label: (
                                <Group gap="xs">
                                    <IconLayout size={16}/>
                                    <Text>Blueprint</Text>
                                </Group>
                            )
                        },
                        {
                            value: 'simple',
                            label: (
                                <Group gap="xs">
                                    <IconListSearch size={16}/>
                                    <Text>Efficiency</Text>
                                </Group>
                            )
                        },
                        {
                            value: 'text',
                            label: (
                                <Group gap="xs">
                                    <IconFileText size={16}/>
                                    <Text>Text</Text>
                                </Group>
                            )
                        }
                    ]}
                    mb="sm"
                />
                <Group align={'flex-end'}>
                    <Select
                        label={'Theme'}
                        value={themeName}
                        onChange={setTheme}
                        data={themeNames}
                    />
                    <Switch
                        size={'xl'}
                        checked={colorScheme.colorScheme === 'dark'}
                        thumbIcon={colorScheme.colorScheme === 'dark' ? (<IconSun size={16} color={'var(--mantine-color-teal-6)'}/> ) : ( <IconMoon size={16}/>)}

                        onChange={colorScheme.toggleColorScheme}
                    />
                </Group>

            </AppShell.Section>
            <AppShell.Section pr={'xs'} grow my="md" component={ScrollArea} scrollbars={'y'}>

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
                    mb={'md'}
                >
                    <option value="10106">1.0.1f</option>
                    <option value="10103">1.0.1c</option>
                    <option value="10014">1.0.0n</option>
                </NativeSelect>
                <InputLabel> Cards per Ante</InputLabel>
                <Text fz={'xs'} c={'dimmed'}>
                    It is recommended to keep this number under 200.
                </Text>
                <Button.Group w={'100%'} mb={'lg'}>
                    <Button variant="default" c={'blue'} onClick={() => setCardsPerAnte(50)}>50</Button>
                    <Button variant="default" c={'red'} onClick={() => setCardsPerAnte(cardsPerAnte - 50)}>-50</Button>
                    <Button.GroupSection flex={1} variant="default" bg="var(--mantine-color-body)" miw={80}>
                        {cardsPerAnte}
                    </Button.GroupSection>
                    <Button variant="default" c={'green'}
                            onClick={() => setCardsPerAnte(cardsPerAnte + 50)}>+50</Button>
                    <Button variant="default" c={'blue'} onClick={() => setCardsPerAnte(1000)}>1000</Button>
                </Button.Group>
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
                                onChange={() => setShowCardSpoilers(!showCardSpoilers)}
                            />
                        </Tooltip>
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
                    <Button
                        onClick={handleAnalyzeClick}
                        disabled={!hasSettingsChanged}
                        color={hasSettingsChanged ? "green" : "gray"}

                    >
                        Analyze Seed
                    </Button>
                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    )
}
