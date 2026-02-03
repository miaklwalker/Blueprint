import {
    AppShell,
    Box,
    Button,
    Divider,
    Group,
    InputLabel,
    NativeSelect,
    NumberInput,
    ScrollArea,
    SegmentedControl,
    Select,
    Stack,
    Switch,
    Text,
    Tooltip,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import React from "react";
import {
    IconFileText,
    IconJoker,
    IconLayout,
    IconListSearch,
    IconMoon,
    IconPlayCard,
    IconSun
} from "@tabler/icons-react";
import {useCardStore} from "../../../modules/state/store.ts";
import UnlocksModal from "../../unlocksModal.tsx";
import FeaturesModal from "../../FeaturesModal.tsx";
import {RerollCalculatorModal} from "../../RerollCalculatorModal.tsx";
import {GaEvent} from "../../../modules/useGA.ts";
import SeedInputAutoComplete from "../../SeedInputAutoComplete.tsx";
import { useBlueprintTheme} from "../../../modules/state/themeProvider.tsx";
import type {KnownThemes} from "../../../modules/state/themeProvider.tsx";


export default function NavBar() {
    const theme = useMantineTheme();
    const {theme: themeName, setTheme, themes} = useBlueprintTheme()
    const themeNames = Object.keys(themes);
    const colorScheme = useMantineColorScheme()
    const viewMode = useCardStore(state => state.applicationState.viewMode);
    const setViewMode = useCardStore(state => state.setViewMode);

    const analyzeState = useCardStore(state => state.immolateState);
    const { seed, deck, stake, gameVersion: version, antes, cardsPerAnte } = analyzeState;
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const useCardPeek = useCardStore(state => state.applicationState.useCardPeek);
    const setUseCardPeek = useCardStore(state => state.setUseCardPeek);
    const maxMiscCardSource = useCardStore(state => state.applicationState.maxMiscCardSource);
    const setMiscMaxSource = useCardStore(state => state.setMiscMaxSource);


    const setSeed = useCardStore(state => state.setSeed);
    const setDeck = useCardStore(state => state.setDeck);
    const setStake = useCardStore(state => state.setStake);
    const setVersion = useCardStore(state => state.setGameVersion);
    const setAntes = useCardStore(state => state.setAntes);
    const setCardsPerAnte = useCardStore(state => state.setCardsPerAnte);
    const setShowCardSpoilers = useCardStore(state => state.setShowCardSpoilers);
    const setStart = useCardStore(state => state.setStart);
    const openSelectOptionModal = useCardStore(state => state.openSelectOptionModal);
    const openFeaturesModal = useCardStore(state => state.openFeaturesModal);
    const openSnapshotModal = useCardStore(state => state.openSnapshotModal);
    const rerollCalculatorModalOpen = useCardStore(state => state.applicationState.rerollCalculatorModalOpen);
    const rerollCalculatorMetadata = useCardStore(state => state.applicationState.rerollCalculatorMetadata);
    const closeRerollCalculatorModal = useCardStore(state => state.closeRerollCalculatorModal);
    const reset = useCardStore(state => state.reset);
    const hasSettingsChanged = useCardStore((state) => state.applicationState.hasSettingsChanged);

    const handleAnalyzeClick = () => {
        setStart(true);
    }




    return (
        <AppShell.Navbar p="md">
            <UnlocksModal />
            <FeaturesModal />
            <RerollCalculatorModal
                opened={rerollCalculatorModalOpen}
                onClose={closeRerollCalculatorModal}
                targetIndex={rerollCalculatorMetadata?.index ?? 0}
                metaData={rerollCalculatorMetadata}
            />
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
                                    <IconLayout size={16} />
                                    <Text>Blueprint</Text>
                                </Group>
                            )
                        },
                        {
                            value: 'simple',
                            label: (
                                <Group gap="xs">
                                    <IconListSearch size={16} />
                                    <Text>Efficiency</Text>
                                </Group>
                            )
                        },
                        {
                            value: 'text',
                            label: (
                                <Group gap="xs">
                                    <IconFileText size={16} />
                                    <Text>Text</Text>
                                </Group>
                            )
                        }
                    ]}
                    mb="sm"
                />
                <Divider mb='md' />

                <Group align={'flex-end'}>
                    <Select
                        label={'Theme'}
                        value={themeName}
                        onChange={(t)=>{
                            if(!t)return
                            setTheme(t as KnownThemes)
                        }}
                        data={themeNames}
                        flex={1}
                    />
                    <Switch
                        size={'xl'}
                        checked={colorScheme.colorScheme === 'dark'}
                        thumbIcon={colorScheme.colorScheme === 'dark' ? (<IconSun size={16} color={'var(--mantine-color-teal-6)'} />) : (<IconMoon size={16} />)}
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
                    onChange={(val) => {
                        // Guard against null/NaN from the NumberInput
                        if (val === null || Number.isNaN(Number(val))) {
                            // keep previous value (do not set) or fallback to 1 to be defensive
                            // Here we fallback to 1 to avoid passing invalid values into the engine
                            setAntes(1);
                        } else {
                            setAntes(Math.floor(Number(val)));
                        }
                    }}
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
                    <Button variant="default" c={'red'} onClick={() => setCardsPerAnte(Math.max(cardsPerAnte - 50, 0))}>-50</Button>
                    <Button.GroupSection flex={1} variant="default" bg="var(--mantine-color-body)" miw={80}>
                        {cardsPerAnte}
                    </Button.GroupSection>
                    <Button variant="default" c={'green'}
                        onClick={() => setCardsPerAnte(Math.min(cardsPerAnte + 50, 1000))}>+50</Button>
                    <Button variant="default" c={'blue'} onClick={() => setCardsPerAnte(1000)}>1000</Button>
                </Button.Group>
                <InputLabel> Cards per Misc source</InputLabel>
                <Text fz={'xs'} c={'dimmed'}>
                    It is recommended to keep this number under 50.
                </Text>
                <Button.Group w={'100%'} mb={'lg'}>
                    <Button variant="default" c={'blue'} onClick={() => setMiscMaxSource(15)}>15</Button>
                    <Button variant="default" c={'red'} onClick={() => setMiscMaxSource(Math.max(maxMiscCardSource - 5, 0))}>-5</Button>
                    <Button.GroupSection flex={1} variant="default" bg="var(--mantine-color-body)" miw={80}>
                        {maxMiscCardSource}
                    </Button.GroupSection>
                    <Button variant="default" c={'green'}
                        onClick={() => setMiscMaxSource(Math.min(maxMiscCardSource + 5, 100))}>+5</Button>
                    <Button variant="default" c={'blue'} onClick={() => setMiscMaxSource(100)}>100</Button>
                </Button.Group>
                <Group justify={'space-between'}>
                    <Box>
                        <Text mb={0} fz={'xs'}>Show Joker Spoilers</Text>
                        <Tooltip label="Cards that give jokers, are replaced with the joker the card would give."
                            refProp="rootRef">
                            <Switch
                                size={'xl'}
                                checked={showCardSpoilers}
                                thumbIcon={showCardSpoilers ? (<IconJoker color={'black'} />) : (
                                    <IconPlayCard color={'black'} />)}
                                onChange={() => setShowCardSpoilers(!showCardSpoilers)}
                            />
                        </Tooltip>
                    </Box>
                    <Box>
                        <Text mb={0} fz={'xs'}>Quick Reroll</Text>
                        <Tooltip label="Long pressing a card in the shop queue, will reroll that card."
                            refProp="rootRef">
                            <Switch
                                size={'xl'}
                                checked={useCardPeek}
                                onChange={() => setUseCardPeek(!useCardPeek)}
                            />
                        </Tooltip>
                    </Box>
                </Group>
            </AppShell.Section>
            <AppShell.Section my="md">
                <Stack>
                    <Button
                        onClick={handleAnalyzeClick}
                        disabled={!hasSettingsChanged}
                        color={hasSettingsChanged ? "green" : "gray"}

                    >
                        Analyze Seed
                    </Button>
                    <Button
                        color={theme.colors.grape[9]}
                        onClick={() => {
                            GaEvent('view_features');
                            openFeaturesModal()
                        }}
                    >
                        Features
                    </Button>
                    <Button color={theme.colors.blue[9]} onClick={() => openSelectOptionModal()}>
                        Modify Unlocks
                    </Button>
                    <Group grow>
                        <Button
                            color={theme.colors.cyan[9]}
                            onClick={() => {
                                openSnapshotModal();
                                GaEvent('view_seed_snapshot');
                            }}
                        >
                            Seed Summary
                        </Button>
                        <Button color={theme.colors.red[9]} variant={'filled'} onClick={() => reset()}>
                            Reset
                        </Button>
                    </Group>

                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    )
}
