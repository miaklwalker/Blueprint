import {
    AppShell,
    Box, Button,
    Group,
    NativeSelect,
    NumberInput,
    ScrollArea, Stack, Switch,
    Text,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {useCardStore} from "../../../modules/state/store.ts";
import UnlocksModal from "../../unlocksModal.tsx";
import {IconJoker, IconPlayCard} from "@tabler/icons-react";
import SeedInputAutoComplete from "../../SeedInputAutoComplete.tsx";

export default function NavBar() {
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
    const setStart = useCardStore(state => state.setStart);
    const openSelectOptionModal = useCardStore(state => state.openSelectOptionModal);
    const reset = useCardStore(state => state.reset);
    const handleAnalyzeClick = () => {
        if (seed.length < 5) {
            return;
        }
        setStart(true);
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
                    max={100}
                    clampBehavior="none"
                    label={'Cards per ante'}
                    color="blue"
                    value={cardsPerAnte}
                    onChange={(v) => setCardsPerAnte(Number(v))}
                    mb={'sm'}

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
