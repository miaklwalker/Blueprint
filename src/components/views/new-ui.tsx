import {useEffect, useRef, useState} from "react";
import {useElementSize, useHover, useMergedRef, useMouse, useResizeObserver} from "@mantine/hooks";
import {
    ActionIcon,
    AspectRatio,
    Badge,
    Box, Button,
    Card,
    Center,
    Collapse, Container, Divider, Fieldset,
    Flex, Grid,
    Group, List,
    SimpleGrid, Spoiler,
    Text, Title
} from "@mantine/core";
import {editionMap, jokerFaces, jokers, stickerMap, tarotsAndPlanets, vouchers} from "../../modules/const";
import {IconExternalLink, IconShoppingCartCheck} from "@tabler/icons-react";
import {
    Ante,
    Joker_Final,
    Planet_Final, Seed,
    Spectral_Final,
    StandardCard_Final, Tarot_Final
} from "../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {getModifierColor, getSealPosition, getStandardCardPosition} from "../../modules/utils";
import {Carousel} from "@mantine/carousel";





function Voucher({voucherName, paperProps}: { voucherName: string, paperProps?: any }) {
    let layers = [];
    const {ref: sizeRef, width} = useElementSize()
    const {hovered, ref: hoverRef} = useHover();
    const mergedRef = useMergedRef(
        sizeRef,
        hoverRef
    );
    const voucherData = vouchers.find((voucher: any) => voucher.name === voucherName);
    if (voucherData) layers.push(new Layer({
        ...voucherData,
        source: 'images/Vouchers.png',
        order: 0,
        columns: 9,
        rows: 4
    }));

    return (
        <Card ref={mergedRef} {...paperProps} >
            <Card.Section withBorder>
                <Flex direction={'column'} p={'xs'}>
                    <SimpleGrid cols={{base: 1, sm: width > 200 ? 2 : 1}} spacing={'xs'}>
                        <Box>
                            <Text fz={'sm'}>{voucherName}</Text>
                        </Box>
                    </SimpleGrid>
                </Flex>
            </Card.Section>
            <Card.Section withBorder>
                <Center>
                    <RenderImagesWithCanvas
                        layers={layers}
                        spacing
                    />
                </Center>
            </Card.Section>
            <Card.Section withBorder={hovered}>
                <Flex direction={'row'} p={'xs'} justify={'space-evenly'} align={'center'} gap={'xs'}>
                    <ActionIcon>
                        <IconShoppingCartCheck/>
                    </ActionIcon>
                    <ActionIcon>
                        <IconExternalLink/>
                    </ActionIcon>
                </Flex>
            </Card.Section>
        </Card>
    )
}

