// Enum for deck types
export enum DeckType {
    RED_DECK = "RED_DECK",
    BLUE_DECK = "BLUE_DECK",
    YELLOW_DECK = "YELLOW_DECK",
    GREEN_DECK = "GREEN_DECK",
    BLACK_DECK = "BLACK_DECK",
    MAGIC_DECK = "MAGIC_DECK",
    NEBULA_DECK = "NEBULA_DECK",
    GHOST_DECK = "GHOST_DECK",
    ABANDONED_DECK = "ABANDONED_DECK",
    CHECKERED_DECK = "CHECKERED_DECK",
    ZODIAC_DECK = "ZODIAC_DECK",
    PAINTED_DECK = "PAINTED_DECK",
    ANAGLYPH_DECK = "ANAGLYPH_DECK",
    PLASMA_DECK = "PLASMA_DECK",
    ERRATIC_DECK = "ERRATIC_DECK"
}

// Interface for deck properties
interface DeckProps {
    name: string;
}

// Map of deck names
const deckNames: Record<DeckType, string> = {
    [DeckType.RED_DECK]: "Red Deck",
    [DeckType.BLUE_DECK]: "Blue Deck",
    [DeckType.YELLOW_DECK]: "Yellow Deck",
    [DeckType.GREEN_DECK]: "Green Deck",
    [DeckType.BLACK_DECK]: "Black Deck",
    [DeckType.MAGIC_DECK]: "Magic Deck",
    [DeckType.NEBULA_DECK]: "Nebula Deck",
    [DeckType.GHOST_DECK]: "Ghost Deck",
    [DeckType.ABANDONED_DECK]: "Abandoned Deck",
    [DeckType.CHECKERED_DECK]: "Checkered Deck",
    [DeckType.ZODIAC_DECK]: "Zodiac Deck",
    [DeckType.PAINTED_DECK]: "Painted Deck",
    [DeckType.ANAGLYPH_DECK]: "Anaglyph Deck",
    [DeckType.PLASMA_DECK]: "Plasma Deck",
    [DeckType.ERRATIC_DECK]: "Erratic Deck"
};

export class Deck implements DeckProps {
    private readonly type: DeckType;
    
    constructor(type: DeckType) {
        this.type = type;
    }

    get name(): string {
        return deckNames[this.type];
    }
}