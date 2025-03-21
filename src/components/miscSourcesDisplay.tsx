import {MiscCardSource} from "../modules/ImmolateWrapper";
import {Accordion, Box, Group, Paper, Text, Title} from "@mantine/core";
import {useCardStore} from "../modules/state/store.ts";
import {useEffect, useState} from "react";
import {Carousel, Embla} from "@mantine/carousel";
import {LOCATIONS} from "../modules/const.ts";
import {toHeaderCase} from "js-convert-case";
import {BuyWrapper} from "./buyerWrapper.tsx";
import {GameCard} from "./Rendering/cards.tsx";

export default function MiscCardSourcesDisplay({miscSources}: { miscSources?: MiscCardSource[] }) {
    if (!miscSources || Object.keys(miscSources).length === 0) {
        return (
            <Paper p="md" withBorder mb="md">
                <Text c="dimmed" size="sm" ta="center">No miscellaneous card sources available for this ante</Text>
            </Paper>
        );
    }
    const selectedResult = useCardStore(state => state.searchState.selectedSearchResult);
    const currentSource = useCardStore(state => state.applicationState.miscSource);
    const setCurrentSource = useCardStore(state => state.setMiscSource);
    const currentAnte = useCardStore(state => state.applicationState.selectedAnte);
    const [embla, setEmbla] = useState<Embla | null>(null);
    useEffect(() => {
        if (!embla) return;
        embla.reInit()
    }, [embla])
    useEffect(() => {
        if (!selectedResult || !embla) return;
        if (selectedResult?.locationType === LOCATIONS.MISC) {
            if (selectedResult?.index) {
                embla.scrollTo(selectedResult.index)
            }
        }
    }, [currentSource, selectedResult, currentSource])
    return (
        <Paper p="md" withBorder mb="md">
            <Title order={3} mb="xs">Card Sources</Title>
            <Accordion onChange={e => setCurrentSource(`${e}`)} variant={'separated'} value={currentSource}>
                {miscSources.map(({name, cards}: { name: string, cards: any }) => (
                    <Accordion.Item key={String(name)} value={String(name)}>
                        <Accordion.Control>
                            <Group>
                                <Text fw={500}>{toHeaderCase(String(name))}</Text>
                            </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                            {
                                name === currentSource &&
                                <Box>
                                    <Carousel
                                        getEmblaApi={setEmbla}
                                        type={'container'}
                                        slideSize="90px"
                                        slideGap={{base: 'xs'}}
                                        align="start"
                                        withControls={false}
                                        height={190}
                                        dragFree
                                    >
                                        {cards?.map((card: any, i: number) => (
                                            <Carousel.Slide key={i}>
                                                <BuyWrapper
                                                    metaData={{
                                                        transactionType: "buy",
                                                        location: name,
                                                        locationType: LOCATIONS.MISC,
                                                        index: i,
                                                        ante: String(currentAnte),
                                                        blind: "smallBlind",
                                                        name: card?.name,
                                                        link: `https://balatrogame.fandom.com/wiki/${card.name}`,
                                                        card: card
                                                    }}
                                                >
                                                    <GameCard card={card}/>
                                                </BuyWrapper>

                                            </Carousel.Slide>
                                        ))}
                                    </Carousel>
                                </Box>
                            }

                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Paper>
    );
}
