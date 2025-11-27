import { Modal, NumberInput, Text, Group, Stack, Table, Divider, Badge } from "@mantine/core";
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

export function RerollCalculatorModal({ opened, onClose, targetIndex }: RerollCalculatorModalProps) {
    const [startIndex, setStartIndex] = useState<number>(0);
    const buys = useCardStore(state => state.shoppingState.buys);

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
        let rollsNeeded = 0;
        if (targetIndex >= startIndex) {
            rollsNeeded = Math.floor((targetIndex - startIndex) / shopSize);
        }

        const calculateCost = (rolls: number, visits: number) => {
            if (rolls <= 0) return 0;

            const rollsPerVisit = Array(visits).fill(0);
            for (let i = 0; i < rolls; i++) {
                rollsPerVisit[i % visits]++;
            }

            let totalCost = 0;
            rollsPerVisit.forEach(r => {
                let currentCost = 5;
                for (let k = 0; k < r; k++) {
                    let cost = Math.max(0, currentCost - rerollDiscount);
                    totalCost += cost;
                    currentCost += 1;
                }
            });
            return totalCost;
        };

        const singleVisitCost = calculateCost(rollsNeeded, 1);
        const splitVisitCost = calculateCost(rollsNeeded, 3);

        const baseRollsNeeded = Math.floor((targetIndex - startIndex) / 2);
        const calculateBaseCost = (rolls: number) => {
            let total = 0;
            let current = 5;
            for (let i = 0; i < rolls; i++) {
                total += current;
                current += 1;
            }
            return total;
        }
        const baseCost = calculateBaseCost(baseRollsNeeded);

        const voucherSavings = baseCost - singleVisitCost;

        return {
            rollsNeeded,
            singleVisitCost,
            splitVisitCost,
            baseCost,
            voucherSavings
        };

    }, [startIndex, targetIndex, shopSize, rerollDiscount]);

    return (
        <Modal opened={opened} onClose={onClose} title="Reroll Calculator" centered>
            <Stack>
                <NumberInput
                    label="Starting Index"
                    description="The index you are currently at (default 0)"
                    value={startIndex}
                    onChange={(val) => setStartIndex(Number(val))}
                    min={0}
                    max={targetIndex}
                />

                <Group grow>
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Target Index</Text>
                        <Text fw={700}>{targetIndex}</Text>
                    </Stack>
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Shop Size</Text>
                        <Text fw={700}>{shopSize}</Text>
                    </Stack>
                    <Stack gap={0}>
                        <Text size="xs" c="dimmed">Discount</Text>
                        <Text fw={700}>${rerollDiscount}</Text>
                    </Stack>
                </Group>

                <Divider />

                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Strategy</Table.Th>
                            <Table.Th>Cost</Table.Th>
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
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Td>
                                <Text fw={500}>Split (3 Visits)</Text>
                                <Text size="xs" c="dimmed">Optimized across 3 shops</Text>
                            </Table.Td>
                            <Table.Td>
                                <Text fw={700} c="green">${calculation.splitVisitCost}</Text>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                {calculation.voucherSavings > 0 && (
                    <Badge color="green" fullWidth size="lg" variant="light">
                        Vouchers saved you ${calculation.voucherSavings}!
                    </Badge>
                )}

                <Text size="xs" c="dimmed" ta="center">
                    Base cost (no vouchers): ${calculation.baseCost}
                </Text>
            </Stack>
        </Modal>
    );
}
