import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {
    Accordion,
    ActionIcon,
    AppShell,
    AspectRatio,
    Autocomplete,
    Badge,
    Box,
    Burger,
    Button,
    Card,
    Center,
    Container,
    Fieldset,
    Flex,
    Grid,
    Group,
    Indicator,
    MantineProvider,
    Modal,
    NativeSelect,
    NumberInput,
    Overlay,
    Paper,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
    Slider,
    Space,
    Stack,
    Switch,
    Tabs,
    Text,
    TextInput,
    Timeline,
    Title,
    Tooltip,
    Transition,
    useMantineTheme
} from "@mantine/core";
import {theme} from "./theme.js";
import {create} from "zustand";
import {immer} from 'zustand/middleware/immer'
import {combine, devtools, persist} from "zustand/middleware";
import {ImmolateClassic} from "./modules/ImmolateWrapper/CardEngines/immolateClassic.ts";
import {CardEngineWrapper, MiscCardSource} from "./modules/ImmolateWrapper";

import {
    blinds,
    bosses,
    consumablesFaces,
    editionMap,
    jokerFaces,
    jokers,
    options,
    SeedsWithLegendary,
    stickerMap,
    tags,
    tarotsAndPlanets,
    vouchers
    //@ts-ignore
} from "./modules/const.js"
import {toHeaderCase} from 'js-convert-case';
import {getSealPosition, getStandardCardPosition} from "./modules/utils.js";
import {ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useHover, useMergedRef, useMouse, useResizeObserver, useViewportSize} from "@mantine/hooks";
import {
    Ante,
    Joker_Final,
    Pack,
    Planet_Final,
    Seed,
    Spectral_Final,
    StandardCard_Final,
    Tarot_Final
} from "./modules/ImmolateWrapper/CardEngines/Cards.ts";
import {
    IconCards,
    IconJoker,
    IconPlayCard,
    IconSearch,
    IconShoppingCart,
    IconShoppingCartOff
} from "@tabler/icons-react";
import {Carousel, Embla} from "@mantine/carousel";
import {openSpotlight, Spotlight} from "@mantine/spotlight";
//@ts-ignore

//TODO MAKE ALL LOCATION BLINDS ANTES into a global ENUM to keep strings consistent
function enumFactory(key, symbol) {
    return {
        [key]: symbol,
        [symbol]: key
    }
}

const SHOP = Symbol('SHOP');
const PACK = Symbol('PACK');
const MISC = Symbol('MISC');

const GLOBAL_ENUM:{
    [key: string] : Symbol
    [key: symbol] : string
} = {
    ...enumFactory('SHOP', SHOP),
    ...enumFactory('PACK', PACK),
    ...enumFactory('MISC', MISC)
}


const globalImageCache = new Map<string, HTMLImageElement>();

interface InitialState {
    immolateState: {
        seed: string;
        deck: string;
        cardsPerAnte: number;
        antes: number;
        deckType: string;
        stake: string;
        showmanOwned: boolean;
        gameVersion: string;
        selectedOptions: string[];
    };
    applicationState: {
        start: boolean;
        settingsOpen: boolean;
        asideOpen: boolean;
        selectOptionsModalOpen: boolean;
        showCardSpoilers: boolean;
        selectedAnte: number;
        selectedBlind: string;
    };
    searchState: {
        searchTerm: string;
        searchResults: any[];
        selectedSearchResult: any | null;
    };
    shoppingState: {
        buys: {
            [key: string]: BuyMetaData
        },
        sells: {
            [key: string]: BuyMetaData
        }
    };
}

const initialState: InitialState = {
    immolateState: {
        seed: '15IBIXCA',
        deck: 'Ghost Deck',
        cardsPerAnte: 50,
        antes: 8,
        deckType: 'Ghost Deck',
        stake: 'Gold Stake',
        showmanOwned: false,
        gameVersion: '10106',
        selectedOptions: Array(61).fill(true),
    },
    applicationState: {
        start: false,
        settingsOpen: false,
        asideOpen: false,
        selectOptionsModalOpen: false,
        showCardSpoilers: false,
        selectedAnte: 1,
        selectedBlind: 'bigBlind',
    },
    searchState: {
        searchTerm: '',
        searchResults: [],
        selectedSearchResult: null
    },
    shoppingState: {
        buys: {},
        sells: {},
    }
}

