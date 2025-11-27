import {Modal, NumberInput, Text, Group, Stack, Table, Divider} from "@mantine/core";
import {useMemo, useState} from "react";
import {useCardStore} from "../modules/state/store.ts";
import {Voucher} from "../modules/balatrots/enum/Voucher.ts";
import {BuyMetaData} from "../modules/classes/BuyMetaData.ts";

interface RerollCalculatorModalProps {
    opened: boolean;
    onClose: () => void;
    targetIndex: number;
    metaData?: BuyMetaData;
}

export function RerollCalculatorModal({opened, onClose, targetIndex, metaData}: RerollCalculatorModalProps) {
    const globalStartIndex = useCardStore(state => state.applicationState.rerollStartIndex);
    const [startIndex, setStartIndex] = useState<number>(globalStartIndex);
    const buys = useCardStore(state => state.shoppingState.buys);
    const seedResults = useCardStore(state => state.applicationState.analyzedResults );
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte );
    const shopQueue = useMemo(() => seedResults?.antes?.[selectedAnte]?.queue,[seedResults, selectedAnte]);
    // Sync local state with global state when modal opens or global state changes
    useMemo(() => {
        if (opened) {
            setStartIndex(globalStartIndex);
        }
    }, [opened, globalStartIndex]);

    const ownedVouchers = useMemo(() => {
        const vouchers: string[] = [];
        Object.values(buys).forEach((buy) => {
            if (buy.locationType === 'VOUCHER' || buy.locationType === 'voucher') {
                if (buy.name) vouchers.push(buy.name);
            }
        });
        return vouchers;
    }, [buys]);

    const shopSize = useMemo(() => {
        let size = 2;
        if (ownedVouchers.includes(Voucher.OVERSTOCK)) size += 1;
        if (ownedVouchers.includes(Voucher.OVERSTOCK_PLUS)) size += 1;
        return size;
    }, [ownedVouchers]);

    const rerollDiscount = useMemo(() => {
        let discount = 0;
        if (ownedVouchers.includes(Voucher.REROLL_SURPLUS)) discount += 2;
        if (ownedVouchers.includes(Voucher.REROLL_GLUT)) discount += 2;
        return discount;
    }, [ownedVouchers]);

    const calculation = useMemo(() => {
        const calculateCostForParams = (sSize: number, discount: number, tIndex: number, sIndex: number) => {
            let rolls = 0;
            if (tIndex >= sIndex) {
                rolls = Math.floor((tIndex - sIndex) / sSize);
            }
            if (rolls <= 0) return 0;

            // Split strategy (3 visits) is the default comparison
            const visits = 3;
            const rollsPerVisit = Array(visits).fill(0);
            for (let i = 0; i < rolls; i++) {
                rollsPerVisit[i % visits]++;
            }

            let totalCost = 0;
            rollsPerVisit.forEach(r => {
                let currentCost = 5;
                for (let k = 0; k < r; k++) {
                    let cost = Math.max(0, currentCost - discount);
                    totalCost += cost;
                    currentCost += 1;
                }
            });
            return totalCost;
        };

        const currentCost = calculateCostForParams(shopSize, rerollDiscount, targetIndex, startIndex);

        // Calculate savings for each voucher
        const voucherSavingsList: { name: string, savings: number }[] = [];

        ownedVouchers.forEach(v => {
            let tempSize = shopSize;
            let tempDiscount = rerollDiscount;

            if (v === Voucher.OVERSTOCK) tempSize -= 1;
            if (v === Voucher.OVERSTOCK_PLUS) tempSize -= 1;
            if (v === Voucher.REROLL_SURPLUS) tempDiscount -= 2;
            if (v === Voucher.REROLL_GLUT) tempDiscount -= 2;

            // If removing the voucher makes size < 2 (shouldn't happen with base 2), clamp it?
            // Base is 2. Overstock adds 1. So removing it goes back to 2. Safe.

            const costWithout = calculateCostForParams(tempSize, tempDiscount, targetIndex, startIndex);
            const savings = costWithout - currentCost;

            if (savings > 0) {
                voucherSavingsList.push({name: v, savings});
            }
        });

        // For main display, we still want single vs split comparison using CURRENT params
        // Re-use logic for single visit
        let rollsNeeded = 0;
        if (targetIndex >= startIndex) {
            rollsNeeded = Math.floor((targetIndex - startIndex) / shopSize);
        }
        let baseRollsNeeded = 0;
        if (targetIndex >= startIndex) {
            baseRollsNeeded = Math.floor((targetIndex - startIndex) / 2);
        }

        const calculateSingleVisit = (needRolls = rollsNeeded) => {
            if (needRolls <= 0) return 0;
            let total = 0;
            let current = 5;
            for (let i = 0; i < needRolls; i++) {
                total += Math.max(0, current - rerollDiscount);
                current += 1;
            }
            return total;
        }
        const baseSingleVisitCost = calculateSingleVisit(baseRollsNeeded);
        const singleVisitCost = calculateSingleVisit();
        const baseCost = calculateCostForParams(2, 0, targetIndex, startIndex);

        return {
            baseCost,
            baseSingleVisitCost,
            rollsNeeded,
            singleVisitCost,
            splitVisitCost: currentCost,
            voucherSavingsList
        };

    }, [startIndex, targetIndex, shopSize, rerollDiscount, ownedVouchers]);

    return (
        <Modal opened={opened} onClose={onClose} title="Reroll Calculator" centered>
            <Stack>
                <NumberInput
                    label="Starting Index"
                    description="Where to calculate cost from, you can also use the mark as start button to set this automatically"
                    value={startIndex}
                    onChange={(val) => setStartIndex(Number(val))}
                    min={0}
                    max={targetIndex}
                />
                <Divider/>
                <Stack gap={0} px={'sm'}>
                    <Text size="xs" c="dimmed">Cheapest Route</Text>
                    <Text fw={700}>${calculation.splitVisitCost}</Text>
                </Stack>
                <Group grow px={'sm'}>
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Starting Card</Text>
                        <Text fw={700}>{startIndex}) {shopQueue?.[startIndex]?.name ?? 'Unknown'}</Text>
                    </Stack>
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Target Card</Text>
                        <Text fw={700}>{metaData?.index}) {metaData?.name ?? 'Unknown'}</Text>
                    </Stack>
                </Group>
                <Divider/>
                <Group grow px={'sm'}>
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Cards in Shop</Text>
                        <Text fw={700}>{shopSize}</Text>
                    </Stack>
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Discount</Text>
                        <Text fw={700}>${rerollDiscount}</Text>
                    </Stack>
                </Group>
                <Divider label="Cost Routing" labelPosition="center" mb={0}/>
                <Table p={0} mt={0}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Strategy</Table.Th>
                            <Table.Th>Cost</Table.Th>
                            { calculation.voucherSavingsList?.length > 0 && (
                                <Table.Th> Base Cost</Table.Th>
                            )}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Td>
                                <Text fw={500}>Single Visit</Text>
                                <Text size="xs" c="dimmed">{calculation.rollsNeeded} rolls in one go</Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fw={700} c="red">${calculation.singleVisitCost}</Text>
                            </Table.Td>
                            { calculation.voucherSavingsList?.length > 0 && (
                                <Table.Td>
                                    <Text fw={700}>${calculation.baseSingleVisitCost}</Text>
                                </Table.Td>
                            )}
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                <Text fw={500}>Split (3 Visits)</Text>
                                <Text size="xs" c="dimmed">Optimized across 3 shops
                                    ({Math.floor(calculation.rollsNeeded / 3)} rolls per shop)</Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fw={700} c="green">${calculation.splitVisitCost}</Text>
                            </Table.Td>
                            { calculation.voucherSavingsList?.length > 0 && (
                                <Table.Td>
                                    <Text fw={700}>${calculation.baseCost}</Text>
                                </Table.Td>
                            )}
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                {calculation.voucherSavingsList.length > 0 && (
                    <>
                        <Divider label="Voucher Savings" labelPosition="center"/>
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Voucher</Table.Th>
                                    <Table.Th>Saved <Text span fz='xs' c='dimmed'> ( from best case )</Text></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {calculation.voucherSavingsList.map((v) => (
                                    <Table.Tr key={v.name}>
                                        <Table.Td>{v.name}</Table.Td>
                                        <Table.Td>
                                            <Text fw={700} c="green">${v.savings}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </>
                )}
            </Stack>
        </Modal>
    );
}

