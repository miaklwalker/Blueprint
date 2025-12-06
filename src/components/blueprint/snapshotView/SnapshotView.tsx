import {Ante, Joker_Final, SeedResultsContainer} from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {
    Box,
    Divider,
    Group,
    HoverCard,
    Modal,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    Title,
    Tooltip
} from "@mantine/core";
import {Boss, Voucher} from "../../Rendering/gameElements.tsx";
import {JokerCard} from "../../Rendering/cards.tsx";
import {useMemo} from "react";
import {useCardStore} from "../../../modules/state/store.ts";

interface SnapshotViewProps {
    SeedResults: SeedResultsContainer;
}
// number suffix 1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th
function numberSuffix(num: number) {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}


const RARITY_ORDER: { [key: number]: number } = {
    4: 0, // Legendary
    3: 1, // Rare
    2: 2, // Uncommon
    1: 3, // Common
    0: 4  // Unknown
};

// Higher number = higher priority within the rarity tier
const JOKER_WEIGHTS: { [key: string]: number } = {
    "Blueprint": 10,
    "Brainstorm": 10,
    "Perkeo": 10,
    "Triboulet": 10,
    "Yorick": 10,
    "Baron": 9,
    "Mime": 9,
    "Wee Joker": 8,
};

interface LocationData {
    source: string;
    edition: string;
    index: number;
}

interface UniqueJokerData {
    joker: any;
    count: number;
    locations: LocationData[];
    firstOpportunity: string;
    shopCount: number;
    packCount: number;
    miscCount: number;
}