const globalSettingsSetters = (set: any) => ({
    setSeed: (seed: string) => set((prev: InitialState) => {
        prev.immolateState.seed = seed
    }, undefined, 'Global/SetSeed'),
    setDeck: (deck: string) => set((prev: InitialState) => {
        prev.immolateState.deck = deck
    }, undefined, 'Global/SetDeck'),
    setCardsPerAnte: (cardsPerAnte: number) => set((prev: InitialState) => {
        prev.immolateState.cardsPerAnte = cardsPerAnte
    }, undefined, 'Global/SetCardsPerAnte'),
    setAntes: (antes: number) => set((prev: InitialState) => {
        prev.immolateState.antes = antes
    }, undefined, 'Global/SetAntes'),
    setDeckType: (deckType: string) => set((prev: InitialState) => {
        prev.immolateState.deckType = deckType
    }, undefined, 'Global/SetDeckType'),
    setStake: (stake: string) => set((prev: InitialState) => {
        prev.immolateState.stake = stake
    }, undefined, 'Global/SetStake'),
    setShowmanOwned: (showmanOwned: boolean) => set((prev: InitialState) => {
        prev.immolateState.showmanOwned = showmanOwned
    }, undefined, 'Global/SetShowmanOwned'),
    setGameVersion: (gameVersion: string) => set((prev: InitialState) => {
        prev.immolateState.gameVersion = gameVersion
    }, undefined, 'Global/SetGameVersion'),
    setSelectedOptions: (selectedOptions: string[]) => set((prev: InitialState) => {
        prev.immolateState.selectedOptions = options.map((option: string) => selectedOptions.includes(option));
    }, undefined, 'Global/SetSelectedOptions'),
});
const applicationSetters = (set: any) => ({
    setStart: (start: boolean) => set((prev: InitialState) => {
        prev.applicationState.start = start
    }, undefined, 'Global/SetStart'),
    setShowCardSpoilers: (showCardSpoilers: boolean) => set((prev: InitialState) => {
        prev.applicationState.showCardSpoilers = showCardSpoilers
    }, undefined, 'Global/SetShowCardSpoilers'),
    openSelectOptionModal: () => set((prev: { applicationState: { selectOptionsModalOpen: boolean; }; }) => {
        prev.applicationState.selectOptionsModalOpen = true
    }, undefined, 'Global/OpenSelectOptionModal'),
    closeSelectOptionModal: () => set((prev: { applicationState: { selectOptionsModalOpen: boolean; }; }) => {
        prev.applicationState.selectOptionsModalOpen = false
    }, undefined, 'Global/CloseSelectOptionModal'),

    setSelectedAnte: (selectedAnte: number) => set((prev: {
        applicationState: { selectedAnte: number; selectedBlind: string; };
    }) => {
        prev.applicationState.selectedAnte = selectedAnte
        prev.applicationState.selectedBlind = prev.applicationState.selectedAnte === 1 ? 'bigBlind' : 'smallBlind'
    }, undefined, 'Global/SetSelectedAnte'),

    setSelectedBlind: (selectedBlind: string) => set((prev: { applicationState: { selectedBlind: string; }; }) => {
        prev.applicationState.selectedBlind = selectedBlind
    }, undefined, 'Global/SetSelectedBlind'),

    toggleSettings: () => set((prev: { applicationState: { settingsOpen: boolean; }; }) => {
        prev.applicationState.settingsOpen = !prev.applicationState.settingsOpen
    }, undefined, 'Global/ToggleSettings'),

    toggleOutput: () => set((prev: { applicationState: { asideOpen: boolean; }; }) => {
        prev.applicationState.asideOpen = !prev.applicationState.asideOpen
    }, undefined, 'Global/ToggleOutput'),

    setSearchString: (searchString: string) => set((prev: { searchState: { searchTerm: string } }) => {
        prev.searchState.searchTerm = searchString
    }, undefined, 'Global/Search/SetSearch'),
    setSelectedSearchResult: (result: BuyMetaData) => set((prev: {
        applicationState: { selectedAnte: number, selectedBlind: string },
        searchState: { selectedSearchResult: BuyMetaData | null }
    }) => {
        prev.searchState.selectedSearchResult = result
        prev.applicationState.selectedAnte = Number(result.ante)
        prev.applicationState.selectedBlind = result.blind

    }, undefined, 'Global/Search/SetSelectedSearchResult'),
})

const useCardStore = create(devtools(persist(immer(combine(initialState,
                (set, get) => ({
                    ...globalSettingsSetters(set),
                    ...applicationSetters(set),
                    addBuy: (buy: BuyMetaData) => set(prev => {
                        let key = `${buy.ante}-${buy.location}-${buy.index}`;
                        prev.shoppingState.buys[key] = buy;
                    }, undefined, 'Global/AddBuy'),
                    removeBuy: (buy: BuyMetaData) => set(prev => {
                        let key = `${buy.ante}-${buy.location}-${buy.index}`;
                        delete prev.shoppingState.buys[key];
                    }, undefined, 'Global/RemoveBuy'),
                    isOwned: (key: string) => {
                        return key in get().shoppingState.buys;
                    },


                    reset: () => set(initialState, undefined, 'Global/Reset'),
                })
            )),
            {
                name: 'blueprint-store',
                version: 1,
            }
        )
    )
)

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

interface RenderCanvasProps {
    layers: any[],
    invert?: boolean,
    spacing?: boolean
}

function renderImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, image: HTMLImageElement, layer: Layer) {
    if (!image || !layer || !layer?.pos) return 0;
    const cardWidth = (image.width / layer.columns);
    const cardHeight = (image.height / layer.rows);
    if (layer.order === 0) {
        canvas.width = cardWidth;
        canvas.height = cardHeight;
        canvas.style.width = `${cardWidth}px`;
        canvas.style.height = `${cardHeight}px`;
    }
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

    const {hovered, ref: hoverRef} = useHover();
    const {ref: mouseRef, x: mouseX, y: mouseY} = useMouse();
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
                transition: hovered ? 'none' : 'transform 0.4s ease',
                transform: hovered ? transform : 'none',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                display: 'flex'
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

function Voucher({voucherName}: { voucherName: string | null }) {

    let layers = [];
    const voucherData = vouchers.find((voucher: any) => voucher.name === voucherName);
    if (voucherData) layers.push(new Layer({
        ...voucherData,
        source: 'images/Vouchers.png',
        order: 0,
        columns: 9,
        rows: 4
    }));
    return (
        <Box maw={'80px'}>
            <RenderImagesWithCanvas
                layers={layers}
                spacing
            />
        </Box>

    )
}

function JokerCard({card}: { card: Joker_Final }) {
    let layers = [];
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
        <RenderImagesWithCanvas
            invert={card.edition === "Negative"}
            layers={layers}
        />
    )
}

