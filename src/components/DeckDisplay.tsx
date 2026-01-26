import React, { useMemo, useEffect } from 'react';
import {
    Accordion,
    ActionIcon,
    Badge,
    Box,
    Button,
    Flex,
    Group,
    Menu,
    Paper,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import { IconCards, IconTrash, IconRefresh, IconArrowBackUp, IconArrowForwardUp, IconEdit, IconChevronRight } from '@tabler/icons-react';
import { useCardStore } from '../modules/state/store.ts';
import { getDeckStats, type DeckCard } from '../modules/deckUtils.ts';

// Mini card component for deck display
function MiniDeckCard({ card, onRemove, onUpdate }: {
    card: DeckCard;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<DeckCard>) => void;
}) {
    const suitColors: Record<string, string> = {
        Hearts: '#e03131',
        Diamonds: '#1971c2',
        Clubs: '#2f9e44',
        Spades: '#1c1c1c',
    };

    const suitSymbols: Record<string, string> = {
        Hearts: '♥',
        Diamonds: '♦',
        Clubs: '♣',
        Spades: '♠',
    };

    const hasModifiers =
        (card.edition && card.edition !== 'No Edition') ||
        (card.enhancement && card.enhancement !== 'No Enhancement') ||
        (card.seal && card.seal !== 'No Seal');

    return (
        <Menu shadow="md" width={200} position="bottom-start" withArrow>
            <Menu.Target>
                <Paper
                    withBorder
                    p={4}
                    style={{
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: hasModifiers ? 'rgba(255, 255, 255)' : undefined,
                        transition: 'transform 0.1s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Tooltip
                        label={
                            <Stack gap={2}>
                                <Text size="sm" fw={600}>{card.name}</Text>
                                {card.edition && card.edition !== 'No Edition' && (
                                    <Text size="xs">Edition: {card.edition}</Text>
                                )}
                                {card.enhancement && card.enhancement !== 'No Enhancement' && (
                                    <Text size="xs">Enhancement: {card.enhancement}</Text>
                                )}
                                {card.seal && card.seal !== 'No Seal' && (
                                    <Text size="xs">Seal: {card.seal}</Text>
                                )}
                                <Text size="xs" c="dimmed">Source: {card.source}</Text>
                            </Stack>
                        }
                    >
                        <Flex align="center" justify="center" gap={2} bg='white'>
                            <Text
                                size="sm"
                                fw={700}
                                c={suitColors[card.suit]}
                            >
                                {card.rank === '10' ? '10' : card.rank[0]}
                            </Text>
                            <Text size="sm" c={suitColors[card.suit]}>
                                {suitSymbols[card.suit]}
                            </Text>
                        </Flex>
                    </Tooltip>
                    {hasModifiers && (
                        <Box
                            style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: 'gold',
                            }}
                        />
                    )}
                </Paper>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Modify Card</Menu.Label>

                <Menu shadow="md" width={200} trigger="hover" position="right-start">
                    <Menu.Target>
                        <Menu.Item leftSection={<IconEdit size={14} />} rightSection={<IconChevronRight size={14} />}>
                            Enhancement
                        </Menu.Item>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {['No Enhancement', 'Bonus Card', 'Mult Card', 'Wild Card', 'Glass Card', 'Steel Card', 'Stone Card', 'Gold Card', 'Lucky Card'].map(enh => (
                            <Menu.Item key={enh} onClick={() => onUpdate(card.id, { enhancement: enh })}>
                                {enh}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>

                <Menu shadow="md" width={200} trigger="hover" position="right-start">
                    <Menu.Target>
                        <Menu.Item leftSection={<IconEdit size={14} />} rightSection={<IconChevronRight size={14} />}>
                            Edition
                        </Menu.Item>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {['No Edition', 'Foil', 'Holographic', 'Polychrome', 'Negative'].map(ed => (
                            <Menu.Item key={ed} onClick={() => onUpdate(card.id, { edition: ed })}>
                                {ed}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>

                <Menu shadow="md" width={200} trigger="hover" position="right-start">
                    <Menu.Target>
                        <Menu.Item leftSection={<IconEdit size={14} />} rightSection={<IconChevronRight size={14} />}>
                            Seal
                        </Menu.Item>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {['No Seal', 'Red Seal', 'Blue Seal', 'Gold Seal', 'Purple Seal'].map(seal => (
                            <Menu.Item key={seal} onClick={() => onUpdate(card.id, { seal: seal })}>
                                {seal}
                            </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                </Menu>

                <Menu.Divider />
                <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => onRemove(card.id)}
                >
                    Remove Card
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}

// Deck statistics component
function DeckStats({ cards }: { cards: DeckCard[] }) {
    const stats = useMemo(() => getDeckStats(cards), [cards]);

    return (
        <Paper withBorder p="sm" mb="sm">
            <Group justify="space-between" mb="xs">
                <Text fw={600}>Deck Statistics</Text>
                <Badge size="lg" variant="filled">
                    {stats.total} Cards
                </Badge>
            </Group>
            <SimpleGrid cols={4} spacing="xs">
                <Tooltip label="Hearts">
                    <Paper withBorder p={4} ta="center" bg='white'>
                        <Text c="#e03131" fw={700}>♥ {stats.bySuit['Hearts'] || 0}</Text>
                    </Paper>
                </Tooltip>
                <Tooltip label="Diamonds">
                    <Paper withBorder p={4} ta="center" bg='white'>
                        <Text c="#1971c2" fw={700}>♦ {stats.bySuit['Diamonds'] || 0}</Text>
                    </Paper>
                </Tooltip>
                <Tooltip label="Clubs">
                    <Paper withBorder p={4} ta="center" bg='white'>
                        <Text c="#2f9e44" fw={700}>♣ {stats.bySuit['Clubs'] || 0}</Text>
                    </Paper>
                </Tooltip>
                <Tooltip label="Spades">
                    <Paper withBorder p={4} ta="center" bg='white'>
                        <Text c="#1c1c1c" fw={700}>♠ {stats.bySuit['Spades'] || 0}</Text>
                    </Paper>
                </Tooltip>
            </SimpleGrid>
            {(stats.withEdition > 0 || stats.withEnhancement > 0 || stats.withSeal > 0) && (
                <Group mt="xs" gap="xs">
                    {stats.withEdition > 0 && (
                        <Badge variant="light" color="violet">
                            {stats.withEdition} Editions
                        </Badge>
                    )}
                    {stats.withEnhancement > 0 && (
                        <Badge variant="light" color="teal">
                            {stats.withEnhancement} Enhanced
                        </Badge>
                    )}
                    {stats.withSeal > 0 && (
                        <Badge variant="light" color="orange">
                            {stats.withSeal} Sealed
                        </Badge>
                    )}
                </Group>
            )}
            {stats.bySource['pack'] && stats.bySource['pack'] > 0 && (
                <Text size="xs" c="dimmed" mt="xs">
                    +{stats.bySource['pack']} cards from packs
                </Text>
            )}
        </Paper>
    );
}

// Cards grouped by suit
function DeckBySuit({ cards }: { cards: DeckCard[] }) {
    const removeCard = useCardStore(state => state.removeCardFromDeck);
    const updateCard = useCardStore(state => state.updateCardInDeck);

    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const rankOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

    const cardsBySuit = useMemo(() => {
        const grouped: Record<string, DeckCard[]> = {};
        for (const suit of suits) {
            grouped[suit] = cards
                .filter(c => c.suit === suit)
                .sort((a, b) => {
                    const aRank = a.rank === '10' ? '10' : a.rank[0];
                    const bRank = b.rank === '10' ? '10' : b.rank[0];
                    return rankOrder.indexOf(aRank) - rankOrder.indexOf(bRank);
                });
        }
        return grouped;
    }, [cards]);

    const suitSymbols: Record<string, string> = {
        Hearts: '♥',
        Diamonds: '♦',
        Clubs: '♣',
        Spades: '♠',
    };

    return (
        <Accordion multiple defaultValue={suits}>
            {suits.map(suit => (
                <Accordion.Item key={suit} value={suit}>
                    <Accordion.Control>
                        <Group>
                            <Text fw={700}>
                                {suitSymbols[suit]} {suit}
                            </Text>
                            <Badge size="sm">{cardsBySuit[suit]?.length || 0}</Badge>
                        </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <SimpleGrid cols={7} spacing={4}>
                            {cardsBySuit[suit]?.map(card => (
                                <MiniDeckCard
                                    key={card.id}
                                    card={card}
                                    onRemove={removeCard}
                                    onUpdate={updateCard}
                                />
                            ))}
                        </SimpleGrid>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}

export function DeckDisplay() {
    const deckCards = useCardStore(state => state.deckState.cards);
    const isInitialized = useCardStore(state => state.deckState.isInitialized);
    const past = useCardStore(state => state.deckState.past);
    const future = useCardStore(state => state.deckState.future);

    const initializeDeck = useCardStore(state => state.initializeDeck);
    const clearDeck = useCardStore(state => state.clearDeck);
    const undoDeckChange = useCardStore(state => state.undoDeckChange);
    const redoDeckChange = useCardStore(state => state.redoDeckChange);

    const seed = useCardStore(state => state.immolateState.seed);

    // Auto-initialize deck when we have a seed but deck isn't initialized
    useEffect(() => {
        if (seed && !isInitialized) {
            initializeDeck();
        }
    }, [seed, isInitialized, initializeDeck]);

    // Show message if no seed entered yet
    if (!seed) {
        return (
            <Paper withBorder p="md">
                <Stack align="center" gap="md">
                    <IconCards size={48} opacity={0.5} />
                    <Text c="dimmed" ta="center">
                        Enter a seed to view your deck
                    </Text>
                </Stack>
            </Paper>
        );
    }


    return (
        <Stack gap="sm">
            <Group justify="space-between">
                <Title order={4}>
                    <Group gap="xs">
                        <IconCards size={20} />
                        Your Deck
                    </Group>
                </Title>
                <Group gap={4}>
                    <Tooltip label="Undo">
                        <ActionIcon
                            variant="light"
                            disabled={past.length === 0}
                            onClick={undoDeckChange}
                        >
                            <IconArrowBackUp size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Redo">
                        <ActionIcon
                            variant="light"
                            disabled={future.length === 0}
                            onClick={redoDeckChange}
                        >
                            <IconArrowForwardUp size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Reset Deck">
                        <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => {
                                if (window.confirm('Reset deck to starting state?')) {
                                    initializeDeck();
                                }
                            }}
                        >
                            <IconRefresh size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            <DeckStats cards={deckCards} />

            <ScrollArea h={400} type="auto">
                <DeckBySuit cards={deckCards} />
            </ScrollArea>
        </Stack>
    );
}

export default DeckDisplay;
