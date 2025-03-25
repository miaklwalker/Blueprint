import {Ante, Seed} from "../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useCardStore} from "../modules/state/store.ts";
import {useCallback, useMemo, useState} from "react";
import {closeSpotlight, openSpotlight, Spotlight} from "@mantine/spotlight";
import {BuyMetaData} from "../modules/classes/BuyMetaData.ts";
import {LOCATIONS} from "../modules/const.ts";
import {MiscCardSource} from "../modules/ImmolateWrapper";
import {toHeaderCase} from "js-convert-case";
import {ActionIcon, Group, TextInput} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";

export default function SearchSeedInput({SeedResults}: { SeedResults: Seed | null }) {
    const searchString = useCardStore(state => state.searchState.searchTerm);
    const setSearchString = useCardStore(state => state.setSearchString);
    const goToResults = useCardStore(state => state.setSelectedSearchResult);
    const [searchActive, setSearchActive] = useState(false);
    const handleSearch = useCallback(() => {
        setSearchActive(true)
        openSpotlight()
    }, []);

    const searchResults = useMemo(() => {
        if (searchString === '' || !searchActive) return [];
        const cards: BuyMetaData[] = [];
        let antes: Ante[] = Object?.values(SeedResults?.antes ?? {});

        antes.forEach((ante: Ante) => {
            ante.queue.forEach((card, index) => {
                const cardString = `${(card?.edition && card.edition !== 'No Edition') ? card.edition : ''} ${card.name}`.trim();
                if (cardString.toLowerCase().includes(searchString.toLowerCase())) {

                    cards.push({
                        transactionType: "buy",
                        // @ts-ignore
                        card: card,
                        location: LOCATIONS.SHOP,
                        locationType: LOCATIONS.SHOP,
                        ante: String(ante.ante),
                        name: cardString,
                        index: index,
                        blind: 'smallBlind'
                    })
                }
            })
            Object.keys(ante.blinds).forEach((blind) => {
                ante.blinds[blind]?.packs?.forEach((pack) => {
                    pack.cards.forEach((card: any, index: number) => {
                        const cardString = `${card?.edition ?? ''} ${card.name}`.trim();
                        if (cardString.toLowerCase().includes(searchString.toLowerCase())) {
                            cards.push({
                                transactionType: "buy",
                                card: card,
                                location: pack.name,
                                locationType: LOCATIONS.PACK,
                                ante: String(ante.ante),
                                name: cardString,
                                index: index,
                                blind: blind
                            })
                        }
                    })
                })
            })
            Object.values(ante.miscCardSources).forEach((source: MiscCardSource) => {
                source.cards.forEach((card: any, index) => {
                    const cardString = `${card?.edition ?? ''} ${card.name}`.trim();
                    if (cardString.toLowerCase().includes(searchString.toLowerCase())) {
                        cards.push({
                            transactionType: "buy",
                            card: card,
                            location: source.name,
                            locationType: LOCATIONS.MISC,
                            ante: String(ante.ante),
                            name: cardString,
                            index: index,
                            blind: 'smallBlind'
                        })
                    }
                })
            });
        })
        return cards
    }, [searchString, searchActive])
    return (
        <>
            <Spotlight
                nothingFound="Nothing found..."
                highlightQuery
                scrollable
                maxHeight={450}
                actions={
                    searchResults.map((result: any, index) => {
                            const name = result.name;
                            const edition = result?.['edition'];
                            const label = edition && edition !== 'No Edition' ? `${edition} ${name}` : name;

                            const locationType = result?.locationType;

                            let description = '';
                            if (locationType === LOCATIONS.SHOP) {
                                description += `ANTE ${result.ante} SHOP: Card ${result.index + 1}`;
                            }
                            if (locationType === LOCATIONS.PACK) {
                                description += `ANTE ${result.ante} Blind: ${toHeaderCase(result.blind)} ${result.location}`;
                            }
                            if (locationType === LOCATIONS.MISC) {
                                description += `ANTE ${result.ante} ${result.location}: Card ${result.index + 1}`;
                            }

                            return {
                                id: String(index),
                                label,
                                description,
                                group: result.location,
                                onClick: () => {
                                    closeSpotlight()
                                    goToResults(result)
                                }
                            }
                        }
                    )}
                searchProps={{
                    value: searchString,
                    onChange: (e) => {
                        let query = e.currentTarget.value;
                        setSearchActive(query !== '')
                        setSearchString(query)
                    },
                }}
            />
            <Group align={'flex-end'}>
                <TextInput
                    flex={1}
                    placeholder={'Search for cards'}
                    onClick={openSpotlight}
                    rightSection={
                        <ActionIcon onClick={handleSearch}>
                            <IconSearch/>
                        </ActionIcon>
                    }
                />
            </Group>

        </>

    )
}
