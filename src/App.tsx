import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {
    ActionIcon,
    AspectRatio,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Collapse,
    Container,
    Flex,
    Group,
    MantineProvider,
    SimpleGrid,
    Text
} from "@mantine/core";
import {theme} from "./theme.js";
import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {ImmolateClassic} from "./modules/ImmolateWrapper/CardEngines/immolateClassic.ts";
import {CardEngineWrapper} from "./modules/ImmolateWrapper";
//@ts-ignore
import {editionMap, jokerFaces, jokers, stickerMap, tarotsAndPlanets, vouchers} from "./modules/const.js"
//@ts-ignore
import {getModifierColor, getSealPosition, getStandardCardPosition} from "./modules/utils.js";
import {useEffect, useRef, useState} from "react";
import {
    Card_Final,
    Joker_Final,
    Planet_Final,
    Spectral_Final,
    StandardCard_Final, Tarot_Final
} from "./modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useElementSize, useHover, useMergedRef, useMouse, useResizeObserver} from "@mantine/hooks";
import {IconExternalLink, IconShoppingCartCheck} from "@tabler/icons-react";
import {Carousel} from "@mantine/carousel";


const globalImageCache = new Map<string, HTMLImageElement>();
const initialState = {
    seed: '15IBIXCA',
    deck: 'Ghost Deck',
    cardsPerAnte: 50,
    antes: 8,
    deckType: 'Ghost Deck',
    stake: 'Gold Stake',
    showmanOwned: false,
    gameVersion: '10106',
}

interface CardStoreState {
    seed: string;
    deck: string;
    cardsPerAnte: number;
    antes: number;
    deckType: string;
    stake: string;
    showmanOwned: boolean;
    gameVersion: string;
}

const useCardStore = create<CardStoreState>()(
    devtools(
        (set) => ({
            ...initialState,
            reset: () => {
                set(initialState, undefined, 'Global/Reset');
            },
        })
    )
)

function useSeedAnalyzer(): { analyzer: CardEngineWrapper, engine: ImmolateClassic } {
    const seed = useCardStore((state) => state.seed);
    const deck = useCardStore((state) => state.deck);
    const stake: string = useCardStore((state) => state.stake);
    const showmanOwned = useCardStore((state) => state.showmanOwned);
    const version = useCardStore((state) => state.gameVersion);

    const engine = new ImmolateClassic(seed);
    engine.InstParams(deck, stake, showmanOwned, version);
    engine.initLocks(1, false, true);
    const analyzer: CardEngineWrapper = new CardEngineWrapper(engine);
    return {
        analyzer,
        engine
    }
}

class Layer {
    pos: { x: number, y: number };
    name: string;
    order: number;
    source: string;
    rows: number;
    columns: number;

    constructor({pos, name, order, source, rows, columns}: {
        pos: { x: number, y: number },
        name: string,
        order: number,
        source: string
        rows: number,
        columns: number
    }) {
        this.pos = pos;
        this.name = name;
        this.order = order;
        this.source = source;
        this.rows = rows;
        this.columns = columns;
    }
}


function renderImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, image: HTMLImageElement, layer: Layer) {
    if (!image) return 0;
    const cardWidth = (image.width / layer.columns);
    const cardHeight = (image.height / layer.rows);
    context.drawImage(
        image,
        layer.pos.x * cardWidth,
        layer.pos.y * cardHeight,
        cardWidth,
        cardHeight,
        0,
        0,
        canvas.width,
        canvas.height
    );
    return cardWidth / cardHeight;
}

interface RenderCanvasProps {
    layers: any[],
    invert?: boolean,
    spacing?: boolean
}

function RenderImagesWithCanvas({layers, invert = false, spacing = false}: RenderCanvasProps) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [ratio, setRatio] = useState(3 / 4);
    const [transform, setTransform] = useState('');

    useEffect(() => {
        if (!canvasRef.current) return;
        if (!layers) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        layers
            .sort((a, b) => a.order - b.order)
            .forEach((layer => {
                if (globalImageCache.has(layer.source)) {
                    let image = globalImageCache.get(layer.source) as HTMLImageElement;
                    renderImage(canvas, context, image, layer);
                    return;
                }
                const img = new Image();
                img.src = layer.source;
                img.onload = () => {
                    const imageRatio = renderImage(canvas, context, img, layer);
                    globalImageCache.set(layer.source, img);
                    if (layer.order === 0) {
                        setRatio(imageRatio);
                    }
                }
            }))
        if (invert) {
            canvas.style.filter = 'invert(0.8)';
        }
    }, [layers]);

    const { hovered, ref: hoverRef } = useHover();
    const { ref: mouseRef, x:mouseX, y:mouseY } = useMouse();
    const [rectRef, rect] = useResizeObserver();
    const mergedRef = useMergedRef(mouseRef, hoverRef, containerRef, rectRef);


    // Handle card tilt effect
    useEffect(() => {
        const SCALE_X = 6;
        const SCALE_Y = 8;
        const x = mouseX - rect.x;
        const y = mouseY - rect.y;
        let mousePosition = {
            x,
            y
        }
        let cardSize = {
            width: rect.width,
            height: rect.height
        }
        setTransform(
            `perspective(1000px) rotateX(${
                (mousePosition.y / cardSize.height) * -(SCALE_Y * 2) + SCALE_Y
            }deg) rotateY(${
                (mousePosition.x / cardSize.width) * (SCALE_X * 2) - SCALE_X
            }deg) translateZ(10px)`
        )

    }, [mouseX, mouseY, hovered]);

    return (
        <AspectRatio
            ratio={ratio}
            w={spacing ? '80%' : "100%"}
            py={spacing ? 'xs' : 0}
            ref={mergedRef}
            style={{
                transition: hovered ? 'none' : 'transform 0.4s ease-out',
                transform: transform,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center'
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    boxShadow: hovered
                        ? `0 2px 12px rgba(0,0,0,0.3)`
                        : '0 2px 8px rgba(0,0,0,0.2)',
                    borderRadius: '6px',
                    transition: hovered ? 'none' : 'box-shadow 0.4s ease-out'
                }}
            />
        </AspectRatio>
    )
}

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