function Joker({card, paperProps}: { card: any | Joker_Final, paperProps?: any }) {
    let layers = [];
    const {ref: sizeRef, width} = useElementSize()
    const {hovered, ref: hoverRef} = useHover();
    const mergedRef = useMergedRef(
        sizeRef,
        hoverRef
    );
    const jokerData = jokers.find((joker: any) => joker.name === card.name);
    if (jokerData) layers.push(new Layer({...jokerData, source: 'images/Jokers.png', order: 0, columns: 10, rows: 16}));
    const face = jokerFaces.find((joker: any) => joker.name === card.name);
    if (face) layers.push(new Layer({...face, source: 'images/Jokers.png', order: 1, columns: 10, rows: 16}));
    if (card.edition) {
        const index = editionMap[card.edition];
        layers.push(new Layer({
            pos: {x: index, y: 0},
            name: card.edition,
            order: 2,
            source: 'images/Editions.png',
            rows: 1,
            columns: 5
        }));
    }
    if (card.isEternal) {
        layers.push(new Layer({
            pos: stickerMap['Eternal'],
            name: 'Eternal',
            order: 3,
            source: 'images/stickers.png',
            rows: 3,
            columns: 5
        }));
    }
    if (card.isPerishable) {
        layers.push(new Layer({
            pos: stickerMap['Perishable'],
            name: 'Perishable',
            order: 4,
            source: 'images/stickers.png',
            rows: 3,
            columns: 5
        }));
    }
    if (card.isRental) {
        layers.push(new Layer({
            pos: stickerMap['Rental'],
            name: 'Rental',
            order: 5,
            source: 'images/stickers.png',
            rows: 3,
            columns: 5
        }));
    }
    return (
        <Card ref={mergedRef} {...paperProps} >
            <Card.Section withBorder>
                <Flex direction={'column'} p={'xs'}>
                    <SimpleGrid cols={{base: 1, sm: width > 200 ? 2 : 1}} spacing={'xs'}>
                        <Box>
                            <Text fz={'sm'}>{card.name}</Text>
                        </Box>
                    </SimpleGrid>
                </Flex>
            </Card.Section>
            <Card.Section withBorder>
                <Center>
                    <RenderImagesWithCanvas
                        spacing={true}
                        invert={card.edition === "Negative"}
                        layers={layers}
                    />
                </Center>
            </Card.Section>
            {
                card.edition &&
                card.edition !== "No Edition" &&
                <Card.Section withBorder>
                    <Collapse in={hovered}>
                        <Flex direction={'column'} p={'xs'}>
                            <Group>
                                <Badge autoContrast color={getModifierColor(card.edition)}>{card.edition}</Badge>
                            </Group>
                        </Flex>
                    </Collapse>
                </Card.Section>
            }
            {
                (card.isEternal || card.isRental || card.isPerishable) &&
                <Card.Section withBorder={hovered}>
                    <Collapse in={hovered}>
                        <Flex direction={'column'} p={'xs'}>
                            <Group>
                                {
                                    card.isEternal &&
                                    <Badge autoContrast color={getModifierColor("Eternal")}>Eternal</Badge>
                                }
                                {
                                    card.isPerishable &&
                                    <Badge autoContrast color={getModifierColor("Perishable")}>Perishable</Badge>
                                }
                                {
                                    card.isRental &&
                                    <Badge autoContrast color={getModifierColor("Rental")}>Rental</Badge>
                                }
                            </Group>
                        </Flex>
                    </Collapse>
                </Card.Section>
            }

            <Card.Section>
                <Flex direction={'row'} p={'xs'} justify={'space-evenly'} align={'center'} gap={'xs'}>
                    <Button>Buy</Button>
                    <ActionIcon>
                        <IconExternalLink/>
                    </ActionIcon>
                </Flex>
            </Card.Section>


        </Card>
    )
}

