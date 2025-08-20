import {BuyMetaData} from "../modules/classes/BuyMetaData.ts";
import {useCardStore} from "../modules/state/store.ts";
import {Badge, Button, Group, Paper, Stack, Text, Timeline, Title} from "@mantine/core";
import {IconJoker, IconDownload, IconUpload} from "@tabler/icons-react";
import {LOCATIONS} from "../modules/const.ts";
import {toHeaderCase} from "js-convert-case";
import {useRef} from "react";

export default function PurchaseTimeline({buys, sells}: {
    buys: { [key: string]: BuyMetaData },
    sells: { [key: string]: BuyMetaData }
}) {
    const buyEntries = Object.entries(buys);
    const sellEntries = Object.entries(sells || {});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const transactions = buyEntries.concat(sellEntries);
    const blindOrder = ['smallBlind', 'bigBlind', 'bossBlind'];
    const transactionTypeOrder = ['buy', 'sell'];
    transactions
        .sort(([,a], [,b]) => {
            return Number(a.ante) - Number(b.ante) || blindOrder.indexOf(a.blind) - blindOrder.indexOf(b.blind) || transactionTypeOrder.indexOf(a.transactionType) - transactionTypeOrder.indexOf(b.transactionType);
        })

    const removeBuy = useCardStore(state => state.removeBuy);
    const setBuys = useCardStore(state => state.setBuys);
    const setSells = useCardStore(state => state.setSells);

    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);

    const addSell = useCardStore(state => state.addSell);
    const undoSell = useCardStore(state => state.undoSell);

    const exportPurchases = () => {
        const data = JSON.stringify({ buys, sells }, null, 2);
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `blueprint-purchases-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const importPurchases = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);

                // Convert imported data to BuyMetaData instances
                const importedBuys: { [key: string]: BuyMetaData } = {};
                const importedSells: { [key: string]: BuyMetaData } = {};

                if (data.buys) {
                    Object.entries(data.buys).forEach(([key, value]) => {
                        importedBuys[key] = new BuyMetaData(value as any);
                    });
                }

                if (data.sells) {
                    Object.entries(data.sells).forEach(([key, value]) => {
                        importedSells[key] = new BuyMetaData(value as any);
                    });
                }

                setBuys(importedBuys);
                setSells(importedSells);
            } catch (error) {
                console.error("Failed to import purchases:", error);
                alert("Invalid purchase history file");
            }
        };
        reader.readAsText(file);
        event.target.value = ""; // Reset the input
    };

    if (buyEntries.length === 0) {
        return (
            <Paper p="md" withBorder>
                <Group justify={'space-between'} mb="md">
                    <Text c="dimmed" size="sm">No purchases yet</Text>
                    <Button
                        leftSection={<IconUpload size={16} />}
                        size="xs"
                        variant="light"
                        onClick={importPurchases}
                    >
                        Import
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={handleFileChange}
                    />
                </Group>
            </Paper>
        );
    }

    return (
        <Paper p="md" withBorder>
            <Group justify="space-between" mb="md">
                <Title order={3}>Purchase History</Title>
                <Group>
                    <Button
                        leftSection={<IconUpload size={16} />}
                        size="xs"
                        variant="light"
                        onClick={importPurchases}
                    >
                        Import
                    </Button>
                    <Button
                        leftSection={<IconDownload size={16} />}
                        size="xs"
                        variant="light"
                        onClick={exportPurchases}
                    >
                        Export
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".json"
                        onChange={handleFileChange}
                    />
                </Group>
            </Group>
            <Timeline active={transactions.length - 1} bulletSize={24} lineWidth={2}>
                {transactions.map(([key, buyData]) => {
                    // Parse the key to extract information
                    const [, , index] = key.split('-');
                    let buyMessage;
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
                                                console.log('Removing buy:', buyData);
                                                removeBuy(buyData);
                                            }
                                        }}> Remove </Button>
                                        {
                                            buyData.transactionType !== 'sell' &&
                                            buyData.location !== LOCATIONS.VOUCHER &&
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