export default function SnapshotModal({ SeedResults }: SnapshotViewProps) {
    const opened = useCardStore(state => state.applicationState.snapshotModalOpen);
    const close = useCardStore(state => state.closeSnapshotModal);

    const { bosses, vouchers, uniqueJokers } = useMemo(() => {
        const bosses: { name: string, ante: number }[] = [];
        const vouchers: { name: string, ante: number }[] = [];
        const jokerMap = new Map<string, UniqueJokerData>();

        if (!SeedResults) return { bosses, vouchers, uniqueJokers: [] };

        const sortedAntes = Object.entries(SeedResults.antes)
            .sort(([a], [b]) => {
                const numA = Number(a);
                const numB = Number(b);
                const valA = numA === 0 ? 1.5 : numA;
                const valB = numB === 0 ? 1.5 : numB;
                return valA - valB;
            });

        sortedAntes.forEach(([anteStr, anteData]: [string, Ante]) => {
            const anteNum = Number(anteStr);
            if (anteData.boss) {
                bosses.push({ name: anteData.boss, ante: anteNum });
            }
            if (anteData.voucher) {
                vouchers.push({ name: anteData.voucher, ante: anteNum });
            }

            const processJoker = (item: any, source: string, sourceType: 'Shop' | 'Pack' | 'Misc', index: number) => {
                if (item.type === 'Joker') {
                    // Key is just the name now, to group all editions together
                    const key = item.name;

                    if (!jokerMap.has(key)) {
                        jokerMap.set(key, {
                            joker: item, // Stores the first instance found
                            count: 0,
                            locations: [],
                            firstOpportunity: source,
                            shopCount: 0,
                            packCount: 0,
                            miscCount: 0
                        });
                    }
                    const data = jokerMap.get(key)!;
                    data.count++;
                    data.locations.push({
                        source: source,
                        edition: item.edition || 'No Edition',
                        index: index + 1 // 1-based index for display
                    });
                    if (sourceType === 'Shop') data.shopCount++;
                    if (sourceType === 'Pack') data.packCount++;
                    if (sourceType === 'Misc') data.miscCount++;
                }
            };

            // Collect Jokers from Queue (Shop)
            anteData.queue.forEach((item: any, index: number) => {
                processJoker(item, `Ante ${anteNum} Shop`, 'Shop', index);
            });

            // Collect Jokers from Packs
            Object.values(anteData.blinds).forEach((blind: any) => {
                blind.packs.forEach((pack: any) => {
                    if (pack.cards) {
                        pack.cards.forEach((card: any, index: number) => {
                            processJoker(card, `Ante ${anteNum} ${pack.name} pack`, 'Pack', index);
                        });
                    }
                });
            });

            // Collect Jokers from Tags/Misc Sources
            anteData.miscCardSources.forEach((source: any) => {
                if (source.cards) {
                    source.cards.forEach((card: any, index: number) => {
                        processJoker(card, `Ante ${anteNum} ${source.name} queue`, 'Misc', index);
                    });
                }
            })

        });

        return { bosses, vouchers, uniqueJokers: Array.from(jokerMap.values()) };
    }, [SeedResults]);

    const sortedUniqueJokers = useMemo(() => {
        return [...uniqueJokers].sort((a, b) => {
            const jokerA = a.joker;
            const jokerB = b.joker;

            // Rarity check
            const aRarity = RARITY_ORDER[jokerA.rarity ?? 0] ?? 4;
            const bRarity = RARITY_ORDER[jokerB.rarity ?? 0] ?? 4;

            if (aRarity !== bRarity) return aRarity - bRarity;

            // Weight check (Higher weight first)
            const aWeight = JOKER_WEIGHTS[jokerA.name] || 0;
            const bWeight = JOKER_WEIGHTS[jokerB.name] || 0;

            if (aWeight !== bWeight) return bWeight - aWeight;
            if (aWeight && !bWeight) return -1;
            if (!aWeight && bWeight) return 1;



            return jokerA.name.localeCompare(jokerB.name);
        });
    }, [uniqueJokers]);

    return (
        <Modal opened={opened} onClose={close} title="Seed Snapshot" size="xl" centered>
            <Stack p="md" gap="xl">
                <Paper p="md" withBorder>
                    <Title order={3} mb="md">Bosses</Title>
                    <ScrollArea>
                        <Group wrap="nowrap">
                            {bosses.map((boss, index) => (
                                <Stack key={index} align="center" gap="xs">
                                    <Tooltip label={boss.name}>
                                        <Box>
                                            <Boss bossName={boss.name} />
                                        </Box>
                                    </Tooltip>
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
                                    <Tooltip label={voucher.name}>
                                        <Box>
                                            <Voucher voucherName={voucher.name} />
                                        </Box>
                                    </Tooltip>
                                    <Text size="xs" c="dimmed">Ante {voucher.ante}</Text>
                                </Stack>
                            ))}
                        </Group>
                    </ScrollArea>
                </Paper>

                <Paper p="md" withBorder>
                    <Title order={3} mb="md">Jokers</Title>
                    <SimpleGrid cols={{ base: 2, sm: 4, lg: 6 }}>
                        {sortedUniqueJokers.map((data, index) => (
                            <HoverCard key={index}  shadow="md" openDelay={300} closeOnClickOutside={true}>
                                <HoverCard.Target>
                                    <Box w={'fit-content'}>
                                        <JokerCard card={new Joker_Final(data.joker)} />
                                    </Box>
                                </HoverCard.Target>
                                <HoverCard.Dropdown w={320}>
                                    <Stack gap={0}>
                                        <Title order={3} mb={0}>
                                            {data.joker.name}
                                        </Title>
                                        <Divider mb='sm' />
                                        <Text mb='sm' fz="xs">First Opportunity: {data.firstOpportunity}</Text>
                                        <Divider mb='sm' />
                                        <Group gap="lg">
                                            <Text fz="sm"><Text fz="sm" span c='dimmed'>Count:</Text> {data.count}</Text>
                                        </Group>
                                        <Group gap="md" mb="sm">
                                            <Text fz="sm" c='dimmed'>Shop: <Text fz="sm" span c={data.shopCount > 0 ? "green" : "red"}>{data.shopCount}</Text></Text>
                                            <Text fz="sm" c='dimmed'>Pack: <Text fz="sm" span c={data.packCount > 0 ? "green" : "red"}>{data.packCount}</Text></Text>
                                            <Text fz="sm" c='dimmed'>Misc: <Text fz="sm" span c={data.miscCount > 0 ? "green" : "red"}>{data.miscCount}</Text></Text>
                                        </Group>

                                        <Divider mb='sm' />

                                        <Text fz="xs" fw={500}>Locations:</Text>
                                        <ScrollArea h={150}>
                                            <Stack gap={4}>
                                                {data.locations.map((loc, i) => (
                                                    <Group key={i} gap="xs" wrap="nowrap">
                                                        <Text fz="xs" c="dimmed">• {loc.source}</Text>
                                                        {loc.edition !== 'No Edition' && (
                                                            <Text fz="xs" c="blue" fw={500}>{loc.edition}</Text>
                                                        )}
                                                        <Text fz="xs" c="dimmed">{loc.index}{numberSuffix(loc.index)} card</Text>
                                                    </Group>
                                                ))}
                                            </Stack>
                                        </ScrollArea>
                                    </Stack>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        ))}
                    </SimpleGrid>
                </Paper>
            </Stack>
        </Modal>
    );
}
