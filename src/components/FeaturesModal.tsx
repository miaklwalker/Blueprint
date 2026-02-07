import React from "react";
import { useCardStore } from "../modules/state/store.ts";
import { Accordion, Container, Modal, Text, Stack, List } from "@mantine/core";
import { IconCalculator, IconCards, IconLock, IconCamera, IconRefresh, IconEye } from "@tabler/icons-react";

export default function FeaturesModal() {
    const featuresModalOpen = useCardStore(state => state.applicationState.featuresModalOpen);
    const closeFeaturesModal = useCardStore(state => state.closeFeaturesModal);

    if (!featuresModalOpen) return null;

    return (
        <Modal
            size="lg"
            title="Blueprint Features"
            opened={featuresModalOpen}
            onClose={() => closeFeaturesModal()}
        >
            <Container fluid data-tour-id="features-modal">
                <Accordion variant="separated" defaultValue={null}>
                    <Accordion.Item value="reroll-calculator">
                        <Accordion.Control icon={<IconCalculator size={20} />}>
                            <Text fw={600}>Reroll Calculator</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>What it does:</Text>
                                    <Text size="sm" c="dimmed">
                                        Calculates the cost of reaching a card in the shop queue.
                                        for example, if you have a blueprint in slot 40, it will calculate how much money
                                        you need to spend to reach that card. It also takes into account vouchers purchased that affect re rolls.
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>How to find/use it:</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>In the shop queue, hover a card and a button that says "Buy" will appear </List.Item>
                                        <List.Item>Click the dropdown arrow and select "Reroll Calculator"</List.Item>
                                        <List.Item>
                                            if you have already played some of the round and re rolled some cards,
                                            below the re roll calculator button there is a mark as starting point button.
                                        </List.Item>
                                        <List.Item>the calculator will then calculate the cost from your choosen starting point or from the begining of the queue</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="misc-cards">
                        <Accordion.Control icon={<IconCards size={20} />}>
                            <Text fw={600}>Misc Cards Queue Panel</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>What it does:</Text>
                                    <Text size="sm" c="dimmed">
                                        Displays the queue of cards from miscellaneous sources like Arcana Packs,
                                        Celestial Packs, Standard Packs, and other booster packs. See what cards
                                        you'll get before opening them.
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>How to find/use it:</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>click the burger menu (☰) to open the side panel</List.Item>
                                        <List.Item>Navigate to the "Card Sources" tab</List.Item>
                                        <List.Item>From there simply click on a queue you want to see</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="unlock-events">
                        <Accordion.Control icon={<IconLock size={20} />}>
                            <Text fw={600}>Unlock Event Cards</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>What it does:</Text>
                                    <Text size="sm" c="dimmed">
                                        In game many cards only appear after you have preformed some action.
                                        For example, you can only get the Steel Joker after you have obtained a Steel Card.
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>How to find/use it:</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>click the burger menu (☰) to open the side panel</List.Item>
                                        <List.Item>Navigate to the "Events" tab</List.Item>
                                        <List.Item>Indicate which events you have completed and when you completed them.</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="seed-snapshot">
                        <Accordion.Control icon={<IconCamera size={20} />}>
                            <Text fw={600}>Seed Snapshot</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>What it does:</Text>
                                    <Text size="sm" c="dimmed">
                                        Creates a high level overview of the quickly showing :
                                        - The vouchers in the seed
                                        - The bosses in the seed
                                        - The jokers you can find in the seed.
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>How to find/use it:</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>Click "Snapshot" button in settings navbar</List.Item>
                                        <List.Item>A modal will display the on your screen.</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="quick-reroll">
                        <Accordion.Control icon={<IconRefresh size={20} />}>
                            <Text fw={600}>Quick Reroll</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>What it does:</Text>
                                    <Text size="sm" c="dimmed">
                                        Enables a quick interaction to reroll individual cards in the shop queue.
                                        Long-press any card to instantly reroll it and see what comes next,
                                        so you don't have to find that card in a previous ante and buy it.
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>How to find/use it:</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>Enable "Quick Reroll" toggle in the settings navbar</List.Item>
                                        <List.Item>Navigate to any shop queue in the blueprint view</List.Item>
                                        <List.Item>Long-press (click and hold) on any card</List.Item>
                                        <List.Item>The card will reroll and show the next option</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="joker-spoilers">
                        <Accordion.Control icon={<IconEye size={20} />}>
                            <Text fw={600}>Joker Spoilers</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="sm">
                                <div>
                                    <Text fw={500} size="sm" mb={4}>What it does:</Text>
                                    <Text size="sm" c="dimmed">
                                        Replaces cards that give jokers (like Judgement, Wraith, The Soul) with the actual joker they would provide.
                                    </Text>
                                </div>
                                <div>
                                    <Text fw={500} size="sm" mb={4}>How to find/use it:</Text>
                                    <List size="sm" withPadding>
                                        <List.Item>Toggle "Show Joker Spoilers" switch in settings navbar</List.Item>
                                        <List.Item>Cards in shops and packs will show the actual joker</List.Item>
                                        <List.Item>Toggle off to see the original card ( What you would see in game )</List.Item>
                                    </List>
                                </div>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </Modal>
    );
}