function PlayingCard({card}: { card: StandardCard_Final }) {
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
        <RenderImagesWithCanvas
            layers={layers}
        />
    )
}

function Consumables({card}: { card: Planet_Final | Spectral_Final | Tarot_Final }) {
    let layers = [
        new Layer({
            ...tarotsAndPlanets.find((t: any) => t.name === card.name),
            order: 0,
            source: 'images/Tarots.png',
            rows: 6,
            columns: 10
        })
    ]
    let consumablesFace = consumablesFaces.find((t: any) => t.name === card.name);
    if (consumablesFace) {
        layers.push(new Layer({
            ...consumablesFace,
            order: 1,
            source: 'images/Enhancers.png',
            rows: 5,
            columns: 7
        }))

    }
    return (
        <RenderImagesWithCanvas
            invert={card?.edition === "Negative"}
            layers={layers}
        />
    )
}

function GameCard({card}: { card: any }) {
    let Card = () => {
        if (card instanceof StandardCard_Final) {
            return <PlayingCard card={card}/>
        }
        if (card instanceof Joker_Final) {
            return <JokerCard card={card}/>
        }
        if (card instanceof Planet_Final || card instanceof Tarot_Final || card instanceof Spectral_Final) {
            return <Consumables card={card}/>
        }
    }
    return (
        <Paper maw={'71px'}>
            <Card/>
        </Paper>
    )
}

function Tag({tagName}: { tagName: string }) {
    const tagData = tags.find((tag: { name: string }) => tag.name === tagName);
    if (!tagData) {
        console.error("Tag not found:", tagName);
        return;
    }
    const layers = [
        new Layer({
            ...tagData,
            order: 0,
            source: 'images/tags.png',
            rows: 5,
            columns: 6
        })
    ];
    return (
        <Box h={32} w={32}>
            <RenderImagesWithCanvas
                layers={layers}
            />
        </Box>

    )

}

function Boss({bossName}: { bossName: string }) {
    const bossData = bosses.find((boss: { name: string }) => boss.name === bossName);
    if (!bossData) {
        console.error("Boss not found:", bossName);
        return;
    }

    const layers = [
        new Layer({
            ...bossData,
            order: 0,
            source: 'images/BlindChips.png',
            rows: 31,
            columns: 21
        })
    ];

    return (
        <Box h={32} w={32}>
            <RenderImagesWithCanvas
                layers={layers}
            />
        </Box>
    )

}

interface BuyWrapperProps {
    children: ReactNode,
    bottomOffset?: number,
    topOffset?: number,
    metaData?: BuyMetaData
}

function BuyWrapper({children, bottomOffset, topOffset, metaData}: BuyWrapperProps) {
    const selectedSearchResult = useCardStore(state => state.searchState.selectedSearchResult);
    let sameLocation = selectedSearchResult?.location === metaData?.location;
    let sameAnte = selectedSearchResult?.ante === metaData?.ante;
    let sameIndex = selectedSearchResult?.index === metaData?.index;
    let isSelected = sameAnte && sameIndex && sameLocation;

    const {hovered, ref} = useHover();
    const addBuy = useCardStore(state => state.addBuy);
    const removeBuy = useCardStore(state => state.removeBuy);
    const owned = useCardStore(state => state.isOwned);
    let key = `${metaData?.ante}-${metaData?.location}-${metaData?.index}`;
    const cardIsOwned = owned(key);
    const hasUserAttention = hovered;


    return (
        <Center pos={'relative'} ref={ref} h={'100%'} style={{overflow: 'visible'}}>
            <Indicator disabled={!cardIsOwned} inline label="Owned" size={16} position={'top-center'}>
                <Card style={{
                    boxShadow: isSelected ? '0 0 12px 12px rgba(255,255,255,0.3)' : 'none',
                    transform: hasUserAttention ? 'scale(1.15)' : 'none',
                    transition: 'transform 0.4s ease',
                    zIndex: hasUserAttention ? 20 : 0
                }}>
                    <Card.Section>
                        {cardIsOwned && <Overlay color="#000" backgroundOpacity={0.55} blur={1}/>}
                        {children}
                    </Card.Section>
                </Card>
            </Indicator>
            <Transition
                mounted={hasUserAttention}
                transition="slide-up"
                duration={200}
                enterDelay={350}
                exitDelay={150}
                timingFunction="ease"
            >
                {(styles) => (
                    <Button
                        pos={'absolute'}
                        style={styles}
                        bottom={topOffset ? `calc(80% + ${topOffset}px)` : '80%'}
                        color={'blue'}
                    >
                        wiki
                    </Button>
                )}
            </Transition>
            <Transition
                mounted={hasUserAttention}
                transition="slide-down"
                duration={200}
                enterDelay={350}
                exitDelay={150}
                timingFunction="ease"
            >
                {
                    (styles) => (
                        <Button
                            pos={'absolute'}
                            style={{...styles, zIndex: 1}}
                            top={bottomOffset ? `calc(80% + ${bottomOffset}px)` : '80%'}
                            color={'red'}
                            onClick={() => {
                                if (!metaData) return;
                                if (cardIsOwned) {
                                    removeBuy(metaData);
                                } else {
                                    addBuy(metaData);
                                }
                            }}
                        >
                            {cardIsOwned ? "undo" : "Buy"}
                        </Button>
                    )
                }
            </Transition>
        </Center>
    )
}

