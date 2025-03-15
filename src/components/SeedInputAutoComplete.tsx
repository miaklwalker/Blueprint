import {Autocomplete, Button, Group, NativeSelect, Paper} from "@mantine/core";
import {SeedsWithLegendary} from "../modules/const.ts";
import {useCardStore} from "../modules/state/store.ts";


export function QuickAnalyze() {
    const seed = useCardStore(state => state.immolateState.seed);
    const setSeed = useCardStore(state => state.setSeed);
    const deck = useCardStore(state => state.immolateState.deck);
    const setDeck = useCardStore(state => state.setDeck);
    const setStart = useCardStore(state => state.setStart);
    const sectionWidth = 130;
    const select = (
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
    );
    return (
        <Paper withBorder shadow={'lg'} p={'1rem'} mb={'xl'} radius={'md'}>
            <Group align={'flex-end'}>
                <Autocomplete
                    flex={1}
                    w={500}
                    type="text"
                    placeholder="Enter Seed"
                    label="Analyze Seed"
                    data={[
                        {
                            group: 'Popular Seeds',
                            items: [
                                '7LB2WVPK',
                                'PHQ8P93R',
                                '8Q47WV6K',
                                'CRNWYUXA'
                            ]
                        }, {
                            group: 'Generated Seeds With Legendary Jokers',
                            items: SeedsWithLegendary

                        }
                    ]}
                    value={seed}
                    onChange={(e) => setSeed(e)}
                    rightSection={select}
                    rightSectionWidth={sectionWidth}
                />
                <Button onClick={() => setStart(seed.length >= 8)}> Analyze Seed </Button>
            </Group>
        </Paper>
    );

}

export default function SeedInputAutoComplete({seed, setSeed}: { seed: string, setSeed: (seed: string) => void }) {
    return (
        <Autocomplete
            flex={1}
            label={'Seed'}
            placeholder={'Enter Seed'}
            value={seed}
            onChange={(e) => setSeed(e)}
            data={[
                {
                    group: 'Popular Seeds',
                    items: [
                        '7LB2WVPK',
                        'PHQ8P93R',
                        '8Q47WV6K',
                        'CRNWYUXA'
                    ]
                }, {
                    group: 'Generated Seeds With Legendary Jokers',
                    items: SeedsWithLegendary

                }
            ]}
        />
    );
}