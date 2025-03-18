import {Seed} from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useCardStore} from "../../../modules/state/store.ts";
import {AppShell, Badge, Center, ScrollArea, Tabs, Text, useMantineTheme} from "@mantine/core";
import {IconCards, IconShoppingCart} from "@tabler/icons-react";
import SearchSeedInput from "../../searchInput.tsx";
import MiscCardSourcesDisplay from "../../miscSourcesDisplay.tsx";
import PurchaseTimeline from "../../purchaseTimeline.tsx";

export function Aside({SeedResults}: { SeedResults: Seed | null }) {
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const anteData = SeedResults?.antes[selectedAnte];
    const miscSources = anteData?.miscCardSources;
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const transactionsCount = Object.keys(buys).length + Object.keys(sells).length;
    const theme = useMantineTheme();

    const tab = useCardStore(state => state.applicationState.asideTab);
    const setTab = useCardStore(state => state.setAsideTab);

    return (
        <AppShell.Aside p="md">
            <AppShell.Section hiddenFrom={'sm'} mb="md">
                <SearchSeedInput SeedResults={SeedResults}/>
            </AppShell.Section>
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
                        <PurchaseTimeline buys={buys} sells={sells}/>
                    </Tabs.Panel>
                </Tabs>
            </AppShell.Section>
        </AppShell.Aside>
    )
}