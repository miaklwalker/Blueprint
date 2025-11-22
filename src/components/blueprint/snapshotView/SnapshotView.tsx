import { SeedResultsContainer, Ante } from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import { Group, MultiSelect, Paper, ScrollArea, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Boss, Voucher } from "../../Rendering/gameElements.tsx";
import { GameCard } from "../../Rendering/cards.tsx";
import { jokers } from "../../../modules/const.ts";
import { useMemo, useState } from "react";

interface SnapshotViewProps {
    SeedResults: SeedResultsContainer;
}

const RARITY_ORDER: { [key: number]: number } = {
    4: 0, // Legendary
    3: 1, // Rare
    2: 2, // Uncommon
    1: 3, // Common
    0: 4  // Unknown
};

const EDITION_ORDER: { [key: string]: number } = {
    "Negative": 0,
    "Polychrome": 1,
    "Holographic": 2,
    "Foil": 3,
    "No Edition": 4,
    "": 4
};

export default function SnapshotView({ SeedResults }: SnapshotViewProps) {
    const [priorityJokers, setPriorityJokers] = useState<string[]>([]);

    const allJokerNames = useMemo(() => {
        return jokers.map((j: any) => j.name).sort();
    }, []);

    const { bosses, vouchers, allJokers } = useMemo(() => {
        const bosses: { name: string, ante: number }[] = [];
        const vouchers: { name: string, ante: number }[] = [];
        const allJokers: any[] = [];

        const sortedAntes = Object.entries(SeedResults.antes)
            .sort(([a], [b]) => Number(a) - Number(b));

        sortedAntes.forEach(([anteStr, anteData]: [string, Ante]) => {
            const anteNum = Number(anteStr);
            if (anteData.boss) {
                bosses.push({ name: anteData.boss, ante: anteNum });
            }
            if (anteData.voucher) {
                vouchers.push({ name: anteData.voucher, ante: anteNum });
            }

            // Collect Jokers from Queue (Shop)
            anteData.queue.forEach((item: any) => {
                if (item.type === 'Joker') {
                    allJokers.push({ ...item, source: `Ante ${anteNum} Shop` });
                }
            });

            // Collect Jokers from Packs
            Object.values(anteData.blinds).forEach((blind: any) => {
                blind.packs.forEach((pack: any) => {
                    if (pack.cards) {
                        pack.cards.forEach((card: any) => {
                            if (card.type === 'Joker') {
                                allJokers.push({ ...card, source: `Ante ${anteNum} ${pack.name}` });
                            }
                        });
                    }
                });
            });

            // Collect Jokers from Tags/Misc Sources
            anteData.miscCardSources.forEach((source: any) => {
                if (source.cards) {
                    source.cards.forEach((card: any) => {
                        if (card.type === 'Joker') {
                            allJokers.push({ ...card, source: `Ante ${anteNum} ${source.name}` });
                        }
                    })
                }
            })

        });

        return { bosses, vouchers, allJokers };
    }, [SeedResults]);

    const sortedJokers = useMemo(() => {
        return [...allJokers].sort((a, b) => {
            // Priority check
            const aPriority = priorityJokers.includes(a.name);
            const bPriority = priorityJokers.includes(b.name);

            if (aPriority && !bPriority) return -1;
            if (!aPriority && bPriority) return 1;

            // Rarity check
            const aRarity = RARITY_ORDER[a.rarity ?? 0] ?? 4;
            const bRarity = RARITY_ORDER[b.rarity ?? 0] ?? 4;

            if (aRarity !== bRarity) return aRarity - bRarity;

            // Edition check
            const aEdition = EDITION_ORDER[a.edition || "No Edition"] ?? 4;
            const bEdition = EDITION_ORDER[b.edition || "No Edition"] ?? 4;

            if (aEdition !== bEdition) return aEdition - bEdition;

            return a.name.localeCompare(b.name);
        });
    }, [allJokers, priorityJokers]);

    return (
        <Stack p="md" gap="xl">
            <Paper p="md" withBorder>
                <Title order={3} mb="md">Bosses</Title>
                <ScrollArea>
                    <Group wrap="nowrap">
                        {bosses.map((boss, index) => (
                            <Stack key={index} align="center" gap="xs">
                                <Boss bossName={boss.name} />
                                <Text size="xs" c="dimmed">Ante {boss.ante}</Text>
                            </Stack>
                        ))}
                    </Group>
                </ScrollArea>
            </Paper>

            <Paper p="md" withBorder>
                <Title order={3} mb="md">Vouchers</Title>
                <ScrollArea>
                    <Group wrap="nowrap">
                        {vouchers.map((voucher, index) => (
                            <Stack key={index} align="center" gap="xs">
                                <Voucher voucherName={voucher.name} />
                                <Text size="xs" c="dimmed">Ante {voucher.ante}</Text>
                            </Stack>
                        ))}
                    </Group>
                </ScrollArea>
            </Paper>

            <Paper p="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Title order={3}>Jokers</Title>
                    <MultiSelect
                        label="Priority Jokers"
                        placeholder="Select jokers to prioritize"
                        data={allJokerNames}
                        value={priorityJokers}
                        onChange={setPriorityJokers}
                        searchable
                        clearable
                        w={400}
                    />
                </Group>
                <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing="lg">
                    {sortedJokers.map((joker, index) => (
                        <Stack key={index} align="center" gap={4}>
                            <GameCard card={joker} />
                            <Text size="xs" c="dimmed" ta="center">{joker.source}</Text>
                        </Stack>
                    ))}
                </SimpleGrid>
            </Paper>
        </Stack>
    );
}
