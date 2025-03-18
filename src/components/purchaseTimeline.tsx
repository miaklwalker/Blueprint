import {BuyMetaData} from "../modules/classes/BuyMetaData.ts";
import {useCardStore} from "../modules/state/store.ts";
import {Badge, Button, Group, Paper, Stack, Text, Timeline, Title} from "@mantine/core";
import {IconJoker} from "@tabler/icons-react";
import {LOCATIONS} from "../modules/const.ts";
import {toHeaderCase} from "js-convert-case";

export default function PurchaseTimeline({buys, sells}: {
    buys: { [key: string]: BuyMetaData },
    sells: { [key: string]: BuyMetaData }
}) {
    const buyEntries = Object.entries(buys);
    const sellEntries = Object.entries(sells || {});

    const transactions = buyEntries.concat(sellEntries);
    const blindOrder = ['smallBlind', 'bigBlind', 'bossBlind'];
    const transactionTypeOrder = ['buy', 'sell'];
    transactions
        .sort(([,a], [,b]) => {
            return Number(a.ante) - Number(b.ante) || blindOrder.indexOf(a.blind) - blindOrder.indexOf(b.blind) || transactionTypeOrder.indexOf(a.transactionType) - transactionTypeOrder.indexOf(b.transactionType);
        })

    const removeBuy = useCardStore(state => state.removeBuy);

    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);


    const addSell = useCardStore(state => state.addSell);
    const undoSell = useCardStore(state => state.undoSell);

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
            <Timeline active={transactions.length - 1} bulletSize={24} lineWidth={2}>
                {transactions.map(([key, buyData]) => {
                    // Parse the key to extract information
                    const [, , index] = key.split('-');
                    let buyMessage;
                    console.log(buyData)
                    switch (true) {
                        case buyData.transactionType === 'sell':
                            buyMessage = `Sold ${buyData.name} at Ante ${buyData.ante}`;
                            break;
                        case buyData.transactionType === 'buy' && buyData.locationType === LOCATIONS.PACK:
                            buyMessage = `Bought ${buyData.name} from ${buyData.location} - Card ${Number(index) + 1}`;
                            break;
                        case buyData.transactionType === 'buy' && buyData.locationType === LOCATIONS.MISC:
                            buyMessage = `Bought ${buyData.name} from ${buyData.location} - Card ${Number(index) + 1}`;
                            break;
                        case buyData.transactionType === 'buy':
                            buyMessage = `Bought Shop Item ${Number(index) + 1}`;
                            break;
                        default:
                            buyMessage = 'Unknown transaction';
                            break;
                    }
                    return (
                        <Timeline.Item
                            key={key}
                            color={buyData.transactionType === 'sell' ? 'green' : 'blue'}
                            bullet={<IconJoker size={12}/>}
                            title={
                                <Group justify="space-between" wrap="nowrap">
                                    <Stack gap={0}>
                                        <Text size={'lg'} fw={500}>
                                            {buyData.name}
                                        </Text>
                                        <Text size="xs" c="dimmed" mt={4}>
                                            {
                                                buyMessage
                                            }
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {toHeaderCase(buyData.blind)}
                                        </Text>
                                    </Stack>

                                    <Stack>
                                        <Button color={'red'} size={'compact-sm'} onClick={() => {
                                            if (buyData.transactionType === 'sell') {
                                                undoSell(buyData);
                                            } else {
                                                removeBuy(buyData);
                                            }
                                        }}> Remove </Button>
                                        {
                                            buyData.transactionType !== 'sell' &&
                                            <Button
                                                color={'green'}
                                                size={'compact-sm'}
                                                onClick={() => {
                                                    let sellData = new BuyMetaData({
                                                        ...buyData,
                                                        ante: String(selectedAnte),
                                                        blind: selectedBlind,
                                                    })
                                                    sellData.transactionType = 'sell';
                                                    addSell(sellData);
                                                }}
                                            >
                                                Sell
                                            </Button>
                                        }

                                    </Stack>
                                </Group>
                            }
                        >


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