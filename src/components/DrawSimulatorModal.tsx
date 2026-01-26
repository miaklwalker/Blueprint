import React, { useEffect, useState } from 'react';
import {
    Modal,
    Group,
    Select,
    Button,
    SimpleGrid,
    Text,
    Stack,
    Box,
    Paper,
    Tooltip,
    Flex
} from '@mantine/core';
import { IconTrash, IconSortAscending, IconRefresh } from '@tabler/icons-react';
import { useCardStore } from '../modules/state/store.ts';
import { Game } from '../modules/balatrots/Game.ts';
import { Deck, deckMap } from '../modules/balatrots/enum/Deck.ts';
import { Stake, stakeMap } from '../modules/balatrots/enum/Stake.ts';
import { InstanceParams } from '../modules/balatrots/struct/InstanceParams.ts';
import { convertGameCardToDeckCard, type DeckCard } from '../modules/deckUtils.ts';
import { Card, PlayingCard } from '../modules/balatrots/enum/cards/Card.ts';
import { EditionItem, Edition } from '../modules/balatrots/enum/Edition.ts';
import { SealItem, Seal } from '../modules/balatrots/enum/Seal.ts';

// Inline MiniCard for simplicity, or re-export from DeckDisplay if possible. 
// Duplicating small part for independence or I can define it here.
function SimCard({ card, selected, onClick }: { card: DeckCard, selected: boolean, onClick: () => void }) {
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
        <Paper
            withBorder
            p={4}
            onClick={onClick}
            style={{
                cursor: 'pointer',
                position: 'relative',
                backgroundColor: selected ? '#e7f5ff' : (hasModifiers ? 'rgba(255, 255, 255)' : undefined),
                borderColor: selected ? '#339af0' : undefined,
                borderWidth: selected ? 2 : 1,
                transition: 'transform 0.1s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
            {hasModifiers && !selected && (
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
    );
}

export function DrawSimulatorModal() {
    const opened = useCardStore(state => state.applicationState.drawSimulatorModalOpen);
    const close = useCardStore(state => state.closeDrawSimulatorModal);

    // Game State Inputs
    const seed = useCardStore(state => state.immolateState.seed);
    const deckType = useCardStore(state => state.immolateState.deck);
    const stake = useCardStore(state => state.immolateState.stake);
    const gameVersion = useCardStore(state => state.immolateState.gameVersion);
    const customDeck = useCardStore(state => state.deckState.cards);

    // Simulation State
    const [ante, setAnte] = useState<string>('1');
    const [blind, setBlind] = useState<string>('1'); // 1=Small, 2=Big, 3=Boss
    const [fullShuffledDeck, setFullShuffledDeck] = useState<DeckCard[]>([]);
    const [hand, setHand] = useState<DeckCard[]>([]);
    const [deckPointer, setDeckPointer] = useState<number>(0);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [handSize, setHandSize] = useState<number>(8);
    const [discardsUsed, setDiscardsUsed] = useState<number>(0);

    // Reset when opened
    useEffect(() => {
        if (opened) {
            simulate();
        }
    }, [opened]);

    const simulate = () => {
        if (!seed) return;

        // 1. Instantiate Game
        const d = new Deck(deckMap[deckType] || deckMap['Red Deck']);
        const s = new Stake(stakeMap[stake || 'White Stake']);
        const v = Number(gameVersion || '10106');
        const params = new InstanceParams(d, s, false, v);
        const engine = new Game(seed, params);

        // 2. Inject Custom Deck
        if (customDeck && customDeck.length > 0) {
            const convertedCards = customDeck.map((dc) => {
                // Fix enhancement name mismatch
                let enhancement = dc.enhancement;
                if (enhancement && enhancement.endsWith(" Card")) {
                    enhancement = enhancement.replace(" Card", "");
                }
                return new Card(
                    dc.base as PlayingCard,
                    enhancement,
                    new EditionItem(dc.edition as Edition),
                    new SealItem(dc.seal as Seal)
                );
            });
            engine.setCustomDeck(convertedCards);
        }

        // 3. Shuffle
        const anteNum = parseInt(ante);
        const blindNum = parseInt(blind);
        // getShuffledDeck returns the full deck in draw order (index 0 is top of deck)
        // Wait, Game.getShuffledDeck returns reversed array? (FILO). 
        // Game.ts: "Return reversed so index 0 is the first card drawn."
        // Yes.
        const shuffled = engine.getShuffledDeck(anteNum, blindNum);

        // Convert to DeckCard
        const shuffledDeckCards = shuffled.map((c, i) => convertGameCardToDeckCard(c, i));

        setFullShuffledDeck(shuffledDeckCards);

        // 4. Draw Initial Hand
        const initialHand = shuffledDeckCards.slice(0, handSize);
        setHand(initialHand);
        setDeckPointer(handSize);
        setSelectedCards([]);
        setDiscardsUsed(0);
    };

    const toggleSelection = (id: string) => {
        if (selectedCards.includes(id)) {
            setSelectedCards(selectedCards.filter(cid => cid !== id));
        } else if (selectedCards.length < 5) { // Max discard size usually 5
            setSelectedCards([...selectedCards, id]);
        }
    };

    const discard = () => {
        if (selectedCards.length === 0) return;

        // Remove selected cards from hand
        const remainingHand = hand.filter(c => !selectedCards.includes(c.id));

        // Draw replacements
        const numToDraw = selectedCards.length;
        const newCards = fullShuffledDeck.slice(deckPointer, deckPointer + numToDraw);

        setHand([...remainingHand, ...newCards]);
        setDeckPointer(deckPointer + numToDraw);
        setSelectedCards([]);
        setDiscardsUsed(prev => prev + 1);
    };

    const sortHand = (type: 'rank' | 'suit') => {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const rankOrder = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

        const sorted = [...hand].sort((a, b) => {
            if (type === 'suit') {
                if (a.suit !== b.suit) return suits.indexOf(a.suit) - suits.indexOf(b.suit);
                // Secondary sort by rank
                const aRank = a.rank === '10' ? '10' : a.rank[0];
                const bRank = b.rank === '10' ? '10' : b.rank[0];
                return rankOrder.indexOf(aRank) - rankOrder.indexOf(bRank);
            } else {
                const aRank = a.rank === '10' ? '10' : a.rank[0];
                const bRank = b.rank === '10' ? '10' : b.rank[0];
                if (aRank !== bRank) return rankOrder.indexOf(aRank) - rankOrder.indexOf(bRank);
                // Secondary sort by suit
                return suits.indexOf(a.suit) - suits.indexOf(b.suit);
            }
        });
        setHand(sorted);
    };

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Draw Simulator"
            size="lg"
            centered
        >
            <Stack>
                <Group align="flex-end">
                    <Select
                        label="Ante"
                        data={Array.from({ length: 8 }, (_, i) => (i + 1).toString())}
                        value={ante}
                        onChange={(val) => val && setAnte(val)}
                        w={80}
                    />
                    <Select
                        label="Blind"
                        data={[
                            { value: '1', label: 'Small Blind' },
                            { value: '2', label: 'Big Blind' },
                            { value: '3', label: 'Boss Blind' }
                        ]}
                        value={blind}
                        onChange={(val) => val && setBlind(val)}
                    />
                    <Select
                        label="Hand Size"
                        data={['5', '6', '7', '8', '9', '10']}
                        value={handSize.toString()}
                        onChange={(val) => val && setHandSize(parseInt(val))}
                        w={80}
                    />
                    <Button onClick={simulate} leftSection={<IconRefresh size={16} />}>
                        Simulate / Reset
                    </Button>
                </Group>

                <Paper withBorder p="md" bg="gray.1">
                    <Group justify="space-between" mb="xs">
                        <Text fw={600}>Hand ({hand.length})</Text>
                        <Group>
                            <Button
                                variant="light"
                                size="xs"
                                leftSection={<IconSortAscending size={14} />}
                                onClick={() => sortHand('rank')}
                            >
                                Rank
                            </Button>
                            <Button
                                variant="light"
                                size="xs"
                                leftSection={<IconSortAscending size={14} />}
                                onClick={() => sortHand('suit')}
                            >
                                Suit
                            </Button>
                        </Group>
                    </Group>

                    {hand.length > 0 ? (
                        <SimpleGrid cols={8} spacing="xs" verticalSpacing="xs">
                            {hand.map(card => (
                                <SimCard
                                    key={card.id}
                                    card={card}
                                    selected={selectedCards.includes(card.id)}
                                    onClick={() => toggleSelection(card.id)}
                                />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Text c="dimmed" ta="center" py="xl">No cards in hand</Text>
                    )}
                </Paper>

                <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                        Cards remaining in deck: {fullShuffledDeck.length - deckPointer}
                    </Text>
                    <Group>
                        <Text size="sm">Discards used: {discardsUsed}</Text>
                        <Button
                            color="red"
                            variant="light"
                            leftSection={<IconTrash size={16} />}
                            disabled={selectedCards.length === 0}
                            onClick={discard}
                        >
                            Discard Selected ({selectedCards.length})
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </Modal>
    );
}
