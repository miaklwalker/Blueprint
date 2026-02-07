import type { Card_Final, StandardCard_Final } from "./ImmolateWrapper/CardEngines/Cards.ts";
import type { Card } from "./balatrots/enum/cards/Card.ts";

// Standard deck suits and ranks
const SUITS = ['Hearts', 'Diamonds', 'Clubs', 'Spades'] as const;
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'] as const;

// Map for base card format (e.g., "H_2" for 2 of Hearts)
export const SUIT_CODES: Record<string, string> = {
    'Hearts': 'H',
    'Diamonds': 'D',
    'Clubs': 'C',
    'Spades': 'S'
};

export const RANK_CODES: Record<string, string> = {
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': 'T',
    'Jack': 'J',
    'Queen': 'Q',
    'King': 'K',
    'Ace': 'A'
};

// Reverse maps for code -> human readable conversion
const CODE_TO_SUIT: Record<string, string> = {
    'H': 'Hearts',
    'D': 'Diamonds',
    'C': 'Clubs',
    'S': 'Spades'
};

const CODE_TO_RANK: Record<string, string> = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
    '7': '7', '8': '8', '9': '9', 'T': '10',
    'J': 'Jack', 'Q': 'Queen', 'K': 'King', 'A': 'Ace'
};

export interface DeckCard {
    id: string;
    name: string;
    type: string;
    rank: string;
    suit: string;
    base: string;
    edition?: string;
    enhancement?: string;
    seal?: string;
    // Track where this card came from
    source: 'starting' | 'pack' | 'shop' | 'spectral' | 'tarot' | 'other';
    sourceDetails?: {
        ante?: number;
        blind?: string;
        packName?: string;
    };
}

/**
 * Generates the starting deck based on deck type
 * Mirrors the logic from Game.ts
 */
export function generateStartingDeck(deckType?: string): Array<DeckCard> {
    const deck: Array<DeckCard> = [];
    let cardIndex = 0;

    // Determine which cards to include based on deck type
    switch (deckType) {
        case 'Abandoned Deck':
            // 40 cards, no face cards (J, Q, K)
            for (const suit of SUITS) {
                for (const rank of RANKS) {
                    // Skip face cards
                    if (['Jack', 'Queen', 'King'].includes(rank)) continue;

                    const base = `${SUIT_CODES[suit]}_${RANK_CODES[rank]}`;
                    const name = `${rank} of ${suit}`;

                    deck.push({
                        id: `starting_${cardIndex}`,
                        name,
                        type: 'Standard',
                        rank,
                        suit,
                        base,
                        source: 'starting'
                    });
                    cardIndex++;
                }
            }
            break;

        case 'Checkered Deck':
            // 52 cards but only Hearts and Spades (duplicated)
            // Clubs become Spades, Diamonds become Hearts
            for (const suit of SUITS) {
                for (const rank of RANKS) {
                    // Map suits: C->S, D->H
                    let actualSuit = suit;
                    if (suit === 'Clubs') actualSuit = 'Spades';
                    if (suit === 'Diamonds') actualSuit = 'Hearts';

                    const base = `${SUIT_CODES[actualSuit]}_${RANK_CODES[rank]}`;
                    const name = `${rank} of ${actualSuit}`;

                    deck.push({
                        id: `starting_${cardIndex}`,
                        name,
                        type: 'Standard',
                        rank,
                        suit: actualSuit,
                        base,
                        source: 'starting'
                    });
                    cardIndex++;
                }
            }
            break;

        case 'Erratic Deck':
            // For erratic deck, we can't know the random cards without the seed
            // So we'll just create a standard 52-card deck as placeholder
            // The actual erratic cards would need to be computed from the Game engine
            for (const suit of SUITS) {
                for (const rank of RANKS) {
                    const base = `${SUIT_CODES[suit]}_${RANK_CODES[rank]}`;
                    const name = `${rank} of ${suit}`;

                    deck.push({
                        id: `starting_${cardIndex}`,
                        name,
                        type: 'Standard',
                        rank,
                        suit,
                        base,
                        source: 'starting'
                    });
                    cardIndex++;
                }
            }
            break;

        default:
            // Standard 52-card deck for all other deck types
            // (Red, Blue, Yellow, Green, Black, Magic, Nebula, Ghost, Zodiac, Painted, Anaglyph, Plasma)
            for (const suit of SUITS) {
                for (const rank of RANKS) {
                    const base = `${SUIT_CODES[suit]}_${RANK_CODES[rank]}`;
                    const name = `${rank} of ${suit}`;

                    deck.push({
                        id: `starting_${cardIndex}`,
                        name,
                        type: 'Standard',
                        rank,
                        suit,
                        base,
                        source: 'starting'
                    });
                    cardIndex++;
                }
            }
            break;
    }

    return deck;
}

/**
 * Convert a card from the game's format to a DeckCard
 */
export function convertToDeckCard(
    card: Card_Final | StandardCard_Final,
    source: DeckCard['source'],
    sourceDetails?: DeckCard['sourceDetails']
): DeckCard | null {
    // Only standard playing cards should be added to the deck
    if (card.type !== 'Standard' && !card.base) {
        return null;
    }

    return {
        id: `${source}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: card.name,
        type: 'Standard',
        rank: card.rank ?? '',
        suit: card.suit ?? '',
        base: card.base ?? '',
        edition: card.edition,
        enhancement: card.enhancements,
        seal: card.seal,
        source,
        sourceDetails
    };
}

/**
 * Get deck statistics
 */
export function getDeckStats(deck: Array<DeckCard>) {
    const stats = {
        total: deck.length,
        bySuit: {} as Record<string, number>,
        byRank: {} as Record<string, number>,
        withEdition: 0,
        withEnhancement: 0,
        withSeal: 0,
        bySource: {} as Record<string, number>
    };

    for (const card of deck) {
        // By suit
        stats.bySuit[card.suit] = (stats.bySuit[card.suit] || 0) + 1;

        // By rank
        stats.byRank[card.rank] = (stats.byRank[card.rank] || 0) + 1;

        // Special attributes
        if (card.edition && card.edition !== 'No Edition') stats.withEdition++;
        if (card.enhancement && card.enhancement !== 'No Enhancement') stats.withEnhancement++;
        if (card.seal && card.seal !== 'No Seal') stats.withSeal++;

        // By source
        stats.bySource[card.source] = (stats.bySource[card.source] || 0) + 1;
    }

    return stats;
}

/**
 * Convert a Game Card to a DeckCard
 */
export function convertGameCardToDeckCard(card: Card, index: number): DeckCard {
    const name = card.getName(); // Format: "S_A", "H_T", etc.
    let suitCode = 'S';
    let rankCode = 'A';

    if (typeof name === 'string' && name.includes('_')) {
        [suitCode, rankCode] = name.split('_');
    }

    // Safely look up suit and rank, defaulting if not found (though they should be)
    const suit = CODE_TO_SUIT[suitCode] || 'Spades';
    const rank = CODE_TO_RANK[rankCode] || 'Ace';

    return {
        id: `starting_${index}_${Math.random().toString(36).substr(2, 5)}`,
        name: `${rank} of ${suit}`,
        type: 'Standard',
        rank,
        suit,
        base: typeof name === 'string' ? name : String(name),
        source: 'starting',
        edition: card.getEdition()?.name,
        enhancement: card.getEnhancement(),
        seal: card.getSeal()?.name
    };
}
