import {SeedResultsContainer} from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useCardStore} from "../../../modules/state/store.ts";
import {
    AppShell,
    Badge,
    Button,
    Card,
    Center,
    Grid,
    Group, NumberInput,
    ScrollArea,
    Select,
    Stack,
    Tabs,
    Text,
    Title,
    useMantineTheme
} from "@mantine/core";
import {IconCalendarEvent, IconCards, IconCheck, IconShoppingCart} from "@tabler/icons-react";
import SearchSeedInput from "../../searchInput.tsx";
import MiscCardSourcesDisplay from "../../miscSourcesDisplay.tsx";
import PurchaseTimeline from "../../purchaseTimeline.tsx";
import {useMediaQuery} from "@mantine/hooks";
import {useState} from "react";
import {EVENT_UNLOCKS} from "../../../modules/const.ts";


export function EventsPanel() {
    const events = useCardStore(state => state.eventState.events);
    const trackEvent = useCardStore(state => state.trackEvent);
    const removeEvent = useCardStore(state => state.removeEvent);
    const clearEvents = useCardStore(state => state.clearEvents);

    const blindOptions = [
        {value: "smallBlind", label: "Small Blind"},
        {value: "bigBlind", label: "Big Blind"},
        {value: "bossBlind", label: "Boss Blind"}
    ];

    // Track local state for each card's ante and blind selection
    const [selections, setSelections] = useState<{ [key: string]: { ante: string, blind: string } }>(
        EVENT_UNLOCKS.reduce((acc, event) => ({
            ...acc,
            [event.name]: {ante: "1", blind: "bigBlind"}
        }), {})
    );

    const handleAnteChange = (cardName: string, value: string) => {
        setSelections(prev => ({
            ...prev,
            [cardName]: {...prev[cardName], ante: value}
        }));
    };

    const handleBlindChange = (cardName: string, value: string) => {
        setSelections(prev => ({
            ...prev,
            [cardName]: {...prev[cardName], blind: value}
        }));
    };

    const isEventTracked = (cardName: string, ante: string, blind: string) => {
        return events.some(e =>
            e.name === cardName &&
            e.ante === parseInt(ante) &&
            e.blind === blind
        );
    };

    const toggleEvent = (cardName: string) => {
        const {ante, blind} = selections[cardName];
        const isAlreadyTracked = isEventTracked(cardName, ante, blind);

        if (isAlreadyTracked) {
            // Find and remove the event
            const index = events.findIndex(e =>
                e.name === cardName &&
                e.ante === parseInt(ante) &&
                e.blind === blind
            );
            if (index !== -1) {
                removeEvent(index);
            }
        } else {
            // Add the event
            trackEvent({
                name: cardName,
                ante: parseInt(ante),
                blind: blind
            });
        }
    };

    return (
        <Stack gap="md">
            <Group justify="space-between" align="center">
                <Title order={4}>Unlock Events</Title>
                {events.length > 0 && (
                    <Button variant="light" color="red" size="xs" onClick={clearEvents}>
                        Clear All Events
                    </Button>
                )}
            </Group>

            <Grid>
                {EVENT_UNLOCKS.map((event) => {
                    const {ante, blind} = selections[event.name];
                    const isTracked = isEventTracked(event.name, ante, blind);

                    return (
                        <Grid.Col span={12} key={event.name}>
                            <Card withBorder p="md" radius="md">
                                <Group justify="space-between" mb="xs">
                                    <Group>
                                        <IconCalendarEvent size={20}/>
                                        <Text fw={700}>{event.name}</Text>
                                    </Group>
                                    {isTracked && (
                                        <Badge color="green">Tracked</Badge>
                                    )}
                                </Group>

                                <Text size="sm" c="dimmed" mb="md">{event.condition}</Text>

                                <Group>
                                    <NumberInput
                                        size="xs"
                                        label="Ante"
                                        disabled={isTracked}
                                        value={ante}
                                        onChange={(value) => handleAnteChange(event.name, String(value) || "1")}
                                        w={100}
                                    />
                                    <Select
                                        size="xs"
                                        label="Blind"
                                        disabled={isTracked}
                                        value={blind}
                                        onChange={(value) => handleBlindChange(event.name, value || "bigBlind")}
                                        data={blindOptions}
                                        w={150}
                                    />
                                    <Button
                                        variant={isTracked ? "outline" : "filled"}
                                        color={isTracked ? "red" : "blue"}
                                        ml="auto"
                                        onClick={() => toggleEvent(event.name)}
                                        leftSection={isTracked ? undefined : <IconCheck size={16}/>}
                                    >
                                        {isTracked ? "Remove" : "Activate"}
                                    </Button>
                                </Group>
                            </Card>
                        </Grid.Col>
                    );
                })}
            </Grid>
        </Stack>
    );
}


export function Aside({SeedResults}: { SeedResults: SeedResultsContainer | null }) {
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const anteData = SeedResults?.antes[selectedAnte];
    const miscSources = anteData?.miscCardSources;
    const voucherQueue = anteData?.voucherQueue;
    const tagsQueue = anteData?.tagsQueue;
    const bossesQueue = anteData?.bossQueue;
    const wheelQueue = anteData?.wheelQueue;
    const auraQueue = anteData?.auraQueue;
    const boosterQueue = anteData?.packQueue
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const transactionsCount = Object.keys(buys).length + Object.keys(sells).length;
    const theme = useMantineTheme();

    const tab = useCardStore(state => state.applicationState.asideTab);
    const setTab = useCardStore(state => state.setAsideTab);
    const media = useMediaQuery("(min-width: 600px)");
    return (
        <AppShell.Aside p="md">
            {!media && (
                <AppShell.Section hiddenFrom={'sm'} mb="md">
                    <SearchSeedInput SeedResults={SeedResults}/>
                </AppShell.Section>
            )}
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
                                    {transactionsCount}
                                </Badge>
                            }
                        >
                            Purchases
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="events"
                        >
                            Events
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </AppShell.Section>
            <AppShell.Section component={ScrollArea} scrollbars="y">
                <Tabs value={tab}>
                    <Tabs.Panel value="sources" maw={'100%'}>
                        {SeedResults ? (
                            <MiscCardSourcesDisplay
                                miscSources={miscSources}
                                bossQueue={bossesQueue}
                                tagQueue={tagsQueue}
                                voucherQueue={voucherQueue}
                                wheelQueue={wheelQueue}
                                auraQueue={auraQueue}
                                boosterQueue={boosterQueue}
                            />
                        ) : (
                            <Center h={200}>
                                <Text c="dimmed">Select a seed to view card sources</Text>
                            </Center>
                        )}
                    </Tabs.Panel>
                    <Tabs.Panel value="purchases">
                        <PurchaseTimeline buys={buys} sells={sells}/>
                    </Tabs.Panel>
                    <Tabs.Panel value="events">
                        <EventsPanel/>
                    </Tabs.Panel>
                </Tabs>
            </AppShell.Section>
        </AppShell.Aside>
    )
}
