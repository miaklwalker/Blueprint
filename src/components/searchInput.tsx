import {Ante, SeedResultsContainer} from "../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useCardStore} from "../modules/state/store.ts";
import {useCallback, useMemo, useState} from "react";
import {closeSpotlight, openSpotlight, Spotlight} from "@mantine/spotlight";
import {BuyMetaData} from "../modules/classes/BuyMetaData.ts";
import {LOCATIONS} from "../modules/const.ts";
import {getMiscCardSources, MiscCardSource} from "../modules/ImmolateWrapper";
import {toHeaderCase} from "js-convert-case";
import {
    ActionIcon,
    Checkbox,
    CheckboxGroup,
    Divider,
    Group,
    HoverCard,
    HoverCardDropdown,
    HoverCardTarget,
    SimpleGrid,
    TextInput
} from "@mantine/core";
import {IconSearch, IconSettings} from "@tabler/icons-react";
import {useSetState} from "@mantine/hooks";
import {useGA} from "../modules/useGA.ts";

const registeredMiscSources = getMiscCardSources(15).map(source => source.name)
export default function SearchSeedInput({SeedResults}: { SeedResults: SeedResultsContainer | null }) {
    const searchString = useCardStore(state => state.searchState.searchTerm);
    const setSearchString = useCardStore(state => state.setSearchString);
    const goToResults = useCardStore(state => state.setSelectedSearchResult);
    const [searchActive, setSearchActive] = useState(false);
    const handleSearch = useCallback(() => {
        setSearchActive(true)
        openSpotlight()
    }, []);
    type sources = 'shop' | 'packs' | 'misc';
    type filterConfig = { enabled: boolean, children?: { [key: string]: filterConfig } };
    type sourceFilterConfig = {
        [key in sources]: filterConfig;
    };
    const [sourceFilterConfig, setSourceFilterConfig] = useSetState<sourceFilterConfig>({
        shop: {
            enabled: true
        },
        packs: {
            enabled: true
        },
        misc: {
            enabled: true,
            children: registeredMiscSources.reduce((acc, curr) => ({...acc, [curr]: {enabled: true}}), {} as {
                [key: string]: filterConfig
            })
        }
    });

    const updateSourceFilter = useCallback((parent: string, enabled?: boolean, child?: string, childEnabled?: boolean) => {
        if (!child) {
            let current = sourceFilterConfig[parent as sources];
            setSourceFilterConfig({[parent]: {...current, enabled: enabled ?? true}});
        } else {
            let current = sourceFilterConfig[parent as sources];
            if (current && current.children) {
                setSourceFilterConfig({
                    [parent]: {
                        enabled: current.enabled,
                        children: {
                            ...current.children,
                            [child]: {enabled: childEnabled ?? true}
                        }
                    }
                })
            }
        }
    }, [sourceFilterConfig, setSourceFilterConfig]);


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
        return cards.filter((card) => {
            const locationType = card.locationType;
            const location = card.location;
            if (locationType === LOCATIONS.SHOP) {
                return sourceFilterConfig.shop.enabled;
            }
            if (locationType === LOCATIONS.PACK) {
                return sourceFilterConfig.packs.enabled;
            }
            if (locationType === LOCATIONS.MISC) {
                const miscConfig = sourceFilterConfig.misc;
                if (miscConfig.enabled) {
                    const childConfig = miscConfig.children || {};
                    return childConfig[location]?.enabled ?? false;
                }
                return false;
            }
            return false;
        })
    }, [searchString, searchActive, sourceFilterConfig])
    return (
        <>
            <Spotlight
                nothingFound={searchString.length > 0 ? `
                    No results found. 
                   If the card you are seraching for is unlocked in game, like Eris or Lucky Cat make sure that you enabled that card in the events tab. (The hamburger menu on the right )
                `: 'Start typing to search for cards'}
                highlightQuery
                scrollable
                maxHeight={'80vh'}
                actions={
                    searchResults
                        .map((result: any, index) => {
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
                    )
                }
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
                    onClick={()=>{
                        useGA('search_bar_clicked')
                        openSpotlight()
                    }}
                    leftSection={
                        // <ActionIcon>
                        <HoverCard>
                            <HoverCardTarget>
                                <IconSettings/>
                            </HoverCardTarget>
                            <HoverCardDropdown>
                                <CheckboxGroup
                                    label={'Search Filters'}
                                    description={'Select which sources to include in search'}
                                    mb={'sm'}
                                    value={
                                    ['shop', 'packs', 'misc'].filter(source => sourceFilterConfig?.[source as sources]?.enabled)
                                    }
                                    onChange={(e:string[]) => {
                                        const sources = Object.keys(sourceFilterConfig) as sources[];
                                        for ( const source of sources ) {
                                            if(e.includes(source) && !sourceFilterConfig[source].enabled) {
                                                updateSourceFilter(source, true);
                                                return;
                                            } else if (!e.includes(source) && sourceFilterConfig[source].enabled) {
                                                updateSourceFilter(source, false);
                                                return;
                                            }
                                        }
                                        console.log("no changes detected", e);
                                    }}
                                >
                                    <Group mt={'sm'}>
                                        <Checkbox value="shop" label='shop'/>
                                        <Checkbox value='packs' label='packs' />
                                        <Checkbox value='misc' label='misc' />
                                    </Group>
                                </CheckboxGroup>
                                <Divider my={'md'} label={'misc sources'} />
                                <SimpleGrid cols={{ sm: 2, md: 3}}>
                                    {sourceFilterConfig.misc.enabled &&
                                        Object.keys(sourceFilterConfig.misc.children || {}).map((child) => (
                                            <Checkbox
                                                key={child}
                                                label={child}
                                                value={child}
                                                checked={sourceFilterConfig.misc.children ? sourceFilterConfig.misc.children[child]?.enabled : false}
                                                onChange={(e) => {
                                                    updateSourceFilter('misc', true, child, e.currentTarget.checked)
                                                }}
                                            />
                                        ))
                                    }
                                </SimpleGrid>
                            </HoverCardDropdown>
                        </HoverCard>

                        // </ActionIcon>
                    }
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
