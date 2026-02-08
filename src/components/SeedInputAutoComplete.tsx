import React, {useState, useRef} from "react";
import { Autocomplete, Button, Group, NativeSelect, Paper } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import {popularSeeds, SeedsWithLegendary} from "../modules/const.ts";
import {useCardStore} from "../modules/state/store.ts";
import {sanitizeSeed} from "../modules/utils.ts";

const seedAutoCompleteData = [
    {
        group: 'Popular Seeds',
        items: popularSeeds
    }, {
        group: 'Generated Seeds With Legendary Jokers',
        items: SeedsWithLegendary
    }
];

const allSuggestions = [...popularSeeds, ...SeedsWithLegendary];

interface SeedInputProps {
    seed: string;
    setSeed: (seed: string) => void;
    w?: number | string;
    showDeckSelect?: boolean;
    label?: string;
    placeholder?: string;
}

function SeedInputAutoComplete({ seed, setSeed, w, showDeckSelect, label = 'Seed', placeholder = 'Enter Seed' }: SeedInputProps) {
    const [localSeed, setLocalSeed] = useState(seed);
    const isDirty = useRef(false);

    // Sync from store when not actively editing
    if (!isDirty.current && localSeed !== seed) {
        setLocalSeed(seed);
    }

    const debouncedSetSeed = useDebouncedCallback((value: string) => {
        setLocalSeed(sanitizeSeed(value));
        if (value) setSeed(value);
        isDirty.current = false;
    }, 160);

    const deck = useCardStore(state => state.immolateState.deck);
    const setDeck = useCardStore(state => state.setDeck);

    const sectionWidth = 130;
    const deckSelect = showDeckSelect ? (
        <NativeSelect
            rightSectionWidth={28}
            styles={{
                input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: sectionWidth,
                    marginRight: -2,
                },
            }}
            value={deck}
            onChange={(e) => setDeck(e.currentTarget.value)}
        >
            <option value="Red Deck">Red Deck</option>
            <option value="Blue Deck">Blue Deck</option>
            <option value="Yellow Deck">Yellow Deck</option>
            <option value="Green Deck">Green Deck</option>
            <option value="Black Deck">Black Deck</option>
            <option value="Magic Deck">Magic Deck</option>
            <option value="Nebula Deck">Nebula Deck</option>
            <option value="Ghost Deck">Ghost Deck</option>
            <option value="Abandoned Deck">Abandoned Deck</option>
            <option value="Checkered Deck">Checkered Deck</option>
            <option value="Zodiac Deck">Zodiac Deck</option>
            <option value="Painted Deck">Painted Deck</option>
            <option value="Anaglyph Deck">Anaglyph Deck</option>
            <option value="Plasma Deck">Plasma Deck</option>
            <option value="Erratic Deck">Erratic Deck</option>
        </NativeSelect>
    ) : undefined;

    return (
        <Autocomplete
            flex={1}
            w={w}
            type="text"
            label={label}
            placeholder={placeholder}
            data={seedAutoCompleteData}
            value={localSeed}
            onChange={(value) => {
                isDirty.current = true;
                setLocalSeed(value);
                if (allSuggestions.includes(value)) {
                    setSeed(value);
                    isDirty.current = false;
                } else {
                    debouncedSetSeed(value);
                }
            }}
            rightSection={deckSelect}
            rightSectionWidth={showDeckSelect ? sectionWidth : undefined}
        />
    );
}

export function QuickAnalyze() {
    const seed = useCardStore(state => state.immolateState.seed);
    const setSeed = useCardStore(state => state.setSeed);
    const setStart = useCardStore(state => state.setStart);

    return (
        <Paper withBorder shadow={'lg'} p={'1rem'} radius={'md'}>
            <Group align={'flex-end'}>
                <SeedInputAutoComplete
                    seed={seed}
                    setSeed={setSeed}
                    w={500}
                    showDeckSelect
                    label="Analyze Seed"
                />
                <Button onClick={() => {
                    setStart(seed.length >= 5);
                }}> Analyze Seed </Button>
            </Group>
        </Paper>
    );
}

export default SeedInputAutoComplete;