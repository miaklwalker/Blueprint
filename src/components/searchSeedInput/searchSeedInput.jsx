import {useCallback, useEffect} from "react";
import {extractShopQueues} from "../../modules/utils.js";
import {openSpotlight, Spotlight} from "@mantine/spotlight";
import {ActionIcon, Group, TextInput} from "@mantine/core";
import {IconSearch} from "@tabler/icons-react";
import {useBlueprintStore} from "../../modules/store.js";



class SearchResult {
    constructor({ante, blind, location, index, name}) {
        this.ante = ante
        this.blind = blind || undefined
        this.location = location
        this.index = index
        this.name = name
    }
}

export function SearchSeedInput({...props}) {
    const results = useBlueprintStore(state => state.results)
    const searchString = useBlueprintStore(state => state.globalSearch);
    const setSearchString = useBlueprintStore(state => state.setGlobalSearchString)
    const searchResults = useBlueprintStore(state => state.searchResults)
    const setSearchResults = useBlueprintStore(state => state.setSearchResults)
    const goToResults = useBlueprintStore(state => state.goToResult)


    useEffect(() => {
        const queues = extractShopQueues(results);
        const resultsFound = [];
        const LOWER_CASE_SEARCH_STRING = searchString.toLowerCase();
        if(!searchString || !searchString?.length) return;
        for (let {packs, queue, tags, voucher, boss, title: ante} of queues) {
            let title = ante.replaceAll('=', '');
            let inQueue = queue.some(card => card?.toLowerCase()?.includes(LOWER_CASE_SEARCH_STRING));
            if (inQueue) {
                let index = queue.findIndex(card => card?.toLowerCase().includes(LOWER_CASE_SEARCH_STRING));
                let name = queue[index].split(')')[1]
                resultsFound.push(new SearchResult({ante: title, location: 'queue', index, name}))
            }
            for (let i = 0; i < packs.length; i++) {
                //todo Make pack determine Blind
                let pack = packs[i];
                const [name, contents] = pack.split('-');
                if (contents?.toLowerCase()?.includes(LOWER_CASE_SEARCH_STRING)) {
                    let matchName = contents.split(',').find(item => item?.toLowerCase().includes(LOWER_CASE_SEARCH_STRING))
                    resultsFound.push(new SearchResult({ante: title, location: name, name: matchName, index: i}))
                }
            }
            // User Could Also Be Searching For Voucher Or Tags Or Boss
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                if (tag.includes(searchString)) {
                    resultsFound.push(new SearchResult({ante: title, location: 'tags', index: i}))
                }
            }
            if (boss.includes(searchString)) {
                resultsFound.push(new SearchResult({ante: title, location: 'boss', index: 0}))
            }
            if (voucher.includes(searchString)) {
                resultsFound.push(new SearchResult({ante: title, location: 'voucher', index: 0}))
            }
        }
        setSearchResults(resultsFound)
    }, [searchString, results])

    const handleSearch = useCallback(() => {
        openSpotlight()
    }, []);


    return (
        <>
            <Spotlight
                nothingFound="Nothing found..."
                actions={
                    searchResults.map((result, index) => ({
                        id: index,
                        description: result.name + ` ${result.location === 'queue' ? ` | Queue Position: ${result.index}` : ''}`,
                        label: `${result.ante} (${result.location}) `,
                        onClick: () => {
                            // closeSpotlight()
                            goToResults(result)
                        }
                    }))
                }
                searchProps={{
                    value: searchString,
                    onChange: (e) => {
                        setSearchString(e.currentTarget.value)
                        handleSearch()
                    },
                }}
            />
            <Group align={'flex-end'} {...props}>
                <TextInput
                    flex={1}
                    value={searchString}
                    placeholder={'Search for cards'}
                    onChange={e => setSearchString(e.currentTarget.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleSearch()
                        }
                    }}
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
