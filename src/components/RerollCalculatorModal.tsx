import { Modal, NumberInput, Text, Group, Stack, Table, Divider, TextInput, InputLabel, SimpleGrid } from "@mantine/core";
import { useMemo, useState } from "react";
import { useCardStore } from "../modules/state/store.ts";
import { Voucher } from "../modules/balatrots/enum/Voucher.ts";
import { BuyMetaData } from "../modules/classes/BuyMetaData.ts";

interface RerollCalculatorModalProps {
    opened: boolean;
    onClose: () => void;
    targetIndex: number;
    metaData?: BuyMetaData;
}

export function RerollCalculatorModal({ opened, onClose, targetIndex, metaData }: RerollCalculatorModalProps) {
    const globalStartIndex = useCardStore(state => state.applicationState.rerollStartIndex);
    const [startIndex, setStartIndex] = useState<number>(globalStartIndex);
    const buys = useCardStore(state => state.shoppingState.buys);
    const seedResults = useCardStore(state => state.applicationState.analyzedResults);
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const shopQueue = useMemo(() => seedResults?.antes?.[selectedAnte]?.queue, [seedResults, selectedAnte]);
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
        const calculatesRollsPerVisit = (sSize: number, visits: number, tIndex: number, sIndex: number): number[] => {
            const cardsToSee = tIndex - sIndex + 1;
            const totalFreeCards = visits * sSize;
            const rollsPerVisit = Array(visits).fill(0);
            if (cardsToSee <= totalFreeCards) {
                return rollsPerVisit;
            }
            const cardsNeedingRerolls = cardsToSee - totalFreeCards;
            const totalRerollsNeeded = Math.ceil(cardsNeedingRerolls / sSize);
            for (let i = 0; i < totalRerollsNeeded; i++) {
                rollsPerVisit[i % visits]++;
            }
            return rollsPerVisit;
        }
        const calculateCostForParams = (sSize: number, discount: number, tIndex: number, sIndex: number, visits: number = 3) => {
            const rollsPerVisit = calculatesRollsPerVisit(sSize, visits, tIndex, sIndex);
            let totalCost = 0;
            rollsPerVisit.forEach(r => {
                // Each visit starts at $5 for the first reroll (after seeing free cards)
                let currentCost = 5;
                for (let k = 0; k < r; k++) {
                    let cost = Math.max(0, currentCost - discount);
                    totalCost += cost;
                    currentCost += 1;
                }
            });
            return totalCost;
        };
        const baseCost = calculateCostForParams(2, 0, targetIndex, startIndex);
        const currentCost = calculateCostForParams(shopSize, rerollDiscount, targetIndex, startIndex);
        const baseSingleVisitCost = calculateCostForParams(2, 0, targetIndex, startIndex, 1);
        const singleVisitCost = calculateCostForParams(shopSize, rerollDiscount, targetIndex, startIndex, 1);
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
                voucherSavingsList.push({ name: v, savings });
            }
        });


        const rollsNeeded = calculatesRollsPerVisit(shopSize, 3, targetIndex, startIndex)
            .reduce((a, b) => a + b, 0);


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
        <Modal opened={opened} onClose={onClose} title="Reroll Calculator" centered size='lg'>
            <Stack>
                <Group align='flex-end' px={'sm'}>
                    <Stack gap={0} flex={4}>
                        <InputLabel> Starting Point</InputLabel>
                        <TextInput
                            value={shopQueue?.[startIndex]?.name ?? 'Unknown'}
                            disabled
                            readOnly
                        />
                    </Stack>
                    <NumberInput
                        flex={1}
                        value={startIndex}
                        onChange={(val) => setStartIndex(Number(val))}
                        min={0}
                        max={targetIndex}
                    />
                </Group>
                <Divider />
                <Stack gap={0} px={'sm'}>
                    <Text size="xs" c="dimmed">Target Card</Text>
                    <Text fz='sm' fw={700}>{metaData?.index}) {metaData?.name ?? 'Unknown'}</Text>
                </Stack>
                <Divider />
                <SimpleGrid cols={{ base: 2, lg: 4 }} px={'sm'}>
                    <Stack gap={0} w='fit-content'>
                        <Text size="xs" c="dimmed" w='fit-content'>Rolls Needed</Text>
                        <Text fw={700} ta='center'>{calculation.rollsNeeded}</Text>
                    </Stack>
                    <Stack gap={0} w='fit-content'>
                        <Text size="xs" c="dimmed" w='fit-content'>Minimum Cost</Text>
                        <Text fw={700} ta='center'>${calculation.splitVisitCost}</Text>
                    </Stack>
                    <Stack gap={0} w='fit-content'>
                        <Text size="xs" c="dimmed" w='fit-content'>Cards in Shop</Text>
                        <Text fw={700} ta='center'>{shopSize}</Text>
                    </Stack>
                    <Stack gap={0} w='fit-content'>
                        <Text size="xs" c="dimmed" w='fit-content'>Reroll Starting Cost</Text>
                        <Text fw={700} ta='center'>${5 - rerollDiscount}</Text>
                    </Stack>
                </SimpleGrid>
                <Divider />
                <Table withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Strategy</Table.Th>
                            <Table.Th>Cost</Table.Th>
                            {calculation.voucherSavingsList?.length > 0 && (
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
                            {calculation.voucherSavingsList?.length > 0 && (
                                <Table.Td>
                                    <Text fw={700}>${calculation.baseSingleVisitCost}</Text>
                                </Table.Td>
                            )}
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                <Text fw={500}>Split (3 Visits)</Text>
                                <Text size="xs" c="dimmed">
                                    Evenly split across 3 rounds
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fw={700} c="green">${calculation.splitVisitCost}</Text>
                            </Table.Td>
                            {calculation.voucherSavingsList?.length > 0 && (
                                <Table.Td>
                                    <Text fw={700}>${calculation.baseCost}</Text>
                                </Table.Td>
                            )}
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
                {calculation.voucherSavingsList.length > 0 && (
                    <>
                        <Divider label="Voucher Savings" labelPosition="center" />
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
        </Modal >
    );
}