function PlayingCard({card, paperProps}: { card: StandardCard_Final, paperProps?: any }) {
    const {ref: sizeRef, width} = useElementSize()
    const {hovered, ref: hoverRef} = useHover();
    const mergedRef = useMergedRef(
        sizeRef,
        hoverRef
    );
    const position = getStandardCardPosition(card.rank, card.suit);
    let layers = [
        new Layer({
            pos: {x: 1, y: 0},
            name: 'background',
            order: 0,
            source: 'images/Enhancers.png',
            rows: 5,
            columns: 7
        }),
        new Layer({
            pos: position,
            name: card.name,
            order: 1,
            source: 'images/8BitDeck.png',
            rows: 4,
            columns: 13
        })
    ]
    if (card.edition) {
        const index = editionMap[card.edition];
        layers.push(new Layer({
            pos: {x: index, y: 0},
            name: card.edition,
            order: 2,
            source: 'images/Editions.png',
            rows: 1,
            columns: 5
        }));
    }
    if (card.seal) {
        layers.push(new Layer({
            pos: getSealPosition(card.seal),
            name: card.seal,
            order: 3,
            source: 'images/Enhancers.png',
            rows: 5,
            columns: 7
        }));
    }


    return (
        <Card withBorder ref={mergedRef} {...paperProps} >
            <Card.Section style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <Group px={'md'} py={'xs'} justify={'space-between'}>
                    <Text fz={'sm'}>{card.rank} of {card.suit}</Text>
                    {width > 200 && <Badge>Card</Badge>}
                </Group>

            </Card.Section>
            <Card.Section withBorder>
                <Center>
                    <RenderImagesWithCanvas
                        spacing={true}
                        layers={layers}
                    />
                </Center>
            </Card.Section>
            {
                card.enhancements &&
                card.enhancements !== "No Enhancement" &&
                <Card.Section withBorder={hovered}>
                    <Collapse in={hovered}>
                        <Group grow p={'xs'}>
                            <Box>
                                <Text fz={'xs'} c={'dimmed'}>Enhancement</Text>
                                <Text fz={'sm'}>{card.enhancements}</Text>
                            </Box>
                        </Group>
                    </Collapse>
                </Card.Section>
            }
            {
                card.edition &&
                card.edition !== "No Edition" &&
                <Card.Section withBorder={hovered}>
                    <Collapse in={hovered}>
                        <Group grow p={'md'}>
                            <Box>
                                <Text fz={'xs'} c={'dimmed'}>Edition</Text>
                                <Text fz={'sm'}>{card.edition}</Text>
                            </Box>
                        </Group>
                    </Collapse>
                </Card.Section>
            }
            {
                card.seal &&
                card.seal !== "No Seal" &&
                <Card.Section withBorder={hovered}>
                    <Collapse in={hovered}>
                        <Group grow p={'xs'}>
                            <Box>
                                <Text fz={'xs'} c={'dimmed'}>Seal</Text>
                                <Text fz={'sm'}>{card.seal}</Text>
                            </Box>
                        </Group>
                    </Collapse>
                </Card.Section>
            }
            <Card.Section>
                <Flex direction={'row'} p={'xs'} justify={'space-evenly'} align={'center'} gap={'xs'}>
                    <Button>Buy</Button>
                    <ActionIcon>
                        <IconExternalLink/>
                    </ActionIcon>
                </Flex>
            </Card.Section>

        </Card>
    )
}

function Consumables({card, paperProps}: { card: Planet_Final | Spectral_Final | Tarot_Final, paperProps?: any }) {

    let layers = [
        new Layer({
            ...tarotsAndPlanets.find((t: any) => t.name === card.name),
            order: 0,
            source: 'images/Tarots.png',
            rows: 6,
            columns: 10
        })
    ]
    return (
        <Card {...paperProps}>
            <Card.Section withBorder>
                <Flex direction={'column'} p={'xs'}>
                    <SimpleGrid cols={1} spacing={'xs'}>
                        <Box>
                            <Text truncate={'end'} fz={'sm'}>{card.name}</Text>
                        </Box>
                    </SimpleGrid>
                </Flex>
            </Card.Section>
            <Card.Section withBorder>
                <Center>
                    <RenderImagesWithCanvas
                        spacing={true}
                        invert={card?.edition === "Negative"}
                        layers={layers}
                    />
                </Center>
            </Card.Section>
            <Card.Section>
                <Flex direction={'row'} p={'xs'} justify={'space-evenly'} align={'center'} gap={'xs'}>
                    <Button>Buy</Button>
                    <ActionIcon>
                        <IconExternalLink/>
                    </ActionIcon>
                </Flex>
            </Card.Section>
        </Card>
    )
}

function GameCard({card, paperProps}: { card: any, paperProps?: any }) {
    if (card instanceof StandardCard_Final) {
        return <PlayingCard card={card} paperProps={paperProps}/>
    }
    if (card instanceof Joker_Final) {
        return <Joker card={card} paperProps={paperProps}/>
    }
    if (card instanceof Planet_Final || card instanceof Tarot_Final || card instanceof Spectral_Final) {
        return <Consumables card={card} paperProps={paperProps}/>
    }
}

