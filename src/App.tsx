import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {
    ActionIcon, AppShell,
    AspectRatio,
    Badge,
    Box,
    Button,
    Card,
    Center,
    Collapse,
    Container, Divider, Fieldset,
    Flex, Grid,
    Group, List,
    MantineProvider, Paper, ScrollArea,
    SimpleGrid, Spoiler, TableOfContents,
    Text, TextInput, Title
} from "@mantine/core";
import {theme} from "./theme.js";
import {create} from "zustand";
import {combine, devtools, persist} from "zustand/middleware";
import {ImmolateClassic} from "./modules/ImmolateWrapper/CardEngines/immolateClassic.ts";
import {CardEngineWrapper} from "./modules/ImmolateWrapper";
//@ts-ignore
import {editionMap, jokerFaces, jokers, stickerMap, tarotsAndPlanets, vouchers} from "./modules/const.js"
//@ts-ignore
import {getModifierColor, getSealPosition, getStandardCardPosition} from "./modules/utils.js";
import {useEffect, useMemo, useRef, useState} from "react";
import {
    Ante,
    Card_Final,
    Joker_Final,
    Planet_Final, Seed,
    Spectral_Final,
    StandardCard_Final, Tarot_Final
} from "./modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useElementSize, useHover, useMergedRef, useMouse, useResizeObserver} from "@mantine/hooks";
import {IconExternalLink, IconShoppingCartCheck} from "@tabler/icons-react";
import {Carousel} from "@mantine/carousel";
import {immer} from 'zustand/middleware/immer'


const globalImageCache = new Map<string, HTMLImageElement>();

const initialState: any = {
    immolateState: {
        seed: '15IBIXCA',
        deck: 'Ghost Deck',
        cardsPerAnte: 50,
        antes: 8,
        deckType: 'Ghost Deck',
        stake: 'Gold Stake',
        showmanOwned: false,
        gameVersion: '10106',
    },
    applicationState: {
        settingsOpen: false,
        asideOpen: false,
        showCardSpoilers: false,
        selectedAnte: 1,
        selectedBlind: 'Small Blind',
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

const useCardStore = create(
    devtools(
        persist(
            immer(
                combine(
                    initialState,
                    (set, get) => ({
                        setSeed: (seed: string) => set((prev) => {
                            prev.immolateState.seed = seed
                        }, undefined, 'Global/SetSeed'),
                        reset: () => set(initialState, undefined, 'Global/Reset'),
                    })
                )
            ),
            {
                name: 'blueprint-store',
                version: 1,
            }
        )
    )
)

function useSeedAnalyzer(): { analyzer: CardEngineWrapper, engine: ImmolateClassic } {
    const seed = useCardStore((state) => state.immolateState.seed);
    const deck = useCardStore((state) => state.immolateState.deck);
    const stake = useCardStore((state) => state.immolateState.stake);
    const showmanOwned = useCardStore((state) => state.immolateState.showmanOwned);
    const version = useCardStore((state) => state.immolateState.gameVersion);

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

interface RenderCanvasProps {
    layers: any[],
    invert?: boolean,
    spacing?: boolean
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

function Header() {
    return (
        <AppShell.Header></AppShell.Header>
    )
}

function NavBar() {
    return (
        <AppShell.Navbar></AppShell.Navbar>
    )
}

function Main() {
    return (
        <AppShell.Main></AppShell.Main>
    )
}

function Aside() {
    return (
        <AppShell.Aside></AppShell.Aside>
    )
}

function Footer() {
    return (
        <AppShell.Footer></AppShell.Footer>
    )
}

function Blueprint({}) {
    return (
        <AppShell>
            <Header/>
            <NavBar/>
            <Main/>
            <Aside/>
            <Footer/>
        </AppShell>
    )
}

export default function App() {
    const analyzeState = useCardStore(state => state.immolateState);
    const {seed, deck, stake, showmanOwned, gameVersion:version, antes, cardsPerAnte} = analyzeState;
    const engine = new ImmolateClassic(seed);
    engine.InstParams(deck, stake, showmanOwned, version);
    engine.initLocks(1, false, true);
    const analyzer: CardEngineWrapper = new CardEngineWrapper(engine);
    const SeedResults = useMemo(() => {
        return analyzer.analyzeSeed(antes,cardsPerAnte)
    }, [analyzeState]);
    console.log(
        SeedResults
    )
    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>

        </MantineProvider>
    );
}
