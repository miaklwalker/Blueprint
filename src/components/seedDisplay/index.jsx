import {useEffect, useMemo, useState} from "react";
import {Carousel} from "@mantine/carousel";
import {
    Box, Center,
    Fieldset,
    Flex,
    Grid,
    Group, NativeSelect,
    Paper, ScrollArea,
    SegmentedControl,
    SimpleGrid, Stack,
    Tabs, Text,
    Title,
    Tooltip
} from "@mantine/core";
import {extractShopQueues, renderBoss, renderTag, renderVoucher} from "../../modules/utils.js";
import {blinds} from "../../modules/const.js";
import {useViewportSize} from "@mantine/hooks";
import {RenderCardWithCanvas} from "../canvasRenderers/renderCardWithCanvas.jsx";
import {RenderWithCanvas} from "../canvasRenderers/renderWithCanvas.jsx";
import {SearchSeedInput} from "../searchSeedInput/searchSeedInput.jsx";
import {useBlueprintStore} from "../../modules/store.js";
import {PurchaseItemWrapper} from "../purchaseItemWrapper/index.jsx";


export function Queue({cards, width = 71, height = 95, scale = 1}) {
    const [embla, setEmbla] = useState(null);
    const selectedResult = useBlueprintStore(state => state.selectedSearchResult);
    const selectedBlind = useBlueprintStore(state => state.selectedBlind);
    const selectedAnte = useBlueprintStore(state => state.selectedAnte);

    useEffect(() => {
        if (embla && selectedResult) {
            if (selectedResult?.location === 'queue' && selectedResult?.index) {
                embla.scrollTo(selectedResult.index - 1)
            }
        }
    }, [embla, selectedResult])
    let slideWidth = width * scale;
    let slideHeight = height * scale;
    let results = cards.map((card, index) => (
        <Carousel.Slide key={card} pt={'1rem'}>
            <RenderCardWithCanvas
                searched={selectedResult?.location === 'queue' && selectedResult?.index === index}
                meta={{selectedBlind, selectedAnte, location: 'queue'}}
                value={card}
                width={slideWidth}
                height={slideHeight}
            />
        </Carousel.Slide>
    ))
    return (
        <Box maw={'100%'}>
            <Paper withBorder>
                <Carousel
                    // withControls={false}
                    // loop={true}
                    getEmblaApi={setEmbla}
                    align="center"
                    initialSlide={0}
                    containScroll={"trimSnaps"}
                    slideSize={{base: Number(slideWidth + 20)}}
                    height={slideHeight + (70 * scale)}
                    dragFree
                    type="container"
                    slideGap={{base: 'md'}}
                >
                    {results}
                </Carousel>
            </Paper>
        </Box>


    )
}

export function Packs({value, width = 71, height = 95, scale = 1}) {
    const selectedBlind = useBlueprintStore(state => state.selectedBlind);
    const tab = useBlueprintStore(state => state.selectedAnte);
    const firstBlindOffset = tab !== 'ANTE 1' ? 2 : 0;
    const offsets = {
        "Small Blind": [
            0,
            2
        ],
        "Big Blind": [
            0 + firstBlindOffset,
            2 + firstBlindOffset
        ],
        "Boss Blind": [
            2 + firstBlindOffset,
            4 + firstBlindOffset
        ]
    }
    const blindOffset = offsets[selectedBlind];

    const packs = value.slice(...blindOffset).map((item, index) => {
        const [title, contents] = item.split('-')
        const count = contents.split(',').length;
        return (
            <Fieldset w={'100%'} legend={title} key={index}>
                <SimpleGrid cols={{base: count + 1, lg: 6}}>
                    {
                        contents.split(',').map((item, index) => (
                            <RenderCardWithCanvas
                                meta={{
                                    selectedAnte: tab,
                                    selectedBlind: selectedBlind,
                                    location: "pack",
                                    type: 'card',
                                }}
                                key={index}
                                value={item}
                                width={width}
                                height={height}
                                scale={scale}
                            />
                        ))
                    }
                </SimpleGrid>
            </Fieldset>
        )
    })

    return (
        <Flex justify={'space-evenly'} direction={{base: 'column', lg: 'row'}} gap={{lg: '2rem'}}>
            {packs}
        </Flex>
    )
}