function SeedInputAutoComplete({seed, setSeed}: { seed: string, setSeed: (seed: string) => void }) {
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

function SearchSeedInput({SeedResults}: { SeedResults: Seed | null }) {
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
                        location: GLOBAL_ENUM[SHOP],
                        locationType: GLOBAL_ENUM[SHOP],
                        ante: String(ante.ante),
                        name: cardString,
                        index: index,
                        blind: 'smallBlind'
                    })
                }
            })
            console.log(ante.blinds['smallBlind'].packs)
            Object.keys(ante.blinds).forEach((blind) => {
                ante.blinds[blind]?.packs?.forEach((pack) => {
                    pack.cards.forEach((card: any, index: number) => {
                        const cardString = `${card?.edition ?? ''} ${card.name}`.trim();
                        if (cardString.toLowerCase().includes(searchString.toLowerCase())) {
                            cards.push({
                                location: pack.name,
                                locationType: GLOBAL_ENUM[PACK],
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
                source.cards.forEach((card:any, index) => {
                    const cardString = `${card?.edition ?? ''} ${card.name}`.trim();
                    if (cardString.toLowerCase().includes(searchString.toLowerCase())) {
                        cards.push({
                            location: source.name,
                            locationType: GLOBAL_ENUM[MISC],
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
                actions={
                    searchResults.map((result, index) => {
                            const name = result.name;
                            const edition = result?.['edition'];
                            const label = edition && edition !== 'No Edition' ? `${edition} ${name}` : name;

                            const locationType = result?.locationType;

                            let description = '';
                            if (locationType === GLOBAL_ENUM[SHOP]) {
                                description += `ANTE ${result.ante} SHOP: Card ${result.index + 1}`;
                            }
                            if(locationType === GLOBAL_ENUM[PACK]){
                                description += `ANTE ${result.ante} Blind: ${toHeaderCase(result.blind)} ${result.location}`;
                            }
                            if(locationType === GLOBAL_ENUM[MISC]){
                                description += `ANTE ${result.ante} ${result.location}: Card ${result.index + 1}`;
                            }

                            return {
                                id: String(index),
                                label,
                                description,
                                onClick: () => {
                                    // closeSpotlight()
                                    goToResults(result)
                                }
                            }
                        }
                    )}
                searchProps={{
                    value: searchString,
                    onChange: (e) => {
                        setSearchString(e.currentTarget.value)
                    },
                }}
            />
            <Group align={'flex-end'}>
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

function Header({SeedResults}: { SeedResults: Seed | null }) {
    const {width} = useViewportSize();
    const start = useCardStore(state => state.applicationState.start)
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const toggleSettings = useCardStore(state => state.toggleSettings);

    const outputOpened = useCardStore(state => state.applicationState.asideOpen);
    const toggleOutput = useCardStore(state => state.toggleOutput);
    return (
        <AppShell.Header>
            <Container fluid h={'100%'}>
                <Group h={'100%'} justify={'space-between'}>
                    {width <= 348 && <Burger opened={settingsOpened} onClick={toggleSettings} size="sm"/>}
                    <Center h={'100%'}>
                        <Title> Blueprint </Title>
                    </Center>
                    <Group align={'center'}>
                        {width > 600 && start && <SearchSeedInput SeedResults={SeedResults}/>}
                        {width > 348 &&
                            <Button onClick={() => toggleSettings()} variant={'transparent'}> Settings </Button>}
                        {/*{width > 700 && seedIsOpen && (*/}
                        {/*    <CopyButton value={shareLink}>*/}
                        {/*        {({copied, copy}) => (*/}
                        {/*            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>*/}
                        {/*                {copied ? 'Copied url' : 'Copy url'}*/}
                        {/*            </Button>*/}
                        {/*        )}*/}
                        {/*    </CopyButton>*/}
                        {/*)}*/}
                        <Burger opened={outputOpened} onClick={toggleOutput} size="sm"/>
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>
    )
}

function UnlocksModal() {
    const selectOptionsModalOpen = useCardStore(state => state.applicationState.selectOptionsModalOpen);
    const closeSelectOptionModal = useCardStore(state => state.closeSelectOptionModal);
    const selectedOptions = useCardStore(state => state.immolateState.selectedOptions);
    const setSelectedOptions = useCardStore(state => state.setSelectedOptions);
    if (!selectOptionsModalOpen) return null;
    return (
        <Modal size="auto" title={'Unlocks'} opened={selectOptionsModalOpen} onClose={() => closeSelectOptionModal()}>
            <Container fluid>
                <Switch.Group
                    defaultValue={options}
                    label="Unlocked Items "
                    description="Items that you have unlocked by playing the game"
                    withAsterisk
                    value={options.filter((_: any, i: number) => selectedOptions[i])}
                    onChange={setSelectedOptions}
                >
                    <SimpleGrid cols={6} mb={'lg'} mt={'xs'}>
                        {
                            options.map((option: string, i: number) => (
                                <Switch key={i} value={option} label={option}/>))
                        }
                    </SimpleGrid>
                </Switch.Group>
                <Group justify={'flex-end'}>
                    <Button onClick={() => setSelectedOptions(options)}> Select All </Button>
                    <Button onClick={() => setSelectedOptions([])}> Remove All </Button>
                </Group>
            </Container>
        </Modal>
    )
}

function NavBar() {
    const theme = useMantineTheme();
    const analyzeState = useCardStore(state => state.immolateState);
    const {seed, deck, stake, gameVersion: version, antes, cardsPerAnte} = analyzeState;
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const setSeed = useCardStore(state => state.setSeed);
    const setDeck = useCardStore(state => state.setDeck);
    const setStake = useCardStore(state => state.setStake);
    const setVersion = useCardStore(state => state.setGameVersion);
    const setAntes = useCardStore(state => state.setAntes);
    const setCardsPerAnte = useCardStore(state => state.setCardsPerAnte);
    const setShowCardSpoilers = useCardStore(state => state.setShowCardSpoilers);

    const openSelectOptionModal = useCardStore(state => state.openSelectOptionModal);
    const reset = useCardStore(state => state.reset);
    const handleAnalyzeClick = () => {
    }
    return (
        <AppShell.Navbar p="md">
            <UnlocksModal/>
            <AppShell.Section>Settings</AppShell.Section>
            <AppShell.Section grow my="md" component={ScrollArea} scrollbars={'y'}>
                <SeedInputAutoComplete
                    seed={seed}
                    setSeed={setSeed}
                />
                <NumberInput
                    label={'Max Ante'}
                    defaultValue={8}
                    value={antes}
                    onChange={(val) => setAntes(Number(val))}
                />
                <NativeSelect
                    label={'Choose Deck'}
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
                <NativeSelect
                    label={'Choose Stake'}
                    value={stake}
                    onChange={(e) => setStake(e.currentTarget.value)}
                >
                    <option value="White Stake">White Stake</option>
                    <option value="Red Stake">Red Stake</option>
                    <option value="Green Stake">Green Stake</option>
                    <option value="Black Stake">Black Stake</option>
                    <option value="Blue Stake">Blue Stake</option>
                    <option value="Purple Stake">Purple Stake</option>
                    <option value="Orange Stake">Orange Stake</option>
                    <option value="Gold Stake">Gold Stake</option>
                </NativeSelect>
                <Box mb={'sm'}>
                    <Text size="sm"> Cards Per Ante</Text>
                    <Slider
                        min={0}
                        defaultValue={50}
                        max={100}
                        label={'Cards per hand'}
                        color="blue"
                        marks={[
                            {value: 0, label: '0'},
                            {value: 50, label: '50'},
                            {value: 100, label: '100'},
                        ]}
                        value={cardsPerAnte}
                        onChange={setCardsPerAnte}

                    />
                </Box>
                <NativeSelect
                    label={'Choose Version'}
                    value={version}
                    onChange={(e) => setVersion(e.currentTarget.value)}
                >
                    <option value="10106">1.0.1f</option>
                    <option value="10103">1.0.1c</option>
                    <option value="10014">1.0.0n</option>
                </NativeSelect>
                <Box>
                    <Text mb={0} fz={'xs'}>Show Joker Spoilers</Text>
                    <Tooltip label="Cards that give jokers, are replaced with the joker the card would give."
                             refProp="rootRef">
                        <Switch
                            size={'xl'}
                            checked={showCardSpoilers}
                            thumbIcon={showCardSpoilers ? (<IconJoker color={'black'}/>) : (
                                <IconPlayCard color={'black'}/>)}
                            onChange={e => setShowCardSpoilers(e.currentTarget.checked)}
                        />
                    </Tooltip>
                </Box>
            </AppShell.Section>
            <AppShell.Section my="md">
                <Stack>
                    <Button color={theme.colors.blue[9]} onClick={() => openSelectOptionModal()}>
                        Modify Unlocks
                    </Button>
                    <Button color={theme.colors.red[9]} variant={'filled'} onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button color={theme.colors.green[9]} variant={'filled'} onClick={handleAnalyzeClick}>
                        Analyze Seed
                    </Button>
                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    )
}

function QuickAnalyze() {
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
        <Group align={'flex-end'}>
            <TextInput
                flex={1}
                type="text"
                placeholder="Enter Seed"
                label="Analyze Seed"
                value={seed}
                onChange={(e) => setSeed(e.currentTarget.value)}
                rightSection={select}
                rightSectionWidth={sectionWidth}
            />
            <Button onClick={() => setStart(seed.length >= 8)}> Analyze Seed </Button>
        </Group>

    );

}

export class BuyMetaData {
    location: string;
    locationType: string;
    index: number;
    ante: string;
    blind: string;
    name: string;

    constructor({location, locationType, index, ante, blind, name}: {
        location: string,
        locationType: string,
        index: number,
        ante: string,
        blind: string,
        itemType: string,
        name: string
    }) {
        this.location = location;
        this.locationType = locationType;
        this.index = index;
        this.ante = ante;
        this.blind = blind;
        this.name = name;
    }
}

function QueueCarousel({queue, tabName}: { queue: any[], tabName: string }) {
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const selectedSearchResult = useCardStore(state => state.searchState.selectedSearchResult);
    const [embla, setEmbla] = useState<Embla | null>(null);
    useEffect(() => {
        if (embla && selectedSearchResult) {
            if (selectedSearchResult?.location === GLOBAL_ENUM[SHOP] && selectedSearchResult?.index) {
                embla.scrollTo(selectedSearchResult.index - 1)
            }
        }
    }, [embla, selectedSearchResult])
    return (
        <Paper>
            <Carousel
                getEmblaApi={setEmbla}
                containScroll={'keepSnaps'}
                slideGap={{base: 'sm'}}
                slideSize={{base: 90}}
                withControls={false}
                height={190}
                dragFree
                type={'container'}
            >
                {
                    queue.map((card: any, index: number) => {
                        return (
                            <Carousel.Slide h={190} key={index}>
                                <BuyWrapper
                                    metaData={{
                                        location: GLOBAL_ENUM[SHOP],
                                        locationType: GLOBAL_ENUM[SHOP],
                                        index: index,
                                        ante: tabName,
                                        blind: selectedBlind,
                                        name: card.name
                                    }}
                                >
                                    <GameCard card={card}/>
                                </BuyWrapper>
                            </Carousel.Slide>
                        )
                    })
                }
            </Carousel>
        </Paper>
    )
}

function AntePanel({ante, tabName}: { ante: Ante, tabName: string }) {
    const queue = ante.queue;
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const packs = ante?.blinds?.[selectedBlind]?.packs;

    return (
        <Tabs.Panel w={'100%'} value={tabName}>
            <Paper withBorder h={'100%'} p={'sm'}>
                <Fieldset legend={'Shop'} mb={'sm'}>
                    <QueueCarousel queue={queue} tabName={tabName}/>
                </Fieldset>
                <Grid>
                    <Grid.Col span={{base: 12, lg: 2}}>
                        <Paper h={'100%'} withBorder p={'1rem'}>
                            <Flex h={'100%'} direction={'column'} align={'space-between'}>
                                <Text ta={'center'} c={'dimmed'} fz={'md'}> Voucher </Text>
                                <BuyWrapper>
                                    <Voucher voucherName={ante.voucher}/>
                                </BuyWrapper>
                                <Text ta={'center'} fz={'md'}>  {ante.voucher} </Text>
                            </Flex>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, lg: 10}}>
                        <Accordion w={'100%'} multiple={true} defaultValue={packs.map(({name}) => name)}
                                   variant="separated">
                            {packs.map((pack: Pack, index: number) => (
                                <Accordion.Item key={index} value={pack.name}>
                                    <Accordion.Control>
                                        <Group justify={'space-between'} pr={'md'}>
                                            <Text fw={500}>{pack.name}</Text>
                                            <Badge>{pack.cards?.length || 0} cards</Badge>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>

                                        <SimpleGrid
                                            cols={{base: 4, sm: 5, md: 6, lg: 5}}
                                            spacing="sm"
                                        >
                                            {pack.cards && pack.cards.map((card: any, cardIndex: number) => (
                                                <BuyWrapper
                                                    key={cardIndex}
                                                    bottomOffset={30}
                                                    topOffset={30}
                                                    metaData={
                                                        new BuyMetaData({
                                                            location: pack.name,
                                                            locationType: GLOBAL_ENUM[PACK],
                                                            index: cardIndex,
                                                            ante: tabName,
                                                            blind: selectedBlind,
                                                            itemType: 'card',
                                                            name: card.name
                                                        })
                                                    }
                                                >
                                                    <GameCard card={card}/>
                                                </BuyWrapper>
                                            ))}
                                        </SimpleGrid>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                        {/*<Stack flex={1}>*/}
                        {/*    {*/}
                        {/*        packs &&*/}
                        {/*        packs.map((pack: Pack, index: number) => {*/}
                        {/*            return (*/}
                        {/*                <Fieldset key={index} legend={pack.name}>*/}
                        {/*                    <Group pos={'relative'}>*/}
                        {/*                        {*/}
                        {/*                            pack?.cards &&*/}
                        {/*                            pack.cards.map((card: any, index: number) => {*/}
                        {/*                                return (*/}
                        {/*                                    <BuyWrapper*/}
                        {/*                                        metaData={*/}
                        {/*                                            new BuyMetaData({*/}
                        {/*                                                location: pack.name,*/}
                        {/*                                                locationType: "pack",*/}
                        {/*                                                index: index,*/}
                        {/*                                                ante: tabName,*/}
                        {/*                                                blind: selectedBlind,*/}
                        {/*                                                itemType: 'card'*/}
                        {/*                                            })*/}
                        {/*                                        }*/}
                        {/*                                        bottomOffset={30}*/}
                        {/*                                        topOffset={30}*/}
                        {/*                                        key={index}*/}
                        {/*                                    >*/}
                        {/*                                        <GameCard card={card}/>*/}
                        {/*                                    </BuyWrapper>*/}
                        {/*                                )*/}
                        {/*                            })*/}
                        {/*                        }*/}
                        {/*                    </Group>*/}
                        {/*                </Fieldset>*/}
                        {/*            )*/}
                        {/*        })*/}
                        {/*    }*/}
                        {/*</Stack>*/}
                    </Grid.Col>
                </Grid>


                {/*</Grid.Col>*/}
                {/*</Grid>*/}
            </Paper>
        </Tabs.Panel>
    )
}

function Main({SeedResults}: { SeedResults: Seed | null }) {
    const {width} = useViewportSize();
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const setSelectedAnte = useCardStore(state => state.setSelectedAnte);
    const selectedBlind = useCardStore(state => state.applicationState.selectedBlind);
    const setSelectedBlind = useCardStore(state => state.setSelectedBlind);
    // @ts-ignore
    return (
        <AppShell.Main>
            {
                !SeedResults &&
                <QuickAnalyze/>
            }
            {
                SeedResults &&
                <>
                    <Box>
                        <NativeSelect
                            mb={'sm'}
                            hiddenFrom="sm"
                            value={selectedAnte}
                            onChange={(e) => setSelectedAnte(Number(e.currentTarget.value))}
                            data={Object.keys(SeedResults.antes).map((ante: string) => ({
                                label: `Ante ${ante}`,
                                value: String(ante)
                            }))}
                        />
                        <SegmentedControl
                            value={selectedBlind}
                            onChange={setSelectedBlind}
                            fullWidth
                            radius="xl"
                            size="md"
                            mb={'sm'}
                            data={blinds.map((blind: string, i: number) => ({
                                value: ['smallBlind', 'bigBlind', 'bossBlind'][i],
                                label: <Group justify={'center'}>
                                    {blind}
                                    {i < 2 && <Tag tagName={SeedResults.antes[selectedAnte]?.tags?.[i]}/>}
                                    {i === 2 && <Boss bossName={SeedResults.antes[selectedAnte]?.boss ?? ''}/>}

                                </Group>,
                            }))}
                        />
                    </Box>
                    <Tabs
                        w={'100%'}
                        variant="pills"
                        orientation={"vertical"}
                        defaultValue={'1'}
                        keepMounted={false}
                        value={String(selectedAnte)}
                        onChange={(value) => {
                            setSelectedAnte(Number(value));
                        }}
                    >
                        <Box mah={'65vh'} style={{display: width > 767 ? 'revert' : 'none'}} mr={'2rem'}>
                            <ScrollArea type="scroll" scrollbars={'y'} h={'100%'}>
                                <Tabs.List>
                                    {
                                        Object.keys(SeedResults.antes).map((ante: string) => (
                                            <Tabs.Tab
                                                key={ante}
                                                value={String(ante)}
                                            >
                                                {`Ante ${ante}`}
                                            </Tabs.Tab>
                                        ))
                                    }
                                </Tabs.List>
                            </ScrollArea>
                        </Box>
                        {
                            SeedResults &&
                            Object.entries(SeedResults.antes).map(([ante, anteData]: [string, Ante], i: number) => (
                                <AntePanel key={i} tabName={ante} ante={anteData}/>))
                        }
                    </Tabs>
                </>
            }
        </AppShell.Main>
    )
}

function MiscCardSourcesDisplay({miscSources}: { miscSources?: MiscCardSource[] }) {
    if (!miscSources || Object.keys(miscSources).length === 0) {
        return (
            <Paper p="md" withBorder mb="md">
                <Text c="dimmed" size="sm" ta="center">No miscellaneous card sources available for this ante</Text>
            </Paper>
        );
    }
    const [currentSource, setCurrentSource] = useState('');
    const [embla, setEmbla] = useState<Embla | null>(null);
    useEffect(() => {
        if (!embla) return;
        embla.reInit()
    }, [embla])
    // useAnimationOffsetEffect(embla, 200)
    return (
        <Paper p="md" withBorder mb="md">
            <Title order={3} mb="xs">Card Sources</Title>
            <Accordion onChange={e => setCurrentSource(`${e}`)} variant={'separated'} value={currentSource}>
                {miscSources.map(({name, cards}) => (
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
                                        withControls={true}
                                        height={120}
                                        dragFree
                                    >
                                        {cards?.map((card, i) => (
                                            <Carousel.Slide key={i}>
                                                <GameCard card={card}/>
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

function PurchaseTimeline({buys}: { buys: { [key: string]: BuyMetaData } }) {
    const buyEntries = Object.entries(buys);
    const removeBuy = useCardStore(state => state.removeBuy);

    if (buyEntries.length === 0) {
        return (
            <Paper p="md" withBorder>
                <Text c="dimmed" size="sm" ta="center">No purchases yet</Text>
            </Paper>
        );
    }

    return (
        <Paper p="md" withBorder>
            <Title order={3} mb="md">Purchase History</Title>
            <Timeline active={buyEntries.length - 1} bulletSize={24} lineWidth={2}>
                {buyEntries.map(([key, buyData]) => {
                    // Parse the key to extract information
                    const [, , index] = key.split('-');
                    // console.log(buyData)
                    return (
                        <Timeline.Item
                            key={key}
                            bullet={<IconJoker size={12}/>}
                            title={
                                <Group justify="space-between" wrap="nowrap">
                                    <Text size="sm" fw={500}>
                                        {buyData.name}
                                    </Text>
                                    <ActionIcon
                                        size="sm"
                                        color="red"
                                        variant="subtle"
                                        onClick={() => removeBuy(buyData)}
                                        title="Return item"
                                    >
                                        <IconShoppingCartOff size={48}/>
                                    </ActionIcon>
                                </Group>
                            }
                        >
                            <Text></Text>
                            <Text size="xs" c="dimmed" mt={4}>
                                {buyData.locationType === "pack" ?
                                    `${buyData.location} - Card ${Number(index) + 1}` :
                                    `Shop Item ${Number(index) + 1}`}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {toHeaderCase(buyData.blind)}
                            </Text>
                            <Badge size="xs" variant="light" color="blue" mt={4}>
                                Ante {buyData.ante}
                            </Badge>
                        </Timeline.Item>
                    );
                })}
            </Timeline>

            <Group justify="space-between" mt="md">
                <Text size="sm" fw={500}>Total Purchases:</Text>
                <Badge size="lg">{buyEntries.length}</Badge>
            </Group>
        </Paper>
    );
}

function Aside({SeedResults}: { SeedResults: Seed | null }) {
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const anteData = SeedResults?.antes[selectedAnte];
    const miscSources = anteData?.miscCardSources;
    const buys = useCardStore(state => state.shoppingState.buys);
    const theme = useMantineTheme();
    const [tab, setTab] = useState('sources');

    return (
        <AppShell.Aside p="md">
            <AppShell.Section>
                <Tabs value={tab} onChange={(e) => setTab(`${e}`)}>
                    <Tabs.List grow mb="md">
                        <Tabs.Tab
                            value="sources"
                            leftSection={<IconCards size={16}/>}
                        >
                            Card Sources
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="purchases"
                            leftSection={<IconShoppingCart size={16}/>}
                            rightSection={
                                <Badge size="xs" circle variant="filled" color={theme.colors.blue[7]}>
                                    {Object.keys(buys).length}
                                </Badge>
                            }
                        >
                            Purchases
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </AppShell.Section>
            <AppShell.Section component={ScrollArea} scrollbars="y">
                <Tabs value={tab}>
                    <Tabs.Panel value="sources">
                        {SeedResults ? (
                            <MiscCardSourcesDisplay miscSources={miscSources}/>
                        ) : (
                            <Center h={200}>
                                <Text c="dimmed">Select a seed to view card sources</Text>
                            </Center>
                        )}
                    </Tabs.Panel>
                    <Tabs.Panel value="purchases">
                        <PurchaseTimeline buys={buys}/>
                    </Tabs.Panel>
                </Tabs>
            </AppShell.Section>
        </AppShell.Aside>
    )
}

function Footer() {
    return (
        <AppShell.Footer>
            <Text ta={'center'} fz={'xs'}>
                Made with Mantine, Vite, Zustand, Immolate.
            </Text>
            <Text ta={'center'} fz={'xs'}>
                Made by Michael Walker 2025
            </Text>
        </AppShell.Footer>
    )
}

function Blueprint({SeedResults}: { SeedResults: Seed | null }) {
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const outputOpened = useCardStore(state => state.applicationState.asideOpen);
    return (
        <AppShell
            header={{height: {base: 60, md: 70, lg: 80}}}
            aside={{
                width: {base: 200, md: 300, lg: 550},
                breakpoint: 'md',
                collapsed: {desktop: !outputOpened, mobile: !outputOpened}
            }}
            navbar={{
                width: {base: 200, md: 300, lg: 400},
                breakpoint: 'sm',
                collapsed: {desktop: !settingsOpened, mobile: settingsOpened},
            }}
            padding="md"
        >
            <Header SeedResults={SeedResults}/>
            <NavBar/>
            <Main SeedResults={SeedResults}/>
            <Aside SeedResults={SeedResults}/>
            <Footer/>
        </AppShell>
    )
}

export interface AnalyzeOptions {
    showCardSpoilers: boolean,
    buys: { [key: string]: BuyMetaData },
    sells: { [key: string]: BuyMetaData },
    updates: { [key: string]: any }[]
}

export default function App() {
    const analyzeState = useCardStore(state => state.immolateState);
    const {seed, deck, stake, showmanOwned, gameVersion: version, antes, cardsPerAnte} = analyzeState;

    const start = useCardStore(state => state.applicationState.start);
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const SeedResults = useMemo(() => {
            if (seed.length < 6 || !start) return null;
            const engine = new ImmolateClassic(seed);
            engine.InstParams(deck, stake, showmanOwned, version);
            engine.initLocks(1, false, true);
            const analyzer: CardEngineWrapper = new CardEngineWrapper(engine);
            const transactions = {buys, sells}

            const options: { buys: any; sells: any; showCardSpoilers: any, updates: any } = {
                showCardSpoilers,
                updates: [],
                ...transactions
            };

            let results = analyzer.analyzeSeed(antes, cardsPerAnte, options);
            engine.delete();
            return results;
        },
        [analyzeState, start, buys, showCardSpoilers]
    );


    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Blueprint SeedResults={SeedResults}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
