import {useCallback, useEffect, useMemo} from "react";
import {useDebouncedCallback, useDebouncedValue} from "@mantine/hooks";
import {
    AppShell, Autocomplete,
    Box, Button,
    Divider, Group,
    NativeSelect,
    NumberInput, ScrollArea,
    SimpleGrid,
    Slider, Stack, Switch,
    Text,
    TextInput,
    Title, Tooltip, useMantineTheme
} from "@mantine/core";
import {useBlueprintStore} from "../../../modules/store.js";
import {IconJoker, IconPlayCard} from "@tabler/icons-react";
import {SeedInputAutoComplete} from "../../seedInputAutocomplete/index.jsx";



export function Settings() {
    const theme = useMantineTheme();
    const analyzeSeed = useBlueprintStore(state => state.analyzeSeed);

    const seedIsOpen = useBlueprintStore(state => state.seedIsOpen);
    const seed = useBlueprintStore(state => state.seed)
    const deck = useBlueprintStore(state => state.deck)
    const cardsPerAnte = useBlueprintStore(state => state.cardsPerAnte)
    const stake = useBlueprintStore(state => state.stake)
    const version = useBlueprintStore(state => state.version)
    const ante = useBlueprintStore(state => state.ante);

    const showCardSpoilers = useBlueprintStore(state => state.showCardSpoilers);
    const setShowCardSpoilers = useBlueprintStore(state => state.setShowCardSpoilers)

    const reset = useBlueprintStore(state => state.reset)

    const openSelectOptionModal = useBlueprintStore(state => state.openSelectOptionModal)
    const setSeedIsOpen = useBlueprintStore(state => state.setSeedIsOpen);
    const setSeed = useBlueprintStore(state => state.setSeed)
    const setDeck = useBlueprintStore(state => state.setDeck)
    const setCardsPerAnte = useBlueprintStore(state => state.setCardsPerAnte)
    const setStake = useBlueprintStore(state => state.setStake)
    const setVersion = useBlueprintStore(state => state.setVersion)
    const setAnte = useBlueprintStore(state => state.setAnte);
    const settingsChanged = useBlueprintStore(state => state.settingsChanged)
    const setSettingsChanged = useBlueprintStore(state => state.setSettingsChanged)


    const cardsPerAnteString = useBlueprintStore(state => state.getCardsPerAnteString)


    const handleAnalyzeSeed = useDebouncedCallback(() => {
        analyzeSeed()
        setSettingsChanged(false)
        setSeedIsOpen(true)
    }, 150)

    useEffect(() => {
        if (!seedIsOpen || !settingsChanged) return;
        handleAnalyzeSeed()
    }, [settingsChanged]);

    const handleAnalyzeClick = useCallback(() => {
        handleAnalyzeSeed()
    }, []);

    return (
        <AppShell.Navbar p="md">
            <AppShell.Section>
                <Title my={'sm'} px={'1rem'} order={4}>
                    Settings
                </Title>
            </AppShell.Section>
            <Divider mb={'lg'}/>
            <AppShell.Section grow my="md" component={ScrollArea}>
                <SimpleGrid cols={1} px={'1rem'}>
                    <SeedInputAutoComplete
                        seed={seed}
                        setSeed={setSeed}
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
                    <Box>
                        <Text mb={0} fz={'xs'}>Show Joker Spoilers</Text>
                        <Tooltip label="Cards that give jokers, are replaced with the joker the card would give."
                                 refProp="rootRef">
                            <Switch
                                size={'xl'}
                                value={showCardSpoilers}
                                thumbIcon={showCardSpoilers ? (<IconJoker color={'black'}/>) : (
                                    <IconPlayCard color={'black'}/>)}
                                onChange={e => setShowCardSpoilers(e.currentTarget.checked)}
                            />
                        </Tooltip>
                    </Box>
                </SimpleGrid>
            </AppShell.Section>
            <AppShell.Section>
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