export function AntePanel({ante}) {
    let title = ante.title.replaceAll('=', '');
    const tab = useBlueprintStore(state => state.selectedAnte);
    const selectedBlind = useBlueprintStore(state => state.selectedBlind);
    const setSelectedBlind = useBlueprintStore(state => state.setSelectedBlind)

    const isFirstAnteSmallBlind = (blind) => blind === 'Small Blind' && tab === 'ANTE 1'

    return (
        <Tabs.Panel value={title} key={title}>
            <Paper h={'100%'} withBorder p={'1rem'}>
                <Grid>
                    <Grid.Col order={{base: 1, lg: 1}} span={{base: 12}}>
                        <Box mb={'lg'} w={'100%'}>
                            <SegmentedControl
                                value={selectedBlind}
                                onChange={setSelectedBlind}
                                fullWidth
                                radius="xl"
                                mb={'sm'}
                                data={blinds.map(blind => ({
                                    value: blind,
                                    label: blind,
                                    disabled: isFirstAnteSmallBlind(blind)
                                }))}
                            />
                        </Box>
                    </Grid.Col>
                    <Grid.Col order={{base: 2, lg: 2}} span={{base: 12, lg: 12}}>
                        <Title order={4} ta={'left'} mb={'.25rem'}> Shop </Title>
                        <Queue cards={ante.queue}/>
                    </Grid.Col>
                    <Grid.Col order={{base: 3, lg: 3}} span={{base: 12, lg: 12}}>
                        <Packs value={ante.packs}/>
                    </Grid.Col>
                    <Grid.Col order={{base: 4, lg: 4}} span={{base: 12}}>
                        <Group justify={'flex-start'} align={'flex-start'}>

                            <Flex w={'fit-content'} direction={'column'} justify={'flex-start'}>
                                <Title order={4} ta={'left'} mb={'.25rem'}> Voucher </Title>
                                <PurchaseItemWrapper
                                    showWikiLink
                                    wikiLink={'https://balatrogame.fandom.com/wiki/Vouchers'}
                                    meta={{
                                        selectedAnte: tab,
                                        selectedBlind: selectedBlind,
                                        location: "shop",
                                        type: 'voucher',
                                        cardName: ante.voucher
                                    }}

                                >
                                    <Center>
                                        <RenderWithCanvas
                                            name={'Voucher'}
                                            value={ante.voucher}
                                            renderFn={renderVoucher}
                                            width={71}
                                            height={95}
                                        />
                                    </Center>
                                </PurchaseItemWrapper>

                                <Text fz={'xs'} ta={'center'} c={'dimmed'}>{ante.voucher}</Text>
                            </Flex>
                            <Flex direction={'column'} align={'center'} justify={'flex-start'}>
                                <Title order={4} mb={'.25rem'}> Tags </Title>
                                <Stack justify={'center'}>
                                    {ante.tags.map((tag, index) => (
                                        <Tooltip key={index} label={String(tag)}>
                                            <Box w={'fit-content'}>
                                                <RenderWithCanvas
                                                    renderFn={renderTag}
                                                    value={tag}
                                                    width={34}
                                                    height={34}
                                                />
                                            </Box>
                                        </Tooltip>
                                    ))}
                                </Stack>
                            </Flex>
                            <Group align={'flex-start'} gap={'4rem'}>
                                <Tooltip label={String(ante.boss)}>
                                    <Flex direction={'column'} align={'center'} justify={'flex-start'}>
                                        <Title order={4} ta={'center'} mb={'.25rem'}> Boss </Title>
                                        <RenderWithCanvas
                                            name={'Boss'}
                                            value={ante.boss}
                                            renderFn={renderBoss}
                                            width={34}
                                            height={34}
                                        />
                                    </Flex>
                                </Tooltip>

                            </Group>
                        </Group>
                    </Grid.Col>


                </Grid>
            </Paper>
        </Tabs.Panel>
    )
}

export function SeedDisplay() {
    const {width} = useViewportSize()
    const tab = useBlueprintStore(state => state.selectedAnte);
    const setTab = useBlueprintStore(state => state.setSelectedAnte);
    const results = useBlueprintStore(state => state.results);
    const seedDetails = useMemo(() => {
        if (!results) return null;
        return extractShopQueues(results)
    }, [results])
    if (!seedDetails) return null
    return (
        <>
            <SearchSeedInput
                hiddenFrom={'sm'}
                mb={'sm'}
            />
            <NativeSelect
                onChange={e => setTab(e.currentTarget.value)}
                data={seedDetails.map(({title}) => title.replaceAll('=', ''))}
                value={tab}
                mb={'sm'}
                hiddenFrom="sm"
            />

            <Tabs
                w={'100%'}
                variant="pills"
                orientation={"vertical"}
                defaultValue={'ANTE 1'}
                value={String(tab)}
                onChange={(e) => setTab(e)}
                keepMounted={false}
            >
                <Box mah={'65vh'} style={{display: width > 767 ? 'revert' : 'none'}} mr={'2rem'}>
                    <ScrollArea type="scroll" scrollbars={'y'} h={'100%'}>
                        <Tabs.List >
                            {
                                seedDetails.map((seed) => {
                                    let title = seed.title.replaceAll('=', '')
                                    return (
                                        <Tabs.Tab value={title} key={title}>
                                            {title}
                                        </Tabs.Tab>
                                    )
                                })
                            }
                        </Tabs.List>
                    </ScrollArea>
                </Box>

                {
                    seedDetails.map((ante, i) => <AntePanel ante={ante} key={i}/>)
                }

            </Tabs>
        </>

    )
}