function Queue({queue}: { queue: any[] }) {
    return (
        <Carousel
            containScroll={"trimSnaps"}
            slideGap={{base: 'sm'}}
            slideSize={{base: 120}}
            withControls={false}
            dragFree
        >
            {
                queue.map((card: any, index: number) => {
                    return (
                        <Carousel.Slide key={index}>
                            {
                                <GameCard
                                    card={card}
                                    paperProps={cardProps}
                                />
                            }
                        </Carousel.Slide>
                    )
                })
            }
        </Carousel>
    )
}

const cardProps = {
    maw: '140px',
    withBorder: true,
    shadow: "xl",
}

function SimpleView({seedResult}: { seedResult: Seed }) {

    return (
        <Container fluid id={'simple-view'}>
            {
                seedResult &&
                Object.keys(seedResult.antes).length > 0 &&
                Object.entries(seedResult.antes).map(([key, ante]: [string, Ante], index) => {
                    return (
                        <Box id={`ANTE-${ante}`} data-order={0} key={index}>
                            <Title mb={'sm'}>Ante {key}</Title>
                            <Grid>
                                <Grid.Col span={4}>
                                    <Fieldset legend={'Boss'}>
                                        <Text>{ante.boss}</Text>
                                    </Fieldset>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Fieldset legend={'Tags'}>
                                        <Text>{ante.tags.join(', ')}</Text>
                                    </Fieldset>
                                </Grid.Col>
                                <Grid.Col span={4}>
                                    <Fieldset legend={'Voucher'}>
                                        <Text>{ante.voucher}</Text>
                                    </Fieldset>
                                </Grid.Col>

                                <Grid.Col span={6}>
                                    <Fieldset legend={'Shop Queue'}>
                                        <Spoiler maxHeight={700} showLabel="Show more" hideLabel="Hide">
                                            <List type="ordered">
                                                {
                                                    ante.queue.map((card, index) => {
                                                        return (
                                                            <List.Item key={index}>
                                                                {card.edition === 'No Edition' ? '' : card.edition} {card.name}
                                                            </List.Item>
                                                        )
                                                    })
                                                }
                                            </List>
                                        </Spoiler>
                                    </Fieldset>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Fieldset legend={'Packs'}>
                                        <List>
                                            {
                                                ante.blinds &&
                                                Object.keys(ante.blinds).length > 0 &&
                                                Object.entries(ante.blinds).map(([key, {packs}]) => {
                                                    return (
                                                        <List.Item key={key}>
                                                            <Text>
                                                                Blind: {key.split('Blind')[0].toUpperCase()}
                                                            </Text>
                                                            {/*<Fieldset legend = {`Blind: ${key.split('Blind')[0].toUpperCase()}`}>*/}
                                                            <List>
                                                                {packs.length === 0 && <List.Item><Text>No Packs</Text></List.Item>}
                                                                {
                                                                    packs.map((pack: any, index: number) => {
                                                                        return (
                                                                            <List.Item key={index}>
                                                                                {/*<Fieldset legend={`${pack.name} (${pack.size} cards, pick ${pack.choices})`}>*/}
                                                                                <Text>
                                                                                    {pack.name} - {pack.size} cards, pick {pack.choices}
                                                                                </Text>
                                                                                <List>
                                                                                    {
                                                                                        pack.cards.map((card: any, index: number) => {
                                                                                            return (
                                                                                                <List.Item key={index}>
                                                                                                    {card.name}
                                                                                                </List.Item>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </List>
                                                                                {/*</Fieldset>*/}


                                                                            </List.Item>
                                                                        )
                                                                    })
                                                                }
                                                            </List>
                                                            {/*</Fieldset>*/}



                                                        </List.Item>
                                                    )
                                                })
                                            }
                                        </List>
                                    </Fieldset>
                                </Grid.Col>

                                <Grid.Col span={12}>

                                </Grid.Col>
                            </Grid>

                            <SimpleGrid cols={3}>





                            </SimpleGrid>




                            <Divider my={'sm'}/>
                        </Box>
                    )
                })
            }
        </Container>
    )

}
