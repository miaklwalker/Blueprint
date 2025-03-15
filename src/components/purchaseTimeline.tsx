import {BuyMetaData} from "../modules/classes/BuyMetaData.ts";
import {useCardStore} from "../modules/state/store.ts";
import {ActionIcon, Badge, Group, Paper, Text, Timeline, Title} from "@mantine/core";
import {IconJoker, IconShoppingCartOff} from "@tabler/icons-react";
import {LOCATIONS} from "../modules/const.ts";
import {toHeaderCase} from "js-convert-case";

export default function PurchaseTimeline({buys}: { buys: { [key: string]: BuyMetaData } }) {
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