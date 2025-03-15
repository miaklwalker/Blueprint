import {
    Joker_Final,
    Planet_Final,
    Spectral_Final,
    StandardCard_Final, Tarot_Final
} from "../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {consumablesFaces, editionMap, jokerFaces, jokers, stickerMap, tarotsAndPlanets} from "../../modules/const.ts";
import {Layer} from "../../modules/classes/Layer.ts";
import {getEnhancerPosition, getSealPosition, getStandardCardPosition} from "../../modules/utils.ts";
import {Paper} from "@mantine/core";
import {RenderImagesWithCanvas} from "./canvasRenderer.tsx";


export function JokerCard({card}: { card: Joker_Final }) {
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
export function PlayingCard({card}: { card: StandardCard_Final }) {
    if(!card?.rank || !card?.suit) return null;
    const position = getStandardCardPosition(card.rank, card.suit);
    //getEnhancerPosition
    const background = getEnhancerPosition([card?.enhancements ?? '']);
    let layers = [
        new Layer({
            pos: background,
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
export function Consumables({card}: { card: Planet_Final | Spectral_Final | Tarot_Final }) {
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
export interface GameCardProps {
    card: Planet_Final | Spectral_Final | Tarot_Final | Joker_Final | StandardCard_Final
}
export function GameCard({card}: GameCardProps) {
    let Card = () => {
        if (card instanceof StandardCard_Final) {
            return <PlayingCard card={card}/>
        }
        else if (card instanceof Joker_Final) {
            return <JokerCard card={card}/>
        }
        else {
            return <Consumables card={card}/>
        }
    }
    return (
        <Paper maw={'71px'}>
            <Card/>
            </Paper>
    )
}