function Consumables({card, paperProps}: { card: Planet_Final | Spectral_Final | Tarot_Final , paperProps?: any }) {

    let layers = [
        new Layer({
            ...tarotsAndPlanets.find((t:any) => t.name === card.name),
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

function GameCard ({card, paperProps} : { card: any, paperProps?: any}) {
    if( card instanceof StandardCard_Final) {
        return <PlayingCard card={card} paperProps={paperProps}/>
    }
    if( card instanceof Joker_Final) {
        return <Joker card={card} paperProps={paperProps}/>
    }
    if( card instanceof Planet_Final || card instanceof Tarot_Final || card instanceof Spectral_Final) {
        return <Consumables card={card} paperProps={paperProps}/>
    }
}



export default function App() {
    const {analyzer} = useSeedAnalyzer();
    const cardsPerAnte = useCardStore((state) => state.cardsPerAnte);
    const antes = useCardStore((state) => state.antes);
    const seedResults = analyzer.analyzeSeed(antes, cardsPerAnte);
    const currentAnte = 4;
    const joker = seedResults.antes[currentAnte].queue[30];
    const planet = seedResults.antes[currentAnte].queue[0];
    const spectral = seedResults.antes[currentAnte].queue[10];
    const tarot = seedResults.antes[currentAnte].queue[33];
    const pack = seedResults.antes[currentAnte].blinds.bossBlind.packs[0];
    const packCard = pack.cards[2];
    const cardProps = {
        maw: '140px',
        withBorder: true,
        shadow: "xl",
    }
    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Container>
                <Group>
                    <Voucher
                        voucherName={seedResults.antes[currentAnte].voucher || ""}
                        paperProps={{
                            maw: '120px',
                            m: 'sm',
                            withBorder: true,
                            shadow: "xl",
                        }}
                    />
                </Group>
                <Carousel
                    containScroll={"trimSnaps"}
                    slideGap={{base: 'sm'}}
                    slideSize={{ base: 120 }}
                    withControls={false}
                    dragFree
                >
                    {
                        seedResults.antes[currentAnte].queue.map((card: any, index: number) => {
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
                    {
                        pack.cards.map((card: any, index: number) => {
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
                    <Carousel.Slide>
                        {
                            <GameCard
                                card={packCard}
                                paperProps={cardProps}
                            />
                        }
                    </Carousel.Slide>
                    <Carousel.Slide>
                        {
                            <GameCard
                                card={joker}
                                paperProps={cardProps}
                            />
                        }
                    </Carousel.Slide>
                    <Carousel.Slide>
                        {
                            <GameCard
                                card={new Joker_Final({
                                    name: "Perkeo",
                                    type: "Joker",
                                    edition: "No Edition",
                                    isEternal: false,
                                    isPerishable: false,
                                    isRental: false,

                                } as Card_Final)}
                                paperProps={cardProps}
                            />
                        }
                    </Carousel.Slide>
                    <Carousel.Slide>
                        {
                            <GameCard
                                card={new Joker_Final({
                                    name: "Perkeo",
                                    type: "Joker",
                                    edition: "Negative",
                                    isEternal: false,
                                    isPerishable: false,
                                    isRental: false,

                                } as Card_Final)}
                                paperProps={cardProps}
                            />
                        }
                    </Carousel.Slide>
                    <Carousel.Slide>
                        {
                            <GameCard
                                card={planet}
                                paperProps={cardProps}
                            />
                        }
                    </Carousel.Slide>
                    <Carousel.Slide>
                        {
                            <GameCard
                                card={spectral}
                                paperProps={cardProps}
                            />
                        }
                    </Carousel.Slide>
                    <Carousel.Slide>
                        {
                            <GameCard
                                card={tarot}
                                paperProps={cardProps}
                            />
                        }
                    </Carousel.Slide>

                </Carousel>


            </Container>
        </MantineProvider>
    );
}